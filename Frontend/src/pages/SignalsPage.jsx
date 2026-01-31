import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import {
    Signal, Radio, Clock, Target, Shield, Info,
    ArrowUpRight, Eye, Zap, Activity, ExternalLink,
    X, ImageIcon, BarChart3, TrendingUp, TrendingDown, ChevronRight, ZapOff
} from 'lucide-react';

const SignalsPage = () => {
    const [signals, setSignals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAnalysis, setSelectedAnalysis] = useState(null);
    const [prevSignalsCount, setPrevSignalsCount] = useState(0);

    // Audio Ref for persistent instance and unlocking
    const audioRef = React.useRef(new Audio('/sounds/cash_register.mp3'));
    const isFirstRun = React.useRef(true);

    // Audio Unlocker: Browsers block autoplay until user interacts. 
    useEffect(() => {
        const unlockAudio = () => {
            const audio = audioRef.current;
            if (audio) {
                audio.volume = 0; // Mute for unlock
                audio.play().then(() => {
                    audio.pause();
                    audio.currentTime = 0;
                    audio.volume = 0.5; // Restore volume
                    document.removeEventListener('click', unlockAudio);
                    document.removeEventListener('keydown', unlockAudio);
                }).catch(e => { /* Ignore unlock errors */ });
            }
        };

        document.addEventListener('click', unlockAudio);
        document.addEventListener('keydown', unlockAudio);

        return () => {
            document.removeEventListener('click', unlockAudio);
            document.removeEventListener('keydown', unlockAudio);
        };
    }, []);

    const playSignalSound = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (audio.volume < 0.1) audio.volume = 0.5;
        audio.currentTime = 0;

        audio.play().catch(e => {
            if (e.name === 'NotAllowedError') {
                console.warn('Audio blocked. Click anywhere to enable.');
            } else {
                console.error('Audio playback error:', e);
            }
        });
    };

    useEffect(() => {
        setLoading(true);

        const q = collection(db, "signals");

        const unsubscribe = onSnapshot(q, (snapshot) => {
            if (isFirstRun.current) {
                isFirstRun.current = false;
                const data = snapshot.docs
                    .map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                        createdAt: doc.data().createdAt?.toDate?.() || new Date()
                    }))
                    .filter(s => ['Active', 'BE', 'TP1', 'TP2', 'TP3'].includes(s.status))
                    .sort((a, b) => b.createdAt - a.createdAt);
                setSignals(data);
                setLoading(false);
                return;
            }

            // Check for changes to trigger sound
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    // Play sound for new active signals
                    const data = change.doc.data();
                    if (['Active', 'Activo'].includes(data.status)) {
                        console.log('🔔 New Signal Sound Triggered');
                        playSignalSound();
                    }
                }
                if (change.type === "modified") {
                    const data = change.doc.data();
                    // Play sound for meaningful status updates
                    if (['BE', 'TP1', 'TP2', 'TP3'].includes(data.status)) {
                        console.log('🔔 Status Update Sound Triggered:', data.status);
                        playSignalSound();
                    }
                }
            });

            const data = snapshot.docs
                .map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    createdAt: doc.data().createdAt?.toDate?.() || new Date()
                }))
                .filter(s => ['Active', 'BE', 'TP1', 'TP2', 'TP3'].includes(s.status))
                .sort((a, b) => b.createdAt - a.createdAt);

            setSignals(data);
            setLoading(false);
        }, (error) => {
            console.error('Firestore Error:', error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <Layout showNavbar={false}>
            <div className="min-h-screen bg-[#0B0E11] pt-12 px-6 pb-20">
                <div className="max-w-7xl mx-auto">
                    {/* Header Institucional */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-6 bg-[#3b82f6] rounded-full" />
                                <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase">SENZ_INTELLIGENCE_<span className="text-[#3b82f6]">NODE</span></h1>
                            </div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em] italic flex items-center gap-2">
                                <Radio size={12} className="text-[#3b82f6] animate-pulse" /> LIVE_SIGNAL_TRANSMISSION_V4.2
                            </p>
                        </div>

                        <div className="bg-[#181A20] border border-white/5 rounded-2xl p-4 flex items-center gap-8">
                            <div className="text-center">
                                <span className="block text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">NODE_STATUS</span>
                                <span className="text-[10px] font-black text-[#0ecb81] uppercase flex items-center gap-1.5 justify-center">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#0ecb81] shadow-[0_0_8px_rgba(14,203,129,0.5)]" /> SYNC_OK
                                </span>
                            </div>
                            <div className="w-px h-8 bg-white/5" />
                            <div className="text-center">
                                <span className="block text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">SIGNALS_LOADED</span>
                                <span className="text-[10px] font-mono font-black text-white">{signals.length}</span>
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="h-64 bg-white/[0.02] animate-pulse rounded-3xl border border-white/5" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {signals.length > 0 ? (
                                signals.map((sig, idx) => (
                                    <motion.div
                                        key={sig.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="bg-[#181A20] border border-white/[0.03] rounded-3xl p-6 relative overflow-hidden group hover:border-[#3b82f6]/40 transition-all shadow-2xl"
                                    >
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-3">
                                                    <h3 className="text-2xl font-black italic tracking-tighter text-white uppercase">{sig.pair}</h3>
                                                    <span className={`px-2 py-0.5 rounded text-[8px] font-black tracking-widest uppercase border ${sig.type.includes('BUY') ? 'bg-[#0ecb81]/10 text-[#0ecb81] border-[#0ecb81]/20' : 'bg-[#f6465d]/10 text-[#f6465d] border-[#f6465d]/20'}`}>
                                                        {sig.type}
                                                    </span>
                                                </div>
                                                <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest block">{sig.orderType}</span>
                                            </div>
                                            <div className="text-right">
                                                {['Active', 'Activo'].includes(sig.status) ? (
                                                    <div className="bg-[#0ecb81]/10 px-3 py-1.5 rounded-lg border border-[#0ecb81]/20 animate-pulse">
                                                        <span className="block text-[7px] font-black text-[#0ecb81] uppercase tracking-widest mb-0.5">ESTADO_ACTUAL</span>
                                                        <span className="text-[10px] font-black text-white uppercase italic flex items-center gap-1.5 justify-end">
                                                            <Activity size={10} className="text-[#0ecb81]" /> ACTIVO
                                                        </span>
                                                    </div>
                                                ) : sig.status === 'BE' ? (
                                                    <div className="bg-[#fcd535]/10 px-3 py-1.5 rounded-lg border border-[#fcd535]/20 animate-pulse">
                                                        <span className="block text-[7px] font-black text-[#fcd535] uppercase tracking-widest mb-0.5">RIESGO_CERO</span>
                                                        <span className="text-[10px] font-black text-white uppercase italic flex items-center gap-1.5 justify-end">
                                                            <Shield size={10} className="text-[#fcd535]" /> BREAKEVEN
                                                        </span>
                                                    </div>
                                                ) : ['TP1', 'TP2', 'TP3'].includes(sig.status) ? (
                                                    <div className="bg-[#0ecb81]/10 px-3 py-1.5 rounded-lg border border-[#0ecb81]/20 animate-pulse">
                                                        <span className="block text-[7px] font-black text-[#0ecb81] uppercase tracking-widest mb-0.5">PROFIT_SECURED</span>
                                                        <span className="text-[10px] font-black text-white uppercase italic flex items-center gap-1.5 justify-end">
                                                            <Target size={10} className="text-[#0ecb81]" /> {sig.status === 'TP1' ? 'TAKE PROFIT 1' : sig.status === 'TP2' ? 'TAKE PROFIT 2' : 'MAX PROFIT'}
                                                        </span>
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 mb-6">
                                            <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                                                <span className="text-[7px] font-black text-slate-600 uppercase block mb-1">ENTRY_POINT</span>
                                                <p className="font-mono font-bold text-white text-xs">{sig.entry}</p>
                                            </div>
                                            <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                                                <span className="text-[7px] font-black text-[#f6465d]/60 uppercase block mb-1">STOP_LOSS</span>
                                                <p className="font-mono font-bold text-[#f6465d] text-xs">{sig.sl}</p>
                                            </div>
                                        </div>

                                        {/* Multi-TP Display */}
                                        <div className="mb-6 bg-black/40 p-3 rounded-xl border border-[#0ecb81]/10 flex flex-col justify-center">
                                            <span className="text-[7px] font-black text-[#0ecb81]/60 uppercase block mb-2 text-center tracking-widest">OBJETIVOS (TAKE PROFIT)</span>
                                            <div className="flex justify-around items-center">
                                                <div className="text-center group-hover:scale-110 transition-transform">
                                                    <span className="text-[7px] text-slate-500 font-bold block mb-0.5">TP 1</span>
                                                    <p className="font-mono font-bold text-[#0ecb81] text-sm">{sig.tp1}</p>
                                                </div>

                                                {sig.tp2 && (
                                                    <>
                                                        <div className="w-px h-6 bg-white/5" />
                                                        <div className="text-center group-hover:scale-110 transition-transform delay-75">
                                                            <span className="text-[7px] text-slate-500 font-bold block mb-0.5">TP 2</span>
                                                            <p className="font-mono font-bold text-[#0ecb81]/90 text-sm">{sig.tp2}</p>
                                                        </div>
                                                    </>
                                                )}

                                                {sig.tp3 && (
                                                    <>
                                                        <div className="w-px h-6 bg-white/5" />
                                                        <div className="text-center group-hover:scale-110 transition-transform delay-100">
                                                            <span className="text-[7px] text-slate-500 font-bold block mb-0.5">TP 3</span>
                                                            <p className="font-mono font-bold text-[#0ecb81]/80 text-sm">{sig.tp3}</p>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* ALERTAS DE ESTADO O ANÁLISIS */}
                                        {/* ALERTAS DE ESTADO O ANÁLISIS */}

                                        {/* Breakeven Alert - Show if status is specifically BE */}
                                        {sig.status === 'BE' && (
                                            <div className="mb-6 p-4 rounded-2xl bg-[#fcd535]/10 border border-[#fcd535]/20 flex items-center gap-4 animate-pulse">
                                                <div className="w-10 h-10 rounded-full bg-[#fcd535]/20 flex items-center justify-center border border-[#fcd535]/30">
                                                    <Shield size={20} className="text-[#fcd535]" strokeWidth={2.5} />
                                                </div>
                                                <div>
                                                    <span className="block text-[8px] font-black text-[#fcd535] uppercase tracking-widest mb-0.5">ACTUALIZACIÓN DE RIESGO</span>
                                                    <h4 className="text-base font-black text-white italic uppercase tracking-tight">BREAKEVEN ALCANZADO</h4>
                                                </div>
                                            </div>
                                        )}

                                        {/* TP1 Alert - Show for TP1, TP2, TP3 */}
                                        {['TP1', 'TP2', 'TP3'].includes(sig.status) && (
                                            <div className="mb-6 p-4 rounded-2xl bg-[#0ecb81]/10 border border-[#0ecb81]/20 flex items-center gap-4 animate-pulse">
                                                <div className="w-10 h-10 rounded-full bg-[#0ecb81]/20 flex items-center justify-center border border-[#0ecb81]/30">
                                                    <Target size={20} className="text-[#0ecb81]" strokeWidth={2.5} />
                                                </div>
                                                <div>
                                                    <span className="block text-[8px] font-black text-[#0ecb81] uppercase tracking-widest mb-0.5">OBJETIVO COMPLETADO</span>
                                                    <h4 className="text-base font-black text-white italic uppercase tracking-tight">TAKE PROFIT 1</h4>
                                                </div>
                                            </div>
                                        )}

                                        {/* TP2 Alert - Show for TP2, TP3 */}
                                        {['TP2', 'TP3'].includes(sig.status) && (
                                            <div className="mb-6 p-4 rounded-2xl bg-[#0ecb81]/10 border border-[#0ecb81]/20 flex items-center gap-4 animate-pulse">
                                                <div className="w-10 h-10 rounded-full bg-[#0ecb81]/20 flex items-center justify-center border border-[#0ecb81]/30">
                                                    <Target size={20} className="text-[#0ecb81]" strokeWidth={2.5} />
                                                </div>
                                                <div>
                                                    <span className="block text-[8px] font-black text-[#0ecb81] uppercase tracking-widest mb-0.5">ESTRATEGIA AVANZADA</span>
                                                    <h4 className="text-base font-black text-white italic uppercase tracking-tight">TAKE PROFIT 2</h4>
                                                </div>
                                            </div>
                                        )}

                                        {/* TP3 Alert - Show for TP3 only */}
                                        {sig.status === 'TP3' && (
                                            <div className="mb-6 p-4 rounded-2xl bg-[#0ecb81]/10 border border-[#0ecb81]/20 flex items-center gap-4 animate-pulse">
                                                <div className="w-10 h-10 rounded-full bg-[#0ecb81]/20 flex items-center justify-center border border-[#0ecb81]/30">
                                                    <Flame size={20} className="text-[#0ecb81]" strokeWidth={2.5} />
                                                </div>
                                                <div>
                                                    <span className="block text-[8px] font-black text-[#0ecb81] uppercase tracking-widest mb-0.5">MÁXIMO RENDIMIENTO</span>
                                                    <h4 className="text-base font-black text-white italic uppercase tracking-tight">TAKE PROFIT 3</h4>
                                                </div>
                                            </div>
                                        )}

                                        {/* Analysis Report - Show if analysis exists and status is NOT a visual alert status (optional choice, or keep always) */}
                                        {/* Current logic was mutual exclusive. Let's keep it mutual exclusive to alerts? Or show below? */}
                                        {/* User wants "each option". Let's show analysis always if present, below alerts */}
                                        {sig.analysis && (
                                            <div className="mb-6 p-4 rounded-2xl bg-black/40 border border-white/5 relative group/analysis">
                                                <span className="text-[7px] font-black text-[#3b82f6] uppercase tracking-[0.2em] mb-2 flex items-center gap-1.5 italic">
                                                    <Info size={10} /> ALPHA_INTELLIGENCE_REPORT
                                                </span>
                                                <p className="text-[10px] text-slate-500 leading-relaxed italic line-clamp-2 group-hover/analysis:line-clamp-none transition-all">
                                                    "{sig.analysis}"
                                                </p>
                                            </div>
                                        )}


                                        <div className="mt-4">
                                            <button
                                                onClick={() => setSelectedAnalysis(sig)}
                                                className="w-full py-4 bg-[#3b82f6] hover:bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 italic border border-white/10 shadow-xl shadow-[#3b82f6]/10"
                                            >
                                                <BarChart3 size={14} /> VER ANÁLISIS
                                            </button>
                                        </div>

                                        <div className="mt-4 flex items-center justify-between text-[8px] font-bold text-slate-700 uppercase tracking-widest italic">
                                            <span className="flex items-center gap-1"><Clock size={10} /> {new Date(sig.createdAt).toLocaleDateString()}</span>
                                            <span className="flex items-center gap-1"><Radio size={10} className="text-[#0ecb81]" /> VERIFIED_ORIGIN</span>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="col-span-full py-32 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[3rem] bg-white/[0.01]">
                                    <div className="w-20 h-20 rounded-full bg-white/[0.03] flex items-center justify-center mb-6">
                                        <Signal className="text-slate-700" size={40} />
                                    </div>
                                    <h3 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter italic">Nodos_en_Espera</h3>
                                    <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.4em] max-w-sm text-center leading-relaxed italic">
                                        No hay señales activas en este momento. El sistema de inteligencia artificial sigue analizando el flujo de datos global.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                    <AnalysisViewerModal
                        signal={selectedAnalysis}
                        onClose={() => setSelectedAnalysis(null)}
                    />

                </div>
            </div>
        </Layout>
    );
};

// --- SIGNAL DETAIL MODAL ---
const SignalDetailModal = ({ signal, onClose }) => {
    if (!signal) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#181A20] border border-white/10 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative"
            >
                {/* Header Decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-10 pointer-events-none" style={{ background: signal.type.includes('BUY') ? '#0ecb81' : '#f6465d' }} />

                <div className="p-6 relative z-10">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h2 className="text-4xl font-black italic tracking-tighter uppercase text-white leading-none">{signal.pair}</h2>
                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase border ${signal.type.includes('BUY') ? 'bg-[#0ecb81]/10 text-[#0ecb81] border-[#0ecb81]/20' : 'bg-[#f6465d]/10 text-[#f6465d] border-[#f6465d]/20'}`}>
                                    {signal.type.includes('BUY') ? '▲ COMPRA' : '▼ VENTA'}
                                </span>
                            </div>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">EMITIDA: {new Date(signal.createdAt).toLocaleTimeString()}</span>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Price Grid */}
                    <div className="space-y-4 mb-8">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                                <span className="text-[8px] font-black text-slate-600 uppercase block mb-1 tracking-widest">ENTRADA</span>
                                <p className="font-mono font-bold text-white text-lg">{signal.entry}</p>
                            </div>
                            <div className="bg-black/40 p-4 rounded-2xl border border-[#f6465d]/10">
                                <span className="text-[8px] font-black text-[#f6465d]/60 uppercase block mb-1 tracking-widest">STOP LOSS</span>
                                <p className="font-mono font-bold text-[#f6465d] text-lg">{signal.sl}</p>
                            </div>
                        </div>

                        {/* TPs */}
                        <div className="bg-black/40 p-4 rounded-2xl border border-[#0ecb81]/10">
                            <span className="text-[8px] font-black text-[#0ecb81]/60 uppercase block mb-4 text-center tracking-widest">OBJETIVOS (TAKE PROFIT)</span>
                            <div className="flex justify-around items-center">
                                <div className="text-center">
                                    <span className="text-[8px] text-slate-500 font-bold block mb-1">TP 1</span>
                                    <p className="font-mono font-bold text-[#0ecb81] text-base">{signal.tp1}</p>
                                </div>
                                {signal.tp2 && (
                                    <>
                                        <div className="w-px h-8 bg-white/5" />
                                        <div className="text-center">
                                            <span className="text-[8px] text-slate-500 font-bold block mb-1">TP 2</span>
                                            <p className="font-mono font-bold text-[#0ecb81]/90 text-base">{signal.tp2}</p>
                                        </div>
                                    </>
                                )}
                                {signal.tp3 && (
                                    <>
                                        <div className="w-px h-8 bg-white/5" />
                                        <div className="text-center">
                                            <span className="text-[8px] text-slate-500 font-bold block mb-1">TP 3</span>
                                            <p className="font-mono font-bold text-[#0ecb81]/80 text-base">{signal.tp3}</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Analysis & Actions */}
                    {signal.analysis && (
                        <div className="mb-6 p-4 rounded-2xl bg-[#3b82f6]/5 border border-[#3b82f6]/10">
                            <span className="text-[8px] font-black text-[#3b82f6] uppercase tracking-widest mb-2 flex items-center gap-2">
                                <Info size={12} /> ANÁLISIS TÉCNICO
                            </span>
                            <p className="text-xs text-slate-400 leading-relaxed italic">
                                "{signal.analysis}"
                            </p>
                        </div>
                    )}

                    <div className="flex gap-3">
                        {signal.imageUrl && (
                            <button
                                onClick={() => window.open(signal.imageUrl, '_blank')}
                                className="flex-1 py-4 bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                            >
                                <Eye size={16} /> VER GRÁFICO
                            </button>
                        )}
                        <button className="flex-1 py-4 bg-white/[0.05] hover:bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 border border-white/5">
                            OPEN_SMART_ORDER ↗
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default SignalsPage;
