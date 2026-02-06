import { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';

export default function MarkAsRentedModal({ isOpen, onClose, onConfirm, unitNumber }) {
    const [formData, setFormData] = useState({
        tenantName: '',
        monthlyRent: '',
        rentDueDay: '1'
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onConfirm({
                tenantName: formData.tenantName,
                monthlyRent: Number(formData.monthlyRent),
                rentDueDay: Number(formData.rentDueDay)
            });
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Mark Unit ${unitNumber} as Rented`}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Tenant Name"
                    value={formData.tenantName}
                    onChange={(e) => setFormData({ ...formData, tenantName: e.target.value })}
                    required
                />

                <Input
                    label="Monthly Rent (₹)"
                    type="number"
                    min="0"
                    value={formData.monthlyRent}
                    onChange={(e) => setFormData({ ...formData, monthlyRent: e.target.value })}
                    required
                />

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rent Due Day (1-28)</label>
                    <input
                        type="number"
                        min="1"
                        max="28"
                        value={formData.rentDueDay}
                        onChange={(e) => setFormData({ ...formData, rentDueDay: e.target.value })}
                        className="block w-full rounded-lg border-gray-300 border p-2.5 focus:border-blue-500 focus:ring-blue-500 bg-white shadow-sm"
                        required
                    />
                    <p className="text-xs text-gray-500 mt-1">Select a day between 1 and 28 for recurring checks.</p>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <Button variant="secondary" onClick={onClose} type="button">Cancel</Button>
                    <Button type="submit" loading={loading} className="bg-green-600 hover:bg-green-700">
                        Confirm Rental
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
