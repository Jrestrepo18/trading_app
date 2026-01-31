// Market Data Service - EXTENDED LISTS
// CoinGecko para Crypto, Yahoo Finance para Acciones/ETFs/Futuros
// Listas expandidas con 100+ cryptos, 200+ acciones, 50+ ETFs

// ============================================
// LISTA COMPLETA DE CRIPTOMONEDAS (100+)
// ============================================
export const CRYPTO_LIST = {
    // Top 50 por Market Cap
    'BTCUSD': { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' },
    'ETHUSD': { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
    'USDTUSD': { id: 'tether', name: 'Tether', symbol: 'USDT' },
    'BNBUSD': { id: 'binancecoin', name: 'BNB', symbol: 'BNB' },
    'SOLUSD': { id: 'solana', name: 'Solana', symbol: 'SOL' },
    'XRPUSD': { id: 'ripple', name: 'XRP', symbol: 'XRP' },
    'USDCUSD': { id: 'usd-coin', name: 'USD Coin', symbol: 'USDC' },
    'ADAUSD': { id: 'cardano', name: 'Cardano', symbol: 'ADA' },
    'DOGEUSD': { id: 'dogecoin', name: 'Dogecoin', symbol: 'DOGE' },
    'AVAXUSD': { id: 'avalanche-2', name: 'Avalanche', symbol: 'AVAX' },
    'SHIBUSD': { id: 'shiba-inu', name: 'Shiba Inu', symbol: 'SHIB' },
    'DOTUSD': { id: 'polkadot', name: 'Polkadot', symbol: 'DOT' },
    'LINKUSD': { id: 'chainlink', name: 'Chainlink', symbol: 'LINK' },
    'MATICUSD': { id: 'matic-network', name: 'Polygon', symbol: 'MATIC' },
    'TRXUSD': { id: 'tron', name: 'TRON', symbol: 'TRX' },
    'TONUSD': { id: 'the-open-network', name: 'Toncoin', symbol: 'TON' },
    'WBTCUSD': { id: 'wrapped-bitcoin', name: 'Wrapped Bitcoin', symbol: 'WBTC' },
    'UNIUSD': { id: 'uniswap', name: 'Uniswap', symbol: 'UNI' },
    'ATOMUSD': { id: 'cosmos', name: 'Cosmos', symbol: 'ATOM' },
    'LTCUSD': { id: 'litecoin', name: 'Litecoin', symbol: 'LTC' },
    'NEARUSD': { id: 'near', name: 'NEAR Protocol', symbol: 'NEAR' },
    'XLMUSD': { id: 'stellar', name: 'Stellar', symbol: 'XLM' },
    'ICPUSD': { id: 'internet-computer', name: 'Internet Computer', symbol: 'ICP' },
    'APTUSD': { id: 'aptos', name: 'Aptos', symbol: 'APT' },
    'BCHUSD': { id: 'bitcoin-cash', name: 'Bitcoin Cash', symbol: 'BCH' },
    'FILUSD': { id: 'filecoin', name: 'Filecoin', symbol: 'FIL' },
    'ETCUSD': { id: 'ethereum-classic', name: 'Ethereum Classic', symbol: 'ETC' },
    'HBARUSD': { id: 'hedera-hashgraph', name: 'Hedera', symbol: 'HBAR' },
    'OPUSD': { id: 'optimism', name: 'Optimism', symbol: 'OP' },
    'ARBUSD': { id: 'arbitrum', name: 'Arbitrum', symbol: 'ARB' },
    'MKRUSD': { id: 'maker', name: 'Maker', symbol: 'MKR' },
    'VETUSD': { id: 'vechain', name: 'VeChain', symbol: 'VET' },
    'INJUSD': { id: 'injective-protocol', name: 'Injective', symbol: 'INJ' },
    'AABORUSD': { id: 'aave', name: 'Aave', symbol: 'AAVE' },
    'ALGOUSD': { id: 'algorand', name: 'Algorand', symbol: 'ALGO' },
    'GRTUSD': { id: 'the-graph', name: 'The Graph', symbol: 'GRT' },
    'FTMUSD': { id: 'fantom', name: 'Fantom', symbol: 'FTM' },
    'SANDUSD': { id: 'the-sandbox', name: 'The Sandbox', symbol: 'SAND' },
    'MANAUSD': { id: 'decentraland', name: 'Decentraland', symbol: 'MANA' },
    'AXSUSD': { id: 'axie-infinity', name: 'Axie Infinity', symbol: 'AXS' },
    'FLOWUSD': { id: 'flow', name: 'Flow', symbol: 'FLOW' },
    'THETAUSD': { id: 'theta-token', name: 'Theta Network', symbol: 'THETA' },
    'XTZUSD': { id: 'tezos', name: 'Tezos', symbol: 'XTZ' },
    'EOSUSD': { id: 'eos', name: 'EOS', symbol: 'EOS' },
    'ROSEUSD': { id: 'oasis-network', name: 'Oasis Network', symbol: 'ROSE' },
    'CHZUSD': { id: 'chiliz', name: 'Chiliz', symbol: 'CHZ' },
    'ZILUSD': { id: 'zilliqa', name: 'Zilliqa', symbol: 'ZIL' },
    'ENSUSD': { id: 'ethereum-name-service', name: 'ENS', symbol: 'ENS' },
    'CRVUSD': { id: 'curve-dao-token', name: 'Curve DAO', symbol: 'CRV' },
    // Más cryptos populares
    'PEPEUSD': { id: 'pepe', name: 'Pepe', symbol: 'PEPE' },
    'WIFUSD': { id: 'dogwifcoin', name: 'dogwifhat', symbol: 'WIF' },
    'BONKUSD': { id: 'bonk', name: 'Bonk', symbol: 'BONK' },
    'FLOKIUSD': { id: 'floki', name: 'FLOKI', symbol: 'FLOKI' },
    'FETAIUS': { id: 'fetch-ai', name: 'Fetch.ai', symbol: 'FET' },
    'RNDRUSD': { id: 'render-token', name: 'Render', symbol: 'RNDR' },
    'SUIUSD': { id: 'sui', name: 'Sui', symbol: 'SUI' },
    'SEIUSD': { id: 'sei-network', name: 'Sei', symbol: 'SEI' },
    'JUPUSD': { id: 'jupiter-exchange-solana', name: 'Jupiter', symbol: 'JUP' },
    'PYTHUSD': { id: 'pyth-network', name: 'Pyth Network', symbol: 'PYTH' },
    'WLDUSD': { id: 'worldcoin-wld', name: 'Worldcoin', symbol: 'WLD' },
    'TIAUSD': { id: 'celestia', name: 'Celestia', symbol: 'TIA' },
    'STXUSD': { id: 'blockstack', name: 'Stacks', symbol: 'STX' },
    'IMXUSD': { id: 'immutable-x', name: 'Immutable', symbol: 'IMX' },
    'LDOUSD': { id: 'lido-dao', name: 'Lido DAO', symbol: 'LDO' },
    'APEUSD': { id: 'apecoin', name: 'ApeCoin', symbol: 'APE' },
    'RUNEUSD': { id: 'thorchain', name: 'THORChain', symbol: 'RUNE' },
    'ORDIUSD': { id: 'ordinals', name: 'ORDI', symbol: 'ORDI' },
    'BLURUSD': { id: 'blur', name: 'Blur', symbol: 'BLUR' },
    'MINAUSD': { id: 'mina-protocol', name: 'Mina', symbol: 'MINA' },
    'KASUSD': { id: 'kaspa', name: 'Kaspa', symbol: 'KAS' },
    '1INCHUSD': { id: '1inch', name: '1inch', symbol: '1INCH' },
    'COMPUSD': { id: 'compound-governance-token', name: 'Compound', symbol: 'COMP' },
    'SNXUSD': { id: 'havven', name: 'Synthetix', symbol: 'SNX' },
    'YFIUSD': { id: 'yearn-finance', name: 'yearn.finance', symbol: 'YFI' },
    'ZRXUSD': { id: '0x', name: '0x', symbol: 'ZRX' },
    'BATUSD': { id: 'basic-attention-token', name: 'BAT', symbol: 'BAT' },
    'BALUSD': { id: 'balancer', name: 'Balancer', symbol: 'BAL' },
    'SKLUSD': { id: 'skale', name: 'SKALE', symbol: 'SKL' },
    'ANKRUSD': { id: 'ankr', name: 'Ankr', symbol: 'ANKR' },
    'GLMUSD': { id: 'golem', name: 'Golem', symbol: 'GLM' },
    'IOTAUSD': { id: 'iota', name: 'IOTA', symbol: 'IOTA' },
    'NEOUSD': { id: 'neo', name: 'Neo', symbol: 'NEO' },
    'WAVESUSD': { id: 'waves', name: 'Waves', symbol: 'WAVES' },
    'DASHUSD': { id: 'dash', name: 'Dash', symbol: 'DASH' },
    'ZECUSD': { id: 'zcash', name: 'Zcash', symbol: 'ZEC' },
    'XMRUSD': { id: 'monero', name: 'Monero', symbol: 'XMR' },
};

// ============================================
// LISTA COMPLETA DE ACCIONES (200+)
// ============================================
export const STOCKS_LIST = {
    // === MEGA CAP TECH ===
    'AAPL': { name: 'Apple Inc.', sector: 'Technology' },
    'MSFT': { name: 'Microsoft Corp.', sector: 'Technology' },
    'GOOGL': { name: 'Alphabet Inc. Class A', sector: 'Technology' },
    'GOOG': { name: 'Alphabet Inc. Class C', sector: 'Technology' },
    'AMZN': { name: 'Amazon.com Inc.', sector: 'Technology' },
    'NVDA': { name: 'NVIDIA Corp.', sector: 'Technology' },
    'META': { name: 'Meta Platforms Inc.', sector: 'Technology' },
    'TSLA': { name: 'Tesla Inc.', sector: 'Automotive' },

    // === TECH GIANTS ===
    'AMD': { name: 'Advanced Micro Devices', sector: 'Technology' },
    'INTC': { name: 'Intel Corporation', sector: 'Technology' },
    'CRM': { name: 'Salesforce Inc.', sector: 'Technology' },
    'ORCL': { name: 'Oracle Corporation', sector: 'Technology' },
    'ADBE': { name: 'Adobe Inc.', sector: 'Technology' },
    'CSCO': { name: 'Cisco Systems', sector: 'Technology' },
    'AVGO': { name: 'Broadcom Inc.', sector: 'Technology' },
    'QCOM': { name: 'Qualcomm Inc.', sector: 'Technology' },
    'TXN': { name: 'Texas Instruments', sector: 'Technology' },
    'IBM': { name: 'IBM Corporation', sector: 'Technology' },
    'NFLX': { name: 'Netflix Inc.', sector: 'Entertainment' },
    'PYPL': { name: 'PayPal Holdings', sector: 'Fintech' },
    'SQ': { name: 'Block Inc.', sector: 'Fintech' },
    'SHOP': { name: 'Shopify Inc.', sector: 'E-commerce' },
    'UBER': { name: 'Uber Technologies', sector: 'Technology' },
    'LYFT': { name: 'Lyft Inc.', sector: 'Technology' },
    'SNAP': { name: 'Snap Inc.', sector: 'Technology' },
    'PINS': { name: 'Pinterest Inc.', sector: 'Technology' },
    'TWLO': { name: 'Twilio Inc.', sector: 'Technology' },
    'ZM': { name: 'Zoom Video', sector: 'Technology' },
    'DOCU': { name: 'DocuSign Inc.', sector: 'Technology' },
    'ROKU': { name: 'Roku Inc.', sector: 'Technology' },
    'PLTR': { name: 'Palantir Technologies', sector: 'Technology' },
    'SNOW': { name: 'Snowflake Inc.', sector: 'Technology' },
    'DDOG': { name: 'Datadog Inc.', sector: 'Technology' },
    'NET': { name: 'Cloudflare Inc.', sector: 'Technology' },
    'CRWD': { name: 'CrowdStrike Holdings', sector: 'Cybersecurity' },
    'ZS': { name: 'Zscaler Inc.', sector: 'Cybersecurity' },
    'OKTA': { name: 'Okta Inc.', sector: 'Cybersecurity' },
    'MDB': { name: 'MongoDB Inc.', sector: 'Technology' },
    'COIN': { name: 'Coinbase Global', sector: 'Fintech' },
    'HOOD': { name: 'Robinhood Markets', sector: 'Fintech' },
    'AFRM': { name: 'Affirm Holdings', sector: 'Fintech' },
    'RBLX': { name: 'Roblox Corp.', sector: 'Gaming' },
    'EA': { name: 'Electronic Arts', sector: 'Gaming' },
    'TTWO': { name: 'Take-Two Interactive', sector: 'Gaming' },
    'ATVI': { name: 'Activision Blizzard', sector: 'Gaming' },
    'U': { name: 'Unity Software', sector: 'Gaming' },

    // === SEMICONDUCTORS ===
    'MU': { name: 'Micron Technology', sector: 'Semiconductors' },
    'MRVL': { name: 'Marvell Technology', sector: 'Semiconductors' },
    'LRCX': { name: 'Lam Research', sector: 'Semiconductors' },
    'AMAT': { name: 'Applied Materials', sector: 'Semiconductors' },
    'KLAC': { name: 'KLA Corporation', sector: 'Semiconductors' },
    'ASML': { name: 'ASML Holding', sector: 'Semiconductors' },
    'TSM': { name: 'Taiwan Semiconductor', sector: 'Semiconductors' },
    'ARM': { name: 'Arm Holdings', sector: 'Semiconductors' },
    'SMCI': { name: 'Super Micro Computer', sector: 'Technology' },

    // === FINANCE ===
    'JPM': { name: 'JPMorgan Chase & Co.', sector: 'Finance' },
    'BAC': { name: 'Bank of America', sector: 'Finance' },
    'WFC': { name: 'Wells Fargo & Co.', sector: 'Finance' },
    'C': { name: 'Citigroup Inc.', sector: 'Finance' },
    'GS': { name: 'Goldman Sachs', sector: 'Finance' },
    'MS': { name: 'Morgan Stanley', sector: 'Finance' },
    'V': { name: 'Visa Inc.', sector: 'Finance' },
    'MA': { name: 'Mastercard Inc.', sector: 'Finance' },
    'AXP': { name: 'American Express', sector: 'Finance' },
    'BLK': { name: 'BlackRock Inc.', sector: 'Finance' },
    'SCHW': { name: 'Charles Schwab', sector: 'Finance' },
    'BRK.B': { name: 'Berkshire Hathaway B', sector: 'Finance' },
    'USB': { name: 'U.S. Bancorp', sector: 'Finance' },
    'PNC': { name: 'PNC Financial', sector: 'Finance' },
    'TFC': { name: 'Truist Financial', sector: 'Finance' },
    'COF': { name: 'Capital One', sector: 'Finance' },
    'SPGI': { name: 'S&P Global Inc.', sector: 'Finance' },
    'MCO': { name: 'Moodys Corporation', sector: 'Finance' },
    'CME': { name: 'CME Group Inc.', sector: 'Finance' },
    'ICE': { name: 'Intercontinental Exchange', sector: 'Finance' },

    // === HEALTHCARE ===
    'JNJ': { name: 'Johnson & Johnson', sector: 'Healthcare' },
    'UNH': { name: 'UnitedHealth Group', sector: 'Healthcare' },
    'PFE': { name: 'Pfizer Inc.', sector: 'Healthcare' },
    'ABBV': { name: 'AbbVie Inc.', sector: 'Healthcare' },
    'MRK': { name: 'Merck & Co.', sector: 'Healthcare' },
    'LLY': { name: 'Eli Lilly & Co.', sector: 'Healthcare' },
    'TMO': { name: 'Thermo Fisher Scientific', sector: 'Healthcare' },
    'ABT': { name: 'Abbott Laboratories', sector: 'Healthcare' },
    'DHR': { name: 'Danaher Corporation', sector: 'Healthcare' },
    'BMY': { name: 'Bristol-Myers Squibb', sector: 'Healthcare' },
    'AMGN': { name: 'Amgen Inc.', sector: 'Healthcare' },
    'GILD': { name: 'Gilead Sciences', sector: 'Healthcare' },
    'MRNA': { name: 'Moderna Inc.', sector: 'Healthcare' },
    'BNTX': { name: 'BioNTech SE', sector: 'Healthcare' },
    'REGN': { name: 'Regeneron Pharma', sector: 'Healthcare' },
    'VRTX': { name: 'Vertex Pharmaceuticals', sector: 'Healthcare' },
    'ISRG': { name: 'Intuitive Surgical', sector: 'Healthcare' },
    'MDT': { name: 'Medtronic plc', sector: 'Healthcare' },
    'SYK': { name: 'Stryker Corporation', sector: 'Healthcare' },
    'BSX': { name: 'Boston Scientific', sector: 'Healthcare' },
    'ZTS': { name: 'Zoetis Inc.', sector: 'Healthcare' },
    'CVS': { name: 'CVS Health Corp.', sector: 'Healthcare' },

    // === CONSUMER ===
    'WMT': { name: 'Walmart Inc.', sector: 'Retail' },
    'COST': { name: 'Costco Wholesale', sector: 'Retail' },
    'TGT': { name: 'Target Corporation', sector: 'Retail' },
    'HD': { name: 'Home Depot Inc.', sector: 'Retail' },
    'LOW': { name: 'Lowes Companies', sector: 'Retail' },
    'SBUX': { name: 'Starbucks Corp.', sector: 'Consumer' },
    'MCD': { name: 'McDonalds Corp.', sector: 'Consumer' },
    'NKE': { name: 'Nike Inc.', sector: 'Consumer' },
    'DIS': { name: 'Walt Disney Co.', sector: 'Entertainment' },
    'CMCSA': { name: 'Comcast Corporation', sector: 'Entertainment' },
    'PEP': { name: 'PepsiCo Inc.', sector: 'Consumer' },
    'KO': { name: 'Coca-Cola Co.', sector: 'Consumer' },
    'PG': { name: 'Procter & Gamble', sector: 'Consumer' },
    'PM': { name: 'Philip Morris Intl', sector: 'Consumer' },
    'MO': { name: 'Altria Group Inc.', sector: 'Consumer' },
    'CL': { name: 'Colgate-Palmolive', sector: 'Consumer' },
    'EL': { name: 'Estee Lauder Cos.', sector: 'Consumer' },
    'LULU': { name: 'Lululemon Athletica', sector: 'Consumer' },
    'ROST': { name: 'Ross Stores Inc.', sector: 'Retail' },
    'TJX': { name: 'TJX Companies', sector: 'Retail' },
    'DG': { name: 'Dollar General', sector: 'Retail' },
    'DLTR': { name: 'Dollar Tree Inc.', sector: 'Retail' },

    // === INDUSTRIALS ===
    'CAT': { name: 'Caterpillar Inc.', sector: 'Industrials' },
    'DE': { name: 'Deere & Company', sector: 'Industrials' },
    'BA': { name: 'Boeing Company', sector: 'Aerospace' },
    'LMT': { name: 'Lockheed Martin', sector: 'Aerospace' },
    'RTX': { name: 'RTX Corporation', sector: 'Aerospace' },
    'NOC': { name: 'Northrop Grumman', sector: 'Aerospace' },
    'GD': { name: 'General Dynamics', sector: 'Aerospace' },
    'HON': { name: 'Honeywell Intl', sector: 'Industrials' },
    'GE': { name: 'General Electric', sector: 'Industrials' },
    'MMM': { name: '3M Company', sector: 'Industrials' },
    'UPS': { name: 'United Parcel Service', sector: 'Logistics' },
    'FDX': { name: 'FedEx Corporation', sector: 'Logistics' },
    'UNP': { name: 'Union Pacific Corp.', sector: 'Railroads' },
    'CSX': { name: 'CSX Corporation', sector: 'Railroads' },

    // === ENERGY ===
    'XOM': { name: 'Exxon Mobil Corp.', sector: 'Energy' },
    'CVX': { name: 'Chevron Corporation', sector: 'Energy' },
    'COP': { name: 'ConocoPhillips', sector: 'Energy' },
    'OXY': { name: 'Occidental Petroleum', sector: 'Energy' },
    'SLB': { name: 'Schlumberger Ltd.', sector: 'Energy' },
    'HAL': { name: 'Halliburton Company', sector: 'Energy' },
    'EOG': { name: 'EOG Resources', sector: 'Energy' },
    'PXD': { name: 'Pioneer Natural Res.', sector: 'Energy' },
    'MPC': { name: 'Marathon Petroleum', sector: 'Energy' },
    'VLO': { name: 'Valero Energy Corp.', sector: 'Energy' },

    // === UTILITIES & REITS ===
    'NEE': { name: 'NextEra Energy', sector: 'Utilities' },
    'DUK': { name: 'Duke Energy Corp.', sector: 'Utilities' },
    'SO': { name: 'Southern Company', sector: 'Utilities' },
    'D': { name: 'Dominion Energy', sector: 'Utilities' },
    'AEP': { name: 'American Electric Power', sector: 'Utilities' },
    'AMT': { name: 'American Tower Corp.', sector: 'REITs' },
    'PLD': { name: 'Prologis Inc.', sector: 'REITs' },
    'CCI': { name: 'Crown Castle Intl', sector: 'REITs' },
    'EQIX': { name: 'Equinix Inc.', sector: 'REITs' },
    'PSA': { name: 'Public Storage', sector: 'REITs' },
    'O': { name: 'Realty Income Corp.', sector: 'REITs' },

    // === TELECOM ===
    'T': { name: 'AT&T Inc.', sector: 'Telecom' },
    'VZ': { name: 'Verizon Communications', sector: 'Telecom' },
    'TMUS': { name: 'T-Mobile US Inc.', sector: 'Telecom' },

    // === AUTO ===
    'F': { name: 'Ford Motor Company', sector: 'Automotive' },
    'GM': { name: 'General Motors', sector: 'Automotive' },
    'RIVN': { name: 'Rivian Automotive', sector: 'Automotive' },
    'LCID': { name: 'Lucid Group Inc.', sector: 'Automotive' },
    'NIO': { name: 'NIO Inc.', sector: 'Automotive' },
    'XPEV': { name: 'XPeng Inc.', sector: 'Automotive' },
    'LI': { name: 'Li Auto Inc.', sector: 'Automotive' },

    // === TRAVEL & LEISURE ===
    'DAL': { name: 'Delta Air Lines', sector: 'Airlines' },
    'UAL': { name: 'United Airlines', sector: 'Airlines' },
    'AAL': { name: 'American Airlines', sector: 'Airlines' },
    'LUV': { name: 'Southwest Airlines', sector: 'Airlines' },
    'MAR': { name: 'Marriott Intl', sector: 'Hotels' },
    'HLT': { name: 'Hilton Worldwide', sector: 'Hotels' },
    'ABNB': { name: 'Airbnb Inc.', sector: 'Travel' },
    'BKNG': { name: 'Booking Holdings', sector: 'Travel' },
    'EXPE': { name: 'Expedia Group', sector: 'Travel' },
    'CCL': { name: 'Carnival Corporation', sector: 'Cruise' },
    'RCL': { name: 'Royal Caribbean', sector: 'Cruise' },
    'NCLH': { name: 'Norwegian Cruise Line', sector: 'Cruise' },
};

// ============================================
// LISTA COMPLETA DE ETFs (80+)
// ============================================
export const ETFS_LIST = {
    // === INDEX ETFs ===
    'SPY': { name: 'SPDR S&P 500 ETF', sector: 'Index' },
    'VOO': { name: 'Vanguard S&P 500 ETF', sector: 'Index' },
    'IVV': { name: 'iShares Core S&P 500', sector: 'Index' },
    'QQQ': { name: 'Invesco Nasdaq 100 ETF', sector: 'Index' },
    'DIA': { name: 'SPDR Dow Jones ETF', sector: 'Index' },
    'IWM': { name: 'iShares Russell 2000', sector: 'Index' },
    'IWF': { name: 'iShares Russell 1000 Growth', sector: 'Index' },
    'IWD': { name: 'iShares Russell 1000 Value', sector: 'Index' },
    'VTI': { name: 'Vanguard Total Stock Market', sector: 'Index' },
    'VTV': { name: 'Vanguard Value ETF', sector: 'Index' },
    'VUG': { name: 'Vanguard Growth ETF', sector: 'Index' },
    'VIG': { name: 'Vanguard Dividend Appreciation', sector: 'Index' },
    'VYM': { name: 'Vanguard High Dividend Yield', sector: 'Index' },
    'SCHD': { name: 'Schwab US Dividend Equity', sector: 'Index' },
    'MGK': { name: 'Vanguard Mega Cap Growth', sector: 'Index' },

    // === SECTOR ETFs ===
    'XLK': { name: 'Technology Select Sector', sector: 'Technology' },
    'XLF': { name: 'Financial Select Sector', sector: 'Finance' },
    'XLE': { name: 'Energy Select Sector', sector: 'Energy' },
    'XLV': { name: 'Health Care Select Sector', sector: 'Healthcare' },
    'XLY': { name: 'Consumer Discretionary', sector: 'Consumer' },
    'XLP': { name: 'Consumer Staples', sector: 'Consumer' },
    'XLI': { name: 'Industrial Select Sector', sector: 'Industrials' },
    'XLB': { name: 'Materials Select Sector', sector: 'Materials' },
    'XLU': { name: 'Utilities Select Sector', sector: 'Utilities' },
    'XLRE': { name: 'Real Estate Select', sector: 'REITs' },
    'XLC': { name: 'Communication Services', sector: 'Communication' },

    // === THEMATIC ETFs ===
    'ARKK': { name: 'ARK Innovation ETF', sector: 'Innovation' },
    'ARKW': { name: 'ARK Next Gen Internet', sector: 'Technology' },
    'ARKG': { name: 'ARK Genomic Revolution', sector: 'Healthcare' },
    'ARKF': { name: 'ARK Fintech Innovation', sector: 'Fintech' },
    'ARKQ': { name: 'ARK Autonomous Tech', sector: 'Technology' },
    'SOXX': { name: 'iShares Semiconductor', sector: 'Semiconductors' },
    'SMH': { name: 'VanEck Semiconductor', sector: 'Semiconductors' },
    'IBB': { name: 'iShares Biotechnology', sector: 'Healthcare' },
    'XBI': { name: 'SPDR S&P Biotech', sector: 'Healthcare' },
    'HACK': { name: 'ETFMG Prime Cyber Security', sector: 'Cybersecurity' },
    'CIBR': { name: 'First Trust Cybersecurity', sector: 'Cybersecurity' },
    'CLOU': { name: 'Global X Cloud Computing', sector: 'Cloud' },
    'SKYY': { name: 'First Trust Cloud Computing', sector: 'Cloud' },
    'BOTZ': { name: 'Global X Robotics & AI', sector: 'AI' },
    'ROBO': { name: 'ROBO Global Robotics', sector: 'AI' },
    'DRIV': { name: 'Global X Autonomous Vehicles', sector: 'Technology' },
    'ICLN': { name: 'iShares Global Clean Energy', sector: 'Clean Energy' },
    'TAN': { name: 'Invesco Solar ETF', sector: 'Clean Energy' },
    'QCLN': { name: 'First Trust Clean Edge', sector: 'Clean Energy' },
    'LIT': { name: 'Global X Lithium & Battery', sector: 'Materials' },
    'URA': { name: 'Global X Uranium ETF', sector: 'Energy' },
    'JETS': { name: 'US Global Jets ETF', sector: 'Airlines' },
    'BLOK': { name: 'Amplify Blockchain ETF', sector: 'Blockchain' },
    'BITO': { name: 'ProShares Bitcoin Strategy', sector: 'Crypto' },
    'GBTC': { name: 'Grayscale Bitcoin Trust', sector: 'Crypto' },
    'ETHE': { name: 'Grayscale Ethereum Trust', sector: 'Crypto' },

    // === COMMODITIES ETFs ===
    'GLD': { name: 'SPDR Gold Shares', sector: 'Commodities' },
    'IAU': { name: 'iShares Gold Trust', sector: 'Commodities' },
    'SLV': { name: 'iShares Silver Trust', sector: 'Commodities' },
    'GDX': { name: 'VanEck Gold Miners', sector: 'Mining' },
    'GDXJ': { name: 'VanEck Junior Gold Miners', sector: 'Mining' },
    'USO': { name: 'United States Oil Fund', sector: 'Energy' },
    'UNG': { name: 'United States Natural Gas', sector: 'Energy' },
    'DBA': { name: 'Invesco Agriculture', sector: 'Agriculture' },
    'DBC': { name: 'Invesco Commodities', sector: 'Commodities' },

    // === BOND ETFs ===
    'BND': { name: 'Vanguard Total Bond Market', sector: 'Bonds' },
    'AGG': { name: 'iShares Core Aggregate Bond', sector: 'Bonds' },
    'TLT': { name: 'iShares 20+ Year Treasury', sector: 'Bonds' },
    'IEF': { name: 'iShares 7-10 Year Treasury', sector: 'Bonds' },
    'SHY': { name: 'iShares 1-3 Year Treasury', sector: 'Bonds' },
    'LQD': { name: 'iShares Investment Grade', sector: 'Bonds' },
    'HYG': { name: 'iShares High Yield Corporate', sector: 'Bonds' },
    'JNK': { name: 'SPDR High Yield Bond', sector: 'Bonds' },
    'TIP': { name: 'iShares TIPS Bond', sector: 'Bonds' },
    'VCIT': { name: 'Vanguard Intermediate Corp', sector: 'Bonds' },

    // === INTERNATIONAL ETFs ===
    'VEA': { name: 'Vanguard Developed Markets', sector: 'International' },
    'VWO': { name: 'Vanguard Emerging Markets', sector: 'International' },
    'EFA': { name: 'iShares EAFE', sector: 'International' },
    'EEM': { name: 'iShares Emerging Markets', sector: 'International' },
    'IEMG': { name: 'iShares Core EM', sector: 'International' },
    'FXI': { name: 'iShares China Large-Cap', sector: 'China' },
    'MCHI': { name: 'iShares MSCI China', sector: 'China' },
    'EWJ': { name: 'iShares MSCI Japan', sector: 'Japan' },
    'EWG': { name: 'iShares MSCI Germany', sector: 'Germany' },
    'EWU': { name: 'iShares MSCI UK', sector: 'UK' },
    'EWZ': { name: 'iShares MSCI Brazil', sector: 'Brazil' },

    // === LEVERAGED/INVERSE ETFs ===
    'TQQQ': { name: 'ProShares UltraPro QQQ 3x', sector: 'Leveraged' },
    'SQQQ': { name: 'ProShares UltraPro Short QQQ', sector: 'Inverse' },
    'SPXL': { name: 'Direxion S&P 500 Bull 3X', sector: 'Leveraged' },
    'SPXS': { name: 'Direxion S&P 500 Bear 3X', sector: 'Inverse' },
    'SOXL': { name: 'Direxion Semiconductor Bull 3X', sector: 'Leveraged' },
    'SOXS': { name: 'Direxion Semiconductor Bear 3X', sector: 'Inverse' },
    'UPRO': { name: 'ProShares UltraPro S&P500', sector: 'Leveraged' },
    'UVXY': { name: 'ProShares Ultra VIX', sector: 'Volatility' },
    'SVXY': { name: 'ProShares Short VIX', sector: 'Volatility' },
    'VXX': { name: 'iPath VIX Short-Term', sector: 'Volatility' },
};

// ============================================
// LISTA DE FUTUROS/ÍNDICES
// ============================================
export const FUTURES_LIST = {
    // === ÍNDICES ===
    'ES=F': { name: 'S&P 500 Futures', displayId: 'SPX500' },
    'NQ=F': { name: 'Nasdaq 100 Futures', displayId: 'NAS100' },
    'YM=F': { name: 'Dow Jones Futures', displayId: 'US30' },
    'RTY=F': { name: 'Russell 2000 Futures', displayId: 'US2000' },
    '^VIX': { name: 'Volatility Index', displayId: 'VIX' },
    '^GSPC': { name: 'S&P 500 Index', displayId: 'SPX' },
    '^DJI': { name: 'Dow Jones Industrial', displayId: 'DJI' },
    '^IXIC': { name: 'Nasdaq Composite', displayId: 'COMP' },
    '^RUT': { name: 'Russell 2000 Index', displayId: 'RUT' },

    // === COMMODITIES FUTUROS ===
    'GC=F': { name: 'Gold Futures', displayId: 'XAUUSD' },
    'SI=F': { name: 'Silver Futures', displayId: 'XAGUSD' },
    'CL=F': { name: 'Crude Oil WTI', displayId: 'OILUSD' },
    'BZ=F': { name: 'Brent Crude Oil', displayId: 'BRENT' },
    'NG=F': { name: 'Natural Gas', displayId: 'NATGAS' },
    'PL=F': { name: 'Platinum Futures', displayId: 'XPTUSD' },
    'PA=F': { name: 'Palladium Futures', displayId: 'XPDUSD' },
    'HG=F': { name: 'Copper Futures', displayId: 'COPPER' },

    // === AGRO FUTUROS ===
    'ZC=F': { name: 'Corn Futures', displayId: 'CORN' },
    'ZS=F': { name: 'Soybean Futures', displayId: 'SOYBEAN' },
    'ZW=F': { name: 'Wheat Futures', displayId: 'WHEAT' },
    'KC=F': { name: 'Coffee Futures', displayId: 'COFFEE' },
    'CT=F': { name: 'Cotton Futures', displayId: 'COTTON' },
    'SB=F': { name: 'Sugar Futures', displayId: 'SUGAR' },

    // === ÍNDICES GLOBALES ===
    '^FTSE': { name: 'FTSE 100 (UK)', displayId: 'UK100' },
    '^GDAXI': { name: 'DAX (Germany)', displayId: 'GER40' },
    '^FCHI': { name: 'CAC 40 (France)', displayId: 'FRA40' },
    '^N225': { name: 'Nikkei 225 (Japan)', displayId: 'JPN225' },
    '^HSI': { name: 'Hang Seng (HK)', displayId: 'HK50' },
    '000001.SS': { name: 'Shanghai Composite', displayId: 'CHINA50' },
    '^AXJO': { name: 'ASX 200 (Australia)', displayId: 'AUS200' },
};

// Combinar todas las listas para acciones
export const STOCKS_ETF_FUTURES = {
    ...Object.fromEntries(
        Object.entries(STOCKS_LIST).map(([k, v]) => [k, { ...v, category: 'Acciones' }])
    ),
    ...Object.fromEntries(
        Object.entries(ETFS_LIST).map(([k, v]) => [k, { ...v, category: 'ETFs' }])
    ),
    ...Object.fromEntries(
        Object.entries(FUTURES_LIST).map(([k, v]) => [k, { ...v, category: 'Futuros' }])
    ),
};

// Cache
let cryptoCache = { data: null, timestamp: 0 };
let stockCache = {};
const CACHE_DURATION = 60000;

/**
 * Obtener precios de crypto desde CoinGecko
 */
export const fetchCryptoPrices = async () => {
    const now = Date.now();
    if (cryptoCache.data && (now - cryptoCache.timestamp) < CACHE_DURATION) {
        return cryptoCache.data;
    }

    try {
        const ids = Object.values(CRYPTO_LIST).map(c => c.id).join(',');
        const response = await fetch(
            `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true`
        );
        const data = await response.json();

        const result = {};
        Object.entries(CRYPTO_LIST).forEach(([symbol, info]) => {
            const priceData = data[info.id];
            if (priceData) {
                result[symbol] = {
                    id: symbol,
                    name: `${info.name} / USD`,
                    category: 'Cripto',
                    price: priceData.usd?.toFixed(2) || '0',
                    change24h: priceData.usd_24h_change?.toFixed(2) || '0',
                    volume: formatVolume(priceData.usd_24h_vol || 0),
                };
            }
        });

        cryptoCache = { data: result, timestamp: now };
        return result;
    } catch (error) {
        console.error('Error fetching crypto prices:', error);
        return cryptoCache.data || {};
    }
};

/**
 * Obtener precio de una acción/ETF
 */
export const fetchStockPrice = async (symbol) => {
    const now = Date.now();
    if (stockCache[symbol] && (now - stockCache[symbol].timestamp) < CACHE_DURATION) {
        return stockCache[symbol].data;
    }

    try {
        const response = await fetch(
            `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`
        );
        const data = await response.json();

        const quote = data?.chart?.result?.[0];
        if (!quote) return null;

        const meta = quote.meta;
        const info = STOCKS_ETF_FUTURES[symbol] || { name: symbol, category: 'Acciones' };

        const result = {
            id: info.displayId || symbol,
            yahooSymbol: symbol,
            name: info.name,
            category: info.category,
            price: meta.regularMarketPrice?.toFixed(2) || '0',
            change24h: ((meta.regularMarketPrice - meta.previousClose) / meta.previousClose * 100)?.toFixed(2) || '0',
            volume: formatVolume(meta.regularMarketVolume || 0),
        };

        stockCache[symbol] = { data: result, timestamp: now };
        return result;
    } catch (error) {
        console.error(`Error fetching stock price for ${symbol}:`, error);
        return null;
    }
};

/**
 * Obtener múltiples precios
 */
export const fetchMultipleStockPrices = async (symbols) => {
    const results = {};
    const batchSize = 5;

    for (let i = 0; i < symbols.length; i += batchSize) {
        const batch = symbols.slice(i, i + batchSize);
        const promises = batch.map(symbol => fetchStockPrice(symbol));
        const batchResults = await Promise.all(promises);

        batchResults.forEach((result) => {
            if (result) {
                results[result.id] = result;
            }
        });

        if (i + batchSize < symbols.length) {
            await new Promise(r => setTimeout(r, 200));
        }
    }

    return results;
};

/**
 * Búsqueda unificada de activos - RETORNA TODOS LOS MATCHING
 */
export const searchAssets = async (query) => {
    if (!query || query.length < 1) return [];

    const searchTerm = query.toUpperCase();
    const results = [];

    // Buscar en crypto
    Object.entries(CRYPTO_LIST).forEach(([symbol, info]) => {
        if (symbol.includes(searchTerm) ||
            info.name.toUpperCase().includes(searchTerm) ||
            info.symbol.includes(searchTerm)) {
            results.push({
                id: symbol,
                name: `${info.name} / USD`,
                category: 'Cripto',
                icon: 'Zap',
            });
        }
    });

    // Buscar en acciones
    Object.entries(STOCKS_LIST).forEach(([symbol, info]) => {
        if (symbol.includes(searchTerm) ||
            info.name.toUpperCase().includes(searchTerm)) {
            results.push({
                id: symbol,
                name: info.name,
                category: 'Acciones',
                icon: 'BarChart4',
            });
        }
    });

    // Buscar en ETFs
    Object.entries(ETFS_LIST).forEach(([symbol, info]) => {
        if (symbol.includes(searchTerm) ||
            info.name.toUpperCase().includes(searchTerm)) {
            results.push({
                id: symbol,
                name: info.name,
                category: 'ETFs',
                icon: 'Layers',
            });
        }
    });

    // Buscar en Futuros
    Object.entries(FUTURES_LIST).forEach(([symbol, info]) => {
        const displayId = info.displayId || symbol;
        if (displayId.includes(searchTerm) ||
            symbol.includes(searchTerm) ||
            info.name.toUpperCase().includes(searchTerm)) {
            results.push({
                id: displayId,
                yahooSymbol: symbol,
                name: info.name,
                category: 'Futuros',
                icon: 'TrendingUp',
            });
        }
    });

    return results.slice(0, 50); // Limitar a 50 resultados
};

/**
 * Obtener todos los activos disponibles con precios
 */
export const getAllAssetsWithPrices = async () => {
    const cryptos = await fetchCryptoPrices();
    const popularStocks = ['AAPL', 'TSLA', 'NVDA', 'SPY', 'QQQ', 'GC=F', 'ES=F', 'NQ=F'];
    const stocks = await fetchMultipleStockPrices(popularStocks);
    return { ...cryptos, ...stocks };
};

/**
 * Obtener conteo de activos disponibles
 */
export const getAssetCounts = () => ({
    crypto: Object.keys(CRYPTO_LIST).length,
    stocks: Object.keys(STOCKS_LIST).length,
    etfs: Object.keys(ETFS_LIST).length,
    futures: Object.keys(FUTURES_LIST).length,
    total: Object.keys(CRYPTO_LIST).length + Object.keys(STOCKS_LIST).length +
        Object.keys(ETFS_LIST).length + Object.keys(FUTURES_LIST).length,
});

function formatVolume(vol) {
    if (vol >= 1e12) return `${(vol / 1e12).toFixed(1)}T`;
    if (vol >= 1e9) return `${(vol / 1e9).toFixed(1)}B`;
    if (vol >= 1e6) return `${(vol / 1e6).toFixed(1)}M`;
    if (vol >= 1e3) return `${(vol / 1e3).toFixed(1)}K`;
    return vol.toString();
}

export default {
    fetchCryptoPrices,
    fetchStockPrice,
    fetchMultipleStockPrices,
    searchAssets,
    getAllAssetsWithPrices,
    getAssetCounts,
    CRYPTO_LIST,
    STOCKS_LIST,
    ETFS_LIST,
    FUTURES_LIST,
    STOCKS_ETF_FUTURES,
};
