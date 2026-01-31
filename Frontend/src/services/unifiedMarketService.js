// Unified Market Data Service
// Combina Binance (crypto) + Yahoo Finance (stocks/ETFs/futures)
// Permite buscar TODOS los activos desde una sola interfaz

import { searchBinanceAssets, getTopBinanceAssets, getBinanceAssetCounts } from './binanceService';

const YAHOO_FINANCE_API = 'https://query2.finance.yahoo.com';

// ============================================
// LISTAS DE SÍMBOLOS POPULARES
// ============================================

// Acciones populares (200+)
const POPULAR_STOCKS = [
    // Mega Cap Tech
    'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'META', 'TSLA',
    // Tech
    'AMD', 'INTC', 'CRM', 'ORCL', 'ADBE', 'CSCO', 'AVGO', 'QCOM', 'TXN', 'IBM', 'NFLX',
    'PYPL', 'SQ', 'SHOP', 'UBER', 'LYFT', 'SNAP', 'PINS', 'ZM', 'DOCU', 'ROKU',
    'PLTR', 'SNOW', 'DDOG', 'NET', 'CRWD', 'ZS', 'OKTA', 'MDB', 'COIN', 'HOOD',
    // Semiconductors
    'MU', 'MRVL', 'LRCX', 'AMAT', 'KLAC', 'ASML', 'TSM', 'ARM', 'SMCI',
    // Finance
    'JPM', 'BAC', 'WFC', 'C', 'GS', 'MS', 'V', 'MA', 'AXP', 'BLK', 'SCHW', 'BRK-B',
    // Healthcare
    'JNJ', 'UNH', 'PFE', 'ABBV', 'MRK', 'LLY', 'TMO', 'ABT', 'DHR', 'BMY', 'AMGN', 'GILD', 'MRNA',
    // Consumer
    'WMT', 'COST', 'TGT', 'HD', 'LOW', 'SBUX', 'MCD', 'NKE', 'DIS', 'CMCSA', 'PEP', 'KO', 'PG',
    // Industrials
    'CAT', 'DE', 'BA', 'LMT', 'RTX', 'NOC', 'GD', 'HON', 'GE', 'MMM', 'UPS', 'FDX',
    // Energy
    'XOM', 'CVX', 'COP', 'OXY', 'SLB', 'HAL', 'EOG', 'PXD',
    // Auto
    'F', 'GM', 'RIVN', 'LCID', 'NIO', 'XPEV', 'LI',
    // Airlines
    'DAL', 'UAL', 'AAL', 'LUV',
    // Gaming
    'EA', 'TTWO', 'RBLX', 'U',
];

// ETFs populares (80+)
const POPULAR_ETFS = [
    // Index
    'SPY', 'VOO', 'IVV', 'QQQ', 'DIA', 'IWM', 'VTI', 'VTV', 'VUG', 'VIG', 'VYM', 'SCHD',
    // Sector
    'XLK', 'XLF', 'XLE', 'XLV', 'XLY', 'XLP', 'XLI', 'XLB', 'XLU', 'XLRE', 'XLC',
    // Thematic
    'ARKK', 'ARKW', 'ARKG', 'ARKF', 'SOXX', 'SMH', 'IBB', 'XBI', 'HACK', 'CIBR',
    'CLOU', 'BOTZ', 'ICLN', 'TAN', 'QCLN', 'LIT', 'URA', 'JETS', 'BLOK', 'BITO',
    // Commodities
    'GLD', 'IAU', 'SLV', 'GDX', 'GDXJ', 'USO', 'UNG', 'DBA', 'DBC',
    // Bonds
    'BND', 'AGG', 'TLT', 'IEF', 'SHY', 'LQD', 'HYG', 'JNK', 'TIP',
    // International
    'VEA', 'VWO', 'EFA', 'EEM', 'IEMG', 'FXI', 'MCHI', 'EWJ', 'EWG', 'EWZ',
    // Leveraged
    'TQQQ', 'SQQQ', 'SPXL', 'SPXS', 'SOXL', 'SOXS', 'UPRO', 'UVXY', 'VXX',
];

// Futuros/Índices (símbolos de Yahoo Finance)
const FUTURES_INDICES = {
    // Índices US
    '^GSPC': { name: 'S&P 500', displayId: 'SPX500' },
    '^DJI': { name: 'Dow Jones Industrial', displayId: 'US30' },
    '^IXIC': { name: 'Nasdaq Composite', displayId: 'NASDAQ' },
    '^NDX': { name: 'Nasdaq 100', displayId: 'NAS100' },
    '^RUT': { name: 'Russell 2000', displayId: 'US2000' },
    '^VIX': { name: 'Volatility Index', displayId: 'VIX' },
    // Futuros
    'ES=F': { name: 'S&P 500 Futures', displayId: 'ES' },
    'NQ=F': { name: 'Nasdaq 100 Futures', displayId: 'NQ' },
    'YM=F': { name: 'Dow Jones Futures', displayId: 'YM' },
    'RTY=F': { name: 'Russell 2000 Futures', displayId: 'RTY' },
    // Commodities
    'GC=F': { name: 'Gold Futures', displayId: 'XAUUSD' },
    'SI=F': { name: 'Silver Futures', displayId: 'XAGUSD' },
    'CL=F': { name: 'Crude Oil WTI', displayId: 'OIL' },
    'BZ=F': { name: 'Brent Crude', displayId: 'BRENT' },
    'NG=F': { name: 'Natural Gas', displayId: 'NATGAS' },
    'PL=F': { name: 'Platinum', displayId: 'XPTUSD' },
    'HG=F': { name: 'Copper', displayId: 'COPPER' },
    // Agro
    'ZC=F': { name: 'Corn', displayId: 'CORN' },
    'ZS=F': { name: 'Soybean', displayId: 'SOYBEAN' },
    'ZW=F': { name: 'Wheat', displayId: 'WHEAT' },
    'KC=F': { name: 'Coffee', displayId: 'COFFEE' },
    // Índices Globales
    '^FTSE': { name: 'FTSE 100 (UK)', displayId: 'UK100' },
    '^GDAXI': { name: 'DAX (Germany)', displayId: 'GER40' },
    '^FCHI': { name: 'CAC 40 (France)', displayId: 'FRA40' },
    '^N225': { name: 'Nikkei 225 (Japan)', displayId: 'JPN225' },
    '^HSI': { name: 'Hang Seng (HK)', displayId: 'HK50' },
};

// Cache
let yahooCache = {};
const CACHE_DURATION = 60000;

/**
 * Buscar en Yahoo Finance
 */
const searchYahoo = async (query) => {
    try {
        const response = await fetch(
            `${YAHOO_FINANCE_API}/v1/finance/search?q=${encodeURIComponent(query)}&quotesCount=20&newsCount=0`
        );
        const data = await response.json();

        if (data.quotes) {
            return data.quotes.map(quote => {
                let category = 'Acciones';
                if (quote.quoteType === 'ETF') category = 'ETFs';
                if (quote.quoteType === 'INDEX' || quote.quoteType === 'FUTURE') category = 'Futuros';
                if (quote.quoteType === 'CRYPTOCURRENCY') category = 'Cripto';

                return {
                    id: quote.symbol,
                    name: quote.shortname || quote.longname || quote.symbol,
                    category,
                    exchange: quote.exchange,
                };
            });
        }
        return [];
    } catch (error) {
        console.error('Yahoo search error:', error);
        return [];
    }
};

/**
 * Obtener precio de Yahoo Finance
 */
const getYahooQuote = async (symbol) => {
    const now = Date.now();
    if (yahooCache[symbol] && (now - yahooCache[symbol].timestamp) < CACHE_DURATION) {
        return yahooCache[symbol].data;
    }

    try {
        const response = await fetch(
            `${YAHOO_FINANCE_API}/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1d`
        );
        const data = await response.json();

        const result = data?.chart?.result?.[0];
        if (!result) return null;

        const meta = result.meta;
        const quote = {
            symbol: symbol,
            price: meta.regularMarketPrice?.toFixed(2) || '0',
            change: ((meta.regularMarketPrice - meta.previousClose) / meta.previousClose * 100)?.toFixed(2) || '0',
            volume: formatVolume(meta.regularMarketVolume || 0),
        };

        yahooCache[symbol] = { data: quote, timestamp: now };
        return quote;
    } catch (error) {
        console.error(`Yahoo quote error for ${symbol}:`, error);
        return null;
    }
};

/**
 * Búsqueda unificada en todas las APIs
 */
export const searchAllAssets = async (query, options = {}) => {
    const { limit = 50 } = options;

    if (!query || query.length < 1) return [];

    const searchTerm = query.toUpperCase();
    const results = [];
    const seen = new Set();

    // 1. Buscar en Binance (crypto)
    try {
        const binanceResults = await searchBinanceAssets(query, { limit: 30 });
        binanceResults.forEach(asset => {
            if (!seen.has(asset.id)) {
                seen.add(asset.id);
                results.push({
                    ...asset,
                    source: 'Binance',
                });
            }
        });
    } catch (e) {
        console.error('Binance search error:', e);
    }

    // 2. Buscar en listas locales (stocks, ETFs, futures)
    POPULAR_STOCKS.forEach(symbol => {
        if (symbol.includes(searchTerm) && !seen.has(symbol)) {
            seen.add(symbol);
            results.push({
                id: symbol,
                name: symbol,
                category: 'Acciones',
                source: 'Yahoo',
            });
        }
    });

    POPULAR_ETFS.forEach(symbol => {
        if (symbol.includes(searchTerm) && !seen.has(symbol)) {
            seen.add(symbol);
            results.push({
                id: symbol,
                name: symbol,
                category: 'ETFs',
                source: 'Yahoo',
            });
        }
    });

    Object.entries(FUTURES_INDICES).forEach(([symbol, info]) => {
        const displayId = info.displayId;
        if ((displayId.includes(searchTerm) || symbol.includes(searchTerm) || info.name.toUpperCase().includes(searchTerm)) && !seen.has(displayId)) {
            seen.add(displayId);
            results.push({
                id: displayId,
                yahooSymbol: symbol,
                name: info.name,
                category: 'Futuros',
                source: 'Yahoo',
            });
        }
    });

    // 3. Buscar en Yahoo Finance para resultados adicionales
    try {
        const yahooResults = await searchYahoo(query);
        yahooResults.forEach(asset => {
            if (!seen.has(asset.id) && asset.category !== 'Cripto') { // Evitar duplicar crypto
                seen.add(asset.id);
                results.push({
                    ...asset,
                    source: 'Yahoo',
                });
            }
        });
    } catch (e) {
        console.error('Yahoo search error:', e);
    }

    return results.slice(0, limit);
};

/**
 * Obtener activos populares de todas las categorías
 */
export const getPopularAssets = async () => {
    const results = [];

    // 1. Top crypto de Binance
    try {
        const topCrypto = await getTopBinanceAssets(30);
        topCrypto.forEach(asset => {
            results.push({
                ...asset,
                source: 'Binance',
            });
        });
    } catch (e) {
        console.error('Binance error:', e);
    }

    // 2. Acciones populares
    const topStocks = POPULAR_STOCKS.slice(0, 20);
    topStocks.forEach(symbol => {
        results.push({
            id: symbol,
            name: symbol,
            category: 'Acciones',
            source: 'Yahoo',
        });
    });

    // 3. ETFs populares
    const topETFs = POPULAR_ETFS.slice(0, 15);
    topETFs.forEach(symbol => {
        results.push({
            id: symbol,
            name: symbol,
            category: 'ETFs',
            source: 'Yahoo',
        });
    });

    // 4. Futuros populares
    const topFutures = Object.entries(FUTURES_INDICES).slice(0, 15);
    topFutures.forEach(([symbol, info]) => {
        results.push({
            id: info.displayId,
            yahooSymbol: symbol,
            name: info.name,
            category: 'Futuros',
            source: 'Yahoo',
        });
    });

    return results;
};

/**
 * Obtener conteo de activos por categoría
 */
export const getAssetCounts = async () => {
    const binanceCounts = await getBinanceAssetCounts();

    return {
        crypto: binanceCounts.usdt || 500,
        stocks: POPULAR_STOCKS.length,
        etfs: POPULAR_ETFS.length,
        futures: Object.keys(FUTURES_INDICES).length,
        total: (binanceCounts.usdt || 500) + POPULAR_STOCKS.length + POPULAR_ETFS.length + Object.keys(FUTURES_INDICES).length,
    };
};

// Helper
function formatVolume(vol) {
    if (!vol || isNaN(vol)) return '0';
    if (vol >= 1e12) return `${(vol / 1e12).toFixed(1)}T`;
    if (vol >= 1e9) return `${(vol / 1e9).toFixed(1)}B`;
    if (vol >= 1e6) return `${(vol / 1e6).toFixed(1)}M`;
    if (vol >= 1e3) return `${(vol / 1e3).toFixed(1)}K`;
    return vol.toFixed(0);
}

export default {
    searchAllAssets,
    getPopularAssets,
    getAssetCounts,
    POPULAR_STOCKS,
    POPULAR_ETFS,
    FUTURES_INDICES,
};
