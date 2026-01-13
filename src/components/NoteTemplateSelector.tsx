import React, { useState, useEffect, useRef } from 'react';
import { Search, FileText, Plus, ChevronDown, Trash2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWidget } from '../contexts/WidgetContext';
import type { NoteOut } from '../lib/noteApi';

const NoteTemplateSelector: React.FC = () => {
    const {
        templates,
        generateNote,
        themeColor,
        backgroundColor,
        textColor,
        existingNotes,
        currentNoteId,
        fetchNoteDetails,
        deleteNote,
        deletingNoteIds
    } = useWidget();

    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    const filteredTemplates = templates.filter(t =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelectTemplate = (templateId: string) => {
        console.log('NoteTemplateSelector: handleSelectTemplate called with:', templateId);
        setIsOpen(false);
        generateNote(templateId);
    };

    const handleSelectExistingNote = (noteId: string) => {
        console.log('NoteTemplateSelector: handleSelectExistingNote called with:', noteId);
        setIsOpen(false);
        fetchNoteDetails(noteId);
    };

    const getNoteTitle = (note: any) => {
        let baseTitle = 'Clinical Note';
        if (note.template_id) {
            const template = templates.find(t => t.id === note.template_id);
            if (template) baseTitle = template.title;
        }

        // Find the index of this note among all notes with the same base title
        const peerNotes = existingNotes.filter(n => {
            const nTemplate = templates.find(t => t.id === n.template_id);
            const nTitle = nTemplate?.title || 'Clinical Note';
            return nTitle === baseTitle;
        });

        const noteIndexInPeers = peerNotes.findIndex(n => n.id === note.id);

        if (peerNotes.length > 1 && noteIndexInPeers !== -1) {
            return `${baseTitle} (${noteIndexInPeers + 1})`;
        }

        return baseTitle;
    };

    const currentNoteObj = existingNotes.find(n => n.id === currentNoteId);
    const buttonLabel = currentNoteId && currentNoteObj
        ? getNoteTitle(currentNoteObj)
        : `Notes ${existingNotes.length > 0 ? `(${existingNotes.length})` : ''}`;

    const isLight = backgroundColor === '#ffffff';

    return (
        <div className="relative min-w-0" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl border transition-all text-xs font-semibold w-full max-w-[180px] cursor-pointer"
                style={{
                    backgroundColor: isLight ? `${themeColor} 10` : `${themeColor} 20`,
                    borderColor: `${themeColor} 40`,
                    color: themeColor
                }}
            >
                <FileText className="w-4 h-4 shrink-0" />
                <span className="truncate flex-1 text-left">{buttonLabel}</span>
                <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute top-full right-0 mt-3 w-[320px] rounded-2xl shadow-2xl border overflow-hidden flex flex-col z-50"
                        style={{
                            backgroundColor: backgroundColor,
                            borderColor: isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'
                        }}
                    >
                        {/* Search Bar */}
                        <div className="p-3 border-b" style={{ borderColor: isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)' }}>
                            <div
                                className="flex items-center gap-2 px-3 py-2 rounded-xl border transition-all"
                                style={{
                                    backgroundColor: isLight ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.05)',
                                    borderColor: `${themeColor} 30`
                                }}
                            >
                                <Search className="w-4 h-4 opacity-40" style={{ color: textColor }} />
                                <input
                                    type="text"
                                    placeholder="Search templates"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-transparent border-none outline-none text-sm w-full"
                                    style={{ color: textColor }}
                                />
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="max-h-[350px] overflow-y-auto">
                            {/* Existing Notes Section */}
                            {existingNotes.length > 0 && (
                                <div className="p-2 border-b" style={{ borderColor: isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)' }}>
                                    <h3 className="text-[10px] font-bold uppercase tracking-wider opacity-40 mb-1 px-2" style={{ color: textColor }}>
                                        Existing Notes
                                    </h3>
                                    <div className="space-y-1">
                                        {existingNotes.map((note: NoteOut) => (
                                            <button
                                                key={note.id}
                                                onClick={() => note.id && handleSelectExistingNote(note.id)}
                                                className="w-full group flex items-start gap-3 p-2 rounded-xl transition-all text-left relative"
                                                style={{
                                                    backgroundColor: currentNoteId === note.id
                                                        ? (isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)')
                                                        : 'transparent'
                                                }}
                                            >
                                                <div
                                                    className="w-8 h-8 shrink-0 rounded-lg flex items-center justify-center"
                                                    style={{
                                                        backgroundColor: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)'
                                                    }}
                                                >
                                                    <FileText className="w-4 h-4" style={{ color: themeColor }} />
                                                </div>
                                                <div className="flex-1 min-w-0 pr-6">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <h4 className="text-sm font-bold truncate" style={{ color: textColor }}>
                                                            {getNoteTitle(note)}
                                                        </h4>
                                                        {note.created_at && (
                                                            <span className="text-[9px] opacity-30 whitespace-nowrap" style={{ color: textColor }}>
                                                                {new Date(note.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {note.note_text && (
                                                        <p className="text-[10px] opacity-50 truncate mt-0.5 font-medium" style={{ color: textColor }}>
                                                            {note.note_text.slice(0, 60).replace(/\n/g, ' ')}...
                                                        </p>
                                                    )}
                                                </div>

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (note.id) {
                                                            deleteNote(note.id);
                                                        }
                                                    }}
                                                    className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 text-slate-400 transition-all disabled:opacity-50"
                                                    title="Delete note"
                                                    disabled={note.id ? deletingNoteIds.includes(note.id) : false}
                                                >
                                                    {note.id && deletingNoteIds.includes(note.id) ? (
                                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    )}
                                                </button>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Create New Section */}
                            <div className="p-2">
                                <h3 className="text-[10px] font-bold uppercase tracking-wider opacity-40 mb-1 px-2" style={{ color: textColor }}>
                                    Create New Note
                                </h3>
                                <div className="space-y-1">
                                    {filteredTemplates.map((template) => (
                                        <button
                                            key={template.id}
                                            onClick={() => handleSelectTemplate(template.id)}
                                            className="w-full flex items-start gap-3 p-3 rounded-xl transition-all text-left group"
                                        >
                                            <div
                                                className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center transition-colors"
                                                style={{
                                                    backgroundColor: isLight ? `${themeColor} 10` : `${themeColor} 20`
                                                }}
                                            >
                                                <Plus className="w-5 h-5" style={{ color: themeColor }} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-semibold truncate" style={{ color: textColor }}>
                                                    {template.title}
                                                </h4>
                                                <p className="text-xs opacity-50 line-clamp-1 mt-0.5" style={{ color: textColor }}>
                                                    {template.description}
                                                </p>
                                            </div>
                                        </button>
                                    ))}

                                    {filteredTemplates.length === 0 && (
                                        <div className="p-8 text-center">
                                            <p className="text-xs opacity-40 italic" style={{ color: textColor }}>
                                                No templates found
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NoteTemplateSelector;
