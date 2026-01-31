import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, Eye, EyeOff, Shield, Zap, Signal, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { loginWithEmail, loginWithGoogle, resendVerificationEmail } from '../services/authService';
import useAuthStore from '../stores/authStore';

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuthStore();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [needsVerification, setNeedsVerification] = useState(false);
    const [verificationEmail, setVerificationEmail] = useState('');
    const [resendSuccess, setResendSuccess] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        setNeedsVerification(false);

        const result = await loginWithEmail(formData.email, formData.password);

        setIsLoading(false);

        if (result.success) {
            login(result.user, result.token);
            // Redirect based on user role
            const redirectPath = result.user?.role === 'admin' ? '/admin' : '/dashboard';
            console.log(`🔄 Login success - Role: ${result.user?.role}, Redirecting to: ${redirectPath}`);
            navigate(redirectPath);
        } else if (result.needsVerification) {
            setNeedsVerification(true);
            setVerificationEmail(result.user.email);
        } else {
            setError(result.error);
        }
    };

    const handleGoogleLogin = async () => {
        setError('');
        setIsLoading(true);

        const result = await loginWithGoogle();

        setIsLoading(false);

        if (result.success) {
            login(result.user, result.token);
            // Redirect based on user role
            const redirectPath = result.user?.role === 'admin' ? '/admin' : '/dashboard';
            console.log(`🔄 Google login success - Role: ${result.user?.role}, Redirecting to: ${redirectPath}`);
            navigate(redirectPath);
        } else {
            setError(result.error);
        }
    };

    const handleResendVerification = async () => {
        setResendSuccess(false);
        const result = await resendVerificationEmail();
        if (result.success) {
            setResendSuccess(true);
        } else {
            setError(result.error);
        }
    };

    return (
        <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
            {/* Mesh Gradient Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />

                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                    }}
                />
            </div>

            <div className="relative z-10 w-full max-w-md px-6 py-12">
                {/* Brand Logo */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <Link to="/" className="inline-flex flex-col items-center gap-2 group">
                        <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)] group-hover:scale-105 transition-transform duration-500">
                            <Signal className="text-white" size={32} strokeWidth={2.5} />
                        </div>
                        <div className="mt-4">
                            <span className="text-2xl font-black tracking-tighter text-white uppercase italic">
                                Valor<span className="text-emerald-500 not-italic">Trading</span>
                            </span>
                        </div>
                    </Link>
                </motion.div>

                {/* Login Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-[#131722]/60 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500/40 to-emerald-500/0" />

                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-black text-white mb-3 tracking-tight">Acceso</h1>
                        <p className="text-slate-400 text-sm font-medium">Ingresa a tu ecosistema de señales profesional</p>
                    </div>

                    {/* Error Message */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-xs font-bold mb-6"
                            >
                                <AlertCircle size={18} />
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Needs Verification Message */}
                    <AnimatePresence>
                        {needsVerification && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl mb-6"
                            >
                                <div className="flex items-center gap-3 text-amber-400 text-xs font-bold mb-3">
                                    <Mail size={18} />
                                    Verifica tu email para continuar
                                </div>
                                <p className="text-slate-400 text-[11px] mb-3">
                                    Enviamos un enlace de verificación a <span className="text-white font-bold">{verificationEmail}</span>
                                </p>
                                <button
                                    onClick={handleResendVerification}
                                    className="text-emerald-400 text-[10px] font-black uppercase tracking-widest hover:text-emerald-300 transition-colors"
                                >
                                    Reenviar email de verificación
                                </button>
                                {resendSuccess && (
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-emerald-400 text-[10px] mt-2 flex items-center gap-1"
                                    >
                                        <CheckCircle2 size={12} /> Email reenviado
                                    </motion.p>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field */}
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                                Email
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/5 rounded-2xl text-white placeholder-slate-600 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none transition-all font-medium"
                                    placeholder="tu@email.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                                Contraseña
                            </label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/5 rounded-2xl text-white placeholder-slate-600 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none transition-all font-medium"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between px-1">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <div className="relative flex items-center justify-center">
                                    <input
                                        type="checkbox"
                                        name="rememberMe"
                                        checked={formData.rememberMe}
                                        onChange={handleChange}
                                        className="peer appearance-none w-4 h-4 rounded border border-white/10 bg-white/5 checked:bg-emerald-500 checked:border-emerald-500 transition-all cursor-pointer"
                                    />
                                    <div className="absolute opacity-0 peer-checked:opacity-100 text-white pointer-events-none">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="w-2.5 h-2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                    </div>
                                </div>
                                <span className="text-xs text-slate-500 group-hover:text-slate-300 transition-colors font-semibold">Recordar sesión</span>
                            </label>
                            <Link to="/forgot-password" className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors font-black uppercase tracking-wider">
                                ¿Olvidaste tu clave?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={isLoading}
                            whileHover={{ scale: isLoading ? 1 : 1.02 }}
                            whileTap={{ scale: isLoading ? 1 : 0.98 }}
                            className="w-full py-5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/50 text-white font-black text-sm uppercase tracking-[0.2em] rounded-2xl transition-all shadow-[0_10px_30px_rgba(16,185,129,0.3)] flex items-center justify-center gap-3 group"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Iniciando...
                                </>
                            ) : (
                                <>
                                    Acceder al Panel
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </motion.button>

                        {/* Divider */}
                        <div className="flex items-center gap-4 py-2">
                            <div className="flex-1 h-px bg-white/5" />
                            <span className="text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">O accede con</span>
                            <div className="flex-1 h-px bg-white/5" />
                        </div>

                        {/* Google Login */}
                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            disabled={isLoading}
                            className="w-full py-4 bg-white/5 hover:bg-white/10 disabled:opacity-50 border border-white/5 rounded-2xl text-slate-400 hover:text-white transition-all flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest group"
                        >
                            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Google
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-10 pt-10 border-t border-white/5 text-center">
                        <p className="text-slate-500 text-sm font-medium">
                            ¿Aún no tienes cuenta?{' '}
                            <Link to="/register" className="text-white hover:text-emerald-400 font-black transition-colors">
                                Regístrate gratis
                            </Link>
                        </p>
                    </div>
                </motion.div>

                {/* Security Badges */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center justify-center gap-8 mt-10"
                >
                    <div className="flex items-center gap-2 text-slate-600">
                        <Shield size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Secure SSL</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                        <Zap size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Low Latency</span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default LoginPage;
