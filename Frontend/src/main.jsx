import React, { Suspense, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import router from './routes'
import useAuthStore from './stores/authStore'
import ToastContainer from './components/ui/ToastContainer'
import './index.css'

// Loading fallback for lazy-loaded pages
const LoadingFallback = () => (
  <div className="min-h-screen bg-[#020408] flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
  </div>
)

// Auth Observer wrapper component
const AuthObserver = ({ children }) => {
  const initAuthObserver = useAuthStore(state => state.initAuthObserver);

  useEffect(() => {
    const unsubscribe = initAuthObserver();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [initAuthObserver]);

  return children;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Suspense fallback={<LoadingFallback />}>
      <AuthObserver>
        <RouterProvider router={router} />
        <ToastContainer />
      </AuthObserver>
    </Suspense>
  </React.StrictMode>,
)
