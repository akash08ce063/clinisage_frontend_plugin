import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, User, Loader2, Check, X, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWidget } from '../contexts/WidgetContext';

const PatientSelector: React.FC = () => {
    const {
        patients,
        currentSession,
        isLoadingPatients,
        fetchPatients,
        addPatient,
        linkPatient,
        themeColor,
        backgroundColor,
        textColor,
        notify,
        isLinkingPatient
    } = useWidget();

    const [isOpen, setIsOpen] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [newName, setNewName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && patients.length === 0) {
            fetchPatients();
        }
    }, [isOpen, patients.length, fetchPatients]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredPatients = patients.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.email || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAddPatient = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName.trim()) return;

        try {
            const added = await addPatient(newName, newEmail);
            await linkPatient(added.id);
            setNewName('');
            setNewEmail('');
            setIsAdding(false);
            setIsOpen(false);
        } catch (err) {
            console.error('Failed to add and link patient:', err);
        }
    };

    const handleSelectPatient = async (patientId: string) => {
        try {
            await linkPatient(patientId);
            setIsOpen(false);
        } catch (err) {
            console.error('Failed to link patient:', err);
        }
    };

    const isLight = backgroundColor === '#ffffff';

    const selectedPatient = patients.find(p => p.id === currentSession?.patient_id);
    const displayName = selectedPatient?.name || currentSession?.patient_name || 'Select Patient';

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => {
                    if (!currentSession) {
                        notify('Please first select or create a new session', 'error');
                        return;
                    }
                    setIsOpen(!isOpen);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all text-[11px] font-bold uppercase tracking-wider cursor-pointer h-8 ${currentSession?.patient_id ? 'border-sky-500 text-sky-500 bg-sky-50/50' : 'opacity-60'}`}
                style={{
                    backgroundColor: isLight ? (currentSession?.patient_id ? 'rgba(14, 165, 233, 0.05)' : 'rgba(0,0,0,0.02)') : 'rgba(255,255,255,0.05)',
                    borderColor: currentSession?.patient_id ? '#0ea5e9' : (isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'),
                    color: currentSession?.patient_id ? '#0ea5e9' : textColor,
                }}
            >
                {isLinkingPatient ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                    <User className="w-3.5 h-3.5 shrink-0" />
                )}
                <span className="truncate max-w-[140px]">
                    {isLinkingPatient ? 'Linking...' : displayName}
                </span>
                {!isLinkingPatient && <ChevronDown className={`w-3 h-3 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        className="absolute top-full right-[-8px] mt-2 w-[calc(400px-16px)] rounded-2xl shadow-2xl border overflow-hidden flex flex-col z-[100]"
                        style={{
                            backgroundColor: backgroundColor,
                            borderColor: isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'
                        }}
                    >
                        {!isAdding ? (
                            <>
                                {/* Header */}
                                <div className="p-3 border-b flex items-center justify-between" style={{ borderColor: isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)' }}>
                                    <div className="flex items-center gap-2 px-2 py-1.5 rounded-xl border flex-1 mr-2" style={{ backgroundColor: isLight ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.05)', borderColor: `${themeColor}20` }}>
                                        <Search className="w-3.5 h-3.5 opacity-40" />
                                        <input
                                            type="text"
                                            placeholder="Search patients..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="bg-transparent border-none outline-none text-xs w-full focus:ring-0"
                                            style={{ color: textColor }}
                                        />
                                    </div>
                                    <button
                                        onClick={() => setIsAdding(true)}
                                        className="p-2 rounded-xl hover:bg-sky-50 transition-colors text-sky-500 cursor-pointer"
                                        title="Add New Patient"
                                    >
                                        <UserPlus className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* List */}
                                <div className="max-h-[240px] overflow-y-auto no-scrollbar py-1">
                                    {isLoadingPatients ? (
                                        <div className="flex items-center justify-center py-8">
                                            <Loader2 className="w-5 h-5 animate-spin text-sky-500" />
                                        </div>
                                    ) : filteredPatients.length > 0 ? (
                                        filteredPatients.map((patient) => (
                                            <button
                                                key={patient.id}
                                                onClick={() => handleSelectPatient(patient.id)}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors text-left group"
                                            >
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-sky-100 group-hover:text-sky-500 transition-colors">
                                                    <User className="w-4 h-4" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-bold truncate" style={{ color: textColor }}>{patient.name}</p>
                                                    {patient.email && <p className="text-[10px] opacity-40 truncate" style={{ color: textColor }}>{patient.email}</p>}
                                                </div>
                                                {currentSession?.patient_id === patient.id && (
                                                    <Check className="w-3.5 h-3.5 text-sky-500" />
                                                )}
                                            </button>
                                        ))
                                    ) : (
                                        <div className="py-8 text-center px-4">
                                            <p className="text-[11px] opacity-40" style={{ color: textColor }}>No patients found</p>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <form onSubmit={handleAddPatient} className="p-4 flex flex-col gap-3">
                                <div className="flex items-center justify-between mb-1">
                                    <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-40" style={{ color: textColor }}>Add New Patient</h3>
                                    <button
                                        type="button"
                                        onClick={() => setIsAdding(false)}
                                        className="p-1 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                                    >
                                        <X className="w-3.5 h-3.5" style={{ color: textColor }} />
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <label className="text-[9px] font-bold uppercase tracking-widest mb-1 block opacity-30" style={{ color: textColor }}>Full Name</label>
                                        <input
                                            autoFocus
                                            type="text"
                                            value={newName}
                                            onChange={(e) => setNewName(e.target.value)}
                                            placeholder="Patient Name"
                                            className="w-full px-3 py-2 rounded-xl border text-xs outline-none focus:ring-1 transition-all"
                                            style={{ backgroundColor: isLight ? 'white' : 'rgba(255,255,255,0.05)', borderColor: isLight ? '#e2e8f0' : 'rgba(255,255,255,0.1)', color: textColor, '--tw-ring-color': themeColor } as any}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-bold uppercase tracking-widest mb-1 block opacity-30" style={{ color: textColor }}>Email (Optional)</label>
                                        <input
                                            type="email"
                                            value={newEmail}
                                            onChange={(e) => setNewEmail(e.target.value)}
                                            placeholder="patient@example.com"
                                            className="w-full px-3 py-2 rounded-xl border text-xs outline-none focus:ring-1 transition-all"
                                            style={{ backgroundColor: isLight ? 'white' : 'rgba(255,255,255,0.05)', borderColor: isLight ? '#e2e8f0' : 'rgba(255,255,255,0.1)', color: textColor, '--tw-ring-color': themeColor } as any}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={!newName.trim() || isLoadingPatients}
                                    className="w-full mt-2 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest text-white transition-all disabled:opacity-50 cursor-pointer shadow-lg active:scale-[0.98]"
                                    style={{ backgroundColor: themeColor }}
                                >
                                    {isLoadingPatients ? (
                                        <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                                    ) : (
                                        'Create & Link'
                                    )}
                                </button>
                            </form>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PatientSelector;
