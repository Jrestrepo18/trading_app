import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, UserPlus, ShieldCheck, CheckCircle2,
    Clock, Ban, Zap, MoreHorizontal, Mail, Filter, Globe,
    Terminal, Fingerprint, UserCheck, Shield, Users, TrendingUp,
    Eye, Edit3, Trash2, XCircle, Download, ChevronDown, Loader2
} from 'lucide-react';
import { API_URL } from '../../config/api';

const UserManagement = () => {
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [createError, setCreateError] = useState('');
    const [selectedRole, setSelectedRole] = useState('user');
    const [statusFilter, setStatusFilter] = useState('TODOS');
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState([
        { label: 'Total Usuarios', value: '0', subValue: 'Cargando...', icon: Users, color: '#3b82f6' },
        { label: 'Activos Hoy', value: '0', subValue: 'Cargando...', icon: CheckCircle2, color: '#0ecb81' },
        { label: 'Nuevos (7d)', value: '0', subValue: 'Cargando...', icon: UserPlus, color: '#8b5cf6' },
        { label: 'Tasa Retención', value: '0%', subValue: 'Cargando...', icon: TrendingUp, color: '#fcd535' },
    ]);

    // Fetch users and stats on mount
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Fetch users
                const usersRes = await fetch(`${API_URL}/api/users`);
                const usersData = await usersRes.json();
                if (usersData.success) {
                    setUsers(usersData.users.map(u => ({
                        id: u.id.substring(0, 8).toUpperCase(),
                        fullId: u.id,
                        name: u.name,
                        email: u.email,
                        status: u.isEmailVerified ? 'VERIFICADO' : 'PENDIENTE',
                        lastAccess: new Date(u.createdAt).toLocaleString('es-ES'),
                        expiry: u.expiresAt ? new Date(u.expiresAt).toISOString().split('T')[0] : 'N/A',
                        plan: u.plan === 'free' ? 'Basic' : 'Enterprise',
                        region: 'LATAM',
                        trades: 0,
                        role: u.role
                    })));
                }

                // Fetch stats
                const statsRes = await fetch(`${API_URL}/api/users/stats`);
                const statsData = await statsRes.json();
                if (statsData.success) {
                    setStats([
                        { label: 'Total Usuarios', value: statsData.stats.totalUsers.toLocaleString(), subValue: 'Registrados', icon: Users, color: '#3b82f6' },
                        { label: 'Activos Hoy', value: statsData.stats.activeToday.toLocaleString(), subValue: 'Verificados', icon: CheckCircle2, color: '#0ecb81' },
                        { label: 'Nuevos (7d)', value: statsData.stats.newLast7Days.toLocaleString(), subValue: 'Última semana', icon: UserPlus, color: '#8b5cf6' },
                        { label: 'Tasa Retención', value: statsData.stats.retentionRate, subValue: 'Verificación', icon: TrendingUp, color: '#fcd535' },
                    ]);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();

        // Check for action=create in URL
        const params = new URLSearchParams(location.search);
        if (params.get('action') === 'create') {
            setIsCreateModalOpen(true);
        }
    }, [location.search]);

    const handleCreateUser = async (e) => {
        e.preventDefault();
        setIsCreating(true);
        setCreateError('');

        const formData = new FormData(e.target);
        const userData = {
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password'),
            birthDate: selectedRole === 'user' ? formData.get('birthDate') : '2000-01-01',
            role: formData.get('role')
        };

        try {
            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al crear usuario');
            }

            // Recargar lista de usuarios
            const usersRes = await fetch(`${API_URL}/api/users`);
            const usersData = await usersRes.json();
            if (usersData.success) {
                setUsers(usersData.users.map(u => ({
                    id: u.id.substring(0, 8).toUpperCase(),
                    fullId: u.id,
                    name: u.name,
                    email: u.email,
                    status: u.isEmailVerified ? 'VERIFICADO' : 'PENDIENTE',
                    lastAccess: new Date(u.createdAt).toLocaleString('es-ES'),
                    expiry: u.expiresAt ? new Date(u.expiresAt).toISOString().split('T')[0] : 'N/A',
                    plan: u.plan === 'free' ? 'Basic' : 'Enterprise',
                    region: 'LATAM',
                    trades: 0,
                    role: u.role
                })));
            }

            // Recargar estadísticas
            const statsRes = await fetch(`${API_URL}/api/users/stats`);
            const statsData = await statsRes.json();
            if (statsData.success) {
                setStats([
                    { label: 'Total Usuarios', value: statsData.stats.totalUsers.toLocaleString(), subValue: 'Registrados', icon: Users, color: '#3b82f6' },
                    { label: 'Activos Hoy', value: statsData.stats.activeToday.toLocaleString(), subValue: 'Verificados', icon: CheckCircle2, color: '#0ecb81' },
                    { label: 'Nuevos (7d)', value: statsData.stats.newLast7Days.toLocaleString(), subValue: 'Última semana', icon: UserPlus, color: '#8b5cf6' },
                    { label: 'Tasa Retención', value: statsData.stats.retentionRate, subValue: 'Verificación', icon: TrendingUp, color: '#fcd535' },
                ]);
            }

            setIsCreateModalOpen(false);
            setSelectedRole('user');
            e.target.reset();
        } catch (error) {
            setCreateError(error.message);
        } finally {
            setIsCreating(false);
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.id.includes(searchQuery);
        const matchesStatus = statusFilter === 'TODOS' || user.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusStyle = (status) => {
        switch (status) {
            case 'VERIFICADO': return 'text-[#0ecb81] bg-[#0ecb81]/10 border-[#0ecb81]/20';
            case 'PENDIENTE': return 'text-[#fcd535] bg-[#fcd535]/10 border-[#fcd535]/20';
            case 'SUSPENDIDO': return 'text-[#f6465d] bg-[#f6465d]/10 border-[#f6465d]/20';
            default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
        }
    };

    return (
        <div className="p-6 lg:p-10 space-y-6 bg-[#0B0E11] min-h-full">
            {/* Actions Bar */}
            <div className="flex items-center justify-end gap-3">
                <button className="px-4 py-3 bg-black/40 border border-white/5 rounded-xl text-[10px] font-bold text-slate-400 hover:text-white uppercase tracking-widest transition-all flex items-center gap-2">
                    <Download size={14} /> Exportar
                </button>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="px-5 py-3 bg-[#3b82f6] border border-white/10 rounded-xl text-[10px] font-bold text-white uppercase tracking-widest hover:bg-[#2563eb] transition-all shadow-lg flex items-center gap-2"
                >
                    <UserPlus size={14} /> Crear Usuario
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
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
                        </div>
                        <div className="relative z-10">
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">{stat.label}</span>
                            <span className="text-xl font-bold text-[#eaecef] tabular-nums tracking-tight">{stat.value}</span>
                            <span className="text-[9px] font-bold text-slate-600 block mt-1">{stat.subValue}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center bg-[#181A20] p-4 rounded-2xl border border-white/5 shadow-xl">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, email o ID..."
                        className="w-full bg-black/40 border border-white/5 rounded-xl pl-12 pr-4 py-3 text-xs font-bold text-[#eaecef] outline-none focus:border-[#3b82f6]/40 transition-all placeholder:text-slate-700 uppercase tracking-wider"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3">
                    {['TODOS', 'VERIFICADO', 'PENDIENTE', 'SUSPENDIDO'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2.5 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all border ${statusFilter === status
                                ? 'bg-[#3b82f6]/10 text-[#3b82f6] border-[#3b82f6]/20'
                                : 'bg-black/20 text-slate-500 border-white/5 hover:text-slate-300'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-[#181A20] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className="bg-[#1e2329] border-b border-white/5 text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                                <th className="px-6 py-4 text-[#eaecef]">Usuario</th>
                                <th className="px-6 py-4">Plan</th>
                                <th className="px-6 py-4">Región</th>
                                <th className="px-6 py-4">Último Acceso</th>
                                <th className="px-6 py-4">Trades</th>
                                <th className="px-6 py-4">Estado</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03]">
                            <AnimatePresence mode='popLayout'>
                                {filteredUsers.map((user) => (
                                    <motion.tr
                                        layout
                                        key={user.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="group hover:bg-white/[0.01] transition-all"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-lg bg-[#3b82f6]/10 border border-[#3b82f6]/20 flex items-center justify-center text-[#3b82f6] text-xs font-bold">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <span className="block text-sm font-bold text-[#eaecef]">{user.name}</span>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className="text-[9px] font-mono text-slate-600">{user.id}</span>
                                                        <span className="text-[9px] text-slate-600">•</span>
                                                        <span className="text-[9px] text-[#3b82f6]/70">{user.email}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[9px] font-bold uppercase tracking-wider ${user.plan === 'Enterprise'
                                                ? 'bg-[#8b5cf6]/10 text-[#8b5cf6] border-[#8b5cf6]/20'
                                                : 'bg-black/40 text-slate-500 border-white/5'
                                                }`}>
                                                <Zap size={10} strokeWidth={2.5} />
                                                {user.plan}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Globe size={12} className="text-slate-600" />
                                                <span className="text-[10px] font-bold text-slate-400 uppercase">{user.region}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-[10px] font-mono text-slate-500">{user.lastAccess}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-bold text-[#eaecef] tabular-nums">{user.trades}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-[9px] font-bold uppercase px-2.5 py-1 rounded border ${getStatusStyle(user.status)}`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                <button className="w-7 h-7 flex items-center justify-center bg-[#3b82f6]/10 hover:bg-[#3b82f6] text-[#3b82f6] hover:text-white rounded-lg transition-all border border-[#3b82f6]/20">
                                                    <Eye size={12} />
                                                </button>
                                                <button className="w-7 h-7 flex items-center justify-center bg-[#fcd535]/10 hover:bg-[#fcd535] text-[#fcd535] hover:text-black rounded-lg transition-all border border-[#fcd535]/20">
                                                    <Edit3 size={12} />
                                                </button>
                                                <button className="w-7 h-7 flex items-center justify-center bg-[#f6465d]/5 hover:bg-[#f6465d] text-[#f6465d] hover:text-white rounded-lg transition-all border border-[#f6465d]/10">
                                                    <Ban size={12} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-white/5 bg-[#1e2329]/30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <ShieldCheck size={14} className="text-[#3b82f6]/50" />
                        <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">
                            {filteredUsers.length} usuarios encontrados
                        </span>
                    </div>
                    <div className="flex gap-2">
                        <button className="px-3 py-1.5 bg-black/40 border border-white/5 rounded-lg text-slate-500 hover:text-white transition-all text-xs font-bold">&lt;</button>
                        <button className="px-3 py-1.5 bg-[#3b82f6] text-white rounded-lg text-xs font-bold shadow-lg">1</button>
                        <button className="px-3 py-1.5 bg-black/40 border border-white/5 rounded-lg text-slate-500 hover:text-white transition-all text-xs font-bold">2</button>
                        <button className="px-3 py-1.5 bg-black/40 border border-white/5 rounded-lg text-slate-500 hover:text-white transition-all text-xs font-bold">&gt;</button>
                    </div>
                </div>
            </div>

            {/* Create User Modal */}
            <AnimatePresence>
                {isCreateModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="w-full max-w-lg bg-[#181A20] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
                        >
                            <div className="p-6 border-b border-white/5 bg-[#1e2329]/50 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-[#3b82f6]/10 border border-[#3b82f6]/20 rounded-xl flex items-center justify-center text-[#3b82f6]">
                                        <UserPlus size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-[#eaecef] uppercase tracking-tight">Nuevo Usuario</h3>
                                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Registro en el sistema</p>
                                    </div>
                                </div>
                                <button onClick={() => setIsCreateModalOpen(false)} className="p-2 text-slate-500 hover:text-white transition-colors">
                                    <XCircle size={18} />
                                </button>
                            </div>

                            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest ml-1">Nombre Completo *</label>
                                    <div className="relative">
                                        <UserCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700" size={16} />
                                        <input
                                            name="name"
                                            required
                                            type="text"
                                            placeholder="Carlos Mendoza"
                                            className="w-full bg-black/40 border border-white/5 rounded-xl pl-11 pr-4 py-3 text-xs font-bold text-[#eaecef] outline-none focus:border-[#3b82f6]/40 transition-all placeholder:text-slate-700"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest ml-1">Email *</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700" size={16} />
                                        <input
                                            name="email"
                                            required
                                            type="email"
                                            placeholder="usuario@email.com"
                                            className="w-full bg-black/40 border border-white/5 rounded-xl pl-11 pr-4 py-3 text-xs font-bold text-[#eaecef] outline-none focus:border-[#3b82f6]/40 transition-all placeholder:text-slate-700"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest ml-1">Contraseña *</label>
                                    <div className="relative">
                                        <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700" size={16} />
                                        <input
                                            name="password"
                                            required
                                            type="password"
                                            placeholder="Mínimo 6 caracteres"
                                            minLength={6}
                                            className="w-full bg-black/40 border border-white/5 rounded-xl pl-11 pr-4 py-3 text-xs font-bold text-[#eaecef] outline-none focus:border-[#3b82f6]/40 transition-all placeholder:text-slate-700"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest ml-1">Rol *</label>
                                    <div className="relative">
                                        <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700" size={16} />
                                        <select
                                            name="role"
                                            required
                                            value={selectedRole}
                                            onChange={(e) => setSelectedRole(e.target.value)}
                                            className="w-full bg-[#0D1117] border border-white/5 rounded-xl pl-11 pr-10 py-3 text-xs font-bold text-[#eaecef] outline-none focus:border-[#3b82f6]/40 transition-all appearance-none cursor-pointer"
                                            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23475569'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}
                                        >
                                            <option value="user" className="bg-[#0D1117] text-white">👤 Usuario</option>
                                            <option value="admin" className="bg-[#0D1117] text-white">🛡️ Administrador</option>
                                        </select>
                                    </div>
                                </div>

                                {selectedRole === 'user' && (
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest ml-1">Fecha Nacimiento *</label>
                                        <input
                                            name="birthDate"
                                            required
                                            type="date"
                                            className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs font-bold text-[#eaecef] outline-none focus:border-[#3b82f6]/40 transition-all [color-scheme:dark]"
                                        />
                                    </div>
                                )}

                                {createError && (
                                    <div className="p-3 bg-[#f6465d]/10 border border-[#f6465d]/20 rounded-xl text-[#f6465d] text-xs font-bold">
                                        {createError}
                                    </div>
                                )}

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsCreateModalOpen(false)}
                                        className="flex-1 py-3 bg-black/20 hover:bg-white/5 text-slate-500 hover:text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border border-white/5"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isCreating}
                                        className="flex-1 py-3 bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all shadow-lg border border-white/10 disabled:opacity-50"
                                    >
                                        {isCreating ? 'Creando...' : 'Crear Usuario'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UserManagement;
