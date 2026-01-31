import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirmar", cancelText = "Cancelar", isDestructive = false }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full max-w-sm bg-[#181A20] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
                >
                    <div className="p-6 text-center space-y-4">
                        <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center border-2 ${isDestructive ? 'bg-red-500/10 border-red-500 text-red-500' : 'bg-[#fcd535]/10 border-[#fcd535] text-[#fcd535]'}`}>
                            <AlertTriangle size={24} />
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-[#eaecef]">{title}</h3>
                            <p className="text-sm text-slate-500 mt-2 leading-relaxed">{message}</p>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={onClose}
                                className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
                            >
                                {cancelText}
                            </button>
                            <button
                                onClick={() => { onConfirm(); onClose(); }}
                                className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg ${isDestructive
                                        ? 'bg-red-500 hover:bg-red-600 text-white'
                                        : 'bg-[#3b82f6] hover:bg-[#2563eb] text-white'
                                    }`}
                            >
                                {confirmText}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ConfirmModal;
