import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, CheckCircle2, XCircle, Signal, Loader2, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react';
import { confirmPasswordResetWithCode, validatePassword } from '../services/authService';

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [oobCode, setOobCode] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState('form'); // 'form' | 'success' | 'error'
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });

    useEffect(() => {
        const code = searchParams.get('oobCode');
        if (!code) {
            setStatus('error');
            setError('Enlace de recuperación inválido o expirado.');
        } else {
            setOobCode(code);
        }
    }, [searchParams]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const passwordValidation = validatePassword(formData.password);
    const getStrengthColor = () => {
        if (passwordValidation.strength <= 2) return 'bg-rose-500';
        if (passwordValidation.strength <= 4) return 'bg-amber-500';
        return 'bg-emerald-500';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validations
        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        if (!passwordValidation.isValid) {
            setError('La contraseña no cumple con los requisitos de seguridad');
            return;
        }

        setIsLoading(true);

        const result = await confirmPasswordResetWithCode(oobCode, formData.password);

        setIsLoading(false);

        if (result.success) {
            setStatus('success');
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } else {
            setError(result.error);
        }
    };

    return (
        <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center py-12">
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" />
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                    }}
                />
            </div>

            <div className="relative z-10 w-full max-w-md px-6">
                {/* Brand Logo */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <Link to="/" className="inline-flex flex-col items-center gap-2 group">
                        <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                            <Signal className="text-white" size={32} strokeWidth={2.5} />
                        </div>
                        <div className="mt-4">
                            <span className="text-2xl font-black tracking-tighter text-white uppercase italic">
                                Valor<span className="text-emerald-500 not-italic">Trading</span>
                            </span>
                        </div>
                    </Link>
                </motion.div>

                {/* Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#131722]/60 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500/40 to-emerald-500/0" />

                    <AnimatePresence mode="wait">
                        {status === 'form' && (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                {/* Header */}
                                <div className="text-center mb-8">
                                    <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                        <Lock className="text-emerald-400" size={36} />
                                    </div>
                                    <h1 className="text-2xl font-black text-white mb-3">Nueva Contraseña</h1>
                                    <p className="text-slate-500 text-sm">Crea una nueva contraseña segura para tu cuenta.</p>
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

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {/* Password Field */}
                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                                            Nueva Contraseña
                                        </label>
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/5 rounded-2xl text-white placeholder-slate-600 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none transition-all font-medium"
                                                placeholder="Mínimo 8 caracteres"
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

                                        {/* Password Requirements */}
                                        {formData.password && (
                                            <div className="mt-3 space-y-2 px-1">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Seguridad</span>
                                                    <span className={`text-[10px] font-black uppercase tracking-widest ${passwordValidation.strength <= 2 ? 'text-rose-400' :
                                                            passwordValidation.strength <= 4 ? 'text-amber-400' : 'text-emerald-400'
                                                        }`}>
                                                        {passwordValidation.strengthLabel}
                                                    </span>
                                                </div>
                                                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${(passwordValidation.strength / 5) * 100}%` }}
                                                        className={`h-full ${getStrengthColor()} transition-all duration-300`}
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-1 mt-2">
                                                    {[
                                                        { key: 'minLength', label: '8+ caracteres' },
                                                        { key: 'hasUppercase', label: 'Mayúscula' },
                                                        { key: 'hasLowercase', label: 'Minúscula' },
                                                        { key: 'hasNumber', label: 'Número' },
                                                        { key: 'hasSpecial', label: 'Símbolo (@#$%)' },
                                                    ].map(req => (
                                                        <div key={req.key} className={`text-[9px] font-bold flex items-center gap-1 ${passwordValidation.requirements[req.key] ? 'text-emerald-400' : 'text-slate-600'
                                                            }`}>
                                                            <CheckCircle2 size={10} />
                                                            {req.label}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Confirm Password Field */}
                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                                            Confirmar Contraseña
                                        </label>
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                className={`w-full pl-12 pr-12 py-4 bg-white/5 border rounded-2xl text-white placeholder-slate-600 focus:ring-4 focus:outline-none transition-all font-medium ${formData.confirmPassword && formData.password !== formData.confirmPassword
                                                        ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/10'
                                                        : 'border-white/5 focus:border-emerald-500/50 focus:ring-emerald-500/10'
                                                    }`}
                                                placeholder="Repite tu contraseña"
                                                required
                                            />
                                            {formData.confirmPassword && formData.password === formData.confirmPassword && (
                                                <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400" size={18} />
                                            )}
                                        </div>
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
                                                Actualizando...
                                            </>
                                        ) : (
                                            <>
                                                Guardar Contraseña
                                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </motion.button>
                                </form>
                            </motion.div>
                        )}

                        {status === 'success' && (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-6"
                            >
                                <div className="w-24 h-24 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                                    <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse" />
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: 'spring', stiffness: 200 }}
                                    >
                                        <CheckCircle2 className="text-emerald-400 relative z-10" size={48} />
                                    </motion.div>
                                </div>
                                <h2 className="text-3xl font-black text-white mb-3">¡Contraseña Actualizada!</h2>
                                <p className="text-slate-400 text-sm mb-8">Tu contraseña ha sido cambiada exitosamente.</p>
                                <p className="text-slate-600 text-xs mb-6">Redirigiendo al login...</p>
                                <Link
                                    to="/login"
                                    className="block w-full py-5 bg-emerald-500 hover:bg-emerald-400 text-white font-black text-sm uppercase tracking-[0.2em] rounded-2xl transition-all"
                                >
                                    Ir al Login
                                </Link>
                            </motion.div>
                        )}

                        {status === 'error' && (
                            <motion.div
                                key="error"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-6"
                            >
                                <div className="w-24 h-24 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
                                    <XCircle className="text-rose-400" size={48} />
                                </div>
                                <h2 className="text-2xl font-black text-white mb-3">Enlace Inválido</h2>
                                <p className="text-slate-400 text-sm mb-8">{error}</p>
                                <Link
                                    to="/forgot-password"
                                    className="block w-full py-5 bg-emerald-500 hover:bg-emerald-400 text-white font-black text-sm uppercase tracking-[0.2em] rounded-2xl transition-all"
                                >
                                    Solicitar Nuevo Enlace
                                </Link>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
