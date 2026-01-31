import React from 'react';
import { motion } from 'framer-motion';

const ExperienceMilestone = () => {
    return (
        <section className="py-24 md:py-32 bg-black relative overflow-hidden">
            {/* Mesh Gradient / Glow Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[140px]" />
                <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px]" />

                {/* Dynamic light spot */}
                <motion.div
                    animate={{
                        opacity: [0.2, 0.4, 0.2],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 5, repeat: Infinity }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-emerald-400/10 rounded-full blur-[100px]"
                />
            </div>

            <div className="container mx-auto px-6 relative z-10 text-center">
                <div className="max-w-4xl mx-auto flex flex-col items-center">

                    {/* Perspective Container */}
                    <div className="relative mb-4 md:mb-6" style={{ perspective: '2000px' }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, rotateX: 30 }}
                            whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
                            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            {/* Metallic 3D Number */}
                            <h2
                                className="text-[14rem] md:text-[22rem] font-black leading-none tracking-tighter select-none"
                                style={{
                                    color: '#ffffff',
                                    textShadow: `
                                        0 1px 0 #cbd5e1,
                                        0 2px 0 #94a3b8,
                                        0 3px 0 #64748b,
                                        0 4px 0 #475569,
                                        0 5px 0 #334155,
                                        0 8px 15px rgba(0,0,0,0.5),
                                        0 15px 30px rgba(0,0,0,0.3)
                                    `,
                                    background: 'linear-gradient(to bottom, #ffffff 0%, #e2e8f0 40%, #94a3b8 70%, #475569 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    filter: 'drop-shadow(0 0 40px rgba(16, 185, 129, 0.15))'
                                }}
                            >
                                10
                            </h2>

                            {/* Reflection / Halo */}
                            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[110%] h-16 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent blur-3xl opacity-60" />
                        </motion.div>
                    </div>

                    {/* High-Performance Text */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                            <span className="text-[10px] md:text-xs font-black text-slate-200 uppercase tracking-[0.3em]">Trayectoria Institucional</span>
                        </div>

                        <h3 className="text-3xl md:text-5xl font-black text-white leading-[1.1] tracking-tight">
                            10 años empoderando a los traders,<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-slate-200">y esto es solo el principio.</span>
                        </h3>

                        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
                            Conoce el nuevo <span className="text-white font-bold">Valor Trading</span>, transformado y mejorado.
                            Experimenta el cuidado estratégico y la precisión institucional que hemos perfeccionado durante una década.
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default ExperienceMilestone;
