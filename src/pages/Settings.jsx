import { useState, useEffect } from 'react';
import { useBuilder } from '../context/BuilderContext';
import { useAuth } from '../context/AuthContext';
import { db, auth } from '../firebase/config';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { sendEmailVerification, sendPasswordResetEmail } from 'firebase/auth';
import {
    User, Shield, CreditCard, Bell, Database, AlertTriangle,
    CheckCircle, XCircle, LogOut, Copy, RefreshCw, Mail, Lock
} from 'lucide-react';
import { toast } from 'sonner';

export default function Settings() {
    const { builder, builderId } = useBuilder();
    const { user } = useAuth();

    // --- STATE ---
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(false);

    // Profile State
    const [profileForm, setProfileForm] = useState({
        name: '',
        displayName: '',
    });

    // Preferences State
    const [preferences, setPreferences] = useState({
        emailDetails: true,
        rentReminders: true,
        monthlyReports: false
    });

    // Danger Zone
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Sync Data on Load
    useEffect(() => {
        if (builder) {
            setProfileForm({
                name: builder.name || '',
                displayName: builder.displayName || ''
            });
            if (builder.preferences) {
                setPreferences(prev => ({ ...prev, ...builder.preferences }));
            }
        }
    }, [builder]);

    // --- HANDLERS ---

    const handleSaveProfile = async () => {
        setLoading(true);
        try {
            await updateDoc(doc(db, 'builders', builderId), {
                name: profileForm.name,
                displayName: profileForm.displayName,
                updatedAt: serverTimestamp()
            });
            toast.success("Profile updated successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    const handleTogglePreference = async (key) => {
        const newVal = !preferences[key];
        setPreferences(prev => ({ ...prev, [key]: newVal }));

        // Auto-save preference
        try {
            await updateDoc(doc(db, 'builders', builderId), {
                [`preferences.${key}`]: newVal
            });
            toast.success("Preference saved");
        } catch (error) {
            console.error(error);
            toast.error("Could not save preference");
        }
    };

    const handleResendVerification = async () => {
        if (!user) return;
        setVerifying(true);
        try {
            await sendEmailVerification(user);
            toast.success("Verification email sent!");
        } catch (error) {
            console.error(error);
            if (error.code === 'auth/too-many-requests') {
                toast.error("Too many requests. Please wait.");
            } else {
                toast.error("Failed to send email");
            }
        } finally {
            setVerifying(false);
        }
    };

    const handlePasswordReset = async () => {
        if (!user?.email) return;
        try {
            await sendPasswordResetEmail(auth, user.email);
            toast.success(`Password reset email sent to ${user.email}`);
        } catch (error) {
            console.error(error);
            toast.error("Failed to send reset email");
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard");
    };

    // --- RENDER HELPERS ---

    const SectionHeader = ({ icon: Icon, title, description }) => (
        <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                <Icon size={24} />
            </div>
            <div>
                <h2 className="text-lg font-bold text-gray-900">{title}</h2>
                <p className="text-sm text-gray-500">{description}</p>
            </div>
        </div>
    );

    const Divider = () => <div className="border-t border-gray-100 my-8"></div>;

    return (
        <div className="w-full py-8 px-6 md:px-8 lg:px-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="mb-10">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Settings</h1>
                <p className="text-gray-500 mt-2">Manage your account, preferences, and workspace settings.</p>
            </header>

            {/* SECTION 1: PROFILE */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <SectionHeader
                    icon={User}
                    title="Public Profile"
                    description="Manage how your information appears to tenants and staff."
                />

                <div className="space-y-6 max-w-xl ml-16">
                    {/* Avatar (Static for now) */}
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-sm">
                            {(profileForm.name?.[0] || 'U').toUpperCase()}
                        </div>
                        <div>
                            <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                                Change Avatar
                            </button>
                            <p className="text-xs text-gray-400 mt-1.5">JPG or PNG. Max 1MB.</p>
                        </div>
                    </div>

                    <div className="grid gap-5">
                        <div className="grid gap-2">
                            <label className="text-sm font-medium text-gray-700">Company / Builder Name</label>
                            <input
                                type="text"
                                value={profileForm.name}
                                onChange={e => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                placeholder="e.g. Acme Estates"
                            />
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-medium text-gray-700">Display Name <span className="text-gray-400 font-normal">(Optional)</span></label>
                            <input
                                type="text"
                                value={profileForm.displayName}
                                onChange={e => setProfileForm(prev => ({ ...prev, displayName: e.target.value }))}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                placeholder="What should we call you?"
                            />
                        </div>

                        <div className="grid gap-2 opacity-75">
                            <label className="text-sm font-medium text-gray-700">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-3 text-gray-400" size={18} />
                                <input
                                    type="email"
                                    value={builder?.email || ''}
                                    disabled
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200 text-gray-600 cursor-not-allowed"
                                />
                                {user?.emailVerified && (
                                    <span className="absolute right-3 top-2.5 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1">
                                        <CheckCircle size={10} /> Verified
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            onClick={handleSaveProfile}
                            disabled={loading}
                            className={`px-6 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-all flex items-center gap-2 ${loading ? 'opacity-80' : ''}`}
                        >
                            {loading && <RefreshCw className="animate-spin" size={16} />}
                            Save Changes
                        </button>
                    </div>
                </div>
            </section>

            <div className="h-8"></div>

            {/* SECTION 2: ACCOUNT & PLAN */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <SectionHeader
                    icon={CreditCard}
                    title="Plan & Billing"
                    description="Manage your subscription and usage."
                />

                <div className="ml-16">
                    <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-bold text-gray-900">Free Plan</h3>
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200 uppercase tracking-wide">
                                    Current
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 max-w-xs">
                                You are currently on the free tier. Upgrade to unlock unlimited units and advanced analytics.
                            </p>
                        </div>
                        <div className="group relative">
                            <button disabled className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-medium opacity-50 cursor-not-allowed shadow-sm">
                                Upgrade Plan
                            </button>
                            <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1.5 px-3 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                Coming Soon
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-x-8 gap-y-4 text-sm text-gray-500">
                        <div>
                            <span className="block font-medium text-gray-900">Billing Cycle</span>
                            <span>Monthly</span>
                        </div>
                        <div>
                            <span className="block font-medium text-gray-900">Next Invoice</span>
                            <span>-</span>
                        </div>
                        <div>
                            <span className="block font-medium text-gray-900">Payment Method</span>
                            <span>-</span>
                        </div>
                    </div>
                </div>
            </section>

            <div className="h-8"></div>

            {/* SECTION 3: SECURITY */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <SectionHeader
                    icon={Shield}
                    title="Security"
                    description="Secure your account and authentication methods."
                />

                <div className="ml-16 space-y-6">
                    <div className="flex items-center justify-between py-1">
                        <div>
                            <h4 className="font-medium text-gray-900">Email Verification</h4>
                            <p className="text-sm text-gray-500 mt-0.5">Protect your account and unlock all features.</p>
                        </div>
                        {user?.emailVerified ? (
                            <span className="flex items-center gap-1.5 text-sm font-medium text-green-600 bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">
                                <CheckCircle size={16} /> Verified
                            </span>
                        ) : (
                            <button
                                onClick={handleResendVerification}
                                disabled={verifying}
                                className="text-sm font-medium text-blue-600 hover:text-blue-700 underline disabled:opacity-50"
                            >
                                {verifying ? 'Sending...' : 'Resend Verification Email'}
                            </button>
                        )}
                    </div>

                    <div className="h-px bg-gray-100"></div>

                    <div className="flex items-center justify-between py-1">
                        <div>
                            <h4 className="font-medium text-gray-900">Password</h4>
                        </div>
                        <button
                            onClick={handlePasswordReset}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <Lock size={14} /> Change Password
                        </button>
                    </div>

                    <div className="h-px bg-gray-100"></div>

                    <div className="flex items-center justify-between py-1">
                        <div>
                            <h4 className="font-medium text-gray-900">Login Provider</h4>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200">
                            <span className="text-sm font-medium text-gray-600">Email & Password</span>
                        </div>
                    </div>
                </div>
            </section>

            <div className="h-8"></div>

            {/* SECTION 4: PREFERENCES */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <SectionHeader
                    icon={Bell}
                    title="Preferences"
                    description="Manage notifications and defaults."
                />

                <div className="ml-16 space-y-4">
                    {[
                        { key: 'emailDetails', label: 'Email Notifications', desc: 'Receive updates about your account.' },
                        { key: 'rentReminders', label: 'Rent Reminders', desc: 'Get notified when units become overdue.' },
                        { key: 'monthlyReports', label: 'Monthly Reports', desc: 'Summary of performance sent on the 1st.' }
                    ].map(item => (
                        <div key={item.key} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors -mx-3 px-3">
                            <div>
                                <h4 className="font-medium text-gray-900">{item.label}</h4>
                                <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                            </div>
                            <button
                                onClick={() => handleTogglePreference(item.key)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${preferences[item.key] ? 'bg-blue-600' : 'bg-gray-200'}`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${preferences[item.key] ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            <div className="h-8"></div>

            {/* SECTION 5: DATA */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <SectionHeader
                    icon={Database}
                    title="Data & Access"
                    description="Technical details and session management."
                />

                <div className="ml-16">
                    <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm text-slate-300 flex items-center justify-between mb-4">
                        <div>
                            <span className="sr-only">Builder ID:</span>
                            <span className="text-slate-500 mr-2">ID:</span>
                            {builderId}
                        </div>
                        <button onClick={() => copyToClipboard(builderId)} className="p-2 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors">
                            <Copy size={14} />
                        </button>
                    </div>
                    <p className="text-xs text-gray-400">
                        Account Created: {builder?.createdAt?.toDate ? builder.createdAt.toDate().toLocaleDateString() : 'Unknown'}
                    </p>
                </div>
            </section>

            <div className="h-8"></div>

            {/* SECTION 6: DANGER ZONE */}
            <section className="bg-white rounded-2xl shadow-sm border border-red-100 p-8 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-red-500/20"></div>
                <SectionHeader
                    icon={AlertTriangle}
                    title="Danger Zone"
                    description="Irreversible actions."
                />

                <div className="ml-16">
                    <p className="text-sm text-gray-600 mb-4">
                        Deleting your account will remove all your data, including projects, units, and tenants. This action cannot be undone.
                    </p>
                    <button
                        onClick={() => setShowDeleteModal(true)}
                        className="px-4 py-2 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100 hover:border-red-300 transition-colors flex items-center gap-2"
                    >
                        <LogOut size={16} /> Delete Account
                    </button>
                </div>
            </section>

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4 mx-auto">
                            <AlertTriangle size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-center text-gray-900 mb-2">Delete Account?</h3>
                        <p className="text-sm text-center text-gray-500 mb-6">
                            This action is permanent and cannot be undone. All your data will be wiped immediately.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    toast.error("Contact support to delete account");
                                    setShowDeleteModal(false);
                                }}
                                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors shadow-sm"
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
