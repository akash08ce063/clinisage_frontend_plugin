import React from 'react';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Shield,
    Lock,
    Clock,
    Users,
    Database,
    Activity,
    UserCheck,
    Eye,
    Heart
} from 'lucide-react';

interface PrivacyPolicyProps {
    onBack: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-teal-100 pb-20">
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
                    <h1 className="text-lg font-bold text-slate-800">Privacy Policy</h1>
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
                            <Shield className="w-8 h-8 text-blue-600" />
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4 tracking-tight">
                            Privacy Policy
                        </h1>
                        <p className="text-slate-500 max-w-xl mx-auto leading-relaxed">
                            Learn how we safeguard your personal information and ensure data security at Clinisage.ai
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
                                <Lock className="w-5 h-5 text-blue-500" />
                                <h2 className="text-xl">Table of Contents</h2>
                            </div>
                            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
                                <ul className="space-y-4">
                                    {[
                                        { id: 'help', label: "1. We're here to help. Get in touch." },
                                        { id: 'about', label: '2. About us' },
                                        { id: 'collect', label: '3. What information do we collect?' },
                                        { id: 'how-collect', label: '4. How do we collect your information?' },
                                        { id: 'use', label: '5. How do we use your information?' },
                                        { id: 'protect', label: '6. How do we protect your information?' },
                                        { id: 'rights', label: '7. What are your rights?' },
                                        { id: 'changes', label: '8. Changes to this policy' },
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

                        {/* 1. We're here to help. Get in touch. */}
                        <section id="help" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">1. We're here to help. Get in touch.</h2>
                            <p className="text-slate-600 leading-relaxed mb-6 font-medium">
                                You can get in touch with us at any time about the way we handle and safeguard your information.
                            </p>
                            <p className="text-slate-600 mb-4 font-bold">If you want to:</p>
                            <ul className="space-y-3 text-slate-500 font-medium mb-8">
                                <li>• ask questions</li>
                                <li>• update your information</li>
                                <li>• update or delete your Clinisage.ai account</li>
                                <li>• change your user preferences</li>
                                <li>• register a concern</li>
                                <li>• opt out of marketing</li>
                                <li>• anything else...</li>
                            </ul>
                            <p className="text-slate-600 font-medium leading-relaxed">
                                We're just a call or a few clicks away. If you have any questions or complaints about how we handle your information, you can get in touch with us at <a href="mailto:contact@firstpeak.ai" className="text-blue-600 hover:underline">contact@firstpeak.ai</a>
                            </p>
                        </section>

                        {/* 2. About us */}
                        <section id="about" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">2. About us</h2>
                            <div className="space-y-6">
                                <p className="text-slate-600 leading-relaxed font-medium">
                                    As part of our service, we provide the Clinisage.ai Platform application (Platform) to qualified medical practitioners (including their relevant medical clinic) and other health professionals (Practitioners) for patients of Practitioners.
                                </p>
                                <p className="text-slate-600 leading-relaxed font-medium">
                                    The Platform facilitates the delivery of healthcare services including by:
                                </p>
                                <ul className="space-y-4">
                                    <li className="text-slate-600 leading-relaxed">
                                        <span className="font-bold text-slate-900">• we, our or us</span> – we mean <span className="font-bold text-slate-900">Clinisage.ai</span>, and our related bodies corporate
                                    </li>
                                    <li className="text-slate-600 leading-relaxed">
                                        <span className="font-bold text-slate-900">• our services</span> – we mean the provision of the Platform to you as a Practitioner and related services that we provide
                                    </li>
                                    <li className="text-slate-600 leading-relaxed">
                                        <span className="font-bold text-slate-900">• you</span> - we mean you, the reader of this policy
                                    </li>
                                    <li className="text-slate-600 leading-relaxed">
                                        <span className="font-bold text-slate-900">• your information</span> – we mean your personal information that you may share with us
                                    </li>
                                    <li className="text-slate-600 leading-relaxed">
                                        <span className="font-bold text-slate-900">• privacy laws</span> – we mean all privacy and data protection laws that apply to us when we handle your information, including applicable health information laws
                                    </li>
                                </ul>
                            </div>
                        </section>

                        {/* 3. What information do we collect? */}
                        <section id="collect" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">3. What information do we collect?</h2>
                            <p className="text-slate-600 leading-relaxed mb-8 font-medium">
                                We collect and hold the following categories of information, including personal information, health information, payment information, device information, and general information to help us improve our services.
                            </p>
                            <div className="space-y-6">
                                <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Users className="w-5 h-5 text-blue-600" />
                                        <h3 className="text-lg font-bold text-slate-900">Your general personal information</h3>
                                    </div>
                                    <p className="text-slate-500 font-medium leading-relaxed">
                                        This includes information or an opinion about you that is reasonably identifiable. For example: your name, address, age or date of birth, gender, contact number and email address. Where you are a Practitioner, we may also collect information relating to your qualifications, registrations, training and educational background.
                                    </p>
                                </div>
                                <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Database className="w-5 h-5 text-blue-600" />
                                        <h3 className="text-lg font-bold text-slate-900">Your health information</h3>
                                    </div>
                                    <p className="text-slate-500 font-medium leading-relaxed">
                                        This includes any health information that Practitioners provide when accessing or using our website, Platform or other services. We may collect health information from you for the purposes of facilitating the delivery of healthcare services by you. We may also collect health information of Patients from Practitioners, including where a Practitioner has treated a Patient arising out of, or in connection with the Platform.
                                    </p>
                                </div>
                                <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Activity className="w-5 h-5 text-blue-600" />
                                        <h3 className="text-lg font-bold text-slate-900">Device information</h3>
                                    </div>
                                    <p className="text-slate-500 font-medium leading-relaxed">
                                        This includes your device ID, device type, geo-location information, computer and connection information, statistics on page views, traffic to and from the sites, ad data, IP address and standard web log information.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* 4. How do we collect your information? */}
                        <section id="how-collect" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">4. How do we collect your information?</h2>
                            <p className="text-slate-600 leading-relaxed mb-8 font-medium">
                                We collect your personal information when you engage with us or from third parties. In many instances, we collect personal information directly from you. Here are some of the main ways:
                            </p>
                            <div className="grid sm:grid-cols-3 gap-6">
                                <div className="p-8 bg-blue-50/50 rounded-2xl border border-blue-100">
                                    <h3 className="font-bold text-blue-900 mb-4 text-lg text-center">Registration</h3>
                                    <p className="text-blue-800/80 font-medium leading-relaxed text-sm text-center">
                                        When you register on our website or Platform.
                                    </p>
                                </div>
                                <div className="p-8 bg-emerald-50/50 rounded-2xl border border-emerald-100 text-center">
                                    <h3 className="font-bold text-emerald-900 mb-4 text-lg">Communication</h3>
                                    <p className="text-emerald-800/80 font-medium leading-relaxed text-sm">
                                        Where you communicate with us through correspondence, questionnaires, chats, email, or when you share information with us from other services or websites.
                                    </p>
                                </div>
                                <div className="p-8 bg-purple-50/50 rounded-2xl border border-purple-100 text-center">
                                    <h3 className="font-bold text-purple-900 mb-4 text-lg">Interaction</h3>
                                    <p className="text-purple-800/80 font-medium leading-relaxed text-sm">
                                        When you interact with our sites, Platform, services, content and advertising or use our Platform or services.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* 5. How do we use your information? */}
                        <section id="use" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">5. How do we use your information?</h2>
                            <p className="text-slate-600 leading-relaxed mb-8 font-medium">
                                We use your information for the following purposes:
                            </p>
                            <ul className="space-y-4 text-slate-600 font-medium">
                                <li className="flex items-start gap-4 text-slate-500 font-medium">
                                    • To provide and maintain our Platform and services
                                </li>
                                <li className="flex items-start gap-4 text-slate-500 font-medium">
                                    • To process and complete transactions
                                </li>
                                <li className="flex items-start gap-4 text-slate-500 font-medium">
                                    • To send you technical notices, updates, security alerts, and support messages
                                </li>
                                <li className="flex items-start gap-4 text-slate-500 font-medium">
                                    • To respond to your comments, questions, and customer service requests
                                </li>
                                <li className="flex items-start gap-4 text-slate-500 font-medium">
                                    • To communicate with you about products, services, offers, and events
                                </li>
                                <li className="flex items-start gap-4 text-slate-500 font-medium">
                                    • To monitor and analyze trends, usage, and activities in connection with our services
                                </li>
                                <li className="flex items-start gap-4 text-slate-500 font-medium">
                                    • To detect, investigate, and prevent fraudulent transactions and other illegal activities
                                </li>
                                <li className="flex items-start gap-4 text-slate-500 font-medium">
                                    • To protect the rights and property of Clinisage.ai and others
                                </li>
                            </ul>
                        </section>

                        {/* 6. How do we protect your information? */}
                        <section id="protect" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">6. How do we protect your information?</h2>
                            <p className="text-slate-600 leading-relaxed mb-8 font-medium">
                                We take a number of measures to keep your information safe.
                            </p>
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100">
                                    <h3 className="font-bold text-slate-800 mb-4 text-lg">Staff training</h3>
                                    <p className="text-slate-500 font-medium leading-relaxed">
                                        We put our staff through training about how to keep your information safe and secure at all times.
                                    </p>
                                </div>
                                <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100">
                                    <h3 className="font-bold text-slate-800 mb-4 text-lg">Secure storage</h3>
                                    <p className="text-slate-500 font-medium leading-relaxed">
                                        We use a combination of techniques and measures to maintain the security of our website and Platform and to protect your account and your information.
                                    </p>
                                </div>
                                <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100">
                                    <h3 className="font-bold text-slate-800 mb-4 text-lg">Data retention</h3>
                                    <p className="text-slate-500 font-medium leading-relaxed">
                                        We only keep your information for as long as we need it or are lawfully required to keep it.
                                    </p>
                                </div>
                                <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100">
                                    <h3 className="font-bold text-slate-800 mb-4 text-lg">Encryption</h3>
                                    <p className="text-slate-500 font-medium leading-relaxed">
                                        All sensitive data is encrypted both in transit and at rest using industry-standard encryption protocols.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* 7. What are your rights? */}
                        <section id="rights" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">7. What are your rights?</h2>
                            <p className="text-slate-600 leading-relaxed mb-8 font-medium">
                                You have rights in relation to your personal information. You can contact us to exercise any of your rights in relation to your information at any time while you use our website, Platform or other services.
                            </p>
                            <div className="grid sm:grid-cols-3 gap-6">
                                <div className="p-8 bg-blue-50/50 rounded-2xl border border-blue-100 text-center flex flex-col items-center">
                                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4 text-blue-600">
                                        <Eye className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-bold text-blue-900 mb-2">Access</h3>
                                    <p className="text-blue-800/70 text-sm font-medium">You can request a copy of your information.</p>
                                </div>
                                <div className="p-8 bg-emerald-50/50 rounded-2xl border border-emerald-100 text-center flex flex-col items-center">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-4 text-emerald-600">
                                        <UserCheck className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-bold text-emerald-900 mb-2">Correct</h3>
                                    <p className="text-emerald-800/70 text-sm font-medium">You can ask us to correct or update your information.</p>
                                </div>
                                <div className="p-8 bg-purple-50/50 rounded-2xl border border-purple-100 text-center flex flex-col items-center">
                                    <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-4 text-purple-600">
                                        <Heart className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-bold text-purple-900 mb-2">Complain</h3>
                                    <p className="text-purple-800/70 text-sm font-medium">You can express your concerns or complaints to us about your privacy.</p>
                                </div>
                            </div>
                        </section>

                        {/* 8. Changes to this policy */}
                        <section id="changes" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">8. Changes to this policy</h2>
                            <p className="text-slate-600 leading-relaxed mb-8 font-medium">
                                If we need to change this policy in a way that affects the way we handle your information, if you use our Platform, you'll receive an alert from us. We will also publish the changes to it on our website. We encourage you to check our website periodically to ensure that you are aware of our current Privacy Policy.
                            </p>
                            <div className="bg-blue-50/50 rounded-2xl p-8 border border-blue-100 text-center flex flex-col items-center">
                                <h3 className="font-bold text-blue-900 mb-4 text-lg">Questions about this policy?</h3>
                                <p className="text-slate-600 font-medium mb-4 max-w-md">
                                    If you have any questions about this Privacy Policy, please contact us at:
                                </p>
                                <a
                                    href="mailto:contact@firstpeak.ai"
                                    className="text-blue-600 font-bold hover:underline"
                                >
                                    contact@firstpeak.ai
                                </a>
                            </div>
                        </section>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default PrivacyPolicy;
