import { useState } from 'react';
import { useSocietyData } from '../hooks/useSocietyData';
import { LayoutDashboard, Users, Scale, Calculator } from 'lucide-react';
import ExpensesModule from '../components/society/ExpensesModule';
import VendorsModule from '../components/society/VendorsModule';
import LegalModule from '../components/society/LegalModule';
import CalculatorsModule from '../components/society/CalculatorsModule';

export default function Society() {
    const {
        expenses, vendors, documents, contributionRate,
        addExpense, addVendor, addDocument, updateContributionRate, deleteItem
    } = useSocietyData();

    const [activeModule, setActiveModule] = useState('expenses');

    const modules = [
        { id: 'expenses', label: 'Expenses & Funds', icon: LayoutDashboard, desc: 'Track spending and contributions.' },
        { id: 'vendors', label: 'Vendors', icon: Users, desc: 'Manage contractors and staff.' },
        { id: 'legal', label: 'Legal & Compliance', icon: Scale, desc: 'Documents, NOCs, and expiries.' },
        { id: 'calculators', label: 'Planning Tools', icon: Calculator, desc: 'Cost estimators and budgeters.' },
    ];

    return (
        <div className="animate-in fade-in duration-500 space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Society Hub</h1>
                <p className="text-gray-500 mt-1">Central command for society operations, vendors, and financial planning.</p>
            </div>

            {/* Module Navigation Tabs as Large Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {modules.map(mod => {
                    const isActive = activeModule === mod.id;
                    const Icon = mod.icon;
                    return (
                        <button
                            key={mod.id}
                            onClick={() => setActiveModule(mod.id)}
                            className={`p-4 rounded-xl text-left transition-all border ${isActive
                                    ? 'bg-blue-50 border-blue-200 shadow-sm ring-1 ring-blue-200'
                                    : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            <div className={`p-2 rounded-lg w-fit mb-3 ${isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                                <Icon size={20} />
                            </div>
                            <h3 className={`font-bold ${isActive ? 'text-blue-900' : 'text-gray-900'}`}>{mod.label}</h3>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-1">{mod.desc}</p>
                        </button>
                    )
                })}
            </div>

            {/* Active Module Content */}
            <div className="min-h-[500px]">
                {activeModule === 'expenses' && (
                    <ExpensesModule
                        expenses={expenses}
                        addExpense={addExpense}
                        contributionRate={contributionRate}
                        updateContributionRate={updateContributionRate}
                    />
                )}
                {activeModule === 'vendors' && (
                    <VendorsModule
                        vendors={vendors}
                        addVendor={addVendor}
                        deleteVendor={deleteItem}
                    />
                )}
                {activeModule === 'legal' && (
                    <LegalModule
                        documents={documents}
                        addDocument={addDocument}
                        deleteDocument={deleteItem}
                    />
                )}
                {activeModule === 'calculators' && <CalculatorsModule />}
            </div>
        </div>
    );
}
