import { useState } from 'react';
import { IndianRupee, TrendingUp, TrendingDown, Plus, Calendar } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';

export default function ExpensesModule({ expenses, addExpense, contributionRate, updateContributionRate, totalUnits = 20 }) {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [newExpense, setNewExpense] = useState({ title: '', category: 'Maintenance', amount: '', date: '' });

    // Stats
    const totalExpenses = expenses.reduce((acc, curr) => acc + Number(curr.amount), 0);
    const monthlyCollectionTarget = totalUnits * contributionRate;
    const currentMonthExpenses = expenses.reduce((acc, curr) => {
        const isCurrentMonth = new Date(curr.date).getMonth() === new Date().getMonth();
        return isCurrentMonth ? acc + Number(curr.amount) : acc;
    }, 0);

    const handleSubmit = (e) => {
        e.preventDefault();
        addExpense(newExpense);
        setIsAddOpen(false);
        setNewExpense({ title: '', category: 'Maintenance', amount: '', date: '' });
    };

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Monthly Spending</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">₹{currentMonthExpenses.toLocaleString('en-IN')}</h3>
                        </div>
                        <div className="p-2 bg-red-100 rounded-lg text-red-600"><TrendingDown size={20} /></div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Collection Target</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">₹{monthlyCollectionTarget.toLocaleString('en-IN')}</h3>
                            <p className="text-xs text-gray-400 mt-1">Based on ₹{contributionRate}/unit</p>
                        </div>
                        <div className="p-2 bg-green-100 rounded-lg text-green-600"><TrendingUp size={20} /></div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Contribution Rate</p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-2xl font-bold text-gray-900">₹</span>
                                <input
                                    type="number"
                                    value={contributionRate}
                                    onChange={(e) => updateContributionRate(Number(e.target.value))}
                                    className="border-b border-gray-300 w-24 text-2xl font-bold text-gray-900 focus:outline-none focus:border-blue-500"
                                />
                                <span className="text-sm text-gray-500">/unit</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-gray-900">Expense History</h3>
                    <Button onClick={() => setIsAddOpen(true)} className="flex items-center gap-2">
                        <Plus size={16} /> Add Expense
                    </Button>
                </div>
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500">
                        <tr>
                            <th className="px-6 py-4 font-medium">Description</th>
                            <th className="px-6 py-4 font-medium">Category</th>
                            <th className="px-6 py-4 font-medium">Date</th>
                            <th className="px-6 py-4 font-medium text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {expenses.map(expense => (
                            <tr key={expense.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{expense.title}</td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">{expense.category}</span>
                                </td>
                                <td className="px-6 py-4 text-gray-500">{expense.date}</td>
                                <td className="px-6 py-4 text-right font-bold text-gray-900">-₹{Number(expense.amount).toLocaleString('en-IN')}</td>
                            </tr>
                        ))}
                        {expenses.length === 0 && (
                            <tr><td colSpan="4" className="px-6 py-12 text-center text-gray-500">No expenses recorded yet.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Record New Expense">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input label="Expense Title" value={newExpense.title} onChange={e => setNewExpense({ ...newExpense, title: e.target.value })} required placeholder="e.g. Lift Repair" />
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Category</label>
                        <select
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={newExpense.category}
                            onChange={e => setNewExpense({ ...newExpense, category: e.target.value })}
                        >
                            <option>Maintenance</option>
                            <option>Utilities</option>
                            <option>Security</option>
                            <option>Event</option>
                            <option>Repairs</option>
                            <option>Other</option>
                        </select>
                    </div>
                    <Input label="Amount (₹)" type="number" value={newExpense.amount} onChange={e => setNewExpense({ ...newExpense, amount: e.target.value })} required />
                    <Input label="Date" type="date" value={newExpense.date} onChange={e => setNewExpense({ ...newExpense, date: e.target.value })} required />
                    <div className="flex justify-end gap-3 mt-6">
                        <Button variant="secondary" onClick={() => setIsAddOpen(false)} type="button">Cancel</Button>
                        <Button type="submit">Add Record</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
