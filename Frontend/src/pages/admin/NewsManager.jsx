import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Newspaper, Send, Search, Eye, Trash2, Clock, Zap,
    Activity, Globe, Shield, Signal, Smartphone, Terminal,
    ChevronDown, XCircle, Users, CheckCircle2, Bell, Calendar
} from 'lucide-react';
import { toast } from '../../stores/toastStore';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { API_URL } from '../../config/api';

// Phone Mockup Preview
const PhoneMockup = ({ announcement }) => (
    <div className="relative w-[280px] h-[560px] bg-slate-900 rounded-[2.5rem] border-[8px] border-slate-800 shadow-2xl overflow-hidden">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-slate-800 rounded-b-2xl z-30" />

        {/* Status Bar */}
        <div className="absolute top-2 inset-x-6 flex justify-between items-center z-20 px-2">
            <span className="text-[9px] font-mono font-bold text-white/40">14:42</span>
            <div className="flex gap-1 items-end h-2">
                <div className="w-0.5 h-1 bg-white/40 rounded-full" />
                <div className="w-0.5 h-1.5 bg-white/40 rounded-full" />
                <div className="w-0.5 h-2 bg-[#3b82f6] rounded-full" />
            </div>
        </div>

        {/* Screen Content */}
        <div className="absolute inset-1 bg-[#0B0E11] rounded-[2rem] p-5 pt-12 overflow-hidden">
            <div className="flex items-center justify-between mb-6">
                <div className="w-8 h-8 rounded-lg bg-[#3b82f6]/10 border border-[#3b82f6]/20 flex items-center justify-center">
                    <Signal size={14} className="text-[#3b82f6]" />
                </div>
                <div className="px-2 py-0.5 bg-black/40 border border-white/5 rounded-full text-[7px] font-bold text-slate-500 uppercase">
                    Conectado
                </div>
            </div>

            <div className="space-y-4">
                <div className="h-32 bg-gradient-to-br from-[#3b82f6]/20 to-transparent rounded-xl border border-[#3b82f6]/10 flex items-center justify-center relative">
                    <Newspaper size={28} className="text-[#3b82f6]" />
                    <div className="absolute bottom-3 left-3 flex gap-1">
                        <div className="w-1.5 h-1.5 bg-[#3b82f6] rounded-full animate-pulse" />
                        <div className="w-1.5 h-1.5 bg-[#3b82f6]/20 rounded-full" />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 bg-[#3b82f6] text-white rounded text-[6px] font-bold uppercase">
                            {announcement.category || 'NOTICIA'}
                        </span>
                    </div>
                    <h5 className="text-[12px] font-bold text-[#eaecef] leading-tight">
                        {announcement.title || 'Título de la noticia...'}
                    </h5>
                    <div className="p-3 bg-white/[0.02] border border-white/5 rounded-lg">
                        <p className="text-[9px] text-slate-400 leading-relaxed line-clamp-3">
                            {announcement.content || 'El contenido de la noticia aparecerá aquí cuando escribas...'}
                        </p>
                    </div>
                </div>

                <button className="w-full py-3 bg-[#3b82f6] text-white rounded-lg text-[9px] font-bold uppercase tracking-wider">
                    Ver Más
                </button>
            </div>

            {/* Home Indicator */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-20 h-1 bg-slate-800 rounded-full" />
        </div>
    </div>
);

const NewsManager = () => {
    const location = useLocation();
    const [formData, setFormData] = useState({
        id: null,
        title: '',
        content: '',
        category: 'Mercado',
        type: 'Normal',
        audience: 'Todos',
        scheduledFor: '',
        expiresAt: ''
    });
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);

    // API State
    const [newsHistory, setNewsHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    const [stats, setStats] = useState([
        { label: 'Enviadas Hoy', value: '0', icon: Send, color: '#3b82f6' },
        { label: 'Usuarios Alcanzados', value: '0', icon: Users, color: '#0ecb81' },
        { label: 'Tasa Apertura', value: '0%', icon: Eye, color: '#8b5cf6' },
        { label: 'Programadas', value: '0', icon: Calendar, color: '#fcd535' },
    ]);

    const fetchNews = async () => {
        try {
            const response = await fetch(`${API_URL}/api/news`);
            if (response.ok) {
                const data = await response.json();
                setNewsHistory(data);

                // Update basic stats based on data
                const today = new Date().toDateString();
                const sentToday = data.filter(n => new Date(n.sentAt).toDateString() === today).length;
                const scheduledCount = data.filter(n => n.status === 'Programado').length;

                setStats(prev => [
                    { ...prev[0], value: sentToday.toString() },
                    { ...prev[1], value: (data.length * 150).toLocaleString() }, // Mock reach
                    prev[2],
                    { ...prev[3], value: scheduledCount.toString() }
                ]);
            }
        } catch (error) {
            console.error("Error fetching news:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();

        const params = new URLSearchParams(location.search);
        if (params.get('action') === 'create') {
            const composer = document.getElementById('news-composer');
            if (composer) {
                composer.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [location.search]);

    const handleAuthorize = () => {
        if (!formData.title || !formData.content) return;
        setIsConfirmModalOpen(true);
    };

    const handleEdit = (news) => {
        setFormData({
            id: news.id,
            title: news.title,
            content: news.content,
            category: news.category,
            type: news.type,
            audience: news.audience,
            scheduledFor: news.scheduledFor ? new Date(news.scheduledFor).toISOString().slice(0, 16) : '',
            expiresAt: news.expiresAt ? new Date(news.expiresAt).toISOString().slice(0, 16) : ''
        });
        const composer = document.getElementById('news-composer');
        if (composer) composer.scrollIntoView({ behavior: 'smooth' });
    };

    const handleDeleteClick = (id) => {
        setDeleteConfirmId(id);
    };

    const handleConfirmDelete = async () => {
        if (!deleteConfirmId) return;
        try {
            const response = await fetch(`${API_URL}/api/news/${deleteConfirmId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                setNewsHistory(prev => prev.filter(n => n.id !== deleteConfirmId));
                toast.success("Noticia eliminada");
            }
        } catch (err) {
            console.error(err);
            toast.error("Error al eliminar");
        }
        setDeleteConfirmId(null);
    };

    const confirmEmission = async () => {
        try {
            const isEdit = !!formData.id;
            const newNews = {
                title: formData.title,
                content: formData.content,
                category: formData.category,
                type: formData.type,
                audience: formData.audience,
                sentAt: new Date().toISOString(),
                views: 0,
                status: formData.scheduledFor ? 'Programado' : 'Enviado',
                scheduledFor: formData.scheduledFor ? new Date(formData.scheduledFor).toISOString() : null,
                expiresAt: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : null
            };

            if (formData.id) {
                newNews.id = formData.id;
            }

            const url = isEdit ? `${API_URL}/api/news/${formData.id}` : `${API_URL}/api/news`;
            const method = isEdit ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newNews)
            });

            if (response.ok) {
                setIsConfirmModalOpen(false);
                setFormData({ id: null, title: '', content: '', category: 'Mercado', type: 'Normal', audience: 'Todos', scheduledFor: '', expiresAt: '' });
                toast.success(isEdit ? "Noticia actualizada correctamente" : "Noticia enviada correctamente");
                fetchNews();
            } else {
                toast.error("Error al guardar la noticia");
            }
        } catch (err) {
            console.error(err);
            toast.error("Error de conexión");
        }
    };

    return (
        <div className="p-6 lg:p-10 space-y-6 bg-[#0B0E11] min-h-full">

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-[#181A20] border border-white/5 p-5 rounded-2xl group hover:border-white/10 transition-all shadow-xl relative overflow-hidden"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 rounded-xl bg-black/40 flex items-center justify-center border border-white/5" style={{ color: stat.color }}>
                                <stat.icon size={20} strokeWidth={2} />
                            </div>
                        </div>
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">{stat.label}</span>
                        <span className="text-xl font-bold text-[#eaecef] tabular-nums tracking-tight">{stat.value}</span>
                    </motion.div>
                ))}
            </div>

            {/* Main Content */}
            <div className="flex flex-col xl:flex-row gap-8">
                {/* Composer */}
                <div className="flex-1 space-y-6" id="news-composer">
                    <div className="bg-[#181A20] border border-white/5 rounded-2xl p-6 shadow-xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xs font-bold text-[#eaecef] uppercase tracking-wider flex items-center gap-2">
                                <Terminal size={14} className="text-[#3b82f6]" /> {formData.id ? 'Editar Noticia' : 'Compositor'}
                            </h3>
                            {formData.id && (
                                <button
                                    onClick={() => setFormData({ id: null, title: '', content: '', category: 'Mercado', type: 'Normal', audience: 'Todos', scheduledFor: '', expiresAt: '' })}
                                    className="text-[10px] text-red-500 hover:text-red-400 font-bold uppercase tracking-widest"
                                >
                                    Cancelar Edición
                                </button>
                            )}
                        </div>

                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest ml-1">Título</label>
                                <input
                                    type="text"
                                    className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm font-bold text-[#eaecef] focus:border-[#3b82f6]/40 outline-none transition-all placeholder:text-slate-700"
                                    placeholder="Título de la noticia..."
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest ml-1">Contenido</label>
                                <textarea
                                    className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-4 text-sm text-slate-300 focus:border-[#3b82f6]/40 outline-none transition-all min-h-[120px] resize-none placeholder:text-slate-700"
                                    placeholder="Escribe el contenido de la noticia..."
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest ml-1">Categoría</label>
                                    <select
                                        className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs font-bold text-[#eaecef] focus:border-[#3b82f6]/40 outline-none transition-all appearance-none cursor-pointer"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option>Mercado</option>
                                        <option>Sistema</option>
                                        <option>Señales</option>
                                        <option>Promoción</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest ml-1">Prioridad</label>
                                    <select
                                        className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs font-bold text-[#eaecef] focus:border-[#3b82f6]/40 outline-none transition-all appearance-none cursor-pointer"
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    >
                                        <option value="Normal">Normal</option>
                                        <option value="Alta">Alta</option>
                                        <option value="Urgente">Urgente</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest ml-1">Audiencia</label>
                                    <select
                                        className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs font-bold text-[#eaecef] focus:border-[#3b82f6]/40 outline-none transition-all appearance-none cursor-pointer"
                                        value={formData.audience}
                                        onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                                    >
                                        <option>Todos</option>
                                        <option>Premium</option>
                                        <option>Basic</option>
                                    </select>
                                </div>
                            </div>

                            {/* Scheduling Section */}
                            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1">
                                        <Calendar size={10} /> Programar (Opcional)
                                    </label>
                                    <input
                                        type="datetime-local"
                                        className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs font-bold text-slate-300 focus:border-[#3b82f6]/40 outline-none transition-all"
                                        value={formData.scheduledFor}
                                        onChange={(e) => setFormData({ ...formData, scheduledFor: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1">
                                        <Clock size={10} /> Expiración (Opcional)
                                    </label>
                                    <input
                                        type="datetime-local"
                                        className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs font-bold text-slate-300 focus:border-[#3b82f6]/40 outline-none transition-all"
                                        value={formData.expiresAt}
                                        onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleAuthorize}
                                disabled={!formData.title || !formData.content}
                                className={`w-full text-white py-4 rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg transition-all flex items-center justify-center gap-3 border border-white/10 ${formData.id ? 'bg-[#fcd535] text-black hover:bg-[#e0bd2f]' : 'bg-[#3b82f6] hover:bg-[#2563eb] disabled:opacity-50 disabled:cursor-not-allowed'}`}
                            >
                                <Send size={16} /> {formData.id ? 'Actualizar Noticia' : 'Enviar Noticia'}
                            </button>
                        </div>
                    </div>

                    {/* News History */}
                    <div className="bg-[#181A20] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                        <div className="p-5 border-b border-white/5 bg-[#1e2329]/50 flex items-center justify-between">
                            <h3 className="text-xs font-bold text-[#eaecef] uppercase tracking-wider flex items-center gap-2">
                                <Clock size={14} className="text-slate-500" /> Historial Reciente
                            </h3>
                        </div>
                        <div className="divide-y divide-white/[0.03]">
                            {loading ? (
                                <div className="p-8 text-center text-slate-500 text-xs italic">Cargando noticias...</div>
                            ) : newsHistory.length > 0 ? (
                                newsHistory.map((news) => (
                                    <div key={news.id} className="p-4 hover:bg-white/[0.01] transition-all flex items-center justify-between gap-4 group">
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-bold text-[#eaecef] truncate">{news.title}</h4>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-[9px] font-bold text-slate-600">{news.category}</span>
                                                <span className="text-[9px] text-slate-700">•</span>
                                                <span className="text-[9px] font-mono text-slate-600">
                                                    {new Date(news.sentAt).toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleEdit(news)} className="p-2 text-slate-500 hover:text-[#3b82f6] hover:bg-[#3b82f6]/10 rounded-lg transition-all"><Terminal size={14} /></button>
                                                <button onClick={() => handleDeleteClick(news.id)} className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"><Trash2 size={14} /></button>
                                            </div>

                                            <span className={`text-[9px] font-bold uppercase px-2 py-1 rounded border ${news.status === 'Enviado'
                                                ? 'text-[#0ecb81] bg-[#0ecb81]/10 border-[#0ecb81]/20'
                                                : news.status === 'Programado' ? 'text-[#3b82f6] bg-[#3b82f6]/10 border-[#3b82f6]/20' : 'text-[#fcd535] bg-[#fcd535]/10 border-[#fcd535]/20'
                                                }`}>
                                                {news.status}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-slate-500 text-xs italic">No hay noticias recientes</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Phone Preview */}
                <div className="flex flex-col items-center">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-px w-8 bg-white/10" />
                        <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Vista Previa</span>
                        <div className="h-px w-8 bg-white/10" />
                    </div>
                    <PhoneMockup announcement={formData} />
                    <p className="text-[8px] font-bold text-slate-700 uppercase tracking-widest mt-6">Actualización en tiempo real</p>
                </div>
            </div>

            {/* Confirmation Modal */}
            <AnimatePresence>
                {isConfirmModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="w-full max-w-md bg-[#181A20] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
                        >
                            <div className="p-6 border-b border-white/5 bg-[#1e2329]/50 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#3b82f6]/10 border border-[#3b82f6]/20 rounded-xl flex items-center justify-center text-[#3b82f6]">
                                        <Bell size={18} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-[#eaecef] uppercase tracking-tight">{formData.id ? 'Confirmar Actualización' : 'Confirmar Envío'}</h3>
                                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Notificación Push</p>
                                    </div>
                                </div>
                                <button onClick={() => setIsConfirmModalOpen(false)} className="p-2 text-slate-500 hover:text-white transition-colors">
                                    <XCircle size={18} />
                                </button>
                            </div>

                            <div className="p-6 space-y-4">
                                <div className="bg-black/40 border border-white/5 rounded-xl p-4 space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[9px] font-bold text-slate-500 uppercase">Título</span>
                                        <span className="text-xs font-bold text-white">{formData.title}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[9px] font-bold text-slate-500 uppercase">Audiencia</span>
                                        <span className="text-xs font-bold text-[#3b82f6]">{formData.audience}</span>
                                    </div>
                                    {formData.scheduledFor && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-[9px] font-bold text-slate-500 uppercase">Programada para</span>
                                            <span className="text-xs font-bold text-[#fcd535]">{new Date(formData.scheduledFor).toLocaleString()}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-[#fcd535]/5 border border-[#fcd535]/10 rounded-xl">
                                    <Shield size={14} className="text-[#fcd535]" />
                                    <p className="text-[9px] font-bold text-[#fcd535]/80 uppercase tracking-wider">
                                        {formData.id ? 'Esta acción actualizará la noticia existente.' : 'Se enviará a todos los usuarios de la audiencia seleccionada.'}
                                    </p>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        onClick={() => setIsConfirmModalOpen(false)}
                                        className="flex-1 py-3 bg-black/20 hover:bg-white/5 text-slate-500 hover:text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border border-white/5"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={confirmEmission}
                                        className="flex-1 py-3 bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all shadow-lg border border-white/10"
                                    >
                                        {formData.id ? 'Actualizar' : 'Enviar Ahora'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={!!deleteConfirmId}
                onClose={() => setDeleteConfirmId(null)}
                onConfirm={handleConfirmDelete}
                title="¿Eliminar Noticia?"
                message="Esta acción no se puede deshacer. La noticia dejará de ser visible para los usuarios."
                confirmText="Eliminar"
                isDestructive={true}
            />
        </div>
    );
};

export default NewsManager;
