import { useMemo } from 'react';
import { useUnits } from '../hooks/useUnits';
import { useRent } from '../hooks/useRent';
import { useProjects } from '../hooks/useProjects';
import {
    Building2, Store, Users, IndianRupee,
    AlertCircle, Activity, CheckCircle, Clock,
    TrendingUp, Calendar, Home, ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { format, isSameMonth, isSameYear, differenceInDays } from 'date-fns';

export default function Dashboard() {
    const { units, loading: unitsLoading } = useUnits();
    const { rentHistory, loading: rentLoading } = useRent();
    const { projects, loading: projectsLoading } = useProjects();

    const stats = useMemo(() => {
        if (!units || !rentHistory || !projects) return null;

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const today = now.getDate();

        // --- 1. BUSINESS SNAPSHOT ---
        const totalProjects = projects.length;
        const totalUnits = units.length;
        const occupiedUnits = units.filter(u => u.status === 'Rented' || u.status === 'Sold').length;
        const vacantUnits = units.filter(u => u.status === 'Vacant').length;

        // --- 2. RENT SUMMARY (Current Month) ---
        let rentCollected = 0;
        let rentPending = 0;
        let rentOverdue = 0;

        // Calculate Collected
        rentHistory.forEach(r => {
            const d = r.createdAt?.toDate ? r.createdAt.toDate() : new Date(r.createdAt || 0);
            if (isSameMonth(d, now) && isSameYear(d, now)) {
                rentCollected += parseFloat(r.amount || 0);
            }
        });

        // Calculate Pending & Overdue (Active Rents)
        const rentedUnits = units.filter(u => u.status === 'Rented');
        rentedUnits.forEach(unit => {
            if (!unit.tenant) return;

            // Check if paid this month
            const isPaid = rentHistory.find(r => {
                if (r.unitId !== unit.id) return false;
                const payDate = r.createdAt?.toDate ? r.createdAt.toDate() : new Date(r.createdAt || 0);
                return isSameMonth(payDate, now) && isSameYear(payDate, now);
            });

            if (!isPaid) {
                const rentAmount = parseFloat(unit.tenant.monthlyRent || 0);
                const dueDay = parseInt(unit.tenant.rentDueDay);

                rentPending += rentAmount;
                if (today > dueDay) {
                    rentOverdue += rentAmount;
                }
            }
        });

        // --- 3. STATUS INSIGHTS ---
        const overdueCount = rentedUnits.filter(unit => {
            if (!unit.tenant) return false;
            // Check paid status
            const isPaid = rentHistory.find(r => r.unitId === unit.id && isSameMonth((r.createdAt?.toDate ? r.createdAt.toDate() : new Date(r.createdAt || 0)), now));
            if (isPaid) return false;
            return today > parseInt(unit.tenant.rentDueDay);
        }).length;

        const longVacantCount = units.filter(u => {
            if (u.status !== 'Vacant' || !u.updatedAt) return false;
            const vacantSince = u.updatedAt?.toDate ? u.updatedAt.toDate() : new Date();
            return differenceInDays(now, vacantSince) > 30;
        }).length;

        const dueSoonCount = rentedUnits.filter(unit => {
            if (!unit.tenant) return false;
            const isPaid = rentHistory.find(r => r.unitId === unit.id && isSameMonth((r.createdAt?.toDate ? r.createdAt.toDate() : new Date(r.createdAt || 0)), now));
            if (isPaid) return false;

            const dueDay = parseInt(unit.tenant.rentDueDay);
            const diff = dueDay - today;
            return diff >= 0 && diff <= 7;
        }).length;

        // --- 4. ACTIVITY FEED ---
        const activities = [];

        // Project creations
        projects.forEach(p => {
            if (p.createdAt) {
                activities.push({
                    type: 'project',
                    title: 'New Project Added',
                    desc: p.name,
                    date: p.createdAt.toDate ? p.createdAt.toDate() : new Date(p.createdAt),
                    id: p.id
                });
            }
        });

        // Rent payments
        rentHistory.forEach(r => {
            if (r.createdAt) {
                activities.push({
                    type: 'rent',
                    title: 'Rent Payment Received',
                    desc: `₹${r.amount} from ${r.unitNumber}`,
                    date: r.createdAt.toDate ? r.createdAt.toDate() : new Date(r.createdAt),
                    id: r.id
                });
            }
        });

        // Unit updates (Simulated active log based on last update)
        units.forEach(u => {
            if (u.updatedAt) {
                let title = `Unit ${u.unitNumber} Updated`;
                if (u.status === 'Rented') title = `Unit ${u.unitNumber} Rented`;
                if (u.status === 'Vacant') title = `Unit ${u.unitNumber} Vacated`;
                if (u.status === 'Sold') title = `Unit ${u.unitNumber} Sold`;

                activities.push({
                    type: 'unit',
                    title: title,
                    desc: u.status,
                    date: u.updatedAt.toDate ? u.updatedAt.toDate() : new Date(u.updatedAt),
                    id: u.id
                });
            }
        });

        // Sort desc and take top 5
        activities.sort((a, b) => b.date - a.date);
        const recentActivity = activities.slice(0, 5);

        return {
            totalProjects,
            totalUnits,
            occupiedUnits,
            vacantUnits,
            rentCollected,
            rentPending,
            rentOverdue,
            overdueCount,
            longVacantCount,
            dueSoonCount,
            recentActivity
        };
    }, [units, rentHistory, projects]);

    if (unitsLoading || rentLoading || projectsLoading) return <DashboardSkeleton />;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Executive Overview</h1>
                    <p className="text-gray-500 text-sm">Real-time business performance.</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm">
                    <Calendar size={14} />
                    {format(new Date(), 'MMMM d, yyyy')}
                </div>
            </div>

            {/* 1. BUSINESS SNAPSHOT (KPIs) */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard
                    title="Total Projects"
                    value={stats?.totalProjects}
                    icon={Building2}
                    color="text-blue-600"
                    bg="bg-blue-50"
                />
                <KPICard
                    title="Total Units"
                    value={stats?.totalUnits}
                    icon={Store}
                    color="text-indigo-600"
                    bg="bg-indigo-50"
                />
                <KPICard
                    title="Occupied"
                    value={stats?.occupiedUnits}
                    subtitle={`${((stats?.occupiedUnits / (stats?.totalUnits || 1)) * 100).toFixed(0)}% Occupancy`}
                    icon={Users}
                    color="text-green-600"
                    bg="bg-green-50"
                />
                <KPICard
                    title="Vacant"
                    value={stats?.vacantUnits}
                    icon={Home}
                    color="text-gray-600"
                    bg="bg-gray-100"
                />
            </section>

            {/* 2. RENT SUMMARY (Financial) */}
            <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <IndianRupee size={18} className="text-gray-400" />
                        Rent Summary <span className="text-xs font-normal text-gray-400 ml-1">(This Month)</span>
                    </h3>
                    <Link to="/rent" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                        View Details <ArrowRight size={14} />
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                    <FinancialStat
                        label="Collected"
                        amount={stats?.rentCollected}
                        color="text-green-600"
                    />
                    <FinancialStat
                        label="Pending"
                        amount={stats?.rentPending}
                        color="text-orange-500"
                    />
                    <FinancialStat
                        label="Overdue"
                        amount={stats?.rentOverdue}
                        color="text-red-500"
                        alert={stats?.rentOverdue > 0}
                    />
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 3. STATUS INSIGHTS */}
                <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
                        <Activity size={18} className="text-gray-400" />
                        Status Insights
                    </h3>
                    <div className="space-y-4">
                        <InsightRow
                            label="Overdue Rent Accounts"
                            count={stats?.overdueCount}
                            color={stats?.overdueCount > 0 ? "text-red-600" : "text-gray-600"}
                            bg={stats?.overdueCount > 0 ? "bg-red-50" : "bg-gray-50"}
                            icon={AlertCircle}
                        />
                        <InsightRow
                            label="Units Vacant > 30 Days"
                            count={stats?.longVacantCount}
                            color={stats?.longVacantCount > 0 ? "text-gray-800" : "text-gray-500"}
                            bg="bg-gray-50"
                            icon={Clock}
                        />
                        <InsightRow
                            label="Rents Due (Next 7 Days)"
                            count={stats?.dueSoonCount}
                            color="text-blue-600"
                            bg="bg-blue-50"
                            icon={Calendar}
                        />
                    </div>
                </section>

                {/* 4. ACTIVITY SNAPSHOT */}
                <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
                        <TrendingUp size={18} className="text-gray-400" />
                        Recent Activity
                    </h3>
                    <div className="space-y-6">
                        {stats?.recentActivity.map((item, idx) => (
                            <div key={idx} className="flex gap-4 relative">
                                {idx !== stats.recentActivity.length - 1 && (
                                    <div className="absolute left-[11px] top-6 bottom-[-24px] w-px bg-gray-100"></div>
                                )}
                                <div className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center mt-0.5 ${getActivityColor(item.type)}`}>
                                    <ActivityIcon type={item.type} size={12} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{item.title}</p>
                                    <p className="text-xs text-gray-500">{item.desc} • {format(item.date, 'MMM d')}</p>
                                </div>
                            </div>
                        ))}
                        {stats?.recentActivity.length === 0 && (
                            <p className="text-sm text-gray-400 italic">No recent activity recorded.</p>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}

// --- SUBCOMPONENTS ---

function KPICard({ title, value, subtitle, icon: Icon, color, bg }) {
    return (
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-start justify-between hover:shadow-md transition-shadow">
            <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
                    {subtitle && <span className="text-xs font-medium text-gray-500">{subtitle}</span>}
                </div>
            </div>
            <div className={`p-2.5 rounded-lg ${bg} ${color}`}>
                <Icon size={20} />
            </div>
        </div>
    );
}

function FinancialStat({ label, amount, color, alert }) {
    return (
        <div className={`p-6 flex flex-col items-center justify-center text-center ${alert ? 'bg-red-50/30' : ''}`}>
            <p className="text-sm font-medium text-gray-400 mb-1">{label}</p>
            <h3 className={`text-2xl font-bold tracking-tight ${color}`}>
                ₹{amount.toLocaleString('en-IN')}
            </h3>
        </div>
    );
}

function InsightRow({ label, count, color, bg, icon: Icon }) {
    return (
        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${bg} ${color}`}>
                    <Icon size={16} />
                </div>
                <span className="text-sm font-medium text-gray-600">{label}</span>
            </div>
            <span className={`text-lg font-bold ${color}`}>{count}</span>
        </div>
    );
}

// Helper for Activity Colors & Icons
function getActivityColor(type) {
    if (type === 'rent') return 'bg-green-100 text-green-600';
    if (type === 'project') return 'bg-blue-100 text-blue-600';
    return 'bg-gray-100 text-gray-500';
}

function ActivityIcon({ type, size }) {
    if (type === 'rent') return <IndianRupee size={size} />;
    if (type === 'project') return <Building2 size={size} />;
    return <CheckCircle size={size} />;
}

function DashboardSkeleton() {
    return (
        <div className="space-y-8 animate-pulse">
            <div className="h-8 w-48 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
                ))}
            </div>
            <div className="h-48 bg-gray-200 rounded-xl"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-64 bg-gray-200 rounded-xl"></div>
                <div className="h-64 bg-gray-200 rounded-xl"></div>
            </div>
        </div>
    );
}
