import { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';

export default function MarkAsSoldModal({ isOpen, onClose, onConfirm, unitNumber }) {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        idType: 'Aadhaar',
        idNumber: '',
        purchaseDate: new Date().toISOString().split('T')[0],
        salePrice: '',
        notes: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const validatePhone = (phone) => {
        const regex = /^\d{10,13}$/;
        return regex.test(phone);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.name.trim()) {
            setError('Owner Name is required');
            return;
        }
        if (!validatePhone(formData.phone)) {
            setError('Phone number must be 10-13 digits');
            return;
        }
        if (!formData.purchaseDate) {
            setError('Purchase Date is required');
            return;
        }

        setLoading(true);
        try {
            await onConfirm({
                ...formData,
                salePrice: formData.salePrice ? Number(formData.salePrice) : null
            });
            onClose();
        } catch (error) {
            console.error(error);
            setError('Failed to mark as sold. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="New Owner Details">
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Owner Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        placeholder="Enter full name"
                    />
                    <Input
                        label="Phone Number"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '');
                            setFormData({ ...formData, phone: val });
                        }}
                        required
                        placeholder="10-digit mobile"
                        maxLength={13}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Email Address"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Optional"
                    />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Date</label>
                        <input
                            type="date"
                            value={formData.purchaseDate}
                            onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                            className="block w-full rounded-lg border-gray-300 border p-2.5 focus:border-blue-500 focus:ring-blue-500 bg-white shadow-sm"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ID Proof Type</label>
                        <select
                            value={formData.idType}
                            onChange={(e) => setFormData({ ...formData, idType: e.target.value })}
                            className="block w-full rounded-lg border-gray-300 border p-2.5 focus:border-blue-500 focus:ring-blue-500 bg-white shadow-sm"
                        >
                            <option value="Aadhaar">Aadhaar</option>
                            <option value="PAN">PAN</option>
                            <option value="Passport">Passport</option>
                            <option value="Driving License">Driving License</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <Input
                        label="ID Number"
                        value={formData.idNumber}
                        onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                        placeholder="Optional"
                    />
                </div>

                <Input
                    label="Sale Value (₹)"
                    type="number"
                    value={formData.salePrice}
                    onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                    placeholder="Total sale amount"
                    min="0"
                />

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className="block w-full rounded-lg border-gray-300 border p-2.5 focus:border-blue-500 focus:ring-blue-500 bg-white shadow-sm min-h-[80px]"
                        placeholder="Any additional details..."
                    />
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                    <Button variant="secondary" onClick={onClose} type="button">Cancel</Button>
                    <Button type="submit" loading={loading} className="bg-blue-600 hover:bg-blue-700">
                        Confirm Sale
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
