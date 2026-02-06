import { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { AuthContext } from './AuthContext';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const { user, isDemo } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (!user) {
            setNotifications([]);
            setUnreadCount(0);
            return;
        }

        if (isDemo) {
            setNotifications([
                {
                    id: 'demo-notif-1',
                    title: 'Welcome to Demo Mode!',
                    message: 'Feel free to explore the dashboard. Changes are not saved.',
                    read: false,
                    createdAt: new Date()
                }
            ]);
            setUnreadCount(1);
            return;
        }

        const q = query(
            collection(db, 'builders', user.uid, 'notifications'),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.read).length);
        });

        return () => unsubscribe();
    }, [user, isDemo]);

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount }}>
            {children}
        </NotificationContext.Provider>
    );
};
