import { createContext, useEffect, useState, useContext } from "react";
import { subscribeToAuthChanges, logoutUser } from "../firebase/auth";
import { mockUser } from "../utils/mockData";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isDemo, setIsDemo] = useState(() => {
        return localStorage.getItem('isDemo') === 'true';
    });

    useEffect(() => {
        // If in Demo mode, we don't need to listen to Firebase Auth
        if (isDemo) {
            setUser(mockUser);
            setLoading(false);
            return;
        }

        let unsubscribeUserDoc;

        const unsubscribe = subscribeToAuthChanges((currentUser) => {
            if (currentUser) {
                // console.log("Auth State Changed: User Logged In", currentUser.uid);

                // Get reference to THIS user's document
                const userRef = doc(db, 'builders', currentUser.uid);

                // Real-time listener: ONLY for this user
                unsubscribeUserDoc = onSnapshot(userRef, (docSnap) => {
                    if (docSnap.exists()) {
                        const userData = docSnap.data();

                        // Log to debug if needed (commented out for prod, but useful here)
                        // console.log(`Real-time update for ${currentUser.uid}: status=${userData.status}`);

                        // MERGE auth user with firestore data
                        setUser({ ...currentUser, ...userData });
                    } else {
                        // console.log("No builder doc found, using basic auth user.");
                        setUser(currentUser);
                    }
                }, (error) => {
                    console.error("Error listening to user doc:", error);
                });

            } else {
                // console.log("Auth State Changed: User Logged Out");
                setUser(null);
                if (unsubscribeUserDoc) unsubscribeUserDoc();
            }
            setLoading(false);
        });

        return () => {
            unsubscribe();
            if (unsubscribeUserDoc) unsubscribeUserDoc();
        };
    }, [isDemo]);

    const loginDemo = () => {
        localStorage.setItem('isDemo', 'true');
        setIsDemo(true);
        setUser(mockUser);
    };

    const logout = async () => {
        if (isDemo) {
            localStorage.removeItem('isDemo');
            setIsDemo(false);
            setUser(null);
            window.location.reload();
        } else {
            if (logoutUser) await logoutUser();
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, isDemo, loginDemo, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
