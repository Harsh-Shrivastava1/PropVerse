import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, maxWidth = "sm:max-w-lg", hideHeader = false, padding = "px-4 pb-4 pt-5 sm:p-6 sm:pb-4" }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
                <div
                    className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                    onClick={onClose}
                ></div>

                <div className={`relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full ${maxWidth}`}>
                    <div className={`bg-white ${padding}`}>
                        {!hideHeader && (
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold leading-6 text-gray-900">{title}</h3>
                                <button
                                    onClick={onClose}
                                    className="rounded-full p-1 hover:bg-gray-100 transition-colors"
                                >
                                    <X size={20} className="text-gray-500" />
                                </button>
                            </div>
                        )}
                        <div className={!hideHeader ? "mt-2 text-sm text-gray-500" : ""}>
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
