import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Globe, Lock, Zap, BarChart3, Cloud, Layers, Smartphone } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const TechCard = ({ icon: Icon, title, description, color }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-[#0D1117]/60 backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem] group hover:border-emerald-500/20 transition-all duration-500 hover:transform hover:-translate-y-2"
    >
        <div className={`w-16 h-16 rounded-2xl bg-${color}-500/10 flex items-center justify-center text-${color}-400 mb-6 group-hover:scale-110 transition-transform duration-500 shadow-inner`}>
            <Icon size={32} />
        </div>
        <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-4 group-hover:text-emerald-400 transition-colors">{title}</h3>
        <p className="text-slate-400 text-sm font-medium leading-relaxed">{description}</p>
    </motion.div>
);

const TechnologyPage = () => {
    return (
        <div className="min-h-screen bg-[#020408] text-white">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-emerald-500/20 rounded-full blur-[120px] opacity-50" />
                </div>

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8"
                    >
                        <Cpu size={14} className="animate-pulse" />
                        Infrastructure v4.0
                    </motion.div>
                    <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter mb-8 leading-none">
                        Tecnología de <br />
                        <span className="text-emerald-500">Grado Institucional</span>
                    </h1>
                    <p className="text-slate-400 text-lg md:text-xl font-medium max-w-3xl mx-auto leading-relaxed">
                        Nuestra arquitectura está diseñada para la ejecución de órdenes en microsegundos,
                        utilizando el mismo stack tecnológico que las firmas de trading de alta frecuencia en Nueva York y Londres.
                    </p>
                </div>
            </section>

            {/* Core Stack */}
            <section className="py-24 px-6 relative">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <TechCard
                        icon={Zap}
                        title="Low Latency"
                        description="Ejecución de órdenes por debajo de los 10ms gracias a servidores co-localizados."
                        color="emerald"
                    />
                    <TechCard
                        icon={Lock}
                        title="Seguridad Militar"
                        description="Encriptación AES-256 y protocolos de seguridad multicapa para proteger tus activos."
                        color="cyan"
                    />
                    <TechCard
                        icon={Globe}
                        title="Red Global"
                        description="Nodos distribuidos en Singapur, Londres y New York para una redundancia del 99.9%."
                        color="emerald"
                    />
                    <TechCard
                        icon={BarChart3}
                        title="Big Data"
                        description="Análisis masivo de datos en tiempo real para detectar tendencias antes que la competencia."
                        color="cyan"
                    />
                </div>
            </section>

            {/* Feature Showcase */}
            <section className="py-24 px-6 border-t border-white/5 bg-[#05070a]/50">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
                    <div>
                        <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-8 italic">
                            Arquitectura <br /> <span className="text-emerald-500">Sincronizada</span>
                        </h2>
                        <div className="space-y-10">
                            {[
                                { icon: Cloud, title: "Cloud Hybrid Infrastructure", text: "Mezclamos la flexibilidad de AWS con servidores físicos bare-metal para máximo rendimiento." },
                                { icon: Layers, title: "Smart Order Routing", text: "Búsqueda inteligente del mejor spread disponible en múltiples pools de liquidez." },
                                { icon: Smartphone, title: "Mobile Core Optimized", text: "Nuestra engine está escrita en Rust para una experiencia fluida sin consumo excesivo de batería." }
                            ].map((item, idx) => (
                                <div key={idx} className="flex gap-6 group">
                                    <div className="shrink-0 w-12 h-12 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                                        <item.icon size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-black uppercase italic tracking-tight mb-2 text-white">{item.title}</h4>
                                        <p className="text-slate-500 text-sm font-medium leading-relaxed">{item.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="relative">
                        <div className="bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-[3rem] p-1 border border-white/10 shadow-2xl">
                            <div className="bg-[#020408] rounded-[2.8rem] p-10 relative overflow-hidden">
                                <div className="flex justify-between items-center mb-10">
                                    <div className="w-2 h-2 rounded-full bg-rose-500" />
                                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                </div>
                                <div className="space-y-4">
                                    <div className="h-2 bg-slate-800 rounded-full w-3/4 animate-pulse" />
                                    <div className="h-2 bg-slate-800 rounded-full w-1/2 animate-pulse delay-75" />
                                    <div className="grid grid-cols-3 gap-2 py-6">
                                        <div className="h-20 bg-emerald-500/20 border border-emerald-500/30 rounded-xl" />
                                        <div className="h-20 bg-cyan-500/20 border border-cyan-500/30 rounded-xl" />
                                        <div className="h-20 bg-emerald-500/20 border border-emerald-500/30 rounded-xl" />
                                    </div>
                                    <div className="h-2 bg-slate-800 rounded-full w-full animate-pulse delay-150" />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default TechnologyPage;
