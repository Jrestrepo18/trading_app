import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

// Lazy load pages for code splitting
const LandingPage = React.lazy(() => import('../pages/LandingPage'));
const LoginPage = React.lazy(() => import('../pages/LoginPage'));
const RegisterPage = React.lazy(() => import('../pages/RegisterPage'));
const ForgotPasswordPage = React.lazy(() => import('../pages/ForgotPasswordPage'));
const VerifyEmailPage = React.lazy(() => import('../pages/VerifyEmailPage'));
const ResetPasswordPage = React.lazy(() => import('../pages/ResetPasswordPage'));
const VerifyEmailRequiredPage = React.lazy(() => import('../pages/VerifyEmailRequiredPage'));
const UnauthorizedPage = React.lazy(() => import('../pages/UnauthorizedPage'));
const DashboardPage = React.lazy(() => import('../pages/DashboardPage'));
const SignalsPage = React.lazy(() => import('../pages/SignalsPage'));
const TechnologyPage = React.lazy(() => import('../pages/TechnologyPage'));
const InstitutionalPage = React.lazy(() => import('../pages/InstitutionalPage'));

// Admin Pages
const AdminLayout = React.lazy(() => import('../layouts/AdminLayout'));
const DashboardOverview = React.lazy(() => import('../pages/admin/DashboardOverview'));
const UserManagement = React.lazy(() => import('../pages/admin/UserManagement'));
const SignalEngine = React.lazy(() => import('../pages/admin/SignalEngine'));
const SupportHub = React.lazy(() => import('../pages/admin/SupportHub'));
const NewsManager = React.lazy(() => import('../pages/admin/NewsManager'));
const PlanManager = React.lazy(() => import('../pages/admin/PlanManager'));
const SystemMetrics = React.lazy(() => import('../pages/admin/SystemMetrics'));

// Import guards
import ProtectedRoute, { AdminRoute, PublicOnlyRoute } from './ProtectedRoute';

/**
 * Application Routes
 * Security levels:
 * - Public: Anyone can access
 * - PublicOnly: Only non-authenticated users (login, register)
 * - Protected: Requires authentication
 * - Admin: Requires authentication + admin role
 */
export const router = createBrowserRouter([
    // ===========================================
    // PUBLIC PAGES (Anyone can access)
    // ===========================================
    {
        path: '/',
        element: <LandingPage />,
    },
    {
        path: '/technology',
        element: <TechnologyPage />,
    },
    {
        path: '/institutional',
        element: <InstitutionalPage />,
    },

    // ===========================================
    // AUTH PAGES (Public only - redirect if logged in)
    // ===========================================
    {
        path: '/login',
        element: (
            <PublicOnlyRoute>
                <LoginPage />
            </PublicOnlyRoute>
        ),
    },
    {
        path: '/register',
        element: (
            <PublicOnlyRoute>
                <RegisterPage />
            </PublicOnlyRoute>
        ),
    },
    {
        path: '/forgot-password',
        element: (
            <PublicOnlyRoute>
                <ForgotPasswordPage />
            </PublicOnlyRoute>
        ),
    },
    {
        path: '/verify-email',
        element: <VerifyEmailPage />,
    },
    {
        path: '/reset-password',
        element: <ResetPasswordPage />,
    },
    {
        path: '/verify-email-required',
        element: <VerifyEmailRequiredPage />,
    },
    {
        path: '/unauthorized',
        element: <UnauthorizedPage />,
    },

    // ===========================================
    // PROTECTED PAGES (Requires authentication)
    // ===========================================
    {
        path: '/dashboard',
        element: (
            <ProtectedRoute>
                <DashboardPage />
            </ProtectedRoute>
        ),
    },
    {
        path: '/signals',
        element: (
            <ProtectedRoute>
                <SignalsPage />
            </ProtectedRoute>
        ),
    },

    // ===========================================
    // ADMIN ROUTES (Requires admin role)
    // ===========================================
    {
        path: '/admin',
        element: (
            <AdminRoute>
                <AdminLayout />
            </AdminRoute>
        ),
        children: [
            {
                index: true,
                element: <DashboardOverview />,
            },
            {
                path: 'users',
                element: <UserManagement />,
            },
            {
                path: 'signals',
                element: <SignalEngine />,
            },
            {
                path: 'plans',
                element: <PlanManager />,
            },
            {
                path: 'support',
                element: <SupportHub />,
            },
            {
                path: 'banners',
                element: <NewsManager />,
            },
            {
                path: 'metrics',
                element: <SystemMetrics />,
            },
            {
                path: 'settings',
                element: <div className="p-10 text-center text-slate-500 uppercase font-black tracking-widest italic h-[80vh] flex flex-col items-center justify-center border border-white/5 rounded-[3rem] bg-white/5">Próximamente: Ajustes Avanzados de Infraestructura</div>,
            }
        ],
    },

    // ===========================================
    // FALLBACK (404)
    // ===========================================
    {
        path: '*',
        element: <Navigate to="/" replace />,
    },
]);

export default router;
