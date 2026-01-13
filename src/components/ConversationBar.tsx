import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Keyboard, Phone, ChevronDown, MessageSquare, FileText, Loader2 } from 'lucide-react';
import { audioStreamingService } from '../lib/audioStreamingService';
import { useWidget } from '../contexts/WidgetContext';
import NotesEditor from './NotesEditor';
import SessionSelector from './SessionSelector';
import PatientSelector from './PatientSelector';
import Toast from './ui/Toast';
import { AnimatePresence } from 'framer-motion';

interface ConversationBarProps {
    onExpand?: () => void;
}

const ConversationBar: React.FC<ConversationBarProps> = ({
    onExpand
}) => {
    const {
        isConnected,
        isRecording,
        isMuted,
        isConnecting,
        themeColor,
        backgroundColor,
        textColor,
        agentName,
        isExpanded,
        endCall,
        toggleRecording,
        setIsMuted,
        setExpanded,
        transcript,
        isLoadingTranscript,
        existingNotes,
        currentNoteId,
        fetchNoteDetails,
        isSessionSwitching,
        notification,
        clearNotification,
        isWaitingForMediaStream,
        isDemoMode
    } = useWidget();

    const [visualizerData, setVisualizerData] = useState<number[]>(new Array(30).fill(0));
    const [activeTab, setActiveTab] = useState<string>('transcript');
    const rafRef = useRef<number | null>(null);
    const transcriptEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (activeTab === 'transcript') {
            transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [transcript, activeTab]);

    const activeNoteTitle = 'Notes';

    useEffect(() => {
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    useEffect(() => {
        if (isRecording && !isMuted) {
            const updateVisualizer = () => {
                if (isDemoMode) {
                    // Simulated visualizer for demo
                    const newData = Array.from({ length: 30 }, () => Math.random() * 0.8 + 0.1);
                    setVisualizerData(newData);
                    rafRef.current = requestAnimationFrame(() => {
                        // Slow down update for demo
                        setTimeout(updateVisualizer, 80);
                    });
                } else {
                    const analyser = (audioStreamingService as any).getAnalyser();
                    if (analyser) {
                        const dataArray = new Uint8Array(analyser.frequencyBinCount);
                        analyser.getByteFrequencyData(dataArray);

                        const step = Math.floor(dataArray.length / 30);
                        const newData = [];
                        for (let i = 0; i < 30; i++) {
                            newData.push(dataArray[i * step] / 255);
                        }
                        setVisualizerData(newData);
                    }
                    rafRef.current = requestAnimationFrame(updateVisualizer);
                }
            };
            updateVisualizer();
        } else {
            setVisualizerData(new Array(30).fill(0));
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        }
    }, [isRecording, isMuted, isDemoMode]);

    const handleToggleConnection = async () => {
        if (isConnected || isRecording) {
            endCall();
        } else {
            await toggleRecording();
        }
    };

    return (
        <div className="flex flex-col items-center">
            {!isExpanded ? (
                /* Collapsed State: Pill Bar */
                <div
                    className="rounded-2xl border shadow-2xl p-2 flex items-center gap-3 sm:gap-6 w-full sm:w-auto sm:min-w-[400px]"
                    style={{
                        backgroundColor: backgroundColor,
                        borderColor: backgroundColor === '#ffffff' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.05)'
                    }}
                >
                    <div
                        className="px-3 sm:px-5 py-3 rounded-xl flex-1 ml-1 flex items-center justify-center min-h-[44px]"
                        style={{ backgroundColor: backgroundColor === '#ffffff' ? 'rgba(0,0,0,0.05)' : 'rgba(0,0,0,0.1)' }}
                    >
                        {isConnected ? (
                            <div className="flex items-center gap-1.5 h-4">
                                {visualizerData.slice(0, 15).map((v, i) => (
                                    <div
                                        key={i}
                                        className="w-[3px] rounded-full transition-all duration-75"
                                        style={{
                                            backgroundColor: themeColor,
                                            height: `${Math.max(4, v * 100)}%`,
                                            opacity: 0.3 + (v * 0.7),
                                        }}
                                    />
                                ))}
                            </div>
                        ) : (
                            <span
                                className="font-semibold text-sm tracking-tight"
                                style={{ color: textColor }}
                            >
                                {agentName || 'Clinisage Widget'}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4 pr-2 sm:pr-3">
                        <IconButton
                            icon={isMuted ? <MicOff className="w-5 h-5 text-red-400" /> : <Mic className="w-5 h-5" />}
                            onClick={() => {
                                if (isRecording) {
                                    setIsMuted(!isMuted);
                                }
                            }}
                            active={isRecording && !isMuted}
                            color={isMuted ? '#f87171' : themeColor}
                            disabled={!isRecording}
                        />
                        <IconButton
                            icon={<Keyboard className="w-5 h-5" />}
                            onClick={() => {
                                setExpanded(true);
                                onExpand?.();
                            }}
                        />
                        <div className="hidden sm:block w-px h-6 mx-1" style={{ backgroundColor: backgroundColor === '#ffffff' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)' }} />
                        <button
                            onClick={handleToggleConnection}
                            disabled={isConnecting}
                            className={`p-3 sm:p-2.5 rounded-full transition-all cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center ${isConnecting ? 'opacity-50' : ''} ${isConnected || isRecording ? 'bg-red-500 text-white shadow-lg shadow-red-500/20 hover:bg-red-600' : (backgroundColor === '#ffffff' ? 'bg-black/5 text-black hover:bg-black/10' : 'bg-white/5 text-white hover:bg-white/10')}`}
                        >
                            <Phone className={`w-5 h-5 ${isConnected || isRecording ? 'rotate-[135deg]' : ''}`} />
                        </button>
                    </div>
                </div>
            ) : (
                /* Expanded State: Input + Controls */
                <div
                    className="rounded-3xl border shadow-2xl w-full sm:w-[400px] flex flex-col overflow-hidden transition-all duration-300"
                    style={{
                        backgroundColor: backgroundColor,
                        borderColor: backgroundColor === '#ffffff' ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.05)',
                        height: 'min(480px, calc(100vh - 2rem))'
                    }}
                >
                    {/* Notification Toast */}
                    <AnimatePresence>
                        {notification && (
                            <div className="absolute top-2 left-2 right-2 z-50">
                                <Toast
                                    message={notification.message}
                                    type={notification.type}
                                    onClose={clearNotification}
                                    backgroundColor={backgroundColor}
                                    textColor={textColor}
                                />
                            </div>

                        )}
                    </AnimatePresence>

                    {/* Expanded Header: Session & Patient selectors */}
                    <div className="p-2 border-b flex flex-col sm:flex-row items-stretch sm:items-center gap-2" style={{ borderColor: backgroundColor === '#ffffff' ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.04)' }}>
                        <div className="flex-1 min-w-0">
                            <SessionSelector />
                        </div>
                        <div className="shrink-0 w-full sm:w-auto">
                            <PatientSelector />
                        </div>
                    </div>

                    {/* Tab Switcher */}
                    <div className="flex items-center gap-1 p-1 px-3 border-b"
                        style={{ borderColor: backgroundColor === '#ffffff' ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.04)' }}>
                        <button
                            onClick={() => setActiveTab('transcript')}
                            className="flex items-center justify-center gap-1.5 sm:gap-2 py-1.5 px-3 sm:px-4 rounded-lg text-[10px] sm:text-[11px] font-bold transition-all whitespace-nowrap shrink-0"
                            style={{
                                backgroundColor: activeTab === 'transcript'
                                    ? (backgroundColor === '#ffffff' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)')
                                    : 'transparent',
                                color: activeTab === 'transcript' ? textColor : (backgroundColor === '#ffffff' ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)')
                            }}
                        >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Transcript</span>
                            <span className="sm:hidden">Text</span>
                        </button>

                        <button
                            onClick={() => {
                                setActiveTab('notes');
                                // If no note is selected but some exist, pick the latest one
                                if (!currentNoteId && existingNotes.length > 0) {
                                    const latestNote = existingNotes[existingNotes.length - 1];
                                    fetchNoteDetails(latestNote.id);
                                }
                            }}
                            className="flex items-center justify-center gap-1.5 sm:gap-2 py-1.5 px-3 sm:px-4 rounded-lg text-[10px] sm:text-[11px] font-bold transition-all whitespace-nowrap shrink-0"
                            style={{
                                backgroundColor: activeTab === 'notes'
                                    ? (backgroundColor === '#ffffff' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)')
                                    : 'transparent',
                                color: activeTab === 'notes' ? textColor : (backgroundColor === '#ffffff' ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)')
                            }}
                        >
                            <FileText className="w-3.5 h-3.5" />
                            {activeNoteTitle}
                        </button>
                    </div>

                    {/* Content Area */}
                    <div
                        className="flex-1 relative rounded-xl m-1 mb-2"
                        style={{ backgroundColor: backgroundColor === '#ffffff' ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.05)' }}
                    >
                        {/* Media Streaming Loading Overlay */}
                        {isWaitingForMediaStream && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-slate-400 z-30 backdrop-blur-sm"
                                style={{ backgroundColor: backgroundColor === '#ffffff' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.5)' }}>
                                <Loader2 className="w-6 h-6 animate-spin" style={{ color: themeColor }} />
                                <p className="text-[11px] font-bold uppercase tracking-widest">Initializing Media Stream...</p>
                            </div>
                        )}

                        {isSessionSwitching ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-slate-400 z-20">
                                <Loader2 className="w-5 h-5 animate-spin text-sky-500" />
                                <p className="text-[11px] font-bold uppercase tracking-widest">Switching Session...</p>
                            </div>
                        ) : (
                            <>
                                {/* Transcript View */}
                                <div
                                    className={`absolute inset-0 p-4 overflow-y-auto scrollbar-hide transition-opacity duration-300 ${activeTab === 'transcript' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
                                >
                                    <div className="flex flex-col h-full">
                                        <div className="flex-1">
                                            {isLoadingTranscript ? (
                                                <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-400">
                                                    <Loader2 className="w-5 h-5 animate-spin text-sky-500" />
                                                    <p className="text-[11px] font-bold uppercase tracking-widest">Loading...</p>
                                                </div>
                                            ) : transcript ? (
                                                <p className="text-[14px] leading-relaxed whitespace-pre-wrap" style={{ color: textColor }}>
                                                    {transcript}
                                                    <div ref={transcriptEndRef} />
                                                </p>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center h-full gap-2">
                                                    <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center">
                                                        <MessageSquare className="w-5 h-5 text-slate-300" />
                                                    </div>
                                                    <span className="text-[11px] font-bold uppercase tracking-widest opacity-30" style={{ color: textColor }}>
                                                        {isConnected ? 'Listening...' : 'No transcript yet'}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Redundant action bar removed as requested */}
                                    </div>
                                </div>

                                {/* Notes View */}
                                <div className={`absolute inset-0 transition-opacity duration-300 ${activeTab === 'notes' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
                                    {activeTab === 'notes' && <NotesEditor isVisible={true} />}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Bottom Controls Area */}
                    <div className="flex items-center justify-between p-3 px-4 pt-0">
                        <div
                            className="px-3 sm:px-4 py-2.5 rounded-xl flex items-center gap-1.5 flex-grow max-w-[120px] sm:max-w-[180px] h-[40px] justify-center overflow-hidden"
                            style={{ backgroundColor: backgroundColor === '#ffffff' ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.05)' }}
                        >
                            {(isConnected || isRecording) ? (
                                <div className="flex items-center gap-1 h-full">
                                    {visualizerData.slice(0, 15).map((v, i) => (
                                        <div
                                            key={i}
                                            className="w-[3px] rounded-full transition-all duration-75"
                                            style={{
                                                backgroundColor: themeColor,
                                                height: `${Math.max(4, v * 100)}%`,
                                                opacity: 0.3 + (v * 0.7),
                                            }}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] truncate">
                                    {agentName}
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <IconButton
                                icon={isMuted ? <MicOff className="w-5 h-5 text-red-400" /> : <Mic className="w-5 h-5" />}
                                onClick={() => {
                                    if (isRecording) {
                                        setIsMuted(!isMuted);
                                    }
                                }}
                                active={isRecording && !isMuted}
                                color={isMuted ? '#f87171' : themeColor}
                                disabled={!isRecording}
                            />
                            <IconButton icon={<ChevronDown className="w-5 h-5" />} onClick={() => setExpanded(false)} />

                            <button
                                onClick={handleToggleConnection}
                                disabled={isConnecting}
                                className={`p-3 sm:p-2.5 rounded-full transition-all cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center ${isConnecting ? 'opacity-50' : ''} ${isConnected || isRecording ? 'bg-red-500 text-white shadow-lg shadow-red-500/20 hover:bg-red-600' : (backgroundColor === '#ffffff' ? 'bg-black/5 text-black hover:bg-black/10' : 'bg-white/5 text-white hover:bg-white/10')}`}
                            >
                                <Phone className={`w-5 h-5 ${isConnected || isRecording ? 'rotate-[135deg]' : ''}`} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const IconButton = ({ icon, onClick, active, color, disabled }: { icon: React.ReactNode, onClick: () => void, active?: boolean, color?: string, disabled?: boolean }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`p-2.5 rounded-lg transition-all cursor-pointer ${disabled ? 'opacity-20 grayscale cursor-not-allowed' : ''}`}
        style={{
            color: active ? (color || 'white') : 'rgba(148, 163, 184, 0.8)',
            backgroundColor: active ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
        }}
    >
        {icon}
    </button>
);

export default ConversationBar;
