import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ShieldX, ArrowLeft, Lock } from 'lucide-react';

const UnauthorizedPage = () => {
    const location = useLocation();
    const requiredRoles = location.state?.requiredRoles || [];

    return (
        <div className="min-h-screen bg-[#0A0C10] flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                <div className="bg-[#131722] rounded-2xl p-8 border border-white/5 text-center">
                    <div className="w-16 h-16 bg-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShieldX className="w-8 h-8 text-rose-400" />
                    </div>

                    <h1 className="text-2xl font-bold text-white mb-3">
                        Acceso Denegado
                    </h1>

                    <p className="text-slate-400 mb-6">
                        No tienes permisos suficientes para acceder a esta sección.
                        {requiredRoles.length > 0 && (
                            <span className="block mt-2 text-sm">
                                Se requiere rol: <span className="text-amber-400 font-medium">{requiredRoles.join(', ')}</span>
                            </span>
                        )}
                    </p>

                    <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/5">
                        <div className="flex items-center gap-3">
                            <Lock className="text-slate-500" size={20} />
                            <p className="text-slate-400 text-sm text-left">
                                Esta área está restringida. Si crees que deberías tener acceso, contacta al administrador.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <Link
                            to="/dashboard"
                            className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3 rounded-xl transition-colors"
                        >
                            Ir al Dashboard
                        </Link>

                        <Link
                            to="/"
                            className="text-slate-400 hover:text-white text-sm flex items-center justify-center gap-2 transition-colors"
                        >
                            <ArrowLeft size={16} />
                            Volver al inicio
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UnauthorizedPage;
