import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useWidget } from '../contexts/WidgetContext';
import ConversationBar from './ConversationBar';

interface SpeechWidgetProps {
    inline?: boolean;
}

const SpeechWidget: React.FC<SpeechWidgetProps> = ({ inline }) => {
    const { position } = useWidget();

    const getPositionClasses = () => {
        switch (position) {
            case 'top-left': return 'top-6 left-6 items-start';
            case 'top-right': return 'top-6 right-6 items-end';
            case 'bottom-left': return 'bottom-6 left-6 items-start';
            case 'bottom-right':
            default: return 'bottom-6 right-6 items-end';
        }
    };

    return (
        <div className={`${inline ? 'relative' : `fixed ${getPositionClasses()} z-50`} flex flex-col gap-4 pointer-events-none`}>
            <AnimatePresence>
                {/* {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="w-[400px] h-[600px] rounded-3xl overflow-hidden shadow-2xl flex flex-col pointer-events-auto border"
                        style={{
                            backgroundColor: backgroundColor,
                            borderColor: backgroundColor === '#ffffff' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)',
                            color: textColor
                        }}
                    >


                        <div className="flex-1 overflow-y-auto p-6 space-y-6">


                            <section className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 opacity-60">
                                        <FileText className="w-4 h-4" />
                                        Clinical Note
                                    </h4>
                                    <button
                                        onClick={generateNote}
                                        disabled={!transcript}
                                        className="text-[10px] px-3 py-1.5 rounded-full font-bold transition-all disabled:opacity-20"
                                        style={{
                                            backgroundColor: backgroundColor === '#ffffff' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)',
                                            color: textColor
                                        }}
                                    >
                                        Generate
                                    </button>
                                </div>
                                <div
                                    className="p-4 rounded-2xl border min-h-[150px] text-sm leading-relaxed"
                                    style={{
                                        backgroundColor: backgroundColor === '#ffffff' ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.05)',
                                        borderColor: backgroundColor === '#ffffff' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'
                                    }}
                                >
                                    {notes || <span className="opacity-20 italic">Notes will appear here...</span>}
                                </div>
                            </section>
                        </div>


                        <div className="p-4 border-t" style={{ backgroundColor: backgroundColor === '#ffffff' ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.05)', borderColor: backgroundColor === '#ffffff' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)' }}>
                            <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest opacity-40">
                                <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-500' : isConnecting ? 'bg-yellow-500' : 'bg-red-500'} ${isConnected ? 'animate-pulse' : ''}`} />
                                {isConnected ? 'Live Connection Active' : isConnecting ? 'Connecting...' : 'Disconnected'}
                            </div>
                        </div>
                    </motion.div>
                )} */}
                <></>
            </AnimatePresence>

            <div className="pointer-events-auto">
                <ConversationBar />
            </div>
        </div>
    );
};

export default SpeechWidget;
