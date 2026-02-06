import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { db } from "../firebase/config";
import { doc, onSnapshot } from "firebase/firestore";
import { mockBuilder } from "../utils/mockData";

// Helper to simulate builder fetch
const matchBuilderData = (uid) => {
    if (uid === mockBuilder.id) return mockBuilder;
    return null;
};

export const BuilderContext = createContext();

export const BuilderProvider = ({ children }) => {
    const { user, isDemo } = useContext(AuthContext);
    const [builder, setBuilder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setBuilder(null);
            setLoading(false);
            return;
        }

        if (isDemo) {
            // Import mock data dynamically or use from a closed scope if possible, 
            // but for cleaner code we updated imports above.
            // We need to add the import to the top of the file first.
            setBuilder(matchBuilderData(user.uid));
            setLoading(false);
            return;
        }

        const unsub = onSnapshot(doc(db, "builders", user.uid), (doc) => {
            if (doc.exists()) {
                setBuilder({ id: doc.id, ...doc.data() });
            } else {
                setBuilder(null);
            }
            setLoading(false);
        }, (error) => {
            console.error("Error fetching builder data:", error);
            setLoading(false);
        });

        return () => unsub();
    }, [user, isDemo]);

    return (
        <BuilderContext.Provider value={{ builder, loading, builderId: user?.uid }}>
            {children}
        </BuilderContext.Provider>
    );
};

// Helper to avoid circular dependency or complex imports inside useEffect
// We will update the imports in the file header in a separate edit or use a require if needed, 
// but since we are doing a replace, let's fix the imports now.
// WAIT: The previous tool call was a restricted partial replace. 
// I need to add the import statement for mockBuilder.
// I will rewrite the component to include the import and the mocked data logic.


export const useBuilder = () => {
    const context = useContext(BuilderContext);
    if (context === undefined) {
        throw new Error('useBuilder must be used within a BuilderProvider');
    }
    return context;
};
