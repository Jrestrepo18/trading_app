import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Signal, GraduationCap, Users, Video, MessageCircle, BookOpen, Shield, Zap, TrendingUp, BarChart3, X, ArrowRight, CheckCircle2 } from 'lucide-react';

const SERVICES_DATA = [
    {
        id: 'signals',
        title: "Señales de Trading",
        icon: Signal,
        shortDesc: "Recibe señales de alta precisión enviadas directamente a tu dispositivo.",
        longDesc: "Nuestro sistema de señales no es solo una alerta de compra o venta. Es el resultado de un análisis profundo del flujo de órdenes institucional. Operamos basándonos en la liquidez del mercado, identificando dónde están las trampas para entrar con los grandes jugadores.",
        tags: ['Crypto', 'Acciones', 'ETFs', 'Futuros'],
        color: 'emerald',
        features: [
            "Análisis de Order Flow en tiempo real",
            "Gestión de riesgo 1:3 mínimo garantizado",
            "Alertas vía Telegram y App propia",
            "Seguimiento post-operativo detallado"
        ],
        stats: "Success Rate: ~78%"
    },
    {
        id: 'classes',
        title: "Clases en Vivo",
        icon: Video,
        shortDesc: "No solo te damos la señal, te enseñamos el porqué con operativa real.",
        longDesc: "La educación más efectiva ocurre cuando el mercado se está moviendo. En nuestras sesiones en vivo, verás la aplicación real de la metodología, desde el análisis pre-market hasta la ejecución de órdenes en tiempo real. Es aprendizaje puro en el campo de batalla.",
        tags: ['En Vivo', 'Análisis', 'Psicotrading'],
        color: 'blue',
        features: [
            "Sesiones semanales nocturnas (NYC/LDN)",
            "Análisis de tus propias operaciones",
            "Dinámicas de psicología de trading",
            "Grabaciones disponibles 24/7"
        ],
        details: { label: "Próxima Sesion", value: "Lunes - 8:00 PM EST" }
    },
    {
        id: 'mentorship',
        title: "Asesoría 1:1",
        icon: Users,
        premium: true,
        shortDesc: "Un roadmap personalizado hacia tu rentabilidad con un mentor dedicado.",
        longDesc: "El camino de cada trader es único. En la asesoría personalizada, nos enfocamos exclusivamente en tus errores, tus fortalezas y tu plan de trading. Es el sistema más rápido para corregir vicios operativos y acelerar tu curva de aprendizaje profesional.",
        tags: ['Estrategia', 'Psicología', 'Roadmap'],
        color: 'amber',
        features: [
            "Plan de trading personalizado",
            "Bitácora de seguimiento semanal",
            "Canal directo 24/7 con el mentor",
            "Preparación para cuentas fondeadas"
        ],
        details: { label: "Mentosía Premium", value: "+120 Alumnos Rentables" }
    },
    {
        id: 'academy',
        title: "Formación Completa",
        icon: GraduationCap,
        shortDesc: "De novato a profesional. Metodología estructurada para dominar el Price Action.",
        longDesc: "Nuestro programa estrella. Una arquitectura de aprendizaje diseñada para que cualquier persona, sin importar su nivel previo, logre entender el lenguaje institucional. Cubrimos desde los fundamentos más básicos hasta el análisis complejo de liquidez y SMC (Smart Money Concepts).",
        tags: ['Curso', 'SMC', 'Liquidez'],
        color: 'indigo',
        features: [
            "Acceso vitalicio a 40+ Lecciones HD",
            "Actualizaciones constantes del mercado",
            "Exámenes de certificación interna",
            "Acceso al Discord VIP exclusivo"
        ],
        stats: "40+ Lecciones"
    }
];

const ServiceModal = ({ service, onClose }) => {
    if (!service) return null;

    const colorClasses = {
        emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
        amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
        indigo: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-xl"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-[#131722] border border-slate-800 w-full max-w-4xl rounded-[2.5rem] overflow-hidden shadow-2xl relative"
                onClick={e => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors z-20"
                >
                    <X size={20} />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-12 h-full">
                    {/* Left Side: Visual/Summary */}
                    <div className="md:col-span-5 p-8 md:p-12 bg-gradient-to-b from-slate-900/50 to-transparent flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800">
                        <div>
                            <div className={`w-16 h-16 rounded-2xl ${colorClasses[service.color]} flex items-center justify-center mb-8`}>
                                <service.icon size={32} />
                            </div>
                            <h2 className="text-4xl font-black text-white mb-4 tracking-tight">{service.title}</h2>
                            <div className="flex flex-wrap gap-2 mb-8">
                                {service.tags.map((tag, i) => (
                                    <span key={i} className="px-3 py-1 bg-white/5 text-[10px] font-bold text-slate-400 rounded-lg border border-white/5 uppercase tracking-wider">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {service.stats && (
                            <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl">
                                <span className="text-emerald-400 font-black text-xl">{service.stats}</span>
                                <p className="text-emerald-400/60 text-[10px] font-bold uppercase tracking-widest mt-1">Métrica Institucional</p>
                            </div>
                        )}

                        {service.details && (
                            <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl">
                                <span className="text-blue-400 font-bold text-sm block">{service.details.label}</span>
                                <span className="text-white font-black text-lg">{service.details.value}</span>
                            </div>
                        )}
                    </div>

                    {/* Right Side: Deep Details */}
                    <div className="md:col-span-7 p-8 md:p-12 space-y-10 overflow-y-auto max-h-[70vh] md:max-h-none">
                        <section>
                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">La Metodología</h4>
                            <p className="text-slate-300 text-lg leading-relaxed font-medium">
                                {service.longDesc}
                            </p>
                        </section>

                        <section>
                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">¿Qué incluye?</h4>
                            <div className="grid grid-cols-1 gap-4">
                                {service.features.map((feature, i) => (
                                    <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 group hover:border-white/10 transition-colors">
                                        <div className={`mt-1 p-1 rounded-full ${colorClasses[service.color]} bg-opacity-20`}>
                                            <CheckCircle2 size={16} />
                                        </div>
                                        <p className="text-slate-200 font-semibold">{feature}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <button
                            className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-300
                                ${service.color === 'emerald' ? 'bg-emerald-500 hover:bg-emerald-400 shadow-[0_4px_20px_rgba(16,185,129,0.3)]' :
                                    service.color === 'blue' ? 'bg-blue-500 hover:bg-blue-400 shadow-[0_4px_20px_rgba(59,130,246,0.3)]' :
                                        service.color === 'amber' ? 'bg-amber-500 hover:bg-amber-400 shadow-[0_4px_20px_rgba(245,158,11,0.3)]' :
                                            'bg-indigo-500 hover:bg-indigo-400 shadow-[0_4px_20px_rgba(99,102,241,0.3)]'}
                                text-white flex items-center justify-center gap-3 transform hover:-translate-y-1 active:scale-[0.98]`}
                        >
                            Comenzar Ahora <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

const FeaturesGrid = () => {
    const [selectedService, setSelectedService] = useState(null);

    return (
        <section id="features" className="py-32 bg-[#0A0C10] relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="mb-20 max-w-3xl">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6"
                    >
                        <Shield size={14} className="text-emerald-400" />
                        <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">Ecosistema Institucional</span>
                    </motion.div>
                    <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                        Nuestros <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Servicios</span>
                    </h2>
                    <p className="text-slate-400 text-lg leading-relaxed">
                        Combinamos tecnología de punta con años de experiencia para ofrecerte herramientas de trading que realmente marcan la diferencia. Todo lo que necesitas para convertirte en un trader rentable.
                    </p>
                </div>

                {/* BENTO GRID */}
                <div className="grid grid-cols-1 md:grid-cols-6 gap-6">

                    {/* Card 1: Señales de Trading (Large/Wide) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        whileHover={{ y: -5 }}
                        onClick={() => setSelectedService(SERVICES_DATA.find(s => s.id === 'signals'))}
                        className="md:col-span-4 bg-gradient-to-br from-[#131722] to-[#0A0C10] rounded-3xl border border-slate-800 p-8 relative overflow-hidden group transition-all duration-300 hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/10 cursor-pointer"
                    >
                        {/* Mesh gradient background */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(16,185,129,0.1),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="relative z-10 h-full flex flex-col md:flex-row justify-between">
                            <div className="max-w-md">
                                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                                    <Signal size={28} />
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-4">Señales de Trading</h3>
                                <p className="text-slate-400 leading-relaxed mb-6">
                                    Recibe señales de alta precisión enviadas directamente a tu dispositivo.
                                    Análisis institucional para Crypto, Acciones, ETFs y Futuros.
                                </p>
                                <div className="flex items-center gap-2 mb-6 group/btn">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 group-hover/btn:translate-x-1 transition-transform">Saber más</span>
                                    <ArrowRight size={14} className="text-emerald-400 group-hover/btn:translate-x-2 transition-transform" />
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {['Crypto', 'Acciones', 'ETFs', 'Futuros'].map((tag, i) => (
                                        <span key={i} className="px-3 py-1 bg-[#1A1F2E] text-slate-300 text-xs font-medium rounded-lg border border-slate-700">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Signal Card Widget */}
                            <motion.div
                                whileHover={{ rotate: 2, scale: 1.05 }}
                                className="hidden lg:flex items-center justify-center flex-1 ml-10"
                            >
                                <div className="w-[200px] bg-slate-900 rounded-2xl border border-slate-700/50 p-4 shadow-2xl relative">
                                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-emerald-500 rounded-full animate-ping opacity-75" />
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Nueva Señal</span>
                                        <Zap size={14} className="text-amber-400" />
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center bg-black/40 p-2 rounded-lg">
                                            <span className="text-[10px] text-slate-500 uppercase">Pair</span>
                                            <span className="text-xs font-bold text-white">XAUUSD</span>
                                        </div>
                                        <div className="flex justify-between items-center bg-black/40 p-2 rounded-lg">
                                            <span className="text-[10px] text-slate-500 uppercase">Type</span>
                                            <span className="text-xs font-bold text-emerald-400">BUY NOW</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Card 2: Clases en Vivo */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        whileHover={{ y: -5 }}
                        onClick={() => setSelectedService(SERVICES_DATA.find(s => s.id === 'classes'))}
                        className="md:col-span-2 bg-[#131722] rounded-3xl border border-slate-800 p-8 flex flex-col justify-between relative overflow-hidden group hover:border-blue-500/50 transition-all duration-300 cursor-pointer"
                    >
                        <div className="absolute -right-20 -top-20 w-60 h-60 bg-blue-500/5 rounded-full blur-[80px] group-hover:bg-blue-500/10 transition-colors" />

                        <div>
                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform">
                                <Video size={24} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">Clases en Vivo</h3>
                            <p className="text-slate-400 text-sm leading-relaxed mb-4">
                                No solo te damos la señal, te enseñamos el porqué con operativa real.
                            </p>
                            <div className="flex items-center gap-2 mb-4 group/btn">
                                <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 group-hover/btn:translate-x-1 transition-transform">Saber más</span>
                                <ArrowRight size={14} className="text-blue-400 group-hover/btn:translate-x-2 transition-transform" />
                            </div>
                        </div>

                        <div className="mt-6 p-3 bg-black/40 rounded-xl border border-slate-800/50 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                <TrendingUp size={16} className="text-blue-400" />
                            </div>
                            <div className="text-xs">
                                <div className="text-slate-400 font-medium text-[10px]">Próxima Sesion</div>
                                <div className="text-white font-bold text-[11px]">Lun-Vie - 8 PM</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Card 3: Asesorías */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        whileHover={{ y: -5 }}
                        onClick={() => setSelectedService(SERVICES_DATA.find(s => s.id === 'mentorship'))}
                        className="md:col-span-2 bg-[#131722] rounded-3xl border border-slate-800 p-8 flex flex-col justify-between group hover:border-amber-500/50 transition-all duration-300 relative overflow-hidden cursor-pointer"
                    >
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-amber-500/5 rounded-full blur-[60px] group-hover:bg-amber-500/10 transition-colors" />

                        <div>
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                                    <Users size={24} />
                                </div>
                                <div className="px-2 py-1 bg-amber-500/10 rounded text-amber-400 text-[10px] font-black uppercase tracking-widest border border-amber-500/20">PREMIUM</div>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">Asesoría 1:1</h3>
                            <p className="text-slate-400 text-sm leading-relaxed mb-4">
                                Un roadmap personalizado hacia tu rentabilidad con mentoría directa.
                            </p>
                            <div className="flex items-center gap-2 group/btn">
                                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 group-hover/btn:translate-x-1 transition-transform">Saber más</span>
                                <ArrowRight size={14} className="text-amber-400 group-hover/btn:translate-x-2 transition-transform" />
                            </div>
                        </div>

                        <div className="mt-8 flex -space-x-2">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-[#131722] bg-slate-800 overflow-hidden" />
                            ))}
                            <div className="h-8 px-2 flex items-center text-[10px] text-slate-500 font-medium italic">+120 mentorías</div>
                        </div>
                    </motion.div>

                    {/* Card 4: Formación Completa (Large/Wide) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        whileHover={{ y: -5 }}
                        onClick={() => setSelectedService(SERVICES_DATA.find(s => s.id === 'academy'))}
                        className="md:col-span-4 bg-gradient-to-tr from-[#131722] to-[#0A0C10] rounded-3xl border border-slate-800 p-8 relative overflow-hidden group hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 cursor-pointer"
                    >
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-indigo-500/5 to-transparent" />

                        <div className="flex flex-col md:flex-row items-center gap-12 h-full relative z-10">
                            <div className="flex-1">
                                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 text-indigo-400 group-hover:scale-110 transition-transform duration-300">
                                    <GraduationCap size={28} />
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-4">Formación Completa</h3>
                                <p className="text-slate-400 leading-relaxed mb-4">
                                    De novato a profesional. Domina el Price Action y el análisis institucional paso a paso.
                                </p>
                                <div className="flex items-center gap-2 mb-6 group/btn">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 group-hover/btn:translate-x-1 transition-transform">Saber más</span>
                                    <ArrowRight size={14} className="text-indigo-400 group-hover/btn:translate-x-2 transition-transform" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3">
                                        <BookOpen size={16} className="text-indigo-400" />
                                        <span className="text-xs text-slate-300 font-medium">40+ Lecciones</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <MessageCircle size={16} className="text-indigo-400" />
                                        <span className="text-xs text-slate-300 font-medium">Grupo Discord</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 w-full max-w-xs">
                                <div className="bg-[#0A0C10] rounded-2xl border border-slate-800 p-4 space-y-3 relative overflow-hidden">
                                    <div className="text-xs font-bold text-slate-500 mb-2">Progreso Sugerido</div>
                                    {[
                                        { l: 'Módulo 1: Fundamentos', p: 100, color: 'bg-emerald-500' },
                                        { l: 'Módulo 2: Price Action', p: 65, color: 'bg-indigo-500' },
                                    ].map((m, i) => (
                                        <div key={i} className="space-y-1.5 p-2 rounded-xl bg-white/5 border border-white/5">
                                            <div className="flex justify-between text-[10px] font-bold text-white">
                                                <span>{m.l}</span>
                                                <span className="text-slate-500">{m.p}%</span>
                                            </div>
                                            <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                                                <motion.div initial={{ width: 0 }} whileInView={{ width: `${m.p}%` }} className={`h-full ${m.color}`} />
                                            </div>
                                        </div>
                                    ))}
                                    <BarChart3 className="absolute -bottom-4 -right-4 text-indigo-500/20 w-24 h-24 rotate-12" />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>

            {/* Modal Detail Overlay */}
            <AnimatePresence>
                {selectedService && (
                    <ServiceModal
                        service={selectedService}
                        onClose={() => setSelectedService(null)}
                    />
                )}
            </AnimatePresence>
        </section>
    );
};

export default FeaturesGrid;
