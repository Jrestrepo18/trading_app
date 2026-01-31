import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Signal, Users, GraduationCap, Target, Zap, TrendingDown, PlayCircle } from 'lucide-react';

const LiveResults = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const stats = [
        {
            label: "Señales Enviadas",
            baseValue: 847,
            fluctuation: 5,
            suffix: "+",
            icon: Signal,
            color: "from-blue-500 to-indigo-600",
            bgColor: "bg-blue-500/10",
            iconColor: "text-blue-400",
            description: "Total este mes",
            isLive: true,
            format: true
        },
        {
            label: "Operaciones en Vivo",
            isOperations: true,
            wonValue: 684,
            lostValue: 163,
            fluctuation: 3,
            color: "from-emerald-500 via-blue-500 to-rose-500",
            description: "Resultados en tiempo real",
            icon: Target,
            isLive: true
        },
        {
            label: "Clases en Vivo",
            baseValue: 42,
            fluctuation: 1,
            suffix: "",
            icon: PlayCircle,
            color: "from-amber-500 to-orange-600",
            bgColor: "bg-amber-500/10",
            iconColor: "text-amber-400",
            description: "Esta semana",
            isLive: true,
            format: false
        },
        {
            label: "Estudiantes Activos",
            baseValue: 1250,
            fluctuation: 8,
            suffix: "+",
            icon: GraduationCap,
            color: "from-blue-500 to-indigo-600",
            bgColor: "bg-blue-500/10",
            iconColor: "text-blue-400",
            description: "En nuestra academia",
            isLive: true,
            format: true
        },
    ];

    return (
        <section id="results" ref={ref} className="py-24 bg-gradient-to-b from-[#0A0C10] to-[#0d1117] relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-600/5 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-emerald-400 text-sm font-medium">Datos en Tiempo Real</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Resultados que
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400"> hablan</span>
                    </h2>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        Nuestra comunidad crece cada día. Únete a traders que ya están transformando su operativa.
                    </p>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {stats.map((stat, i) => (
                        <StatCard key={i} stat={stat} index={i} isInView={isInView} />
                    ))}
                </div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="mt-12 text-center"
                >
                    <div className="inline-flex items-center gap-3 text-slate-500 text-sm">
                        <Zap size={16} className="text-emerald-400" />
                        <span>Actualizado en tiempo real • Comunidad activa</span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

// StatCard with count-up and live fluctuation
const StatCard = ({ stat, index, isInView }) => {
    if (stat.isOperations) {
        return <OperationsCard stat={stat} index={index} isInView={isInView} />;
    }
    if (stat.isDual) {
        return <DualStatCard stat={stat} index={index} isInView={isInView} />;
    }

    const [displayValue, setDisplayValue] = useState(0);
    const [isCountingUp, setIsCountingUp] = useState(true);
    const [lastChange, setLastChange] = useState(0);
    const hasStarted = useRef(false);

    useEffect(() => {
        if (!isInView || hasStarted.current) return;
        hasStarted.current = true;

        const duration = 2000 + index * 200;
        const startTime = Date.now();

        const animate = () => {
            const now = Date.now();
            const progress = Math.min((now - startTime) / duration, 1);
            const easeOutExpo = 1 - Math.pow(2, -10 * progress);
            const currentValue = Math.floor(easeOutExpo * stat.baseValue);

            setDisplayValue(currentValue);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setDisplayValue(stat.baseValue);
                setIsCountingUp(false);
            }
        };

        requestAnimationFrame(animate);
    }, [isInView, stat.baseValue, index]);

    useEffect(() => {
        if (isCountingUp || !stat.isLive) return;

        const fluctuate = () => {
            const randomChange = Math.floor(Math.random() * (stat.fluctuation * 2 + 1)) - stat.fluctuation;
            const newValue = stat.baseValue + randomChange;

            setLastChange(newValue > displayValue ? 1 : newValue < displayValue ? -1 : 0);
            setDisplayValue(newValue);
        };

        const interval = setInterval(fluctuate, 1500 + Math.random() * 2500);
        return () => clearInterval(interval);
    }, [isCountingUp, stat.isLive, stat.baseValue, stat.fluctuation]);

    const formattedValue = stat.format ? displayValue.toLocaleString() : displayValue.toString();

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="relative group"
        >
            <div className="absolute inset-x-0 -bottom-2 h-24 bg-gradient-to-t from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl blur-xl -z-10" />
            <div className="bg-[#131722]/80 backdrop-blur-sm p-8 rounded-3xl border border-slate-800/50 hover:border-slate-700 transition-all duration-300 h-full">
                <div className="flex items-start justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl ${stat.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <stat.icon size={28} className={stat.iconColor} />
                    </div>
                    {stat.isLive && !isCountingUp && (
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                            </span>
                            <span className="text-[10px] text-emerald-400 font-medium tracking-tight">LIVE</span>
                        </div>
                    )}
                </div>

                <div className="flex items-baseline gap-1 mb-2">
                    {stat.prefix && <span className={`text-2xl font-bold ${stat.iconColor}`}>{stat.prefix}</span>}
                    <motion.span
                        key={displayValue}
                        initial={!isCountingUp ? { scale: 1.05 } : false}
                        animate={{ scale: 1 }}
                        className={`text-5xl font-bold tracking-tight tabular-nums transition-colors duration-300 ${lastChange === 1 ? 'text-emerald-400' :
                            lastChange === -1 ? 'text-rose-400' :
                                'text-white'
                            }`}
                    >
                        {formattedValue}
                    </motion.span>
                    <span className={`text-2xl font-bold ${stat.iconColor}`}>{stat.suffix}</span>

                    {!isCountingUp && lastChange !== 0 && (
                        <motion.span
                            initial={{ opacity: 0, y: lastChange === 1 ? 5 : -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`ml-1 text-sm ${lastChange === 1 ? 'text-emerald-400' : 'text-rose-400'}`}
                        >
                            {lastChange === 1 ? '↑' : '↓'}
                        </motion.span>
                    )}
                </div>

                <h3 className="text-lg font-semibold text-white mb-2">{stat.label}</h3>
                <p className="text-slate-500 text-sm">{stat.description}</p>

                <div className={`absolute bottom-0 left-8 right-8 h-1 rounded-full bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            </div>
        </motion.div>
    );
};

const OperationsCard = ({ stat, index, isInView }) => {
    const [won, setWon] = useState(0);
    const [lost, setLost] = useState(0);
    const [recentResults, setRecentResults] = useState([
        { id: 1, pair: "BTC/USD", win: true, amount: "+$8.40" },
        { id: 2, pair: "AAPL", win: false, amount: "-$10.00" },
        { id: 3, pair: "XAU/USD", win: true, amount: "+$17.20" }
    ]);
    const hasStarted = useRef(false);

    useEffect(() => {
        if (!isInView || hasStarted.current) return;
        hasStarted.current = true;

        const duration = 2000;
        const startTime = Date.now();

        const animate = () => {
            const now = Date.now();
            const progress = Math.min((now - startTime) / duration, 1);
            const easeOutExpo = 1 - Math.pow(2, -10 * progress);

            setWon(Math.floor(easeOutExpo * stat.wonValue));
            setLost(Math.floor(easeOutExpo * stat.lostValue));

            if (progress < 1) requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
    }, [isInView, stat.wonValue, stat.lostValue]);

    useEffect(() => {
        const pairs = ["BTC/USD", "ETH/USD", "XAU/USD", "AAPL", "SPY"];
        const interval = setInterval(() => {
            const isWin = Math.random() > 0.4;
            const pair = pairs[Math.floor(Math.random() * pairs.length)];
            const amount = isWin ? `+$${(Math.random() * 20 + 5).toFixed(1)}` : `-$10.00`;

            const newResult = {
                id: Date.now(),
                pair,
                win: isWin,
                amount
            };

            setRecentResults(prev => [newResult, ...prev].slice(0, 3));
            if (isWin) setWon(prev => prev + 1);
            else setLost(prev => prev + 1);
        }, 4000 + Math.random() * 4000);
        return () => clearInterval(interval);
    }, []);

    const total = won + lost;
    const winRate = total > 0 ? (won / total) * 100 : 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="md:col-span-1 lg:col-span-1 relative group"
        >
            <div className="absolute inset-x-0 -bottom-2 h-24 bg-gradient-to-t from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 rounded-3xl blur-xl -z-10" />
            <div className="bg-[#131722]/80 backdrop-blur-sm p-8 rounded-3xl border border-slate-800/50 hover:border-slate-700 transition-all duration-300 h-full flex flex-col">
                <div className="flex items-start justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                        <stat.icon size={24} className="text-blue-400" />
                    </div>
                    <div className="flex flex-col items-end">
                        <div className="flex items-center gap-2 mb-1">
                            {stat.isLive && (
                                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                    <span className="relative flex h-1.5 w-1.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                                    </span>
                                    <span className="text-[8px] text-emerald-400 font-bold uppercase tracking-tight">LIVE</span>
                                </div>
                            )}
                            <div className="text-2xl font-black text-white">{total.toLocaleString()}</div>
                        </div>
                        <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Operaciones</div>
                    </div>
                </div>

                <div className="space-y-5 flex-1">
                    {/* Win Rate Meter */}
                    <div className="space-y-1.5">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                            <span className="text-emerald-400">Wins {winRate.toFixed(0)}%</span>
                            <span className="text-rose-400">Loss {(100 - winRate).toFixed(0)}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-800/50 rounded-full overflow-hidden flex">
                            <motion.div
                                animate={{ width: `${winRate}%` }}
                                className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                            />
                            <div className="h-full bg-rose-500/20 w-full" />
                        </div>
                    </div>

                    {/* Live Ticker */}
                    <div className="space-y-2 py-1">
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800/50 pb-1">Historial en Vivo</p>
                        <div className="space-y-2 h-[80px] overflow-hidden">
                            {recentResults.map((res) => (
                                <motion.div
                                    key={res.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center justify-between"
                                >
                                    <span className="text-[11px] font-bold text-white">{res.pair}</span>
                                    <span className={`text-[10px] font-black ${res.win ? 'text-emerald-400' : 'text-rose-400'}`}>
                                        {res.win ? 'WIN' : 'LOSS'} {res.amount}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/50">
                    <div className="flex justify-between items-center text-[10px] font-bold">
                        <div className="flex items-center gap-1.5">
                            <span className="text-slate-500 uppercase">Eficiencia</span>
                            <span className="text-emerald-400">Excelente</span>
                        </div>
                        <div className="text-slate-500">24/7 LIVE</div>
                    </div>
                </div>

                <div className={`absolute bottom-0 left-8 right-8 h-1 rounded-full bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            </div>
        </motion.div>
    );
};

const DualStatCard = ({ stat, index, isInView }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="md:col-span-1 lg:col-span-1 relative group"
        >
            <div className="absolute inset-x-0 -bottom-2 h-24 bg-gradient-to-t from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl blur-xl -z-10" />
            <div className="bg-[#131722]/80 backdrop-blur-sm p-8 rounded-3xl border border-slate-800/50 hover:border-slate-700 transition-all duration-300 h-full flex flex-col justify-between">
                <div>
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        {stat.label}
                        <Zap size={16} className="text-amber-400" />
                    </h3>

                    <div className="grid grid-cols-2 gap-8 relative">
                        {/* Divider */}
                        <div className="absolute left-1/2 top-2 bottom-2 w-px bg-slate-800/50" />

                        {stat.stats.map((s, i) => (
                            <div key={i} className="flex flex-col">
                                <div className={`w-10 h-10 rounded-xl ${s.bgColor} flex items-center justify-center mb-4 text-emerald-400`}>
                                    <s.icon size={20} className={s.color} />
                                </div>
                                <div className="space-y-1">
                                    <div className="text-3xl font-black text-white tracking-tight">
                                        {s.baseValue}{s.suffix}
                                    </div>
                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                        {s.label}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-800/50">
                    <p className="text-slate-500 text-sm italic">{stat.description}</p>
                </div>

                <div className={`absolute bottom-0 left-8 right-8 h-1 rounded-full bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            </div>
        </motion.div>
    );
};

export default LiveResults;
