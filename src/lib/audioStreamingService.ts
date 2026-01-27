import { CookieUtils } from './cookieUtils';
import { BACKEND_URL, getWebSocketUrl } from './constants';

const LINEAR16_PLAYER_CODE = `
class Linear16Player extends AudioWorkletProcessor {
  constructor() {
    super();
    this.chunkQueue = [];
    this.currentChunkOffset = 0;

    this.port.onmessage = (event) => {
      if (!event.data) return;

      // Stop command
      if (event.data.command === "stop") {
        this.chunkQueue = [];
        this.currentChunkOffset = 0;
        return;
      }

      // Add new PCM16 chunk to queue
      this.chunkQueue.push(event.data);
    };
  }

  process(inputs, outputs) {
    const output = outputs[0];
    const channel = output[0];

    for (let i = 0; i < channel.length; i++) {
      // If no data left, output silence
      if (this.chunkQueue.length === 0) {
        channel[i] = 0;
        continue;
      }

      const currentChunk = this.chunkQueue[0];

      // Output sample (normalized to [-1, 1])
      channel[i] = currentChunk[this.currentChunkOffset] / 32768;

      this.currentChunkOffset++;

      // If finished current chunk, move to next
      if (this.currentChunkOffset >= currentChunk.length) {
        this.chunkQueue.shift();
        this.currentChunkOffset = 0;
      }
    }

    return true;
  }
}

try {
  registerProcessor("linear16-player", Linear16Player);
} catch (error) {
  // Ignore if already registered
}
`;

const MIC_PROCESSOR_CODE = `
class MicProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.targetSampleRate = 16000;
    this.bufferSize = 640; // 40ms at 16kHz
    this.buffer = new Int16Array(this.bufferSize);
    this.bufferIndex = 0;

    // For downsampling
    this.remainder = 0;
  }

  process(inputs) {
    const input = inputs[0];
    if (!input || !input[0]) return true;

    const channelData = input[0]; // Float32Array
    const inputSampleRate = sampleRate; // Global variable in AudioWorklet scope

    // Calculate downsampling ratio
    const ratio = inputSampleRate / this.targetSampleRate;

    // Simple downsampling
    for (let i = 0; i < channelData.length; i++) {
      this.remainder += 1;

      if (this.remainder >= ratio) {
        this.remainder -= ratio;

        // Process this sample
        const sample = Math.max(-1, Math.min(1, channelData[i]));

        if (this.bufferIndex < this.bufferSize) {
          this.buffer[this.bufferIndex++] = sample * 32767;
        }

        // Flush buffer when full
        if (this.bufferIndex >= this.bufferSize) {
          const bufferToSend = this.buffer.slice(0);
          this.port.postMessage(bufferToSend.buffer);
          this.bufferIndex = 0;
        }
      }
    }

    return true;
  }
}

try {
  registerProcessor("mic-processor", MicProcessor);
} catch (error) {
  // Ignore if already registered
}
`;

export interface AudioStreamingService {
    connect(sessionId: string, language?: string): Promise<void>;
    disconnect(): void;
    startRecording(): Promise<void>;
    stopRecording(): void;
    mute(): void;
    unmute(): void;
    isConnected(): boolean;
    isRecording(): boolean;
    isMuted(): boolean;
    hasRateLimitExceeded(): boolean;
    resetRateLimit(): void;
    hasPendingTimeout(): boolean;
    onTranscriptionReceived?: (text: string) => void;
    onConnectionStateChange?: (connected: boolean, reason?: string) => void;
    setOnStatusMessage?: (callback: (message: any) => void) => void;
    setOnMediaStreamingStarted?: (callback: () => void) => void;
}

class AudioStreamingServiceImpl implements AudioStreamingService {
    private websocket: WebSocket | null = null;
    private audioContext: AudioContext | null = null;
    private mediaStream: MediaStream | null = null;
    private micNode: AudioWorkletNode | null = null;
    private playerNode: AudioWorkletNode | null = null;
    private sourceNode: MediaStreamAudioSourceNode | null = null;
    private analyser: AnalyserNode | null = null;
    private isRecordingState = false;
    private isMutedState = false;

    private isRateLimited = false;
    private disconnectTimeoutId: NodeJS.Timeout | null = null;
    private areModulesLoaded = false;
    private isStarting = false;
    public onTranscriptionReceived?: (text: string) => void;
    private onConnectionStateChangeCallback: ((connected: boolean, reason?: string) => void) | null = null;
    private onStatusMessageCallback: ((message: any) => void) | null = null;
    private onMediaStreamingStartedCallback: (() => void) | null = null;

    async connect(sessionId: string, language: string = 'English'): Promise<void> {
        if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
            return;
        }

        if (this.isRateLimited) {
            throw new Error('Rate limit exceeded. Please wait before trying to connect again.');
        }

        this.clearDisconnectTimeout();


        const key = CookieUtils.getApiKeyWithDefault();

        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
                latencyHint: 'interactive'
            });
            this.areModulesLoaded = false;
        }

        if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }

        if (!this.areModulesLoaded) {
            try {
                await this.audioContext.audioWorklet.addModule(
                    URL.createObjectURL(new Blob([MIC_PROCESSOR_CODE], { type: 'application/javascript' }))
                );
                await this.audioContext.audioWorklet.addModule(
                    URL.createObjectURL(new Blob([LINEAR16_PLAYER_CODE], { type: 'application/javascript' }))
                );
                this.areModulesLoaded = true;
            } catch (error) {
                console.error('Failed to load AudioWorklet modules:', error);
                throw new Error('Failed to initialize audio processing');
            }
        }

        this.playerNode = new AudioWorkletNode(this.audioContext, 'linear16-player');
        this.playerNode.connect(this.audioContext.destination);

        const wsUrl = getWebSocketUrl(BACKEND_URL, `/api/call/web-media-stream?session_id=${encodeURIComponent(sessionId)}&api_key=${encodeURIComponent(key)}&language=${encodeURIComponent(language)}`);

        this.websocket = new WebSocket(wsUrl);
        this.websocket.binaryType = 'arraybuffer';

        return new Promise((resolve, reject) => {
            if (!this.websocket) {
                reject(new Error('Failed to create WebSocket'));
                return;
            }

            const timeout = setTimeout(() => {
                if (this.websocket) {
                    this.websocket.close();
                }
                reject(new Error('WebSocket connection timeout'));
            }, 10000);

            this.websocket.onopen = () => {
                clearTimeout(timeout);
                this.notifyConnectionStateChange(true, 'Connected');
                resolve();
            };

            this.websocket.onmessage = (event) => {
                if (event.data instanceof ArrayBuffer) {
                    if (this.playerNode) {
                        this.playerNode.port.postMessage(new Int16Array(event.data));
                    }
                } else {
                    try {
                        const data = JSON.parse(event.data);
                        if (data.type === 'transcription' && data.text) {
                            if (this.onTranscriptionReceived) {
                                this.onTranscriptionReceived(data.text);
                            }
                        } else if (data.type === 'status') {
                            if (data.message === 'connected') {
                                this.notifyConnectionStateChange(true, 'Connected to backend');
                            } else if (this.onStatusMessageCallback) {
                                this.onStatusMessageCallback(data);
                            }
                        } else if (data.event_type === 'start_media_streaming') {
                            if (this.onMediaStreamingStartedCallback) {
                                this.onMediaStreamingStartedCallback();
                            }
                        }
                    } catch (error) { }
                }
            };

            this.websocket.onerror = () => {
                clearTimeout(timeout);
                this.cleanup();
                this.notifyConnectionStateChange(false, 'Error');
                reject(new Error('Failed to connect to WebSocket'));
            };

            this.websocket.onclose = (event) => {
                clearTimeout(timeout);

                if (event.code === 1008) {
                    this.isRateLimited = true;
                    this.clearDisconnectTimeout();
                }

                this.cleanup();
                this.websocket = null;
                this.notifyConnectionStateChange(false, event.reason || 'Disconnected');
            };
        });
    }

    disconnect(): void {
        if (this.websocket) {
            this.websocket.close(1000, 'Recording stopped by user');
            this.websocket = null;
        }
        this.cleanup();
    }

    async startRecording(): Promise<void> {
        if (!this.websocket || this.websocket.readyState !== WebSocket.OPEN) {
            throw new Error('WebSocket not connected');
        }

        if (!this.audioContext) {
            throw new Error('AudioContext not initialized');
        }

        if (this.isRecordingState || this.isStarting) {
            return;
        }

        this.isStarting = true;

        try {
            this.stopRecording();
            this.clearDisconnectTimeout();

            this.mediaStream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    channelCount: 1,
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            });

            this.sourceNode = this.audioContext.createMediaStreamSource(this.mediaStream);

            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 256;
            this.sourceNode.connect(this.analyser);

            this.micNode = new AudioWorkletNode(this.audioContext, 'mic-processor');

            this.micNode.port.onmessage = (event) => {
                if (this.websocket && this.websocket.readyState === WebSocket.OPEN && this.isRecordingState && !this.isMutedState) {
                    this.websocket.send(event.data);
                }
            };

            this.sourceNode.connect(this.micNode);
            this.isRecordingState = true;
            this.isMutedState = false;

        } catch (error) {
            throw error;
        } finally {
            this.isStarting = false;
        }
    }

    stopRecording(): void {
        this.isRecordingState = false;

        if (this.micNode) {
            if (this.sourceNode) {
                this.sourceNode.disconnect(this.micNode);
            }
            this.micNode.disconnect();
            this.micNode = null;
        }

        if (this.sourceNode) {
            this.sourceNode.disconnect();
            this.sourceNode = null;
        }

        if (this.analyser) {
            this.analyser.disconnect();
            this.analyser = null;
        }

        if (this.mediaStream) {
            this.mediaStream.getTracks().forEach(track => track.stop());
            this.mediaStream = null;
        }
    }

    mute(): void {
        this.isMutedState = true;
    }

    unmute(): void {
        this.isMutedState = false;
    }

    isConnected(): boolean {
        return this.websocket !== null && this.websocket.readyState === WebSocket.OPEN;
    }

    isRecording(): boolean {
        return this.isRecordingState;
    }

    isMuted(): boolean {
        return this.isMutedState;
    }

    hasRateLimitExceeded(): boolean {
        return this.isRateLimited;
    }

    resetRateLimit(): void {
        this.isRateLimited = false;
    }

    hasPendingTimeout(): boolean {
        return this.disconnectTimeoutId !== null;
    }

    private clearDisconnectTimeout(): void {
        if (this.disconnectTimeoutId) {
            clearTimeout(this.disconnectTimeoutId);
            this.disconnectTimeoutId = null;
        }
    }

    getAnalyser(): AnalyserNode | null {
        return this.analyser;
    }

    private cleanup(): void {
        this.stopRecording();

        if (this.audioContext && this.audioContext.state !== 'closed') {
            this.audioContext.close();
        }
        this.audioContext = null;
        this.playerNode = null;
        this.micNode = null;
        this.areModulesLoaded = false;

        this.isMutedState = false;
        this.isRateLimited = false;
        this.clearDisconnectTimeout();
    }

    setOnConnectionStateChange(callback: (connected: boolean, reason?: string) => void): void {
        this.onConnectionStateChangeCallback = callback;
    }

    setOnStatusMessage(callback: (message: any) => void): void {
        this.onStatusMessageCallback = callback;
    }

    setOnMediaStreamingStarted(callback: () => void): void {
        this.onMediaStreamingStartedCallback = callback;
    }

    private notifyConnectionStateChange(connected: boolean, reason?: string): void {
        if (this.onConnectionStateChangeCallback) {
            this.onConnectionStateChangeCallback(connected, reason);
        }
    }
}

export const audioStreamingService = new AudioStreamingServiceImpl(); 
