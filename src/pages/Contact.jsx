import { Mail, HelpCircle, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export default function Contact() {

    const handleEmailSupport = () => {
        window.location.href = "mailto:Shrivastavaharsh5491@gmail.com";
    };

    const SectionHeader = ({ icon: Icon, title, description }) => (
        <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                <Icon size={24} />
            </div>
            <div>
                <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                <p className="text-sm text-gray-500">{description}</p>
            </div>
        </div>
    );

    return (
        <div className="w-full py-12 px-6 md:px-8 lg:px-10 animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col items-center">
            <header className="mb-12 text-center max-w-2xl">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Contact Support</h1>
                <p className="text-gray-500 mt-2 text-lg">We’re here to help you get the most out of Propvera.</p>
                <p className="text-slate-400 mt-1 text-sm font-normal">Support maintained by Propverse Admin</p>
            </header>

            <div className="w-full max-w-5xl space-y-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 sm:p-10">
                    <SectionHeader
                        icon={Mail}
                        title="Get in Touch"
                        description="Our support team typically responds within 24-48 hours."
                    />

                    <div className="space-y-8 mt-8">
                        {/* Email Card */}
                        <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6 hover:shadow-md transition-shadow">
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-1">Email Support</h3>
                                <p className="text-sm text-gray-500 mb-2">Shrivastavaharsh5491@gmail.com</p>
                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                    Response time: &lt; 12h
                                </div>
                            </div>
                            <button
                                onClick={handleEmailSupport}
                                className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
                            >
                                <Mail size={18} /> Email Support
                            </button>
                        </div>

                        {/* Help Scope Grid */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-blue-50/50 rounded-xl p-6 border border-blue-100">
                                <h4 className="flex items-center gap-2 font-semibold text-blue-900 mb-4">
                                    <HelpCircle size={18} /> What we can help with:
                                </h4>
                                <ul className="space-y-3">
                                    {[
                                        "Account setup & onboarding",
                                        "Understanding billing & plans",
                                        "Feature guidance (Projects, Units)",
                                        "Bug reports & technical issues",
                                        "Product feedback & suggestions"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-blue-800">
                                            <CheckCircle size={15} className="text-blue-500 shrink-0 mt-0.5" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-gray-50/50 rounded-xl p-6 border border-gray-100">
                                <h4 className="flex items-center gap-2 font-semibold text-gray-700 mb-4">
                                    <AlertTriangle size={18} /> Out of scope:
                                </h4>
                                <ul className="space-y-3">
                                    {[
                                        "Legal disputes with tenants",
                                        "Manual data recovery (deleted items)",
                                        "Custom feature development (Free Plan)",
                                        "Third-party payment issues"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                            <XCircle size={15} className="text-gray-400 shrink-0 mt-0.5" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-yellow-50 rounded-xl border border-yellow-100 p-5 flex items-start gap-4 max-w-3xl mx-auto">
                    <AlertTriangle size={24} className="text-yellow-600 shrink-0" />
                    <div>
                        <h4 className="font-semibold text-yellow-900 mb-1">Security Note</h4>
                        <p className="text-sm text-yellow-800 leading-relaxed">
                            For your security, Propvera support will <strong>never</strong> ask for your password or OTP.
                            Please do not share sensitive credentials via email.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
