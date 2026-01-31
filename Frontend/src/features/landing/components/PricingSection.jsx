import React from 'react';
import { Check, Sparkles } from 'lucide-react';
import { API_URL } from '../../../config/api';

const PricingSection = () => {
    const [plans, setPlans] = React.useState([]);

    React.useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await fetch(`${API_URL}/api/plans`);
                if (response.ok) {
                    const data = await response.json();
                    setPlans(data);
                }
            } catch (error) {
                console.error('Error fetching plans:', error);
            }
        };
        fetchPlans();
    }, []);

    return (
        <section id="pricing" className="py-32 bg-[#050505]">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Planes para Ti</h2>
                    <p className="text-slate-400 text-lg">
                        Elige el plan que mejor se adapte a tus necesidades de trading.
                    </p>
                </div>
                <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {plans.map((plan) => {
                        // Determine visual style based on price (simple logic for now, or could depend on a flag)
                        const isPopular = plan.price >= 60 && plan.price <= 100;
                        const isPremium = plan.price > 100;

                        if (isPopular) {
                            return (
                                <div key={plan.id} className="bg-[#131722] p-8 rounded-3xl border border-emerald-500/30 relative flex flex-col shadow-2xl shadow-emerald-900/10 scale-105">
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black text-xs font-bold px-4 py-2 rounded-full flex items-center gap-1">
                                        <Sparkles size={14} />
                                        MÁS POPULAR
                                    </div>
                                    <div className="mb-4 mt-2">
                                        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                                            {plan.name}
                                        </span>
                                    </div>
                                    <div className="mb-6">
                                        <span className="text-4xl font-bold text-white">${parseInt(plan.price)}</span>
                                        <span className="text-slate-500">/mes</span>
                                    </div>
                                    <p className="text-slate-500 text-sm mb-6">
                                        Plan recomendado para crecimiento acelerado.
                                    </p>
                                    <ul className="space-y-4 mb-8 flex-1">
                                        {plan.features.map((feat, i) => (
                                            <li key={i} className="flex items-center gap-3 text-white text-sm">
                                                <div className="bg-emerald-500/20 p-1 rounded-full flex-shrink-0">
                                                    <Check size={12} className="text-emerald-400" />
                                                </div>
                                                {feat}
                                            </li>
                                        ))}
                                    </ul>
                                    <button className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-bold hover:opacity-90 transition-opacity shadow-lg shadow-emerald-500/20">
                                        Unirse Ahora
                                    </button>
                                </div>
                            );
                        }

                        if (isPremium) {
                            return (
                                <div key={plan.id} className="bg-[#0A0C10] p-8 rounded-3xl border border-slate-800 flex flex-col hover:border-slate-600 transition-colors">
                                    <div className="mb-4">
                                        <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-wider">
                                            {plan.name}
                                        </span>
                                    </div>
                                    <div className="mb-6">
                                        <span className="text-4xl font-bold text-white">${parseInt(plan.price)}</span>
                                        <span className="text-slate-500">/mes</span>
                                    </div>
                                    <p className="text-slate-500 text-sm mb-6">
                                        Para traders institucionales o mentores.
                                    </p>
                                    <ul className="space-y-4 mb-8 flex-1">
                                        {plan.features.map((feat, i) => (
                                            <li key={i} className="flex items-center gap-3 text-slate-300 text-sm">
                                                <Check size={16} className="text-amber-500 flex-shrink-0" />
                                                {feat}
                                            </li>
                                        ))}
                                    </ul>
                                    <button className="w-full py-4 rounded-xl border border-amber-500/50 text-amber-400 font-bold hover:bg-amber-500/10 transition-colors">
                                        Contactar
                                    </button>
                                </div>
                            );
                        }

                        // Standard / Basic
                        return (
                            <div key={plan.id} className="bg-[#0A0C10] p-8 rounded-3xl border border-slate-800 flex flex-col hover:border-slate-600 transition-colors">
                                <div className="mb-4">
                                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                                        {plan.name}
                                    </span>
                                </div>
                                <div className="mb-6">
                                    <span className="text-4xl font-bold text-white">${parseInt(plan.price)}</span>
                                    <span className="text-slate-500">/mes</span>
                                </div>
                                <p className="text-slate-500 text-sm mb-6">
                                    Acceso a herramientas esenciales.
                                </p>
                                <ul className="space-y-4 mb-8 flex-1">
                                    {plan.features.map((feat, i) => (
                                        <li key={i} className="flex items-center gap-3 text-slate-300 text-sm">
                                            <Check size={16} className="text-emerald-500 flex-shrink-0" />
                                            {feat}
                                        </li>
                                    ))}
                                </ul>
                                <button className="w-full py-4 rounded-xl border border-slate-700 text-white font-bold hover:bg-slate-800 transition-colors">
                                    Comenzar
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default PricingSection;
