import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';
import useToastStore from '../../stores/toastStore';

const ToastContainer = () => {
    const { toasts, removeToast } = useToastStore();

    return (
        <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <motion.div
                        key={toast.id}
                        initial={{ opacity: 0, x: 50, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="pointer-events-auto min-w-[300px] max-w-md bg-[#181A20] border border-white/10 shadow-2xl rounded-xl p-4 flex items-start gap-3 backdrop-blur-xl"
                    >
                        <div className={`mt-0.5 ${toast.type === 'success' ? 'text-[#0ecb81]' :
                                toast.type === 'error' ? 'text-red-500' :
                                    toast.type === 'warning' ? 'text-[#fcd535]' :
                                        'text-[#3b82f6]'
                            }`}>
                            {toast.type === 'success' && <CheckCircle2 size={18} />}
                            {toast.type === 'error' && <XCircle size={18} />}
                            {toast.type === 'warning' && <AlertCircle size={18} />}
                            {toast.type === 'info' && <Info size={18} />}
                        </div>

                        <div className="flex-1 pt-0.5">
                            <p className="text-sm font-bold text-[#eaecef] leading-snug">{toast.message}</p>
                        </div>

                        <button
                            onClick={() => removeToast(toast.id)}
                            className="text-slate-500 hover:text-white transition-colors"
                        >
                            <X size={14} />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default ToastContainer;
