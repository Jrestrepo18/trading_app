import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageSquare, Clock, CheckCircle2, Search, User,
    Shield, Zap, Activity, Send, Terminal, XCircle,
    AlertTriangle, Users, Headphones, Ban, Smile, Paperclip
} from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';

const SupportHub = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTicket, setActiveTicket] = useState(localStorage.getItem('activeSupportTicket_Admin'));
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [modalConfig, setModalConfig] = useState({ title: '', message: '', actionLabel: '', type: 'info' });
    const [messages, setMessages] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [messageText, setMessageText] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const fileInputRef = React.useRef(null);

    // Fetch Tickets
    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await fetch('http://localhost:5257/api/support/tickets');
                if (response.ok) {
                    const data = await response.json();
                    // Filter out resolved tickets from main view based on user request "que se quite el chat de pendientes"
                    setTickets(data);
                    if (data.length > 0 && !activeTicket) {
                        // Keep current selection if valid, or select first open
                        const openTickets = data.filter(t => t.status !== 'RESOLVED');
                        if (!activeTicket && openTickets.length > 0) setActiveTicket(openTickets[0].id);
                    }
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
    }, []); // Removed activeTicket dependency to prevent auto-switching unwantingly

    // Fetch Messages & Persist Selection
    useEffect(() => {
        if (!activeTicket) return;
        localStorage.setItem('activeSupportTicket_Admin', activeTicket);

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

    const [statsData, setStatsData] = useState({
        avgResponseTime: 0,
        openTickets: 0,
        resolvedToday: 0,
        satisfaction: 0
    });

    // Fetch Stats
    const [debugError, setDebugError] = useState(null);

    // Fetch Stats
    useEffect(() => {
        const fetchStats = async () => {
            try {
                console.log("Fetching stats...");
                const response = await fetch('http://localhost:5257/api/support/stats');
                if (response.ok) {
                    const data = await response.json();
                    console.log("Stats received:", data);
                    setStatsData({
                        avgResponseTime: data.averageResponseTimeSeconds,
                        openTickets: data.openTickets,
                        resolvedToday: data.resolvedToday,
                        satisfaction: data.satisfactionScore
                    });
                    setDebugError(null);
                } else {
                    const text = await response.text();
                    setDebugError(`HTTP Error: ${response.status} - ${text}`);
                }
            } catch (error) {
                console.error("Failed to fetch stats:", error);
                setDebugError(`Fetch Error: ${error.message}`);
            }
        };
        fetchStats();
        // Refresh stats periodically
        const interval = setInterval(fetchStats, 30000);
        return () => clearInterval(interval);
    }, [tickets]); // Update when tickets change

    const formatTime = (seconds) => {
        if (!seconds) return '0s';
        if (seconds < 60) return `${Math.round(seconds)}s`;
        const mins = Math.round(seconds / 60);
        if (mins < 60) return `${mins}m`;
        const hours = Math.round(mins / 60);
        return `${hours}h`;
    };

    const stats = [
        { label: 'Tiempo Respuesta', value: formatTime(statsData.avgResponseTime), icon: Clock, color: '#3b82f6' },
        { label: 'Tickets Abiertos', value: statsData.openTickets, icon: MessageSquare, color: '#fcd535' },
        { label: 'Resueltos Hoy', value: statsData.resolvedToday, icon: CheckCircle2, color: '#0ecb81' },
        { label: 'Satisfacción', value: statsData.satisfaction > 0 ? `${statsData.satisfaction.toFixed(1)}/5` : 'N/A', icon: Users, color: '#8b5cf6' },
    ];

    const currentTicket = tickets.find(t => t.id === activeTicket);
    const isChatBlocked = currentTicket?.status === 'RESOLVED';

    const handleAction = (type) => {
        if (type === 'close') {
            setModalConfig({
                title: 'Cerrar Ticket',
                message: 'El ticket será marcado como resuelto y se bloqueará el chat.',
                actionLabel: 'Cerrar Ticket',
                type: 'info',
                onConfirm: async () => {
                    await fetch(`http://localhost:5257/api/support/tickets/${activeTicket}/status`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ status: 'RESOLVED' })
                    });

                    // Update local state
                    setTickets(prev => prev.map(t => t.id === activeTicket ? { ...t, status: 'RESOLVED' } : t));
                    setActiveTicket(null); // Deselect to "remove" from view as per request
                }
            });
        } else if (type === 'ban') {
            setModalConfig({
                title: 'Bloquear Usuario',
                message: 'Se suspenderá el acceso del usuario al sistema.',
                actionLabel: 'Confirmar Bloqueo',
                type: 'danger',
                onConfirm: () => console.log('Ban logic placeholder')
            });
        }
        setIsConfirmModalOpen(true);
    };

    const confirmAction = async () => {
        if (modalConfig.onConfirm) await modalConfig.onConfirm();
        setIsConfirmModalOpen(false);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if ((!messageText && !imageFile) || !activeTicket || isChatBlocked) return;

        let attachmentUrl = '';

        // Upload Image if exists
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
                    attachmentUrl = data.url; // Relative URL
                }
            } catch (err) {
                console.error("Upload failed", err);
                return;
            }
        }

        const newMessage = {
            ticketId: activeTicket,
            senderName: 'Soporte',
            message: messageText,
            attachmentUrl: attachmentUrl,
            isAdmin: true
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

    const getPriorityStyle = (priority) => {
        switch (priority?.toUpperCase()) {
            case 'URGENTE': return 'text-[#f6465d] bg-[#f6465d]/10 border-[#f6465d]/20';
            case 'ALTA': return 'text-[#fcd535] bg-[#fcd535]/10 border-[#fcd535]/20';
            case 'MEDIA': return 'text-[#3b82f6] bg-[#3b82f6]/10 border-[#3b82f6]/20';
            default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
        }
    };

    const getStatusStyle = (status) => {
        switch (status?.toUpperCase()) {
            case 'OPEN': case 'ABIERTO': return 'bg-[#3b82f6] shadow-[0_0_8px_rgba(59,130,246,0.5)]';
            case 'PENDING': case 'PENDIENTE': return 'bg-[#fcd535]';
            case 'RESOLVED': case 'RESUELTO': return 'bg-slate-600';
            default: return 'bg-slate-700';
        }
    };

    // Filtered Tickets for List (Excluding Resolved as requested "quite el chat de pendientes")
    const visibleTickets = tickets.filter(t => t.status !== 'RESOLVED' && (
        t.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.subject?.toLowerCase().includes(searchTerm.toLowerCase())
    ));

    return (
        <div className="p-6 lg:p-10 space-y-6 bg-[#0B0E11] min-h-full flex flex-col">

            {/* Stats Grid */}
            {debugError && (
                <div className="bg-red-500/20 border border-red-500/50 p-4 rounded-xl text-red-200 text-xs font-mono mb-4">
                    <strong>DEBUG:</strong> {debugError}
                </div>
            )}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-[#181A20] border border-white/5 p-5 rounded-2xl group hover:border-white/10 transition-all shadow-xl"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 rounded-xl bg-black/40 flex items-center justify-center border border-white/5" style={{ color: stat.color }}>
                                <stat.icon size={20} strokeWidth={2} />
                            </div>
                        </div>
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">{stat.label}</span>
                        <span className="text-xl font-bold text-[#eaecef] tabular-nums tracking-tight">{stat.value}</span>
                    </motion.div>
                ))}
            </div>

            {/* Support Chat Interface */}
            <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-[500px]">
                {/* Ticket List */}
                <div className="w-full lg:w-[340px] flex flex-col bg-[#181A20] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                    <div className="p-4 border-b border-white/5 bg-[#1e2329]/50">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
                            <input
                                type="text"
                                placeholder="Buscar pendientes..."
                                className="w-full bg-black/40 border border-white/5 rounded-lg pl-10 pr-4 py-2.5 text-xs font-bold text-[#eaecef] outline-none focus:border-[#3b82f6]/40 transition-all placeholder:text-slate-700"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                        {loading ? (
                            <div className="text-center p-4 text-slate-500 text-xs">Cargando tickets...</div>
                        ) : visibleTickets.length === 0 ? (
                            <div className="text-center p-4 text-slate-500 text-xs">No hay tickets pendientes.</div>
                        ) : (
                            visibleTickets.map((ticket) => (
                                <button
                                    key={ticket.id}
                                    onClick={() => setActiveTicket(ticket.id)}
                                    className={`w-full p-4 text-left rounded-xl border transition-all ${activeTicket === ticket.id
                                        ? 'bg-[#3b82f6]/10 border-[#3b82f6]/30'
                                        : 'bg-black/20 border-white/5 hover:bg-white/[0.02]'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${getStatusStyle(ticket.status)}`} />
                                            <span className="text-xs font-bold text-[#eaecef]">{ticket.userName}</span>
                                        </div>
                                        <span className="text-[9px] font-mono text-slate-600">{new Date(ticket.lastActivity).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <p className="text-[11px] font-bold text-slate-400 mb-2 truncate">{ticket.subject}</p>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[8px] font-bold px-2 py-0.5 rounded border ${getPriorityStyle(ticket.priority)}`}>
                                            {ticket.priority}
                                        </span>
                                        <span className="text-[8px] font-mono text-slate-700 truncate max-w-[60px]">{ticket.id.substring(0, 8)}...</span>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col bg-[#181A20] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                    {activeTicket && currentTicket ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-5 border-b border-white/5 bg-[#1e2329]/50 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-[#3b82f6]/10 border border-[#3b82f6]/20 flex items-center justify-center text-[#3b82f6] text-sm font-bold">
                                        {currentTicket.userName.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-[#eaecef]">{currentTicket.userName}</h4>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-[9px] font-bold text-slate-600">{currentTicket.subject}</span>
                                            <span className="text-[9px] text-slate-700">•</span>
                                            <span className="text-[9px] font-mono text-slate-600">{currentTicket.id}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {isChatBlocked ? (
                                        <span className="px-4 py-2 bg-slate-700/50 text-slate-400 rounded-lg text-[9px] font-bold uppercase tracking-widest border border-white/5">
                                            Ticket Resuelto
                                        </span>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => handleAction('close')}
                                                className="px-4 py-2 bg-[#0ecb81]/10 hover:bg-[#0ecb81] text-[#0ecb81] hover:text-white rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all border border-[#0ecb81]/20"
                                            >
                                                Resolver
                                            </button>
                                            <button
                                                onClick={() => handleAction('ban')}
                                                className="px-4 py-2 bg-[#f6465d]/10 hover:bg-[#f6465d] text-[#f6465d] hover:text-white rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all border border-[#f6465d]/20"
                                            >
                                                Bloquear
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-black/20">
                                {messages.map((msg) => (
                                    <div key={msg.id} className={`flex ${msg.isAdmin ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[70%] ${msg.isAdmin ? 'items-end' : 'items-start'} flex flex-col`}>
                                            <div className="flex items-center gap-2 px-1 mb-1">
                                                <span className="text-[9px] font-bold text-slate-600">{msg.senderName}</span>
                                                <span className="text-[8px] font-mono text-slate-700">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                            <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-lg overflow-hidden ${msg.isAdmin
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

                            {/* Input Area */}
                            {!isChatBlocked ? (
                                <div className="p-4 bg-[#1e2329]/50 border-t border-white/5 relative">
                                    {/* Image Preview */}
                                    {imageFile && (
                                        <div className="absolute top-[-60px] left-4 p-2 bg-[#181A20] border border-white/10 rounded-xl shadow-xl flex items-center gap-3">
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
                                            placeholder="Escribe tu respuesta..."
                                            className="flex-1 bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm text-[#eaecef] outline-none focus:border-[#3b82f6]/40 transition-all placeholder:text-slate-700"
                                        />
                                        <button
                                            type="submit"
                                            className="w-12 h-12 bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-xl flex items-center justify-center shadow-lg transition-all border border-white/10"
                                        >
                                            <Send size={18} />
                                        </button>
                                    </form>
                                </div>
                            ) : (
                                <div className="p-6 bg-[#1e2329]/50 border-t border-white/5 text-center">
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center justify-center gap-2">
                                        <CheckCircle2 size={14} className="text-[#0ecb81]" />
                                        Conversación Finalizada
                                    </p>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-600">
                            <MessageSquare size={48} className="mb-4 opacity-20" />
                            <p className="text-xs font-bold uppercase tracking-widest">Selecciona un ticket para ver el chat</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Confirmation Modal */}
            <AnimatePresence>
                {isConfirmModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="w-full max-w-md bg-[#181A20] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
                        >
                            <div className="p-6 border-b border-white/5 bg-[#1e2329]/50 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${modalConfig.type === 'danger'
                                        ? 'bg-[#f6465d]/10 text-[#f6465d] border border-[#f6465d]/20'
                                        : 'bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/20'
                                        }`}>
                                        {modalConfig.type === 'danger' ? <Ban size={18} /> : <CheckCircle2 size={18} />}
                                    </div>
                                    <h3 className="text-lg font-bold text-[#eaecef] uppercase tracking-tight">{modalConfig.title}</h3>
                                </div>
                                <button onClick={() => setIsConfirmModalOpen(false)} className="p-2 text-slate-500 hover:text-white transition-colors">
                                    <XCircle size={18} />
                                </button>
                            </div>

                            <div className="p-6 space-y-4">
                                <p className="text-sm text-slate-400 text-center">{modalConfig.message}</p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setIsConfirmModalOpen(false)}
                                        className="flex-1 py-3 bg-black/20 hover:bg-white/5 text-slate-500 hover:text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border border-white/5"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={confirmAction}
                                        className={`flex-1 py-3 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all shadow-lg border border-white/10 ${modalConfig.type === 'danger' ? 'bg-[#f6465d] hover:bg-[#d93a4a]' : 'bg-[#3b82f6] hover:bg-[#2563eb]'
                                            }`}
                                    >
                                        {modalConfig.actionLabel}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.1); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(59, 130, 246, 0.3); }
            `}} />
        </div>
    );
};

export default SupportHub;
