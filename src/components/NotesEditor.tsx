import React, { useRef, useState, useEffect } from 'react';
import { Bold, Italic, Loader2, FileText, Download } from 'lucide-react';
import { useWidget } from '../contexts/WidgetContext';
import NoteTemplateSelector from './NoteTemplateSelector';
import { isLightColor } from '../lib/colorUtils';
import { marked } from 'marked';
import TurndownService from 'turndown';
import { exportToPDF } from '../lib/exportUtils';


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
        isGeneratingNote,
        notify,
        currentSession,
        patients,
        existingNotes,
        templates,
        themeColor
    } = useWidget();

    const [isExporting, setIsExporting] = useState(false);
    const [hoveredButton, setHoveredButton] = useState<string | null>(null);

    const [localNotes, setLocalNotes] = useState(notes);
    const editorRef = useRef<HTMLDivElement>(null);
    const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastSavedContent = useRef(notes);
    const isInternalChange = useRef(false);

    // Initialize Turndown
    const turndownService = useRef(new TurndownService({
        headingStyle: 'atx',
        codeBlockStyle: 'fenced'
    }));

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
        const html = e.currentTarget.innerHTML;
        const markdown = turndownService.current.turndown(html);

        isInternalChange.current = true;
        setLocalNotes(markdown);
        setNotes(markdown);

        if (currentNoteId && markdown !== lastSavedContent.current) {
            if (autoSaveTimeoutRef.current) {
                clearTimeout(autoSaveTimeoutRef.current);
            }
            autoSaveTimeoutRef.current = setTimeout(() => {
                autoSave(markdown);
            }, 2000);
        }

        // Reset the flag after the current tick
        setTimeout(() => {
            isInternalChange.current = false;
        }, 0);
    };

    useEffect(() => {
        const contentToUse = notes;
        setLocalNotes(contentToUse);
        lastSavedContent.current = contentToUse;

        // Aggressively sync the editor DOM
        if (editorRef.current && !isInternalChange.current) {
            const syncDom = () => {
                if (editorRef.current) {
                    const html = marked.parse(notes || '') as string;
                    if (editorRef.current.innerHTML !== html) {
                        editorRef.current.innerHTML = html;
                    }
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
        // Trigger handleInput manually since execCommand doesn't always trigger onInput
        if (editorRef.current) {
            const html = editorRef.current.innerHTML;
            const markdown = turndownService.current.turndown(html);
            setLocalNotes(markdown);
            setNotes(markdown);
        }
    };

    const handleDownloadPdf = async () => {
        try {
            setIsExporting(true);

            // Get patient name
            const patient = patients.find(p => p.id === currentSession?.patient_id);
            const patientName = patient?.name || currentSession?.patient_name || 'Patient';
            // Get note name
            const currentNote = existingNotes.find(n => n.id === currentNoteId);
            const template = templates.find(t => t.id === currentNote?.template_id);
            const noteType = template?.title || 'Clinical Note';
            // Format date
            const now = new Date();
            const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;

            // Call export utility
            const success = await exportToPDF('clinical-note-content', {
                patientName: patientName,
                sessionName: noteType,
                date: dateStr,
                practitionerName: 'Dr. Sarah Wilson' // Hardcoded for now based on MockEMR, ideally from context
            });

            if (success) {
                if (notify) notify('PDF Exported Successfully', 'success');
            } else {
                if (notify) notify('Failed to export PDF', 'error');
            }

        } catch (error) {
            console.error('Error generating PDF:', error);
            if (notify) {
                notify('Failed to export PDF', 'error');
            }
        } finally {
            setIsExporting(false);
        }
    };

    if (!isVisible) return null;

    const buttonStyle = (name: string) => ({
        backgroundColor: hoveredButton === name
            ? (isLightColor(backgroundColor) ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)')
            : 'transparent',
        color: hoveredButton === name
            ? themeColor
            : (isLightColor(backgroundColor) ? '#64748b' : '#94a3b8'), // slate-500 : slate-400
        transition: 'all 0.2s ease',
        cursor: 'pointer'
    });

    return (
        <div className="flex flex-col h-full absolute inset-0 bg-transparent">
            <div
                className="flex items-center justify-between px-3 py-1.5 border-b relative gap-2"
                style={{
                    borderBottomColor: isLightColor(backgroundColor) ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.12)',
                    borderBottomStyle: 'solid',
                    borderBottomWidth: '1px',
                    backgroundColor: isLightColor(backgroundColor) ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.2)'
                }}
            >
                <div className="flex items-center gap-1 overflow-hidden">
                    <button
                        onClick={() => handleFormat('bold')}
                        onMouseEnter={() => setHoveredButton('bold')}
                        onMouseLeave={() => setHoveredButton(null)}
                        className="p-1.5 px-2 rounded-lg"
                        style={buttonStyle('bold')}
                        title="Bold"
                    >
                        <Bold className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleFormat('italic')}
                        onMouseEnter={() => setHoveredButton('italic')}
                        onMouseLeave={() => setHoveredButton(null)}
                        className="p-1.5 px-2 rounded-lg"
                        style={buttonStyle('italic')}
                        title="Italic"
                    >
                        <Italic className="w-4 h-4" />
                    </button>
                    {currentNoteId && (
                        <button
                            onClick={handleDownloadPdf}
                            disabled={isExporting}
                            onMouseEnter={() => setHoveredButton('download')}
                            onMouseLeave={() => setHoveredButton(null)}
                            className="p-1.5 px-2 rounded-lg disabled:opacity-50"
                            style={buttonStyle('download')}
                            title="Export as PDF"
                        >
                            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                        </button>
                    )}

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
                            id="clinical-note-content"
                            ref={editorRef}
                            contentEditable
                            className="w-full h-full p-4 pb-12 focus:outline-none overflow-y-auto no-scrollbar scrollbar-hide clinical-note-editor"
                            style={{
                                color: textColor,
                                fontSize: '14px',
                                lineHeight: '1.6',
                                borderColor: isLightColor(backgroundColor) ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)',
                                borderStyle: 'solid',
                                borderWidth: '1px',
                                borderRadius: '12px',
                                margin: '8px'
                            }}
                            onInput={handleInput}
                            suppressContentEditableWarning
                        >
                        </div>

                        {!localNotes && !isGeneratingNote && (
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

                        {/* Generating Loader - shows in editor box, hides when first character appears */}
                        {isGeneratingNote && !localNotes && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center pointer-events-none">
                                <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-500/10 flex items-center justify-center mb-3">
                                    <Loader2 className="w-6 h-6 animate-spin text-sky-500" />
                                </div>
                                <h3 className="text-xs font-bold mb-1 uppercase tracking-widest text-sky-500">Generating Note</h3>
                                <p className="text-[11px] opacity-60 max-w-[200px] leading-relaxed" style={{ color: textColor }}>
                                    AI is analyzing the transcript and creating your clinical note...
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div >
    );
};

export default NotesEditor;

