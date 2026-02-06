import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../firebase/auth';
import { useAuth } from '../context/AuthContext';
import { Building2, KeyRound, Mail, User, Lock, CheckCircle, ShieldCheck, Cloud, Layout, ArrowRight, Info, X, Wallet, FileText, Calendar, Database } from 'lucide-react';

export default function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [showHelp, setShowHelp] = useState(false);
    const [showBillingHelp, setShowBillingHelp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { loginDemo } = useAuth();

    const handleDemoLogin = async () => {
        setLoading(true);
        try {
            loginDemo();
            navigate('/');
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                await loginUser(email, password);
            } else {
                await registerUser(name, email, password);
            }
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen w-full bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex overflow-hidden relative font-sans text-slate-900">

            {/* Background Blobs */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-multiply"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none mix-blend-multiply"></div>

            {/* LEFT SECTION: 60% Width (Product Intro) */}
            <div className="hidden lg:flex w-[60%] flex-col justify-center px-16 xl:px-24 relative z-10 h-full">
                <div className="max-w-3xl animate-fade-in-up">
                    {/* Branding */}
                    <div className="flex items-center space-x-3 mb-8">
                        <div className="bg-white p-2.5 rounded-xl shadow-md border border-slate-200">
                            <Building2 size={28} className="text-blue-600" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-slate-900">Propvera</span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-5xl xl:text-6xl font-extrabold tracking-tight text-slate-900 mb-5 leading-tight">
                        Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Propvera</span>
                    </h1>
                    <p className="text-lg xl:text-xl text-slate-600 mb-10 leading-relaxed max-w-lg font-medium">
                        The modern operating system for real estate builders. <br />
                        Secure, scalable, and simple.
                    </p>

                    {/* Feature Grid - Compact */}
                    <div className="grid grid-cols-2 gap-4 xl:gap-6 mb-10">
                        {[
                            { icon: Layout, title: 'Centralized Dashboard', desc: 'Manage projects in one view' },
                            { icon: CheckCircle, title: 'Smart Tracking', desc: 'Automated rent & unit status' },
                            { icon: Lock, title: 'Enterprise Security', desc: 'Bank-grade data protection' },
                            { icon: Cloud, title: 'Cloud Sync', desc: 'Access from anywhere, anytime' }
                        ].map((feature, idx) => (
                            <div key={idx} className="group p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                                <div className="flex items-center space-x-3 mb-2">
                                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300">
                                        <feature.icon size={18} className="text-blue-600 group-hover:text-white" />
                                    </div>
                                    <h3 className="font-bold text-slate-900 text-sm xl:text-base">{feature.title}</h3>
                                </div>
                                <p className="text-xs text-slate-500 leading-snug">{feature.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Trust Badges */}
                    <div className="flex items-center space-x-4 text-xs xl:text-sm font-semibold text-slate-500">
                        <span className="flex items-center space-x-2 px-3 py-1.5 bg-white rounded-full border border-slate-200 shadow-sm">
                            <ShieldCheck size={16} className="text-green-600" />
                            <span>SOC2 Compliant</span>
                        </span>
                        <span className="flex items-center space-x-2 px-3 py-1.5 bg-white rounded-full border border-slate-200 shadow-sm">
                            <Building2 size={16} className="text-blue-600" />
                            <span>Built for Builders</span>
                        </span>
                    </div>
                </div>
            </div>

            {/* RIGHT SECTION: 40% Width (Auth Form) */}
            <div className="w-full lg:w-[40%] flex items-center justify-center p-6 lg:p-8 z-20 h-full">
                <div className="w-full max-w-[400px] bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 lg:p-8 animate-scale-in flex flex-col justify-center max-h-screen">

                    {/* Logomark Mobile */}
                    <div className="lg:hidden flex flex-col items-center mb-6">
                        <div className="bg-blue-600 w-10 h-10 rounded-lg flex items-center justify-center mb-3 text-white shadow-lg">
                            <Building2 size={20} />
                        </div>
                        <h1 className="text-xl font-bold text-slate-900">Propvera</h1>
                    </div>

                    <div className="text-center lg:text-left mb-6 xl:mb-8">
                        <h2 className="text-2xl font-bold text-slate-900">
                            {isLogin ? 'Sign in to Dashboard' : 'Get started free'}
                        </h2>
                        <p className="mt-1.5 text-slate-600 font-medium text-sm">
                            {isLogin ? 'Welcome back! Please enter your details.' : 'Start your 14-day free trial. No credit card required.'}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100 flex items-start animate-shake font-medium">
                            <div className="mr-2 mt-0.5"><ShieldCheck size={16} /></div>
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide ml-1">Full Name</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Builder or Company Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full pl-11 pr-4 py-2.5 bg-gray-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all font-medium text-slate-900 placeholder:text-slate-400 text-sm shadow-sm"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                                <input
                                    type="email"
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all font-medium text-slate-900 placeholder:text-slate-400 text-sm shadow-sm"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide ml-1">Password</label>
                            <div className="relative group">
                                <KeyRound className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all font-medium text-slate-900 placeholder:text-slate-400 text-sm shadow-sm"
                                    required
                                />
                            </div>
                            {!isLogin && <p className="text-[11px] text-slate-500 ml-1">Minimum 6 characters</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-base rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-0.5 transition-all tracking-wide transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mt-5"
                        >
                            <span>{loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}</span>
                            {!loading && <ArrowRight size={20} />}
                        </button>

                        {isLogin && (
                            <button
                                type="button"
                                onClick={handleDemoLogin}
                                disabled={loading}
                                className="w-full mt-4 h-11 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 font-medium text-sm rounded-xl transition-all duration-200 flex items-center justify-center"
                            >
                                <span>Explore Demo</span>
                            </button>
                        )}
                    </form>

                    <div className="pt-5 border-t border-slate-100 flex flex-col items-center space-y-4 mt-5">
                        <div className="flex flex-col xl:flex-row items-center space-y-3 xl:space-y-0 xl:space-x-6 text-sm">
                            <div className="text-slate-500 font-medium">
                                {isLogin ? "New to Propvera? " : "Already have an account? "}
                                <button
                                    onClick={() => setIsLogin(!isLogin)}
                                    className="text-blue-700 font-bold hover:text-blue-800 hover:underline transition-colors"
                                >
                                    {isLogin ? 'Create account' : 'Log in'}
                                </button>
                            </div>

                            <div className="hidden xl:block h-4 w-px bg-slate-300"></div>

                            <button
                                onClick={() => setShowHelp(true)}
                                className="flex items-center space-x-1.5 text-slate-600 hover:text-blue-600 font-medium transition-colors group"
                            >
                                <div className="p-1 rounded-full border border-slate-300 group-hover:border-blue-500 transition-colors">
                                    <Info size={12} className="text-slate-400 group-hover:text-blue-500" />
                                </div>
                                <span>How to use</span>
                            </button>

                            <div className="hidden xl:block h-4 w-px bg-slate-300"></div>

                            <button
                                onClick={() => setShowBillingHelp(true)}
                                className="flex items-center space-x-1.5 text-slate-600 hover:text-blue-600 font-medium transition-colors group"
                            >
                                <div className="p-1 rounded-full border border-slate-300 group-hover:border-blue-500 transition-colors">
                                    <Wallet size={12} className="text-slate-400 group-hover:text-blue-500" />
                                </div>
                                <span>Billing</span>
                            </button>
                        </div>

                        <div className="flex items-center space-x-2 text-[10px] xl:text-xs text-slate-400 mt-2">
                            <Lock size={10} className="text-green-600" />
                            <span>256-bit SSL Secure Encryption</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* HOW TO USE MODAL */}
            {showHelp && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
                    <div
                        className="bg-white w-full max-w-2xl max-h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-scale-in"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-100 flex-shrink-0">
                            <div className="flex items-center space-x-3">
                                <div className="bg-blue-50 p-2 rounded-lg">
                                    <Building2 size={24} className="text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">How to use Propvera</h3>
                                    <p className="text-sm text-slate-500">Quick start guide for builders</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowHelp(false)}
                                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                            {/* Steps Content... */}
                            {[
                                { num: 1, color: 'blue', title: 'Getting Started', text: 'Sign up securely as a builder. Your account is isolated and completely private. Only you have access to your financial data.' },
                                { num: 2, color: 'purple', title: 'Setup Your Business', text: 'Add your <strong>Projects</strong> (buildings) and then add <strong>Units</strong> (flats/shops) under each project. Mark them as Vacant, Rented, or Sold to track inventory.' },
                                { num: 3, color: 'green', title: 'Rent Management', text: 'For rented units, add tenant details and set monthly rent. Propvera automatically calculates due, paid, and overdue rent every month.' },
                                { num: 4, color: 'orange', title: 'Dashboard Insights', text: 'Instantly view total rent collected, pending payments, and occupancy rates. Everything updates in real-time as you manage units.' },
                                { num: 5, color: 'slate', title: 'Secure & Scalable', text: 'Your business data is encrypted and cloud-stored. Access it from any laptop, tablet, or phone, anywhere in the world.' }
                            ].map((step, i) => (
                                <div key={i} className="flex space-x-4">
                                    <div className="flex-shrink-0 mt-1">
                                        <div className={`w-8 h-8 bg-${step.color}-100 text-${step.color}-600 rounded-full flex items-center justify-center font-bold text-sm`}>{step.num}</div>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h4>
                                        <p className="text-slate-600 leading-relaxed text-sm" dangerouslySetInnerHTML={{ __html: step.text }}></p>
                                    </div>
                                </div>
                            ))}

                            {/* Billing Section (Embedded) */}
                            <div className="flex space-x-4 pt-4 border-t border-slate-100">
                                <div className="flex-shrink-0 mt-1">
                                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold shadow-md shadow-blue-200">
                                        <Wallet size={14} />
                                    </div>
                                </div>
                                <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 w-full">
                                    <h4 className="text-lg font-bold text-blue-900 mb-1">How Billing Works</h4>
                                    <p className="text-blue-700 font-medium text-sm mb-4">
                                        Transparent, Usage-Based Billing
                                    </p>
                                    <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                                        Propvera charges you only for what you manage — nothing more.
                                    </p>
                                    <ul className="space-y-2 mb-4">
                                        {[
                                            '₹2 per unit per day pricing',
                                            'All units are counted (vacant, rented, sold)',
                                            'Automatic daily tracking (no manual work)',
                                            'Monthly postpaid invoice with 7-day grace period'
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-start space-x-2 text-sm text-slate-700">
                                                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 flex-shrink-0"></div>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end flex-shrink-0">
                            <button
                                onClick={() => setShowHelp(false)}
                                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors shadow-lg shadow-slate-900/10"
                            >
                                Got it, let's start
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* BILLING MODAL (NEW & SEPARATE) */}
            {showBillingHelp && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
                    <div
                        className="bg-white w-full max-w-2xl max-h-[80vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-scale-in"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50 flex-shrink-0">
                            <div className="flex items-center space-x-3">
                                <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-200">
                                    <Wallet size={24} className="text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">How Billing Works</h3>
                                    <p className="text-sm text-slate-500">Simple. Transparent. Usage-based.</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowBillingHelp(false)}
                                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-8">

                            {/* Intro */}
                            <p className="text-slate-600 leading-relaxed font-medium">
                                Propvera follows a fair, usage-based pricing model. <br />
                                You pay only for what you actively manage — nothing hidden, nothing extra.
                            </p>

                            <div className="grid grid-cols-1 gap-8">
                                {/* Section 1 - Pricing */}
                                <div className="flex space-x-5">
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                                            <Wallet size={20} />
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-slate-900 mb-2">Pricing Model</h4>
                                        <div className="text-slate-600 space-y-2 text-sm">
                                            <p className="font-semibold text-blue-700">₹2 per unit per day</p>
                                            <p>Every unit is counted:</p>
                                            <div className="flex space-x-2 text-xs uppercase tracking-wide font-bold text-slate-400">
                                                <span className="bg-slate-100 px-2 py-1 rounded">Vacant</span>
                                                <span className="bg-slate-100 px-2 py-1 rounded">Rented</span>
                                                <span className="bg-slate-100 px-2 py-1 rounded">Sold</span>
                                            </div>
                                            <p className="text-slate-500 italic mt-1">If you manage 40 units today, you are billed only for those 40 units.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 2 - Daily Usage */}
                                <div className="flex space-x-5">
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
                                            <Database size={20} />
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-slate-900 mb-2">Daily Usage Tracking</h4>
                                        <ul className="text-slate-600 space-y-1.5 text-sm list-disc pl-4">
                                            <li>Unit count is tracked automatically every day</li>
                                            <li>No manual updates required</li>
                                            <li>Add or remove units anytime — billing updates automatically</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Section 3 - Monthly Billing */}
                                <div className="flex space-x-5">
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
                                            <FileText size={20} />
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-slate-900 mb-2">Monthly Invoice</h4>
                                        <ul className="text-slate-600 space-y-1.5 text-sm list-disc pl-4">
                                            <li>Billing is postpaid</li>
                                            <li>Invoice is generated at the start of every month</li>
                                            <li>You pay only for actual usage of the previous month</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Section 4 - Grace Period */}
                                <div className="flex space-x-5">
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
                                            <Calendar size={20} />
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-slate-900 mb-2">Grace Period & Access</h4>
                                        <ul className="text-slate-600 space-y-1.5 text-sm list-disc pl-4">
                                            <li>7-day grace period after invoice generation</li>
                                            <li>Full access during grace period</li>
                                            <li>No sudden lockouts or disruptions</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Section 5 - Data Safety */}
                                <div className="flex space-x-5">
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center">
                                            <ShieldCheck size={20} />
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-slate-900 mb-2">Your Data Is Always Safe</h4>
                                        <ul className="text-slate-600 space-y-1.5 text-sm list-disc pl-4">
                                            <li>No data deletion</li>
                                            <li>No forced shutdowns</li>
                                            <li>Your projects, units, and history remain secure</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 text-center text-blue-800 text-sm font-medium">
                                Usage, invoices, and payment status are always visible inside your dashboard.
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end flex-shrink-0">
                            <button
                                onClick={() => setShowBillingHelp(false)}
                                className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors shadow-lg shadow-slate-900/10"
                            >
                                Got it, makes sense
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="absolute bottom-2 lg:bottom-4 w-full text-center z-10 pointer-events-none">
                <p className="text-[10px] lg:text-xs text-slate-400/80 font-medium tracking-wide">
                    &copy; 2026 &middot; Developed by Harsh Shrivastava
                </p>
            </div>
        </div>
    );
}

