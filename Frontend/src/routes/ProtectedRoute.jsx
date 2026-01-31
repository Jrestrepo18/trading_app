import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import { Loader2 } from 'lucide-react';

/**
 * ProtectedRoute Component
 * Provides robust route protection with multiple security layers:
 * - Authentication check
 * - Email verification check (optional)
 * - Role-based access control
 * - Loading state during auth verification
 */
const ProtectedRoute = ({
    children,
    requireEmailVerified = true,  // Require verified email by default
    allowedRoles = null,          // Array of allowed roles, null = any role
    redirectTo = '/login'         // Where to redirect if unauthorized
}) => {
    const location = useLocation();
    const {
        isAuthenticated,
        isLoading,
        user,
        isEmailVerified
    } = useAuthStore();

    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        // Give time for auth state to initialize
        const timer = setTimeout(() => {
            setIsChecking(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    // Show loading while checking auth state
    if (isLoading || isChecking) {
        return (
            <div className="min-h-screen bg-[#0A0C10] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
                    <p className="text-slate-400 text-sm">Verificando autenticación...</p>
                </div>
            </div>
        );
    }

    // Not authenticated - redirect to login
    if (!isAuthenticated) {
        console.log('🔒 Access denied: Not authenticated');
        return (
            <Navigate
                to={redirectTo}
                state={{ from: location, message: 'Debes iniciar sesión para acceder' }}
                replace
            />
        );
    }

    // Check email verification if required
    if (requireEmailVerified && !isEmailVerified) {
        console.log('🔒 Access denied: Email not verified');
        return (
            <Navigate
                to="/verify-email-required"
                state={{ from: location, email: user?.email }}
                replace
            />
        );
    }

    // Check role-based access
    if (allowedRoles && allowedRoles.length > 0) {
        const userRole = user?.role || 'user';
        console.log(`🔐 Role check - User role: "${userRole}", Required roles:`, allowedRoles);
        console.log('📦 Full user object:', JSON.stringify(user, null, 2));

        if (!allowedRoles.includes(userRole)) {
            console.log(`🔒 Access denied: Role "${userRole}" not in allowed roles:`, allowedRoles);
            return (
                <Navigate
                    to="/unauthorized"
                    state={{ from: location, requiredRoles: allowedRoles }}
                    replace
                />
            );
        }
    }

    // All checks passed - render protected content
    console.log('✅ Access granted to:', location.pathname, '| User role:', user?.role);
    return children;
};

/**
 * AdminRoute - Shorthand for admin-only routes
 */
export const AdminRoute = ({ children }) => (
    <ProtectedRoute allowedRoles={['admin']} redirectTo="/login">
        {children}
    </ProtectedRoute>
);

/**
 * PublicOnlyRoute - Redirect authenticated users away
 * Useful for login/register pages
 * Admins are redirected to /admin, users to /dashboard
 * Waits for auth state verification before deciding
 */
export const PublicOnlyRoute = ({ children }) => {
    const { isAuthenticated, isLoading, user } = useAuthStore();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        // Give time for auth state to initialize from Firebase (not just cache)
        const timer = setTimeout(() => {
            setIsChecking(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    // Show loading while checking auth state
    if (isLoading || isChecking) {
        return (
            <div className="min-h-screen bg-[#0A0C10] flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
            </div>
        );
    }

    if (isAuthenticated) {
        // Redirect based on role
        const redirectPath = user?.role === 'admin' ? '/admin' : '/dashboard';
        console.log(`🔄 PublicOnlyRoute: Redirecting authenticated user to ${redirectPath} (role: ${user?.role})`);
        return <Navigate to={redirectPath} replace />;
    }

    return children;
};

export default ProtectedRoute;
