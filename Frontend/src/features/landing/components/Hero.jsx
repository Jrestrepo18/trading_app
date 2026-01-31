import React from 'react';
import { motion } from 'framer-motion';
import {
    ArrowRight, TrendingUp, Shield, PlayCircle, BarChart3, Activity
} from 'lucide-react';

// ==========================================
// SUB-COMPONENTS
// ==========================================

const AnimatedChart = () => {
    // Smoother, professional trading path
    const points = "0,70 20,65 40,75 60,55 80,68 100,45 120,58 140,35 160,48 180,28 200,42 220,25 240,45 260,35 280,55 300,40";

    return (
        <div className="absolute inset-0 flex flex-col pt-10 pb-4 px-2">
            {/* Chart Area */}
            <div className="relative flex-1 mb-4">
                {/* Horizontal Guide Lines */}
                <div className="absolute top-0 w-full border-t border-white/5" />
                <div className="absolute top-1/2 w-full border-t border-white/5" />
                <div className="absolute bottom-0 w-full border-t border-white/5" />

                {/* Vertical Timeline Guide */}
                <div className="absolute right-12 top-0 bottom-0 border-l border-dashed border-white/10" />

                <svg viewBox="0 0 300 100" className="w-full h-full overflow-visible">
                    <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.15" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Strike Price Line */}
                    <motion.line
                        x1="180" y1="28" x2="300" y2="28"
                        stroke="#f43f5e" strokeWidth="1" strokeDasharray="3,3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    />

                    {/* Main Path */}
                    <motion.path
                        d={`M ${points}`}
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 3, ease: "linear", repeat: Infinity }}
                    />

                    <motion.path
                        d={`M ${points} L 300,100 L 0,100 Z`}
                        fill="url(#chartGradient)"
                    />

                    {/* Trade Execution Badge */}
                    <motion.g
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 }}
                        transform="translate(140, 10)"
                    >
                        <rect width="54" height="18" rx="9" fill="#f43f5e" />
                        <text x="8" y="12" fill="white" style={{ fontSize: '8px', fontWeight: '900' }}>$1,000</text>
                        <circle cx="45" cy="9" r="6" fill="white" />
                        <path d="M 43 11 L 47 7 M 47 11 L 43 7" stroke="#f43f5e" strokeWidth="1.2" transform="rotate(45, 45, 9)" />
                    </motion.g>

                    {/* Live Point */}
                    <motion.circle
                        cx="300"
                        cy="40"
                        r="3"
                        fill="#10b981"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                </svg>
            </div>

            {/* Trading Controls Layout */}
            <div className="space-y-2">
                {/* Timeframes */}
                <div className="flex justify-between gap-1.5">
                    {['5s', '1m', '1h'].map((t) => (
                        <div key={t} className="flex-1 bg-white/5 border border-white/5 rounded-lg py-1 text-center text-[8px] font-black text-slate-400 group-hover:text-white transition-colors">
                            {t}
                        </div>
                    ))}
                </div>

                {/* Trade Config */}
                <div className="flex gap-1.5 focus-within:ring-1 ring-emerald-500/30 rounded-lg">
                    <div className="flex-1 bg-white/5 border border-white/5 rounded-lg p-1.5">
                        <div className="text-[6px] text-slate-500 uppercase font-black">Monto</div>
                        <div className="text-[9px] font-bold text-white tracking-tight">$10.00</div>
                    </div>
                    <div className="flex-1 bg-white/5 border border-white/5 rounded-lg p-1.5">
                        <div className="text-[6px] text-slate-500 uppercase font-black">Duración</div>
                        <div className="text-[9px] font-bold text-white tracking-tight">01:00m</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SignalNotification = () => (
    <motion.div
        initial={{ opacity: 0, x: 20, z: 50 }}
        animate={{ opacity: 1, x: 0, z: 50 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute -top-12 -right-8 z-30 hidden lg:block"
    >
        <div className="bg-[#1e2330]/90 backdrop-blur-xl p-3.5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.5)] border border-white/5 w-52">
            <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-1.5">
                    <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                    </span>
                    <span className="text-[9px] font-bold text-emerald-400 tracking-wider">NUEVA SEÑAL</span>
                </div>
                <span className="text-[9px] text-slate-500 font-mono">Justo ahora</span>
            </div>
            <div className="flex items-end justify-between">
                <div>
                    <h4 className="text-white font-bold text-base leading-none mb-1">BTC/USD</h4>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[9px] font-medium border border-emerald-500/20 uppercase">
                        Compra
                    </span>
                </div>
                <div className="text-right">
                    <div className="text-lg font-bold text-white tracking-tight">42,850</div>
                    <div className="text-[9px] text-emerald-400">TP: 44,500</div>
                </div>
            </div>
        </div>
    </motion.div>
);

const ProfitCard = () => (
    <motion.div
        initial={{ opacity: 0, x: -20, z: 80 }}
        animate={{ opacity: 1, x: 0, z: 80 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute -bottom-10 -left-10 z-30 hidden lg:block"
    >
        <div className="bg-white p-3 rounded-2xl shadow-[0_8px_30px_rgba(255,255,255,0.1)] w-44 transform transition-transform hover:scale-105">
            <div className="flex items-start gap-2.5">
                <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                    <BarChart3 size={18} />
                </div>
                <div>
                    <p className="text-slate-500 text-[10px] font-semibold uppercase tracking-wide">Rendimiento</p>
                    <div className="text-xl font-bold text-slate-900 leading-none mt-0.5">+24.5%</div>
                    <p className="text-emerald-600 text-[10px] font-medium flex items-center gap-1 mt-1">
                        <TrendingUp size={10} /> Esta semana
                    </p>
                </div>
            </div>
        </div>
    </motion.div>
);

const TickerTape = () => {
    const pairs = [
        { name: "BTC/USD", val: "42,105", up: true },
        { name: "ETH/USD", val: "2,250", up: true },
        { name: "XAU/USD", val: "2,034.10", up: true },
        { name: "SOL/USD", val: "98.45", up: true },
        { name: "AAPL", val: "185.20", up: true },
        { name: "TSLA", val: "248.50", up: false },
        { name: "SPY", val: "485.30", up: true },
        { name: "QQQ", val: "420.15", up: true },
        { name: "US30", val: "38,450", up: true },
        { name: "NAS100", val: "17,320", up: false },
        { name: "ES1!", val: "4,920", up: true },
        { name: "NQ1!", val: "17,450", up: true },
        { name: "OIL/USD", val: "78.25", up: true },
    ];
    return (
        <div className="absolute bottom-0 w-full border-t border-white/5 bg-[#0A0C10]/80 backdrop-blur-sm z-20">
            <div className="flex overflow-hidden py-3">
                <motion.div
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
                    className="flex gap-12 whitespace-nowrap px-4"
                >
                    {[...pairs, ...pairs, ...pairs].map((pair, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <span className="font-bold text-slate-400 text-sm">{pair.name}</span>
                            <span className={`text-sm font-mono ${pair.up ? "text-emerald-400" : "text-rose-400"}`}>
                                {pair.val}
                            </span>
                            <Activity size={14} className={pair.up ? "text-emerald-500" : "text-rose-500"} />
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

// ==========================================
// MAIN HERO COMPONENT
// ==========================================

const Hero = () => {
    return (
        <div id="solutions" className="relative w-full min-h-[100dvh] bg-[#0A0C10] text-white selection:bg-indigo-500/30 font-sans overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[20%] w-[50vw] max-w-[800px] h-[50vw] max-h-[800px] bg-indigo-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[10%] w-[40vw] max-w-[600px] h-[40vw] max-h-[600px] bg-emerald-600/10 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 pt-16 sm:pt-20 lg:pt-24 pb-16 relative z-10">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8"
                        >
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">Señales • Asesorías • Formación</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight mb-4 sm:mb-6 leading-[1.15]"
                        >
                            Aprende, opera y <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
                                gana con nosotros.
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-slate-400 text-sm sm:text-base lg:text-lg max-w-xl mb-6 sm:mb-8 leading-relaxed"
                        >
                            Señales de trading profesionales, asesorías personalizadas y formación completa para que domines los mercados financieros.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-col sm:flex-row gap-4 h-full"
                        >
                            <button className="bg-emerald-500 hover:bg-emerald-400 text-[#0A0C10] font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2 group">
                                Empezar Ahora
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button className="bg-white/5 hover:bg-white/10 text-white font-bold px-8 py-4 rounded-xl transition-all border border-white/10 flex items-center justify-center gap-2">
                                <PlayCircle size={20} />
                                Ver Resultados
                            </button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="mt-6 sm:mt-8 flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-slate-500 font-medium"
                        >
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                Señales 24/7
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                Mentorías en vivo
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                Soporte 24/7
                            </div>
                        </motion.div>
                    </div>

                    <div className="relative h-[350px] sm:h-[400px] lg:h-[450px] xl:h-[500px] flex items-center justify-center w-full" style={{ perspective: '1000px' }}>
                        <motion.div
                            initial={{ rotateY: 15, rotateX: 5 }}
                            animate={{ rotateY: -15 }}
                            transition={{ rotateY: { duration: 8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" } }}
                            style={{ transformStyle: 'preserve-3d' }}
                            className="relative z-10"
                        >
                            <motion.div
                                animate={{ y: [-15, 15, -15] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                style={{ transformStyle: 'preserve-3d' }}
                                className="relative"
                            >
                                <div className="w-[200px] sm:w-[220px] lg:w-[260px] xl:w-[280px] h-[350px] sm:h-[390px] lg:h-[450px] xl:h-[480px] bg-[#131722] rounded-[2rem] sm:rounded-[2.5rem] border-[4px] sm:border-[5px] border-[#252b3d] shadow-2xl relative overflow-hidden flex flex-col">
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 h-4 sm:h-5 w-20 sm:w-28 bg-[#252b3d] rounded-b-lg z-20"></div>
                                    <div className="flex-1 flex flex-col p-3 sm:p-4 lg:p-5 pt-8 sm:pt-10">
                                        <div className="flex justify-between items-center mb-3 sm:mb-4">
                                            <div>
                                                <h2 className="text-[8px] sm:text-[10px] text-slate-400 font-medium uppercase tracking-wider">Portafolio Total</h2>
                                                <p className="text-base sm:text-lg lg:text-xl font-bold mt-0.5 text-white">$12,450.00</p>
                                            </div>
                                            <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-gradient-to-tr from-emerald-400 to-cyan-500" />
                                        </div>
                                        <div className="h-20 sm:h-24 lg:h-28 bg-gradient-to-b from-emerald-500/10 to-transparent rounded-xl mb-2 sm:mb-3 border border-emerald-500/20 relative overflow-hidden group">
                                            <AnimatedChart />
                                            <div className="absolute top-2 left-2 bg-emerald-500/20 border border-emerald-500/30 px-1.5 py-0.5 rounded text-[8px] font-bold text-emerald-400 z-10">
                                                +12.5%
                                            </div>
                                        </div>
                                        <div className="space-y-1.5 sm:space-y-2 flex-1">
                                            {['XAU/USD', 'BTC/USD'].map((pair, idx) => (
                                                <div key={idx} className="flex items-center justify-between p-2 sm:p-2.5 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-md flex items-center justify-center ${idx === 1 ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                                            <BarChart3 size={12} />
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-[10px] sm:text-xs text-white">{pair}</div>
                                                            <div className="text-[7px] sm:text-[8px] text-slate-500">Vol: 24M</div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-[10px] sm:text-xs font-bold text-white">$1,204</div>
                                                        <div className="text-[7px] sm:text-[8px] text-emerald-400">+0.4%</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <button className="w-full mt-2 sm:mt-3 py-2 sm:py-2.5 bg-[#2962ff] hover:bg-[#2050db] rounded-lg font-bold text-white text-[10px] sm:text-xs shadow-lg shadow-blue-900/40 transition-colors">
                                            Nueva Operación
                                        </button>
                                    </div>
                                </div>
                                <SignalNotification />
                                <ProfitCard />
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>
            <TickerTape />
        </div>
    );
};

export default Hero;