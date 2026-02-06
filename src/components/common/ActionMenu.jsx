import { useState, useRef, useEffect } from 'react';
import { MoreVertical } from 'lucide-react';

export default function ActionMenu({ children }) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                className={`p-2 rounded-lg transition-colors ${isOpen ? 'bg-gray-100 text-gray-700' : 'text-gray-500 hover:bg-gray-100'
                    }`}
            >
                <MoreVertical size={18} />
            </button>

            {isOpen && (
                <div
                    className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-20 animate-in fade-in zoom-in-95 duration-75 origin-top-right"
                    onClick={() => setIsOpen(false)} // Close when any item is clicked
                >
                    {children}
                </div>
            )}
        </div>
    );
}
