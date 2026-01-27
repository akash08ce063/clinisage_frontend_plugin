import React from 'react';
import { Code } from 'lucide-react';

interface FooterProps {
    onLaunchDemo: () => void;
    onShowPrivacy: () => void;
    onShowUsage: () => void;
    onShowTerms: () => void;
}

const Footer: React.FC<FooterProps> = ({ onLaunchDemo, onShowPrivacy, onShowUsage, onShowTerms }) => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative z-10 border-t border-slate-100 bg-white/50 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    {/* Logo & Info */}
                    <div className="flex flex-col items-center md:items-start gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold text-xl">
                                C
                            </div>
                            <span className="text-xl font-bold text-slate-800 tracking-tight">Clinisage</span>
                        </div>
                        <p className="text-slate-500 text-sm max-w-xs text-center md:text-left leading-relaxed">
                            Next-generation AI medical scribe for modern healthcare workflows.
                        </p>
                    </div>

                    {/* Links */}
                    <div className="flex flex-wrap justify-center md:justify-end gap-x-12 gap-y-8">
                        <div className="flex flex-col gap-3">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Product</span>
                            <button
                                onClick={onLaunchDemo}
                                className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors w-fit cursor-pointer"
                            >
                                <Code className="w-4 h-4" />
                                Dev Console
                            </button>
                            <a
                                href="https://calendly.com/contact-firstpeak/30min-1"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                            >
                                Book Demo
                            </a>
                        </div>

                        <div className="flex flex-col gap-3">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Contact</span>
                            <a
                                href="mailto:contact@firstpeak.ai"
                                className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                            >
                                contact@firstpeak.ai
                            </a>
                            <div className="flex items-center gap-4 mt-1">
                                <a
                                    href="https://x.com/pranthora"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-slate-400 hover:text-slate-900 transition-colors"
                                    title="X (Twitter)"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                    </svg>
                                </a>
                                <a
                                    href="https://www.linkedin.com/company/firstpeak-ai/posts/?feedView=all"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-slate-400 hover:text-blue-600 transition-colors"
                                    title="LinkedIn"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium">
                    <p className="text-slate-400">
                        © {currentYear} Clinisage. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <button
                            onClick={onShowPrivacy}
                            className="text-slate-400 hover:text-teal-600 transition-colors cursor-pointer"
                        >
                            Privacy Policy
                        </button>
                        <button
                            onClick={onShowUsage}
                            className="text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                        >
                            Usage Policy
                        </button>
                        <button
                            onClick={onShowTerms}
                            className="text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                        >
                            Terms of Service
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
