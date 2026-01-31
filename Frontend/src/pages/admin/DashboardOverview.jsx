import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity, Users, Zap, Server, Globe, Terminal, DollarSign,
    TrendingUp, BarChart3, Clock, ArrowUpRight, ArrowDownRight,
    Wallet, Bell, Signal, Briefcase, Shield, Radio, ChevronRight,
    Send, MessageSquare, UserPlus, AlertTriangle, CheckCircle2, Cpu, PieChart
} from 'lucide-react';

// Live price ticker from Binance - Animated Marquee
const MarketTicker = () => {
    const [prices, setPrices] = useState([
        { symbol: 'BTCUSDT', name: 'BTC', lastPrice: '0', priceChangePercent: '0' },
        { symbol: 'ETHUSDT', name: 'ETH', lastPrice: '0', priceChangePercent: '0' },
        { symbol: 'BNBUSDT', name: 'BNB', lastPrice: '0', priceChangePercent: '0' },
        { symbol: 'XRPUSDT', name: 'XRP', lastPrice: '0', priceChangePercent: '0' },
        { symbol: 'SOLUSDT', name: 'SOL', lastPrice: '0', priceChangePercent: '0' },
        { symbol: 'DOGEUSDT', name: 'DOGE', lastPrice: '0', priceChangePercent: '0' },
        { symbol: 'ADAUSDT', name: 'ADA', lastPrice: '0', priceChangePercent: '0' },
        { symbol: 'AVAXUSDT', name: 'AVAX', lastPrice: '0', priceChangePercent: '0' },
    ]);

    useEffect(() => {
        const fetchPrices = async () => {
            try {
                const res = await fetch('https://api.binance.com/api/v3/ticker/24hr');
                const data = await res.json();
                const symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'XRPUSDT', 'SOLUSDT', 'DOGEUSDT', 'ADAUSDT', 'AVAXUSDT'];
                const filtered = symbols.map(sym => {
                    const found = data.find(t => t.symbol === sym);
                    return found ? { ...found, name: sym.replace('USDT', '') } : null;
                }).filter(Boolean);
                setPrices(filtered);
            } catch (err) {
                console.error("Error fetching prices:", err);
            }
        };
        fetchPrices();
        const interval = setInterval(fetchPrices, 5000);
        return () => clearInterval(interval);
    }, []);

    const tickerItems = [...prices, ...prices]; // Duplicar para loop infinito

    return (
        <div className="bg-[#181A20] border border-white/5 rounded-xl overflow-hidden relative">
            <motion.div
                className="flex items-center py-3"
                animate={{ x: ['0%', '-50%'] }}
                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            >
                {tickerItems.map((p, i) => (
                    <div key={i} className="flex items-center gap-3 px-6 whitespace-nowrap">
                        <span className="text-xs font-bold text-[#eaecef]">{p.name}</span>
                        <span className="text-sm font-mono font-bold text-white tabular-nums">
                            ${parseFloat(p.lastPrice || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        <span className={`text-xs font-bold ${parseFloat(p.priceChangePercent) >= 0 ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}>
                            {parseFloat(p.priceChangePercent) >= 0 ? '+' : ''}{parseFloat(p.priceChangePercent || 0).toFixed(2)}%
                        </span>
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

// KPI Card Component
const KPICard = ({ label, value, subValue, icon: Icon, color, trend }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#181A20] border border-white/5 p-6 rounded-2xl group hover:border-white/10 transition-all shadow-xl relative overflow-hidden"
    >
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20" style={{ background: color }} />

        {/* Mini Sparkline */}
        <div className="absolute bottom-0 left-0 right-0 h-12 opacity-20">
            <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="w-full h-full">
                <path
                    d={`M 0 20 ${trend.map((v, idx) => `L ${(idx / (trend.length - 1)) * 100} ${20 - (v / 100) * 20}`).join(' ')} L 100 20 Z`}
                    fill={color}
                />
            </svg>
        </div>

        <div className="flex items-start justify-between mb-4 relative z-10">
            <div className="w-12 h-12 rounded-xl bg-black/40 flex items-center justify-center border border-white/5" style={{ color }}>
                <Icon size={24} strokeWidth={2} />
            </div>
            {subValue && (
                <span className={`text-[10px] font-bold px-2 py-1 rounded border ${subValue.includes('+') ? 'text-[#0ecb81] bg-[#0ecb81]/10 border-[#0ecb81]/20' : 'text-slate-400 bg-black/20 border-white/5'}`}>
                    {subValue}
                </span>
            )}
        </div>
        <div className="relative z-10">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">{label}</span>
            <span className="text-2xl font-bold text-[#eaecef] tabular-nums tracking-tight">{value}</span>
        </div>
    </motion.div>
);


const DashboardOverview = () => {
    const navigate = useNavigate();
    const [activities, setActivities] = useState([]);
    const [currentTime, setCurrentTime] = useState(new Date());

    // Generate live activity
    useEffect(() => {
        const actions = [
            { type: 'signal', action: 'COMPRA', pair: 'EUR/USD', user: 'Trader_4821', profit: '+1.24%' },
            { type: 'signal', action: 'VENTA', pair: 'GBP/JPY', user: 'Trader_9102', profit: '+0.87%' },
            { type: 'signal', action: 'COMPRA', pair: 'XAU/USD', user: 'Trader_3345', profit: '+2.15%' },
            { type: 'user', action: 'REGISTRO', user: 'nuevo_trader@email.com' },
            { type: 'signal', action: 'VENTA', pair: 'BTC/USD', user: 'Trader_7788', profit: '-0.32%' },
        ];

        const interval = setInterval(() => {
            const activity = actions[Math.floor(Math.random() * actions.length)];
            setActivities(prev => [{ ...activity, id: Date.now(), time: new Date() }, ...prev.slice(0, 9)]);
        }, 4000);
        return () => clearInterval(interval);
    }, []);


    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const [statsData, setStatsData] = useState({
        volume: '$84.2M', volumeTrend: '+12.5%',
        activeTraders: '1,240', activeTradersTrend: '+48 hoy',
        activeSignals: '12', activeSignalsSub: '8 en profit',
        tickets: '7', ticketsSub: '3 urgentes'
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('http://localhost:5257/api/dashboard/stats');
                if (res.ok) {
                    const data = await res.json();
                    setStatsData({
                        volume: data.volume,
                        volumeTrend: data.volumeTrend,
                        activeTraders: data.activeTraders.toLocaleString(),
                        activeTradersTrend: data.activeTradersTrend,
                        activeSignals: data.activeSignals.toString(),
                        activeSignalsSub: data.activeSignalsSub,
                        tickets: data.supportTickets.toString(),
                        ticketsSub: data.supportTicketsSub
                    });
                }
            } catch (err) {
                console.error("Error fetching dashboard stats:", err);
            }
        };
        fetchStats();
        const interval = setInterval(fetchStats, 30000);
        return () => clearInterval(interval);
    }, []);

    const kpiData = [
        { label: 'Volumen Hoy', value: statsData.volume, subValue: statsData.volumeTrend, icon: DollarSign, color: '#3b82f6', trend: [20, 50, 40, 60, 55, 80, 70] },
        { label: 'Traders Activos', value: statsData.activeTraders, subValue: statsData.activeTradersTrend, icon: Users, color: '#8b5cf6', trend: [40, 30, 50, 45, 60, 55, 75] },
        { label: 'Señales Activas', value: statsData.activeSignals, subValue: statsData.activeSignalsSub, icon: Signal, color: '#0ecb81', trend: [30, 40, 60, 55, 70, 85, 90] },
        { label: 'Tickets Soporte', value: statsData.tickets, subValue: statsData.ticketsSub, icon: MessageSquare, color: '#fcd535', trend: [15, 20, 18, 25, 22, 28, 24] },
    ];

    const serverNodes = [
        { name: 'MAD_1', location: 'Madrid', ping: '12ms', load: 24, status: 'online' },
        { name: 'NYC_9', location: 'New York', ping: '28ms', load: 68, status: 'online' },
        { name: 'TOK_4', location: 'Tokyo', ping: '156ms', load: 45, status: 'online' },
        { name: 'LDN_2', location: 'London', ping: '32ms', load: 18, status: 'online' },
    ];

    return (
        <div className="p-6 lg:p-10 space-y-6 bg-[#0B0E11] min-h-full">
            {/* Market Ticker */}
            <MarketTicker />

            {/* KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpiData.map((kpi, i) => (
                    <KPICard key={i} {...kpi} />
                ))}
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column - Activity Feed */}
                <div className="lg:col-span-8 space-y-6">
                    {/* ACCIONES RÁPIDAS */}
                    <div className="bg-[#181A20] border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl" />
                        <h3 className="text-xs font-bold text-[#eaecef] uppercase tracking-wider mb-6 flex items-center gap-2">
                            <Zap size={14} className="text-[#3b82f6]" /> Acciones Rápidas
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 relative z-10">
                            <button
                                onClick={() => navigate('/admin/signal-engine')}
                                className="flex items-center justify-center gap-2 p-4 bg-[#3b82f6]/10 hover:bg-[#3b82f6]/20 border border-[#3b82f6]/20 rounded-xl transition-all group"
                            >
                                <Send size={14} className="text-[#3b82f6]" />
                                <span className="text-[9px] font-black text-[#3b82f6] uppercase tracking-widest">ENVIAR SEÑAL</span>
                            </button>
                            <button
                                onClick={() => navigate('/admin/user-management')}
                                className="flex items-center justify-center gap-2 p-4 bg-[#0ecb81]/10 hover:bg-[#0ecb81]/20 border border-[#0ecb81]/20 rounded-xl transition-all group"
                            >
                                <UserPlus size={14} className="text-[#0ecb81]" />
                                <span className="text-[9px] font-black text-[#0ecb81] uppercase tracking-widest">CREAR USUARIO</span>
                            </button>
                            <button
                                onClick={() => navigate('/admin/support-hub')}
                                className="flex items-center justify-center gap-2 p-4 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 rounded-xl transition-all group"
                            >
                                <MessageSquare size={14} className="text-amber-500" />
                                <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">MENSAJES</span>
                            </button>
                            <button
                                onClick={() => navigate('/admin/banners')}
                                className="flex items-center justify-center gap-2 p-4 bg-[#f6465d]/10 hover:bg-[#f6465d]/20 border border-[#f6465d]/20 rounded-xl transition-all group"
                            >
                                <AlertTriangle size={14} className="text-[#f6465d]" />
                                <span className="text-[9px] font-black text-[#f6465d] uppercase tracking-widest">ALERTAR</span>
                            </button>
                        </div>
                    </div>

                    {/* Live Activity Feed */}
                    <div className="bg-[#181A20] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#1e2329]/50">
                            <div className="flex items-center gap-3">
                                <Activity size={18} className="text-[#fcd535]" />
                                <h3 className="text-xs font-bold text-[#eaecef] uppercase tracking-wider">Flujo en Tiempo Real</h3>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0ecb81]/10 border border-[#0ecb81]/20 rounded-lg">
                                    <div className="w-1.5 h-1.5 bg-[#0ecb81] rounded-full animate-pulse" />
                                    <span className="text-[9px] font-bold text-[#0ecb81] uppercase tracking-widest">En Vivo</span>
                                </div>
                            </div>
                        </div>
                        <div className="divide-y divide-white/[0.03] max-h-[400px] overflow-y-auto custom-scrollbar">
                            <AnimatePresence>
                                {activities.map((activity) => (
                                    <motion.div
                                        key={activity.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="p-5 hover:bg-white/[0.01] transition-all flex items-center justify-between gap-4"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold ${activity.action === 'COMPRA' ? 'bg-[#0ecb81]/10 text-[#0ecb81] border border-[#0ecb81]/20' :
                                                activity.action === 'VENTA' ? 'bg-[#f6465d]/10 text-[#f6465d] border border-[#f6465d]/20' :
                                                    'bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/20'
                                                }`}>
                                                {activity.action === 'COMPRA' ? <ArrowUpRight size={16} strokeWidth={2.5} /> :
                                                    activity.action === 'VENTA' ? <ArrowDownRight size={16} strokeWidth={2.5} /> :
                                                        <UserPlus size={16} strokeWidth={2} />}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold text-[#eaecef] uppercase">{activity.user}</span>
                                                    {activity.pair && <span className="text-[9px] font-bold text-slate-500">• {activity.pair}</span>}
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{activity.action}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            {activity.profit && (
                                                <span className={`text-sm font-bold tabular-nums ${activity.profit.startsWith('+') ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}>
                                                    {activity.profit}
                                                </span>
                                            )}
                                            <span className="text-[9px] font-mono text-slate-700 block mt-1">
                                                {new Date(activity.time).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Right Column - Infrastructure */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Server Status */}
                    <div className="bg-[#181A20] border border-white/5 rounded-2xl p-6 shadow-xl">
                        <h3 className="text-xs font-bold text-[#eaecef] uppercase tracking-wider mb-5 flex items-center gap-2">
                            <Server size={14} className="text-[#3b82f6]" /> Estado de Nodos
                        </h3>
                        <div className="space-y-3">
                            {serverNodes.map((node, i) => (
                                <div key={i} className="p-4 bg-black/20 border border-white/5 rounded-xl hover:border-white/10 transition-all">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-[#0ecb81] shadow-[0_0_6px_#0ecb81]" />
                                            <span className="text-[10px] font-bold text-[#eaecef] uppercase">{node.name}</span>
                                        </div>
                                        <span className="text-[9px] font-mono text-slate-600">{node.ping}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-[#3b82f6] rounded-full transition-all duration-1000"
                                                style={{ width: `${node.load}%` }}
                                            />
                                        </div>
                                        <span className="text-[9px] font-bold text-slate-500 tabular-nums">{node.load}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* System Terminal */}
                    <div className="bg-[#181A20] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                        <div className="p-4 border-b border-white/5 bg-[#1e2329]/50 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Terminal size={14} className="text-[#fcd535]" />
                                <span className="text-[10px] font-bold text-[#eaecef] uppercase tracking-wider">Terminal</span>
                            </div>
                            <div className="flex gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-[#f6465d]/30" />
                                <div className="w-2 h-2 rounded-full bg-[#fcd535]/30" />
                                <div className="w-2 h-2 rounded-full bg-[#0ecb81] shadow-[0_0_4px_#0ecb81]" />
                            </div>
                        </div>
                        <div className="p-4 font-mono text-[10px] bg-black/40 h-48 overflow-y-auto custom-scrollbar space-y-2">
                            <div className="text-[#0ecb81]">[{currentTime.toLocaleTimeString()}] ✓ Sistema iniciado correctamente</div>
                            <div className="text-slate-500">[{currentTime.toLocaleTimeString()}] → Conectando con bridge MT4...</div>
                            <div className="text-[#3b82f6]">[{currentTime.toLocaleTimeString()}] ✓ Bridge sincronizado: MAD_1</div>
                            <div className="text-slate-500">[{currentTime.toLocaleTimeString()}] → Verificando liquidez...</div>
                            <div className="text-[#0ecb81]">[{currentTime.toLocaleTimeString()}] ✓ Todas las pasarelas operativas</div>
                            <div className="flex items-center gap-2 text-[#fcd535] mt-4">
                                <span>ADMIN@SISTEMA:</span>
                                <div className="w-2 h-3 bg-[#fcd535] animate-pulse" />
                            </div>
                        </div>
                    </div>

                    {/* Performance Summary */}
                    <div className="bg-[#181A20] border border-white/5 rounded-2xl p-6 shadow-xl">
                        <h3 className="text-xs font-bold text-[#eaecef] uppercase tracking-wider mb-5 flex items-center gap-2">
                            <TrendingUp size={14} className="text-[#0ecb81]" /> Rendimiento Hoy
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-4 bg-black/20 rounded-xl border border-white/5">
                                <span className="text-2xl font-bold text-[#0ecb81] tabular-nums">+142.5</span>
                                <span className="text-[9px] font-bold text-slate-500 uppercase block mt-1">Pips</span>
                            </div>
                            <div className="text-center p-4 bg-black/20 rounded-xl border border-white/5">
                                <span className="text-2xl font-bold text-[#eaecef] tabular-nums">23</span>
                                <span className="text-[9px] font-bold text-slate-500 uppercase block mt-1">Señales</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.1); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(59, 130, 246, 0.3); }
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}} />
        </div>
    );
};

export default DashboardOverview;
