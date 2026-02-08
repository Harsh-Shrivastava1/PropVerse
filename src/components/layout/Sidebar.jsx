import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Building2,
    DoorOpen,
    IndianRupee,
    Users,
    FileBarChart,
    Bell,
    Settings,
    HelpCircle,
    Users2
} from 'lucide-react';

const navigation = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Projects', icon: Building2, path: '/projects' },
    { name: 'Units', icon: DoorOpen, path: '/units' },
    { name: 'Rent', icon: IndianRupee, path: '/rent' },
    { name: 'Staff', icon: Users, path: '/staff' },
    { name: 'Reports', icon: FileBarChart, path: '/reports' },
    { name: 'Notifications', icon: Bell, path: '/notifications' },
    { name: 'Society Hub', icon: Users2, path: '/society' },
    { name: 'Settings', icon: Settings, path: '/settings' },
    { name: 'Contact Us', icon: HelpCircle, path: '/contact' },
];

export default function Sidebar({ isOpen, onClose }) {
    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            <div className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out
                md:static md:translate-x-0
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                            <Building2 size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Propvera</h1>
                            <p className="text-xs text-gray-500 font-medium">REAL ESTATE OS</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {navigation.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`
                            }
                            onClick={onClose}
                        >
                            <item.icon size={20} />
                            {item.name}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <div className="bg-blue-50 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-blue-900">Need Help?</h3>
                        <p className="text-xs text-blue-700 mt-1">Contact support for assistance with your estate.</p>
                    </div>
                </div>
            </div>
        </>
    );
}
