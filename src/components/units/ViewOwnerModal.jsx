import Modal from '../common/Modal';
import Button from '../common/Button';
import { User, Phone, Mail, Calendar, IndianRupee, FileText, CreditCard } from 'lucide-react';

export default function ViewOwnerModal({ isOpen, onClose, ownerDetails, unitNumber }) {
    // Fallback for legacy sold units without owner details
    if (!ownerDetails) {
        return (
            <Modal isOpen={isOpen} onClose={onClose} title={`Owner Details - Unit ${unitNumber}`}>
                <div className="text-center py-8 text-gray-500">
                    <p>No owner details found for this unit.</p>
                    <p className="text-xs mt-2 text-gray-400">(This unit may have been marked as sold before owner tracking was added)</p>
                    <div className="flex justify-end pt-4 mt-4 border-t border-gray-100 w-full">
                        <Button variant="secondary" onClick={onClose}>Close</Button>
                    </div>
                </div>
            </Modal>
        );
    }

    const DetailItem = ({ icon: Icon, label, value }) => (
        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
            <Icon size={18} className="text-gray-400 mt-0.5 shrink-0" />
            <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
                <p className="text-gray-900 font-medium">{value || '-'}</p>
            </div>
        </div>
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Owner Details - Unit ${unitNumber}`}>
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DetailItem icon={User} label="Owner Name" value={ownerDetails.name} />
                    <DetailItem icon={Phone} label="Phone Number" value={ownerDetails.phone} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DetailItem icon={Mail} label="Email" value={ownerDetails.email} />
                    <DetailItem
                        icon={Calendar}
                        label="Purchase Date"
                        value={new Date(ownerDetails.purchaseDate).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'long', year: 'numeric'
                        })}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DetailItem icon={IndianRupee} label="Sale Value" value={ownerDetails.salePrice ? `₹${Number(ownerDetails.salePrice).toLocaleString('en-IN')}` : '-'} />
                    <DetailItem
                        icon={CreditCard}
                        label="ID Proof"
                        value={ownerDetails.idNumber ? `${ownerDetails.idType} - ${ownerDetails.idNumber}` : ownerDetails.idType || '-'}
                    />
                </div>

                {ownerDetails.notes && (
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <FileText size={18} className="text-gray-400 mt-0.5 shrink-0" />
                        <div className="w-full">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Notes</p>
                            <p className="text-gray-700 text-sm whitespace-pre-wrap">{ownerDetails.notes}</p>
                        </div>
                    </div>
                )}

                <div className="flex justify-end pt-4 border-t border-gray-100">
                    <Button variant="secondary" onClick={onClose}>Close</Button>
                </div>
            </div>
        </Modal>
    );
}
