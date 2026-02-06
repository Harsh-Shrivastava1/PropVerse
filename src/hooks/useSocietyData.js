import { useState, useEffect } from 'react';
import { toast } from 'sonner';

/**
 * useSocietyData Hook
 * Persists Society Hub data to localStorage to avoid backend schema changes.
 * Simulates a real database connection.
 */
export function useSocietyData() {
    const [expenses, setExpenses] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [contributionRate, setContributionRate] = useState(0);
    const [loading, setLoading] = useState(true);

    // Initial Load
    useEffect(() => {
        const loadData = () => {
            try {
                const storedData = localStorage.getItem('society_data');
                if (storedData) {
                    const parsed = JSON.parse(storedData);
                    setExpenses(parsed.expenses || []);
                    setVendors(parsed.vendors || []);
                    setDocuments(parsed.documents || []);
                    setContributionRate(parsed.contributionRate || 0);
                } else {
                    // Seed initial demo data for "Real Feel"
                    seedInitialData();
                }
            } catch (error) {
                console.error("Failed to load society data", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    // Save on Change
    useEffect(() => {
        if (!loading) {
            localStorage.setItem('society_data', JSON.stringify({
                expenses,
                vendors,
                documents,
                contributionRate
            }));
        }
    }, [expenses, vendors, documents, contributionRate, loading]);

    const seedInitialData = () => {
        const demoVendors = [
            { id: 1, name: 'SecureGuard Services', service: 'Security', phone: '9876543210', cost: 25000, status: 'Active', notes: 'Main gate and patrol' },
            { id: 2, name: 'City Lifts Pvt Ltd', service: 'Lift AMC', phone: '9876500000', cost: 8000, status: 'Active', notes: 'Quarterly servicing included' }
        ];
        const demoGenericExpenses = [
            { id: 1, title: 'October Security Payment', category: 'Security', amount: 25000, date: '2023-10-01', notes: 'Paid via Bank Transfer' },
            { id: 2, title: 'Diwali Lighting', category: 'Event', amount: 15000, date: '2023-10-25', notes: 'Entrance decoration' }
        ];

        setVendors(demoVendors);
        setExpenses(demoGenericExpenses);
        setContributionRate(2000); // Default per unity
    };

    // --- Actions ---

    const addExpense = (expense) => {
        const newExpense = { ...expense, id: Date.now(), date: expense.date || new Date().toISOString().split('T')[0] };
        setExpenses(prev => [newExpense, ...prev]);
        toast.success("Expense added successfully");
    };

    const addVendor = (vendor) => {
        const newVendor = { ...vendor, id: Date.now(), status: 'Active' };
        setVendors(prev => [...prev, newVendor]);
        toast.success("Vendor added successfully");
    };

    const addDocument = (doc) => {
        const newDoc = { ...doc, id: Date.now() };
        setDocuments(prev => [...prev, newDoc]);
        toast.success("Document record created");
    };

    const updateContributionRate = (rate) => {
        setContributionRate(rate);
        toast.success("Contribution rate updated");
    };

    const deleteItem = (type, id) => {
        if (type === 'expense') setExpenses(prev => prev.filter(i => i.id !== id));
        if (type === 'vendor') setVendors(prev => prev.filter(i => i.id !== id));
        if (type === 'document') setDocuments(prev => prev.filter(i => i.id !== id));
        toast.success("Item removed");
    };

    return {
        expenses,
        vendors,
        documents,
        contributionRate,
        loading,
        addExpense,
        addVendor,
        addDocument,
        updateContributionRate,
        deleteItem
    };
}
