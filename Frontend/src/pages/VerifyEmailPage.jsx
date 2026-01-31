import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Signal, Loader2, Mail } from 'lucide-react';
import { verifyEmail } from '../services/authService';

const VerifyEmailPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'error'
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const verifyEmailCode = async () => {
            // Get the oobCode from URL (Firebase email action link)
            const oobCode = searchParams.get('oobCode');
            const mode = searchParams.get('mode');

            if (!oobCode) {
                setStatus('error');
                setErrorMessage('Enlace de verificación inválido o expirado.');
                return;
            }

            // If mode is resetPassword, redirect to reset password page
            if (mode === 'resetPassword') {
                navigate(`/reset-password?oobCode=${oobCode}`);
                return;
            }

            // Verify email
            const result = await verifyEmail(oobCode);

            if (result.success) {
                setStatus('success');
                // Redirect to dashboard after 3 seconds
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } else {
                setStatus('error');
                setErrorMessage(result.error || 'Error al verificar el email.');
            }
        };

        verifyEmailCode();
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
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
                    className="bg-[#131722]/60 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-10 shadow-2xl text-center"
                >
                    {status === 'verifying' && (
                        <>
                            <div className="w-24 h-24 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
                                <Loader2 className="text-emerald-400 animate-spin" size={48} />
                            </div>
                            <h2 className="text-2xl font-black text-white mb-3">Verificando Email...</h2>
                            <p className="text-slate-400 text-sm">Por favor espera mientras verificamos tu cuenta.</p>
                        </>
                    )}

                    {status === 'success' && (
                        <>
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
                            <h2 className="text-3xl font-black text-white mb-3">¡Email Verificado!</h2>
                            <p className="text-slate-400 text-sm mb-8">Tu cuenta ha sido activada exitosamente.</p>
                            <p className="text-slate-600 text-xs mb-6">Redirigiendo al login...</p>
                            <Link
                                to="/login"
                                className="block w-full py-5 bg-emerald-500 hover:bg-emerald-400 text-white font-black text-sm uppercase tracking-[0.2em] rounded-2xl transition-all"
                            >
                                Ir al Login
                            </Link>
                        </>
                    )}

                    {status === 'error' && (
                        <>
                            <div className="w-24 h-24 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
                                <XCircle className="text-rose-400" size={48} />
                            </div>
                            <h2 className="text-2xl font-black text-white mb-3">Error de Verificación</h2>
                            <p className="text-slate-400 text-sm mb-8">{errorMessage}</p>
                            <div className="space-y-4">
                                <Link
                                    to="/login"
                                    className="block w-full py-5 bg-emerald-500 hover:bg-emerald-400 text-white font-black text-sm uppercase tracking-[0.2em] rounded-2xl transition-all"
                                >
                                    Ir al Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="block w-full py-4 bg-white/5 hover:bg-white/10 border border-white/5 text-slate-400 hover:text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl transition-all"
                                >
                                    Crear nueva cuenta
                                </Link>
                            </div>
                        </>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default VerifyEmailPage;
