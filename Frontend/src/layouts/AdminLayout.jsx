import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../stores/authStore';
import {
    LogOut, ChevronRight, Menu, X, Activity, BarChart3, Radio, Cpu, Smartphone,
    CreditCard, ShieldCheck, PieChart, Globe2, LayoutDashboard, Users, Zap, MessageSquare, Settings
} from 'lucide-react';

const SidebarItem = ({ to, icon: Icon, label, collapsed, status }) => (
    <NavLink
        to={to}
        end={to === '/admin'}
        className={({ isActive }) => `
            flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative
            ${isActive
                ? 'bg-blue-600/10 text-blue-500 border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.1)]'
                : 'text-slate-500 hover:bg-white/[0.03] hover:text-slate-200 border border-transparent'
            }
        `}
    >
        {({ isActive }) => (
            <>
                <Icon size={18} className={`shrink-0 transition-transform duration-500 ${collapsed ? '' : 'group-hover:scale-110'} ${isActive ? 'text-blue-500' : ''}`} />
                {!collapsed && (
                    <div className="flex-1 flex items-center justify-between min-w-0">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap truncate italic">
                            {label}
                        </span>
                        {status && (
                            <span className="text-[7px] font-black text-slate-700 uppercase tracking-widest border border-white/5 px-1.5 py-0.5 rounded leading-none group-hover:border-blue-500/20 group-hover:text-blue-500/50 transition-colors">
                                {status}
                            </span>
                        )}
                    </div>
                )}
                {isActive && !collapsed && (
                    <motion.div
                        layoutId="navIndicator"
                        className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] rounded-full"
                    />
                )}
            </>
        )}
    </NavLink>
);

const AdminLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [isSystemActive, setIsSystemActive] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [utcTime, setUtcTime] = useState(new Date().toUTCString().split(' ')[4]);
    const [sysLoad, setSysLoad] = useState(14);
    const [ping, setPing] = useState(24);
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, user } = useAuthStore();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    useEffect(() => {
        const timer = setInterval(() => setUtcTime(new Date().toUTCString().split(' ')[4]), 1000);
        const loadTimer = setInterval(() => {
            setSysLoad(prev => Math.max(12, Math.min(22, prev + (Math.random() > 0.5 ? 1 : -1))));
            setPing(prev => Math.max(18, Math.min(32, prev + (Math.random() > 0.5 ? 1 : -1))));
        }, 3000);
        return () => { clearInterval(timer); clearInterval(loadTimer); };
    }, []);

    const menuItems = [
        { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', status: 'SYS_01' },
        { to: '/admin/users', icon: Users, label: 'Usuarios', status: 'AUTH' },
        { to: '/admin/signals', icon: Zap, label: 'Señales', status: 'RELAY' },
        { to: '/admin/plans', icon: CreditCard, label: 'Planes', status: 'BILL' },
        { to: '/admin/support', icon: MessageSquare, label: 'Tickets', status: 'VIVO' },
        { to: '/admin/banners', icon: Smartphone, label: 'Alertas', status: 'PUSH' },
        { to: '/admin/settings', icon: Settings, label: 'Ajustes', status: 'CONF' },
    ];

    const getPageTitle = () => {
        const item = menuItems.find(item => item.to === location.pathname);
        return item ? item.label : 'Terminal Segura';
    };

    return (
        <div className="min-h-screen bg-[#0A0C10] text-[#eaecef] flex overflow-hidden font-sans selection:bg-[#fcd535]/30">
            {/* Sidebar Desktop */}
            <motion.aside
                initial={false}
                animate={{ width: collapsed ? 80 : 280 }}
                className="hidden lg:flex flex-col border-r border-white/5 bg-[#0D1117] relative z-50 overflow-hidden"
            >
                {/* Brand Identity */}
                <div className="p-8 h-24 flex items-center justify-between border-b border-white/[0.03]">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#3b82f6] rounded-xl shrink-0 flex items-center justify-center shadow-[0_10px_25px_rgba(59,130,246,0.3)] border border-white/10 group">
                            <BarChart3 className="text-white group-hover:rotate-90 transition-transform duration-500" size={24} />
                        </div>
                        {!collapsed && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="leading-none">
                                <span className="text-xl font-bold text-white uppercase tracking-tight italic">Senzacional<span className="text-[#3b82f6] not-italic">.</span></span>
                                <div className="flex items-center gap-2 mt-1.5 overflow-hidden">
                                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest block">ADMIN</span>
                                    <span className="text-[8px] font-mono text-[#3b82f6]/40 uppercase tracking-widest border border-[#3b82f6]/10 px-1 rounded leading-none font-bold">v4.2.Alpha</span>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Secure Navigation Rail */}
                <nav className="flex-1 px-4 space-y-1.5 mt-8 overflow-y-auto custom-scrollbar">
                    {menuItems.map((item) => (
                        <SidebarItem key={item.to} {...item} collapsed={collapsed} />
                    ))}
                </nav>

                {/* Administrative Footprint */}
                <div className="p-6 border-t border-white/5 bg-black/40">
                    <div className={`flex items-center gap-4 ${collapsed ? 'justify-center' : ''}`}>
                        <div className="w-12 h-12 rounded-xl bg-[#181A20] border border-white/5 flex items-center justify-center text-[#3b82f6] font-mono font-bold shadow-inner border border-white/10">
                            {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'AD'}
                        </div>
                        {!collapsed && (
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-white truncate uppercase tracking-widest leading-none">{user?.name || 'Admin Autorizado'}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] animate-pulse" />
                                    <p className="text-[9px] font-bold text-slate-700 uppercase tracking-widest leading-none">Sesión Activa</p>
                                </div>
                            </div>
                        )}
                        {!collapsed && (
                            <button onClick={handleLogout} className="p-3 text-slate-700 hover:text-[#f6465d] transition-colors bg-white/[0.02] rounded-xl border border-white/5">
                                <LogOut size={18} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Command Rail Toggle */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="absolute -right-0 top-1/2 -translate-y-1/2 w-4 h-16 bg-blue-600/5 hover:bg-blue-600/10 border-l border-y border-blue-500/10 rounded-l-2xl flex items-center justify-center transition-all group z-[60]"
                >
                    <ChevronRight size={12} className={`transition-transform duration-700 text-blue-500/50 group-hover:text-blue-500 ${collapsed ? '' : 'rotate-180'}`} />
                </button>
            </motion.aside>

            {/* Matrix Viewport */}
            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-[#0A0C10] relative">

                {/* Technical Overhead Header */}
                <header className="h-24 shrink-0 border-b border-white/5 px-8 lg:px-12 flex items-center justify-between sticky top-0 bg-[#0A0C10]/95 backdrop-blur-3xl z-40">
                    <div className="flex items-center gap-10">
                        <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-3 bg-white/5 rounded-xl border border-white/10 text-slate-400"><Menu size={24} /></button>

                        <div className="flex items-center gap-8">
                            <div>
                                <h1 className="text-2xl font-bold text-[#eaecef] uppercase tracking-tight italic leading-none">{getPageTitle()}</h1>
                                <div className="flex items-center gap-6 mt-3">
                                    <div className="flex items-center gap-2.5">
                                        <Radio size={12} className="text-[#3b82f6] animate-pulse" />
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Estado Nodo: <span className="text-[#3b82f6]">NOMINAL</span></span>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <Activity size={12} className="text-slate-700" />
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Latencia Red: <span className="text-[#3b82f6] font-mono italic">{ping}ms</span></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-10">
                        {/* Live Load Monitor */}
                        <div className="hidden xl:flex flex-col items-end gap-3 border-r border-white/5 pr-10">
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest leading-none">Carga del Núcleo</span>
                                <span className="text-xs font-mono font-bold text-[#3b82f6] leading-none">{sysLoad}%</span>
                            </div>
                            <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden">
                                <motion.div animate={{ width: `${sysLoad}%` }} className="h-full bg-[#3b82f6] shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                            </div>
                        </div>

                        {/* Universal Synchronized Time */}
                        <div className="hidden md:flex flex-col items-end">
                            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest leading-none mb-2 italic">Sincronización (UTC)</span>
                            <span className="text-2xl font-bold text-[#eaecef] font-mono tracking-tighter tabular-nums leading-none">{utcTime}</span>
                        </div>

                        {/* Cluster Master Gateway */}
                        <div className="flex items-center gap-5 px-6 py-4 bg-[#181A20] border border-white/5 rounded-2xl shadow-inner group">
                            <div className="flex items-center gap-3 border-r border-white/10 pr-5">
                                <div className="w-2 h-2 rounded-full bg-[#3b82f6] animate-pulse absolute" />
                                <div className="w-2 h-2 rounded-full bg-[#3b82f6]" />
                                <span className="text-[11px] font-bold text-[#3b82f6] uppercase tracking-widest leading-none">Clúster 01</span>
                            </div>
                            <button
                                onClick={() => setIsSystemActive(!isSystemActive)}
                                className={`w-14 h-7 rounded-full relative transition-all duration-700 p-1 flex items-center ${isSystemActive ? 'bg-[#3b82f6] shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'bg-slate-800'}`}
                            >
                                <motion.div
                                    animate={{ x: isSystemActive ? 28 : 0 }}
                                    className="w-5 h-5 bg-white rounded-full shadow-2xl"
                                />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Shell Port */}
                <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#0A0C10] scroll-smooth">
                    <Outlet />
                </div>
            </main>

            {/* Mobile Navigation Drawer */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <div className="fixed inset-0 z-[100] lg:hidden">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="absolute top-0 left-0 bottom-0 w-80 bg-[#0D1117] border-r border-white/5 flex flex-col"
                        >
                            <div className="p-8 h-24 flex items-center justify-between border-b border-white/[0.03]">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-[#3b82f6] rounded-xl flex items-center justify-center border border-white/10">
                                        <BarChart3 className="text-white" size={20} />
                                    </div>
                                    <span className="text-lg font-bold text-white uppercase tracking-tight italic">Senzacional<span className="text-[#3b82f6] not-italic">.</span></span>
                                </div>
                                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-500 hover:text-white"><X size={24} /></button>
                            </div>

                            <nav className="flex-1 p-6 space-y-2">
                                {menuItems.map((item) => (
                                    <NavLink
                                        key={item.to}
                                        to={item.to}
                                        end={item.to === '/admin'}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={({ isActive }) => `
                                            flex items-center gap-4 px-4 py-4 rounded-2xl transition-all
                                            ${isActive ? 'bg-blue-600/10 text-blue-500 border border-blue-500/20' : 'text-slate-500 hover:text-slate-200'}
                                        `}
                                    >
                                        <item.icon size={20} />
                                        <span className="text-[11px] font-black uppercase tracking-[0.2em] italic">{item.label}</span>
                                    </NavLink>
                                ))}
                            </nav>

                            <div className="p-6 border-t border-white/5">
                                <button onClick={handleLogout} className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl bg-rose-500/5 text-rose-500 border border-rose-500/10 font-black uppercase tracking-widest text-[10px]">
                                    <LogOut size={20} /> Cerrar Terminal
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

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

export default AdminLayout;
