import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Phone, ChevronDown, MessageSquare, FileText, Loader2, Keyboard, Calendar, User } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface LandingPageWidgetProps {
    activeStep: number;
    transcript: string;
    notes: string;
    themeColor?: string;
    onNextStep?: () => void;
}

const LandingPageWidget: React.FC<LandingPageWidgetProps> = ({
    activeStep,
    transcript,
    notes,
    themeColor = '#0d9488',
    onNextStep
}) => {
    // Demo states
    const [isExpanded, setIsExpanded] = useState(false);
    const [displayedTranscript, setDisplayedTranscript] = useState('');
    const [visualizerData, setVisualizerData] = useState<number[]>(new Array(15).fill(0));
    const [activeTab, setActiveTab] = useState<'transcript' | 'notes'>('transcript');

    // Animation refs
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const transcriptRef = useRef('');

    // Style constants
    const textColor = 'rgba(15, 23, 42, 0.9)';

    // Handle step transitions
    useEffect(() => {
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

        if (activeStep === 1) {
            setIsExpanded(false);
            setDisplayedTranscript('');
        } else if (activeStep === 2) {
            setIsExpanded(true);
            setActiveTab('transcript');
            setDisplayedTranscript('');
            transcriptRef.current = '';

            let currentIndex = 0;
            const fullText = transcript;

            const typeLetter = () => {
                if (currentIndex < fullText.length) {
                    transcriptRef.current += fullText.charAt(currentIndex);
                    setDisplayedTranscript(transcriptRef.current);
                    currentIndex++;
                    typingTimeoutRef.current = setTimeout(typeLetter, Math.random() * 20 + 10);
                }
            };

            typingTimeoutRef.current = setTimeout(typeLetter, 600);

        } else if (activeStep === 3) {
            setIsExpanded(false);
            setDisplayedTranscript(transcript);
        } else if (activeStep === 4) {
            setIsExpanded(true);
            setActiveTab('notes');
            setDisplayedTranscript(transcript);
        }

        return () => {
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        };
    }, [activeStep, transcript]);

    // Visualizer loop
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (activeStep === 2) {
            interval = setInterval(() => {
                setVisualizerData(Array.from({ length: 15 }, () => Math.random() * 0.8 + 0.1));
            }, 80);
        } else {
            setVisualizerData(new Array(15).fill(0.04));
        }
        return () => clearInterval(interval);
    }, [activeStep]);

    const IconButton = ({ icon, onClick, active, color, disabled, className = "" }: { icon: React.ReactNode, onClick: () => void, active?: boolean, color?: string, disabled?: boolean, className?: string }) => (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center ${disabled ? 'opacity-20 grayscale cursor-not-allowed' : ''} ${className}`}
            style={{
                color: active ? (color || themeColor) : 'rgba(148, 163, 184, 0.8)',
                backgroundColor: active ? 'rgba(0, 0, 0, 0.04)' : 'transparent'
            }}
        >
            {icon}
        </button>
    );

    const VoiceAssistantBadge = () => (
        <div className="bg-[#f1f5f9] px-6 py-3 rounded-2xl flex items-center justify-center min-h-[50px]">
            <span className="text-[14px] font-bold text-slate-900 tracking-tight">Voice Assistant</span>
        </div>
    );

    const HeaderSelector = ({ icon, label, sublabel }: { icon: React.ReactNode, label: string, sublabel: string }) => (
        <div className="flex-1 px-2.5 py-2 rounded-2xl border border-slate-100 bg-white flex items-center gap-2 shadow-xs cursor-pointer hover:bg-slate-50 transition-colors">
            <div className={`p-1.5 rounded-lg scale-90 shrink-0 ${label.includes('SESSION') ? 'bg-sky-50 text-sky-500' : 'bg-white text-slate-400 border border-slate-100'}`}>
                {icon}
            </div>
            <div className="flex-1 text-left min-w-0">
                <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</div>
                <div className="text-[11px] font-bold text-slate-800 truncate">{sublabel}</div>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-300 shrink-0" />
        </div>
    );

    return (
        <div className="flex flex-col items-center group/widget">
            <motion.div
                animate={{
                    height: isExpanded ? 480 : 76,
                    width: isExpanded ? 'min(400px, 92vw)' : 'min(400px, 92vw)',
                    borderRadius: isExpanded ? 24 : 16
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="bg-white border shadow-2xl overflow-hidden flex flex-col relative"
                style={{
                    borderColor: 'rgba(0,0,0,0.08)',
                    backgroundColor: '#ffffff'
                }}
            >
                <AnimatePresence mode="wait">
                    {isExpanded ? (
                        /* EXPANDED VIEW */
                        <motion.div
                            key="expanded"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col h-full w-full"
                        >
                            {/* Header based on production ConversationBar */}
                            <div className="p-2 border-b flex items-center gap-2" style={{ borderColor: 'rgba(0,0,0,0.04)' }}>
                                <HeaderSelector
                                    icon={<Calendar className="w-4 h-4" />}
                                    label="Active Session"
                                    sublabel="Select a session"
                                />
                                <HeaderSelector
                                    icon={<User className="w-4 h-4" />}
                                    label="Select Patient"
                                    sublabel="Search patient..."
                                />
                            </div>

                            {/* Tabs Switcher matching production */}
                            <div className="flex items-center gap-1 p-1 px-3 border-b" style={{ borderColor: 'rgba(0,0,0,0.04)' }}>
                                <button
                                    onClick={() => setActiveTab('transcript')}
                                    className="flex items-center justify-center gap-2 py-1.5 px-4 rounded-lg text-[11px] font-bold transition-all"
                                    style={{
                                        backgroundColor: activeTab === 'transcript' ? 'rgba(0,0,0,0.05)' : 'transparent',
                                        color: activeTab === 'transcript' ? textColor : 'rgba(0,0,0,0.4)'
                                    }}
                                >
                                    <MessageSquare className="w-3.5 h-3.5" />
                                    Transcript
                                </button>
                                <button
                                    onClick={() => setActiveTab('notes')}
                                    className="flex items-center justify-center gap-2 py-1.5 px-4 rounded-lg text-[11px] font-bold transition-all"
                                    style={{
                                        backgroundColor: activeTab === 'notes' ? 'rgba(0,0,0,0.05)' : 'transparent',
                                        color: activeTab === 'notes' ? textColor : 'rgba(0,0,0,0.4)'
                                    }}
                                >
                                    <FileText className="w-3.5 h-3.5" />
                                    Notes
                                </button>
                            </div>

                            {/* Content Area matching production */}
                            <div className="flex-1 relative rounded-xl m-1 mb-2 overflow-hidden" style={{ backgroundColor: 'rgba(0,0,0,0.03)' }}>
                                <AnimatePresence mode="popLayout" initial={false}>
                                    {activeTab === 'transcript' ? (
                                        <motion.div
                                            key="trans-content"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 p-4 overflow-y-auto scrollbar-hide flex flex-col"
                                        >
                                            {displayedTranscript ? (
                                                <p className="text-[14px] leading-relaxed text-slate-900 whitespace-pre-wrap font-sans">
                                                    {displayedTranscript}
                                                    {activeStep === 2 && <span className="inline-block w-0.5 h-4 bg-teal-500 ml-0.5 animate-pulse align-middle" />}
                                                </p>
                                            ) : (
                                                <div className="flex-1 flex flex-col items-center justify-center text-slate-300 gap-2">
                                                    <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center">
                                                        <MessageSquare className="w-5 h-5 text-slate-300" />
                                                    </div>
                                                    <span className="text-[11px] font-bold uppercase tracking-widest opacity-30">No transcript yet</span>
                                                </div>
                                            )}
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="notes-content"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 bg-white"
                                        >
                                            <div className="p-4 h-full overflow-y-auto custom-scrollbar flex flex-col">
                                                {activeStep === 4 ? (
                                                    <div
                                                        className="prose prose-sm max-w-none prose-p:text-slate-600 prose-headings:text-slate-900 prose-strong:text-teal-700 font-sans"
                                                        style={{ fontSize: '14px', lineHeight: '1.6' }}
                                                        dangerouslySetInnerHTML={{ __html: notes }}
                                                    />
                                                ) : (
                                                    <div className="flex-1 flex flex-col items-center justify-center text-slate-300 gap-3 text-center px-6">
                                                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 placeholder:opacity-20">
                                                            <FileText className="w-8 h-8 opacity-20" />
                                                        </div>
                                                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-20">No clinical note</span>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Bottom Controls Area matching production */}
                            <div className="flex items-center justify-between p-3 px-4 pt-0">
                                <div
                                    className="px-4 py-2.5 rounded-xl flex items-center gap-1.5 flex-grow max-w-[180px] h-[40px] justify-center overflow-hidden"
                                    style={{ backgroundColor: 'rgba(0,0,0,0.03)' }}
                                >
                                    <div className="flex items-center gap-1 h-full">
                                        {visualizerData.slice(0, 15).map((v, i) => (
                                            <div
                                                key={i}
                                                className="w-[3px] rounded-full transition-all duration-75"
                                                style={{
                                                    backgroundColor: activeStep === 2 ? themeColor : 'rgba(148, 163, 184, 0.2)',
                                                    height: `${Math.max(4, v * 100)}%`,
                                                    opacity: 0.3 + (v * 0.7),
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <IconButton
                                        icon={activeStep === 2 ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5 opacity-40 text-slate-300" />}
                                        onClick={() => { }}
                                        active={activeStep === 2}
                                        color={activeStep === 2 ? themeColor : undefined}
                                    />
                                    <IconButton
                                        icon={<ChevronDown className="w-5 h-5 text-slate-300" />}
                                        onClick={() => setIsExpanded(false)}
                                    />
                                    <button
                                        onClick={() => onNextStep ? onNextStep() : setIsExpanded(false)}
                                        className={`p-3 sm:p-2.5 rounded-full transition-all cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center
                                            ${activeStep === 2 ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-black/5 text-black hover:bg-black/10'}`}
                                    >
                                        <Phone className={`w-5 h-5 ${activeStep === 2 ? 'rotate-[135deg]' : ''}`} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        /* COLLAPSED PILL (MATCHING SCREENSHOT 2) */
                        <motion.div
                            key="collapsed"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-4 p-3 h-full w-full"
                        >
                            <div className="ml-1">
                                <VoiceAssistantBadge />
                            </div>

                            <div className="flex-1 flex items-center justify-center">
                                {activeStep === 3 ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
                                        <span className="text-[12px] font-bold text-slate-600 tracking-tight">Processing...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-8">
                                        <Mic className="w-5 h-5 text-slate-200" />
                                        <Keyboard className="w-5 h-5 text-slate-200" />
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-3 pr-2">
                                <div className="w-[1px] h-8 bg-slate-100/80 mx-1" />
                                <button
                                    onClick={() => onNextStep ? onNextStep() : setIsExpanded(true)}
                                    className={`p-3 sm:p-2.5 rounded-full transition-all cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center
                                        ${activeStep === 2 || activeStep === 3 ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-black/5 text-black hover:bg-black/10'}`}
                                >
                                    <Phone className={`w-5 h-5 ${activeStep === 2 || activeStep === 3 ? 'rotate-[135deg]' : ''}`} />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default LandingPageWidget;
