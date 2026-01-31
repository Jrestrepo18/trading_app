import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Signal, Zap, Activity, Plus, Filter,
    CheckCircle2, Clock, XCircle, X, ArrowUpRight, ArrowDownRight,
    Search, TrendingUp, AlertTriangle, Target,
    BarChart3, Settings2, Radio, Send, Trash2, Check,
    Users, Coins, BarChart4, Globe2, Cpu, ChevronDown, Eye, Flame,
    Shield, TrendingDown, Crosshair, Layers, RefreshCw, Wifi, Copy, Loader2, Image as ImageIcon, Briefcase, Camera
} from 'lucide-react';
import {
    searchAllAssets,
    getPopularAssets,
    getAssetCounts
} from '../../services/unifiedMarketService';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

const playClick = () => console.log('Mechanical Click Sound Played');

// Función para obtener el icono correcto basado en la categoría
const getIconForCategory = (category) => {
    switch (category) {
        case 'Cripto': return Zap;
        case 'Acciones': return BarChart4;
        case 'ETFs': return Layers;
        case 'Futuros': return TrendingUp;
        case 'Metales':
        case 'Commodities': return Coins;
        default: return Zap;
    }
};


const AssetSearchSelector = ({ value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [topAssets, setTopAssets] = useState([]);
    const [assetCounts, setAssetCounts] = useState({ total: 0, usdt: 0 });
    const [selectedAssetData, setSelectedAssetData] = useState(null);
    const [categoryFilter, setCategoryFilter] = useState('Todos');
    const dropdownRef = useRef(null);
    const searchTimeoutRef = useRef(null);

    // Cargar activos populares de todas las fuentes
    useEffect(() => {
        const loadTopAssets = async () => {
            try {
                const [top, counts] = await Promise.all([
                    getPopularAssets(),
                    getAssetCounts()
                ]);
                setTopAssets(top);
                setAssetCounts(counts);

                // Si hay un valor seleccionado, buscar sus datos
                if (value && top.length > 0) {
                    const found = top.find(a => a.id === value);
                    if (found) setSelectedAssetData(found);
                }
            } catch (error) {
                console.error('Error loading Binance assets:', error);
            }
        };
        loadTopAssets();

        // Actualizar precios cada 30 segundos
        const interval = setInterval(loadTopAssets, 30000);
        return () => clearInterval(interval);
    }, [value]);

    // Búsqueda unificada en todas las APIs
    const handleSearch = useCallback(async (term) => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        if (!term || term.length < 1) {
            setSearchResults([]);
            setIsSearching(false);
            return;
        }

        setIsSearching(true);

        searchTimeoutRef.current = setTimeout(async () => {
            try {
                const results = await searchAllAssets(term, { limit: 50 });
                setSearchResults(results);
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setIsSearching(false);
            }
        }, 300);
    }, []);

    useEffect(() => {
        handleSearch(searchTerm);
    }, [searchTerm, handleSearch]);

    // Cerrar al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Determinar qué mostrar con filtro de categoría
    const filteredByCategory = (assets) => {
        if (categoryFilter === 'Todos') return assets;
        return assets.filter(a => a.category === categoryFilter);
    };

    const displayAssets = filteredByCategory(
        searchTerm.length > 0 ? searchResults : topAssets
    );

    // Asset seleccionado
    const selectedAsset = selectedAssetData || topAssets.find(a => a.id === value) || {
        id: value || 'BTCUSDT',
        name: value ? `${value.replace('USDT', '')} / USDT` : 'Bitcoin / USDT',
        category: 'Cripto',
        price: '0',
        change24h: '0'
    };

    // Obtener el icono para el asset seleccionado
    const SelectedIcon = getIconForCategory(selectedAsset.category);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-black/40 border border-white/5 rounded-xl px-5 py-4 flex items-center justify-between group hover:bg-white/[0.03] transition-all outline-none focus:border-[#3b82f6]/40"
            >
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#3b82f6]/10 flex items-center justify-center text-[#3b82f6] border border-[#3b82f6]/20 shadow-inner">
                        <SelectedIcon size={20} strokeWidth={2.5} />
                    </div>
                    <div className="text-left">
                        <div className="flex items-center gap-2">
                            <span className="block text-sm font-bold text-[#eaecef] uppercase tracking-tight leading-none">{selectedAsset.id}</span>
                            {selectedAsset.price && (
                                <span className="text-[9px] font-bold bg-[#0ecb81]/10 text-[#0ecb81] px-1.5 py-0.5 rounded border border-[#0ecb81]/20 uppercase tracking-widest leading-none">${selectedAsset.price}</span>
                            )}
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1.5 block leading-none">{selectedAsset.name}</span>
                    </div>
                </div>
                <ChevronDown size={14} className={`text-slate-600 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full left-0 right-0 mt-3 bg-[#181A20] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[100] overflow-hidden backdrop-blur-3xl"
                    >
                        <div className="p-4 border-b border-white/5 bg-white/[0.01]">
                            <div className="relative">
                                {isSearching ? (
                                    <Loader2 size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3b82f6] animate-spin" />
                                ) : (
                                    <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                )}
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="BUSCAR: BTC, AAPL, SPY, NVDA..."
                                    className="w-full bg-black/40 border border-white/5 rounded-xl pl-11 pr-4 py-3 text-xs font-bold text-[#eaecef] outline-none focus:border-[#3b82f6]/30 transition-all placeholder:text-slate-700 tracking-wider uppercase"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            {/* Category filters */}
                            <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                                {['Todos', 'Cripto', 'Acciones', 'ETFs', 'Futuros'].map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => {
                                            setCategoryFilter(cat);
                                            if (cat !== 'Todos') setSearchTerm('');
                                        }}
                                        className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-1 ${categoryFilter === cat
                                            ? 'bg-[#3b82f6] text-white'
                                            : 'bg-black/40 text-slate-500 hover:bg-white/5 hover:text-white border border-white/5'
                                            }`}
                                    >
                                        {cat === 'Cripto' && <Zap size={10} />}
                                        {cat === 'Acciones' && <BarChart4 size={10} />}
                                        {cat === 'ETFs' && <Layers size={10} />}
                                        {cat === 'Futuros' && <TrendingUp size={10} />}
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="max-h-[350px] overflow-y-auto p-2 custom-scrollbar">
                            {/* Opción para usar símbolo personalizado cuando se busca */}
                            {searchTerm.length >= 2 && (
                                <button
                                    onClick={() => {
                                        onChange(searchTerm.toUpperCase());
                                        setSelectedAssetData({
                                            id: searchTerm.toUpperCase(),
                                            name: `${searchTerm.toUpperCase()} (Manual)`,
                                            category: 'Personalizado',
                                        });
                                        setIsOpen(false);
                                        setSearchTerm('');
                                    }}
                                    className="w-full p-3 mb-2 rounded-xl flex items-center justify-between group transition-all bg-gradient-to-r from-[#3b82f6]/10 to-transparent border border-[#3b82f6]/30 hover:border-[#3b82f6]/50"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-[#3b82f6] text-white flex items-center justify-center">
                                            <Plus size={16} strokeWidth={2.5} />
                                        </div>
                                        <div className="text-left">
                                            <span className="block text-sm font-bold text-[#3b82f6] uppercase tracking-tight">
                                                Usar: {searchTerm.toUpperCase()}
                                            </span>
                                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                                                Símbolo personalizado
                                            </span>
                                        </div>
                                    </div>
                                    <ArrowUpRight size={14} className="text-[#3b82f6]" />
                                </button>
                            )}

                            {displayAssets.length === 0 && searchTerm.length < 2 ? (
                                <div className="text-center py-8 text-slate-500">
                                    <Search size={24} className="mx-auto mb-2 opacity-50" />
                                    <p className="text-xs font-bold">Escribe para buscar o usar un símbolo</p>
                                </div>
                            ) : displayAssets.length === 0 && searchTerm.length >= 2 ? (
                                <div className="text-center py-4 text-slate-500">
                                    <p className="text-[10px] font-bold">No hay resultados de las APIs</p>
                                    <p className="text-[9px] text-slate-600 mt-1">Usa el botón de arriba para \"{searchTerm.toUpperCase()}\"</p>
                                </div>
                            ) : (
                                displayAssets.map((asset) => {
                                    const IconComponent = asset.icon || getIconForCategory(asset.category);
                                    return (
                                        <button
                                            key={asset.id}
                                            onClick={() => {
                                                onChange(asset.id);
                                                setIsOpen(false);
                                                setSearchTerm('');
                                            }}
                                            className={`w-full p-4 rounded-xl flex items-center justify-between group transition-all ${value === asset.id ? 'bg-[#3b82f6]/10 border border-[#3b82f6]/20' : 'hover:bg-white/[0.02] border border-transparent'}`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${value === asset.id ? 'bg-[#3b82f6] text-white' : 'bg-black/40 text-slate-500 group-hover:bg-white/[0.05] group-hover:text-[#eaecef]'}`}>
                                                    <IconComponent size={20} strokeWidth={2.5} />
                                                </div>
                                                <div className="text-left">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`block text-sm font-bold uppercase tracking-tight leading-none ${value === asset.id ? 'text-[#3b82f6]' : 'text-slate-300'}`}>{asset.id}</span>
                                                        <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest px-1.5 py-0.5 bg-white/5 rounded">{asset.category}</span>
                                                    </div>
                                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1 block leading-none">{asset.name}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {asset.price && (
                                                    <span className="text-xs font-bold text-[#0ecb81] tabular-nums">${asset.price}</span>
                                                )}
                                                {asset.volume && (
                                                    <span className="text-[8px] font-bold text-slate-600 tabular-nums">VOL: {asset.volume}</span>
                                                )}
                                                {value === asset.id && <Check size={14} className="text-[#3b82f6]" />}
                                            </div>
                                        </button>
                                    );
                                })
                            )}
                        </div>

                        {/* Footer con info */}
                        <div className="p-3 border-t border-white/5 bg-black/20 flex items-center justify-between">
                            <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">
                                {searchTerm ? displayAssets.length : assetCounts.total || displayAssets.length} activos {searchTerm ? 'encontrados' : 'disponibles'}
                            </span>
                            <span className="text-[9px] font-bold text-[#0ecb81] uppercase tracking-widest flex items-center gap-1">
                                <Wifi size={10} /> Binance + Yahoo
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    );
};


const SignalEngine = () => {
    const location = useLocation();
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isComposerOpen, setIsComposerOpen] = useState(false);
    const [signalData, setSignalData] = useState({
        pair: 'XAUUSD',
        type: 'BUY',
        orderType: 'MARKET', // MARKET, BUY_LIMIT, SELL_LIMIT
        entry: '',
        sl: '',
        tp1: '',
        tp2: '',
        tp3: '',
        riskPercent: 1,
        analysis: '',
        currency: 'USD'
    });
    const [chartImage, setChartImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [copied, setCopied] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setChartImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setChartImage(null);
        setImagePreview(null);
    };

    // Generate copyable signal text
    const generateCopyableSignal = () => {
        const lines = [
            `🔔 ${signalData.pair}`,
            `📊 ${signalData.type}${signalData.orderType !== 'MARKET' ? ` ${signalData.orderType.replace('_', ' ')}` : ''}`,
            `🎯 Entrada: ${signalData.entry}`,
            `🛑 SL: ${signalData.sl}`,
        ];
        if (signalData.tp1) lines.push(`✅ T1: ${signalData.tp1}`);
        if (signalData.tp2) lines.push(`✅ T2: ${signalData.tp2}`);
        if (signalData.tp3) lines.push(`✅ T3: ${signalData.tp3}`);
        if (signalData.analysis) lines.push(`📝 ${signalData.analysis}`);
        return lines.join('\n');
    };

    const handleCopySignal = () => {
        navigator.clipboard.writeText(generateCopyableSignal());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    const [activeOperations, setActiveOperations] = useState([]);

    const [engineMode, setEngineMode] = useState('Manual_X1');
    const [connectionStatus, setConnectionStatus] = useState('connected');

    useEffect(() => {
        const fetchSignals = async () => {
            try {
                const response = await fetch('http://localhost:5257/api/signals');
                if (response.ok) {
                    const data = await response.json();
                    const formatted = data.map(s => ({
                        id: s.id,
                        pair: s.pair,
                        type: s.type,
                        entry: s.entry.toString(),
                        current: s.entry.toString(), // Inicialmente igual al de entrada
                        pips: '0.0',
                        status: s.status === 'Active' ? 'Activo' : s.status,
                        followers: s.followersCount || 0
                    }));
                    setActiveOperations(formatted);
                }
            } catch (error) {
                console.error('Error fetching signals:', error);
            }
        };

        fetchSignals();
        const interval = setInterval(fetchSignals, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('action') === 'create') {
            const composer = document.getElementById('signal-composer');
            if (composer) {
                composer.scrollIntoView({ behavior: 'smooth' });
                setIsComposerOpen(true);
            }
        }
    }, [location.search]);

    const stats = [
        { label: 'Win Rate Semanal', value: '84%', subValue: '+2.1% vs anterior', icon: Zap, color: '#0ecb81', trend: 'up' },
        { label: 'Pips del Día', value: '+142.5', subValue: '23 operaciones', icon: Activity, color: '#3b82f6', trend: 'up' },
        { label: 'Seguidores Activos', value: '1,284', subValue: '+48 hoy', icon: Users, color: '#fcd535', trend: 'up' },
        { label: 'Señales Hoy', value: '8', subValue: '6 ganadoras', icon: Signal, color: '#8b5cf6', trend: 'up' },
    ];

    const handleTransmit = () => {
        playClick();
        if (!signalData.entry || !signalData.sl) return;
        setIsConfirmModalOpen(true);
    };

    const parseNumber = (val) => {
        if (!val) return 0;
        const strVal = val.toString().replace(/,/g, '.');
        const num = parseFloat(strVal);
        return isNaN(num) ? 0 : num;
    };

    const playClick = () => console.log('Mechanical Click Sound Played');
    const playAlertSound = () => {
        const audio = new Audio('/sounds/alert.mp3');
        audio.volume = 0.5;
        audio.play().catch(e => console.error('Error playing alert sound:', e));
    };

    const confirmBroadcast = async () => {
        try {
            const adminId = 'admin_123';

            const payload = {
                pair: signalData.pair,
                type: signalData.type,
                orderType: signalData.orderType,
                entry: parseNumber(signalData.entry),
                sl: parseNumber(signalData.sl),
                tp1: parseNumber(signalData.tp1),
                tp2: signalData.tp2 ? parseNumber(signalData.tp2) : null,
                tp3: signalData.tp3 ? parseNumber(signalData.tp3) : null,
                analysis: signalData.analysis,
                imageBase64: imagePreview
            };

            // Basic validation check
            if (payload.entry === 0 || payload.sl === 0 || payload.tp1 === 0) {
                alert("Por favor verifica los valores numéricos (Entrada, SL, TP1).");
                return;
            }

            const response = await fetch('http://localhost:5257/api/signals', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Admin-Id': adminId
                },
                body: JSON.stringify(payload)
            });

            console.log('Signal Payload:', { ...signalData, imageLength: imagePreview?.length });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Error al emitir la señal');
            }

            const newSignal = await response.json();

            // Re-fetch to get updated list
            const fetchResponse = await fetch('http://localhost:5257/api/signals');
            if (fetchResponse.ok) {
                const data = await fetchResponse.json();
                setActiveOperations(data.map(s => ({
                    id: s.id, pair: s.pair, type: s.type, entry: s.entry.toString(),
                    current: s.entry.toString(), pips: '0.0', status: 'Activo', followers: 0
                })));
            }

            setSignalData({ pair: 'BTCUSDT', type: 'BUY', orderType: 'MARKET', entry: '', sl: '', tp1: '', tp2: '', tp3: '', analysis: '' });
            setImagePreview(null);
            setIsConfirmModalOpen(false);
            setIsComposerOpen(false);
            setIsComposerOpen(false);
        } catch (error) {
            console.error('Error broadcasting signal:', error);
            alert(error.message);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        if (['BE', 'TP1', 'TP2', 'TP3'].includes(newStatus)) {
            playAlertSound();
        }
        try {
            // 1. Optimistic UI update
            setActiveOperations(prev => prev.map(op =>
                op.id === id ? { ...op, status: newStatus } : op
            ));

            // 2. Firebase Update (Real-time Frontend)
            const signalRef = doc(db, 'signals', id);
            await updateDoc(signalRef, {
                status: newStatus
            });

            // 3. Backend API Update (Notifications & Persistence)
            await fetch(`http://localhost:5257/api/signals/${id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Admin-Id': 'admin_123'
                },
                body: JSON.stringify(newStatus)
            });

        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleDeleteSignal = async (id) => {
        playAlertSound();
        if (!window.confirm('¿Estás seguro de que deseas eliminar esta señal?')) return;
        try {
            const adminId = 'admin_123';
            const response = await fetch(`http://localhost:5257/api/signals/${id}`, {
                method: 'DELETE',
                headers: { 'X-Admin-Id': adminId }
            });
            if (response.ok) {
                setActiveOperations(prev => prev.filter(op => op.id !== id));
            } else {
                alert('Error al eliminar la señal');
            }
        } catch (error) {
            console.error('Error deleting signal:', error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Activo': return 'text-[#3b82f6] bg-[#3b82f6]/10 border-[#3b82f6]/20';
            case 'BE': return 'text-[#fcd535] bg-[#fcd535]/10 border-[#fcd535]/20';
            case 'TP1': return 'text-[#0ecb81] bg-[#0ecb81]/10 border-[#0ecb81]/20';
            case 'Alerta': return 'text-[#f6465d] bg-[#f6465d]/10 border-[#f6465d]/20';
            default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
        }
    };

    return (
        <div className="p-6 lg:p-10 space-y-8 bg-[#0B0E11] min-h-full selection:bg-[#fcd535]/30">
            {/* Actions Bar */}
            <div className="flex items-center justify-between pb-2">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#0ecb81] animate-pulse" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Motor de Señales // Estado: Operativo</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-[#181A20] border border-white/5 p-5 rounded-2xl flex items-center justify-between group hover:border-white/10 transition-all shadow-xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl opacity-30" />
                        <div className="relative z-10">
                            <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">{stat.label}</span>
                            <span className="text-2xl font-bold text-[#eaecef] tabular-nums tracking-tight">{stat.value}</span>
                            <span className="block text-[9px] font-bold text-slate-600 mt-1">{stat.subValue}</span>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-black/40 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform relative z-10" style={{ color: stat.color, border: `1px solid ${stat.color}20` }}>
                            <stat.icon size={22} strokeWidth={2.5} />
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mb-8">
                <motion.button
                    whileHover={{ scale: 1.005, y: -1 }}
                    whileTap={{ scale: 0.995 }}
                    onClick={() => setIsComposerOpen(true)}
                    className="w-full h-24 bg-[#181A20] rounded-[28px] flex items-center px-8 transition-all shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] group relative overflow-hidden border border-white/5 hover:border-[#3b82f6]/30"
                >
                    <div className="absolute -inset-24 bg-[#3b82f6]/5 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="w-14 h-14 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center shrink-0 shadow-inner group-hover:border-[#3b82f6]/30 transition-all">
                        <Plus size={24} className="text-[#3b82f6]" strokeWidth={3} />
                    </div>
                    <div className="ml-8 flex flex-col items-start overflow-hidden">
                        <span className="text-[#eaecef] font-black text-xl tracking-widest leading-none uppercase group-hover:text-white transition-colors">Ejecutar Nueva Señal de Mercado</span>
                        <div className="flex items-center gap-3 mt-2.5">
                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-[#3b82f6]/10 rounded-md border border-[#3b82f6]/20">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] animate-pulse" />
                                <span className="text-[#3b82f6] text-[9px] font-black uppercase tracking-widest leading-none">Terminal Premium</span>
                            </div>
                            <span className="text-slate-600 text-[10px] font-bold uppercase tracking-[0.2em]">Protocolo de Transmisión Institucional v2.4</span>
                        </div>
                    </div>
                    <div className="ml-auto hidden lg:flex items-center gap-8 mr-8">
                        <div className="h-10 w-[1px] bg-white/5" />
                        <div className="text-right">
                            <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">Estado de Red</span>
                            <span className="text-[#0ecb81] text-xs font-black uppercase tracking-widest flex items-center gap-2 justify-end">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#0ecb81]" />
                                En Línea
                            </span>
                        </div>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-[#3b82f6]/10 transition-all">
                        <ArrowUpRight size={24} className="text-slate-600 group-hover:text-[#3b82f6] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" strokeWidth={2.5} />
                    </div>
                </motion.button>
            </div>

            <section className="bg-[#181A20] border border-white/5 rounded-2xl flex-1 flex flex-col relative overflow-hidden shadow-2xl">
                <div className="overflow-x-auto flex-1 custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#1e2329] border-b border-white/5 sticky top-0 z-10">
                            <tr className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                <th className="px-5 py-4">Instrumento</th>
                                <th className="px-5 py-4">Entrada / Actual</th>
                                <th className="px-5 py-4">PnL</th>
                                <th className="px-5 py-4 text-center">Estado</th>
                                <th className="px-5 py-4 text-center">Seguidores</th>
                                <th className="px-5 py-4 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03]">
                            {activeOperations.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-5 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center gap-3 opacity-40">
                                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                                                <Activity size={24} className="text-slate-400" />
                                            </div>
                                            <div className="text-center">
                                                <span className="block text-xs font-bold text-slate-300 uppercase tracking-widest">No hay señales activas</span>
                                                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mt-1">El motor está esperando nuevas entradas</span>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                activeOperations.map((op, index) => (
                                    <motion.tr
                                        key={op.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="group hover:bg-[#1e2329]/50 transition-all"
                                    >
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${op.type === 'BUY' ? 'bg-[#0ecb81]/10 border border-[#0ecb81]/20' : 'bg-[#f6465d]/10 border border-[#f6465d]/20'}`}>
                                                    <div className={`w-2 h-2 rounded-full ${op.type === 'BUY' ? 'bg-[#0ecb81] shadow-[0_0_6px_#0ecb81]' : 'bg-[#f6465d] shadow-[0_0_6px_#f6465d]'}`} />
                                                </div>
                                                <div>
                                                    <span className="text-sm font-bold text-[#eaecef] block">{op.pair}</span>
                                                    <span className={`text-[10px] font-bold uppercase ${op.type === 'BUY' ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}>{op.type}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="space-y-0.5">
                                                <span className="text-sm font-mono font-bold text-[#eaecef] block tabular-nums">{op.entry}</span>
                                                <span className="text-[11px] font-mono text-slate-500 block tabular-nums">{op.current}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`text-base font-bold tabular-nums ${op.pips.startsWith('+') ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}>{op.pips}</span>
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-lg border ${getStatusColor(op.status)}`}>{op.status}</span>
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            <div className="flex items-center justify-center gap-1.5">
                                                <Eye size={12} className="text-slate-500" />
                                                <span className="text-sm font-bold text-slate-300 tabular-nums">{op.followers.toLocaleString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleStatusUpdate(op.id, 'BE')}
                                                    className={`h-7 px-3 rounded-lg transition-all border text-[9px] font-bold uppercase ${op.status === 'BE' ? 'bg-[#fcd535] text-black border-[#fcd535]' : 'bg-[#fcd535]/10 hover:bg-[#fcd535] text-[#fcd535] hover:text-black border-[#fcd535]/20'}`}
                                                >
                                                    BE
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(op.id, 'TP1')}
                                                    className={`h-7 px-3 rounded-lg transition-all border text-[9px] font-bold uppercase ${op.status === 'TP1' ? 'bg-[#0ecb81] text-white border-[#0ecb81]' : 'bg-[#0ecb81]/10 hover:bg-[#0ecb81] text-[#0ecb81] hover:text-white border-[#0ecb81]/20'}`}
                                                >
                                                    TP1
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(op.id, 'TP2')}
                                                    className={`h-7 px-3 rounded-lg transition-all border text-[9px] font-bold uppercase ${op.status === 'TP2' ? 'bg-[#0ecb81] text-white border-[#0ecb81]' : 'bg-[#0ecb81]/10 hover:bg-[#0ecb81] text-[#0ecb81] hover:text-white border-[#0ecb81]/20'}`}
                                                >
                                                    TP2
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(op.id, 'TP3')}
                                                    className={`h-7 px-3 rounded-lg transition-all border text-[9px] font-bold uppercase ${op.status === 'TP3' ? 'bg-[#0ecb81] text-white border-[#0ecb81]' : 'bg-[#0ecb81]/10 hover:bg-[#0ecb81] text-[#0ecb81] hover:text-white border-[#0ecb81]/20'}`}
                                                >
                                                    TP3
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteSignal(op.id)}
                                                    className="w-7 h-7 flex items-center justify-center bg-[#f6465d]/10 hover:bg-[#f6465d] text-[#f6465d] hover:text-white rounded-lg transition-all border border-[#f6465d]/20"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                )))}
                        </tbody>
                    </table>
                </div>
            </section >

            <AnimatePresence>
                {isComposerOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-hidden">
                        <div className="absolute inset-0" onClick={() => setIsComposerOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-5xl bg-[#181A20] border border-white/10 rounded-[28px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between z-10 bg-[#181A20]/80 backdrop-blur-xl shrink-0">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] flex items-center justify-center text-white shadow-lg shadow-[#3b82f6]/20"><Crosshair size={24} strokeWidth={2.5} /></div>
                                    <div><h2 className="text-lg font-bold text-[#eaecef] uppercase tracking-tight">Compositor de Señal</h2><div className="flex items-center gap-2 mt-0.5"><div className="w-2 h-2 rounded-full bg-[#0ecb81] animate-pulse" /><span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Protocolo Institucional</span></div></div>
                                </div>
                                <button onClick={() => setIsComposerOpen(false)} className="w-10 h-10 rounded-xl bg-white/5 text-slate-400 hover:bg-[#f6465d]/10 hover:text-[#f6465d] transition-all flex items-center justify-center border border-white/5"><X size={20} /></button>
                            </div>
                            <div className="px-8 py-8 overflow-y-auto custom-scrollbar flex-1">
                                <div className="space-y-8 relative z-10">
                                    <div className="space-y-3"><label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2"><Activity size={12} className="text-[#3b82f6]" />Instrumento</label><AssetSearchSelector value={signalData.pair} onChange={(val) => setSignalData({ ...signalData, pair: val })} /></div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <div className="space-y-3"><label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Dirección</label><div className="grid grid-cols-2 gap-3">
                                                <button onClick={() => setSignalData({ ...signalData, type: 'BUY' })} className={`py-4 rounded-2xl text-[11px] font-bold uppercase tracking-wider transition-all border flex items-center justify-center gap-3 ${signalData.type === 'BUY' ? 'bg-[#0ecb81] text-white' : 'bg-black/40 text-slate-500 border-white/5'}`}><ArrowUpRight size={18} strokeWidth={2.5} />Compra</button>
                                                <button onClick={() => setSignalData({ ...signalData, type: 'SELL' })} className={`py-4 rounded-2xl text-[11px] font-bold uppercase tracking-wider transition-all border flex items-center justify-center gap-3 ${signalData.type === 'SELL' ? 'bg-[#f6465d] text-white' : 'bg-black/40 text-slate-500 border-white/5'}`}><ArrowDownRight size={18} strokeWidth={2.5} />Venta</button>
                                            </div></div>
                                            <div className="space-y-3"><label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Ejecución</label><div className="grid grid-cols-3 gap-2">{['MARKET', 'BUY_LIMIT', 'SELL_LIMIT'].map(t => (<button key={t} onClick={() => setSignalData({ ...signalData, orderType: t })} className={`py-3 rounded-xl text-[9px] font-bold uppercase border ${signalData.orderType === t ? 'bg-[#3b82f6] text-white' : 'bg-black/20 text-slate-500'}`}>{t.replace('_', ' ')}</button>))}</div></div>
                                        </div>
                                        <div className="space-y-6">
                                            <div className="space-y-6">
                                                <div className="p-5 bg-black/40 border border-white/5 rounded-[20px] space-y-3 relative group focus-within:border-[#3b82f6]/30 transition-all">
                                                    <div className="flex justify-between items-center">
                                                        <label className="text-[10px] font-bold text-slate-500 uppercase">Entrada</label>
                                                        <div className="relative">
                                                            <select
                                                                value={signalData.currency}
                                                                onChange={(e) => setSignalData({ ...signalData, currency: e.target.value })}
                                                                className="appearance-none bg-[#3b82f6]/10 text-[#3b82f6] text-[9px] font-bold uppercase py-1 px-2 pr-6 rounded-md border border-[#3b82f6]/20 outline-none cursor-pointer hover:bg-[#3b82f6]/20 transition-all"
                                                            >
                                                                <option value="USD">USD ($)</option>
                                                                <option value="USDT">USDT</option>
                                                                <option value="EUR">EUR (€)</option>
                                                                <option value="GBP">GBP (£)</option>
                                                            </select>
                                                            <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[#3b82f6] pointer-events-none" />
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xl font-bold text-slate-600 select-none">
                                                            {signalData.currency === 'USD' ? '$' : signalData.currency === 'EUR' ? '€' : signalData.currency === 'GBP' ? '£' : '₮'}
                                                        </span>
                                                        <input
                                                            type="number"
                                                            step="any"
                                                            placeholder="0.0000"
                                                            className="w-full bg-transparent border-none p-0 text-3xl font-bold text-[#eaecef] outline-none placeholder:text-slate-700"
                                                            value={signalData.entry}
                                                            onChange={(e) => setSignalData({ ...signalData, entry: e.target.value })}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="p-5 bg-black/40 border border-[#f6465d]/10 rounded-[20px] space-y-3 relative group focus-within:border-[#f6465d]/30 transition-all">
                                                    <div className="flex justify-between items-center">
                                                        <label className="text-[10px] font-bold text-[#f6465d]/70 uppercase">Stop Loss</label>
                                                        <span className="text-[9px] font-bold text-[#f6465d]/50 uppercase bg-[#f6465d]/5 px-2 py-1 rounded border border-[#f6465d]/10">
                                                            {signalData.currency}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xl font-bold text-[#f6465d]/50 select-none">
                                                            {signalData.currency === 'USD' ? '$' : signalData.currency === 'EUR' ? '€' : signalData.currency === 'GBP' ? '£' : '₮'}
                                                        </span>
                                                        <input
                                                            type="number"
                                                            step="any"
                                                            placeholder="0.0000"
                                                            className="w-full bg-transparent border-none p-0 text-3xl font-bold text-[#f6465d] outline-none placeholder:text-[#f6465d]/20"
                                                            value={signalData.sl}
                                                            onChange={(e) => setSignalData({ ...signalData, sl: e.target.value })}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4"><label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2"><Target size={12} className="text-[#0ecb81]" />Take Profits</label><div className="grid grid-cols-3 gap-4">{[1, 2, 3].map(n => (<div key={n} className="p-4 bg-[#0ecb81]/5 border border-[#0ecb81]/10 rounded-2xl"><label className="text-[9px] font-bold text-[#0ecb81]/60 uppercase mb-2 block">TP {n}</label><input type="number" step="any" placeholder="0.0000" className="w-full bg-transparent border-none p-0 text-xl font-bold text-[#0ecb81] outline-none" value={signalData[`tp${n}`]} onChange={(e) => setSignalData({ ...signalData, [`tp${n}`]: e.target.value })} /></div>))}</div></div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <div className="space-y-3"><label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Análisis Técnico</label><textarea className="w-full h-[120px] bg-black/40 border border-white/5 rounded-2xl p-4 text-xs text-slate-300 outline-none resize-none focus:border-[#3b82f6]/30 transition-all font-medium leading-relaxed" placeholder="Describe el razonamiento..." value={signalData.analysis} onChange={(e) => setSignalData({ ...signalData, analysis: e.target.value })} /></div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2"><Camera size={12} className="text-[#3b82f6]" /> Captura del Gráfico</label>
                                                {!imagePreview ? (
                                                    <label className="w-full h-[100px] border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white/[0.02] hover:border-[#3b82f6]/30 transition-all group">
                                                        <ImageIcon size={24} className="text-slate-600 group-hover:text-[#3b82f6] transition-colors" />
                                                        <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest leading-none">Subir Imagen</span>
                                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                                    </label>
                                                ) : (
                                                    <div className="relative w-full h-[100px] rounded-2xl overflow-hidden border border-white/10 group">
                                                        <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                                            <button onClick={() => setImagePreview(null)} className="px-3 py-1.5 bg-[#f6465d] text-white rounded-lg text-[9px] font-bold uppercase tracking-widest flex items-center gap-2"><Trash2 size={10} /> Eliminar</button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="space-y-3"><label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Vista Previa</label><div className="p-4 bg-black/30 rounded-2xl border border-white/5 h-[230px] overflow-y-auto font-mono text-[10px] text-slate-400 whitespace-pre-wrap leading-relaxed custom-scrollbar">{generateCopyableSignal()}</div></div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-8 bg-black/20 border-t border-white/5 shrink-0"><button onClick={handleTransmit} disabled={!signalData.entry || !signalData.sl} className="w-full bg-gradient-to-r from-[#3b82f6] to-[#2ecc71] py-5 rounded-2xl flex items-center justify-center gap-4 transition-all shadow-xl disabled:opacity-30 disabled:grayscale"><span className="text-white font-bold uppercase tracking-widest text-xs">Transmitir a la Red</span><Send size={18} className="text-white" /></button></div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isConfirmModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="w-full max-w-md bg-[#181A20] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                            <div className="p-6 border-b border-white/5 bg-gradient-to-r from-[#3b82f6]/10 to-[#8b5cf6]/10 flex items-center justify-between">
                                <div className="flex items-center gap-4"><div className="w-12 h-12 bg-[#3b82f6]/20 rounded-xl flex items-center justify-center text-[#3b82f6]"><Radio size={24} className="animate-pulse" /></div><div><h3 className="text-lg font-bold text-[#eaecef] uppercase leading-none">Confirmar</h3><p className="text-[10px] font-bold text-slate-500 tracking-widest mt-1.5">Verificación de señal</p></div></div>
                                <button onClick={() => setIsConfirmModalOpen(false)} className="p-2 text-slate-500 hover:text-white"><XCircle size={20} /></button>
                            </div>
                            <div className="p-6 space-y-5">
                                <div className="bg-black/40 border border-white/5 rounded-2xl p-5 space-y-2">
                                    <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-[9px] text-slate-500 uppercase">Activo</span><span className="font-bold text-white uppercase">{signalData.pair}</span></div>
                                    <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-[9px] text-slate-500 uppercase">Tipo</span><span className={`font-bold ${signalData.type === 'BUY' ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}>{signalData.type}</span></div>
                                    <div className="grid grid-cols-2 gap-4 border-b border-white/5 pb-2">
                                        <div><span className="text-[9px] text-slate-500 uppercase">Entrada</span><p className="text-lg font-bold text-white font-mono">{signalData.entry}</p></div>
                                        <div className="text-right"><span className="text-[9px] text-slate-500 uppercase">SL</span><p className="text-lg font-bold text-[#f6465d] font-mono">{signalData.sl}</p></div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 py-2">
                                        <div className="text-center bg-[#0ecb81]/5 p-2 rounded-lg border border-[#0ecb81]/10">
                                            <span className="text-[7px] text-[#0ecb81] uppercase block">TP 1</span>
                                            <span className="text-xs font-bold text-[#0ecb81] font-mono">{signalData.tp1}</span>
                                        </div>
                                        <div className="text-center bg-white/[0.02] p-2 rounded-lg border border-white/5">
                                            <span className="text-[7px] text-slate-500 uppercase block">TP 2</span>
                                            <span className="text-xs font-bold text-slate-300 font-mono">{signalData.tp2 || '-'}</span>
                                        </div>
                                        <div className="text-center bg-white/[0.02] p-2 rounded-lg border border-white/5">
                                            <span className="text-[7px] text-slate-500 uppercase block">TP 3</span>
                                            <span className="text-xs font-bold text-slate-300 font-mono">{signalData.tp3 || '-'}</span>
                                        </div>
                                    </div>
                                    {imagePreview && (
                                        <div className="mt-2 h-20 rounded-xl overflow-hidden border border-white/10">
                                            <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button onClick={() => setIsConfirmModalOpen(false)} className="flex-1 py-4 bg-black/20 text-slate-500 rounded-xl text-[10px] font-bold uppercase transition-all">Cancelar</button>
                                    <button onClick={confirmBroadcast} className="flex-1 py-4 bg-gradient-to-r from-[#3b82f6] to-[#2ecc71] text-white rounded-xl text-[10px] font-bold uppercase transition-all shadow-xl">Transmitir</button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style dangerouslySetInnerHTML={{ __html: `.custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; } .custom-scrollbar::-webkit-scrollbar-track { background: transparent; } .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.1); border-radius: 10px; }` }} />
        </div >
    );
};

export default SignalEngine;
