import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { audioStreamingService } from '../lib/audioStreamingService';
import { sessionApi } from '../lib/sessionApi';
import type { Session } from '../lib/sessionApi';
import { noteApi } from '../lib/noteApi';
import type { NoteOut } from '../lib/noteApi';
import { templateApi } from '../lib/templateApi';
import { transcriptApi } from '../lib/transcriptApi';
import { patientApi } from '../lib/patientApi';
import type { Patient } from '../lib/patientApi';
import { CookieUtils } from '../lib/cookieUtils';
import { DEFAULT_TEST_API_KEY } from '../lib/constants';

export type WidgetPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';

// NoteTemplate is kept for compatibility with UI, but maps to Template
export interface NoteTemplate {
    id: string;
    title: string;
    description: string;
    icon?: string;
}

interface WidgetState {
    currentSession: Session | null;
    transcript: string;
    notes: string;
    isRecording: boolean;
    isConnected: boolean;
    isConnecting: boolean;
    isMuted: boolean;
    isExpanded: boolean;
    themeColor: string;
    backgroundColor: string;
    textColor: string;
    agentName: string;
    position: WidgetPosition;
    templates: NoteTemplate[];
    selectedTemplateId: string | null;
    existingNotes: NoteOut[];
    isLoadingNotes: boolean;
    sessions: Session[];
    isLoadingSessions: boolean;
    apiKey: string | null;
    sessionId: string | null;
    isLoadingTranscript: boolean;
    isSessionSwitching: boolean;
    deletingNoteIds: string[];
    deletingSessionIds: string[];
    isGeneratingNote: boolean;
    patients: Patient[];
    isLoadingPatients: boolean;
    error: string | null;
    notification: { message: string; type: 'info' | 'error' | 'success' } | null;
    isWaitingForMediaStream: boolean;
    isDemoMode: boolean;
    isLinkingPatient: boolean;
    isUsingDefaultKey: boolean;
}

interface WidgetContextType extends WidgetState {
    setThemeColor: (color: string) => void;
    setBackgroundColor: (color: string) => void;
    setTextColor: (color: string) => void;
    setAgentName: (name: string) => void;
    setExpanded: (expanded: boolean) => void;
    startCall: () => Promise<void>;
    endCall: () => void;
    toggleRecording: () => Promise<void>;
    setIsMuted: (muted: boolean) => void;
    setNotes: (notes: string) => void;
    currentNoteId: string | null;
    setCurrentNoteId: (id: string | null) => void;
    generateNote: (templateId: string) => Promise<void>;
    setPosition: (position: WidgetPosition) => void;
    setSelectedTemplateId: (id: string | null) => void;
    fetchNoteDetails: (noteId: string) => Promise<void>;
    setApiKey: (key: string) => void;
    setSessionId: (id: string) => void;
    fetchSessions: () => Promise<void>;
    selectSession: (sessionId: string) => Promise<void>;
    createNewSession: (name?: string) => Promise<Session>;
    fetchTranscript: (sessionId: string) => Promise<void>;
    fetchNotesForSession: (sessionId: string) => Promise<void>;
    updateNote: (noteId: string, noteText: string) => Promise<void>;
    deleteNote: (noteId: string) => Promise<void>;
    deleteSession: (sessionId: string) => Promise<void>;
    renameSession: (sessionId: string, newName: string) => Promise<void>;
    fetchPatients: () => Promise<void>;
    addPatient: (name: string, email?: string) => Promise<Patient>;
    linkPatient: (patientId: string) => Promise<void>;
    notify: (message: string, type?: 'info' | 'error' | 'success') => void;
    clearNotification: () => void;
    startDemo: (script: string[]) => Promise<void>;
    isLinkingPatient: boolean;
}

const WidgetContext = createContext<WidgetContextType | undefined>(undefined);

export const WidgetProvider: React.FC<{
    children: React.ReactNode;
    initialConfig?: {
        agentName?: string;
        themeColor?: string;
        backgroundColor?: string;
        textColor?: string;
        position?: WidgetPosition;
        apiKey?: string;
    }
}> = ({ children, initialConfig }) => {
    const [currentSession, setCurrentSession] = useState<Session | null>(null);
    const [transcript, setTranscript] = useState('');
    const [notes, setNotes] = useState('');
    const [currentNoteId, setCurrentNoteId] = useState<string | null>(null);
    const [templates, setTemplates] = useState<NoteTemplate[]>([]);
    const [isRecording, setIsRecording] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const config = initialConfig || (typeof window !== 'undefined' ? (window as any).clinisageConfig : undefined);

    // Initialize with config or defaults
    const [themeColor, setThemeColor] = useState(config?.themeColor || '#0ea5e9');
    const [backgroundColor, setBackgroundColor] = useState(config?.backgroundColor || '#ffffff');
    const [textColor, setTextColor] = useState(config?.textColor || '#000000');
    const [agentName, setAgentName] = useState(config?.agentName || 'AI Scribe');
    const [position, setPosition] = useState<WidgetPosition>(config?.position || 'bottom-right');
    const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
    const [existingNotes, setExistingNotes] = useState<NoteOut[]>([]);
    const [isLoadingNotes, setIsLoadingNotes] = useState(false);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [isLoadingSessions, setIsLoadingSessions] = useState(false);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [isLoadingPatients, setIsLoadingPatients] = useState(false);

    const [isLoadingTranscript, setIsLoadingTranscript] = useState(false);
    const [isSessionSwitching, setIsSessionSwitching] = useState(false);
    const [deletingNoteIds, setDeletingNoteIds] = useState<string[]>([]);
    const [deletingSessionIds, setDeletingSessionIds] = useState<string[]>([]);
    const [isGeneratingNote, setIsGeneratingNote] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [notification, setNotification] = useState<{ message: string; type: 'info' | 'error' | 'success' } | null>(null);
    const [isWaitingForMediaStream, setIsWaitingForMediaStream] = useState(false);
    const [isLinkingPatient, setIsLinkingPatient] = useState(false);

    // Check for API key in config, then cookie, then default
    const getInitialApiKey = () => {
        if (config?.apiKey) return config.apiKey;
        const cookieKey = CookieUtils.getApiKey();
        if (cookieKey) return cookieKey;
        return DEFAULT_TEST_API_KEY;
    };

    const [apiKey, setApiKeyState] = useState<string | null>(getInitialApiKey());
    const isUsingDefaultKey = apiKey === DEFAULT_TEST_API_KEY;
    const [sessionId, setSessionIdState] = useState<string | null>(null);

    // Initial setup for apiKey from config
    useEffect(() => {
        const initialKey = getInitialApiKey();
        if (initialKey) {
            setApiKeyState(initialKey);
            // Only set cookie if it's not the default key or if specifically from config
            if (initialKey !== DEFAULT_TEST_API_KEY || config?.apiKey) {
                CookieUtils.setApiKey(initialKey);
            }
        }
    }, [config?.apiKey]);

    const setApiKey = useCallback((key: string) => {
        const keyToSet = key.trim();
        setApiKeyState(keyToSet || DEFAULT_TEST_API_KEY);

        if (!keyToSet || keyToSet === DEFAULT_TEST_API_KEY) {
            CookieUtils.removeApiKey();
        } else {
            CookieUtils.setApiKey(keyToSet);
        }
    }, []);

    const setSessionId = useCallback((id: string) => {
        setSessionIdState(id);
    }, []);

    // Setup callback for media streaming started event
    useEffect(() => {
        audioStreamingService.setOnMediaStreamingStarted(() => {
            setIsWaitingForMediaStream(false);
        });
    }, []);

    const fetchSessions = useCallback(async () => {
        const key = apiKey || CookieUtils.getApiKey();
        if (!key) return;

        try {
            setIsLoadingSessions(true);
            const sessionList = await sessionApi.getSessions();
            setSessions(sessionList);
        } catch (err) {
            console.error('WidgetContext: fetchSessions failed:', err);
            setError('Failed to fetch sessions');
        } finally {
            setIsLoadingSessions(false);
        }
    }, [apiKey]);

    const fetchTranscript = useCallback(async (id: string) => {
        try {
            setIsLoadingTranscript(true);
            const data = await transcriptApi.getTranscript(id);
            setTranscript(data.text);
        } catch (err) {
            console.error('WidgetContext: fetchTranscript failed:', err);
            // setError('Failed to fetch transcript');
        } finally {
            setIsLoadingTranscript(false);
        }
    }, []);

    const fetchNotesForSession = useCallback(async (id: string) => {
        try {
            setIsLoadingNotes(true);
            const notesList = await noteApi.getNotesForSession(id);
            setExistingNotes(notesList);
            if (notesList && notesList.length > 0) {
                const latestNote = notesList[notesList.length - 1];
                setNotes(latestNote.note_text);
                setCurrentNoteId(latestNote.id || null);
            } else {
                setNotes('');
                setCurrentNoteId(null);
            }
        } catch (err) {
            console.error('WidgetContext: fetchNotesForSession failed:', err);
            setError('Failed to fetch notes');
        } finally {
            setIsLoadingNotes(false);
        }
    }, []);

    const selectSession = useCallback(async (id: string) => {
        setIsSessionSwitching(true);
        // Clear current session data while loading to prevent ghosting
        setTranscript('');
        setNotes('');
        setCurrentNoteId(null);
        setExistingNotes([]);

        setSessionIdState(id);

        try {
            // Update current session object first
            const session = await sessionApi.getSessionById(id);
            setCurrentSession(session);

            // Fetch transcript and notes
            await Promise.all([
                fetchTranscript(id),
                fetchNotesForSession(id)
            ]);
        } catch (err) {
            console.error('WidgetContext: selectSession failed:', err);
            setError('Failed to load session');
        } finally {
            setIsSessionSwitching(false);
        }
    }, [fetchTranscript, fetchNotesForSession]);

    const createNewSession = useCallback(async (name?: string) => {
        try {
            setIsLoadingSessions(true);
            // Clear current state for new session
            setTranscript('');
            setNotes('');
            setCurrentNoteId(null);
            setExistingNotes([]);

            const newSession = await sessionApi.createSession({
                name: name || `Session ${new Date().toLocaleString()}`
            });
            setCurrentSession(newSession);
            setSessionIdState(newSession.id);
            // Refresh sessions list
            await fetchSessions();
            return newSession;
        } catch (err) {
            console.error('WidgetContext: createNewSession failed:', err);
            setError('Failed to create new session');
            throw err;
        } finally {
            setIsLoadingSessions(false);
        }
    }, [fetchSessions]);

    const deleteSession = useCallback(async (id: string) => {
        try {
            setDeletingSessionIds(prev => [...prev, id]);
            await sessionApi.deleteSession(id);
            setSessions(prev => prev.filter(s => s.id !== id));

            // If the deleted session was the current one, clear it
            if (currentSession?.id === id) {
                setCurrentSession(null);
                setSessionIdState(null);
                setTranscript('');
                setNotes('');
                setCurrentNoteId(null);
                setExistingNotes([]);
            }
        } catch (err) {
            console.error('WidgetContext: deleteSession failed:', err);
            setError('Failed to delete session');
        } finally {
            setDeletingSessionIds(prev => prev.filter(sid => sid !== id));
        }
    }, [currentSession]);

    const renameSession = useCallback(async (id: string, newName: string) => {
        try {
            const updated = await sessionApi.updateSession(id, { name: newName });
            setSessions(prev => prev.map(s => s.id === id ? updated : s));
            if (currentSession?.id === id) {
                setCurrentSession(updated);
            }
        } catch (err) {
            console.error('WidgetContext: renameSession failed:', err);
            setError('Failed to rename session');
        }
    }, [currentSession]);

    const fetchPatients = useCallback(async () => {
        try {
            setIsLoadingPatients(true);
            const list = await patientApi.getPatients();
            setPatients(list);
        } catch (err) {
            console.error('WidgetContext: fetchPatients failed:', err);
            setError('Failed to fetch patients');
        } finally {
            setIsLoadingPatients(false);
        }
    }, []);

    const addPatient = useCallback(async (name: string, email?: string) => {
        try {
            setIsLoadingPatients(true);
            const newPatient = await patientApi.createPatient({ name, email });
            setPatients(prev => [newPatient, ...prev]);
            return newPatient;
        } catch (err) {
            console.error('WidgetContext: addPatient failed:', err);
            setError('Failed to add patient');
            throw err;
        } finally {
            setIsLoadingPatients(false);
        }
    }, []);

    const notify = useCallback((message: string, type: 'info' | 'error' | 'success' = 'info') => {
        setNotification({ message, type });
    }, []);

    const clearNotification = useCallback(() => {
        setNotification(null);
    }, []);


    const linkPatient = useCallback(async (patientId: string) => {
        if (!currentSession) {
            notify('Please first select or create a new session', 'error');
            return;
        }
        const key = apiKey || CookieUtils.getApiKey();
        if (!key) {
            notify('Please add API Key first', 'error');
            return;
        }

        try {
            setIsLinkingPatient(true);
            const updated = await sessionApi.updateSession(currentSession.id, { patient_id: patientId });
            setCurrentSession(updated);
            setSessions(prev => prev.map(s => s.id === updated.id ? updated : s));
            notify('Patient linked successfully', 'success');
        } catch (err) {
            console.error('WidgetContext: linkPatient failed:', err);
            setError('Failed to link patient');
            throw err;
        } finally {
            setIsLinkingPatient(false);
        }
    }, [currentSession, notify, apiKey]);

    // Fetch sessions when key is set and auto-select/create
    useEffect(() => {
        if (apiKey) {
            (async () => {
                try {
                    // Avoid double loading if already loading
                    // setIsLoadingSessions(true); // handled in select/create/fetch? 
                    // Let's do a direct call pattern for stronger control
                    const list = await sessionApi.getSessions();
                    setSessions(list);
                    if (list.length > 0) {
                        // Select the most recent session
                        await selectSession(list[0].id);
                    } else {
                        // Create a new session if none exist
                        await createNewSession('New Session');
                    }
                } catch (err) {
                    console.error('Auto-initialization failed', err);
                    setError('Failed to initialize session');
                }
            })();
        }
    }, [apiKey, selectSession, createNewSession]);

    // Fetch templates on mount or when key is set
    useEffect(() => {
        const fetchTemplates = async () => {
            const key = apiKey || CookieUtils.getApiKey();
            if (!key) return;

            try {
                const fetchedTemplates = await templateApi.getTemplates();
                const mappedTemplates: NoteTemplate[] = fetchedTemplates.map(t => ({
                    id: t.id,
                    title: t.template_title || 'Untitled Template',
                    description: t.template_description || 'No description provided',
                }));
                setTemplates(mappedTemplates);
            } catch (err) {
                console.error('Failed to fetch templates:', err);
            }
        };

        fetchTemplates();
    }, [apiKey]);

    // Listen for transcriptions
    useEffect(() => {
        audioStreamingService.onTranscriptionReceived = (text: string) => {
            setTranscript(prev => {
                // Remove trailing whitespace from previous and add new text
                const base = prev.trim();
                return base ? `${base} ${text}` : text;
            });
        };

        audioStreamingService.setOnConnectionStateChange((connected) => {
            setIsConnected(connected);
            if (!connected) setIsRecording(false);
        });

        // Handle transcription events from status messages if any
        audioStreamingService.setOnStatusMessage((data) => {
            if (data.type === 'transcription' && data.text) {
                setTranscript(prev => {
                    const base = prev.trim();
                    return base ? `${base} ${data.text}` : data.text;
                });
            }
        });
    }, []);

    const startCall = useCallback(async () => {
        const key = apiKey || CookieUtils.getApiKey();
        if (!key) {
            notify('Please add API Key first', 'error');
            return;
        }

        try {
            setError(null);
            setIsConnecting(true);

            let sessionToUse = currentSession;
            if (!sessionToUse) {
                sessionToUse = await createNewSession('In-Person Session');
            }

            await audioStreamingService.connect(sessionToUse.id);
            setIsConnected(true);
            setIsConnecting(false);
        } catch (error) {
            console.error('Start call failed:', error);
            setError(error instanceof Error ? error.message : 'Failed to start call');
            setIsConnecting(false);
            setIsConnected(false);
        }
    }, [currentSession, createNewSession]);

    const endCall = useCallback(() => {
        audioStreamingService.disconnect();
        setIsConnected(false);
        setIsRecording(false);
    }, []);

    const toggleRecording = useCallback(async () => {
        const key = apiKey || CookieUtils.getApiKey();
        if (!key) {
            notify('Please add API Key first', 'error');
            return;
        }

        if (isRecording) {
            audioStreamingService.stopRecording();
            setIsRecording(false);
            setIsWaitingForMediaStream(false);
        } else {
            try {
                let sessionToUse = currentSession;

                // 1. Create session if it doesn't exist
                if (!sessionToUse) {
                    setIsConnecting(true);
                    try {
                        sessionToUse = await createNewSession('In-Person Session');
                    } catch (e) {
                        setIsConnecting(false);
                        throw e;
                    }
                }

                // 2. Connect if not connected
                if (!isConnected && sessionToUse) {
                    setIsConnecting(true);
                    setIsWaitingForMediaStream(true);
                    try {
                        await audioStreamingService.connect(sessionToUse.id);
                        setIsConnected(true);
                    } finally {
                        setIsConnecting(false);
                    }
                }

                // 3. Start Recording
                await audioStreamingService.startRecording();
                setIsRecording(true);
                setIsMuted(false);
            } catch (error) {
                console.error('Failed to start recording:', error);
                setError(error instanceof Error ? error.message : 'Failed to start recording');
                setIsRecording(false);
                setIsWaitingForMediaStream(false);
            }
        }
    }, [isRecording, isConnected, currentSession]);

    const handleSetIsMuted = useCallback((muted: boolean) => {
        if (muted) {
            audioStreamingService.mute();
        } else {
            audioStreamingService.unmute();
        }
        setIsMuted(muted);
    }, []);

    const fetchNoteDetails = useCallback(async (noteId: string) => {

        // Optimization: check if we already have the note text in our existingNotes list
        const existingNote = existingNotes.find(n => n.id === noteId);
        if (existingNote && existingNote.note_text !== undefined) {
            setNotes(existingNote.note_text);
            setCurrentNoteId(existingNote.id || null);
            return;
        }

        try {
            setIsLoadingNotes(true);
            const note = await noteApi.getNoteById(noteId);
            setNotes(note.note_text);
            setCurrentNoteId(note.id || null);
        } catch (err) {
            console.error('WidgetContext: fetchNoteDetails failed:', err);
            setError('Failed to load note content');
        } finally {
            setIsLoadingNotes(false);
        }
    }, [existingNotes]);

    const generateNote = useCallback(async (templateId: string) => {
        const key = apiKey || CookieUtils.getApiKey();
        if (!key) {
            notify('Please add API Key first', 'error');
            return;
        }

        if (!currentSession) {
            console.warn('WidgetContext: generateNote aborted - no currentSession');
            notify('Please select or create a session first', 'error');
            return;
        }
        if (!transcript || transcript.trim() === '') {
            console.warn('WidgetContext: generateNote aborted - no transcript');
            notify('Please record or transcribe a session first', 'error');
            return;
        }

        const actualTemplateId = templateId || selectedTemplateId || 'default';
        setNotes('');
        let fullNoteText = '';

        try {
            setIsGeneratingNote(true);
            await noteApi.generateNoteStreaming(
                currentSession.id,
                {
                    template_id: actualTemplateId,
                    transcribed_text: transcript
                },
                (chunk) => {
                    fullNoteText += chunk;
                    setNotes(prev => prev + chunk);
                },
                async (noteId) => {
                    if (noteId) {
                        setCurrentNoteId(noteId);
                        // Refresh existing notes list
                        const notesList = await noteApi.getNotesForSession(currentSession.id);
                        setExistingNotes(notesList);
                    } else {
                        // Fallback if not saved by backend during stream
                        try {
                            const savedNote = await noteApi.createNote(currentSession.id, fullNoteText, actualTemplateId);
                            setCurrentNoteId(savedNote.id || null);
                            // Refresh existing notes list
                            const notesList = await noteApi.getNotesForSession(currentSession.id);
                            setExistingNotes(notesList);
                        } catch (saveErr) {
                            console.error('Failed to save generated note:', saveErr);
                        }
                    }
                },
                (err) => {
                    console.error('Note generation error:', err);
                    setError('Failed to generate note');
                }
            );
        } catch (error) {
            console.error('Failed to generate note:', error);
            setError('Failed to generate note');
        } finally {
            setIsGeneratingNote(false);
        }
    }, [currentSession, transcript, selectedTemplateId]);

    const deleteNote = useCallback(async (noteId: string) => {
        try {
            setDeletingNoteIds(prev => [...prev, noteId]);
            await noteApi.deleteNote(noteId);
            setExistingNotes(prev => prev.filter(n => n.id !== noteId));
            if (currentNoteId === noteId) {
                setNotes('');
                setCurrentNoteId(null);
            }
        } catch (err) {
            console.error('WidgetContext: deleteNote failed:', err);
            setError('Failed to delete note');
        } finally {
            setDeletingNoteIds(prev => prev.filter(id => id !== noteId));
        }
    }, [currentNoteId]);

    const updateNote = useCallback(async (noteId: string, noteText: string) => {
        try {
            await noteApi.updateNote(noteId, noteText);
            setExistingNotes(prev =>
                prev.map(n => n.id === noteId ? { ...n, note_text: noteText } : n)
            );
        } catch (err) {
            console.error('WidgetContext: updateNote failed:', err);
            setError('Failed to update note');
        }
    }, []);

    const [isDemoMode, setIsDemoMode] = useState(false);

    const startDemo = useCallback(async (script: string[]) => {
        if (isDemoMode) return;
        setIsDemoMode(true);
        setIsConnected(true);
        setIsRecording(true);
        setTranscript('');

        // Ensure expanded
        setIsExpanded(true);

        // Clear existing notes
        setNotes('');
        setCurrentNoteId(null);

        for (const line of script) {
            const words = line.split(' ');
            for (const word of words) {
                await new Promise(r => setTimeout(r, 100 + Math.random() * 100));
                setTranscript(prev => (prev ? prev + ' ' : '') + word);
            }
            // Chunk delay
            await new Promise(r => setTimeout(r, 500));
        }

        setIsRecording(false);
        // setIsConnected(false); // Keep connected for visual effect? Or disconnect. 
        // Disconnecting looks like "call ended" which is appropriate.
        setIsConnected(false);
        setIsDemoMode(false);
    }, [isDemoMode]);

    const value = {
        currentSession,
        transcript,
        notes,
        setNotes,
        currentNoteId,
        setCurrentNoteId,
        isRecording,
        isConnected,
        isConnecting,
        isMuted,
        isExpanded,
        themeColor,
        backgroundColor,
        textColor,
        agentName,
        position,
        error,
        setThemeColor,
        setBackgroundColor,
        setTextColor,
        setAgentName,
        setExpanded: setIsExpanded,
        startCall,
        endCall,
        toggleRecording,
        setIsMuted: handleSetIsMuted,
        generateNote,
        setPosition,
        templates,
        selectedTemplateId,
        setSelectedTemplateId,
        existingNotes,
        isLoadingNotes,
        sessions,
        isLoadingSessions,
        fetchNoteDetails,
        apiKey,
        setApiKey,
        sessionId,
        setSessionId,
        fetchSessions,
        selectSession,
        createNewSession,
        fetchTranscript,
        fetchNotesForSession,
        isLoadingTranscript,
        isSessionSwitching,
        deletingNoteIds,
        deletingSessionIds,
        isGeneratingNote,
        deleteNote,
        updateNote,
        deleteSession,
        renameSession,
        patients,
        isLoadingPatients,
        fetchPatients,
        addPatient,
        linkPatient,
        notification,
        notify,
        clearNotification,
        isWaitingForMediaStream,
        isDemoMode,
        startDemo,
        isLinkingPatient,
        isUsingDefaultKey
    };

    return <WidgetContext.Provider value={value}>{children}</WidgetContext.Provider>;
};

export const useWidget = () => {
    const context = useContext(WidgetContext);
    if (!context) throw new Error('useWidget must be used within a WidgetProvider');
    return context;
};
