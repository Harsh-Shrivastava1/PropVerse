import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { useBuilder } from '../context/BuilderContext';
import { useAuth } from '../context/AuthContext';
import { mockProjects } from '../utils/mockData';
import { toast } from 'sonner';

export function useProjects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { builderId } = useBuilder();
    const { isDemo } = useAuth();

    useEffect(() => {
        if (!builderId) {
            setProjects([]);
            setLoading(false);
            return;
        }

        if (isDemo) {
            setProjects(mockProjects);
            setLoading(false);
            return;
        }

        const projectsRef = collection(db, 'builders', builderId, 'projects');
        // We fetch all and filter client-side to safely handle existing docs that might lack 'isDeleted'
        const q = query(projectsRef, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const projectsData = snapshot.docs
                .map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))
                .filter(p => !p.isDeleted); // Soft delete filter

            setProjects(projectsData);
            setLoading(false);
        }, (err) => {
            console.error("Error fetching projects:", err);
            setError(err);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [builderId, isDemo]);

    const addProject = async (data) => {
        if (isDemo) {
            toast.error("Demo Mode: Cannot create projects");
            return;
        }
        if (!builderId) throw new Error("No builder ID found");

        await addDoc(collection(db, 'builders', builderId, 'projects'), {
            ...data,
            isDeleted: false,
            createdAt: serverTimestamp()
        });
    };

    const updateProject = async (projectId, data) => {
        if (isDemo) {
            toast.error("Demo Mode: Cannot update projects");
            return;
        }
        if (!builderId) throw new Error("No builder ID found");

        await updateDoc(doc(db, 'builders', builderId, 'projects', projectId), {
            ...data,
            updatedAt: serverTimestamp()
        });
    }

    const deleteProject = async (projectId) => {
        if (isDemo) {
            toast.error("Demo Mode: Cannot delete projects");
            return;
        }
        if (!builderId) throw new Error("No builder ID found");

        // Soft delete
        await updateDoc(doc(db, 'builders', builderId, 'projects', projectId), {
            isDeleted: true,
            deletedAt: serverTimestamp()
        });
    };

    return { projects, loading, error, addProject, updateProject, deleteProject };
}
