import { useContext } from 'react';
import { NotificationContext } from '../context/NotificationContext';
import { db } from '../firebase/config';
import { doc, updateDoc } from 'firebase/firestore';
import { useBuilder } from '../hooks/useBuilder';
import { Bell, Key } from 'lucide-react';
import { format } from 'date-fns';

export default function Notifications() {
    const { notifications } = useContext(NotificationContext);
    const { builderId } = useBuilder();

    const markAsRead = async (id) => {
        if (builderId) {
            await updateDoc(doc(db, 'builders', builderId, 'notifications', id), { read: true });
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>

            <div className="space-y-4">
                {notifications.map(notif => (
                    <div
                        key={notif.id}
                        className={`p-4 rounded-xl border flex gap-4 ${notif.read ? 'bg-white border-gray-200' : 'bg-blue-50 border-blue-200'}`}
                        onClick={() => !notif.read && markAsRead(notif.id)}
                    >
                        <div className={`mt-1 p-2 rounded-lg ${notif.read ? 'bg-gray-100 text-gray-500' : 'bg-blue-100 text-blue-600'}`}>
                            <Bell size={20} />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h3 className={`font-semibold ${notif.read ? 'text-gray-900' : 'text-blue-900'}`}>{notif.title || 'Notification'}</h3>
                                <span className="text-xs text-gray-500">{notif.createdAt?.toDate ? format(notif.createdAt.toDate(), 'PPP p') : ''}</span>
                            </div>
                            <p className={`text-sm mt-1 ${notif.read ? 'text-gray-600' : 'text-blue-800'}`}>{notif.message}</p>
                        </div>
                        {!notif.read && (
                            <div className="w-2 h-2 rounded-full bg-blue-600 mt-2"></div>
                        )}
                    </div>
                ))}

                {notifications.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-200 text-gray-500">
                        No notifications yet.
                    </div>
                )}
            </div>
        </div>
    );
}
