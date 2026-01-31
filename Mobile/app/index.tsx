import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import useAuthStore from '../stores/authStore';
import { colors } from '../constants/theme';

export default function Index() {
    const { isAuthenticated, isLoading } = useAuthStore();

    if (isLoading) {
        return (
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: colors.background.primary
            }}>
                <ActivityIndicator size="large" color={colors.brand.primary} />
            </View>
        );
    }

    if (isAuthenticated) {
        return <Redirect href="/dashboard" />;
    }

    return <Redirect href="/login" />;
}
