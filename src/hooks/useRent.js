import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, updateDoc, doc, where, getDocs } from 'firebase/firestore';
import { useBuilder } from '../context/BuilderContext';
import { useAuth } from '../context/AuthContext';
import { mockRentHistory } from '../utils/mockData';
import { toast } from 'sonner';

export function useRent() {
    const [rentHistory, setRentHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const { builderId } = useBuilder();
    const { isDemo } = useAuth();

    useEffect(() => {
        if (!builderId) {
            setRentHistory([]);
            setLoading(false);
            return;
        }

        if (isDemo) {
            setRentHistory(mockRentHistory);
            setLoading(false);
            return;
        }

        const rentsRef = collection(db, 'builders', builderId, 'rents');
        const q = query(rentsRef, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs
                .map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))
                .filter(r => r.status === 'PAID'); // Only show valid payments in history

            setRentHistory(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [builderId, isDemo]);

    const markRentPaid = async (unitId, paymentData) => {
        if (isDemo) {
            toast.error("Demo Mode: Cannot record payments");
            return;
        }
        if (!builderId) throw new Error("No builder ID");

        // 1. Add rent record
        await addDoc(collection(db, 'builders', builderId, 'rents'), {
            unitId,
            ...paymentData,
            status: 'PAID',
            createdAt: serverTimestamp()
        });

        // 2. Update unit rental status
        await updateDoc(doc(db, 'builders', builderId, 'units', unitId), {
            rentStatus: 'PAID',
            lastPaidAt: serverTimestamp()
        });
    };

    const markRentUnpaid = async (unitId) => {
        if (isDemo) {
            toast.error("Demo Mode: Cannot update payment status");
            return;
        }
        if (!builderId) throw new Error("No builder ID");

        // Find the payment for THIS month for this unit and update status to UNPAID
        const rentsRef = collection(db, 'builders', builderId, 'rents');
        const q = query(rentsRef, where('unitId', '==', unitId), where('status', '==', 'PAID'));

        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
            // Sort in memory to avoid composite index requirement
            const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            docs.sort((a, b) => {
                const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
                const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
                return dateB - dateA;
            });
            const lastPayment = docs[0];

            await updateDoc(doc(db, 'builders', builderId, 'rents', lastPayment.id), {
                status: 'UNPAID',
                updatedAt: serverTimestamp()
            });

            // Update unit status - removing rentStatus or setting to UNPAID
            await updateDoc(doc(db, 'builders', builderId, 'units', unitId), {
                rentStatus: 'UNPAID',
                lastPaidAt: null
            });
        }
    };

    return { rentHistory, loading, markRentPaid, markRentUnpaid };
}
