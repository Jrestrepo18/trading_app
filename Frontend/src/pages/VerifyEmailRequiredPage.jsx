import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Mail, RefreshCw, ArrowLeft, CheckCircle } from 'lucide-react';
import { resendVerificationEmail } from '../services/authService';

const VerifyEmailRequiredPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email || 'tu correo';
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');

    const handleResend = async () => {
        setSending(true);
        setError('');

        try {
            const result = await resendVerificationEmail();
            if (result.success) {
                setSent(true);
            } else {
                setError(result.error || 'Error al enviar el email');
            }
        } catch (err) {
            setError('Error al enviar el email');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0C10] flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                <div className="bg-[#131722] rounded-2xl p-8 border border-white/5 text-center">
                    <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Mail className="w-8 h-8 text-amber-400" />
                    </div>

                    <h1 className="text-2xl font-bold text-white mb-3">
                        Verificación Requerida
                    </h1>

                    <p className="text-slate-400 mb-6">
                        Para acceder a esta sección, debes verificar tu correo electrónico.
                        Hemos enviado un enlace de verificación a <span className="text-white font-medium">{email}</span>
                    </p>

                    {sent ? (
                        <div className="flex items-center justify-center gap-2 text-emerald-400 mb-6">
                            <CheckCircle size={20} />
                            <span>Email reenviado correctamente</span>
                        </div>
                    ) : (
                        <button
                            onClick={handleResend}
                            disabled={sending}
                            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/50 text-black font-bold py-3 rounded-xl transition-colors mb-4 flex items-center justify-center gap-2"
                        >
                            {sending ? (
                                <>
                                    <RefreshCw size={18} className="animate-spin" />
                                    Enviando...
                                </>
                            ) : (
                                <>
                                    <RefreshCw size={18} />
                                    Reenviar Email
                                </>
                            )}
                        </button>
                    )}

                    {error && (
                        <p className="text-rose-400 text-sm mb-4">{error}</p>
                    )}

                    <Link
                        to="/login"
                        className="text-slate-400 hover:text-white text-sm flex items-center justify-center gap-2 transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Volver al inicio de sesión
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmailRequiredPage;
