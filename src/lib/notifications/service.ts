import { db } from '../firebase/client';
import {
    collection,
    addDoc,
    query,
    where,
    orderBy,
    limit,
    onSnapshot,
    doc,
    updateDoc,
    serverTimestamp,
    getDocs,
    writeBatch
} from 'firebase/firestore';
import { Notification, NotificationType } from '@/types/notification';

const NOTIFICATIONS_COLLECTION = 'notifications';

export const createNotification = async (
    uid: string,
    type: NotificationType,
    title: string,
    body: string,
    metadata: Record<string, any> = {}
) => {
    try {
        await addDoc(collection(db, NOTIFICATIONS_COLLECTION), {
            uid,
            type,
            title,
            body,
            metadata,
            createdAt: Date.now(),
            readAt: null
        });
    } catch (error) {
        console.error("Error creating notification:", error);
    }
};

export const subscribeToNotifications = (uid: string, callback: (notifications: Notification[]) => void) => {
    const q = query(
        collection(db, NOTIFICATIONS_COLLECTION),
        where("uid", "==", uid),
        orderBy("createdAt", "desc"),
        limit(50)
    );

    return onSnapshot(q, (snapshot) => {
        const notifications = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Notification[];
        callback(notifications);
    });
};

export const markAsRead = async (id: string) => {
    try {
        const notifRef = doc(db, NOTIFICATIONS_COLLECTION, id);
        await updateDoc(notifRef, {
            readAt: Date.now()
        });
    } catch (error) {
        console.error("Error marking notification as read:", error);
    }
};

export const markAllAsRead = async (uid: string) => {
    try {
        const q = query(
            collection(db, NOTIFICATIONS_COLLECTION),
            where("uid", "==", uid),
            where("readAt", "==", null)
        );

        const snapshot = await getDocs(q);
        const batch = writeBatch(db);

        snapshot.docs.forEach(doc => {
            batch.update(doc.ref, { readAt: Date.now() });
        });

        await batch.commit();
    } catch (error) {
        console.error("Error marking all as read:", error);
    }
};
