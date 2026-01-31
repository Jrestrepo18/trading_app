import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, Shield, CheckCircle2, Signal, Calendar, AlertCircle, Loader2 } from 'lucide-react';
import { registerWithEmail, loginWithGoogle, validatePassword, validateAge } from '../services/authService';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        birthDate: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        setError(''); // Clear error on input change
    };

    // Password strength calculation
    const passwordValidation = validatePassword(formData.password);
    const getStrengthColor = () => {
        if (passwordValidation.strength <= 2) return 'bg-rose-500';
        if (passwordValidation.strength <= 4) return 'bg-amber-500';
        return 'bg-emerald-500';
    };

    // Age validation
    const ageValidation = formData.birthDate ? validateAge(formData.birthDate) : { isValid: false, age: 0 };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Validations
        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            setIsLoading(false);
            return;
        }

        if (!passwordValidation.isValid) {
            setError('La contraseña no cumple con los requisitos de seguridad');
            setIsLoading(false);
            return;
        }

        if (!ageValidation.isValid) {
            setError('Debes ser mayor de 18 años para registrarte');
            setIsLoading(false);
            return;
        }

        if (!formData.acceptTerms) {
            setError('Debes aceptar los términos y condiciones');
            setIsLoading(false);
            return;
        }

        // Register with Firebase
        const result = await registerWithEmail(
            formData.name,
            formData.email,
            formData.password,
            formData.birthDate
        );

        setIsLoading(false);

        if (result.success) {
            setSuccess(true);
        } else {
            setError(result.error);
        }
    };

    const handleGoogleSignUp = async () => {
        setError('');
        setIsLoading(true);

        const result = await loginWithGoogle();

        setIsLoading(false);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.error);
        }
    };

    // Success state - show verification message
    if (success) {
        return (
            <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center py-12">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" />
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative z-10 w-full max-w-md px-6"
                >
                    <div className="bg-[#131722]/60 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-10 shadow-2xl text-center">
                        <div className="w-24 h-24 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                            <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse" />
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                            >
                                <Mail className="text-emerald-400 relative z-10" size={48} />
                            </motion.div>
                        </div>

                        <h2 className="text-3xl font-black text-white mb-3 tracking-tight">¡Verifica tu Email!</h2>
                        <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                            Hemos enviado un enlace de verificación a<br />
                            <span className="text-white font-bold">{formData.email}</span>
                        </p>

                        <div className="space-y-4">
                            <Link
                                to="/login"
                                className="block w-full py-5 bg-emerald-500 hover:bg-emerald-400 text-white font-black text-sm uppercase tracking-[0.2em] rounded-2xl transition-all"
                            >
                                Ir al Login
                            </Link>
                            <p className="text-slate-600 text-xs">
                                ¿No llegó el email? Revisa tu carpeta de spam
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center py-12">
            {/* Mesh Gradient Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />

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
                    className="text-center mb-8"
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

                {/* Register Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-[#131722]/60 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500/40 to-emerald-500/0" />

                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-black text-white mb-3 tracking-tight">Crear Cuenta</h1>
                        <p className="text-slate-400 text-sm font-medium">Inicia tu trayectoria con nosotros</p>
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

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name Field */}
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                                Nombre Completo
                            </label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/5 rounded-2xl text-white placeholder-slate-600 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none transition-all font-medium"
                                    placeholder="Tu nombre completo"
                                    required
                                />
                            </div>
                        </div>

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

                        {/* Birth Date Field */}
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                                Fecha de Nacimiento
                            </label>
                            <div className="relative group">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
                                <input
                                    type="date"
                                    name="birthDate"
                                    value={formData.birthDate}
                                    onChange={handleChange}
                                    max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                                    className={`w-full pl-12 pr-4 py-4 bg-white/5 border rounded-2xl text-white placeholder-slate-600 focus:ring-4 focus:outline-none transition-all font-medium ${formData.birthDate && !ageValidation.isValid
                                            ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/10'
                                            : 'border-white/5 focus:border-emerald-500/50 focus:ring-emerald-500/10'
                                        }`}
                                    required
                                />
                            </div>
                            {formData.birthDate && !ageValidation.isValid && (
                                <p className="text-rose-400 text-[10px] font-bold ml-1">
                                    Debes ser mayor de 18 años
                                </p>
                            )}
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

                        {/* Terms Checkbox */}
                        <label className="flex items-start gap-4 p-1 cursor-pointer group">
                            <div className="relative flex items-center justify-center mt-1">
                                <input
                                    type="checkbox"
                                    name="acceptTerms"
                                    checked={formData.acceptTerms}
                                    onChange={handleChange}
                                    className="peer appearance-none w-5 h-5 rounded border border-white/10 bg-white/5 checked:bg-emerald-500 checked:border-emerald-500 transition-all cursor-pointer"
                                    required
                                />
                                <div className="absolute opacity-0 peer-checked:opacity-100 text-white pointer-events-none">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                </div>
                            </div>
                            <span className="text-slate-500 text-xs leading-relaxed font-semibold group-hover:text-slate-300 transition-colors">
                                Acepto los <span className="text-emerald-400">Términos</span> y <span className="text-emerald-400">Políticas de Privacidad</span>
                            </span>
                        </label>

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
                                    Registrando...
                                </>
                            ) : (
                                <>
                                    Crear Cuenta
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </motion.button>

                        {/* Divider */}
                        <div className="flex items-center gap-4 py-2">
                            <div className="flex-1 h-px bg-white/5" />
                            <span className="text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">O regístrate con</span>
                            <div className="flex-1 h-px bg-white/5" />
                        </div>

                        {/* Google Button */}
                        <button
                            type="button"
                            onClick={handleGoogleSignUp}
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
                    <div className="mt-8 pt-8 border-t border-white/5 text-center">
                        <p className="text-slate-500 text-sm font-medium">
                            ¿Ya tienes cuenta?{' '}
                            <Link to="/login" className="text-white hover:text-emerald-400 font-black transition-colors">
                                Iniciar sesión
                            </Link>
                        </p>
                    </div>
                </motion.div>

                {/* Security Badge */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center justify-center gap-2 mt-8 text-slate-600"
                >
                    <Shield size={14} className="text-emerald-500/50" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Cifrado de Grado Bancario</span>
                </motion.div>
            </div>
        </div>
    );
};

export default RegisterPage;
