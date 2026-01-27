import React, { useState, useEffect } from 'react';
import { Settings, Code, Palette, Copy, Eye, ArrowLeft, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { useWidget } from '../contexts/WidgetContext';
import SpeechWidget from './SpeechWidget';
import { motion, AnimatePresence } from 'framer-motion';
import { sessionApi } from '../lib/sessionApi';
import { DEFAULT_TEST_API_KEY } from '../lib/constants';

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
        isUsingDefaultKey,
        notify
    } = useWidget();

    const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
    const {
        apiKey, setApiKey,
    } = useWidget();

    const [localKey, setLocalKey] = useState(apiKey || '');
    const [showDemoModal, setShowDemoModal] = useState(false);
    const [isValidating, setIsValidating] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);
    const [isValidKey, setIsValidKey] = useState(false);

    // Validate API key
    const validateApiKey = async (key: string) => {
        if (!key || key === DEFAULT_TEST_API_KEY) {
            setValidationError(null);
            setIsValidKey(false);
            return;
        }

        setIsValidating(true);
        setValidationError(null);

        try {
            // Test the API key by making a lightweight call
            // Temporarily override the cookie to test the new key
            const { CookieUtils } = await import('../lib/cookieUtils');
            const previousKey = CookieUtils.getApiKey();
            CookieUtils.setApiKey(key);

            await sessionApi.getSessions();

            setIsValidKey(true);
            setValidationError(null);

            // Restore previous key if it was different
            if (previousKey && previousKey !== key) {
                CookieUtils.setApiKey(previousKey);
            }
        } catch (error) {
            setIsValidKey(false);
            setValidationError('Invalid API key. Please check and try again.');
        } finally {
            setIsValidating(false);
        }
    };

    // Debounce API Key update and validation
    useEffect(() => {
        const timer = setTimeout(() => {
            setApiKey(localKey);
            if (localKey && localKey !== DEFAULT_TEST_API_KEY) {
                validateApiKey(localKey);
            } else {
                setValidationError(null);
                setIsValidKey(false);
            }
        }, 1000);
        return () => clearTimeout(timer);
    }, [localKey]);

    const displayKey = isUsingDefaultKey ? 'your_api_key_here' : localKey;

    const snippet = `
<!--Clinisage Widget Snippet-->
<script>
  window.clinisageConfig = {
    agentName: "${agentName}",
    themeColor: "${themeColor}",
    backgroundColor: "${backgroundColor}",
    textColor: "${textColor}",
    position: "${position}",
    apiKey: "${displayKey}",
  };
</script>
<script src="https://adorable-donut-d43d78.netlify.app/widget.js" async></script>
`.trim();

    const copySnippet = async () => {
        if (isUsingDefaultKey) {
            setShowDemoModal(true);
            return;
        }
        try {
            await navigator.clipboard.writeText(snippet);
            notify('Widget snippet copied to clipboard!', 'success');
        } catch (err) {
            notify('Failed to copy to clipboard', 'error');
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans">
            {/* Demo Modal */}
            <AnimatePresence>
                {showDemoModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-500 to-sky-500" />
                            <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Code className="w-8 h-8 text-teal-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800 mb-2">Get Your Production Key</h3>
                            <p className="text-slate-500 mb-8 leading-relaxed">
                                To use this widget on your own EMR, you'll need a unique production API key. Book a quick 30-min demo with our team to get started.
                            </p>
                            <div className="flex flex-col gap-3">
                                <a
                                    href="https://calendly.com/contact-firstpeak/30min-1"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                                >
                                    Book Demo on Calendly
                                </a>
                                <button
                                    onClick={() => setShowDemoModal(false)}
                                    className="w-full py-4 text-slate-400 font-semibold hover:text-slate-600 transition-colors cursor-pointer"
                                >
                                    Maybe later
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <header className="bg-white border-b border-slate-200 px-6 py-4">
                <div className="w-full flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        {onBack && (
                            <button
                                onClick={onBack}
                                className="p-2 rounded-full hover:bg-slate-100 transition-all text-slate-500 hover:text-slate-800 cursor-pointer"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                        )}
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">Clinisage Plugin Builder</h1>
                            <p className="text-slate-500 text-sm mt-1">Create and customize your own conversation bar widget</p>
                        </div>
                    </div>
                    {isUsingDefaultKey && (
                        <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-teal-50 border border-teal-100 rounded-xl">
                            <span className="text-xs font-semibold text-teal-700">Ready to go live?</span>
                            <a
                                href="https://calendly.com/contact-firstpeak/30min-1"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-bold text-white bg-teal-600 px-3 py-1.5 rounded-lg hover:bg-teal-700 transition-colors shadow-sm"
                            >
                                Request Production Key
                            </a>
                        </div>
                    )}
                </div>
            </header>

            <main className="flex-1 w-full p-4 sm:p-6 flex flex-col lg:flex-row gap-6 overflow-y-auto">
                {/* Left Panel: Customize Widget */}
                <aside className="w-full lg:w-[400px] shrink-0">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden lg:sticky lg:top-8">
                        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
                                <Settings className="w-4 h-4 text-slate-600" />
                            </div>
                            <div>
                                <h2 className="font-semibold text-slate-800">Customize Plugin</h2>
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
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
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
                                            className={`px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all cursor-pointer ${position === pos
                                                ? 'bg-teal-600 border-teal-700 text-white shadow-sm'
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
                                        <label className="text-[10px] font-semibold text-slate-500 uppercase">API Key</label>
                                        <div className="relative">
                                            <input
                                                type="password"
                                                value={localKey === DEFAULT_TEST_API_KEY ? '' : localKey}
                                                onChange={(e) => setLocalKey(e.target.value)}
                                                className={`w-full bg-slate-50 border rounded-lg px-3 py-2 pr-9 text-[11px] font-mono focus:outline-none transition-all ${validationError
                                                    ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                                                    : isValidKey
                                                        ? 'border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-500/20'
                                                        : 'border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20'
                                                    }`}
                                                placeholder={isUsingDefaultKey ? "Using default test key..." : "Paste your production API key..."}
                                            />
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                {isValidating ? (
                                                    <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
                                                ) : validationError ? (
                                                    <XCircle className="w-4 h-4 text-red-500" />
                                                ) : isValidKey ? (
                                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                ) : null}
                                            </div>
                                        </div>
                                        {validationError && (
                                            <p className="text-[9px] text-red-600 leading-tight flex items-center gap-1">
                                                <XCircle className="w-3 h-3" />
                                                {validationError}
                                            </p>
                                        )}
                                        {isValidKey && !validationError && (
                                            <p className="text-[9px] text-green-600 leading-tight flex items-center gap-1">
                                                <CheckCircle2 className="w-3 h-3" />
                                                Valid API key
                                            </p>
                                        )}
                                    </div>
                                    <p className="text-[9px] text-slate-400 leading-tight">
                                        {isUsingDefaultKey
                                            ? "You are using the shared test key. To use your own, please paste a production key above."
                                            : "Providing your production API key allows real-time transcription in this preview."
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Right Panel: Tabs Preview/Code */}
                <section className="flex-1 min-h-[500px] lg:min-h-[600px] flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden text-slate-800">
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
                                        <pre className="bg-slate-900 rounded-xl p-8 text-[13px] leading-relaxed overflow-x-auto font-mono text-teal-300 shadow-xl border border-slate-800 select-none">
                                            <code>{snippet}</code>
                                        </pre>
                                        <button
                                            onClick={copySnippet}
                                            className={`absolute top-4 right-4 p-2.5 rounded-lg transition-all backdrop-blur-sm border cursor-pointer 
                                                ${isUsingDefaultKey
                                                    ? 'bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border-orange-500/20'
                                                    : 'bg-white/10 hover:bg-white/20 text-white border-white/10'}`}
                                        >
                                            <Copy className="w-4 h-4" />
                                        </button>
                                    </div>
                                    {isUsingDefaultKey && (
                                        <div className="mt-4 p-4 rounded-xl bg-orange-50 border border-orange-100 flex items-start gap-3">
                                            <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                                                <Settings className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-orange-800 mb-1">Production Key Required</p>
                                                <p className="text-[11px] text-orange-700 leading-relaxed">
                                                    You are currently using a test key. To embed this widget on your EMR, please <a href="https://calendly.com/contact-firstpeak/30min-1" target="_blank" rel="noopener noreferrer" className="underline font-bold">book a demo</a> to receive your production credentials.
                                                </p>
                                            </div>
                                        </div>
                                    )}
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
                className="w-20 bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-[11px] font-mono focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
        </div>
    </div>
);

const Tab = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, item: string }) => (
    <button
        onClick={onClick}
        className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-all relative cursor-pointer ${active ? 'text-teal-600' : 'text-slate-400 hover:text-slate-600'
            }`}
    >
        {icon}
        {label}
        {active && (
            <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600 shadow-[0_-4px_12px_rgba(13,148,136,0.3)]"
            />
        )}
    </button>
);

export default WidgetBuilder;
