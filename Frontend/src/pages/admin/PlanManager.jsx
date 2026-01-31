import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CreditCard, CheckCircle2, AlertTriangle, Plus, Pencil, Trash2,
    Save, X, Info, ShieldCheck, Zap, Globe2, Activity
} from 'lucide-react';
import { API_URL } from '../../config/api';

const PlanCard = ({ plan, onEdit, onDelete }) => (
    <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-[#181A20] border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden group hover:border-blue-500/30 transition-all shadow-2xl"
    >
        {/* Decorative background blur */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl opacity-50 group-hover:bg-blue-600/10 transition-colors" />

        <div className="flex justify-between items-start mb-8 relative z-10">
            <div>
                <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase">{plan.name}</h3>
                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em] mt-2 block italic">ID_CATALOG: {plan.id}</span>
            </div>
            <div className={`p-4 rounded-2xl bg-black/40 border border-white/5 text-center min-w-[100px]`}>
                <span className="block text-[8px] text-slate-600 uppercase font-black tracking-widest mb-1">Precio_Mensual</span>
                <span className="text-2xl font-mono font-black text-white italic">${plan.price}</span>
            </div>
        </div>

        <div className="space-y-4 mb-8 relative z-10">
            {plan.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                        <CheckCircle2 size={12} className="text-blue-500" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">{feature}</span>
                </div>
            ))}
        </div>

        <div className="flex gap-3 pt-6 border-t border-white/5 relative z-10">
            <button
                onClick={() => onEdit(plan)}
                className="flex-1 py-4 bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/5 transition-all flex items-center justify-center gap-2"
            >
                <Pencil size={14} /> Editar_Plan
            </button>
            <button
                onClick={() => onDelete(plan.id)}
                className="p-4 bg-rose-500/5 hover:bg-rose-500/10 text-rose-500 rounded-2xl border border-rose-500/10 transition-all"
            >
                <Trash2 size={16} />
            </button>
        </div>
    </motion.div>
);

const PlanManager = () => {
    const [plans, setPlans] = useState([]);
    const [editingPlan, setEditingPlan] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPlans = async () => {
        try {
            const response = await fetch(`${API_URL}/api/plans`);
            if (response.ok) {
                const data = await response.json();
                setPlans(data);
            }
        } catch (error) {
            console.error('Error fetching plans:', error);
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        fetchPlans();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const features = formData.get('features').split(',').map(f => f.trim()).filter(f => f);

        const planData = {
            id: editingPlan?.id || undefined, // undefined lets backend generate ID for new
            name: formData.get('name'),
            price: parseFloat(formData.get('price')),
            features: features,
            catalogId: formData.get('catalogId') || editingPlan?.catalogId || formData.get('name').toUpperCase().replace(' ', '_'),
            isActive: true
        };

        try {
            const url = isAdding
                ? `${API_URL}/api/plans`
                : `${API_URL}/api/plans/${editingPlan.id}`;
            const method = isAdding ? 'POST' : 'PUT';

            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(planData)
            });

            if (response.ok) {
                await fetchPlans();
                setIsAdding(false);
                setEditingPlan(null);
            } else {
                alert('Error al guardar el plan');
            }
        } catch (error) {
            console.error('Error saving plan:', error);
            alert('Error de conexión');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Seguro que deseas eliminar este plan?')) return;
        try {
            const response = await fetch(`${API_URL}/api/plans/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                setPlans(plans.filter(p => p.id !== id));
            }
        } catch (error) {
            console.error('Error deleting plan:', error);
        }
    };

    return (
        <div className="p-6 lg:p-12 space-y-10 bg-[#0A0C10] min-h-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-sm font-black text-slate-500 uppercase tracking-[0.4em] mb-3 flex items-center gap-3 italic">
                        <CreditCard size={18} className="text-blue-500" /> Catálogo_De_Membresías
                    </h2>
                    <p className="text-xs font-bold text-slate-600 uppercase tracking-widest leading-loose">Gestiona los niveles de acceso y monetización de la plataforma.</p>
                </div>
                <button
                    onClick={() => setIsAdding(true)}
                    className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_10px_25px_rgba(59,130,246,0.3)] transition-all flex items-center gap-3 active:scale-95"
                >
                    <Plus size={16} /> Crear_Nuevo_Plan
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                <AnimatePresence>
                    {plans.map(plan => (
                        <PlanCard
                            key={plan.id}
                            plan={plan}
                            onEdit={setEditingPlan}
                            onDelete={handleDelete}
                        />
                    ))}
                </AnimatePresence>
            </div>

            {/* Modal para Editar/Añadir */}
            <AnimatePresence>
                {(isAdding || editingPlan) && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
                        onClick={() => { setIsAdding(false); setEditingPlan(null); }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-[#0D1117] border border-white/10 rounded-[3rem] w-full max-w-xl overflow-hidden shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-10 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                                <span className="text-sm font-black text-white uppercase tracking-[0.3em] italic leading-none">
                                    {isAdding ? 'Configurar_Nueva_Membresía' : `Editando_Plan_${editingPlan.id}`}
                                </span>
                                <button onClick={() => { setIsAdding(false); setEditingPlan(null); }} className="p-3 text-slate-500 hover:text-white transition-colors bg-white/5 rounded-2xl border border-white/10"><X size={20} /></button>
                            </div>

                            <form onSubmit={handleSave} className="p-10 space-y-8">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic ml-2">Nombre_Público</label>
                                        <input
                                            type="text"
                                            name="name"
                                            defaultValue={editingPlan?.name || ''}
                                            placeholder="Ej: Professional"
                                            className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-700"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic ml-2">Precio_Senz ($)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            name="price"
                                            defaultValue={editingPlan?.price || ''}
                                            placeholder="99.00"
                                            className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-sm font-mono font-bold text-white outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-700"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic ml-2">Beneficios_Incluidos (Separados por coma)</label>
                                    <textarea
                                        name="features"
                                        rows={4}
                                        defaultValue={editingPlan?.features?.join(', ') || ''}
                                        className="w-full bg-black/40 border border-white/10 rounded-[2rem] px-6 py-5 text-xs font-bold text-slate-300 outline-none focus:border-blue-500/50 transition-all custom-scrollbar placeholder:text-slate-700"
                                        required
                                    />
                                </div>

                                <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-3xl flex items-start gap-5">
                                    <Info className="text-blue-500 shrink-0" size={20} />
                                    <p className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase tracking-widest">Los cambios en el catálogo se sincronizan inmediatamente con la pasarela de pagos y la aplicación móvil del usuario.</p>
                                </div>

                                <button className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] shadow-[0_10px_25px_rgba(59,130,246,0.3)] transition-all flex items-center justify-center gap-4 active:scale-95">
                                    <Save size={18} /> Sincronizar_Con_Cluster
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
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

export default PlanManager;
