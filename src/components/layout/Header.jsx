import { useAuth } from '../../hooks/useAuth';
import { useBuilder } from '../../hooks/useBuilder';
import { LogOut, Bell, User } from 'lucide-react';

export default function Header() {
    const { user, isDemo, logout } = useAuth();
    const { builder } = useBuilder();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Failed to logout', error);
        }
    };

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                    Welcome, {builder?.name || user?.email}
                    {isDemo && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 ml-3 border border-indigo-200">
                            🧪 Demo Mode
                        </span>
                    )}
                </h2>
                {builder?.plan === 'free' && (
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                        Free Plan
                    </span>
                )}
            </div>

            <div className="flex items-center gap-4">
                <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                </button>

                <div className="h-6 w-px bg-gray-200"></div>

                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 border border-gray-200">
                        <User size={16} />
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 font-medium transition-colors"
                    >
                        <LogOut size={16} />
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
}
