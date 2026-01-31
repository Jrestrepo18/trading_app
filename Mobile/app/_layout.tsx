import { Slot, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { onAuthStateChanged } from 'firebase/auth';
import * as Notifications from 'expo-notifications';
import { Subscription } from 'expo-notifications';
import { auth } from '../services/firebase';
import useAuthStore from '../stores/authStore';
import { colors } from '../constants/theme';
import { registerForPushNotificationsAsync, addNotificationResponseListener, sendPushTokenToServer } from '../services/pushNotifications';

export default function RootLayout() {
    const { setUser, setLoading, user } = useAuthStore();
    const notificationListener = useRef<Subscription | null>(null);
    const responseListener = useRef<Subscription | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                setUser({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    name: firebaseUser.displayName,
                    emailVerified: firebaseUser.emailVerified,
                    photoURL: firebaseUser.photoURL,
                    role: 'user',
                });
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Register for push notifications when user is logged in
    useEffect(() => {
        if (user) {
            registerForPushNotificationsAsync().then(token => {
                if (token && user.uid) {
                    console.log('Push token registered:', token);
                    sendPushTokenToServer(token, user.uid);
                }
            });

            // Listener for received notifications
            notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
                console.log('Notification received:', notification);
            });

            // Listener for when user taps notification
            responseListener.current = addNotificationResponseListener(response => {
                const data = response.notification.request.content.data;
                // Navigate based on notification type
                if (data?.type === 'signal') {
                    router.push('/dashboard');
                } else if (data?.type === 'news') {
                    router.push('/dashboard');
                }
            });

            return () => {
                if (notificationListener.current) {
                    notificationListener.current.remove();
                }
                if (responseListener.current) {
                    responseListener.current.remove();
                }
            };
        }
    }, [user]);

    return (
        <SafeAreaProvider>
            <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
                <StatusBar style="light" />
                <Slot />
            </View>
        </SafeAreaProvider>
    );
}

