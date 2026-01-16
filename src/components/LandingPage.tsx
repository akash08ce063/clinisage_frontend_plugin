import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Database, Brain, Clock, Code, Activity } from 'lucide-react';
import LandingPageWidget from './LandingPageWidget';
import MockEHR from './MockEHR';
import Footer from './Footer';

interface LandingPageProps {
    onLaunchDemo: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLaunchDemo }) => {
    // Demo content constants
    const demoTranscript = "Patient is a 45-year-old male presenting with persistent cough for 2 weeks. He reports mild shortness of breath on exertion. No history of smoking. Lungs show scattered wheezes bilaterally.";
    const demoNote = `
<p><strong>Subjective:</strong> Patient is a 45-year-old male presenting with persistent cough for 2 weeks. Reports mild shortness of breath on exertion. No chest pain reported.</p>
<p><strong>Objective:</strong><br/>- Vitals: BP 120/80, HR 72.<br/>- Lungs: Scattered wheezes bilaterally.</p>
<p><strong>Assessment:</strong> Acute bronchitis vs. reactive airway disease.</p>
<p><strong>Plan:</strong><br/>1. Start Albuterol inhaler PRN.<br/>2. Follow up in 1 week if symptoms persist.</p>
`.trim();

    const [activeStep, setActiveStep] = useState<number>(1);

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-teal-100 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-teal-50 to-transparent pointer-events-none" />
            <div className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-sky-100 rounded-full blur-3xl opacity-40 pointer-events-none" />
            <div className="absolute top-40 -left-20 w-[400px] h-[400px] bg-teal-100 rounded-full blur-3xl opacity-40 pointer-events-none" />

            {/* Navbar */}
            <nav className="relative z-10 px-6 py-6 max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold text-xl">
                        C
                    </div>
                    <span className="text-xl font-bold text-slate-800 tracking-tight">Clinisage</span>
                </div>
                <div className="flex items-center gap-4">
                    <a
                        href="https://clinisage.ai"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg text-teal-700 font-semibold hover:bg-teal-50 transition-colors text-sm"
                    >
                        Try our EMR
                    </a>
                    <button
                        onClick={onLaunchDemo}
                        className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 text-slate-600 font-semibold hover:bg-slate-200 transition-colors text-sm"
                    >
                        <Code className="w-4 h-4" />
                        Dev Console
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-24 lg:pb-24 flex flex-col items-center text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <span className="inline-block px-4 py-1.5 rounded-full bg-teal-50 text-teal-700 text-xs font-bold uppercase tracking-widest mb-6 border border-teal-100">
                        Automated Clinical Documentation
                    </span>
                    <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-slate-900 tracking-tight leading-[1.1] mb-6 max-w-5xl mx-auto px-4">
                        Embeddable <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-sky-600">AI Medical Scribe</span> for Any EHR
                    </h1>
                    <p className="text-lg lg:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-10">
                        Integrate a secure AI medical scribe plugin into your EHR to record visits, transcribe conversations, and create structured clinical notes for review.
                    </p>

                    {/* Interactive Tabbed Control */}
                    <div className="flex items-center justify-start sm:justify-center gap-2 p-1 bg-slate-100/80 backdrop-blur-md rounded-full border border-slate-200 mb-8 w-full max-w-[90vw] sm:w-fit mx-auto overflow-x-auto scrollbar-hide">
                        {[
                            { id: 1, label: "1. Embed" },
                            { id: 2, label: "2. Capture" },
                            { id: 3, label: "3. Process" },
                            { id: 4, label: "4. Integrate" }
                        ].map((step) => (
                            <button
                                key={step.id}
                                onClick={() => setActiveStep(step.id as any)}
                                className={`
                                    px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 whitespace-nowrap
                                    ${activeStep === step.id
                                        ? 'bg-white text-slate-900 shadow-md ring-1 ring-black/5 scale-105'
                                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                                    }
                                `}
                            >
                                {step.label}
                            </button>
                        ))}
                    </div>
                </motion.div>



                {/* CTA for Customization */}
                <div className="flex justify-center mb-8">
                    <button
                        onClick={onLaunchDemo}
                        className="text-slate-500 hover:text-slate-800 font-semibold text-sm flex items-center gap-2 transition-colors"
                    >
                        Want to customize this flow?
                        <span className="underline underline-offset-4">Open Widget Builder</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

                {/* Mock EHR / Preview Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 40 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                    className="mt-8 relative w-full max-w-6xl mx-auto"
                >
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200/60 bg-white aspect-[16/10] lg:aspect-[16/9] group ring-1 ring-slate-900/5">
                        {/* The Mock EHR Dashboard */}
                        <div className={`transition-all duration-500 ease-in-out ${activeStep === 1 || activeStep === 2 || activeStep === 3 ? 'opacity-40 grayscale-[0.3] scale-[0.99]' : 'opacity-100'}`}>
                            <MockEHR
                                noteContent={demoNote}
                                activeStep={activeStep === 1 ? 0 : activeStep - 1}
                                onNextStep={() => setActiveStep(prev => (prev < 4 ? prev + 1 : 1) as any)}
                            />
                        </div>

                        {/* Demo Controller & Widget Group */}
                        <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:right-6 lg:bottom-12 lg:right-12 z-[100] flex flex-col sm:flex-row items-center sm:items-end justify-center sm:justify-end gap-3 sm:gap-4">
                            {/* Fast Navigation Controller */}
                            <div className="flex flex-row sm:flex-col items-center gap-2 mb-0 sm:mb-2 bg-white/80 backdrop-blur-md p-2 rounded-2xl border border-slate-200 sm:bg-transparent sm:border-none sm:p-0">
                                <button
                                    onClick={() => setActiveStep(prev => (prev < 4 ? prev + 1 : 1) as any)}
                                    className="px-4 sm:px-5 py-2 sm:py-2.5 bg-slate-900 shadow-xl text-white rounded-[20px] font-bold text-[10px] sm:text-xs flex items-center gap-2 hover:bg-slate-800 transition-all active:scale-95 border border-white/10 whitespace-nowrap"
                                >
                                    {activeStep === 1 && "Start Capture"}
                                    {activeStep === 2 && "Stop & Process"}
                                    {activeStep === 3 && "View results"}
                                    {activeStep === 4 && "Try Again"}
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                                <div className="px-2 sm:px-3 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 opacity-60 text-center">
                                    Step {activeStep}/4
                                </div>
                            </div>

                            <LandingPageWidget
                                activeStep={activeStep}
                                transcript={demoTranscript}
                                notes={demoNote}
                                themeColor="#0d9488"
                                onNextStep={() => setActiveStep(prev => (prev < 4 ? prev + 1 : 1) as any)}
                            />
                        </div>

                        {/* Shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </div>
                </motion.div>

                {/* Feature Highlights */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                    className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mx-auto text-left"
                >
                    <FeatureCard
                        icon={<Database className="w-6 h-6 text-teal-600" />}
                        title="EHR Integrated"
                        description="Seamlessly embeds into your existing workflow with minimal setup."
                    />
                    <FeatureCard
                        icon={<Brain className="w-6 h-6 text-sky-600" />}
                        title="Context Aware"
                        description="Understands complex medical terminology and specific patient context."
                    />
                    <FeatureCard
                        icon={<Clock className="w-6 h-6 text-indigo-600" />}
                        title="Time Saving"
                        description="Reduces clinical documentation time by up to 40% per patient."
                    />
                </motion.div>

                {/* EMR Info Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="mt-20 w-full max-w-5xl mx-auto p-8 rounded-3xl bg-gradient-to-br from-teal-600 to-sky-700 text-white relative overflow-hidden shadow-2xl group"
                >
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-white/20 transition-colors duration-700" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-400/20 rounded-full -ml-10 -mb-10 blur-2xl" />

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-left">
                        <div className="flex-1">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-wider mb-4">
                                <Activity className="w-3.5 h-3.5" />
                                Clinisage EMR
                            </div>
                            <h2 className="text-3xl font-bold mb-4 tracking-tight">Need a full EMR solution?</h2>
                            <p className="text-teal-50/80 text-lg leading-relaxed max-w-xl">
                                Experience <strong>Clinisage EMR</strong> — our complete, AI-first clinical platform designed for maximum productivity. Integrated scribing, smart patient records, and automated charting in one place.
                            </p>
                        </div>
                        <div className="shrink-0">
                            <a
                                href="https://clinisage.ai"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-teal-700 font-bold hover:bg-teal-50 transition-all hover:shadow-xl hover:-translate-y-1 active:scale-95 group/btn shadow-lg"
                            >
                                Visit Clinisage.ai
                                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                            </a>
                        </div>
                    </div>
                </motion.div>
            </main>

            <Footer onLaunchDemo={onLaunchDemo} />
        </div>
    );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center mb-4 shadow-sm">
            {icon}
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
        <p className="text-slate-500 leading-relaxed text-sm">
            {description}
        </p>
    </div>
);

export default LandingPage;
