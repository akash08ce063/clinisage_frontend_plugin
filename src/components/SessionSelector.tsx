import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, ChevronDown, Calendar, Loader2, Check, Trash2, Edit2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWidget } from '../contexts/WidgetContext';

const SessionSelector: React.FC = () => {
    const {
        sessions,
        currentSession,
        isLoadingSessions,
        selectSession,
        createNewSession,
        deleteSession,
        renameSession,
        deletingSessionIds
    } = useWidget();

    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredSessions = sessions
        .filter(session =>
            (session.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (session.patient_name || '').toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
            const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
            const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
            return dateB - dateA;
        });

    const handleCreateNew = async () => {
        try {
            await createNewSession();
            setIsOpen(false);
        } catch (err) {
            console.error('Failed to create session:', err);
        }
    };

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="relative w-full text-slate-900" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between gap-3 px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-xl hover:border-sky-500/50 hover:bg-white transition-all duration-200 group pointer-events-auto"
            >
                <div className="flex items-center gap-2.5 overflow-hidden">
                    <div className="w-7 h-7 rounded-lg bg-sky-100 flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-3.5 h-3.5 text-sky-600" />
                    </div>
                    <div className="text-left overflow-hidden">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Active Session</p>
                        <p className="text-sm font-semibold text-slate-700 truncate leading-tight">
                            {currentSession ? (currentSession.name || 'Untitled Session') : 'Select a session'}
                        </p>
                    </div>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 4, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute top-full left-[-8px] mt-1 w-[calc(400px-16px)] z-[100] bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden pointer-events-auto"
                    >
                        <div className="p-2 border-b border-slate-100 bg-slate-50/50">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search sessions..."
                                    className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-sky-500 transition-all"
                                />
                            </div>
                        </div>

                        <div className="max-h-[250px] overflow-y-auto py-1">
                            {isLoadingSessions && (
                                <div className="p-4 flex items-center justify-center gap-2 text-slate-400 text-sm">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Loading...</span>
                                </div>
                            )}

                            {!isLoadingSessions && filteredSessions.length === 0 && (
                                <div className="p-4 text-center text-slate-500 text-sm">
                                    No sessions found
                                </div>
                            )}

                            {filteredSessions.map((session) => (
                                <div
                                    key={session.id}
                                    className={`group relative flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors ${currentSession?.id === session.id ? 'bg-sky-50/50' : ''}`}
                                >
                                    <div
                                        onClick={() => {
                                            if (editingSessionId !== session.id) {
                                                selectSession(session.id);
                                                setIsOpen(false);
                                            }
                                        }}
                                        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 cursor-pointer ${currentSession?.id === session.id ? 'bg-sky-100 text-sky-600' : 'bg-slate-100 text-slate-500'}`}
                                    >
                                        <Calendar className="w-4 h-4" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        {editingSessionId === session.id ? (
                                            <div className="flex items-center gap-2 pr-1">
                                                <input
                                                    autoFocus
                                                    type="text"
                                                    value={editName}
                                                    onChange={(e) => setEditName(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            renameSession(session.id, editName);
                                                            setEditingSessionId(null);
                                                        } else if (e.key === 'Escape') {
                                                            setEditingSessionId(null);
                                                        }
                                                    }}
                                                    className="flex-1 text-sm font-medium bg-white border border-sky-400 rounded px-1.5 py-0.5 outline-none"
                                                />
                                                <button
                                                    onClick={() => {
                                                        renameSession(session.id, editName);
                                                        setEditingSessionId(null);
                                                    }}
                                                    className="p-1 text-green-600 hover:bg-green-50 rounded cursor-pointer"
                                                >
                                                    <Check className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                    onClick={() => setEditingSessionId(null)}
                                                    className="p-1 text-slate-400 hover:bg-slate-100 rounded cursor-pointer"
                                                >
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div
                                                onClick={() => {
                                                    selectSession(session.id);
                                                    setIsOpen(false);
                                                }}
                                                className="cursor-pointer"
                                            >
                                                <div className="flex items-center justify-between gap-2">
                                                    <p className={`text-sm font-medium truncate ${currentSession?.id === session.id ? 'text-sky-700' : 'text-slate-700'}`}>
                                                        {session.name || 'Untitled Session'}
                                                    </p>
                                                    {currentSession?.id === session.id && (
                                                        <Check className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />
                                                    )}
                                                </div>
                                                <p className="text-[11px] text-slate-400">
                                                    {formatDate(session.created_at)}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    {editingSessionId !== session.id && (
                                        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity pr-1">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setEditingSessionId(session.id);
                                                    setEditName(session.name || '');
                                                }}
                                                className="p-1.5 text-slate-400 hover:text-sky-500 hover:bg-sky-50 rounded-lg transition-all cursor-pointer"
                                                title="Rename"
                                            >
                                                <Edit2 className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteSession(session.id);
                                                }}
                                                disabled={deletingSessionIds.includes(session.id)}
                                                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer disabled:opacity-50"
                                                title="Delete"
                                            >
                                                {deletingSessionIds.includes(session.id) ? (
                                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                ) : (
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="p-2 border-t border-slate-100 bg-slate-50/50">
                            <button
                                onClick={handleCreateNew}
                                disabled={isLoadingSessions}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-dashed border-slate-300 rounded-lg text-sm font-medium text-slate-600 hover:border-sky-500 hover:text-sky-600 hover:bg-sky-50 transition-all disabled:opacity-50"
                            >
                                <Plus className="w-4 h-4" />
                                New Session
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SessionSelector;
