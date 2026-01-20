import React from 'react';
import { Activity, Calendar, FileText, User, Search, Menu, Pill } from 'lucide-react';

const MockEMR: React.FC<{
    noteContent?: string | null,
    activeStep?: number,
    onNextStep?: () => void,
    type?: 'EMR' | 'EMR'
}> = ({ noteContent, activeStep = 1, onNextStep, type = 'EMR' }) => {
    return (
        <div className="w-full h-full bg-slate-50 flex overflow-hidden font-sans text-xs select-none">
            {/* Sidebar */}
            <div className="w-16 lg:w-48 bg-slate-900 flex flex-col items-center lg:items-stretch py-4 text-slate-400 shrink-0">
                <div className="mb-6 flex justify-center lg:justify-start lg:px-6">
                    <div className={`w-8 h-8 ${type === 'EMR' ? 'bg-teal-600' : 'bg-blue-600'} rounded-md flex items-center justify-center text-white font-bold`}>
                        {type === 'EMR' ? 'M' : 'Y'}
                    </div>
                    <span className="hidden lg:block ml-3 font-bold text-slate-100 text-sm mt-1.5 tracking-tight">Your {type}</span>
                </div>

                <div className="space-y-1 px-2">
                    <SidebarItem icon={<Activity />} label="Dashboard" active />
                    <SidebarItem icon={<Calendar />} label="Schedule" />
                    <SidebarItem icon={<User />} label="Patients" />
                    <SidebarItem icon={<FileText />} label="Documents" />
                    <SidebarItem icon={<Pill />} label="Pharmacy" />
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Topbar */}
                <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 shrink-0">
                    <div className="flex items-center bg-slate-100 rounded-lg px-3 py-1.5 w-48 lg:w-64">
                        <Search className="w-3.5 h-3.5 text-slate-400 mr-2" />
                        <span className="text-slate-400">Search patient...</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end hidden lg:flex">
                            <span className="font-semibold text-slate-700">Dr. Sarah Wilson</span>
                            <span className="text-[10px] text-slate-400">Cardiology</span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-teal-100 border border-teal-200 flex items-center justify-center text-teal-700 font-bold">SW</div>
                    </div>
                </div>

                {/* Patient Context Bar */}
                <div className="bg-blue-50/50 border-b border-blue-100 p-3 px-6 flex items-center gap-6 overflow-x-auto whitespace-nowrap shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold">JD</div>
                        <div>
                            <h3 className="font-bold text-slate-800 text-sm">John Doe</h3>
                            <p className="text-[10px] text-slate-500">M • 45yo • DOB: 05/12/1978</p>
                        </div>
                    </div>
                    <div className="h-8 w-px bg-blue-200" />
                    <div className="text-slate-600 space-y-0.5">
                        <span className="block text-[9px] uppercase font-bold text-slate-400">Allergies</span>
                        <span className="block font-medium text-red-500">Penicillin, Peanuts</span>
                    </div>
                    <div className="h-8 w-px bg-blue-200" />
                    <div className="text-slate-600 space-y-0.5">
                        <span className="block text-[9px] uppercase font-bold text-slate-400">Last Visit</span>
                        <span className="block font-medium">Oct 12, 2024</span>
                    </div>
                    <div className="h-8 w-px bg-blue-200" />
                    <div className="text-slate-600 space-y-0.5">
                        <span className="block text-[9px] uppercase font-bold text-slate-400">Status</span>
                        <span className="block font-medium text-blue-600 bg-blue-100 px-1.5 rounded text-[10px] w-fit">In-Patient</span>
                    </div>
                </div>

                {/* Dashboard Grid */}
                <div className="flex-1 p-4 lg:p-6 overflow-y-auto bg-slate-50/50">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 h-full">
                        {/* Left Col */}
                        <div className="space-y-4 lg:space-y-6">
                            <Card title="Vitals">
                                <div className="grid grid-cols-2 gap-3">
                                    <VitalBox label="BP" value="120/80" unit="mmHg" />
                                    <VitalBox label="HR" value="72" unit="bpm" />
                                    <VitalBox label="Temp" value="98.6" unit="°F" />
                                    <VitalBox label="O2" value="99" unit="%" />
                                    <VitalBox label="Wt" value="180" unit="lbs" />
                                    <VitalBox label="Ht" value="5'11" unit="ft" />
                                </div>
                            </Card>

                            <Card title="Current Medications">
                                <div className="space-y-2">
                                    <MedItem name="Lisinopril" dose="10mg Daily" />
                                    <MedItem name="Atorvastatin" dose="20mg Daily" />
                                    <MedItem name="Metformin" dose="500mg BID" />
                                </div>
                            </Card>
                        </div>

                        {/* Center Col - Notes (Target for Widget) */}
                        <div className="lg:col-span-2 flex flex-col h-[500px] lg:h-auto gap-4 relative">
                            <Card title="Patient History" className="flex-1 flex flex-col relative overflow-hidden">
                                <div className="flex-1 p-4 overflow-y-auto space-y-6">
                                    {/* Vitals Chart Simulation */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase tracking-wide">
                                            <span>Blood Pressure Trend (Last 6 Months)</span>
                                            <span>120/80 mmHg</span>
                                        </div>
                                        <div className="h-24 bg-slate-50 rounded-lg border border-slate-100 relative overflow-hidden group">
                                            <div className="absolute inset-x-0 bottom-0 h-16 opacity-20 bg-gradient-to-t from-blue-500 to-transparent" />
                                            <svg className="absolute inset-0 w-full h-full text-blue-500 stroke-2" fill="none" viewBox="0 0 100 40" preserveAspectRatio="none">
                                                <path d="M0 20 Q 10 18, 20 22 T 40 19 T 60 21 T 80 18 T 100 20" stroke="currentColor" vectorEffect="non-scaling-stroke" />
                                            </svg>
                                            {/* Data Points */}
                                            <div className="absolute top-1/2 left-[20%] w-2 h-2 bg-blue-600 rounded-full border-2 border-white transform -translate-y-1/2" />
                                            <div className="absolute top-[48%] left-[40%] w-2 h-2 bg-blue-600 rounded-full border-2 border-white transform -translate-y-1/2" />
                                            <div className="absolute top-[52%] left-[60%] w-2 h-2 bg-blue-600 rounded-full border-2 border-white transform -translate-y-1/2" />
                                            <div className="absolute top-[45%] left-[80%] w-2 h-2 bg-blue-600 rounded-full border-2 border-white transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    </div>

                                    {/* Recent Labs */}
                                    <div className="space-y-3">
                                        <div className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-1">Recent Lab Results</div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-100">
                                                <span className="text-slate-700 font-medium">Hemoglobin A1c</span>
                                                <span className="text-teal-600 font-bold bg-teal-50 px-2 py-0.5 rounded text-xs">5.7%</span>
                                            </div>
                                            <div className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-100">
                                                <span className="text-slate-700 font-medium">Lipid Panel</span>
                                                <span className="text-slate-500 text-xs">Normal Range</span>
                                            </div>
                                            <div className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-100">
                                                <span className="text-slate-700 font-medium">CBC</span>
                                                <span className="text-slate-500 text-xs">Within Limits</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Empty State / Hint */}
                                    <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 border-dashed text-center">
                                        <p className="text-xs text-slate-400 italic">"Patient is here for follow-up on cough..."</p>
                                    </div>
                                </div>
                            </Card>

                            {/* Step 2: Processing Overlay */}
                            {activeStep === 2 && (
                                <div
                                    className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center animate-in fade-in duration-300 cursor-pointer group/proc"
                                    onClick={onNextStep}
                                >
                                    <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-full border border-slate-200 shadow-xl group-hover/proc:scale-105 transition-transform">
                                        <div className="animate-spin w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full" />
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-800 text-xs">Structuring Clinical Note...</span>
                                            <span className="text-[10px] text-slate-400">Click to view final note</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Generated Note Overlay */}
                            {activeStep === 3 && noteContent && (
                                <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px] flex items-center justify-center p-4 z-10 animate-in fade-in zoom-in-95 duration-300">
                                    <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full h-full flex flex-col overflow-hidden ring-4 ring-slate-900/5">
                                        <div className="bg-gradient-to-r from-teal-500 to-sky-500 p-1"></div>
                                        <div className="p-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                                                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">AI Generated Note</span>
                                            </div>
                                            <span className="text-[10px] text-slate-400 font-mono">Just now</span>
                                        </div>
                                        <div className="flex-1 p-4 font-mono text-xs lg:text-sm text-slate-600 leading-relaxed overflow-y-auto bg-slate-50/30">
                                            <div className="whitespace-pre-wrap animate-in fade-in slide-in-from-bottom-2 duration-500">
                                                {noteContent}
                                            </div>
                                        </div>
                                        <div className="p-3 border-t border-slate-100 flex justify-end gap-2 bg-white">
                                            <button
                                                onClick={onNextStep}
                                                className="px-3 py-1.5 rounded-md text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
                                            >
                                                Approve & Sign
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

const SidebarItem = ({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) => (
    <div className={`p-3 lg:px-6 lg:py-3 flex items-center justify-center lg:justify-start gap-3 cursor-pointer transition-colors ${active ? 'bg-slate-800 text-teal-400 border-r-2 border-teal-500' : 'hover:bg-slate-800 hover:text-slate-200'}`}>
        {React.cloneElement(icon, { size: 18 })}
        <span className={`hidden lg:block font-medium ${active ? 'text-teal-400' : ''}`}>{label}</span>
    </div>
);

const Card = ({ title, children, className = '' }: { title: string, children: React.ReactNode, className?: string }) => (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm p-4 ${className}`}>
        <h4 className="font-bold text-slate-700 mb-3 flex items-center justify-between">
            {title}
            <Menu className="w-4 h-4 text-slate-300" />
        </h4>
        {children}
    </div>
);

const VitalBox = ({ label, value, unit }: { label: string, value: string, unit: string }) => (
    <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 flex flex-col items-center justify-center text-center">
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">{label}</span>
        <span className="text-lg font-bold text-slate-900">{value}</span>
        <span className="text-[9px] text-slate-400">{unit}</span>
    </div>
);

const MedItem = ({ name, dose }: { name: string, dose: string }) => (
    <div className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100 cursor-pointer">
        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
            <Pill size={14} />
        </div>
        <div>
            <div className="font-bold text-slate-700">{name}</div>
            <div className="text-[10px] text-slate-500">{dose}</div>
        </div>
    </div>
);

export default MockEMR;
