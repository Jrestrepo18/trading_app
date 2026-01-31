// Binance Market Data Service
// API pública de Binance - No requiere autenticación
// Obtiene TODOS los pares de trading disponibles en tiempo real

const BINANCE_API = 'https://api.binance.com/api/v3';

// Cache para evitar demasiadas requests
let exchangeInfoCache = { data: null, timestamp: 0 };
let tickerCache = { data: null, timestamp: 0 };
const CACHE_DURATION = 60000; // 1 minuto
const TICKER_CACHE_DURATION = 10000; // 10 segundos para precios

/**
 * Obtener información de todos los símbolos de Binance
 * Retorna ~2000+ pares de trading
 */
export const fetchBinanceExchangeInfo = async () => {
    const now = Date.now();
    if (exchangeInfoCache.data && (now - exchangeInfoCache.timestamp) < CACHE_DURATION * 5) {
        return exchangeInfoCache.data;
    }

    try {
        const response = await fetch(`${BINANCE_API}/exchangeInfo`);
        const data = await response.json();

        if (data.symbols) {
            exchangeInfoCache = { data: data.symbols, timestamp: now };
            return data.symbols;
        }
        return [];
    } catch (error) {
        console.error('Error fetching Binance exchange info:', error);
        return exchangeInfoCache.data || [];
    }
};

/**
 * Obtener todos los precios actuales de Binance (24h ticker)
 */
export const fetchBinanceTickerPrices = async () => {
    const now = Date.now();
    if (tickerCache.data && (now - tickerCache.timestamp) < TICKER_CACHE_DURATION) {
        return tickerCache.data;
    }

    try {
        const response = await fetch(`${BINANCE_API}/ticker/24hr`);
        const data = await response.json();

        // Convertir a objeto para acceso rápido
        const tickerMap = {};
        data.forEach(ticker => {
            tickerMap[ticker.symbol] = {
                price: parseFloat(ticker.lastPrice).toFixed(ticker.lastPrice < 1 ? 6 : 2),
                change24h: parseFloat(ticker.priceChangePercent).toFixed(2),
                volume: formatVolume(parseFloat(ticker.quoteVolume)),
                high24h: ticker.highPrice,
                low24h: ticker.lowPrice,
            };
        });

        tickerCache = { data: tickerMap, timestamp: now };
        return tickerMap;
    } catch (error) {
        console.error('Error fetching Binance ticker prices:', error);
        return tickerCache.data || {};
    }
};

/**
 * Obtener precio de un símbolo específico
 */
export const fetchBinancePrice = async (symbol) => {
    try {
        const response = await fetch(`${BINANCE_API}/ticker/price?symbol=${symbol}`);
        const data = await response.json();
        return data.price;
    } catch (error) {
        console.error(`Error fetching price for ${symbol}:`, error);
        return null;
    }
};

/**
 * Categorizar el símbolo de Binance
 */
const categorizeSymbol = (symbol, baseAsset, quoteAsset) => {
    // Crypto principales
    const stablecoins = ['USDT', 'USDC', 'BUSD', 'TUSD', 'DAI', 'FDUSD'];
    const majorCrypto = ['BTC', 'ETH', 'BNB', 'SOL', 'XRP', 'ADA', 'DOGE', 'AVAX', 'DOT', 'LINK', 'MATIC'];

    if (stablecoins.includes(baseAsset)) {
        return 'Stablecoins';
    }

    if (symbol.endsWith('PERP') || symbol.includes('_')) {
        return 'Futuros';
    }

    if (quoteAsset === 'USDT' || quoteAsset === 'USDC' || quoteAsset === 'BUSD') {
        return 'Cripto';
    }

    if (quoteAsset === 'BTC') {
        return 'Cripto/BTC';
    }

    if (quoteAsset === 'ETH') {
        return 'Cripto/ETH';
    }

    return 'Cripto';
};

/**
 * Buscar activos en Binance
 * @param {string} query - Término de búsqueda
 * @param {object} options - Opciones de filtrado
 */
export const searchBinanceAssets = async (query, options = {}) => {
    const {
        quoteAssets = ['USDT', 'USDC', 'BUSD'],  // Por defecto solo pares vs stablecoins
        limit = 100,
        category = null
    } = options;

    const exchangeInfo = await fetchBinanceExchangeInfo();
    const tickers = await fetchBinanceTickerPrices();

    if (!exchangeInfo || exchangeInfo.length === 0) {
        return [];
    }

    const searchTerm = query.toUpperCase();

    // Filtrar símbolos
    let filtered = exchangeInfo.filter(symbol => {
        // Solo símbolos activos
        if (symbol.status !== 'TRADING') return false;

        // Filtrar por quote asset si se especifica
        if (quoteAssets.length > 0 && !quoteAssets.includes(symbol.quoteAsset)) {
            return false;
        }

        // Búsqueda por nombre
        if (searchTerm) {
            const matchesBase = symbol.baseAsset.includes(searchTerm);
            const matchesSymbol = symbol.symbol.includes(searchTerm);
            if (!matchesBase && !matchesSymbol) return false;
        }

        return true;
    });

    // Mapear a formato de respuesta
    const results = filtered.map(symbol => {
        const ticker = tickers[symbol.symbol] || {};
        const cat = categorizeSymbol(symbol.symbol, symbol.baseAsset, symbol.quoteAsset);

        return {
            id: symbol.symbol,
            baseAsset: symbol.baseAsset,
            quoteAsset: symbol.quoteAsset,
            name: `${symbol.baseAsset} / ${symbol.quoteAsset}`,
            category: cat,
            price: ticker.price || '0',
            change24h: ticker.change24h || '0',
            volume: ticker.volume || '0',
            icon: 'Zap', // Icono por defecto para crypto
        };
    });

    // Ordenar por volumen (mayor primero)
    results.sort((a, b) => {
        const volA = parseFloat(a.volume.replace(/[KMB]/g, '')) || 0;
        const volB = parseFloat(b.volume.replace(/[KMB]/g, '')) || 0;
        return volB - volA;
    });

    return results.slice(0, limit);
};

/**
 * Obtener los activos más populares de Binance (por volumen)
 */
export const getTopBinanceAssets = async (limit = 50) => {
    const exchangeInfo = await fetchBinanceExchangeInfo();
    const tickers = await fetchBinanceTickerPrices();

    if (!exchangeInfo || !tickers) return [];

    // Filtrar solo pares USDT que están activos
    const usdtPairs = exchangeInfo.filter(s =>
        s.status === 'TRADING' &&
        s.quoteAsset === 'USDT'
    );

    // Agregar información del ticker
    const withTicker = usdtPairs.map(symbol => {
        const ticker = tickers[symbol.symbol] || {};
        return {
            id: symbol.symbol,
            baseAsset: symbol.baseAsset,
            quoteAsset: symbol.quoteAsset,
            name: `${symbol.baseAsset} / ${symbol.quoteAsset}`,
            category: 'Cripto',
            price: ticker.price || '0',
            change24h: ticker.change24h || '0',
            volume: ticker.volume || '0',
            volumeRaw: parseFloat(ticker.volume?.replace(/[KMB]/g, '') || 0),
            icon: 'Zap',
        };
    });

    // Ordenar por volumen
    withTicker.sort((a, b) => {
        const getNum = str => {
            if (!str) return 0;
            const num = parseFloat(str.replace(/[^0-9.]/g, ''));
            if (str.includes('B')) return num * 1e9;
            if (str.includes('M')) return num * 1e6;
            if (str.includes('K')) return num * 1e3;
            return num;
        };
        return getNum(b.volume) - getNum(a.volume);
    });

    return withTicker.slice(0, limit);
};

/**
 * Obtener conteo de activos disponibles en Binance
 */
export const getBinanceAssetCounts = async () => {
    const exchangeInfo = await fetchBinanceExchangeInfo();

    if (!exchangeInfo) return { total: 0, usdt: 0, btc: 0, eth: 0 };

    const trading = exchangeInfo.filter(s => s.status === 'TRADING');

    return {
        total: trading.length,
        usdt: trading.filter(s => s.quoteAsset === 'USDT').length,
        usdc: trading.filter(s => s.quoteAsset === 'USDC').length,
        btc: trading.filter(s => s.quoteAsset === 'BTC').length,
        eth: trading.filter(s => s.quoteAsset === 'ETH').length,
        bnb: trading.filter(s => s.quoteAsset === 'BNB').length,
    };
};

/**
 * Helper para formatear volumen
 */
function formatVolume(vol) {
    if (!vol || isNaN(vol)) return '0';
    if (vol >= 1e12) return `${(vol / 1e12).toFixed(1)}T`;
    if (vol >= 1e9) return `${(vol / 1e9).toFixed(1)}B`;
    if (vol >= 1e6) return `${(vol / 1e6).toFixed(1)}M`;
    if (vol >= 1e3) return `${(vol / 1e3).toFixed(1)}K`;
    return vol.toFixed(0);
}

// Exportar todo
export default {
    fetchBinanceExchangeInfo,
    fetchBinanceTickerPrices,
    fetchBinancePrice,
    searchBinanceAssets,
    getTopBinanceAssets,
    getBinanceAssetCounts,
};
