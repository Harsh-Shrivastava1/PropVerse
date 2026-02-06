import { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import { format } from 'date-fns';
import InvoicePreview from '../invoice/InvoicePreview';
import { useBuilder } from '../../context/BuilderContext';

export default function MarkAsPaidModal({ isOpen, onClose, onConfirm, rentData }) {
    const [amount, setAmount] = useState(rentData?.amount || '');
    const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [loading, setLoading] = useState(false);

    // Invoice State
    const [showInvoice, setShowInvoice] = useState(false);
    const [invoiceData, setInvoiceData] = useState(null);

    const { builder } = useBuilder();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onConfirm({
                amount: Number(amount),
                date: new Date(date)
            });

            // Prepare Invoice Data
            setInvoiceData({
                ...rentData,
                amount: Number(amount),
                paymentDate: new Date(date),
                builderName: builder?.name || 'Builder',
                // Generate Invoice Number client-side
                invoiceNumber: `INV-${format(new Date(), 'yyyyMMdd')}-${Math.floor(1000 + Math.random() * 9000)}`
            });

            setShowInvoice(true);
        } catch (error) {
            console.error(error);
            onClose(); // Close on error if needed, or keep open to retry
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setShowInvoice(false);
        setInvoiceData(null);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={showInvoice ? "Payment Receipt" : "Mark Rent as Paid"}
            maxWidth={showInvoice ? "max-w-4xl" : "max-w-md"}
            hideHeader={showInvoice}
            padding={showInvoice ? "p-0" : undefined}
        >
            {showInvoice ? (
                <InvoicePreview data={invoiceData} onClose={handleClose} />
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <p className="text-sm text-gray-500">
                        Recording payment for Unit {rentData?.unitNumber} - {rentData?.tenantName}
                    </p>

                    <Input
                        label="Amount Received (₹)"
                        type="number"
                        min="0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />

                    <Input
                        label="Payment Date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />

                    <div className="flex justify-end gap-3 mt-6">
                        <Button variant="secondary" onClick={handleClose} type="button">Cancel</Button>
                        <Button type="submit" loading={loading} className="bg-green-600 hover:bg-green-700">
                            Confirm Payment
                        </Button>
                    </div>
                </form>
            )}
        </Modal>
    );
}
