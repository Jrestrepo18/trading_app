import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Signal, TrendingUp } from 'lucide-react';

const HowItWorks = () => {
    const steps = [
        {
            title: "Únete a la Comunidad",
            desc: "Regístrate y accede a nuestro canal de señales, cursos y mentorías exclusivas.",
            icon: UserPlus
        },
        {
            title: "Recibe Señales y Aprende",
            desc: "Señales diarias con análisis detallado + clases en vivo para entender cada operación.",
            icon: Signal
        },
        {
            title: "Opera con Confianza",
            desc: "Aplica lo aprendido, replica nuestras señales y construye tu camino como trader.",
            icon: TrendingUp
        }
    ];

    return (
        <section id="how-it-works" className="py-24 bg-[#050505] relative overflow-hidden">
            {/* Glow effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-900/20 rounded-full blur-[120px]" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">¿Cómo Funciona?</h2>
                    <p className="text-slate-400 text-lg">Tu camino hacia el trading profesional en tres pasos.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent border-t border-dashed border-slate-700" />

                    {steps.map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.2 }}
                            className="relative flex flex-col items-center text-center"
                        >
                            <div className="w-24 h-24 rounded-2xl bg-[#0A0C10] border border-slate-800 flex items-center justify-center mb-6 shadow-xl relative z-10 group hover:border-emerald-500/50 transition-colors">
                                <div className="absolute inset-0 bg-emerald-500/5 rounded-2xl transform rotate-6 group-hover:rotate-12 transition-transform" />
                                <step.icon size={32} className="text-emerald-400" />
                                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-emerald-600 border-4 border-[#050505] flex items-center justify-center text-white font-bold text-sm">
                                    {i + 1}
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                            <p className="text-slate-400 leading-relaxed max-w-xs">{step.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
