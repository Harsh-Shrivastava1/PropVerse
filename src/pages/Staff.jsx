import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc, onSnapshot, query, serverTimestamp } from 'firebase/firestore';
import { useBuilder } from '../hooks/useBuilder';
import { useAuth } from '../hooks/useAuth';
import { mockStaff } from '../utils/mockData';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import { Users, Mail, Phone, Briefcase } from 'lucide-react';
import { toast } from 'sonner';

export default function Staff() {
    const { builderId } = useBuilder();
    const { isDemo } = useAuth();
    const [staff, setStaff] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', role: '', email: '', phone: '', salary: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!builderId) return;

        if (isDemo) {
            setStaff(mockStaff);
            return;
        }

        const q = query(collection(db, 'builders', builderId, 'staff'));
        const unsub = onSnapshot(q, (snap) => {
            setStaff(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        });
        return () => unsub();
    }, [builderId, isDemo]);

    const handleAddStaff = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (isDemo) {
            toast.error("Demo Mode: Cannot add staff");
            setLoading(false);
            return;
        }

        try {
            if (builderId) {
                await addDoc(collection(db, 'builders', builderId, 'staff'), {
                    ...formData,
                    createdAt: serverTimestamp()
                });
                setIsModalOpen(false);
                setFormData({ name: '', role: '', email: '', phone: '', salary: '' });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
                <Button onClick={() => setIsModalOpen(true)}>+ Add Staff</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {staff.map(member => (
                    <div key={member.id} className="bg-white p-6 rounded-xl border border-gray-200">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                                <Users size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">{member.name}</h3>
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{member.role}</span>
                            </div>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2"><Mail size={16} /> {member.email}</div>
                            <div className="flex items-center gap-2"><Phone size={16} /> {member.phone}</div>
                            <div className="flex items-center gap-2"><Briefcase size={16} /> Salary: ₹{member.salary}</div>
                        </div>
                    </div>
                ))}
                {staff.length === 0 && (
                    <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-xl border border-dashed">
                        No staff members added yet.
                    </div>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Staff Member">
                <form onSubmit={handleAddStaff} className="space-y-4">
                    <Input label="Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                    <Input label="Role" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} placeholder="e.g. Manager, Guard" required />
                    <Input label="Email" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                    <Input label="Phone" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} required />
                    <Input label="Salary" type="number" value={formData.salary} onChange={e => setFormData({ ...formData, salary: e.target.value })} required />
                    <div className="flex justify-end gap-3 mt-6">
                        <Button variant="secondary" onClick={() => setIsModalOpen(false)} type="button">Cancel</Button>
                        <Button type="submit" loading={loading}>Add Staff</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
