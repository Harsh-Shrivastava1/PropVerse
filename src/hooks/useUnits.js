import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, updateDoc, doc, where } from 'firebase/firestore';
import { useBuilder } from '../context/BuilderContext';
import { useAuth } from '../context/AuthContext';
import { mockUnits } from '../utils/mockData';
import { toast } from 'sonner';

export function useUnits(projectId = null) {
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(true);
    const { builderId } = useBuilder();
    const { isDemo } = useAuth();

    useEffect(() => {
        if (!builderId) {
            setUnits([]);
            setLoading(false);
            return;
        }

        if (isDemo) {
            if (projectId) {
                setUnits(mockUnits.filter(u => u.projectId === projectId));
            } else {
                setUnits(mockUnits);
            }
            setLoading(false);
            return;
        }

        const unitsRef = collection(db, 'builders', builderId, 'units');
        let q = query(unitsRef, orderBy('unitNumber', 'asc'));

        // If projectId is provided, filter by it. 
        if (projectId) {
            q = query(unitsRef, where('projectId', '==', projectId));
        }

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs
                .map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))
                .filter(u => !u.isDeleted); // Soft delete filter

            setUnits(data);
            setLoading(false);
        }, (err) => {
            console.error("Error fetching units:", err);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [builderId, projectId, isDemo]);

    const addUnit = async (data) => {
        if (isDemo) {
            toast.error("Demo Mode: Cannot add units");
            return;
        }
        if (!builderId) throw new Error("No builder ID");
        await addDoc(collection(db, 'builders', builderId, 'units'), {
            ...data,
            status: 'Vacant',
            isDeleted: false,
            createdAt: serverTimestamp()
        });
    };

    const updateUnitStatus = async (unitId, status, additionalData = {}) => {
        if (isDemo) {
            toast.error("Demo Mode: Cannot update unit status");
            return;
        }
        if (!builderId) throw new Error("No builder ID");

        await updateDoc(doc(db, 'builders', builderId, 'units', unitId), {
            status,
            ...additionalData,
            updatedAt: serverTimestamp()
        });
    };

    const updateUnit = async (unitId, data) => {
        if (isDemo) {
            toast.error("Demo Mode: Cannot update unit details");
            return;
        }
        if (!builderId) throw new Error("No builder ID");
        await updateDoc(doc(db, 'builders', builderId, 'units', unitId), {
            ...data,
            updatedAt: serverTimestamp()
        });
    };

    const deleteUnit = async (unitId) => {
        if (isDemo) {
            toast.error("Demo Mode: Cannot delete units");
            return;
        }
        if (!builderId) throw new Error("No builder ID");
        // Soft delete
        await updateDoc(doc(db, 'builders', builderId, 'units', unitId), {
            isDeleted: true,
            deletedAt: serverTimestamp()
        });
    };

    return { units, loading, addUnit, updateUnitStatus, updateUnit, deleteUnit };
}
