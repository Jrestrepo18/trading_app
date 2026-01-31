import { create } from 'zustand';

/**
 * Signals Store - Zustand
 * Manages trading signals state
 */
const useSignalsStore = create((set, get) => ({
    // State
    signals: [],
    isLoading: false,
    error: null,

    // Actions
    setSignals: (signals) => set({ signals }),

    addSignal: (signal) => set((state) => ({
        signals: [signal, ...state.signals]
    })),

    removeSignal: (id) => set((state) => ({
        signals: state.signals.filter(s => s.id !== id)
    })),

    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),

    clearSignals: () => set({ signals: [], error: null }),
}));

export default useSignalsStore;
