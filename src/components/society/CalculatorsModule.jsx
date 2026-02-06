import { useState } from 'react';
import Input from '../common/Input';

export default function CalculatorsModule() {
    const [activeTab, setActiveTab] = useState('construction');

    return (
        <div className="space-y-6">
            <div className="flex border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('construction')}
                    className={`px-4 py-2 text-sm font-medium ${activeTab === 'construction' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Construction
                </button>
                <button
                    onClick={() => setActiveTab('maintenance')}
                    className={`px-4 py-2 text-sm font-medium ${activeTab === 'maintenance' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Maintenance
                </button>
            </div>

            {activeTab === 'construction' && <ConstructionCalculator />}
            {activeTab === 'maintenance' && <MaintenanceCalculator />}
        </div>
    );
}

function ConstructionCalculator() {
    const [inputs, setInputs] = useState({ area: 1000, costPerSqFt: 1800, floors: 1 });
    const total = inputs.area * inputs.costPerSqFt * inputs.floors;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-900">Inputs</h3>
                <Input label="Area per Floor (sqft)" type="number" value={inputs.area} onChange={e => setInputs({ ...inputs, area: Number(e.target.value) })} />
                <Input label="Construction Cost (₹/sqft)" type="number" value={inputs.costPerSqFt} onChange={e => setInputs({ ...inputs, costPerSqFt: Number(e.target.value) })} />
                <Input label="Number of Floors" type="number" value={inputs.floors} onChange={e => setInputs({ ...inputs, floors: Number(e.target.value) })} />
            </div>
            <div className="bg-slate-900 p-6 rounded-xl shadow-lg text-white flex flex-col justify-center">
                <p className="text-slate-400 text-sm uppercase tracking-wider font-semibold">Estimated Budget</p>
                <div className="text-4xl font-bold mt-2">₹{total.toLocaleString('en-IN')}</div>
                <div className="mt-6 space-y-2 text-sm text-slate-300">
                    <div className="flex justify-between"><span>Material (approx 60%)</span><span>₹{(total * 0.6).toLocaleString('en-IN')}</span></div>
                    <div className="flex justify-between"><span>Labor (approx 40%)</span><span>₹{(total * 0.4).toLocaleString('en-IN')}</span></div>
                </div>
            </div>
        </div>
    );
}

function MaintenanceCalculator() {
    const [inputs, setInputs] = useState({ flats: 10, security: 25000, cleaning: 5000, other: 2000 });
    const total = inputs.security + inputs.cleaning + inputs.other;
    const perFlat = total / (inputs.flats || 1);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-900">Monthly Expenses</h3>
                <Input label="Total Flats" type="number" value={inputs.flats} onChange={e => setInputs({ ...inputs, flats: Number(e.target.value) })} />
                <Input label="Security Cost" type="number" value={inputs.security} onChange={e => setInputs({ ...inputs, security: Number(e.target.value) })} />
                <Input label="Cleaning / Housekeeping" type="number" value={inputs.cleaning} onChange={e => setInputs({ ...inputs, cleaning: Number(e.target.value) })} />
                <Input label="Utilities & Other" type="number" value={inputs.other} onChange={e => setInputs({ ...inputs, other: Number(e.target.value) })} />
            </div>
            <div className="bg-blue-600 p-6 rounded-xl shadow-lg text-white flex flex-col justify-center">
                <p className="text-blue-200 text-sm uppercase tracking-wider font-semibold">Total Monthly Cost</p>
                <div className="text-4xl font-bold mt-2">₹{total.toLocaleString('en-IN')}</div>

                <div className="mt-8 pt-6 border-t border-blue-500">
                    <p className="text-blue-200 text-sm uppercase tracking-wider font-semibold">Recommended Per Flat</p>
                    <div className="text-2xl font-bold mt-1">₹{Math.ceil(perFlat).toLocaleString('en-IN')}<span className="text-sm font-normal text-blue-200"> / month</span></div>
                </div>
            </div>
        </div>
    );
}
