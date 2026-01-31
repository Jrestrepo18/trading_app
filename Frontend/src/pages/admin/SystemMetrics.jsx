import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity, Zap, Clock, Cpu, BarChart3, Database, Globe, Server,
    AlertTriangle, CheckCircle2, TrendingUp, Terminal, Radio, ShieldCheck,
    Wifi, HardDrive, RefreshCw
} from 'lucide-react';

// Animated Progress Ring
const ProgressRing = ({ value, label, color, size = 80 }) => {
    const radius = (size - 12) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = (value / 100) * circumference;

    return (
        <div className="flex flex-col items-center gap-2">
            <div className="relative" style={{ width: size, height: size }}>
                <svg width={size} height={size} className="-rotate-90">
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke="rgba(255,255,255,0.05)"
                        strokeWidth="6"
                    />
                    <motion.circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke={color}
                        strokeWidth="6"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: circumference - progress }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-white tabular-nums">{value}%</span>
                </div>
            </div>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{label}</span>
        </div>
    );
};

const SystemMetrics = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [logs, setLogs] = useState([
        { id: 1, time: '16:42:01', event: 'Señal S-7721: TP1 alcanzado (+42 pips)', type: 'success', node: 'MAD_1' },
        { id: 2, time: '16:41:15', event: 'Nuevo usuario registrado: Alan_Trader', type: 'info', node: 'NYC_9' },
        { id: 3, time: '16:40:42', event: 'Pico de latencia detectado en EU-WEST (48ms)', type: 'warning', node: 'TOK_4' },
        { id: 4, time: '16:38:10', event: 'Bridge MT4 sincronizado correctamente', type: 'success', node: 'MAD_1' },
        { id: 5, time: '16:35:05', event: 'Integración VIX75 completada', type: 'info', node: 'NYC_9' },
    ]);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const systemStats = [
        { label: 'Win Rate', value: '76.4%', icon: TrendingUp, color: '#0ecb81', trend: '+2.1%' },
        { label: 'Pips Hoy', value: '+2,482', icon: Zap, color: '#3b82f6', trend: '+142.5' },
        { label: 'Ejecuciones', value: '14.8K', icon: Activity, color: '#8b5cf6', trend: '+248' },
        { label: 'Uptime', value: '99.99%', icon: ShieldCheck, color: '#fcd535', trend: '30d' },
    ];

    const infrastructure = [
        { label: 'CPU', value: 24, icon: Cpu, status: 'ÓPTIMO' },
        { label: 'Memoria', value: 42, icon: HardDrive, status: 'ESTABLE' },
        { label: 'Red', value: 18, icon: Wifi, status: 'EXCELENTE' },
        { label: 'Disco', value: 56, icon: Database, status: 'NOMINAL' },
    ];

    const services = [
        { name: 'API Principal', status: 'online', latency: '12ms' },
        { name: 'Bridge MT4', status: 'online', latency: '24ms' },
        { name: 'WebSocket', status: 'online', latency: '8ms' },
        { name: 'Base de Datos', status: 'online', latency: '4ms' },
        { name: 'CDN', status: 'online', latency: '32ms' },
    ];

    const getLogStyle = (type) => {
        switch (type) {
            case 'success': return 'text-[#0ecb81]';
            case 'warning': return 'text-[#fcd535]';
            case 'error': return 'text-[#f6465d]';
            default: return 'text-slate-400';
        }
    };

    const getLogIcon = (type) => {
        switch (type) {
            case 'success': return <CheckCircle2 size={12} className="text-[#0ecb81]" />;
            case 'warning': return <AlertTriangle size={12} className="text-[#fcd535]" />;
            case 'error': return <AlertTriangle size={12} className="text-[#f6465d]" />;
            default: return <Activity size={12} className="text-[#3b82f6]" />;
        }
    };

    return (
        <div className="p-6 lg:p-10 space-y-6 bg-[#0B0E11] min-h-full">
            {/* Actions Bar */}
            <div className="flex items-center justify-end gap-3">
                <button className="px-4 py-2.5 bg-black/40 border border-white/5 rounded-xl text-[10px] font-bold text-slate-400 hover:text-white uppercase tracking-widest transition-all flex items-center gap-2">
                    <RefreshCw size={12} /> Actualizar
                </button>
                <button className="px-4 py-2.5 bg-[#3b82f6] border border-white/10 rounded-xl text-[10px] font-bold text-white uppercase tracking-widest hover:bg-[#2563eb] transition-all shadow-lg">
                    Exportar Logs
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {systemStats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-[#181A20] border border-white/5 p-5 rounded-2xl group hover:border-white/10 transition-all shadow-xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-20" style={{ background: stat.color }} />
                        <div className="flex items-start justify-between mb-3 relative z-10">
                            <div className="w-10 h-10 rounded-xl bg-black/40 flex items-center justify-center border border-white/5" style={{ color: stat.color }}>
                                <stat.icon size={20} strokeWidth={2} />
                            </div>
                            <span className="text-[9px] font-bold text-[#0ecb81] bg-[#0ecb81]/10 px-2 py-0.5 rounded border border-[#0ecb81]/20">
                                {stat.trend}
                            </span>
                        </div>
                        <div className="relative z-10">
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">{stat.label}</span>
                            <span className="text-xl font-bold text-[#eaecef] tabular-nums tracking-tight">{stat.value}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Event Log */}
                <div className="lg:col-span-8">
                    <div className="bg-[#181A20] border border-white/5 rounded-2xl overflow-hidden shadow-xl h-full flex flex-col">
                        <div className="p-5 border-b border-white/5 bg-[#1e2329]/50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Terminal size={16} className="text-[#fcd535]" />
                                <h3 className="text-xs font-bold text-[#eaecef] uppercase tracking-wider">Registro de Eventos</h3>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0ecb81]/10 border border-[#0ecb81]/20 rounded-lg">
                                <div className="w-1.5 h-1.5 bg-[#0ecb81] rounded-full animate-pulse" />
                                <span className="text-[9px] font-bold text-[#0ecb81] uppercase tracking-widest">En Vivo</span>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-5 space-y-3 custom-scrollbar bg-black/20">
                            <AnimatePresence>
                                {logs.map((log) => (
                                    <motion.div
                                        key={log.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="flex items-start gap-4 p-3 bg-[#181A20] rounded-xl border border-white/5 hover:border-white/10 transition-all"
                                    >
                                        <div className="mt-0.5">{getLogIcon(log.type)}</div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm font-medium ${getLogStyle(log.type)}`}>{log.event}</p>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-[9px] font-mono text-slate-600">{log.time}</span>
                                                <span className="text-[9px] font-bold text-slate-700 uppercase">Nodo: {log.node}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Resource Usage */}
                    <div className="bg-[#181A20] border border-white/5 rounded-2xl p-6 shadow-xl">
                        <h3 className="text-xs font-bold text-[#eaecef] uppercase tracking-wider mb-5 flex items-center gap-2">
                            <Cpu size={14} className="text-[#3b82f6]" /> Uso de Recursos
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            {infrastructure.map((item, i) => (
                                <ProgressRing
                                    key={i}
                                    value={item.value}
                                    label={item.label}
                                    color={item.value > 70 ? '#f6465d' : item.value > 50 ? '#fcd535' : '#0ecb81'}
                                    size={70}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Services Status */}
                    <div className="bg-[#181A20] border border-white/5 rounded-2xl p-6 shadow-xl">
                        <h3 className="text-xs font-bold text-[#eaecef] uppercase tracking-wider mb-5 flex items-center gap-2">
                            <Server size={14} className="text-[#0ecb81]" /> Estado de Servicios
                        </h3>
                        <div className="space-y-3">
                            {services.map((service, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-black/20 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-[#0ecb81] shadow-[0_0_6px_#0ecb81]" />
                                        <span className="text-xs font-bold text-[#eaecef]">{service.name}</span>
                                    </div>
                                    <span className="text-[10px] font-mono text-slate-500">{service.latency}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Security Status */}
                    <div className="bg-gradient-to-br from-[#0ecb81]/10 to-[#3b82f6]/10 border border-[#0ecb81]/20 rounded-2xl p-6 text-center">
                        <div className="w-12 h-12 bg-[#0ecb81]/20 rounded-xl flex items-center justify-center mx-auto mb-3 text-[#0ecb81] border border-[#0ecb81]/30">
                            <ShieldCheck size={24} />
                        </div>
                        <h4 className="text-sm font-bold text-[#eaecef] uppercase tracking-wider mb-1">Sistema Seguro</h4>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Todas las verificaciones pasadas</p>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.1); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(59, 130, 246, 0.3); }
            `}} />
        </div>
    );
};

export default SystemMetrics;
