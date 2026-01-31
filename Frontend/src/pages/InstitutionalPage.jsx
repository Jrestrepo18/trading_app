import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Building2, Users, Award, Landmark, Globe2, Scale, Briefcase } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ValueRow = ({ title, text, icon: Icon }) => (
    <div className="flex gap-8 group py-8 border-b border-white/5 last:border-0">
        <div className="shrink-0 w-16 h-16 bg-white/5 border border-white/5 rounded-3xl flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white group-hover:scale-110 transition-all duration-500">
            <Icon size={24} />
        </div>
        <div>
            <h4 className="text-xl font-black uppercase italic tracking-tighter mb-2 text-white">{title}</h4>
            <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-xl">{text}</p>
        </div>
    </div>
);

const InstitutionalPage = () => {
    return (
        <div className="min-h-screen bg-[#020408] text-white">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-24 px-6 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.1),transparent_50%)]" />
                <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-20 h-20 bg-white/5 border border-white/5 rounded-[2rem] flex items-center justify-center mb-10 shadow-2xl"
                    >
                        <Building2 size={40} className="text-emerald-500" />
                    </motion.div>
                    <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter mb-8 leading-tight">
                        La Firma <br /> <span className="text-emerald-500">Valor Trading</span>
                    </h1>
                    <p className="text-slate-400 text-lg md:text-xl font-medium max-w-3xl mx-auto leading-relaxed italic border-l-2 border-emerald-500 pl-8">
                        "En Valor Trading, no solo proveemos datos; construimos la infraestructura de confianza que permite a los inversores escalar en los mercados globales con precisión institucional."
                    </p>
                </div>
            </section>

            {/* Board / Firm Values */}
            <section className="py-24 px-6 bg-[#05070a]">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-start">
                    <div className="sticky top-32">
                        <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-8 leading-tight">
                            Nuestra <br /> <span className="text-emerald-500">Misión Institucional</span>
                        </h2>
                        <p className="text-slate-500 font-medium mb-12 leading-relaxed">
                            Fundada sobre los pilares de la transparencia tecnológica y la excelencia operativa,
                            Valor Trading se ha consolidado como el socio estratégico para traders que buscan
                            una ventaja competitiva real.
                        </p>
                        <div className="grid grid-cols-2 gap-6">
                            {[
                                { label: 'Años Experience', value: '12+' },
                                { label: 'Capital Gestionado', value: '$450M+' },
                                { label: 'Traders Activos', value: '15k' },
                                { label: 'Precisión Sync', value: '99.9%' }
                            ].map((stat, i) => (
                                <div key={i} className="bg-white/5 border border-white/5 p-6 rounded-[2rem]">
                                    <p className="text-2xl font-black text-white italic mb-1">{stat.value}</p>
                                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <ValueRow
                            icon={Shield}
                            title="Custodia y Protección"
                            text="Cumplimos con los más altos estándares internacionales en protección de datos y protocolos de ciberseguridad financiera."
                        />
                        <ValueRow
                            icon={Landmark}
                            title="Respaldo Patrimonial"
                            text="Operamos con un balance financiero sólido que garantiza la continuidad de nuestras operaciones en cualquier escenario de mercado."
                        />
                        <ValueRow
                            icon={Globe2}
                            title="Presencia Multimercado"
                            text="Infraestructura con presencia nativa en los principales centros financieros del mundo: New York, Londres y Hong Kong."
                        />
                        <ValueRow
                            icon={Briefcase}
                            title="Gobierno Corporativo"
                            text="Contamos con un consejo de administración compuesto por veteranos de la industria con décadas de experiencia en mercados emergentes."
                        />
                    </div>
                </div>
            </section>

            {/* Certifications / Compliance */}
            <section className="py-24 px-6 border-y border-white/5">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
                    <div className="flex items-center gap-3">
                        <Scale className="text-slate-500" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Institutional Compliance</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Award className="text-slate-500" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Voted Best Engine 2024</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Users className="text-slate-500" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Trusted by 150+ Hedge Funds</span>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default InstitutionalPage;
