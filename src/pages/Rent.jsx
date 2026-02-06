import { useState, useMemo } from 'react';
import { useRent } from '../hooks/useRent';
import { useUnits } from '../hooks/useUnits';
import { useProjects } from '../hooks/useProjects';
import Button from '../components/common/Button';
import MarkAsPaidModal from '../components/units/MarkAsPaidModal';
import {
    format, isSameMonth, isSameYear, parseISO,
    startOfMonth, endOfMonth, isAfter, getDate
} from 'date-fns';
import {
    CheckCircle, Clock, AlertTriangle, IndianRupee,
    Search, Filter, Calendar, TrendingUp, AlertCircle
} from 'lucide-react';

export default function Rent() {
    const { rentHistory, markRentPaid, loading: rentLoading } = useRent();
    const { units, loading: unitsLoading } = useUnits();
    const { projects } = useProjects();

    // UI State
    const [selectedUnit, setSelectedUnit] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [historyFilterMonth, setHistoryFilterMonth] = useState(format(new Date(), 'yyyy-MM')); // Default to current month

    // Helper to get project name
    const getProjectName = (id) => projects.find(p => p.id === id)?.name || '-';

    // --- COMPUTED DATA ---

    const currentMonthData = useMemo(() => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const today = now.getDate();

        // 1. Filter Rented Units
        const rentedUnits = units.filter(u => u.status === 'Rented');

        let totalCollected = 0;
        let pendingAmount = 0;
        let overdueAmount = 0;

        // 2. Map Status for Active Rents Table
        const activeRents = rentedUnits.map(unit => {
            const rentAmount = parseFloat(unit.tenant?.monthlyRent || 0);
            const dueDay = parseInt(unit.tenant?.rentDueDay || 5);

            // Check if paid this month
            const isPaid = rentHistory.find(r => {
                if (r.unitId !== unit.id) return false;
                const payDate = r.createdAt?.toDate ? r.createdAt.toDate() : new Date(r.createdAt || 0);
                return isSameMonth(payDate, now) && isSameYear(payDate, now);
            });

            let status = 'UNPAID';
            let paidDate = null;

            if (isPaid) {
                status = 'PAID';
                totalCollected += rentAmount;
                paidDate = isPaid.createdAt?.toDate ? isPaid.createdAt.toDate() : new Date();
            } else {
                pendingAmount += rentAmount;
                if (today > dueDay) {
                    status = 'OVERDUE';
                    overdueAmount += rentAmount;
                }
            }

            return {
                ...unit,
                computedStatus: status,
                rentAmount,
                dueDay,
                paidDate
            };
        });

        // Sort: Overdue first, then Unpaid, then Paid
        activeRents.sort((a, b) => {
            const priority = { 'OVERDUE': 0, 'UNPAID': 1, 'PAID': 2 };
            return priority[a.computedStatus] - priority[b.computedStatus];
        });

        return {
            activeRents,
            totalCollected,
            pendingAmount,
            overdueAmount,
            nextDueDate: activeRents.find(r => r.computedStatus !== 'PAID')?.dueDay || '-'
        };
    }, [units, rentHistory]);

    const filteredHistory = useMemo(() => {
        if (!rentHistory) return [];

        return rentHistory.filter(record => {
            const recordDate = record.createdAt?.toDate ? record.createdAt.toDate() : new Date(record.createdAt || 0);
            const matchesMonth = format(recordDate, 'yyyy-MM') === historyFilterMonth;

            const searchLower = searchTerm.toLowerCase();
            const matchesSearch =
                record.tenantName?.toLowerCase().includes(searchLower) ||
                record.unitNumber?.toLowerCase().includes(searchLower);

            return matchesMonth && matchesSearch;
        });
    }, [rentHistory, historyFilterMonth, searchTerm]);


    // --- ACTIONS ---

    const handlePaymentConfirm = async (data) => {
        if (!selectedUnit) return;
        await markRentPaid(selectedUnit.id, {
            ...data,
            unitNumber: selectedUnit.unitNumber,
            tenantName: selectedUnit.tenant.tenantName
        });
    };

    if (rentLoading || unitsLoading) return <RentSkeleton />;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* 1. Summary Section */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Rent Management</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <SummaryCard
                        title="Collected (This Month)"
                        value={currentMonthData.totalCollected}
                        icon={IndianRupee}
                        color="bg-green-500"
                        subtext="Total revenue received"
                    />
                    <SummaryCard
                        title="Pending Rent"
                        value={currentMonthData.pendingAmount}
                        icon={Clock}
                        color="bg-orange-500"
                        subtext="Expected revenue"
                    />
                    <SummaryCard
                        title="Overdue Amount"
                        value={currentMonthData.overdueAmount}
                        icon={AlertTriangle}
                        color="bg-red-500"
                        subtext="Requires immediate attention"
                    />
                    <SummaryCard
                        title="Next Due Date"
                        rawDisplay={currentMonthData.nextDueDate !== '-' ? `${currentMonthData.nextDueDate}th ${format(new Date(), 'MMM')}` : 'All Paid'}
                        icon={Calendar}
                        color="bg-blue-500"
                        subtext="Upcoming milestone"
                    />
                </div>
            </div>

            {/* 2. Active Rents Section */}
            <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <AlertCircle className="text-blue-600" size={20} />
                            Active Rents Status
                        </h2>
                        <p className="text-sm text-gray-500">Real-time status of all rented units for the current month.</p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4">Unit Details</th>
                                <th className="px-6 py-4">Tenant</th>
                                <th className="px-6 py-4">Rent Amount</th>
                                <th className="px-6 py-4">Due Date</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {currentMonthData.activeRents.map(unit => (
                                <tr key={unit.id} className={`hover:bg-gray-50 transition-colors ${unit.computedStatus === 'OVERDUE' ? 'bg-red-50/30' : ''}`}>
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-gray-900">{unit.unitNumber}</div>
                                        <div className="text-xs text-gray-500">{getProjectName(unit.projectId)}</div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-900">{unit.tenant?.tenantName}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">₹{unit.rentAmount.toLocaleString('en-IN')}</td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {unit.dueDay}th <span className="text-xs text-gray-400">of month</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={unit.computedStatus} />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {unit.computedStatus === 'PAID' ? (
                                            <span className="text-xs text-gray-400 font-medium flex items-center justify-end gap-1">
                                                <CheckCircle size={12} />
                                                Paid on {format(unit.paidDate, 'MMM d')}
                                            </span>
                                        ) : (
                                            <Button size="sm" onClick={() => setSelectedUnit(unit)}>
                                                Mark Paid
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {currentMonthData.activeRents.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                        No active rentals found. Add tenants to units to see them here.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* 3. Payment History Section */}
            <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <TrendingUp className="text-green-600" size={20} />
                            Payment History
                        </h2>
                        <p className="text-sm text-gray-500">Record of all past transactions.</p>
                    </div>

                    <div className="flex gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search tenant or unit..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 pr-4 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100 w-full md:w-64"
                            />
                        </div>
                        <div className="relative">
                            <input
                                type="month"
                                value={historyFilterMonth}
                                onChange={(e) => setHistoryFilterMonth(e.target.value)}
                                className="pl-3 pr-4 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100 bg-white"
                            />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4">Date Paid</th>
                                <th className="px-6 py-4">Unit</th>
                                <th className="px-6 py-4">Tenant</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredHistory.map(rent => (
                                <tr key={rent.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-gray-600">
                                        {rent.createdAt?.toDate ? format(rent.createdAt.toDate(), 'MMM d, yyyy, h:mm a') : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-gray-900">{rent.unitNumber}</td>
                                    <td className="px-6 py-4 text-gray-700">{rent.tenantName}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">₹{parseFloat(rent.amount).toLocaleString('en-IN')}</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                                            Success
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {filteredHistory.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                        No payment history found for this period.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Modals */}
            {selectedUnit && (
                <MarkAsPaidModal
                    isOpen={true}
                    onClose={() => setSelectedUnit(null)}
                    onConfirm={handlePaymentConfirm}
                    rentData={{
                        unitNumber: selectedUnit.unitNumber,
                        tenantName: selectedUnit.tenant?.tenantName,
                        amount: selectedUnit.tenant?.monthlyRent,
                        projectName: getProjectName(selectedUnit.projectId)
                    }}
                />
            )}
        </div>
    );
}

// --- SUBCOMPONENTS ---

function SummaryCard({ title, value, rawDisplay, icon: Icon, color, subtext }) {
    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-900">
                        {rawDisplay ? rawDisplay : `₹${value.toLocaleString('en-IN')}`}
                    </h3>
                    <p className="text-xs text-gray-400 mt-2">{subtext}</p>
                </div>
                <div className={`${color} p-3 rounded-lg text-white`}>
                    <Icon size={24} />
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }) {
    const styles = {
        'PAID': 'bg-green-100 text-green-700 border-green-200',
        'UNPAID': 'bg-orange-100 text-orange-700 border-orange-200',
        'OVERDUE': 'bg-red-100 text-red-700 border-red-200'
    };

    const icons = {
        'PAID': CheckCircle,
        'UNPAID': Clock,
        'OVERDUE': AlertCircle
    };

    const Icon = icons[status];

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[status]}`}>
            <Icon size={12} />
            {status}
        </span>
    );
}

function RentSkeleton() {
    return (
        <div className="space-y-8 animate-pulse">
            <div className="h-8 w-48 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
                ))}
            </div>
            <div className="h-96 bg-gray-200 rounded-xl"></div>
        </div>
    );
}
