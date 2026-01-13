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
    authToken: string | null;
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
    setAuthTokenState: (token: string) => void;
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
        authToken?: string;
        sessionId?: string;
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
    const [agentName, setAgentName] = useState(config?.agentName || 'Voice Assistant');
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

    const [authToken, setAuthToken] = useState<string | null>(config?.authToken || null);
    const [sessionId, setSessionIdState] = useState<string | null>(config?.sessionId || null);

    // Initial setup for authToken and sessionId from config
    useEffect(() => {
        if (config?.authToken) setAuthToken(config.authToken);
        if (config?.sessionId) setSessionIdState(config.sessionId);
    }, [config?.authToken, config?.sessionId]);

    const setAuthTokenState = useCallback((token: string) => {
        setAuthToken(token);
        CookieUtils.setAuthToken(token);
    }, []);

    const setSessionId = useCallback((id: string) => {
        console.log('WidgetContext: setSessionId called with:', id);
        setSessionIdState(id);
    }, []);

    // Initial setup for authToken and sessionId
    useEffect(() => {
        const setupSession = async () => {
            console.log('WidgetContext: setupSession triggered with:', { authToken: authToken ? 'YES' : 'NO', sessionId });
            if (authToken) {
                CookieUtils.setAuthToken(authToken);
            }

            if (sessionId) {
                try {
                    console.log('WidgetContext: setupSession fetching session for:', sessionId);
                    const session = await sessionApi.getSessionById(sessionId);
                    console.log('WidgetContext: setupSession success, setting currentSession:', session.id);
                    setCurrentSession(session);

                    // Fetch existing notes for this session
                    setIsLoadingNotes(true);
                    const notesList = await noteApi.getNotesForSession(sessionId);
                    setExistingNotes(notesList);

                    if (notesList && notesList.length > 0) {
                        // Load the latest note by default if no currentNoteId
                        const latestNote = notesList[notesList.length - 1];
                        setNotes(latestNote.note_text);
                        setCurrentNoteId(latestNote.id || null);
                    }
                } catch (err) {
                    console.error('Failed to auto-load session:', err);
                    setError('Failed to load existing session data');
                } finally {
                    setIsLoadingNotes(false);
                }
            } else {
                setCurrentSession(null);
                setExistingNotes([]);
                setNotes('');
            }
        };

        setupSession();
    }, [authToken, sessionId]);

    const fetchSessions = useCallback(async () => {
        const token = authToken || CookieUtils.getAuthToken();
        if (!token) return;

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
    }, [authToken]);

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
        console.log('WidgetContext: selectSession called with:', id);
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
        try {
            const updated = await sessionApi.updateSession(currentSession.id, { patient_id: patientId });
            setCurrentSession(updated);
            setSessions(prev => prev.map(s => s.id === updated.id ? updated : s));
        } catch (err) {
            console.error('WidgetContext: linkPatient failed:', err);
            setError('Failed to link patient');
            throw err;
        }
    }, [currentSession, notify]);

    // Fetch sessions when token is set
    useEffect(() => {
        if (authToken) {
            fetchSessions();
        }
    }, [authToken, fetchSessions]);

    // Fetch templates on mount or when token is set
    useEffect(() => {
        const fetchTemplates = async () => {
            const token = authToken || CookieUtils.getAuthToken();
            if (!token) return;

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
    }, [authToken]);

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
        if (isRecording) {
            audioStreamingService.stopRecording();
            setIsRecording(false);
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
        console.log('WidgetContext: fetchNoteDetails called with:', noteId);

        // Optimization: check if we already have the note text in our existingNotes list
        const existingNote = existingNotes.find(n => n.id === noteId);
        if (existingNote && existingNote.note_text !== undefined) {
            console.log('WidgetContext: fetchNoteDetails using local data');
            setNotes(existingNote.note_text);
            setCurrentNoteId(existingNote.id || null);
            return;
        }

        try {
            setIsLoadingNotes(true);
            const note = await noteApi.getNoteById(noteId);
            console.log('WidgetContext: fetchNoteDetails success:', note.id);
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
        console.log('WidgetContext: generateNote called with:', templateId);
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
                    console.log('Note generation complete');
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
        authToken,
        setAuthTokenState,
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
        clearNotification
    };

    return <WidgetContext.Provider value={value}>{children}</WidgetContext.Provider>;
};

export const useWidget = () => {
    const context = useContext(WidgetContext);
    if (!context) throw new Error('useWidget must be used within a WidgetProvider');
    return context;
};
