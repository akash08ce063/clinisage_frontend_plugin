import React, { useState, useRef } from 'react';
import { Search, Plus, ChevronDown, Calendar, Loader2, Check, Trash2, Edit2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWidget } from '../contexts/WidgetContext';
import { useClickOutside } from '../hooks/useClickOutside';

const SessionSelector: React.FC = () => {
    const {
        sessions,
        currentSession,
        isLoadingSessions,
        selectSession,
        createNewSession,
        deleteSession,
        renameSession,
        deletingSessionIds,
        themeColor
    } = useWidget();

    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    useClickOutside(dropdownRef, () => setIsOpen(false));

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
                className="w-full flex items-center cursor-pointer justify-between gap-3 px-3 py-2 bg-slate-50 border transition-all duration-200 group pointer-events-auto rounded-xl"
                style={{
                    '--hover-color': themeColor,
                    borderColor: isOpen ? themeColor : 'rgba(148, 163, 184, 0.2)', // slate-400 at 20%
                    borderStyle: 'solid',
                    borderWidth: '1px'
                } as any}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${themeColor}80`; }}
                onMouseLeave={(e) => { if (!isOpen) e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.2)'; }}
            >
                <div className="flex items-center gap-2.5 overflow-hidden">
                    <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${themeColor}20` }}
                    >
                        <Calendar className="w-3.5 h-3.5" style={{ color: themeColor }} />
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
                            <div className="relative flex items-center">
                                <Search className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search sessions..."
                                    className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none transition-all"
                                    style={{ '--ring-color': themeColor } as any}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = themeColor;
                                        e.target.style.boxShadow = `0 0 0 1px ${themeColor}20`;
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#e2e8f0'; // slate-200
                                        e.target.style.boxShadow = 'none';
                                    }}
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
                                    className="group relative flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors"
                                    style={currentSession?.id === session.id ? { backgroundColor: `${themeColor}10` } : {}}
                                >
                                    <div
                                        onClick={() => {
                                            if (editingSessionId !== session.id) {
                                                selectSession(session.id);
                                                setIsOpen(false);
                                            }
                                        }}
                                        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 cursor-pointer ${currentSession?.id === session.id ? '' : 'bg-slate-100 text-slate-500'}`}
                                        style={currentSession?.id === session.id ? { backgroundColor: `${themeColor}20`, color: themeColor } : {}}
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
                                                    className="flex-1 text-sm font-medium bg-white border rounded px-1.5 py-0.5 outline-none"
                                                    style={{ borderColor: `${themeColor}99`, color: themeColor }}
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
                                                    <p className={`text-sm font-medium truncate ${currentSession?.id === session.id ? '' : 'text-slate-700'}`}
                                                        style={currentSession?.id === session.id ? { color: themeColor } : {}}>
                                                        {session.name || 'Untitled Session'}
                                                    </p>
                                                    {/* Check icon removed */}
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
                                                className="p-1.5 text-slate-400 hover:bg-slate-50 rounded-lg transition-all cursor-pointer"
                                                style={{ '--hover-color': themeColor } as any}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.color = themeColor;
                                                    e.currentTarget.style.backgroundColor = `${themeColor}10`;
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.color = '#94a3b8';
                                                    e.currentTarget.style.backgroundColor = 'transparent';
                                                }}
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
                                className="w-full flex items-center justify-center  gap-2 px-4 py-2.5 bg-white border border-dashed border-slate-300 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all disabled:opacity-50"
                                style={{ '--hover-color': themeColor } as any}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = themeColor;
                                    e.currentTarget.style.color = themeColor;
                                    e.currentTarget.style.backgroundColor = `${themeColor}10`;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = '#cbd5e1';
                                    e.currentTarget.style.color = '#475569';
                                    e.currentTarget.style.backgroundColor = '#ffffff';
                                }}
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
