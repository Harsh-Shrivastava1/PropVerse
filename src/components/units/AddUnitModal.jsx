import { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import { useProjects } from '../../hooks/useProjects';

export default function AddUnitModal({ isOpen, onClose, onAdd }) {
    const { projects } = useProjects();
    const [formData, setFormData] = useState({
        projectId: '',
        unitNumber: '',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onAdd(formData);
            onClose();
            setFormData({ projectId: '', unitNumber: '' });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add New Unit">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
                    <select
                        value={formData.projectId}
                        onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                        className="block w-full rounded-lg border-gray-300 border p-2.5 focus:border-blue-500 focus:ring-blue-500"
                        required
                    >
                        <option value="">Select Project</option>
                        {projects.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </div>

                <Input
                    label="Unit Number"
                    value={formData.unitNumber}
                    onChange={(e) => setFormData({ ...formData, unitNumber: e.target.value })}
                    placeholder="e.g. A-101"
                    required
                />

                <div className="flex justify-end gap-3 mt-6">
                    <Button variant="secondary" onClick={onClose} type="button">Cancel</Button>
                    <Button type="submit" loading={loading}>Add Unit</Button>
                </div>
            </form>
        </Modal>
    );
}
