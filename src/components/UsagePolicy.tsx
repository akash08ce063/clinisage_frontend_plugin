import React from 'react';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Settings,
    Shield,
    CheckCircle2,
    Users,
    XCircle,
    Database,
    AlertTriangle,
    ShieldCheck,
    Clock
} from 'lucide-react';

interface UsagePolicyProps {
    onBack: () => void;
}

const UsagePolicy: React.FC<UsagePolicyProps> = ({ onBack }) => {
    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 pb-20">
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
                    <h1 className="text-lg font-bold text-slate-800">Usage Policy</h1>
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
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <Settings className="w-8 h-8 text-blue-600" />
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4 tracking-tight">
                            Usage Policy
                        </h1>
                        <p className="text-slate-500 max-w-xl mx-auto leading-relaxed">
                            Guidelines for using Clinisage.ai services responsibly and effectively
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
                                <Settings className="w-5 h-5 text-blue-600" />
                                <h2 className="text-xl">Table of Contents</h2>
                            </div>
                            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
                                <ul className="space-y-4">
                                    {[
                                        { id: 'overview', label: '1. Overview' },
                                        { id: 'acceptable', label: '2. Acceptable Use' },
                                        { id: 'prohibited', label: '3. Prohibited Activities' },
                                        { id: 'data-guidelines', label: '4. Data Usage Guidelines' },
                                        { id: 'security', label: '5. Security Requirements' },
                                        { id: 'limits', label: '6. Usage Limits' },
                                        { id: 'monitoring', label: '7. Monitoring and Enforcement' },
                                        { id: 'violations', label: '8. Consequences of Violations' },
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

                        {/* 1. Overview */}
                        <section id="overview" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">1. Overview</h2>
                            <p className="text-slate-600 leading-relaxed mb-6">
                                This Usage Policy outlines the rules and guidelines for using Clinisage.ai services. It is designed to ensure a safe, secure, and professional environment for all users while maintaining the integrity of our platform.
                            </p>
                            <div className="bg-blue-50/50 rounded-2xl p-8 border border-blue-100">
                                <div className="flex items-start gap-4">
                                    <Shield className="w-6 h-6 text-blue-600 shrink-0 mt-1" />
                                    <div>
                                        <h3 className="text-lg font-bold text-blue-900 mb-2">Purpose</h3>
                                        <p className="text-blue-800/80 leading-relaxed font-medium">
                                            Our platform is designed to enhance healthcare delivery through AI-assisted clinical documentation. This policy ensures that all users can benefit from our services while maintaining professional standards and protecting patient privacy.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 2. Acceptable Use */}
                        <section id="acceptable" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Acceptable Use</h2>
                            <p className="text-slate-600 mb-8 font-medium">Users may use Clinisage.ai services for the following purposes:</p>
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="p-8 bg-emerald-50 rounded-2xl border border-emerald-100">
                                    <h3 className="font-bold text-emerald-900 mb-6 flex items-center gap-3 text-lg">
                                        <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                                        Clinical Documentation
                                    </h3>
                                    <ul className="space-y-4 text-emerald-800 font-medium">
                                        <li>• Creating and editing patient notes</li>
                                        <li>• Generating SOAP notes and reports</li>
                                        <li>• Using medical templates</li>
                                        <li>• Documenting patient encounters</li>
                                        <li>• Clinical decision support</li>
                                    </ul>
                                </div>
                                <div className="p-8 bg-blue-50 rounded-2xl border border-blue-100">
                                    <h3 className="font-bold text-blue-900 mb-6 flex items-center gap-3 text-lg">
                                        <Users className="w-6 h-6 text-blue-600" />
                                        Professional Activities
                                    </h3>
                                    <ul className="space-y-4 text-blue-800 font-medium">
                                        <li>• Continuing medical education</li>
                                        <li>• Quality improvement initiatives</li>
                                        <li>• Research and case studies</li>
                                        <li>• Professional collaboration</li>
                                        <li>• Administrative tasks</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* 3. Prohibited Activities */}
                        <section id="prohibited" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Prohibited Activities</h2>
                            <p className="text-slate-600 mb-8 font-medium">The following activities are strictly prohibited on our platform:</p>
                            <div className="space-y-6">
                                {[
                                    {
                                        title: 'Privacy Violations',
                                        items: [
                                            'Sharing patient information without consent',
                                            "Accessing data you're not authorized to view",
                                            'Using patient data for non-clinical purposes',
                                            'Breaching confidentiality agreements'
                                        ]
                                    },
                                    {
                                        title: 'Security Breaches',
                                        items: [
                                            'Sharing login credentials',
                                            'Attempting to hack or breach security',
                                            'Introducing malware or viruses',
                                            'Circumventing access controls'
                                        ]
                                    },
                                    {
                                        title: 'Misuse of Services',
                                        items: [
                                            'Using AI-generated content as medical advice',
                                            'Automated scraping or data extraction',
                                            'Commercial use without permission',
                                            'Harassment or inappropriate behavior'
                                        ]
                                    }
                                ].map((group, i) => (
                                    <div key={i} className="p-8 bg-rose-50 rounded-2xl border border-rose-100">
                                        <h3 className="font-bold text-rose-900 mb-6 flex items-center gap-3 text-lg">
                                            <XCircle className="w-6 h-6 text-rose-600" />
                                            {group.title}
                                        </h3>
                                        <div className="grid sm:grid-cols-1 gap-4">
                                            {group.items.map((item, j) => (
                                                <div key={j} className="text-rose-800 font-medium">• {item}</div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* 4. Data Usage Guidelines */}
                        <section id="data-guidelines" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Data Usage Guidelines</h2>
                            <p className="text-slate-600 mb-8 font-medium">When using our platform, you must follow these data handling guidelines:</p>
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="p-8 bg-blue-50 rounded-2xl border border-blue-100">
                                    <h3 className="font-bold text-blue-900 mb-6 flex items-center gap-3 text-lg">
                                        <Database className="w-6 h-6 text-blue-600" />
                                        Data Entry
                                    </h3>
                                    <ul className="space-y-4 text-blue-800 font-medium">
                                        <li>• Enter only accurate patient information</li>
                                        <li>• Verify data before submission</li>
                                        <li>• Use appropriate medical terminology</li>
                                        <li>• Follow institutional guidelines</li>
                                    </ul>
                                </div>
                                <div className="p-8 bg-emerald-50 rounded-2xl border border-emerald-100">
                                    <h3 className="font-bold text-emerald-900 mb-6 flex items-center gap-3 text-lg">
                                        <ShieldCheck className="w-6 h-6 text-emerald-600" />
                                        Data Protection
                                    </h3>
                                    <ul className="space-y-4 text-emerald-800 font-medium">
                                        <li>• Never share patient data publicly</li>
                                        <li>• Use secure networks when accessing</li>
                                        <li>• Log out after each session</li>
                                        <li>• Report any security concerns</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* 5. Security Requirements */}
                        <section id="security" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Security Requirements</h2>
                            <p className="text-slate-600 mb-8 font-medium">All users must adhere to these security requirements:</p>
                            <div className="space-y-6">
                                <div className="p-8 bg-yellow-50 rounded-2xl border-l-4 border-l-yellow-400 border-y border-r border-yellow-100">
                                    <h3 className="font-bold text-yellow-900 mb-6 flex items-center gap-3 text-lg">
                                        <AlertTriangle className="w-6 h-6 text-yellow-600" />
                                        Account Security
                                    </h3>
                                    <ul className="space-y-4 text-yellow-800 font-medium">
                                        <li>• Use strong, unique passwords</li>
                                        <li>• Enable two-factor authentication when available</li>
                                        <li>• Never share your login credentials</li>
                                        <li>• Change passwords regularly</li>
                                    </ul>
                                </div>
                                <div className="p-8 bg-blue-50 rounded-2xl border border-blue-100">
                                    <h3 className="font-bold text-blue-900 mb-6 flex items-center gap-3 text-lg">
                                        <ShieldCheck className="w-6 h-6 text-blue-600" />
                                        Device Security
                                    </h3>
                                    <ul className="space-y-4 text-blue-800 font-medium">
                                        <li>• Keep devices updated and secure</li>
                                        <li>• Use antivirus software</li>
                                        <li>• Avoid public Wi-Fi for sensitive data</li>
                                        <li>• Lock devices when unattended</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* 6. Usage Limits */}
                        <section id="limits" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Usage Limits</h2>
                            <p className="text-slate-600 mb-8 font-medium">To ensure fair usage and system stability, the following limits apply:</p>
                            <div className="grid sm:grid-cols-3 gap-4">
                                <div className="p-8 bg-white border border-slate-100 rounded-2xl text-center shadow-sm">
                                    <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4">
                                        <Clock className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-2">Session Limits</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed font-medium">
                                        Maximum 8-hour continuous sessions. Automatic logout after inactivity.
                                    </p>
                                </div>
                                <div className="p-8 bg-white border border-slate-100 rounded-2xl text-center shadow-sm">
                                    <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4">
                                        <Database className="w-6 h-6 text-emerald-600" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-2">Storage Limits</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed font-medium">
                                        Standard users: 10GB, Premium users: 100GB, Enterprise: Custom limits.
                                    </p>
                                </div>
                                <div className="p-8 bg-white border border-slate-100 rounded-2xl text-center shadow-sm">
                                    <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4">
                                        <Users className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-2">API Limits</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed font-medium">
                                        Standard: 1000 requests/day, Premium: 10000 requests/day.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* 7. Monitoring and Enforcement */}
                        <section id="monitoring" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Monitoring and Enforcement</h2>
                            <p className="text-slate-600 mb-8 font-medium">We actively monitor platform usage to ensure compliance with this policy:</p>
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="p-8 bg-blue-50 rounded-2xl border border-blue-100">
                                    <h3 className="font-bold text-blue-900 mb-6 text-lg">Automated Monitoring</h3>
                                    <ul className="space-y-4 text-blue-800 font-medium">
                                        <li>• Unusual access patterns</li>
                                        <li>• Data export frequency</li>
                                        <li>• Login attempts and locations</li>
                                        <li>• API usage patterns</li>
                                    </ul>
                                </div>
                                <div className="p-8 bg-emerald-50 rounded-2xl border border-emerald-100">
                                    <h3 className="font-bold text-emerald-900 mb-6 text-lg">Manual Review</h3>
                                    <ul className="space-y-4 text-emerald-800 font-medium">
                                        <li>• User reports and complaints</li>
                                        <li>• Security incident investigation</li>
                                        <li>• Compliance audits</li>
                                        <li>• Quality assurance reviews</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* 8. Consequences of Violations */}
                        <section id="violations" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Consequences of Violations</h2>
                            <p className="text-slate-600 mb-8 font-medium">Violations of this policy may result in the following consequences:</p>
                            <div className="space-y-6">
                                <div className="p-8 bg-yellow-50 rounded-2xl border-l-4 border-l-yellow-400 border-y border-r border-yellow-100 text-yellow-900">
                                    <h3 className="font-bold mb-6 text-lg">Minor Violations</h3>
                                    <ul className="space-y-4 font-medium opacity-90">
                                        <li>• Warning notifications</li>
                                        <li>• Temporary access restrictions</li>
                                        <li>• Required policy review</li>
                                        <li>• Additional training requirements</li>
                                    </ul>
                                </div>
                                <div className="p-8 bg-rose-50 rounded-2xl border-l-4 border-l-rose-400 border-y border-r border-rose-100 text-rose-900">
                                    <h3 className="font-bold mb-6 text-lg">Major Violations</h3>
                                    <ul className="space-y-4 font-medium opacity-90">
                                        <li>• Account suspension</li>
                                        <li>• Data access revocation</li>
                                        <li>• Legal action if necessary</li>
                                        <li>• Reporting to authorities</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* Appeal Process */}
                        <section className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
                            <h3 className="text-xl font-bold text-slate-900 mb-4">Appeal Process</h3>
                            <p className="text-slate-600 leading-relaxed font-medium">
                                Users may appeal policy violations by contacting our compliance team at <a href="mailto:contact@firstpeak.ai" className="text-blue-600 hover:underline">contact@firstpeak.ai</a>. Appeals will be reviewed within 30 days.
                            </p>
                        </section>

                        {/* Contact Help */}
                        <div className="p-12 bg-slate-50/50 rounded-[40px] border border-blue-100 text-center relative overflow-hidden group">
                            <div className="relative z-10">
                                <h3 className="text-2xl font-bold text-blue-900 mb-4 tracking-tight">Questions about this policy?</h3>
                                <p className="text-blue-800/80 font-medium mb-10 text-lg">If you have any questions about this Usage Policy, please contact us at:</p>
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

export default UsagePolicy;
