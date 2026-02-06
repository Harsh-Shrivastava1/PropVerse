import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Download, CheckCircle, Lock } from 'lucide-react';
import Button from '../common/Button';

export default function InvoicePreview({ data, onClose }) {
    const [downloading, setDownloading] = useState(false);

    // Generate Invoice Number if not present
    const invoiceNumber = data.invoiceNumber || `INV-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
    const currentDate = new Date().toLocaleDateString('en-IN', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    const handleDownload = async () => {
        const element = document.getElementById('invoice-content');
        if (!element) return;

        setDownloading(true);
        try {
            // Wait for images/fonts to render
            await new Promise(resolve => setTimeout(resolve, 500));

            const canvas = await html2canvas(element, {
                scale: 3, // Higher resolution for crisp text
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const imgWidth = 210; // A4 width in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save(`Invoice_${invoiceNumber}.pdf`);
        } catch (error) {
            console.error('PDF Generation failed:', error);
            alert('Failed to generate PDF. Please try again.');
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className="flex flex-col h-full overflow-hidden max-h-[90vh] p-6">
            {/* Header / Actions - Sticky Top */}
            <div className="flex justify-between items-center mb-4 shrink-0">
                <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-semibold text-sm">Payment Recorded Successfully</span>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        disabled={downloading}
                        className="text-xs h-8 px-3"
                    >
                        Close
                    </Button>
                    <Button
                        onClick={handleDownload}
                        loading={downloading}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-xs h-8 px-3"
                    >
                        {downloading ? (
                            <>Generating...</>
                        ) : (
                            <>
                                <Download size={14} />
                                Download PDF
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Invoice Container - centered content */}
            <div className="flex-1 overflow-auto bg-gray-100/50 p-4 rounded-xl border border-gray-200 flex justify-center">
                <div
                    id="invoice-content"
                    className="bg-white shadow-md p-6 w-full max-w-[210mm] flex flex-col justify-between text-gray-900 border border-slate-100"
                >
                    {/* Top Section */}
                    <div>
                        {/* Header */}
                        <div className="flex justify-between items-start border-b border-gray-100 pb-4 mb-4">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <div className="h-8 w-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                                        P
                                    </div>
                                    <div>
                                        <h1 className="text-xl font-bold text-slate-900 leading-none">Propvera</h1>
                                        <p className="text-[10px] text-slate-500 font-medium tracking-wide mt-1">REAL ESTATE OPERATING SYSTEM</p>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="inline-block px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-widest rounded-full mb-2">
                                    Receipt
                                </span>
                                <div className="text-xs text-slate-500 font-medium space-y-0.5">
                                    <p>#{invoiceNumber}</p>
                                    <p>{currentDate}</p>
                                </div>
                            </div>
                        </div>

                        {/* From / To - 2 Column Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="p-3 bg-slate-50/50 rounded-lg border border-slate-100">
                                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">From</h3>
                                <p className="font-bold text-slate-900 text-sm mb-0.5">{data.builderName || 'Builder'}</p>
                                <p className="text-xs text-slate-500">{data.projectName}</p>
                            </div>
                            <div className="p-3 bg-slate-50/50 rounded-lg border border-slate-100">
                                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Bill To</h3>
                                <p className="font-bold text-slate-900 text-sm mb-0.5">{data.tenantName}</p>
                                <p className="text-xs text-slate-500">Unit {data.unitNumber}</p>
                            </div>
                        </div>

                        {/* Payment Summary Card */}
                        <div className="border border-slate-200 rounded-lg overflow-hidden mb-4">
                            <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex justify-between items-center">
                                <h3 className="text-[10px] font-bold text-slate-700 uppercase tracking-wide">Payment Summary</h3>
                            </div>
                            <div className="p-4 bg-white">
                                <div className="flex justify-between items-start gap-4 mb-4">
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-semibold text-slate-900">Rent Payment</p>
                                        <p className="text-xs text-slate-500 mt-0.5 break-words">Project: {data.projectName} • Unit {data.unitNumber}</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-sm font-bold text-slate-900">₹{Number(data.amount).toLocaleString('en-IN')}</p>
                                        <p className="text-xs text-slate-400 mt-0.5">{currentDate}</p>
                                    </div>
                                </div>

                                <div className="border-t border-dashed border-slate-200 my-3"></div>

                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-slate-500">Subtotal</span>
                                        <span className="font-medium text-slate-900">₹{Number(data.amount).toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-slate-500">Tax</span>
                                        <span className="font-medium text-slate-900">₹0</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t border-slate-100 mt-2">
                                        <span className="text-sm font-bold text-slate-900">Total Paid</span>
                                        <span className="text-lg font-bold text-slate-900">₹{Number(data.amount).toLocaleString('en-IN')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer - Bottom Aligned */}
                    <div className="text-center pt-6 border-t border-slate-100 mt-auto">
                        <div className="flex items-center justify-center gap-1.5 text-slate-400 mb-1">
                            <Lock size={10} />
                            <span className="text-[10px] uppercase tracking-wide font-medium">Secure Payment</span>
                        </div>
                        <p className="text-[10px] text-slate-400">Secure system-generated receipt by Propvera</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
