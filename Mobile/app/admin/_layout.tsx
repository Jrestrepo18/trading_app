import { Stack } from 'expo-router';
import { colors } from '../../constants/theme';

export default function AdminLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.background.primary },
                animation: 'slide_from_right',
            }}
        >
            <Stack.Screen name="index" />
            <Stack.Screen name="signals" />
            <Stack.Screen name="users" />
            <Stack.Screen name="news" />
        </Stack>
    );
}
