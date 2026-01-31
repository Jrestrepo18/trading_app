import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, BarChart2 } from 'lucide-react';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);

            // If at top, set 'top' as active
            if (window.scrollY < 100) {
                setActiveSection('top');
                return;
            }

            // Detect active section
            const sections = ['solutions', 'results', 'how-it-works', 'features', 'pricing'];
            let found = false;
            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top <= 150 && rect.bottom >= 150) {
                        setActiveSection(section);
                        found = true;
                        break;
                    }
                }
            }
            // If no section found and scrolled past top, default to first visible
            if (!found && window.scrollY >= 100) {
                setActiveSection('solutions');
            }
        };

        // Run once on mount to set initial state
        handleScroll();

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    const navLinks = [
        { name: 'Inicio', to: 'top' },
        { name: 'Servicios', to: 'features' },
        { name: 'Resultados', to: 'results' },
        { name: 'Cómo Funciona', to: 'how-it-works' },
        { name: 'Precios', to: 'pricing' },
    ];

    const scrollToSection = (sectionId) => {
        // If not on landing page, navigate first then scroll
        if (location.pathname !== '/') {
            navigate('/');
            setTimeout(() => {
                if (sectionId === 'top') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    const element = document.getElementById(sectionId);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
            }, 100);
        } else {
            if (sectionId === 'top') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                const element = document.getElementById(sectionId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        }
        setMobileMenuOpen(false);
    };

    const isActive = (sectionId) => activeSection === sectionId;

    return (
        <nav className="fixed top-0 left-0 right-0 z-[100] transition-all duration-500">
            {/* Container that transforms on scroll */}
            <div className={`transition-all duration-500 ${isScrolled
                ? 'mx-4 md:mx-8 lg:mx-auto lg:max-w-5xl mt-4'
                : 'mx-0 mt-0'
                }`}>
                <motion.div
                    className={`transition-all duration-500 ${isScrolled
                        ? 'bg-[#0d1117]/90 backdrop-blur-xl border border-slate-700/50 rounded-full shadow-2xl shadow-black/50 px-6 py-3'
                        : 'bg-transparent px-6 py-5'
                        }`}
                    layout
                >
                    <div className="container mx-auto flex items-center justify-between">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2 group cursor-pointer">
                            <motion.div
                                className={`bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:scale-105 transition-all duration-300 ${isScrolled ? 'w-8 h-8' : 'w-10 h-10'
                                    }`}
                                layout
                            >
                                <BarChart2 className="text-white" size={isScrolled ? 18 : 24} />
                            </motion.div>
                            <span className={`font-bold tracking-tighter text-white uppercase transition-all duration-300 ${isScrolled ? 'text-lg' : 'text-xl'
                                }`}>
                                Senzacional<span className="text-blue-500 font-black">.</span>
                            </span>
                        </Link>

                        {/* Desktop Links - Centered */}
                        <div className="hidden lg:flex items-center gap-8">
                            {navLinks.map((link) => (
                                <button
                                    key={link.name}
                                    onClick={() => scrollToSection(link.to)}
                                    className={`text-[12px] font-bold transition-colors uppercase tracking-[0.12em] flex items-center gap-1 ${isActive(link.to)
                                        ? 'text-blue-400'
                                        : 'text-slate-400 hover:text-white'
                                        }`}
                                >
                                    {link.name}
                                </button>
                            ))}
                        </div>

                        {/* Desktop Actions */}
                        <div className="hidden lg:flex items-center gap-4">
                            <Link
                                to="/login"
                                className={`font-bold text-white hover:text-blue-400 transition-colors uppercase tracking-wider ${isScrolled ? 'text-[11px]' : 'text-[12px]'
                                    }`}
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className={`bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black rounded-full transition-all shadow-lg shadow-amber-500/20 uppercase tracking-wider active:scale-95 ${isScrolled ? 'px-5 py-2 text-[11px]' : 'px-6 py-2.5 text-[12px]'
                                    }`}
                            >
                                Registro
                            </Link>
                        </div>

                        {/* Mobile Toggle */}
                        <button
                            className="lg:hidden text-white p-2"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`mx-4 mt-2 bg-[#0d1117]/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 lg:hidden shadow-2xl`}
                    >
                        <div className="flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <button
                                    key={link.name}
                                    onClick={() => scrollToSection(link.to)}
                                    className={`text-left text-base font-bold uppercase tracking-widest py-2 ${isActive(link.to) ? 'text-blue-400' : 'text-slate-400'
                                        }`}
                                >
                                    {link.name}
                                </button>
                            ))}
                            <hr className="border-slate-800" />
                            <Link to="/login" className="text-left py-2 font-bold text-white uppercase tracking-widest">
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black rounded-xl uppercase tracking-widest text-center"
                            >
                                Registro
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
