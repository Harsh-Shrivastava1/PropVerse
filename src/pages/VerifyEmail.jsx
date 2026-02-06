import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase/config';
import { resendVerificationEmail, logoutUser } from '../firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { Building2, Mail, RefreshCw, ArrowRight, CheckCircle, LogOut } from 'lucide-react';

export default function VerifyEmail() {
    const [user, setUser] = useState(auth.currentUser);
    const [emailSent, setEmailSent] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Poll for email verification status
        const interval = setInterval(async () => {
            if (auth.currentUser) {
                await auth.currentUser.reload();
                const updatedUser = auth.currentUser;
                setUser({ ...updatedUser }); // Force re-render

                if (updatedUser.emailVerified && !verifying) {
                    setVerifying(true);
                    await handleVerificationSuccess(updatedUser);
                    clearInterval(interval);
                }
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [verifying]);

    const handleVerificationSuccess = async (verifiedUser) => {
        try {
            await updateDoc(doc(db, "builders", verifiedUser.uid), {
                emailVerified: true,
                verificationStatus: "verified",
                status: "active",
                onboardingComplete: true
            });
            // Short delay for animation
            setTimeout(() => {
                navigate('/');
            }, 1500);
        } catch (err) {
            console.error("Error updating verification status:", err);
            setError("Could not update profile. Please contact support.");
        }
    };

    const handleResend = async () => {
        setError('');
        try {
            await resendVerificationEmail(auth.currentUser);
            setEmailSent(true);
            setTimeout(() => setEmailSent(false), 5000);
        } catch (err) {
            setError("Too many requests. Please wait a moment.");
        }
    };

    const handleLogout = async () => {
        await logoutUser();
        navigate('/login');
    };

    if (verifying || user?.emailVerified) {
        return (
            <div className="h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center font-sans">
                <div className="bg-white p-10 rounded-3xl shadow-2xl text-center max-w-md w-full animate-scale-in">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Email Verified!</h2>
                    <p className="text-slate-600 mb-8">Redirecting you to dashboard...</p>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 animate-progress"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex overflow-hidden relative font-sans">
            {/* Background Blobs */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-multiply"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none mix-blend-multiply"></div>

            <div className="w-full flex items-center justify-center p-6 z-10">
                <div className="bg-white max-w-lg w-full rounded-3xl shadow-2xl p-8 md:p-12 text-center animate-fade-in-up border border-slate-100 relative">

                    <button
                        onClick={handleLogout}
                        className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"
                        title="Sign Out"
                    >
                        <LogOut size={20} />
                    </button>

                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-sm">
                        <Mail size={32} />
                    </div>

                    <h1 className="text-3xl font-extrabold text-slate-900 mb-4">Verify your email</h1>
                    <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                        We’ve sent a verification link to <br />
                        <span className="font-bold text-slate-900">{user?.email}</span>
                    </p>

                    <div className="space-y-4">
                        <a
                            href="mailto:"
                            className="block w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-0.5 transition-all text-lg flex items-center justify-center space-x-2"
                        >
                            <span>Open Email App</span>
                            <ArrowRight size={20} />
                        </a>

                        <button
                            onClick={handleResend}
                            disabled={emailSent}
                            className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-4 rounded-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <RefreshCw size={18} className={emailSent ? "animate-spin" : ""} />
                            <span>{emailSent ? "Email Sent" : "Resend Verification Email"}</span>
                        </button>
                    </div>

                    <div className="mt-4 text-center">
                        <p className="text-sm text-slate-500 font-medium">
                            Didn't receive the email? Please check your Spam or Promotions folder.
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                            If you still can’t find it, try resending the verification email.
                        </p>
                    </div>

                    {error && (
                        <p className="mt-6 text-red-600 text-sm font-medium bg-red-50 py-2 px-4 rounded-lg inline-block">
                            {error}
                        </p>
                    )}

                    <div className="mt-10 pt-8 border-t border-slate-100">
                        <p className="text-slate-400 text-sm flex items-center justify-center space-x-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            <span>Waiting for verification...</span>
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
}