import React from 'react';
import { Link } from 'react-router-dom';
import { Signal, Send, Instagram, Youtube, Twitter, Mail, ArrowRight, ShieldCheck, Globe, Zap } from 'lucide-react';

const Footer = () => {
    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <footer className="bg-[#050505] relative pt-24 pb-12 border-t border-slate-900 overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                {/* Newsletter / CTA Section */}
                <div className="grid lg:grid-cols-2 gap-12 items-center mb-24 pb-16 border-b border-slate-900/50">
                    <div>
                        <h3 className="text-3xl font-bold text-white mb-4">Únete a nuestra Newsletter</h3>
                        <p className="text-slate-400 max-w-md"> Recibe análisis semanales, actualizaciones del mercado y señales exclusivas directamente en tu correo.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1 group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={20} />
                            <input
                                type="email"
                                placeholder="tu@email.com"
                                className="w-full bg-[#0A0C10] border border-slate-800 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-slate-600"
                            />
                        </div>
                        <button className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-4 px-8 rounded-xl transition-all shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2 group whitespace-nowrap">
                            Suscribirme
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="lg:col-span-4">
                        <Link to="/" className="flex items-center gap-2 mb-6 group">
                            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                                <Signal className="text-black" size={20} />
                            </div>
                            <span className="text-2xl font-bold text-white tracking-tighter uppercase">Senzacional<span className="text-emerald-500">.</span></span>
                        </Link>
                        <p className="text-slate-500 text-sm leading-relaxed mb-8 max-w-xs">
                            Líderes en formación y señales de trading institucional. Empoderamos a traders minoristas con herramientas y conocimientos de nivel profesional.
                        </p>
                        <div className="flex items-center gap-4">
                            {[
                                { icon: Send, label: 'Telegram' },
                                { icon: Instagram, label: 'Instagram' },
                                { icon: Youtube, label: 'YouTube' },
                                { icon: Twitter, label: 'X (Twitter)' }
                            ].map((social, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all duration-300" aria-label={social.label}>
                                    <social.icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links - Column 1 */}
                    <div className="lg:col-span-2 lg:col-start-6">
                        <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Ecosistema</h4>
                        <ul className="space-y-4 text-sm text-slate-500">
                            <li><button onClick={() => scrollToSection('features')} className="hover:text-emerald-400 transition-colors">Señales</button></li>
                            <li><button onClick={() => scrollToSection('features')} className="hover:text-emerald-400 transition-colors">Academia</button></li>
                            <li><button onClick={() => scrollToSection('features')} className="hover:text-emerald-400 transition-colors">Asesorías</button></li>
                            <li><button onClick={() => scrollToSection('pricing')} className="hover:text-emerald-400 transition-colors">Planes VIP</button></li>
                        </ul>
                    </div>

                    {/* Links - Column 2 */}
                    <div className="lg:col-span-2">
                        <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Recursos</h4>
                        <ul className="space-y-4 text-sm text-slate-500">
                            <li><button onClick={() => scrollToSection('results')} className="hover:text-emerald-400 transition-colors">Track Record</button></li>
                            <li><button onClick={() => scrollToSection('how-it-works')} className="hover:text-emerald-400 transition-colors">Metodología</button></li>
                            <li><Link to="/login" className="hover:text-emerald-400 transition-colors">Acceso Estudiantes</Link></li>
                            <li><Link to="/register" className="hover:text-emerald-400 transition-colors">Registro</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info column */}
                    <div className="lg:col-span-3">
                        <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Confianza y Soporte</h4>
                        <div className="space-y-6">
                            <div className="flex items-start gap-3">
                                <div className="mt-1 text-emerald-500"><ShieldCheck size={18} /></div>
                                <div>
                                    <div className="text-white text-sm font-medium">Seguridad Total</div>
                                    <div className="text-slate-500 text-xs mt-1">Sistemas de pago protegidos y cifrados.</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="mt-1 text-emerald-500"><Zap size={18} /></div>
                                <div>
                                    <div className="text-white text-sm font-medium">Soporte 24/7</div>
                                    <div className="text-slate-500 text-xs mt-1">Chat en vivo y soporte vía Discord.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Copyright Area */}
                <div className="pt-12 border-t border-slate-900/50">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <p className="text-slate-600 text-xs">
                                &copy; {new Date().getFullYear()} Senzacional Group. Todos los derechos reservados.
                            </p>
                            <div className="flex gap-6">
                                <a href="#" className="text-slate-700 hover:text-slate-500 text-[10px] uppercase font-bold tracking-widest transition-colors">Privacidad</a>
                                <a href="#" className="text-slate-700 hover:text-slate-500 text-[10px] uppercase font-bold tracking-widest transition-colors">Términos</a>
                                <a href="#" className="text-slate-700 hover:text-slate-500 text-[10px] uppercase font-bold tracking-widest transition-colors">Cookies</a>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-slate-700">
                            <Globe size={16} />
                            <span className="text-[10px] uppercase font-black tracking-widest">Global Operations</span>
                        </div>
                    </div>
                    <div className="mt-8 p-6 bg-[#131722]/30 rounded-2xl border border-slate-800/30">
                        <p className="text-[10px] text-slate-700 text-center uppercase tracking-tight leading-relaxed font-medium">
                            Advertencia de Riesgo: El trading conlleva un alto nivel de riesgo para su capital debido a la volatilidad del mercado subyacente. Los productos pueden no ser adecuados para todos los inversores. Asegúrese de comprender plenamente los riesgos implicados y busque asesoramiento independiente si es necesario. Los resultados pasados no son garantía de rentabilidad futura.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
