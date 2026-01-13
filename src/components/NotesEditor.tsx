import React, { useRef, useState, useEffect } from 'react';
import { Bold, Italic, Loader2, FileText } from 'lucide-react';
import { useWidget } from '../contexts/WidgetContext';
import NoteTemplateSelector from './NoteTemplateSelector';

interface NotesEditorProps {
    isVisible: boolean;
}

const NotesEditor: React.FC<NotesEditorProps> = ({ isVisible }) => {
    const {
        notes,
        setNotes,
        currentNoteId,
        backgroundColor,
        textColor,
        isLoadingNotes,
        updateNote,
        isSessionSwitching,
        isGeneratingNote
    } = useWidget();

    const [localNotes, setLocalNotes] = useState(notes);
    const editorRef = useRef<HTMLDivElement>(null);
    const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastSavedContent = useRef(notes);
    const isInternalChange = useRef(false);

    const autoSave = async (content: string) => {
        if (!currentNoteId) return;

        try {
            await updateNote(currentNoteId, content);
            lastSavedContent.current = content;
        } catch (error) {
            console.error('Error auto-saving note:', error);
        }
    };

    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
        const newContent = e.currentTarget.innerText;
        isInternalChange.current = true;
        setLocalNotes(newContent);
        setNotes(newContent);

        if (currentNoteId && newContent !== lastSavedContent.current) {
            if (autoSaveTimeoutRef.current) {
                clearTimeout(autoSaveTimeoutRef.current);
            }
            autoSaveTimeoutRef.current = setTimeout(() => {
                autoSave(newContent);
            }, 2000);
        }

        // Reset the flag after the current tick
        setTimeout(() => {
            isInternalChange.current = false;
        }, 0);
    };

    useEffect(() => {
        setLocalNotes(notes);
        lastSavedContent.current = notes;

        // Aggressively sync the editor DOM
        if (editorRef.current && !isInternalChange.current) {
            // Use a small timeout to ensure DOM is ready if we just switched from loader
            const syncDom = () => {
                if (editorRef.current && editorRef.current.innerText !== notes) {
                    editorRef.current.innerText = notes || '';
                }
            };
            syncDom();
            // Double check after a tick for remount cases
            setTimeout(syncDom, 0);
        }
    }, [notes]);

    useEffect(() => {
        return () => {
            if (autoSaveTimeoutRef.current) {
                clearTimeout(autoSaveTimeoutRef.current);
            }
        };
    }, []);

    const handleFormat = (command: string) => {
        document.execCommand(command, false);
        editorRef.current?.focus();
    };

    if (!isVisible) return null;

    return (
        <div className="flex flex-col h-full absolute inset-0 bg-transparent">
            {/* Toolbar */}
            <div
                className="flex items-center justify-between px-3 py-1.5 border-b relative gap-2"
                style={{
                    borderColor: backgroundColor === '#ffffff' ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.04)',
                    backgroundColor: backgroundColor === '#ffffff' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.2)'
                }}
            >
                <div className="flex items-center gap-1 overflow-hidden">
                    <button
                        onClick={() => handleFormat('bold')}
                        className="p-1.5 px-3 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-all text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                        title="Bold"
                    >
                        <Bold className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleFormat('italic')}
                        className="p-1.5 px-3 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-all text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                        title="Italic"
                    >
                        <Italic className="w-4 h-4" />
                    </button>

                    <div className="w-px h-4 mx-2 opacity-10" style={{ backgroundColor: textColor }} />
                </div>

                <div className="flex items-center gap-1.5 min-w-0 flex-1 justify-end">
                    <NoteTemplateSelector />
                    {isGeneratingNote && (
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-sky-50 dark:bg-sky-500/10 border border-sky-100 dark:border-sky-500/20 shrink-0">
                            <Loader2 className="w-2.5 h-2.5 animate-spin text-sky-500" />
                            <span className="text-[9px] font-bold uppercase tracking-widest text-sky-500">Generating</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Editor Area */}
            <div className="flex-1 overflow-hidden relative">
                {(isLoadingNotes || isSessionSwitching) ? (
                    <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-400">
                        <Loader2 className="w-5 h-5 animate-spin text-sky-500" />
                        <p className="text-[11px] font-bold uppercase tracking-widest text-center px-4">
                            {isSessionSwitching ? 'Switching session...' : 'Fetching notes...'}
                        </p>
                    </div>
                ) : (
                    <>
                        <div
                            ref={editorRef}
                            contentEditable
                            className="w-full h-full p-4 pb-12 focus:outline-none overflow-y-auto no-scrollbar scrollbar-hide"
                            style={{
                                color: textColor,
                                fontSize: '14px',
                                lineHeight: '1.6'
                            }}
                            onInput={handleInput}
                            suppressContentEditableWarning
                        >
                        </div>

                        {!localNotes && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center pointer-events-none">
                                <div className="w-10 h-10 rounded-2xl bg-sky-50 dark:bg-sky-500/10 flex items-center justify-center mb-3">
                                    <FileText className="w-5 h-5 text-sky-500" />
                                </div>
                                <h3 className="text-xs font-bold mb-1 uppercase tracking-widest opacity-60" style={{ color: textColor }}>No Clinical Note</h3>
                                <p className="text-[11px] opacity-40 max-w-[180px] leading-relaxed" style={{ color: textColor }}>
                                    Select a template above to generate a professional clinical note.
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default NotesEditor;
