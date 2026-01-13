import React, { useState, useEffect } from 'react';
import { Settings, Code, Palette, Copy, Eye, ArrowLeft } from 'lucide-react';
import { useWidget } from '../contexts/WidgetContext';
import SpeechWidget from './SpeechWidget';
import { motion, AnimatePresence } from 'framer-motion';

interface WidgetBuilderProps {
    onBack?: () => void;
}

const WidgetBuilder: React.FC<WidgetBuilderProps> = ({ onBack }) => {
    const {
        themeColor, setThemeColor,
        backgroundColor, setBackgroundColor,
        textColor, setTextColor,
        agentName, setAgentName,
        position, setPosition,
    } = useWidget();

    const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
    const {
        authToken, setAuthTokenState,
    } = useWidget();

    const [localToken, setLocalToken] = useState(authToken || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MmE0MTBhLWY5NjEtNDMxOC1hNTA1LTcwMzQ1YjkzYTNmYiIsImVtYWlsIjoiaGFzaEBtYWlsLmNvIiwicm9sZSI6InByYWN0aXRpb25lciIsImV4cCI6MTczODk5NzUxMn0.N612gN5wclC833-D37q-DqId1Y2J88_w8X3yJ8_8X3o');

    // Debounce Token update
    useEffect(() => {
        const timer = setTimeout(() => {
            if (localToken) setAuthTokenState(localToken);
        }, 800);
        return () => clearTimeout(timer);
    }, [localToken, setAuthTokenState]);

    const snippet = `
<!--Clinisage Widget Snippet-->
<script>
  window.clinisageConfig = {
    agentName: "${agentName}",
    themeColor: "${themeColor}",
    backgroundColor: "${backgroundColor}",
    textColor: "${textColor}",
    position: "${position}",
    authToken: "${localToken}",
  };
</script>
<script src="https://adorable-donut-d43d78.netlify.app/widget.js" async></script>
`.trim();

    const copySnippet = () => {
        navigator.clipboard.writeText(snippet);
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 px-6 py-4">
                <div className="w-full flex items-center gap-4">
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="p-2 rounded-full hover:bg-slate-100 transition-all text-slate-500 hover:text-slate-800"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                    )}
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Voice Widget Builder</h1>
                        <p className="text-slate-500 text-sm mt-1">Create and customize your own conversation bar widget</p>
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full p-6 flex flex-col lg:flex-row gap-6">
                {/* Left Panel: Customize Widget */}
                <aside className="w-full lg:w-[400px] shrink-0">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden sticky top-8">
                        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
                                <Settings className="w-4 h-4 text-slate-600" />
                            </div>
                            <div>
                                <h2 className="font-semibold text-slate-800">Customize Widget</h2>
                                <p className="text-xs text-slate-400">Configure your voice widget appearance and behavior</p>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Widget Name */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Widget Name</label>
                                <input
                                    type="text"
                                    value={agentName}
                                    onChange={(e) => setAgentName(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                                    placeholder="Enter widget name..."
                                />
                            </div>

                            {/* Colors */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Palette className="w-4 h-4 text-slate-400" />
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Colors</span>
                                </div>

                                <ColorInput label="Primary Color" value={themeColor} onChange={setThemeColor} />
                                <ColorInput label="Background" value={backgroundColor} onChange={setBackgroundColor} />
                                <ColorInput label="Text Color" value={textColor} onChange={setTextColor} />
                            </div>

                            {/* Position */}
                            <div className="space-y-4 pt-2">
                                <div className="flex items-center gap-2">
                                    <Settings className="w-4 h-4 text-slate-400" />
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Position</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    {(['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const).map((pos) => (
                                        <button
                                            key={pos}
                                            onClick={() => setPosition(pos)}
                                            className={`px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all ${position === pos
                                                ? 'bg-sky-500 border-sky-600 text-white shadow-sm'
                                                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                                }`}
                                        >
                                            {pos.replace('-', ' ')}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Session Configuration */}
                            <div className="space-y-4 pt-2">
                                <div className="flex items-center gap-2">
                                    <Settings className="w-4 h-4 text-slate-400" />
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Session Configuration</span>
                                </div>
                                <div className="space-y-3">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-semibold text-slate-500 uppercase">Auth Token</label>
                                        <input
                                            type="text"
                                            value={localToken}
                                            onChange={(e) => setLocalToken(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[11px] font-mono focus:outline-none focus:border-sky-500 transition-all"
                                            placeholder="Paste JWT token here..."
                                        />
                                    </div>
                                    <p className="text-[9px] text-slate-400 leading-tight">
                                        Note: Providing these allows real note generation and history fetching in this builder preview.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Right Panel: Tabs Preview/Code */}
                <section className="flex-1 min-h-[600px] flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="flex border-b border-slate-200">
                        <Tab
                            item="preview"
                            active={activeTab === 'preview'}
                            onClick={() => setActiveTab('preview')}
                            icon={<Eye className="w-4 h-4" />}
                            label="Preview"
                        />
                        <Tab
                            item="code"
                            active={activeTab === 'code'}
                            onClick={() => setActiveTab('code')}
                            icon={<Code className="w-4 h-4" />}
                            label="Code"
                        />
                    </div>

                    <div className="flex-1 relative bg-slate-50/50 flex items-center justify-center p-8">
                        <AnimatePresence mode="wait">
                            {activeTab === 'preview' ? (
                                <motion.div
                                    key="preview"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="w-full h-full flex items-center justify-center relative"
                                >
                                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #000 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                                    <div className={`absolute inset-0 p-8 flex ${position === 'top-left' ? 'items-start justify-start' :
                                        position === 'top-right' ? 'items-start justify-end' :
                                            position === 'bottom-left' ? 'items-end justify-start' :
                                                'items-end justify-end'
                                        }`}>
                                        <SpeechWidget inline />
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="code"
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    className="w-full max-w-2xl"
                                >
                                    <div className="relative group">
                                        <pre className="bg-slate-900 rounded-xl p-8 text-[13px] leading-relaxed overflow-x-auto font-mono text-sky-300 shadow-xl border border-slate-800">
                                            <code>{snippet}</code>
                                        </pre>
                                        <button
                                            onClick={copySnippet}
                                            className="absolute top-4 right-4 p-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-sm border border-white/10"
                                        >
                                            <Copy className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </section>
            </main>
        </div>
    );
};

const ColorInput = ({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) => (
    <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-600">{label}</span>
        <div className="flex gap-2 items-center">
            <div
                className="w-6 h-6 rounded-md border border-slate-200 cursor-pointer shadow-sm relative overflow-hidden"
                style={{ backgroundColor: value }}
            >
                <input
                    type="color"
                    value={value.length === 7 ? value : '#000000'}
                    onChange={(e) => onChange(e.target.value)}
                    className="opacity-0 absolute inset-0 w-full h-full cursor-pointer p-0 border-0"
                />
            </div>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-20 bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-[11px] font-mono focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
        </div>
    </div>
);

const Tab = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, item: string }) => (
    <button
        onClick={onClick}
        className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-all relative ${active ? 'text-sky-600' : 'text-slate-400 hover:text-slate-600'
            }`}
    >
        {icon}
        {label}
        {active && (
            <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-500 shadow-[0_-4px_12px_rgba(14,165,233,0.3)]"
            />
        )}
    </button>
);

export default WidgetBuilder;
