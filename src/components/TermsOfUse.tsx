import React from 'react';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    FileText,
    Shield,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    BookOpen,
    Clock
} from 'lucide-react';

interface TermsOfUseProps {
    onBack: () => void;
}

const TermsOfUse: React.FC<TermsOfUseProps> = ({ onBack }) => {
    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 pb-20">
            {/* Nav Header */}
            <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-semibold text-sm">Back</span>
                    </button>
                    <h1 className="text-lg font-bold text-slate-800">Terms of Use</h1>
                    <div className="w-16" />
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-6 pt-32">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white rounded-[32px] shadow-xl shadow-slate-200/60 border border-slate-200 overflow-hidden"
                >
                    {/* Hero Branding */}
                    <div className="p-8 sm:p-12 text-center border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white">
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <FileText className="w-8 h-8 text-blue-600" />
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4 tracking-tight">
                            Terms of Use
                        </h1>
                        <p className="text-slate-500 max-w-xl mx-auto leading-relaxed">
                            Please read these terms carefully before using Clinisage.ai services
                        </p>
                        <div className="mt-6 flex items-center justify-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                            <Clock className="w-4 h-4" />
                            Effective: January 2025
                        </div>
                    </div>

                    <div className="p-8 sm:p-12 space-y-16">
                        {/* Table of Contents */}
                        <section>
                            <div className="flex items-center gap-3 mb-6 font-bold text-slate-800">
                                <BookOpen className="w-5 h-5 text-blue-600" />
                                <h2 className="text-xl">Table of Contents</h2>
                            </div>
                            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
                                <ul className="grid sm:grid-cols-2 gap-4">
                                    {[
                                        { id: 'acceptance', label: '1. Acceptance of Terms' },
                                        { id: 'description', label: '2. Description of Service' },
                                        { id: 'eligibility', label: '3. Eligibility and Registration' },
                                        { id: 'acceptable', label: '4. Acceptable Use' },
                                        { id: 'privacy', label: '5. Privacy and Data Protection' },
                                        { id: 'intellectual', label: '6. Intellectual Property' },
                                        { id: 'disclaimers', label: '7. Disclaimers' },
                                        { id: 'liability', label: '8. Limitation of Liability' },
                                        { id: 'termination', label: '9. Termination' },
                                        { id: 'changes', label: '10. Changes to Terms' },
                                    ].map((item) => (
                                        <li key={item.id}>
                                            <a
                                                href={`#${item.id}`}
                                                className="text-base font-medium text-blue-600 hover:text-blue-700 hover:underline transition-all block"
                                            >
                                                {item.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>

                        {/* 1. Acceptance of Terms */}
                        <section id="acceptance" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">1. Acceptance of Terms</h2>
                            <p className="text-slate-600 leading-relaxed mb-8 font-medium">
                                By accessing and using the Clinisage.ai platform ("Platform"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                            </p>
                            <div className="bg-blue-50/50 rounded-2xl p-8 border-l-4 border border-blue-100 border-l-blue-500">
                                <p className="text-blue-900 leading-relaxed font-medium">
                                    <span className="font-bold">Important:</span> These terms constitute a legally binding agreement between you and Clinisage.ai. Please read them carefully before using our services.
                                </p>
                            </div>
                        </section>

                        {/* 2. Description of Service */}
                        <section id="description" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">2. Description of Service</h2>
                            <p className="text-slate-600 leading-relaxed mb-8 font-medium">
                                Clinisage.ai provides an AI-powered clinical documentation platform designed to assist healthcare professionals in:
                            </p>
                            <div className="grid sm:grid-cols-2 gap-6 mb-8">
                                <div className="p-8 bg-emerald-50 rounded-2xl border border-emerald-100">
                                    <h3 className="font-bold text-emerald-900 mb-6 text-lg">Clinical Documentation</h3>
                                    <ul className="space-y-4 text-emerald-800 font-medium">
                                        <li>• SOAP notes generation</li>
                                        <li>• Medical record templates</li>
                                        <li>• Clinical note assistance</li>
                                    </ul>
                                </div>
                                <div className="p-8 bg-blue-50 rounded-2xl border border-blue-100">
                                    <h3 className="font-bold text-blue-900 mb-6 text-lg">AI Assistance</h3>
                                    <ul className="space-y-4 text-blue-800 font-medium">
                                        <li>• Voice-to-text transcription</li>
                                        <li>• Smart editing tools</li>
                                        <li>• Task suggestions</li>
                                    </ul>
                                </div>
                            </div>
                            <p className="text-slate-500 italic text-sm font-medium">
                                The Platform is intended to enhance, not replace, clinical judgment and professional medical practice.
                            </p>
                        </section>

                        {/* 3. Eligibility and Registration */}
                        <section id="eligibility" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">3. Eligibility and Registration</h2>
                            <p className="text-slate-600 mb-8 font-medium">To use our services, you must:</p>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-1">
                                        <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 mb-1">Be a qualified healthcare professional</h3>
                                        <p className="text-slate-500 text-sm font-medium">Licensed physicians, nurses, allied health professionals, or medical students</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-1">
                                        <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 mb-1">Provide accurate registration information</h3>
                                        <p className="text-slate-500 text-sm font-medium">Valid email, professional credentials, and contact information</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-1">
                                        <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 mb-1">Be at least 18 years old</h3>
                                        <p className="text-slate-500 text-sm font-medium">Or have parental/guardian consent if under 18</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 4. Acceptable Use */}
                        <section id="acceptable" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">4. Acceptable Use</h2>
                            <p className="text-slate-600 mb-8 font-medium">You agree to use the Platform only for lawful purposes and in accordance with these Terms.</p>
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="p-8 bg-emerald-50 rounded-2xl border border-emerald-100">
                                    <h3 className="font-bold text-emerald-900 mb-6 flex items-center gap-3 text-lg">
                                        <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                                        Permitted Uses
                                    </h3>
                                    <ul className="space-y-4 text-emerald-800 font-medium">
                                        <li>• Clinical documentation and note-taking</li>
                                        <li>• Patient care coordination</li>
                                        <li>• Professional development and training</li>
                                        <li>• Administrative healthcare tasks</li>
                                        <li>• Research and quality improvement</li>
                                    </ul>
                                </div>
                                <div className="p-8 bg-rose-50 rounded-2xl border border-rose-100">
                                    <h3 className="font-bold text-rose-900 mb-6 flex items-center gap-3 text-lg">
                                        <XCircle className="w-6 h-6 text-rose-600" />
                                        Prohibited Uses
                                    </h3>
                                    <ul className="space-y-4 text-rose-800 font-medium">
                                        <li>• Unauthorized access to patient data</li>
                                        <li>• Sharing of login credentials</li>
                                        <li>• Use for non-medical purposes</li>
                                        <li>• Violation of patient privacy</li>
                                        <li>• Commercial exploitation without permission</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* 5. Privacy and Data Protection */}
                        <section id="privacy" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">5. Privacy and Data Protection</h2>
                            <p className="text-slate-600 mb-8 font-medium">
                                Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy.
                            </p>
                            <div className="p-8 bg-blue-50/50 rounded-2xl border border-blue-100">
                                <h3 className="font-bold text-blue-900 mb-6 flex items-center gap-3 text-lg">
                                    <Shield className="w-6 h-6 text-blue-600" />
                                    Data Protection Commitments
                                </h3>
                                <ul className="space-y-4 text-blue-800 font-medium">
                                    <li>• HIPAA compliance for US users</li>
                                    <li>• GDPR compliance for EU users</li>
                                    <li>• End-to-end encryption of sensitive data</li>
                                    <li>• Regular security audits and updates</li>
                                    <li>• Limited access to authorized personnel only</li>
                                </ul>
                            </div>
                        </section>

                        {/* 6. Intellectual Property */}
                        <section id="intellectual" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">6. Intellectual Property</h2>
                            <p className="text-slate-600 mb-8 font-medium">
                                The Platform and its original content, features, and functionality are owned by Clinisage.ai and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                            </p>
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100">
                                    <h3 className="font-bold text-slate-900 mb-6 text-lg">Our Rights</h3>
                                    <ul className="space-y-4 text-slate-500 font-medium">
                                        <li>• Platform software and code</li>
                                        <li>• User interface design</li>
                                        <li>• AI models and algorithms</li>
                                        <li>• Brand names and logos</li>
                                    </ul>
                                </div>
                                <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100">
                                    <h3 className="font-bold text-slate-900 mb-6 text-lg">Your Rights</h3>
                                    <ul className="space-y-4 text-slate-500 font-medium">
                                        <li>• Your clinical content</li>
                                        <li>• Patient data you input</li>
                                        <li>• Custom templates you create</li>
                                        <li>• Your professional notes</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* 7. Disclaimers */}
                        <section id="disclaimers" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">7. Disclaimers</h2>
                            <div className="p-8 bg-yellow-50 rounded-2xl border border-yellow-100">
                                <div className="flex items-center gap-3 mb-6">
                                    <AlertTriangle className="w-6 h-6 text-yellow-600" />
                                    <h3 className="text-lg font-bold text-yellow-900 uppercase tracking-wide">Important Disclaimers</h3>
                                </div>
                                <ul className="space-y-6">
                                    <li>
                                        <p className="text-yellow-900 font-bold mb-1">Not Medical Advice:</p>
                                        <p className="text-yellow-800/80 font-medium">The Platform provides assistance tools, not medical advice</p>
                                    </li>
                                    <li>
                                        <p className="text-yellow-900 font-bold mb-1">Professional Responsibility:</p>
                                        <p className="text-yellow-800/80 font-medium">You remain responsible for all clinical decisions</p>
                                    </li>
                                    <li>
                                        <p className="text-yellow-900 font-bold mb-1">No Guarantees:</p>
                                        <p className="text-yellow-800/80 font-medium">We do not guarantee accuracy of AI-generated content</p>
                                    </li>
                                    <li>
                                        <p className="text-yellow-900 font-bold mb-1">Third-party Services:</p>
                                        <p className="text-yellow-800/80 font-medium">We are not responsible for third-party integrations</p>
                                    </li>
                                </ul>
                            </div>
                        </section>

                        {/* 8. Limitation of Liability */}
                        <section id="liability" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">8. Limitation of Liability</h2>
                            <p className="text-slate-600 leading-relaxed mb-8 font-medium">
                                To the maximum extent permitted by law, Clinisage.ai shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                            </p>
                            <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100">
                                <h3 className="font-bold text-slate-900 mb-4 text-lg">Exclusions</h3>
                                <p className="text-slate-500 leading-relaxed font-medium">
                                    This limitation does not apply to damages caused by gross negligence or intentional misconduct, or where such limitation is prohibited by applicable law.
                                </p>
                            </div>
                        </section>

                        {/* 9. Termination */}
                        <section id="termination" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">9. Termination</h2>
                            <p className="text-slate-600 leading-relaxed mb-8 font-medium">
                                You may terminate your account at any time by contacting our support team. We may terminate or suspend your account immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users or the Platform.
                            </p>
                            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
                                <h3 className="font-bold text-slate-900 mb-6 text-lg">Upon Termination</h3>
                                <ul className="space-y-4 text-slate-500 font-medium">
                                    <li>• Your access to the Platform will cease immediately</li>
                                    <li>• We will retain your data as required by law</li>
                                    <li>• You may request data export within 30 days</li>
                                    <li>• Outstanding fees remain payable</li>
                                </ul>
                            </div>
                        </section>

                        {/* 10. Changes to Terms */}
                        <section id="changes" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">10. Changes to Terms</h2>
                            <p className="text-slate-600 leading-relaxed mb-8 font-medium">
                                We reserve the right to modify these Terms at any time. We will notify users of any material changes via email or through the Platform. Your continued use of the Platform after such changes constitutes acceptance of the new Terms.
                            </p>
                            <div className="bg-blue-50/50 rounded-2xl p-8 border border-blue-100">
                                <h3 className="font-bold text-blue-900 mb-6 text-lg">Notification Process</h3>
                                <ul className="space-y-4 text-blue-800 font-medium">
                                    <li>• Email notification for significant changes</li>
                                    <li>• In-app notifications for minor updates</li>
                                    <li>• 30-day notice period for major changes</li>
                                    <li>• Option to accept or terminate service</li>
                                </ul>
                            </div>
                        </section>

                        {/* Contact Help */}
                        <div className="p-12 bg-slate-50/50 rounded-[40px] border border-blue-100 text-center relative overflow-hidden group">
                            <div className="relative z-10">
                                <h3 className="text-2xl font-bold text-blue-900 mb-4 tracking-tight">Questions about these terms?</h3>
                                <p className="text-blue-800/80 font-medium mb-10 text-lg">If you have any questions about these Terms of Use, please contact us at:</p>
                                <div className="flex flex-col items-center justify-center gap-6">
                                    <a
                                        href="mailto:contact@firstpeak.ai"
                                        className="text-xl font-bold text-blue-600 hover:text-blue-700 transition-all hover:scale-105"
                                    >
                                        contact@firstpeak.ai
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default TermsOfUse;
