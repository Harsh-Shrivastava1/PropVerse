import { useBuilder } from '../hooks/useBuilder';
import { useRent } from '../hooks/useRent';
import { IndianRupee, TrendingUp, Home } from 'lucide-react';
import { format } from 'date-fns';

export default function Reports() {
    const { builder } = useBuilder();
    const { rentHistory } = useRent();

    // Basic stats
    const totalRevenue = rentHistory.reduce((acc, curr) => acc + (curr.amount || 0), 0);
    const occupancyRate = builder?.totalUnits ? Math.round((builder.rentedUnits / builder.totalUnits) * 100) : 0;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-100 text-green-600 rounded-lg"><IndianRupee size={20} /></div>
                        <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">₹{totalRevenue.toLocaleString()}</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><TrendingUp size={20} /></div>
                        <p className="text-sm text-gray-500 font-medium">Occupancy Rate</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{occupancyRate}%</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><Home size={20} /></div>
                        <p className="text-sm text-gray-500 font-medium">Total Inventory</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{builder?.totalUnits || 0} Units</p>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500">
                            <tr>
                                <th className="px-4 py-3 rounded-l-lg">Date</th>
                                <th className="px-4 py-3">Unit</th>
                                <th className="px-4 py-3">Tenant</th>
                                <th className="px-4 py-3 rounded-r-lg">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {rentHistory.slice(0, 10).map(rent => (
                                <tr key={rent.id}>
                                    <td className="px-4 py-3">{rent.date?.toDate ? format(rent.date.toDate(), 'MMM d, yyyy') : 'N/A'}</td>
                                    <td className="px-4 py-3 font-medium">{rent.unitNumber}</td>
                                    <td className="px-4 py-3 text-gray-500">{rent.tenantName}</td>
                                    <td className="px-4 py-3 text-green-600 font-medium">+ ₹{rent.amount}</td>
                                </tr>
                            ))}
                            {rentHistory.length === 0 && (
                                <tr><td colSpan="4" className="text-center py-4 text-gray-500">No transactions found</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
