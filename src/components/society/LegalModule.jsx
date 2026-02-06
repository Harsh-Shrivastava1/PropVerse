import { useState } from 'react';
import { FileText, Calendar, AlertTriangle, Download, Plus, Trash2 } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';

export default function LegalModule({ documents, addDocument, deleteDocument }) {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', type: 'License', expiryDate: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        addDocument(formData);
        setIsAddOpen(false);
        setFormData({ name: '', type: 'License', expiryDate: '' });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-900">Compliance Documents</h2>
                <Button onClick={() => setIsAddOpen(true)} className="flex items-center gap-2">
                    <Plus size={16} /> Upload Record
                </Button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500">
                        <tr>
                            <th className="px-6 py-4 font-medium">Document Name</th>
                            <th className="px-6 py-4 font-medium">Type</th>
                            <th className="px-6 py-4 font-medium">Expiry Date</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 font-medium text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {documents.map(doc => {
                            const isExpired = doc.expiryDate && new Date(doc.expiryDate) < new Date();
                            return (
                                <tr key={doc.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-2">
                                        <FileText size={16} className="text-blue-500" />
                                        {doc.name}
                                    </td>
                                    <td className="px-6 py-4">{doc.type}</td>
                                    <td className="px-6 py-4 text-gray-600">{doc.expiryDate || 'N/A'}</td>
                                    <td className="px-6 py-4">
                                        {isExpired ? (
                                            <span className="flex items-center gap-1 text-red-600 font-medium text-xs">
                                                <AlertTriangle size={12} /> Expired
                                            </span>
                                        ) : (
                                            <span className="text-green-600 font-medium text-xs bg-green-50 px-2 py-1 rounded-full">Valid</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                                        <button onClick={() => deleteDocument('document', doc.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                                    </td>
                                </tr>
                            );
                        })}
                        {documents.length === 0 && (
                            <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-500">No documents tracked yet.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Track New Document">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input label="Document Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Type</label>
                        <select
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.type}
                            onChange={e => setFormData({ ...formData, type: e.target.value })}
                        >
                            <option>Registration</option>
                            <option>NOC</option>
                            <option>Maintenance Contract</option>
                            <option>Insurance</option>
                            <option>Other</option>
                        </select>
                    </div>
                    <Input label="Expiry Date" type="date" value={formData.expiryDate} onChange={e => setFormData({ ...formData, expiryDate: e.target.value })} />
                    <div className="flex justify-end gap-3 mt-6">
                        <Button variant="secondary" onClick={() => setIsAddOpen(false)} type="button">Cancel</Button>
                        <Button type="submit">Track Document</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
