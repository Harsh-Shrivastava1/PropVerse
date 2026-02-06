import { Users, Search, Filter } from 'lucide-react';

export default function Tenants() {
    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Tenants</h1>
                    <p className="text-gray-500 text-sm">Manage your tenants and lease agreements.</p>
                </div>
                {/* Placeholder Actions */}
                <div className="flex space-x-2">
                    <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 text-sm font-medium">
                        <Filter size={16} />
                        <span>Filter</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium shadow-sm">
                        <Users size={16} />
                        <span>Add Tenant</span>
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm min-h-[400px] flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <Users size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No tenants yet</h3>
                <p className="text-gray-500 max-w-sm mt-2">
                    Add tenants to your rented units to streamline rent collection and tracking.
                </p>
            </div>
        </div>
    );
}
