import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle, Signal, Loader2 } from 'lucide-react';
import { sendPasswordReset } from '../services/authService';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const result = await sendPasswordReset(email);

        setIsLoading(false);

        if (result.success) {
            setSubmitted(true);
        } else {
            setError(result.error);
        }
    };

    return (
        <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
            {/* Mesh Gradient Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />

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

                {/* Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-[#131722]/60 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500/40 to-emerald-500/0" />

                    <AnimatePresence mode="wait">
                        {!submitted ? (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                            >
                                {/* Header */}
                                <div className="text-center mb-10">
                                    <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                        <Mail className="text-emerald-400" size={36} />
                                    </div>
                                    <h1 className="text-2xl font-black text-white mb-3 tracking-tight">Recuperar Acceso</h1>
                                    <p className="text-slate-500 text-sm font-medium leading-relaxed">
                                        Ingresa tu email para recibir un enlace de recuperación de contraseña.
                                    </p>
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
                                            <AlertCircle size={16} />
                                            {error}
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
                                                value={email}
                                                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                                                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/5 rounded-2xl text-white placeholder-slate-600 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none transition-all font-medium"
                                                placeholder="tu@email.com"
                                                required
                                            />
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
                                                Enviando...
                                            </>
                                        ) : (
                                            <>
                                                Enviar Enlace
                                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </motion.button>
                                </form>

                                {/* Back to Login */}
                                <div className="mt-10 pt-10 border-t border-white/5 text-center">
                                    <Link
                                        to="/login"
                                        className="inline-flex items-center gap-2 text-slate-500 hover:text-white text-xs font-black uppercase tracking-widest transition-colors group"
                                    >
                                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                                        Volver al Login
                                    </Link>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-center py-6"
                            >
                                {/* Success Icon */}
                                <div className="w-24 h-24 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                                    <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse" />
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                                        className="relative z-10"
                                    >
                                        <CheckCircle2 className="text-emerald-400" size={48} />
                                    </motion.div>
                                </div>

                                <h2 className="text-3xl font-black text-white mb-3 tracking-tight">¡Email Enviado!</h2>
                                <p className="text-slate-400 text-sm mb-10 leading-relaxed font-medium">
                                    Hemos enviado un enlace de recuperación a <br />
                                    <span className="text-white font-bold">{email}</span>
                                </p>

                                <div className="space-y-4">
                                    <Link
                                        to="/login"
                                        className="block w-full py-5 bg-emerald-500 hover:bg-emerald-400 text-white font-black text-sm uppercase tracking-[0.2em] rounded-2xl transition-all shadow-[0_10px_30px_rgba(16,185,129,0.3)]"
                                    >
                                        Ir al Login
                                    </Link>
                                    <button
                                        onClick={() => setSubmitted(false)}
                                        className="block w-full py-5 bg-white/5 hover:bg-white/10 border border-white/5 text-slate-400 hover:text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl transition-all"
                                    >
                                        Intentar otro email
                                    </button>
                                </div>

                                <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] mt-10">
                                    ¿No llegó? Revisa spam o{' '}
                                    <button
                                        onClick={() => setSubmitted(false)}
                                        className="text-emerald-500 hover:text-emerald-400"
                                    >
                                        reenviar
                                    </button>
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
