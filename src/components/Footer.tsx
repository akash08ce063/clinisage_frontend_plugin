import React from 'react';
import { Code } from 'lucide-react';

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
                    <div className="flex flex-wrap justify-center md:justify-end gap-x-12 gap-y-8">
                        <div className="flex flex-col gap-3">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Product</span>
                            <button
                                onClick={onLaunchDemo}
                                className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors w-fit"
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
                                href="mailto:sales@clinisage.ai"
                                className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                            >
                                Contact Sales
                            </a>
                            <div className="flex items-center gap-4 mt-1">
                                <a href="#" className="text-slate-400 hover:text-slate-600 transition-colors">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
                                </a>
                                <a href="#" className="text-slate-400 hover:text-slate-600 transition-colors">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                                </a>
                            </div>
                        </div>
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
