import { useState } from 'react';
import { User, Phone, Briefcase, Plus, MoreVertical, Trash2 } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';

export default function VendorsModule({ vendors, addVendor, deleteVendor }) {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', service: '', phone: '', cost: '', notes: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        addVendor(formData);
        setIsAddOpen(false);
        setFormData({ name: '', service: '', phone: '', cost: '', notes: '' });
    };

    const totalMonthlyCost = vendors.reduce((acc, v) => acc + (Number(v.cost) || 0), 0);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Active Vendors</h2>
                    <p className="text-sm text-gray-500">Total Monthly Commitments: <span className="font-bold text-gray-900">₹{totalMonthlyCost.toLocaleString('en-IN')}</span></p>
                </div>
                <Button onClick={() => setIsAddOpen(true)} className="flex items-center gap-2">
                    <Plus size={16} /> Add Vendor
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vendors.map(vendor => (
                    <div key={vendor.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow group relative">
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => deleteVendor('vendor', vendor.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                        </div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                                <Briefcase size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">{vendor.name}</h3>
                                <p className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-full inline-block mt-1">{vendor.service}</p>
                            </div>
                        </div>
                        <div className="space-y-3 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <Phone size={14} className="text-gray-400" />
                                {vendor.phone}
                            </div>
                            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                                <span>Monthly Cost</span>
                                <span className="font-bold text-gray-900">₹{Number(vendor.cost).toLocaleString('en-IN')}</span>
                            </div>
                        </div>
                    </div>
                ))}
                {vendors.length === 0 && (
                    <div className="col-span-full py-12 text-center text-gray-400 bg-gray-50 rounded-xl border-dashed border-2 border-gray-200">
                        No vendors added yet.
                    </div>
                )}
            </div>

            <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add Contractor / Vendor">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input label="Company / Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                    <Input label="Service Tyoe" placeholder="e.g. Electrician, Security" value={formData.service} onChange={e => setFormData({ ...formData, service: e.target.value })} required />
                    <Input label="Phone" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                    <Input label="Monthly Cost (₹)" type="number" value={formData.cost} onChange={e => setFormData({ ...formData, cost: e.target.value })} />
                    <div className="flex justify-end gap-3 mt-6">
                        <Button variant="secondary" onClick={() => setIsAddOpen(false)} type="button">Cancel</Button>
                        <Button type="submit">Save Vendor</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
