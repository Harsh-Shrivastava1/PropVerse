import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function SuspendedPage() {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
            <div className="w-full max-w-[480px]">
                <div className="bg-white p-6 shadow-xl rounded-2xl border border-slate-200">

                    {/* Header Section */}
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-red-50 mb-4">
                            <svg
                                className="h-7 w-7 text-red-500"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                        </div>

                        <h2 className="text-2xl font-semibold text-gray-900 tracking-tight leading-tight">
                            Account Suspended
                        </h2>

                        <p className="mt-2 text-slate-600 text-sm leading-relaxed">
                            Your account has been temporarily restricted due to policy violations or billing issues.
                        </p>

                        <div className="mt-4 bg-green-50 rounded-lg px-3 py-2 inline-block">
                            <p className="text-xs text-green-700 font-medium flex items-center justify-center gap-1.5">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                                </svg>
                                Your data, projects, and records are completely safe.
                            </p>
                        </div>
                    </div>

                    {/* Actions Section */}
                    <div className="mt-8 space-y-3">
                        <a
                            href="mailto:support@estateos.com"
                            className="w-full h-11 flex justify-center items-center px-4 border border-transparent rounded-xl shadow-md text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transform transition-all duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            Contact Admin
                        </a>

                        <div className="flex items-center justify-center gap-4 text-xs text-slate-500 pt-2">
                            <button
                                onClick={() => window.location.reload()}
                                className="hover:text-slate-800 hover:underline transition-colors"
                            >
                                Refresh status
                            </button>
                            <span className="text-slate-300">|</span>
                            <button
                                onClick={logout}
                                className="hover:text-slate-800 hover:underline transition-colors"
                            >
                                Sign out
                            </button>
                        </div>
                    </div>

                    {/* Footer / Debug Info - Minimized */}
                    <div className="mt-8 pt-4 border-t border-slate-100">
                        <div className="bg-slate-50 rounded-lg p-2.5 text-center">
                            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1">Session Info</p>
                            <div className="flex flex-col items-center justify-center text-[11px] text-slate-500 font-mono leading-tight">
                                <div>{user?.email || 'No email'}</div>
                                <div className="text-slate-400 mt-0.5 opacity-70">UID: {user?.uid || 'N/A'}</div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
