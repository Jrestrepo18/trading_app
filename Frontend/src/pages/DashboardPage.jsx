import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { db } from '../config/firebase';
import useAuthStore from '../stores/authStore';
import {
    TrendingUp, Activity, Bell, Target, Shield,
    ArrowUpRight, ArrowDownRight, Zap, Calculator,
    Clock, AlertCircle, ExternalLink, ChevronRight,
    User, Users, Settings, LogOut, X, Lock, Mail, Phone,
    Edit3, Save, Eye, EyeOff, Signal, ChevronDown,
    LayoutDashboard, Globe, MessageSquare, Menu, TrendingDown,
    ZapOff, BarChart3, Info, PieChart, CreditCard, CheckCircle2,
    Newspaper, Share2, Filter, Search, Radio, ImageIcon,
    Calendar, ArrowRight, Headphones, Plus, ArrowLeft, Send,
    Smile, Paperclip, Star
} from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import EconomicCalendar from '../components/EconomicCalendar';

// --- UTILS ---
const getSmartImage = (item) => {
    // High quality fallback keywords for Unsplash
    const fallbacks = {
        btc: 'crypto,bitcoin,trading',
        eth: 'ethereum,crypto,tech',
        market: 'stock,market,data',
        global: 'finance,world,economy'
    };

    const title = (item.title || '').toLowerCase();
    const cat = (item.categories || '').toLowerCase();

    let query = fallbacks.market;
    if (title.includes('bitcoin') || cat.includes('btc')) query = fallbacks.btc;
    else if (title.includes('eth') || cat.includes('eth')) query = fallbacks.eth;
    else if (cat.includes('market') || cat.includes('exchange')) query = fallbacks.market;
    else if (cat.includes('global')) query = fallbacks.global;

    // If the image looks like a placeholder, use Unsplash with a unique seed
    const isLogo = !item.imageurl || item.imageurl.includes('default') || item.imageurl === item.source_info?.img;

    if (isLogo) {
        // Use a high-quality fixed fallback if the logo is detected
        return `https://images.unsplash.com/photo-1611974717482-95317aa18f1a?auto=format&fit=crop&q=100&w=800`;
    }

    return item.imageurl;
};

// --- COMPONENTS ---

const MarketNewsSection = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await fetch('https://min-api.cryptocompare.com/data/v2/news/?lang=ES');
                const data = await response.json();
                setNews(data.Data.slice(0, 13));
            } catch (error) {
                console.error('Error fetching news:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
        const interval = setInterval(fetchNews, 600000);
        return () => clearInterval(interval);
    }, []);

    const featured = news[0];
    const secondary = news.slice(1);

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-10">
            {/* SLEEK TERMINAL HEADER */}
            <div className="flex flex-col border-b border-white/5 pb-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-1 h-4 bg-[#3b82f6] rounded-full" />
                    <h2 className="text-2xl font-black text-white italic tracking-tight uppercase">BLOOMBERG_BBC_NODE</h2>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <p className="text-[9px] font-bold text-[#3b82f6] uppercase tracking-[0.4em] italic flex items-center gap-2 bg-[#3b82f6]/5 px-3 py-1 rounded-full border border-[#3b82f6]/10">
                            <Radio size={10} className="animate-pulse" /> LIVE_INTELLIGENCE_STREAM
                        </p>
                    </div>
                    <div className="hidden lg:flex items-center gap-6 text-[8px] font-black text-slate-500 uppercase tracking-widest font-mono">
                        <span className="flex items-center gap-1.5"><Globe size={10} className="text-slate-700" /> LON: {new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
                        <span className="flex items-center gap-1.5"><Activity size={10} className="text-[#0ecb81]" /> SYNC: ACTIVE</span>
                        <span className="flex items-center gap-1.5"><Shield size={10} className="text-[#3b82f6]" /> NODE: SECURE</span>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => <div key={i} className="h-48 bg-white/[0.02] animate-pulse rounded-2xl border border-white/5" />)}
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Featured Article - Cinematic Terminal Style */}
                    {featured && (
                        <motion.a
                            href={featured.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative block w-full h-[400px] rounded-3xl overflow-hidden group border border-white/5 hover:border-[#3b82f6]/30 transition-all duration-500"
                        >
                            <img
                                src={getSmartImage(featured)}
                                alt={featured.title}
                                className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-1000 opacity-60 group-hover:opacity-80"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E11] via-[#0B0E11]/40 to-transparent" />

                            <div className="absolute top-6 left-6 flex items-center gap-3 z-10">
                                <div className="px-3 py-1 bg-[#f6465d] text-white rounded-md text-[8px] font-black uppercase tracking-widest italic shadow-lg">ÚLTIMA_HORA</div>
                                <div className="px-3 py-1 bg-black/40 backdrop-blur-md border border-white/10 text-slate-300 rounded-md text-[8px] font-black uppercase tracking-widest italic">{featured.source_info.name}</div>
                            </div>

                            <div className="absolute bottom-0 left-0 p-10 max-w-4xl space-y-4 z-10">
                                <div className="flex items-center gap-3 text-slate-400 font-mono">
                                    <Clock size={12} className="text-[#3b82f6]" />
                                    <span className="text-[9px] font-bold uppercase tracking-widest">PUBLISHED: {new Date(featured.published_on * 1000).toLocaleTimeString()} UTC</span>
                                </div>
                                <h1 className="text-4xl lg:text-5xl font-black text-white italic tracking-tighter leading-[0.9] group-hover:text-[#3b82f6]/90 transition-colors uppercase decoration-[#3b82f6] decoration-4 underline-offset-8 group-hover:underline">
                                    {featured.title}
                                </h1>
                                <p className="text-sm text-slate-400 font-medium leading-relaxed italic opacity-70 line-clamp-2 max-w-2xl">
                                    "{featured.body}"
                                </p>
                            </div>
                        </motion.a>
                    )}

                    {/* Secondary Grid - Sleek & High Density */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {loading ? (
                            [1, 2, 3, 4].map(i => (
                                <div key={i} className="h-48 bg-white/[0.02] animate-pulse rounded-2xl border border-white/5" />
                            ))
                        ) : (
                            secondary.map((item, i) => (
                                <motion.a
                                    key={i}
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ y: -4 }}
                                    className="bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-[#3b82f6]/20 transition-all flex flex-col group rounded-2xl overflow-hidden"
                                >
                                    <div className="h-40 w-full overflow-hidden relative border-b border-white/5">
                                        <img
                                            src={getSmartImage(item)}
                                            alt={item.title}
                                            className="w-full h-full object-cover opacity-50 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                                        />
                                        <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-md rounded border border-white/10 text-[7px] font-black text-white uppercase tracking-widest italic">{item.source_info.name}</div>
                                    </div>
                                    <div className="p-5 space-y-3">
                                        <div className="flex items-center gap-2 text-slate-500 font-mono">
                                            <Clock size={10} />
                                            <span className="text-[8px] font-bold uppercase tracking-widest">{new Date(item.published_on * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} UTC</span>
                                        </div>
                                        <h3 className="text-sm font-black text-white italic tracking-tight leading-snug group-hover:text-[#3b82f6] transition-colors line-clamp-2 uppercase">
                                            {item.title}
                                        </h3>
                                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tight italic line-clamp-2 opacity-50 leading-relaxed font-mono">
                                            {item.body.slice(0, 80)}...
                                        </p>
                                    </div>
                                </motion.a>
                            ))
                        )}
                    </div>
                </div>
            )}
        </motion.div>
    );
};

// Compact news feed for dashboard - shows only 4 items
const QuickNewsFeed = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await fetch('https://min-api.cryptocompare.com/data/v2/news/?lang=ES');
                const data = await response.json();
                setNews(data.Data.slice(0, 4));
            } catch (error) {
                console.error('Error fetching news:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-white/[0.02] animate-pulse rounded-xl border border-white/5" />)}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {news.map((item, i) => (
                <motion.a
                    key={i}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -2 }}
                    className="bg-[#181A20] border border-white/[0.03] hover:border-[#3b82f6]/30 rounded-xl p-4 flex gap-4 group transition-all"
                >
                    <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-black/40 border border-white/5">
                        <img
                            src={item.imageurl || 'https://via.placeholder.com/64x64/1e2329/3b82f6?text=News'}
                            alt=""
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/64x64/1e2329/3b82f6?text=News'; }}
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="text-[11px] font-bold text-white group-hover:text-[#3b82f6] transition-colors line-clamp-2 leading-snug mb-2">
                            {item.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[8px] font-bold text-slate-600 uppercase tracking-widest">
                            <span className="text-[#3b82f6]">{item.source_info.name}</span>
                            <span>•</span>
                            <span>{new Date(item.published_on * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    </div>
                </motion.a>
            ))}
        </div>
    );
};

const MarketIntelligenceHub = () => {
    const [news, setNews] = useState([]);
    const [sentiment] = useState({ score: 72, label: 'BULLISH', strength: 'STRONG' });
    const [events] = useState([
        { id: 1, title: 'IPC Core (Mensual)', impact: 'HIGH', time: '14:30', currency: 'USD' },
        { id: 2, title: 'Discurso de Lagarde', impact: 'MEDIUM', time: '16:00', currency: 'EUR' }
    ]);

    useEffect(() => {
        const fetchHighlights = async () => {
            try {
                const response = await fetch('https://min-api.cryptocompare.com/data/v2/news/?lang=ES');
                const data = await response.json();
                setNews(data.Data.slice(0, 3));
            } catch (error) { }
        };
        fetchHighlights();
    }, []);

    return (
        <div className="grid lg:grid-cols-3 gap-6">
            {/* Top News Highlights */}
            <div className="lg:col-span-2 space-y-4">
                <div className="bg-[#181A20] border border-white/[0.03] rounded-2xl p-6 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 text-white/[0.01] group-hover:text-[#3b82f6]/5 transition-colors duration-500">
                        <Newspaper size={60} strokeWidth={1} />
                    </div>
                    <div className="flex items-center justify-between mb-6 relative z-10">
                        <h3 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-3 italic">
                            <TrendingUp size={14} className="text-[#3b82f6] animate-pulse" /> Intelligence_Stream
                        </h3>
                        <div className="px-2 py-0.5 bg-[#3b82f6]/10 border border-[#3b82f6]/20 rounded text-[7px] font-black text-[#3b82f6] uppercase tracking-widest italic">SYNC_LIVE</div>
                    </div>
                    <div className="space-y-3 relative z-10">
                        {news.map((item, i) => (
                            <motion.a
                                key={i}
                                href={item.url}
                                target="_blank"
                                whileHover={{ x: 4 }}
                                className="flex items-center gap-4 p-3 rounded-xl bg-black/20 border border-white/[0.02] hover:border-[#3b82f6]/30 transition-all cursor-pointer group/item"
                            >
                                <div className="w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-black/40 border border-white/5 relative">
                                    <img
                                        src={item.imageurl || 'https://images.unsplash.com/photo-1611974717482-95317aa18f1a?auto=format&fit=crop&q=80&w=60'}
                                        className="w-full h-full object-cover group-hover/item:scale-110 transition-all"
                                        onError={(e) => {
                                            e.target.src = 'https://images.unsplash.com/photo-1611974717482-95317aa18f1a?auto=format&fit=crop&q=80&w=60';
                                            e.target.onerror = null;
                                        }}
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-[11px] font-bold text-slate-300 group-hover/item:text-white transition-colors line-clamp-1">{item.title}</h4>
                                    <div className="flex items-center gap-3 mt-1.5">
                                        <span className="text-[8px] font-black text-[#3b82f6] uppercase tracking-tighter">{item.source_info.name}</span>
                                        <span className="w-1 h-1 rounded-full bg-slate-800" />
                                        <span className="text-[8px] font-bold text-slate-600 uppercase tracking-tighter italic">{new Date(item.published_on * 1000).toLocaleTimeString()} UTC</span>
                                    </div>
                                </div>
                                <ChevronRight size={12} className="text-slate-800 group-hover/item:text-[#3b82f6] transition-all" />
                            </motion.a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Market Intelligence (Sentiment + Next Events) */}
            <div className="flex flex-col gap-4">
                <div className="bg-[#181A20] border border-white/[0.03] rounded-2xl p-6 shadow-xl relative overflow-hidden group flex flex-col justify-between h-[180px]">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#3b82f6]/5 rounded-full blur-3xl opacity-50 transition-all group-hover:bg-[#3b82f6]/10" />
                    <h3 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-3 italic relative z-10">
                        <Zap size={14} className="text-[#3b82f6] animate-bounce" /> Market_Sentiment
                    </h3>
                    <div className="relative z-10">
                        <div className="flex items-baseline gap-2 mb-2">
                            <span className="text-4xl font-black text-white italic tracking-tighter">{sentiment.score}%</span>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${sentiment.label === 'BULLISH' ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}>{sentiment.label}</span>
                        </div>
                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${sentiment.score}%` }}
                                className={`h-full bg-[#0ecb81]`}
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-[#181A20] border border-white/[0.03] rounded-2xl p-6 shadow-xl relative overflow-hidden group flex flex-col justify-between">
                    <h3 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4 flex items-center gap-3 italic">
                        <Clock size={16} className="text-[#3b82f6]" /> Next_Major_Events
                    </h3>
                    <div className="space-y-3">
                        {events.map((ev) => (
                            <div key={ev.id} className="flex items-center justify-between p-2 rounded-lg bg-black/20 border border-white/[0.02]">
                                <div className="flex items-center gap-3">
                                    <div className={`w-1 h-1 rounded-full ${ev.impact === 'HIGH' ? 'bg-[#f6465d]' : 'bg-amber-500'}`} />
                                    <span className="text-[10px] font-bold text-white uppercase tracking-tight">{ev.title}</span>
                                </div>
                                <span className="text-[9px] font-mono font-bold text-slate-600 italic">{ev.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};


const MarketSentiment = () => {
    const [sentiment, setSentiment] = useState({ value: 50, label: 'Neutral' });

    useEffect(() => {
        const fetchSentiment = async () => {
            try {
                const response = await fetch('https://api.alternative.me/fng/');
                const data = await response.json();
                setSentiment({
                    value: parseInt(data.data[0].value),
                    label: data.data[0].value_classification.toUpperCase()
                });
            } catch (error) { }
        };
        fetchSentiment();
    }, []);

    return (
        <section className="bg-[#181A20] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
            <h2 className="text-xl font-black italic tracking-tight uppercase mb-8 flex items-center gap-3">
                <BarChart3 size={18} className="text-[#3b82f6]" /> SENTIMIENTO_<span className="text-[#3b82f6]">MERCADO</span>
            </h2>
            <div className="space-y-6">
                <div className="flex justify-between items-end mb-2">
                    <div className="text-left">
                        <span className="block text-[8px] text-slate-600 font-black uppercase tracking-widest mb-1">Índice</span>
                        <span className="text-2xl font-mono font-black text-white">{sentiment.value}%</span>
                    </div>
                    <div className="text-right">
                        <span className="block text-[8px] text-slate-600 font-black uppercase tracking-widest mb-1">Clasificación</span>
                        <span className={`text-2xl font-mono font-black ${sentiment.value > 60 ? 'text-[#0ecb81]' : sentiment.value < 40 ? 'text-[#f6465d]' : 'text-amber-500'}`}>{sentiment.label}</span>
                    </div>
                </div>
                <div className="h-4 bg-black/40 rounded-full overflow-hidden flex border border-white/5 p-1">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${sentiment.value}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className={`h-full rounded-full shadow-lg ${sentiment.value > 60 ? 'bg-[#0ecb81] shadow-[#0ecb81]/20' : sentiment.value < 40 ? 'bg-[#f6465d] shadow-[#f6465d]/20' : 'bg-amber-500 shadow-amber-500/20'}`}
                    />
                </div>
                <div className="bg-white/[0.02] p-4 rounded-2xl border border-white/5 text-center italic">
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                        Fuente: <span className="text-[#3b82f6]">Fear & Greed Index</span> • Tiempo Real
                    </p>
                </div>
            </div>
        </section>
    );
};



// --- MOTOR DE SIMULACIÓN ---
const useMarketSimulation = (initialSignals) => {
    const [signals, setSignals] = useState([]);

    // Sincronizar con señales iniciales/nuevas
    useEffect(() => {
        if (initialSignals && initialSignals.length > 0) {
            setSignals(prev => {
                // Preservar el precio 'current' si la señal ya existe para evitar saltos bruscos
                return initialSignals.map(newSig => {
                    const existing = prev.find(s => s.id === newSig.id);
                    return existing ? { ...newSig, current: existing.current, pips: existing.pips } : newSig;
                });
            });
        }
    }, [initialSignals]);

    useEffect(() => {
        const interval = setInterval(() => {
            setSignals(prev => prev.map(sig => {
                if (sig.status !== 'Active' && sig.status !== 'Activo') return sig;
                const isGold = sig.pair.includes('XAU') || sig.pair.includes('NAS') || sig.pair.includes('BTC');
                const volatility = isGold ? 0.8 : 0.00015;
                const noise = (Math.random() - 0.5) * volatility;
                const newPrice = parseFloat(sig.current || sig.entry) + noise;
                const multiplier = isGold ? 10 : 10000;
                const entry = parseFloat(sig.entry);
                const diff = sig.type.includes('BUY') ? (newPrice - entry) : (entry - newPrice);

                return {
                    ...sig,
                    current: newPrice.toFixed(isGold ? 2 : 5),
                    pips: (diff * multiplier).toFixed(1)
                };
            }));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return [signals, setSignals];
};

// --- SUPPORT USER VIEW COMPONENT ---
const SupportUserView = ({ user }) => {
    const [tickets, setTickets] = useState([]);
    const [activeTicket, setActiveTicket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [hoverRating, setHoverRating] = useState(0);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('list'); // 'list', 'create'
    const [newTicket, setNewTicket] = useState({ subject: '', priority: 'MEDIUM', region: 'GLOBAL' });
    const [messageText, setMessageText] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const { isLoading: isLoadingAuth } = useAuthStore();
    const fileInputRef = React.useRef(null);

    // Initial restore of active ticket from localStorage (scoped to user)
    useEffect(() => {
        if (user?.uid && !activeTicket) {
            const saved = localStorage.getItem(`activeSupportTicket_${user.uid}`);
            if (saved) setActiveTicket(saved);
        }
    }, [user?.uid]);

    // Persist active ticket in localStorage (scoped to user)
    useEffect(() => {
        if (activeTicket && user?.uid) {
            localStorage.setItem(`activeSupportTicket_${user.uid}`, activeTicket);
        }
    }, [activeTicket, user?.uid]);

    // Fetch User Tickets
    useEffect(() => {
        const fetchTickets = async () => {
            const userId = user?.uid || user?.id;
            if (!userId) {
                if (!isLoadingAuth) setLoading(false);
                return;
            }

            try {
                const response = await fetch(`http://localhost:5257/api/support/user/${userId}/tickets`);
                if (response.ok) {
                    const data = await response.json();
                    setTickets(data);
                }
            } catch (error) {
                console.error("Failed to fetch tickets:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTickets();
        const interval = setInterval(fetchTickets, 10000);
        return () => clearInterval(interval);
    }, [user?.uid, user?.id, isLoadingAuth]);

    // Fetch Messages
    useEffect(() => {
        if (!activeTicket) return;
        const fetchMessages = async () => {
            try {
                const response = await fetch(`http://localhost:5257/api/support/tickets/${activeTicket}/messages`);
                if (response.ok) {
                    const data = await response.json();
                    setMessages(data);
                }
            } catch (error) {
                console.error("Failed to fetch messages:", error);
            }
        };
        fetchMessages();
        const interval = setInterval(fetchMessages, 3000);
        return () => clearInterval(interval);
    }, [activeTicket]);

    // Handle Resolution Notification
    useEffect(() => {
        const current = tickets.find(t => t.id === activeTicket);
        if (current?.status === 'RESOLVED') {
            // Optional: Play a sound or show an alert if needed
            console.log("Ticket resolved notification trigger");
        }
    }, [tickets, activeTicket]);

    const handleCreateTicket = async (e) => {
        e.preventDefault();
        const userId = user?.uid || user?.id || 'test-user-id';
        try {
            const ticketData = {
                userId: userId,
                userName: user?.displayName || user?.name || 'Usuario',
                subject: newTicket.subject,
                priority: newTicket.priority,
                region: newTicket.region,
                status: 'OPEN'
            };

            const response = await fetch('http://localhost:5257/api/support/tickets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ticketData)
            });

            if (response.ok) {
                const createdTicket = await response.json();
                setTickets([createdTicket, ...tickets]);
                setActiveTicket(createdTicket.id);
                setViewMode('list');
                setNewTicket({ subject: '', priority: 'MEDIUM', region: 'GLOBAL' });
            }
        } catch (error) {
            console.error("Failed to create ticket:", error);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        const isResolved = tickets.find(t => t.id === activeTicket)?.status === 'RESOLVED';
        if ((!messageText && !imageFile) || !activeTicket || isResolved) return;

        let attachmentUrl = '';
        if (imageFile) {
            const formData = new FormData();
            formData.append('file', imageFile);
            try {
                const uploadRes = await fetch('http://localhost:5257/api/support/upload', {
                    method: 'POST',
                    body: formData
                });
                if (uploadRes.ok) {
                    const data = await uploadRes.json();
                    attachmentUrl = data.url;
                }
            } catch (err) {
                console.error("Upload failed", err);
                return;
            }
        }

        const newMessage = {
            ticketId: activeTicket,
            senderName: user?.displayName || user?.name || 'Usuario',
            message: messageText,
            attachmentUrl: attachmentUrl,
            isAdmin: false
        };

        try {
            const response = await fetch(`http://localhost:5257/api/support/tickets/${activeTicket}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newMessage)
            });

            if (response.ok) {
                const savedMsg = await response.json();
                setMessages([...messages, savedMsg]);
                setMessageText('');
                setImageFile(null);
                setShowEmojiPicker(false);
            }
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    const onEmojiClick = (emojiData) => {
        setMessageText(prev => prev + emojiData.emoji);
    };

    const currentTicket = tickets.find(t => t.id === activeTicket);

    return (
        <div className="w-full flex gap-6 h-full">
            {/* Ticket List / Create Area */}
            <div className="w-full lg:w-[320px] bg-[#181A20] border border-white/5 rounded-2xl flex flex-col overflow-hidden shadow-xl">
                <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#1e2329]/50">
                    <h3 className="text-xs font-black uppercase tracking-widest text-[#eaecef] italic">Mis_Tickets</h3>
                    <button
                        onClick={() => { setViewMode('create'); setActiveTicket(null); }}
                        className="p-2 bg-[#3b82f6]/10 hover:bg-[#3b82f6]/20 text-[#3b82f6] rounded-lg transition-all"
                    >
                        <Plus size={16} />
                    </button>
                </div>

                {viewMode === 'create' ? (
                    <div className="p-5 overflow-y-auto">
                        <div className="flex items-center gap-2 mb-6 cursor-pointer text-slate-500 hover:text-white transition-colors" onClick={() => setViewMode('list')}>
                            <ArrowLeft size={14} /> <span className="text-[10px] font-bold uppercase tracking-widest">Volver</span>
                        </div>
                        <h4 className="text-sm font-bold text-white mb-4">Nuevo Ticket</h4>
                        <form onSubmit={handleCreateTicket} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Asunto</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#3b82f6]"
                                    value={newTicket.subject}
                                    onChange={e => setNewTicket({ ...newTicket, subject: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Prioridad</label>
                                <select
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#3b82f6]"
                                    value={newTicket.priority}
                                    onChange={e => setNewTicket({ ...newTicket, priority: e.target.value })}
                                >
                                    <option value="LOW">Baja</option>
                                    <option value="MEDIUM">Media</option>
                                    <option value="HIGH">Alta</option>
                                    <option value="URGENT">Urgente</option>
                                </select>
                            </div>
                            <button type="submit" className="w-full py-3 bg-[#3b82f6] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-blue-600 transition-all">
                                Crear Ticket
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                        {loading ? <div className="text-center p-4 text-xs text-slate-500">Cargando...</div> :
                            tickets.length === 0 ? <div className="text-center p-4 text-xs text-slate-500">No tienes tickets.</div> :
                                tickets.map(ticket => (
                                    <button
                                        key={ticket.id}
                                        onClick={() => setActiveTicket(ticket.id)}
                                        className={`w-full p-4 text-left rounded-xl border transition-all ${activeTicket === ticket.id ? 'bg-[#3b82f6]/10 border-[#3b82f6]/30' : 'bg-black/20 border-white/5 hover:bg-white/[0.02]'}`}
                                    >
                                        <p className="text-[11px] font-bold text-slate-300 mb-2 truncate">{ticket.subject}</p>
                                        <div className="flex justify-between items-center">
                                            <span className={`text-[8px] font-bold px-2 py-0.5 rounded border ${ticket.status === 'OPEN' ? 'text-[#0ecb81] bg-[#0ecb81]/10 border-[#0ecb81]/20' : 'text-slate-500 bg-slate-500/10'}`}>
                                                {ticket.status}
                                            </span>
                                            <span className="text-[8px] font-mono text-slate-600">{new Date(ticket.lastActivity).toLocaleDateString()}</span>
                                        </div>
                                    </button>
                                ))}
                    </div>
                )}
            </div>

            {/* Chat Area */}
            <div className="flex-1 bg-[#181A20] border border-white/5 rounded-2xl flex flex-col overflow-hidden shadow-xl relative">
                {!activeTicket ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 opacity-50">
                        <MessageSquare size={48} className="mb-4" />
                        <p className="text-xs font-bold uppercase tracking-widest">Selecciona un ticket</p>
                    </div>
                ) : (
                    <>
                        <div className="p-4 border-b border-white/5 bg-[#1e2329]/50 flex justify-between items-center">
                            <div>
                                <h3 className="text-sm font-bold text-white mb-1">{currentTicket?.subject}</h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-[9px] font-mono text-slate-500">ID: {currentTicket?.id}</span>
                                    {currentTicket?.status?.toUpperCase() === 'RESOLVED' && <span className="text-[9px] font-bold text-[#0ecb81] bg-[#0ecb81]/10 px-2 rounded">RESUELTO</span>}
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-black/20">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${!msg.isAdmin ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[70%] ${!msg.isAdmin ? 'items-end' : 'items-start'} flex flex-col`}>
                                        <div className="flex items-center gap-2 px-1 mb-1">
                                            <span className="text-[9px] font-bold text-slate-600">{msg.senderName}</span>
                                            <span className="text-[8px] font-mono text-slate-700">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-lg overflow-hidden ${!msg.isAdmin
                                            ? 'bg-[#3b82f6] text-white rounded-tr-none'
                                            : 'bg-[#1e2329] text-slate-200 rounded-tl-none border border-white/5'
                                            }`}>
                                            {msg.attachmentUrl && (
                                                <img
                                                    src={`http://localhost:5257${msg.attachmentUrl}`}
                                                    alt="adjunto"
                                                    className="max-w-full h-auto rounded-lg mb-2 border border-black/20"
                                                />
                                            )}
                                            {msg.message}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 bg-[#1e2329]/50 border-t border-white/5 relative">
                            {currentTicket?.status?.toUpperCase() === 'RESOLVED' ? (
                                <div className="flex flex-col items-center justify-center py-4 space-y-3">
                                    <div className="flex items-center gap-2 text-[#0ecb81] bg-[#0ecb81]/10 px-4 py-2 rounded-xl border border-[#0ecb81]/20">
                                        <CheckCircle2 size={16} />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Conversación Finalizada</span>
                                    </div>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-center">
                                        Este ticket ha sido resuelto. Califica la atención recibida.
                                    </p>

                                    { /* Rating UI */}
                                    {currentTicket.rating ? (
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <Star key={star} size={20} className={star <= currentTicket.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-700"} />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="flex gap-2">
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <button
                                                        key={star}
                                                        onMouseEnter={() => setHoverRating(star)}
                                                        onMouseLeave={() => setHoverRating(0)}
                                                        onClick={async () => {
                                                            try {
                                                                await fetch(`http://localhost:5257/api/support/tickets/${activeTicket}/rate`, {
                                                                    method: 'POST',
                                                                    headers: { 'Content-Type': 'application/json' },
                                                                    body: JSON.stringify({ rating: star })
                                                                });
                                                                // Optimistic update
                                                                setTickets(prev => prev.map(t => t.id === activeTicket ? { ...t, rating: star } : t));
                                                            } catch (err) { console.error(err); }
                                                        }}
                                                        className="transition-transform hover:scale-110"
                                                    >
                                                        <Star
                                                            size={24}
                                                            className={star <= (hoverRating || 0) ? "text-yellow-400 fill-yellow-400" : "text-slate-600"}
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                                                {hoverRating === 1 ? 'Muy malo' : hoverRating === 2 ? 'Malo' : hoverRating === 3 ? 'Regular' : hoverRating === 4 ? 'Bueno' : hoverRating === 5 ? 'Excelente' : 'Selecciona'}
                                            </span>
                                        </div>
                                    )}

                                    <div className="h-px w-32 bg-white/10 my-2" />

                                    <button
                                        onClick={() => { setViewMode('create'); setActiveTicket(null); }}
                                        className="px-8 py-3 bg-[#3b82f6] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg flex items-center gap-2"
                                    >
                                        <Plus size={14} /> Nuevo Ticket
                                    </button>
                                </div>
                            ) : (
                                <>
                                    {/* Media Preview */}
                                    {imageFile && (
                                        <div className="absolute top-[-60px] right-4 p-2 bg-[#181A20] border border-white/10 rounded-xl shadow-xl flex items-center gap-3">
                                            <span className="text-xs text-slate-400 max-w-[150px] truncate">{imageFile.name}</span>
                                            <button onClick={() => setImageFile(null)} className="text-rose-500 hover:text-white"><XCircle size={16} /></button>
                                        </div>
                                    )}

                                    {/* Emoji Picker Popover */}
                                    {showEmojiPicker && (
                                        <div className="absolute bottom-20 right-4 z-50">
                                            <EmojiPicker onEmojiClick={onEmojiClick} theme="dark" width={300} height={400} />
                                        </div>
                                    )}

                                    <form className="flex gap-3 items-end" onSubmit={handleSendMessage}>
                                        <div className="flex gap-2 pb-3">
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="p-2 text-slate-500 hover:text-[#3b82f6] transition-colors"
                                            >
                                                <Paperclip size={20} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                                className={`p-2 transition-colors ${showEmojiPicker ? 'text-[#fcd535]' : 'text-slate-500 hover:text-[#fcd535]'}`}
                                            >
                                                <Smile size={20} />
                                            </button>
                                        </div>

                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => setImageFile(e.target.files[0])}
                                        />

                                        <input
                                            name="msg"
                                            autoComplete="off"
                                            type="text"
                                            value={messageText}
                                            onChange={(e) => setMessageText(e.target.value)}
                                            placeholder="Escribe tu mensaje..."
                                            className="flex-1 bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm text-[#eaecef] outline-none focus:border-[#3b82f6]/40 transition-all placeholder:text-slate-700"
                                        />
                                        <button
                                            type="submit"
                                            className="w-12 h-12 bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-xl flex items-center justify-center shadow-lg transition-all border border-white/10"
                                        >
                                            <Send size={18} />
                                        </button>
                                    </form>
                                </>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

// --- PROFILE MODAL COMPONENT ---
const ProfileModal = ({ isOpen, onClose, user, onUpdateUser }) => {
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [profileData, setProfileData] = useState({
        name: user?.name || 'Jerónimo García',
        email: user?.email || 'jeronimo@valorpro.com',
        phone: user?.phone || '+57 300 123 4567'
    });

    const [passwordData, setPasswordData] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    const [saveMessage, setSaveMessage] = useState('');

    const handleSaveProfile = () => {
        onUpdateUser(profileData);
        setIsEditing(false);
        setSaveMessage('Perfil actualizado correctamente');
        setTimeout(() => setSaveMessage(''), 3000);
    };

    const handleChangePassword = () => {
        if (passwordData.new !== passwordData.confirm) {
            setSaveMessage('Las contraseñas no coinciden');
            setTimeout(() => setSaveMessage(''), 3000);
            return;
        }
        if (passwordData.new.length < 8) {
            setSaveMessage('La contraseña debe tener al menos 8 caracteres');
            setTimeout(() => setSaveMessage(''), 3000);
            return;
        }
        setSaveMessage('Contraseña actualizada correctamente');
        setPasswordData({ current: '', new: '', confirm: '' });
        setTimeout(() => setSaveMessage(''), 3000);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-[#0d1117] border border-white/10 rounded-[2rem] w-full max-w-lg overflow-hidden shadow-2xl"
                >
                    {/* Modal Header */}
                    <div className="flex items-center justify-between p-6 border-b border-white/5">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-emerald-500/20">
                                {profileData.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                                <h2 className="text-lg font-black text-white uppercase tracking-tight italic">{profileData.name}</h2>
                                <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Trader Pro</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-slate-500 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-white/5">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`flex-1 py-4 text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'profile' ? 'text-[#3b82f6] border-b-2 border-[#3b82f6] bg-[#3b82f6]/5' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            <User size={14} className="inline mr-2" />
                            Perfil_Alpha
                        </button>
                        <button
                            onClick={() => setActiveTab('security')}
                            className={`flex-1 py-4 text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'security' ? 'text-[#3b82f6] border-b-2 border-[#3b82f6] bg-[#3b82f6]/5' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            <Lock size={14} className="inline mr-2" />
                            Seguridad_Node
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-5">
                        {saveMessage && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`p-3 rounded-xl text-[11px] font-bold uppercase tracking-widest text-center ${saveMessage.includes('correctamente') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}
                            >
                                {saveMessage}
                            </motion.div>
                        )}

                        {activeTab === 'profile' && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                                        <User size={12} className="inline mr-1" /> Nombre Completo
                                    </label>
                                    <input
                                        type="text"
                                        value={profileData.name}
                                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                        disabled={!isEditing}
                                        className={`w-full bg-black/40 border rounded-xl px-4 py-3 text-sm font-medium text-white outline-none transition-all ${isEditing ? 'border-[#3b82f6]/50 focus:border-[#3b82f6]' : 'border-white/10 opacity-70'}`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                                        <Mail size={12} className="inline mr-1" /> Correo Electrónico
                                    </label>
                                    <input
                                        type="email"
                                        value={profileData.email}
                                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                        disabled={!isEditing}
                                        className={`w-full bg-black/40 border rounded-xl px-4 py-3 text-sm font-medium text-white outline-none transition-all ${isEditing ? 'border-[#3b82f6]/50 focus:border-[#3b82f6]' : 'border-white/10 opacity-70'}`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                                        <Phone size={12} className="inline mr-1" /> Teléfono
                                    </label>
                                    <input
                                        type="tel"
                                        value={profileData.phone}
                                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                        disabled={!isEditing}
                                        className={`w-full bg-black/40 border rounded-xl px-4 py-3 text-sm font-medium text-white outline-none transition-all ${isEditing ? 'border-[#3b82f6]/50 focus:border-[#3b82f6]' : 'border-white/10 opacity-70'}`}
                                    />
                                </div>

                                <div className="flex gap-3 pt-2">
                                    {isEditing ? (
                                        <>
                                            <button
                                                onClick={handleSaveProfile}
                                                className="flex-1 py-3 bg-[#3b82f6] hover:bg-[#2563eb] text-white text-[11px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#3b82f6]/20"
                                            >
                                                <Save size={14} /> Guardar Cambios
                                            </button>
                                            <button
                                                onClick={() => setIsEditing(false)}
                                                className="px-6 py-3 bg-white/5 hover:bg-white/10 text-slate-400 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all border border-white/10"
                                            >
                                                Cancelar
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white text-[11px] font-black uppercase tracking-widest rounded-xl transition-all border border-white/10 flex items-center justify-center gap-2"
                                        >
                                            <Edit3 size={14} /> Editar Perfil
                                        </button>)}
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Contraseña Actual</label>
                                    <div className="relative">
                                        <input
                                            type={showCurrentPassword ? 'text' : 'password'}
                                            value={passwordData.current}
                                            onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                                            placeholder="••••••••"
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono text-white outline-none focus:border-[#3b82f6]/50 transition-all pr-12"
                                        />
                                        <button
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                                        >
                                            {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Nueva Contraseña</label>
                                    <div className="relative">
                                        <input
                                            type={showNewPassword ? 'text' : 'password'}
                                            value={passwordData.new}
                                            onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                                            placeholder="Mínimo 8 caracteres"
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono text-white outline-none focus:border-[#3b82f6]/50 transition-all pr-12"
                                        />
                                        <button
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                                        >
                                            {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Confirmar Contraseña</label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={passwordData.confirm}
                                            onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                                            placeholder="Repite la nueva contraseña"
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono text-white outline-none focus:border-[#3b82f6]/50 transition-all pr-12"
                                        />
                                        <button
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                                        >
                                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={handleChangePassword}
                                    disabled={!passwordData.current || !passwordData.new || !passwordData.confirm}
                                    className="w-full py-3 bg-[#3b82f6] hover:bg-[#2563eb] disabled:bg-slate-800 disabled:text-slate-500 text-white text-[11px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 mt-2 shadow-lg shadow-[#3b82f6]/10"
                                >
                                    <Lock size={14} /> Actualizar Contraseña
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// --- REUSABLE INSTITUTIONAL COMPONENTS ---

const KPICard = ({ label, value, subValue, icon: Icon, color, trend = [20, 40, 30, 70, 50, 80, 75] }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-[#181A20] border border-white/[0.03] p-6 rounded-2xl group hover:border-[#3b82f6]/30 transition-all shadow-2xl relative overflow-hidden"
    >
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-5 group-hover:opacity-10 transition-opacity" style={{ background: '#3b82f6' }} />

        {/* Sparkline Visual */}
        <div className="absolute bottom-0 left-0 right-0 h-10 opacity-10">
            <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="w-full h-full">
                <path
                    d={`M 0 20 ${trend.map((v, idx) => `L ${(idx / (trend.length - 1)) * 100} ${20 - (v / 100) * 20}`).join(' ')} L 100 20 Z`}
                    fill="#3b82f6"
                />
                <path
                    d={`M 0 ${20 - (trend[0] / 100) * 20} ${trend.map((v, idx) => `L ${(idx / (trend.length - 1)) * 100} ${20 - (v / 100) * 20}`).join(' ')}`}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="1.5"
                />
            </svg>
        </div>

        <div className="flex items-start justify-between mb-4 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-black/60 flex items-center justify-center border border-white/5 text-[#3b82f6] shadow-inner">
                <Icon size={18} strokeWidth={2.5} />
            </div>
            {subValue && (
                <span className={`text-[8px] font-black px-2 py-1 rounded border ${subValue.includes('+') ? 'text-[#0ecb81] bg-[#0ecb81]/5 border-[#0ecb81]/10' : 'text-slate-400 bg-white/5 border-white/5'}`}>
                    {subValue}
                </span>
            )}
        </div>
        <div className="relative z-10">
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] block mb-1 group-hover:text-slate-300 transition-colors">{label}</span>
            <span className="text-2xl font-mono font-black text-white tracking-widest tabular-nums italic uppercase">{value}</span>
        </div>
    </motion.div>
);

const MarketMarquee = () => {
    const symbols = [
        { name: 'BTC/USDT', price: '42,120.50', change: '+2.4%', up: true },
        { name: 'ETH/USDT', price: '2,245.10', change: '+1.8%', up: true },
        { name: 'XAU/USD', price: '2,024.15', change: '-0.3%', up: false },
        { name: 'EUR/USD', price: '1.08540', change: '+0.1%', up: true },
        { name: 'GBP/JPY', price: '185.420', change: '+0.5%', up: true },
        { name: 'SOL/USDT', price: '94.20', change: '+5.2%', up: true },
    ];

    return (
        <div className="bg-[#1e2329] border-y border-white/[0.03] py-2 overflow-hidden flex items-center shadow-lg relative z-30">
            <div className="flex animate-marquee whitespace-nowrap gap-12 px-6">
                {[...symbols, ...symbols].map((s, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-white italic uppercase tracking-widest">{s.name}</span>
                        <span className="text-[10px] font-mono font-bold text-slate-300">{s.price}</span>
                        <span className={`text-[9px] font-black ${s.up ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}>{s.change}</span>
                    </div>
                ))}
            </div>
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#0B0E11] to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#0B0E11] to-transparent z-10" />
        </div>
    );
};

const RiskCalculator = () => {
    const [balance, setBalance] = useState('');
    const [riskPercent, setRiskPercent] = useState('');
    const [stopLossPips, setStopLossPips] = useState('');
    const [selectedPair, setSelectedPair] = useState('XAUUSD');

    // Pip values per standard lot (1.0) - these vary by pair
    const pairData = {
        'XAUUSD': { pipValue: 10, pipSize: 0.1, label: 'Oro' },      // $10 per pip per lot
        'EURUSD': { pipValue: 10, pipSize: 0.0001, label: 'EUR/USD' }, // $10 per pip per lot
        'GBPUSD': { pipValue: 10, pipSize: 0.0001, label: 'GBP/USD' },
        'USDJPY': { pipValue: 6.67, pipSize: 0.01, label: 'USD/JPY' }, // ~$6.67 per pip per lot
        'NAS100': { pipValue: 1, pipSize: 1, label: 'NASDAQ' },       // $1 per point per lot
        'US30': { pipValue: 1, pipSize: 1, label: 'Dow Jones' },
    };

    // Calculate lot size based on formula:
    // Lot Size = (Account Balance × Risk %) / (Stop Loss in Pips × Pip Value per Lot)
    const calculateLotSize = () => {
        const bal = parseFloat(balance) || 0;
        const risk = parseFloat(riskPercent) || 0;
        const sl = parseFloat(stopLossPips) || 0;
        const pipValue = pairData[selectedPair].pipValue;

        if (bal <= 0 || risk <= 0 || sl <= 0) return null;

        const riskAmount = bal * (risk / 100);    // Amount willing to risk in $
        const lotSize = riskAmount / (sl * pipValue);

        return {
            lotSize: Math.max(0.01, lotSize).toFixed(2),
            riskAmount: riskAmount.toFixed(2),
            pipValue: pipValue
        };
    };

    const result = calculateLotSize();

    return (
        <div className="space-y-6">
            {/* Pair Selector */}
            <div>
                <label className="block text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2.5">
                    Instrumento_Financiero
                </label>
                <div className="relative group">
                    <select
                        value={selectedPair}
                        onChange={(e) => setSelectedPair(e.target.value)}
                        className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3.5 text-sm font-mono text-white outline-none focus:border-[#3b82f6]/50 transition-all hover:border-white/10 cursor-pointer appearance-none shadow-inner"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%233b82f6'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center', backgroundSize: '14px' }}
                    >
                        {Object.entries(pairData).map(([pair, data]) => (
                            <option key={pair} value={pair} className="bg-[#181A20] text-white py-2">
                                {pair} • {data.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* Balance Input */}
                <div>
                    <label className="block text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2.5">
                        Balance ($)
                    </label>
                    <input
                        type="number"
                        value={balance}
                        onChange={(e) => setBalance(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3.5 text-sm font-mono text-white outline-none focus:border-[#3b82f6]/50 transition-all shadow-inner"
                    />
                </div>

                {/* Stop Loss Input */}
                <div>
                    <label className="block text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2.5">
                        Stop_Loss (Pips)
                    </label>
                    <input
                        type="number"
                        value={stopLossPips}
                        onChange={(e) => setStopLossPips(e.target.value)}
                        placeholder="20"
                        className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3.5 text-sm font-mono text-white outline-none focus:border-[#3b82f6]/50 transition-all shadow-inner"
                    />
                </div>
            </div>

            {/* Risk Percent */}
            <div>
                <label className="block text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2.5">
                    Exposición_Riesgo (%)
                </label>
                <div className="flex gap-2">
                    {[1, 2, 5].map((percent) => (
                        <button
                            key={percent}
                            onClick={() => setRiskPercent(percent.toString())}
                            className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all border ${riskPercent === percent.toString()
                                ? 'bg-[#3b82f6] text-white border-[#3b82f6] shadow-[0_5px_15px_rgba(59,130,246,0.3)]'
                                : 'bg-white/[0.02] text-slate-500 border-white/5 hover:border-white/20'
                                }`}
                        >
                            {percent}%
                        </button>
                    ))}
                    <input
                        type="number"
                        value={riskPercent}
                        onChange={(e) => setRiskPercent(e.target.value)}
                        placeholder="%"
                        className="w-16 bg-black/40 border border-white/5 rounded-xl px-2 text-sm font-mono text-white outline-none focus:border-[#3b82f6]/50 transition-all text-center"
                    />
                </div>
            </div>

            {/* Results Display */}
            <AnimatePresence mode="wait">
                {result ? (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="space-y-4"
                    >
                        <div className="p-6 bg-gradient-to-br from-[#181A20] to-black rounded-3xl border border-[#3b82f6]/20 text-center shadow-2xl relative overflow-hidden">
                            <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#3b82f6]/10 rounded-full blur-3xl" />
                            <span className="block text-[9px] text-[#3b82f6] uppercase font-black tracking-[0.2em] mb-2 relative z-10">
                                Lote_Recomendado_Senz
                            </span>
                            <span className="text-4xl font-mono font-black text-white tracking-tighter relative z-10">
                                {result.lotSize}
                            </span>
                            <span className="block text-[10px] font-bold text-slate-600 uppercase mt-2">Volume_Standard</span>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                                <span className="block text-[8px] text-slate-700 uppercase font-black tracking-widest mb-1.5">Capital_Arriesgado</span>
                                <span className="text-lg font-mono font-bold text-[#f6465d]">${result.riskAmount}</span>
                            </div>
                            <div className="bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                                <span className="block text-[8px] text-slate-700 uppercase font-black tracking-widest mb-1.5">Valor_Punto_Lote</span>
                                <span className="text-lg font-mono font-bold text-[#3b82f6]">${(result.pipValue * parseFloat(result.lotSize)).toFixed(2)}</span>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <div className="p-10 bg-white/[0.01] rounded-3xl border border-dashed border-white/5 text-center">
                        <Calculator size={32} className="mx-auto text-slate-800 mb-4" />
                        <span className="block text-[9px] text-slate-600 uppercase font-black tracking-[0.2em]">
                            Esperando_Parámetros_Cálculo
                        </span>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const AnalysisViewerModal = ({ signal, onClose }) => {
    if (!signal) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-xl">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 cursor-zoom-out"
                    onClick={onClose}
                />

                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-5xl bg-[#181A20] border border-white/10 rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
                >
                    {/* Sección de Imagen */}
                    <div className="md:w-3/5 bg-black/40 relative group flex items-center justify-center">
                        {signal.imageUrl ? (
                            <img
                                src={signal.imageUrl}
                                className="w-full h-full object-contain"
                                alt="Technical Analysis Chart"
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center text-slate-700 py-20">
                                <ImageIcon size={64} strokeWidth={1} />
                                <span className="text-[10px] font-black mt-4 uppercase tracking-[0.3em]">No_Chart_Data</span>
                            </div>
                        )}
                        <div className="absolute top-6 left-6 flex gap-2">
                            <span className="bg-[#3b82f6] text-white text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest shadow-lg">
                                {signal.pair}
                            </span>
                            <span className={`text-white text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest shadow-lg ${signal.type?.includes('BUY') ? 'bg-[#0ecb81]' : 'bg-[#f6465d]'}`}>
                                {signal.type}
                            </span>
                        </div>
                    </div>

                    {/* Sección de Análisis */}
                    <div className="md:w-2/5 p-8 md:p-10 flex flex-col bg-[#181A20] border-l border-white/5 relative">
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 w-10 h-10 rounded-xl bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-all flex items-center justify-center border border-white/5"
                        >
                            <X size={20} />
                        </button>

                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-2">
                                <Activity size={14} className="text-[#3b82f6]" />
                                <span className="text-[9px] font-black text-[#3b82f6] uppercase tracking-[0.2em]">Alpha_Market_Intelligence</span>
                            </div>
                            <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-tight">
                                Análisis Técnico_<span className="text-[#3b82f6]">Reporte</span>
                            </h2>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 mb-8">
                            <div className="space-y-6">
                                <div>
                                    <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest block mb-3">Conclusión Analítica</span>
                                    <p className="text-sm text-slate-300 leading-relaxed italic border-l-2 border-[#3b82f6]/30 pl-4 py-1 bg-[#3b82f6]/5 rounded-r-xl">
                                        "{signal.analysis || 'No se ha proporcionado una descripción detallada para este análisis. El motor de búsqueda basa esta señal en patrones institucionales de volumen y acción de precio detectados en los últimos marcos temporales.'}"
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                                        <span className="text-[8px] font-black text-slate-500 uppercase block mb-1">Entry_Node</span>
                                        <span className="text-sm font-mono font-bold text-white">{signal.entry}</span>
                                    </div>
                                    <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                                        <span className="text-[8px] font-black text-[#f6465d]/70 uppercase block mb-1">Shield_SL</span>
                                        <span className="text-sm font-mono font-bold text-[#f6465d]">{signal.sl}</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest block mb-1">Target_Nodes</span>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between p-3 bg-[#0ecb81]/5 border border-[#0ecb81]/20 rounded-xl">
                                            <span className="text-[8px] font-black text-[#0ecb81] uppercase italic">Priority_Target_01</span>
                                            <span className="text-xs font-mono font-black text-[#0ecb81]">{signal.tp || signal.tp1}</span>
                                        </div>
                                        {signal.tp2 && (
                                            <div className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                                                <span className="text-[8px] font-black text-slate-500 uppercase">Target_Ex_02</span>
                                                <span className="text-xs font-mono font-bold text-slate-300">{signal.tp2}</span>
                                            </div>
                                        )}
                                        {signal.tp3 && (
                                            <div className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                                                <span className="text-[8px] font-black text-slate-500 uppercase">Target_Ex_03</span>
                                                <span className="text-xs font-mono font-bold text-slate-300">{signal.tp3}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="w-full py-5 bg-[#3b82f6] hover:bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all shadow-xl shadow-[#3b82f6]/20 flex items-center justify-center gap-3 italic"
                        >
                            Cerrar_Ficha <ArrowUpRight size={14} />
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

// --- SIGNAL DETAIL MODAL ---
const SignalDetailModal = ({ signal, onClose }) => {
    if (!signal) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#181A20] border border-white/10 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative"
            >
                {/* Header Decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-10 pointer-events-none" style={{ background: signal.type === 'BUY' ? '#0ecb81' : '#f6465d' }} />

                <div className="p-6 relative z-10">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h2 className="text-4xl font-black italic tracking-tighter uppercase text-white leading-none">{signal.pair}</h2>
                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase border ${signal.type === 'BUY' ? 'bg-[#0ecb81]/10 text-[#0ecb81] border-[#0ecb81]/20' : 'bg-[#f6465d]/10 text-[#f6465d] border-[#f6465d]/20'}`}>
                                    {signal.type === 'BUY' ? '▲ COMPRA' : '▼ VENTA'}
                                </span>
                            </div>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">EMITIDA: {signal.time}</span>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Price Grid */}
                    <div className="space-y-4 mb-8">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                                <span className="text-[8px] font-black text-slate-600 uppercase block mb-1 tracking-widest">ENTRADA</span>
                                <p className="font-mono font-bold text-white text-lg">{signal.entry}</p>
                            </div>
                            <div className="bg-black/40 p-4 rounded-2xl border border-[#f6465d]/10">
                                <span className="text-[8px] font-black text-[#f6465d]/60 uppercase block mb-1 tracking-widest">STOP LOSS</span>
                                <p className="font-mono font-bold text-[#f6465d] text-lg">{signal.sl}</p>
                            </div>
                        </div>

                        {/* TPs */}
                        <div className="bg-black/40 p-4 rounded-2xl border border-[#0ecb81]/10">
                            <span className="text-[8px] font-black text-[#0ecb81]/60 uppercase block mb-4 text-center tracking-widest">OBJETIVOS (TAKE PROFIT)</span>
                            <div className="flex justify-around items-center">
                                <div className="text-center">
                                    <span className="text-[8px] text-slate-500 font-bold block mb-1">TP 1</span>
                                    <p className="font-mono font-bold text-[#0ecb81] text-base">{signal.tp}</p>
                                </div>
                                {signal.tp2 && (
                                    <>
                                        <div className="w-px h-8 bg-white/5" />
                                        <div className="text-center">
                                            <span className="text-[8px] text-slate-500 font-bold block mb-1">TP 2</span>
                                            <p className="font-mono font-bold text-[#0ecb81]/90 text-base">{signal.tp2}</p>
                                        </div>
                                    </>
                                )}
                                {signal.tp3 && (
                                    <>
                                        <div className="w-px h-8 bg-white/5" />
                                        <div className="text-center">
                                            <span className="text-[8px] text-slate-500 font-bold block mb-1">TP 3</span>
                                            <p className="font-mono font-bold text-[#0ecb81]/80 text-base">{signal.tp3}</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Analysis & Actions */}
                    {signal.analysis && (
                        <div className="mb-6 p-4 rounded-2xl bg-[#3b82f6]/5 border border-[#3b82f6]/10">
                            <span className="text-[8px] font-black text-[#3b82f6] uppercase tracking-widest mb-2 flex items-center gap-2">
                                <Info size={12} /> ANÁLISIS TÉCNICO
                            </span>
                            <p className="text-xs text-slate-400 leading-relaxed italic">
                                "{signal.analysis}"
                            </p>
                        </div>
                    )}

                    <div className="flex gap-3">
                        {signal.imageUrl && (
                            <button
                                onClick={() => window.open(signal.imageUrl, '_blank')}
                                className="flex-1 py-4 bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                            >
                                <Eye size={16} /> VER GRÁFICO
                            </button>
                        )}
                        <button className="flex-1 py-4 bg-white/[0.05] hover:bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 border border-white/5">
                            OPEN_SMART_ORDER ↗
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

const DashboardPage = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const [activeSection, setActiveSection] = useState('dashboard');
    const [collapsed, setCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date().toUTCString().split(' ')[4]);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [selectedAnalysis, setSelectedAnalysis] = useState(null);
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeToday: 0,
        newLast7Days: 0,
        retentionRate: '0%',
        loading: true
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('http://localhost:5257/api/users/stats');
                const data = await response.json();
                if (data.success) {
                    setStats({ ...data.stats, loading: false });
                }
            } catch (error) {
                console.error('Error fetching stats:', error);
                setStats(s => ({ ...s, loading: false }));
            }
        };
        fetchStats();
    }, []);
    const [userData, setUserData] = useState({
        name: user?.name || 'Jerónimo García',
        email: user?.email || 'jeronimo@valorpro.com',
        phone: '+57 300 123 4567'
    });

    const [rawSignals, setRawSignals] = useState([]);
    const [signalsLoading, setSignalsLoading] = useState(true);
    const [plans, setPlans] = useState([]);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await fetch('http://localhost:5257/api/plans');
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

    // Audio de notificación
    // Audio Ref for persistent instance and unlocking
    const audioRef = React.useRef(new Audio('/sounds/cash_register.mp3'));
    const isFirstRun = React.useRef(true);

    // Audio Unlocker: Browsers block autoplay until user interacts. 
    useEffect(() => {
        const unlockAudio = () => {
            const audio = audioRef.current;
            if (audio) {
                audio.volume = 0; // Mute for unlock
                audio.play().then(() => {
                    audio.pause();
                    audio.currentTime = 0;
                    audio.volume = 0.5; // Restore volume
                    document.removeEventListener('click', unlockAudio);
                    document.removeEventListener('keydown', unlockAudio);
                }).catch(e => { /* Ignore unlock errors */ });
            }
        };

        document.addEventListener('click', unlockAudio);
        document.addEventListener('keydown', unlockAudio);

        return () => {
            document.removeEventListener('click', unlockAudio);
            document.removeEventListener('keydown', unlockAudio);
        };
    }, []);

    const playSignalSound = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (audio.volume < 0.1) audio.volume = 0.5;
        audio.currentTime = 0;

        audio.play().catch(e => {
            if (e.name === 'NotAllowedError') {
                console.warn('Audio blocked. Click anywhere to enable.');
            } else {
                console.error('Audio playback error:', e);
            }
        });
    };

    useEffect(() => {
        setSignalsLoading(true);

        const q = collection(db, "signals");

        const unsubscribe = onSnapshot(q, (snapshot) => {
            if (isFirstRun.current) {
                isFirstRun.current = false;
                const data = snapshot.docs
                    .map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                        createdAt: doc.data().createdAt?.toDate?.() || new Date()
                    }))
                    .filter(s => ['Active', 'BE', 'TP1', 'TP2', 'TP3'].includes(s.status))
                    .sort((a, b) => b.createdAt - a.createdAt);
                setRawSignals(data);
                setSignalsLoading(false);
                return;
            }

            // Check for changes to trigger sound
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    // Play sound for new active signals
                    const data = change.doc.data();
                    if (['Active', 'Activo'].includes(data.status)) {
                        console.log('🔔 New Signal Sound Triggered');
                        playSignalSound();
                    }
                }
                if (change.type === "modified") {
                    const data = change.doc.data();
                    // Play sound for meaningful status updates
                    if (['BE', 'TP1', 'TP2', 'TP3'].includes(data.status)) {
                        console.log('🔔 Status Update Sound Triggered:', data.status);
                        playSignalSound();
                    }
                }
            });

            const data = snapshot.docs
                .map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    createdAt: doc.data().createdAt?.toDate?.() || new Date()
                }))
                .filter(s => ['Active', 'BE', 'TP1', 'TP2', 'TP3'].includes(s.status))
                .sort((a, b) => b.createdAt - a.createdAt);

            console.log('🔥 REAL-TIME SIGNALS:', data.length);
            setRawSignals(data);
            setSignalsLoading(false);
        }, (error) => {
            console.error('Firestore Error:', error);
            setSignalsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const memoizedSignals = useMemo(() => rawSignals.map(s => ({
        id: s.id,
        pair: s.pair,
        type: s.type,
        orderType: s.orderType,
        entry: s.entry,
        current: s.entry,
        pips: '0.0',
        tp: s.tp1,
        tp2: s.tp2,
        tp3: s.tp3,
        sl: s.sl,
        status: s.status,
        analysis: s.analysis,
        imageUrl: s.imageUrl,
        time: new Date(s.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    })), [rawSignals]);

    const [activeSignals] = useMarketSimulation(memoizedSignals);


    const [announcements, setAnnouncements] = useState([]);
    const [rawNews, setRawNews] = useState([]);
    const [timeTick, setTimeTick] = useState(new Date());

    // 1. Time Ticker - forces update every 30s to check if scheduled items should now show
    useEffect(() => {
        const timer = setInterval(() => setTimeTick(new Date()), 30000);
        return () => clearInterval(timer);
    }, []);

    // 2. Data fetching from Firestore
    useEffect(() => {
        const q = query(collection(db, "News"), orderBy("SentAt", "desc"), limit(50));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => {
                const item = doc.data();
                const parseDate = (val) => {
                    if (!val) return null;
                    if (val.toDate) return val.toDate();
                    return new Date(val);
                };
                return {
                    id: doc.id,
                    ...item,
                    sentAtDate: parseDate(item.SentAt || item.sentAt),
                    scheduledDate: parseDate(item.ScheduledFor || item.scheduledFor),
                    expiresDate: parseDate(item.ExpiresAt || item.expiresAt)
                };
            });
            setRawNews(data);
        }, (err) => {
            console.error("Firestore News Error:", err);
            toast.error("Error al cargar noticias");
        });
        return () => unsubscribe();
    }, []);

    // 3. Filtering & Display logic based on Data AND Time
    useEffect(() => {
        const now = timeTick;
        const filtered = rawNews
            .filter(item => {
                const isExpired = item.expiresDate && item.expiresDate < now;
                const isReady = !item.scheduledDate || item.scheduledDate <= now;
                return !isExpired && isReady;
            })
            .sort((a, b) => (b.scheduledDate || b.sentAtDate) - (a.scheduledDate || a.sentAtDate))
            .slice(0, 3)
            .map(item => {
                const dateToShow = item.scheduledDate || item.sentAtDate;
                const timeString = dateToShow ? dateToShow.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--';
                const type = item.Type || item.type;
                const category = item.Category || item.category;

                return {
                    id: item.id,
                    title: item.Title || item.title || 'Sin Título',
                    type: (type === 'Urgente' || category === 'Sistema') ? 'warning' : 'info',
                    icon: (category === 'Sistema' || type === 'Urgente') ? AlertCircle : Zap,
                    time: timeString
                };
            });
        setAnnouncements(filtered);
    }, [rawNews, timeTick]);


    // Fear & Greed Index API - Real-time sentiment
    const [sentiment, setSentiment] = useState({ value: 50, label: 'Neutral', loading: true });

    // UI State
    const [selectedSignal, setSelectedSignal] = useState(null);

    useEffect(() => {
    }, []);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date().toUTCString().split(' ')[4]), 1000);
        return () => clearInterval(timer);
    }, []);

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'signals', label: 'Señales', icon: Signal },
        { id: 'news', label: 'Noticias', icon: Newspaper },
        { id: 'plans', label: 'Mejorar Plan', icon: CreditCard },
        { id: 'support', label: 'Soporte', icon: Headphones },
        { id: 'academy', label: 'Academia', icon: Globe },
    ];

    return (
        <div className="min-h-screen bg-[#0B0E11] text-[#eaecef] flex overflow-hidden font-sans selection:bg-[#3b82f6]/30">

            {/* SIDEBAR - Binance Institutional Style */}
            <motion.aside
                initial={false}
                animate={{ width: collapsed ? 80 : 280 }}
                className="hidden lg:flex flex-col border-r border-white/5 bg-[#0B0E11] relative z-50 overflow-hidden shadow-[10px_0_30px_rgba(0,0,0,0.5)]"
            >
                <div className="p-8 h-20 flex items-center justify-between border-b border-white/[0.03]">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-[#3b82f6] rounded-xl flex items-center justify-center border border-white/10 shadow-[0_4px_20px_rgba(59,130,246,0.3)]">
                            <Activity className="text-white" size={20} strokeWidth={3} />
                        </div>
                        {!collapsed && (
                            <div className="flex flex-col">
                                <span className="text-lg font-black text-white uppercase tracking-tighter italic leading-none">Senzacional<span className="text-[#3b82f6] not-italic">.</span></span>
                                <span className="text-[8px] font-black text-[#3b82f6] uppercase tracking-[0.4em] mt-1 opacity-80">Institutional_Node</span>
                            </div>
                        )}
                    </div>
                </div>

                <nav className="flex-1 px-4 py-8 space-y-1.5">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveSection(item.id)}
                            className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all group relative border ${activeSection === item.id ? 'bg-[#1e2329] text-[#3b82f6] border-white/5 shadow-xl' : 'text-slate-500 hover:bg-white/[0.02] hover:text-white border-transparent'}`}
                        >
                            <item.icon size={20} strokeWidth={activeSection === item.id ? 2.5 : 2} className={activeSection === item.id ? 'text-[#3b82f6]' : 'group-hover:text-white'} />
                            {!collapsed && (
                                <span className={`text-[10px] font-black uppercase tracking-[0.2em] italic ${activeSection === item.id ? 'text-[#3b82f6]' : ''}`}>
                                    {item.label}
                                </span>
                            )}
                            {activeSection === item.id && !collapsed && (
                                <motion.div layoutId="navIndicator" className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#3b82f6] shadow-[0_0_20px_rgba(59,130,246,0.8)] rounded-r-full" />
                            )}
                        </button>
                    ))}
                </nav>

                <div className="p-6 border-t border-white/5 bg-black/40">
                    <button onClick={() => setIsProfileOpen(true)} className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-[#1e2329] transition-all group">
                        <div className="w-10 h-10 rounded-xl bg-[#1e2329] border border-white/10 flex items-center justify-center text-[#3b82f6] font-mono font-bold group-hover:border-[#3b82f6]/50 transition-all shadow-inner relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#3b82f6]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            {user?.name?.split(' ').map(n => n[0]).join('') || 'JR'}
                        </div>
                        {!collapsed && (
                            <div className="text-left flex-1 min-w-0">
                                <p className="text-[10px] font-black text-white truncate uppercase tracking-widest">{user?.name || 'Trader Alpha'}</p>
                                <p className="text-[8px] font-bold text-[#3b82f6] uppercase tracking-widest mt-1 opacity-70">Trader_PRO</p>
                            </div>
                        )}
                    </button>
                </div>
            </motion.aside>

            {/* MAIN VIEWPORT */}
            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">

                {/* TECHNICAL HEADER - Binance Institutional */}
                <header className="h-20 shrink-0 border-b border-white/[0.03] px-8 flex items-center justify-between sticky top-0 bg-[#0B0E11]/95 backdrop-blur-3xl z-40 border-l border-white/[0.01]">
                    <div className="flex items-center gap-8">
                        <button onClick={() => setCollapsed(!collapsed)} className="p-2.5 text-slate-500 hover:text-[#3b82f6] bg-white/[0.02] rounded-xl border border-white/[0.05] transition-all hidden lg:block hover:border-[#3b82f6]/30">
                            <Menu size={20} />
                        </button>
                        <button onClick={() => setIsMobileMenuOpen(true)} className="p-2.5 text-slate-500 hover:text-[#3b82f6] bg-white/[0.02] rounded-xl border border-white/[0.05] lg:hidden">
                            <Menu size={20} />
                        </button>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-xl font-black text-white uppercase tracking-tighter italic leading-none">{activeSection.replace('_', ' ')}</h1>
                                <div className="px-2 py-0.5 bg-[#3b82f6]/10 border border-[#3b82f6]/20 rounded text-[7px] font-black text-[#3b82f6] tracking-[0.2em] uppercase">INTERNAL_DATA</div>
                            </div>
                            <div className="flex items-center gap-4 mt-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#0ecb81] shadow-[0_0_8px_#0ecb81]" />
                                    <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest font-mono">NODE_INDEX: SYNC_ESTABLE</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock size={10} className="text-slate-700" />
                                    <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest font-mono">{currentTime} (UTC)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-black/40 border border-white/[0.03] rounded-xl">
                            <div className="flex flex-col text-right">
                                <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-0.5">STATUS</span>
                                <span className="text-[9px] font-black text-[#0ecb81] uppercase tracking-widest italic">REALTIME_ACTIVE</span>
                            </div>
                            <div className="w-px h-6 bg-white/5" />
                            <Bell size={16} className="text-slate-500 hover:text-[#3b82f6] transition-colors cursor-pointer" />
                        </div>
                        <button onClick={logout} className="p-2.5 bg-[#f6465d]/5 rounded-xl border border-[#f6465d]/10 text-[#f6465d] hover:bg-[#f6465d] hover:text-white transition-all shadow-lg hover:shadow-[#f6465d]/20">
                            <LogOut size={18} strokeWidth={3} />
                        </button>
                    </div>
                </header>

                <MarketMarquee />

                {/* Mobile Drawer */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] lg:hidden"
                            />
                            <motion.div
                                initial={{ x: '-100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '-100%' }}
                                className="fixed inset-y-0 left-0 w-72 bg-[#0D1117] border-r border-white/10 z-[101] lg:hidden flex flex-col"
                            >
                                <div className="p-8 border-b border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Activity className="text-[#3b82f6]" size={20} />
                                        <span className="font-bold text-white tracking-widest italic uppercase text-xs">Menu_Senz</span>
                                    </div>
                                    <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-500 hover:text-white"><X size={20} /></button>
                                </div>
                                <nav className="flex-1 p-4 space-y-2">
                                    {menuItems.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => { setActiveSection(item.id); setIsMobileMenuOpen(false); }}
                                            className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all ${activeSection === item.id ? 'bg-blue-600/10 text-blue-500 border border-blue-500/20' : 'text-slate-500'}`}
                                        >
                                            <item.icon size={18} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                                        </button>
                                    ))}
                                </nav>
                                <div className="p-6 border-t border-white/5 bg-black/20">
                                    <button onClick={logout} className="w-full flex items-center gap-4 px-4 py-4 rounded-xl text-rose-500 bg-rose-500/5">
                                        <LogOut size={18} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Cerrar_Sesión</span>
                                    </button>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* SCROLLABLE SHELL */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-8 space-y-6">
                    <AnimatePresence mode="wait">
                        {activeSection === 'dashboard' && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">

                                {/* WELCOME MESSAGE */}
                                <div className="flex items-center justify-between">
                                    <h1 className="text-2xl font-semibold text-white">
                                        Bienvenido, <span className="text-[#3b82f6]">{user?.name?.split(' ')[0] || 'Trader'}</span>
                                    </h1>
                                    <p className="text-sm text-slate-500 hidden md:block">
                                        {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                                    </p>
                                </div>

                                {/* STATS ROW - Compact Binance Style */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="bg-[#181A20] border border-white/[0.03] rounded-xl p-4 hover:border-white/10 transition-all">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-xs text-slate-500">Usuarios Pro</span>
                                            <Users size={14} className="text-[#3b82f6]" />
                                        </div>
                                        {stats.loading ? (
                                            <div className="h-6 w-16 bg-white/5 animate-pulse rounded" />
                                        ) : (
                                            <>
                                                <p className="text-xl font-semibold text-white">{stats.totalUsers.toLocaleString()}</p>
                                                <p className="text-xs text-slate-500 mt-1">{stats.activeToday} activos hoy</p>
                                            </>
                                        )}
                                    </div>
                                    <div className="bg-[#181A20] border border-white/[0.03] rounded-xl p-4 hover:border-white/10 transition-all">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-xs text-slate-500">Pips del Mes</span>
                                            <TrendingUp size={14} className="text-[#0ecb81]" />
                                        </div>
                                        <p className="text-xl font-semibold text-[#0ecb81]">+1,420</p>
                                        <p className="text-xs text-[#0ecb81]/70 mt-1">+12.4% este mes</p>
                                    </div>
                                    <div className="bg-[#181A20] border border-white/[0.03] rounded-xl p-4 hover:border-white/10 transition-all">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-xs text-slate-500">Win Rate</span>
                                            <Target size={14} className="text-[#3b82f6]" />
                                        </div>
                                        <p className="text-xl font-semibold text-white">84.2%</p>
                                        <p className="text-xs text-slate-500 mt-1">32 de 38 operaciones</p>
                                    </div>
                                    <div className="bg-[#181A20] border border-white/[0.03] rounded-xl p-4 hover:border-white/10 transition-all">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-xs text-slate-500">Sentimiento</span>
                                            <div className={`w-2 h-2 rounded-full animate-pulse ${sentiment.value >= 50 ? 'bg-[#0ecb81]' : 'bg-[#f6465d]'}`} />
                                        </div>
                                        {sentiment.loading ? (
                                            <p className="text-xl font-semibold text-slate-500">Cargando...</p>
                                        ) : (
                                            <>
                                                <p className={`text-xl font-semibold ${sentiment.value >= 50 ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}>{sentiment.label}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                                                        <div className={`h-full ${sentiment.value >= 50 ? 'bg-[#0ecb81]' : 'bg-[#f6465d]'}`} style={{ width: `${sentiment.value}%` }} />
                                                    </div>
                                                    <span className="text-xs text-slate-500">{sentiment.value}%</span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* QUICK ACTIONS BAR */}
                                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                                    <button onClick={() => setActiveSection('signals')} className="flex items-center gap-2 px-4 py-2.5 bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-lg text-xs font-medium transition-all whitespace-nowrap">
                                        <Signal size={14} />
                                        Ver Señales
                                    </button>
                                    <button onClick={() => setActiveSection('news')} className="flex items-center gap-2 px-4 py-2.5 bg-[#181A20] hover:bg-[#1e2329] text-slate-300 rounded-lg text-xs font-medium border border-white/5 transition-all whitespace-nowrap">
                                        <Newspaper size={14} />
                                        Noticias
                                    </button>
                                    <button onClick={() => setActiveSection('plans')} className="flex items-center gap-2 px-4 py-2.5 bg-[#181A20] hover:bg-[#1e2329] text-slate-300 rounded-lg text-xs font-medium border border-white/5 transition-all whitespace-nowrap">
                                        <Zap size={14} />
                                        Mejorar Plan
                                    </button>
                                    <div className="flex items-center gap-2 px-4 py-2.5 bg-[#0ecb81]/10 text-[#0ecb81] rounded-lg text-xs font-medium border border-[#0ecb81]/20 whitespace-nowrap ml-auto">
                                        <Shield size={14} />
                                        Plan Pro · 24 días
                                    </div>
                                </div>

                                {/* ANUNCIOS - Estilo notificación sutil */}
                                {announcements.length > 0 && (
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        {announcements.map(ann => {
                                            const IconComponent = ann.icon;
                                            return (
                                                <div key={ann.id} className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border transition-all cursor-pointer group ${ann.type === 'warning' ? 'bg-[#181A20] border-amber-500/30 hover:border-amber-500/50' : 'bg-[#181A20] border-[#3b82f6]/30 hover:border-[#3b82f6]/50'}`}>
                                                    <div className={`p-2 rounded-lg ${ann.type === 'warning' ? 'bg-amber-500/10 text-amber-500' : 'bg-[#3b82f6]/10 text-[#3b82f6]'}`}>
                                                        <IconComponent size={16} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <span className="text-sm font-medium text-white block truncate">{ann.title}</span>
                                                        <span className="text-[11px] text-slate-500">Hace 2 horas</span>
                                                    </div>
                                                    <ChevronRight size={16} className="text-slate-600 group-hover:text-white transition-colors shrink-0" />
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                <div className="grid lg:grid-cols-12 gap-8 items-start">
                                    <div className="lg:col-span-8 space-y-8">
                                        {/* SEÑALES ACTIVAS */}
                                        <div className="mb-6">
                                            <h2 className="text-2xl font-black italic tracking-tight uppercase">NOTIFICACIONES_<span className="text-[#3b82f6]">PRIORITARIAS</span></h2>
                                            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.3em] mt-1">Transmisión en tiempo real desde el motor de análisis institucional</p>
                                        </div>
                                        <div className="space-y-3">
                                            {signalsLoading ? (
                                                [1, 2, 3].map(i => (
                                                    <div key={i} className="h-20 bg-white/[0.02] border border-white/5 rounded-xl animate-pulse" />
                                                ))
                                            ) : activeSignals.length > 0 ? (
                                                activeSignals.map(sig => (
                                                    <div key={sig.id} className="bg-[#181A20] border border-white/[0.03] rounded-xl p-4 flex items-center justify-between hover:bg-white/[0.02] transition-all group">
                                                        <div className="flex items-center gap-4">
                                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${sig.type.includes('BUY') ? 'bg-[#0ecb81]/10 border-[#0ecb81]/20 text-[#0ecb81]' : 'bg-[#f6465d]/10 border-[#f6465d]/20 text-[#f6465d]'}`}>
                                                                {sig.type.includes('BUY') ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                                                            </div>
                                                            <div>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="font-bold text-white text-sm">{sig.pair}</span>
                                                                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${sig.type.includes('BUY') ? 'bg-[#0ecb81]/10 text-[#0ecb81]' : 'bg-[#f6465d]/10 text-[#f6465d]'}`}>
                                                                        {sig.type}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    <span className="text-[10px] text-slate-500 font-mono">ENTRY: {sig.entry}</span>
                                                                    <span className="text-[10px] text-slate-600">•</span>
                                                                    <span className="text-[10px] text-slate-500">{sig.time}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-4">
                                                            <div className="text-right hidden sm:block">
                                                                {['Active', 'Activo'].includes(sig.status) ? (
                                                                    <div className="bg-[#0ecb81]/10 px-3 py-1.5 rounded-lg border border-[#0ecb81]/20 animate-pulse">
                                                                        <span className="block text-[7px] font-black text-[#0ecb81] uppercase tracking-widest mb-0.5">ESTADO_ACTUAL</span>
                                                                        <span className="text-[10px] font-black text-white uppercase italic flex items-center gap-1.5 justify-end">
                                                                            <Activity size={10} className="text-[#0ecb81]" /> ACTIVO
                                                                        </span>
                                                                    </div>
                                                                ) : sig.status === 'BE' ? (
                                                                    <div className="bg-[#fcd535]/10 px-3 py-1.5 rounded-lg border border-[#fcd535]/20 animate-pulse">
                                                                        <span className="block text-[7px] font-black text-[#fcd535] uppercase tracking-widest mb-0.5">RIESGO_CERO</span>
                                                                        <span className="text-[10px] font-black text-white uppercase italic flex items-center gap-1.5 justify-end">
                                                                            <Shield size={10} className="text-[#fcd535]" /> BREAKEVEN
                                                                        </span>
                                                                    </div>
                                                                ) : ['TP1', 'TP2', 'TP3'].includes(sig.status) ? (
                                                                    <div className="bg-[#0ecb81]/10 px-3 py-1.5 rounded-lg border border-[#0ecb81]/20 animate-pulse">
                                                                        <span className="block text-[7px] font-black text-[#0ecb81] uppercase tracking-widest mb-0.5">PROFIT_SECURED</span>
                                                                        <span className="text-[10px] font-black text-white uppercase italic flex items-center gap-1.5 justify-end">
                                                                            <Target size={10} className="text-[#0ecb81]" /> {sig.status === 'TP1' ? 'TAKE PROFIT 1' : sig.status === 'TP2' ? 'TAKE PROFIT 2' : 'MAX PROFIT'}
                                                                        </span>
                                                                    </div>
                                                                ) : null}
                                                            </div>
                                                            <button
                                                                onClick={() => {
                                                                    setActiveSection('signals');
                                                                }}
                                                                className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                                                            >
                                                                <ChevronRight size={18} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-xl bg-white/[0.01]">
                                                    <ZapOff className="text-slate-600 mb-3" size={20} />
                                                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Sin notificaciones activas</p>
                                                </div>
                                            )}
                                        </div>


                                        {/* ÚLTIMAS NOTICIAS */}
                                        <div className="pt-8 mb-6">
                                            <h2 className="text-2xl font-black italic tracking-tight uppercase">ÚLTIMAS_<span className="text-[#3b82f6]">NOTICIAS</span></h2>
                                            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.3em] mt-1">Feed inteligente de noticias financieras globales</p>
                                        </div>
                                        <QuickNewsFeed />
                                    </div>

                                    <div className="lg:col-span-4 space-y-6">
                                        <div className="bg-[#181A20] border border-white/[0.03] rounded-2xl overflow-hidden shadow-xl sticky top-8 h-[600px]">
                                            <EconomicCalendar />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeSection === 'plans' && (
                            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} className="max-w-7xl mx-auto py-6 space-y-16">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
                                        <span className="text-[180px] font-black italic tracking-tighter uppercase leading-none">PRIME</span>
                                    </div>
                                    <div className="text-center space-y-4 relative z-10 px-4">
                                        <h2 className="text-4xl md:text-5xl font-black italic tracking-tight uppercase">PLANES_<span className="text-[#3b82f6]">SUSCRIPCIÓN</span></h2>
                                        <p className="max-w-xl mx-auto text-[10px] font-bold text-slate-600 uppercase tracking-[0.3em]">
                                            Elige el plan que mejor se adapte a tu operativa
                                        </p>
                                    </div>
                                </div>

                                {/* CURRENT PLAN INFO */}
                                <div className="bg-[#181A20] border border-[#3b82f6]/30 rounded-2xl p-6 mx-4 mb-4">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-xl bg-[#3b82f6]/10 flex items-center justify-center">
                                                <Shield className="text-[#3b82f6]" size={24} />
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 mb-1">Tu plan actual</p>
                                                <h3 className="text-xl font-bold text-white">Plan Pro</h3>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-6 text-center md:text-left">
                                            <div>
                                                <p className="text-xs text-slate-500 mb-1">Estado</p>
                                                <p className="text-sm font-semibold text-[#0ecb81]">Activo</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 mb-1">Vencimiento</p>
                                                <p className="text-sm font-semibold text-white">10 Feb, 2026</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 mb-1">Renovación</p>
                                                <p className="text-sm font-semibold text-[#3b82f6]">Automática</p>
                                            </div>
                                        </div>
                                        <button className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg text-xs font-medium border border-white/10 transition-all">
                                            Cancelar renovación
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
                                    {plans.length > 0 ? plans.map((plan, index) => {
                                        // Helper logic to map API data to UI aesthetics
                                        const isPro = index === 1;
                                        const isMax = index === plans.length - 1;
                                        const uiTier = index === 0 ? 'Nivel 1' : index === 1 ? 'Nivel 2' : 'Nivel Max';
                                        const uiColor = index === 0 ? '#3b82f6' : index === 1 ? '#3b82f6' : '#a855f7';
                                        const uiTagline = index === 0 ? 'Ideal para comenzar' : index === 1 ? 'Para traders serios' : 'Máximo rendimiento';

                                        // Check if this is the current user's plan (placeholder logic, can be refined with userData)
                                        const isCurrent = false; // We can update this when we have user subscription data linked

                                        return (
                                            <div key={plan.id} className={`flex flex-col relative rounded-3xl overflow-hidden transition-all duration-700 bg-[#12161c] border border-white/[0.03] group ${isCurrent ? 'ring-2 ring-[#3b82f6]/40 shadow-[0_0_100px_rgba(59,130,246,0.15)] scale-[1.02] z-10' : 'hover:scale-[1.01] hover:bg-[#181a20]'}`}>
                                                {/* Glow Background Effect */}
                                                <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full blur-[100px] opacity-0 group-hover:opacity-[0.08] transition-opacity duration-1000" style={{ background: uiColor }} />

                                                {/* Plan Header */}
                                                <div className="p-10 pb-0 space-y-6 relative overflow-hidden">
                                                    <div className="flex justify-between items-start">
                                                        <div className="px-3 py-1 bg-black/40 border border-white/5 rounded-lg">
                                                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest italic">{uiTier}</span>
                                                        </div>
                                                        {isCurrent && (
                                                            <div className="flex items-center gap-2 px-3 py-1 bg-[#3b82f6]/10 border border-[#3b82f6]/20 rounded-lg">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] animate-pulse" />
                                                                <span className="text-[8px] font-black text-[#3b82f6] uppercase tracking-widest italic">ACTIVE_NODE</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <span className="text-[9px] font-black text-[#3b82f6] uppercase tracking-[0.4em] italic mb-2 block opacity-80">{uiTagline}</span>
                                                        <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">{plan.name}</h3>
                                                    </div>

                                                    <div className="flex items-baseline gap-2 py-8 border-b border-white/5">
                                                        <span className="text-xl font-black text-slate-700 italic">$</span>
                                                        <span className="text-7xl font-black text-white italic tracking-tighter leading-none">{plan.price}</span>
                                                        <div className="flex flex-col">
                                                            <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest font-mono">USD/MO</span>
                                                            <span className="text-[8px] font-bold text-[#3b82f6] uppercase tracking-tighter italic">RECURRING_SYNC</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Features List */}
                                                <div className="p-10 space-y-6 flex-1">
                                                    {plan.features.map((f, i) => (
                                                        <div key={i} className="flex flex-col space-y-1 group/feat">
                                                            <div className="flex items-center gap-3">
                                                                <CheckCircle2 size={12} className={isCurrent ? 'text-[#3b82f6]' : 'text-slate-700 group-hover/feat:text-[#3b82f6] transition-colors'} />
                                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 italic">{f}</span>
                                                            </div>
                                                            <p className="text-[9px] font-bold text-slate-600 uppercase tracking-tight pl-6 italic">INCLUIDO</p>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Action Button */}
                                                <div className="p-10 pt-0">
                                                    <button className={`w-full py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] transition-all italic relative overflow-hidden group/btn ${isCurrent ? 'bg-white/[0.03] text-slate-600 border border-white/5 cursor-not-allowed' : 'bg-[#3b82f6] text-white hover:bg-[#2563eb] shadow-[0_10px_30px_rgba(59,130,246,0.3)]'}`}>
                                                        <span className="relative z-10">{isCurrent ? 'NODE_SYNCRONIZED' : 'ACTIVATE_GATEWAY'}</span>
                                                        {!isCurrent && (
                                                            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-white/20 scale-x-0 group-hover/btn:scale-x-100 transition-transform origin-left duration-500" />
                                                        )}
                                                    </button>
                                                </div>

                                                {/* Geometric Accents */}
                                                <div className="absolute bottom-0 right-0 w-32 h-32 text-white/[0.02] flex items-end justify-end p-4 pointer-events-none">
                                                    <Zap size={100} strokeWidth={0.5} />
                                                </div>
                                            </div>
                                        )
                                    }) : (
                                        <div className="col-span-3 py-20 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.01]">
                                            <Activity className="text-slate-600 mb-4" size={32} />
                                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">No hay planes disponibles</p>
                                        </div>
                                    )}
                                </div>

                                <div className="max-w-4xl mx-auto px-4">
                                    <div className="bg-gradient-to-r from-transparent via-white/[0.02] to-transparent p-8 rounded-[2rem] border-x border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 bg-[#181a20] rounded-2xl border border-white/5 flex items-center justify-center text-[#3b82f6] shadow-xl">
                                                <MessageSquare size={24} />
                                            </div>
                                            <div>
                                                <h4 className="text-[11px] font-black text-white uppercase tracking-widest italic">¿Necesitas_un_plan_corporativo?</h4>
                                                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest italic mt-1">Conecta con nuestro equipo de arquitectura institucional</p>
                                            </div>
                                        </div>
                                        <button className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[9px] font-black uppercase tracking-widest border border-white/10 transition-all italic">CONSULTAR_DESPLIEGUE</button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeSection === 'signals' && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
                                {/* Header */}
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div>
                                        <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">SEÑALES_<span className="text-[#3b82f6]">ACTIVAS</span></h2>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Transmisión en tiempo real desde el motor de análisis institucional</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-2 px-4 py-2 bg-[#0ecb81]/10 border border-[#0ecb81]/20 rounded-xl">
                                            <div className="w-2 h-2 rounded-full bg-[#0ecb81] animate-pulse" />
                                            <span className="text-[10px] font-black text-[#0ecb81] uppercase tracking-widest">LIVE_STREAM</span>
                                        </div>
                                        <div className="px-4 py-2 bg-[#181A20] border border-white/5 rounded-xl">
                                            <span className="text-[10px] font-mono font-bold text-slate-400">{activeSignals.length} ACTIVAS</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Stats Row */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="bg-[#181A20] border border-white/[0.03] rounded-xl p-5">
                                        <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest block mb-2">WIN_RATE_TOTAL</span>
                                        <span className="text-2xl font-mono font-black text-[#0ecb81]">84.2%</span>
                                    </div>
                                    <div className="bg-[#181A20] border border-white/[0.03] rounded-xl p-5">
                                        <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest block mb-2">PIPS_ACUMULADOS</span>
                                        <span className="text-2xl font-mono font-black text-[#3b82f6]">+2,847</span>
                                    </div>
                                    <div className="bg-[#181A20] border border-white/[0.03] rounded-xl p-5">
                                        <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest block mb-2">SEÑALES_HOY</span>
                                        <span className="text-2xl font-mono font-black text-white">12</span>
                                    </div>
                                    <div className="bg-[#181A20] border border-white/[0.03] rounded-xl p-5">
                                        <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest block mb-2">PROMEDIO_RR</span>
                                        <span className="text-2xl font-mono font-black text-amber-500">1:2.4</span>
                                    </div>
                                </div>

                                {/* Active Signals Grid */}
                                {/* Active Signals Grid */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-1.5 h-6 bg-[#0ecb81] rounded-full shadow-[0_0_15px_rgba(14,203,129,0.5)]" />
                                        <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 italic">SEÑALES_ACTIVAS</h3>
                                    </div>

                                    {signalsLoading ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="h-64 bg-white/[0.02] animate-pulse rounded-3xl border border-white/5" />
                                            ))}
                                        </div>
                                    ) : activeSignals.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {activeSignals.map(sig => (
                                                <div
                                                    key={sig.id}
                                                    className="bg-[#181A20] border border-white/[0.03] rounded-3xl p-6 relative overflow-hidden group hover:border-[#3b82f6]/40 transition-all shadow-2xl"
                                                >
                                                    <div className="flex justify-between items-start mb-6">
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-3">
                                                                <h3 className="text-2xl font-black italic tracking-tighter text-white uppercase">{sig.pair}</h3>
                                                                <span className={`px-2 py-0.5 rounded text-[8px] font-black tracking-widest uppercase border ${sig.type.includes('BUY') ? 'bg-[#0ecb81]/10 text-[#0ecb81] border-[#0ecb81]/20' : 'bg-[#f6465d]/10 text-[#f6465d] border-[#f6465d]/20'}`}>
                                                                    {sig.type}
                                                                </span>
                                                            </div>
                                                            <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest block">{sig.orderType}</span>
                                                        </div>
                                                        <div className="flex flex-col items-end">
                                                            {['Active', 'Activo'].includes(sig.status) ? (
                                                                <div className="bg-[#0ecb81]/10 px-3 py-1.5 rounded-lg border border-[#0ecb81]/20 animate-pulse">
                                                                    <span className="block text-[7px] font-black text-[#0ecb81] uppercase tracking-widest mb-0.5">ESTADO_ACTUAL</span>
                                                                    <span className="text-[10px] font-black text-white uppercase italic flex items-center gap-1.5 justify-end">
                                                                        <Activity size={10} className="text-[#0ecb81]" /> ACTIVO
                                                                    </span>
                                                                </div>
                                                            ) : sig.status === 'BE' ? (
                                                                <div className="bg-[#fcd535]/10 px-3 py-1.5 rounded-lg border border-[#fcd535]/20 animate-pulse">
                                                                    <span className="block text-[7px] font-black text-[#fcd535] uppercase tracking-widest mb-0.5">RIESGO_CERO</span>
                                                                    <span className="text-[10px] font-black text-white uppercase italic flex items-center gap-1.5 justify-end">
                                                                        <Shield size={10} className="text-[#fcd535]" /> BREAKEVEN
                                                                    </span>
                                                                </div>
                                                            ) : ['TP1', 'TP2', 'TP3'].includes(sig.status) ? (
                                                                <div className="bg-[#0ecb81]/10 px-3 py-1.5 rounded-lg border border-[#0ecb81]/20 animate-pulse">
                                                                    <span className="block text-[7px] font-black text-[#0ecb81] uppercase tracking-widest mb-0.5">PROFIT_SECURED</span>
                                                                    <span className="text-[10px] font-black text-white uppercase italic flex items-center gap-1.5 justify-end">
                                                                        <Target size={10} className="text-[#0ecb81]" /> {sig.status === 'TP1' ? 'TAKE PROFIT 1' : sig.status === 'TP2' ? 'TAKE PROFIT 2' : 'MAX PROFIT'}
                                                                    </span>
                                                                </div>
                                                            ) : (
                                                                <div className="bg-black/40 px-3 py-1.5 rounded-lg border border-white/5">
                                                                    <span className="block text-[7px] font-black text-slate-600 uppercase tracking-widest">VERSION</span>
                                                                    <span className="text-[9px] font-mono font-bold text-[#3b82f6]">S-{sig.id.slice(-4).toUpperCase()}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-2 mb-6">
                                                        <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                                                            <span className="text-[7px] font-black text-slate-600 uppercase block mb-1">ENTRY_POINT</span>
                                                            <p className="font-mono font-bold text-white text-xs">{sig.entry}</p>
                                                        </div>
                                                        <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                                                            <span className="text-[7px] font-black text-[#f6465d]/60 uppercase block mb-1">STOP_LOSS</span>
                                                            <p className="font-mono font-bold text-[#f6465d] text-xs">{sig.sl}</p>
                                                        </div>
                                                    </div>

                                                    {/* Multi-TP Display */}
                                                    <div className="mb-6 bg-black/40 p-3 rounded-xl border border-[#0ecb81]/10 flex flex-col justify-center">
                                                        <span className="text-[7px] font-black text-[#0ecb81]/60 uppercase block mb-2 text-center tracking-widest">OBJETIVOS (TAKE PROFIT)</span>
                                                        <div className="flex justify-around items-center">
                                                            <div className="text-center group-hover:scale-110 transition-transform">
                                                                <span className="text-[7px] text-slate-500 font-bold block mb-0.5">TP 1</span>
                                                                <p className="font-mono font-bold text-[#0ecb81] text-sm">{sig.tp}</p>
                                                            </div>

                                                            {sig.tp2 && (
                                                                <>
                                                                    <div className="w-px h-6 bg-white/5" />
                                                                    <div className="text-center group-hover:scale-110 transition-transform delay-75">
                                                                        <span className="text-[7px] text-slate-500 font-bold block mb-0.5">TP 2</span>
                                                                        <p className="font-mono font-bold text-[#0ecb81]/90 text-sm">{sig.tp2}</p>
                                                                    </div>
                                                                </>
                                                            )}

                                                            {sig.tp3 && (
                                                                <>
                                                                    <div className="w-px h-6 bg-white/5" />
                                                                    <div className="text-center group-hover:scale-110 transition-transform delay-100">
                                                                        <span className="text-[7px] text-slate-500 font-bold block mb-0.5">TP 3</span>
                                                                        <p className="font-mono font-bold text-[#0ecb81]/80 text-sm">{sig.tp3}</p>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {sig.analysis && (
                                                        <div className="mb-6 p-4 rounded-2xl bg-black/40 border border-white/5 relative group/analysis">
                                                            <span className="text-[7px] font-black text-[#3b82f6] uppercase tracking-[0.2em] mb-2 flex items-center gap-1.5 italic">
                                                                <Info size={10} /> ALPHA_INTELLIGENCE_REPORT
                                                            </span>
                                                            <p className="text-[10px] text-slate-500 leading-relaxed italic line-clamp-2 group-hover/analysis:line-clamp-none transition-all">
                                                                "{sig.analysis}"
                                                            </p>
                                                        </div>
                                                    )}

                                                    <div className="mt-4">
                                                        <button
                                                            onClick={() => setSelectedAnalysis(sig)}
                                                            className="w-full py-4 bg-[#3b82f6] hover:bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 italic border border-white/10 shadow-xl shadow-[#3b82f6]/10"
                                                        >
                                                            <BarChart3 size={14} /> VER ANÁLISIS
                                                        </button>
                                                    </div>

                                                    <div className="mt-4 flex items-center justify-between text-[8px] font-bold text-slate-700 uppercase tracking-widest italic">
                                                        <span className="flex items-center gap-1"><Clock size={10} /> {new Date().toLocaleDateString()}</span>
                                                        <span className="flex items-center gap-1"><Radio size={10} className="text-[#0ecb81]" /> VERIFIED_ORIGIN</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[2rem] bg-white/[0.01]">
                                            <div className="w-16 h-16 rounded-full bg-white/[0.03] flex items-center justify-center mb-6">
                                                <ZapOff className="text-slate-600" size={32} />
                                            </div>
                                            <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tighter italic">Nodos_Silenciosos</h3>
                                            <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.4em] max-w-sm text-center leading-relaxed italic">
                                                Escaneando frecuencias de mercado en busca de nuevas oportunidades alpha.
                                            </p>
                                        </div>
                                    )}
                                </div>


                                {/* Recent Closed Signals */}
                                < div className="space-y-4" >
                                    <div className="flex items-center gap-4">
                                        <div className="w-1.5 h-6 bg-slate-600 rounded-full" />
                                        <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500 italic">Historial_Reciente</h3>
                                    </div>

                                    <div className="bg-[#181A20] border border-white/[0.03] rounded-2xl overflow-hidden">
                                        <div className="grid grid-cols-6 gap-4 p-4 border-b border-white/5 text-[8px] font-black text-slate-600 uppercase tracking-widest">
                                            <span>Par</span>
                                            <span>Tipo</span>
                                            <span>Entrada</span>
                                            <span>Cierre</span>
                                            <span>Resultado</span>
                                            <span>Estado</span>
                                        </div>
                                        {[
                                            { pair: 'GBPUSD', type: 'BUY', entry: '1.26450', close: '1.26820', pips: '+37', win: true },
                                            { pair: 'XAUUSD', type: 'SELL', entry: '2032.50', close: '2018.30', pips: '+142', win: true },
                                            { pair: 'USDJPY', type: 'BUY', entry: '148.250', close: '147.980', pips: '-27', win: false },
                                            { pair: 'EURUSD', type: 'SELL', entry: '1.09120', close: '1.08750', pips: '+37', win: true },
                                        ].map((sig, i) => (
                                            <div key={i} className="grid grid-cols-6 gap-4 p-4 border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors items-center">
                                                <span className="font-mono font-bold text-white text-xs">{sig.pair}</span>
                                                <span className={`text-[9px] font-black uppercase ${sig.type === 'BUY' ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}>{sig.type}</span>
                                                <span className="font-mono text-xs text-slate-400">{sig.entry}</span>
                                                <span className="font-mono text-xs text-slate-400">{sig.close}</span>
                                                <span className={`font-mono font-bold text-xs ${sig.win ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}>{sig.pips}</span>
                                                <span className={`text-[8px] font-black uppercase px-2 py-1 rounded w-fit ${sig.win ? 'bg-[#0ecb81]/10 text-[#0ecb81]' : 'bg-[#f6465d]/10 text-[#f6465d]'}`}>
                                                    {sig.win ? 'WIN' : 'LOSS'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div >
                            </motion.div >
                        )}

                        {
                            activeSection === 'news' && (
                                <MarketNewsSection />
                            )
                        }

                        {
                            activeSection === 'academy' && (
                                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="min-h-[70vh] flex flex-col items-center justify-center p-8 bg-[#181A20] rounded-2xl border border-white/5 relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-[#0B0E11] opacity-50" />
                                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />

                                    <div className="relative z-10 p-16 bg-black/60 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-md text-center max-w-2xl border-dashed">
                                        <div className="mb-10 relative inline-block">
                                            <div className="absolute inset-0 bg-[#3b82f6]/20 blur-3xl rounded-full animate-pulse" />
                                            <Lock size={80} className="text-[#3b82f6] relative z-10" strokeWidth={1} />
                                        </div>

                                        <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-tight mb-4">SENZACIONAL_<span className="text-[#3b82f6]">ACADEMY</span></h2>
                                        <div className="flex items-center justify-center gap-4 mb-8">
                                            <div className="h-px w-10 bg-white/10" />
                                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.5em] italic">SECURE_ACCESS_REQUIRED</span>
                                            <div className="h-px w-10 bg-white/10" />
                                        </div>

                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed max-w-sm mx-auto mb-10 opacity-80">
                                            Módulos de entrenamiento avanzado bloqueados por el protocolo de seguridad. Requiere sincronización de nodo Institutional_Prime para desencriptar.
                                        </p>

                                        <button
                                            onClick={() => setActiveSection('plans')}
                                            className="px-10 py-5 bg-[#3b82f6] text-white rounded-xl text-[10px] font-black uppercase tracking-[0.4em] hover:bg-blue-600 transition-all shadow-lg shadow-[#3b82f6]/10 active:scale-95 italic"
                                        >
                                            UNRESTRICT_ALPHA_CONTENT
                                        </button>
                                    </div>

                                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 opacity-30">
                                        <Globe size={16} className="text-slate-500" />
                                        <Activity size={16} className="text-slate-500" />
                                        <Shield size={16} className="text-slate-500" />
                                    </div>
                                </motion.div>
                            )
                        }

                        {
                            activeSection === 'support' && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="h-[calc(100vh-140px)] flex gap-6">
                                    <SupportUserView user={user} />
                                </motion.div>
                            )
                        }
                        {/* More sections (Portfolio, Academy, etc.) would go here */}
                    </AnimatePresence >
                </div >
                <AnimatePresence>
                    {selectedSignal && (
                        <SignalDetailModal signal={selectedSignal} onClose={() => setSelectedSignal(null)} />
                    )}
                </AnimatePresence>
                <AnalysisViewerModal
                    signal={selectedAnalysis}
                    onClose={() => setSelectedAnalysis(null)}
                />
            </main >

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.1); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(59, 130, 246, 0.3); }
                
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 20s linear infinite;
                }
            `}} />
        </div >
    );
};

export default DashboardPage;
