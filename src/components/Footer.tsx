import React from 'react';
import { Code, ExternalLink } from 'lucide-react';

interface FooterProps {
    onLaunchDemo: () => void;
}

const Footer: React.FC<FooterProps> = ({ onLaunchDemo }) => {
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
                        <p className="text-slate-500 text-sm max-w-xs text-center md:text-left">
                            Next-generation AI medical scribe for modern healthcare workflows.
                        </p>
                    </div>

                    {/* Links */}
                    <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
                        <a
                            href="https://clinisage.ai"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-teal-600 transition-colors"
                        >
                            <ExternalLink className="w-4 h-4" />
                            Visit Clinisage.ai
                        </a>
                        <button
                            onClick={onLaunchDemo}
                            className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                        >
                            <Code className="w-4 h-4" />
                            Dev Console
                        </button>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-slate-400 text-xs">
                        © {currentYear} Clinisage. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <a href="#" className="text-slate-400 hover:text-slate-600 text-xs transition-colors">Privacy Policy</a>
                        <a href="#" className="text-slate-400 hover:text-slate-600 text-xs transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
