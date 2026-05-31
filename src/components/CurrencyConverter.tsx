import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { ArrowLeftRight, Coins, TrendingUp, Info, CreditCard, Wallet, Search, ChevronDown, X } from 'lucide-react';
import { cn } from '../lib/utils';

interface Currency {
  code: string;
  name: string;
  symbol: string;
  rateToUSD: number; // How many units of this currency per 1 USD
}

const SUPPORTED_CURRENCIES: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', rateToUSD: 1.0 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', rateToUSD: 1.37 },
  { code: 'MXN', name: 'Mexican Peso', symbol: 'Mex$', rateToUSD: 16.85 },
  { code: 'EUR', name: 'Euro', symbol: '€', rateToUSD: 0.92 },
  { code: 'GBP', name: 'British Pound', symbol: '£', rateToUSD: 0.79 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rateToUSD: 156.40 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rateToUSD: 1.51 },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', rateToUSD: 5.16 },
  { code: 'ARS', name: 'Argentine Peso', symbol: '$', rateToUSD: 890.00 },
  { code: 'COP', name: 'Colombian Peso', symbol: '$', rateToUSD: 3850.00 },
  { code: 'MAD', name: 'Moroccan Dirham', symbol: 'DH', rateToUSD: 10.02 },
  { code: 'SAR', name: 'Saudi Riyal', symbol: 'SR', rateToUSD: 3.75 },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', rateToUSD: 1365.00 },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', rateToUSD: 18.40 }
];

const LOCAL_TIPS = [
  {
    country: 'United States',
    currency: 'USD ($)',
    tips: [
      { category: 'Cards vs Cash', description: 'Visa, Mastercard, & mobile wallets (Apple Pay, Google Pay) are accepted virtually everywhere. Carrying excessive cash is rarely necessary.' },
      { category: 'Tipping Custom', description: 'Standard restaurant tipping is 15% to 20% of the pre-tax bill. Tips are also expected for cab drivers, bartenders, and hotel staff.' },
      { category: 'Sales Tax', description: 'Posted prices do NOT include sales tax. Expect an extra 5% to 10% added at the register depending on the city and state.' }
    ]
  },
  {
    country: 'Canada',
    currency: 'CAD (C$)',
    tips: [
      { category: 'Tap-to-Pay', description: 'Contactless "Tap" payment (up to $250) is standard. Interac Debit is preferred locally, but major international credit cards are universally accepted.' },
      { category: 'Calculated Gratuities', description: 'Restaurant tipping is custom at 15% to 18%. Payment terminals will prompt you with percentage options automatically at checkout.' },
      { category: 'Rounding Rules', description: 'Canada has eliminated the 1-cent coin (penny). Cash transactions are rounded to the nearest 5 cents, while digital card payments are exact.' }
    ]
  },
  {
    country: 'Mexico',
    currency: 'MXN (Mex$)',
    tips: [
      { category: 'Cash is King', description: 'While major stadiums and high-end restaurants accept cards, carrying cash (Mexican Pesos) is essential for taco stands, local transport, street markets, and tips.' },
      { category: 'La Propina (Tipping)', description: 'Tipping in sit-down restaurants is standard at 10% to 15%. For gas station helpers, grocery baggers, and car park attendants, a small cash tip (5-20 pesos) is highly appreciated.' },
      { category: 'USD Acceptance', description: 'Be careful paying with USD directly. While accepted in tourist centers, merchants often offer unfavorable exchange rates. Paying in local Pesos is always more economical.' }
    ]
  }
];

export default function CurrencyConverter() {
  const [amount, setAmount] = useState<number>(100);
  const [amountInputStr, setAmountInputStr] = useState<string>('100');
  const [sourceCode, setSourceCode] = useState<string>('EUR');
  const [customTargetCode, setCustomTargetCode] = useState<string>('USD');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const sourceCurrency = useMemo(() => {
    return SUPPORTED_CURRENCIES.find(c => c.code === sourceCode) || SUPPORTED_CURRENCIES[3]; // Default to EUR
  }, [sourceCode]);

  const customTargetCurrency = useMemo(() => {
    return SUPPORTED_CURRENCIES.find(c => c.code === customTargetCode) || SUPPORTED_CURRENCIES[0]; // Default to USD
  }, [customTargetCode]);

  const filteredSourceCurrencies = useMemo(() => {
    if (!searchQuery.trim()) return SUPPORTED_CURRENCIES;
    const q = searchQuery.toLowerCase();
    return SUPPORTED_CURRENCIES.filter(c => 
      c.code.toLowerCase().includes(q) || 
      c.name.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleAmountChange = (val: string) => {
    setAmountInputStr(val);
    const parsed = parseFloat(val);
    if (!isNaN(parsed) && parsed >= 0) {
      setAmount(parsed);
    } else {
      setAmount(0);
    }
  };

  // Convert amount from source currency to another currency
  const convert = (value: number, from: Currency, to: Currency): number => {
    if (from.code === to.code) return value;
    // Value in USD = (Value in Original) / (Original Rate to 1 USD)
    const valueInUSD = value / from.rateToUSD;
    // Value in Destination = USD Value * Destination Rate to 1 USD
    return valueInUSD * to.rateToUSD;
  };

  const usdValue = convert(amount, sourceCurrency, SUPPORTED_CURRENCIES[0]); // USD
  const cadValue = convert(amount, sourceCurrency, SUPPORTED_CURRENCIES[1]); // CAD
  const mxnValue = convert(amount, sourceCurrency, SUPPORTED_CURRENCIES[2]); // MXN

  // Quick lookup cards metadata
  const hostOutputs = [
    { code: 'USD', name: 'United States', symbol: '$', value: usdValue, mainColor: 'indigo' },
    { code: 'CAD', name: 'Canada', symbol: 'CA$', value: cadValue, mainColor: 'red' },
    { code: 'MXN', name: 'Mexico', symbol: 'Mex$', value: mxnValue, mainColor: 'emerald' }
  ];

  // Quick travel cheatsheet increments (e.g., 20, 50, 100, 250 units in host country currency)
  const cheatsheetValues = [10, 20, 50, 100, 250];

  const handleSwap = () => {
    const prevSource = sourceCode;
    const isPrevSourceHost = ['USD', 'CAD', 'MXN'].includes(prevSource);
    
    setSourceCode(customTargetCode);
    if (isPrevSourceHost) {
      setCustomTargetCode(prevSource);
    } else {
      setCustomTargetCode('USD');
    }
  };

  return (
    <div id="currency-converter-section" className="max-w-6xl mx-auto space-y-12">
      {/* Header */}
      <header className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-0.5 w-12 bg-indigo-500" />
          <span className="text-[10px] uppercase font-black tracking-[0.3em] text-indigo-400">Travel Coordinator</span>
        </div>
        <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85] italic text-white">
          FAN EXCHANGE <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-600">HUB</span>
        </h1>
        <p className="text-slate-400 text-base md:text-lg max-w-2xl font-medium">
          Plan your budget across all three host nations. Instant offline-friendly financial conversions, travel payment guidelines, and budget sheets.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main interactive converter card (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-6 md:p-10 relative overflow-hidden shadow-2xl shadow-indigo-500/5">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[80px] -mr-32 -mt-32 rounded-full pointer-events-none" />
            
            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-indigo-400" />
                  <span className="text-[11px] font-black uppercase text-indigo-400 tracking-[0.2em] font-mono">Live Estimates Builder</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-full border border-slate-900">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest font-bold">Standard Rates Enabled</span>
                </div>
              </div>

              {/* Input & Source Select Group */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-4 focus-within:border-indigo-500 transition-colors">
                  <label htmlFor="amount-input" className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Amount to Convert</label>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-indigo-400">{sourceCurrency.symbol}</span>
                    <input
                      id="amount-input"
                      type="text"
                      inputMode="decimal"
                      value={amountInputStr}
                      placeholder="0.00"
                      onChange={(e) => handleAmountChange(e.target.value)}
                      className="w-full bg-transparent border-none text-2xl font-black text-white focus:outline-none focus:ring-0 p-0"
                    />
                  </div>
                </div>

                {/* SEARCHABLE "Your Currency" Dropdown Selector */}
                <div className="md:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-4 relative">
                  <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Your Currency</label>
                  
                  {/* Trigger Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSearchOpen(!isSearchOpen);
                      setSearchQuery('');
                    }}
                    className="w-full h-8 flex items-center justify-between text-left focus:outline-none"
                    aria-expanded={isSearchOpen}
                    aria-haspopup="listbox"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-white tracking-wide">
                        {sourceCurrency.code}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium truncate max-w-[120px]">
                        {sourceCurrency.name}
                      </span>
                    </div>
                    <ChevronDown className={cn("w-4 h-4 text-slate-500 transition-transform duration-200", isSearchOpen && "transform rotate-180")} />
                  </button>

                  {/* Dropdown Options Overlay */}
                  {isSearchOpen && (
                    <>
                      {/* Overlay background blocker */}
                      <div className="fixed inset-0 z-40" onClick={() => setIsSearchOpen(false)} />
                      
                      <div className="absolute left-0 right-0 mt-3 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl z-50 p-3 space-y-3 max-h-72 flex flex-col">
                        <div className="relative flex items-center bg-slate-900 rounded-xl px-2.5 py-2 border border-slate-805 focus-within:border-indigo-500 transition-colors">
                          <Search className="w-3.5 h-3.5 text-slate-500 mr-2 shrink-0" />
                          <input
                            type="text"
                            placeholder="Search code / name..."
                            value={searchQuery}
                            aria-label="Search your currency"
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-transparent border-none text-xs text-white placeholder-slate-550 focus:outline-none p-0 focus:ring-0"
                            autoFocus
                          />
                          {searchQuery && (
                            <button
                              type="button"
                              onClick={() => setSearchQuery('')}
                              className="text-slate-500 hover:text-white"
                              aria-label="Clear search query"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        <div className="overflow-y-auto space-y-1 flex-1 pr-1 scrollbar-thin scrollbar-thumb-slate-800 select-none">
                          {filteredSourceCurrencies.length > 0 ? (
                            filteredSourceCurrencies.map((cur) => (
                              <button
                                key={cur.code}
                                type="button"
                                onClick={() => {
                                  setSourceCode(cur.code);
                                  setIsSearchOpen(false);
                                }}
                                className={cn(
                                  "w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors",
                                  cur.code === sourceCode 
                                    ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/20" 
                                    : "hover:bg-slate-900 text-slate-300 hover:text-white"
                                )}
                              >
                                <span className="font-bold">{cur.code} <span className="font-medium text-slate-450 text-[11px]">({cur.name})</span></span>
                                <span className="font-mono text-slate-500 text-[10px]">{cur.symbol}</span>
                              </button>
                            ))
                          ) : (
                            <div className="text-center py-4 text-xs text-slate-500 font-medium">
                              No currencies found
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Divider Swap Button */}
              <div className="flex justify-center -my-3">
                <button
                  onClick={handleSwap}
                  className="w-10 h-10 bg-slate-800 hover:bg-indigo-600 rounded-xl border border-slate-700 hover:border-indigo-500 flex items-center justify-center text-slate-400 hover:text-white transition-all transform hover:rotate-180 duration-300 active:scale-90"
                  title="Swap Converter Direction"
                  aria-label="Swap Converter Currencies"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                </button>
              </div>

              {/* Custom Target Choice Option (Standalone calculator block) */}
              <div className="bg-slate-950/80 border border-slate-900 rounded-3xl p-5 md:p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Custom Exchange Target</span>
                  <div className="flex items-center gap-2 bg-slate-900/40 px-3 py-1 rounded-xl border border-slate-800">
                    <select
                      id="target-cur-select"
                      value={customTargetCode}
                      aria-label="Target Currency Select"
                      onChange={(e) => setCustomTargetCode(e.target.value)}
                      className="bg-transparent border-none text-xs font-bold text-indigo-400 focus:outline-none focus:ring-0 p-0 cursor-pointer"
                    >
                      {SUPPORTED_CURRENCIES.filter(c => ['USD', 'CAD', 'MXN'].includes(c.code)).map((cur) => (
                        <option key={`target-${cur.code}`} value={cur.code} className="bg-slate-950 text-white font-sans text-xs">
                          {cur.code} - {cur.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-3xl font-black text-white italic">
                      {convert(amount, sourceCurrency, customTargetCurrency).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      <span className="text-slate-500 font-sans text-lg font-bold ml-1.5">{customTargetCurrency.symbol} {customTargetCurrency.code}</span>
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono">
                      1 {sourceCurrency.code} = {(convert(1, sourceCurrency, customTargetCurrency)).toFixed(4)} {customTargetCurrency.code}
                    </p>
                  </div>
                  <div className="text-[9px] font-mono text-slate-500 bg-slate-900 px-3 py-1.5 rounded-lg w-fit md:self-center">
                    Inverse: 1 {customTargetCode} = {(convert(1, customTargetCurrency, sourceCurrency)).toFixed(4)} {sourceCode}
                  </div>
                </div>
              </div>

              {/* Host Quick Output Cards - Simultaneous conversion for three host nations! */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-indigo-400" />
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Simultaneous Host Country Overview</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {hostOutputs.map((item) => (
                    <div 
                      key={item.code} 
                      className={`bg-slate-950 border border-slate-900 hover:border-indigo-500/30 rounded-2xl p-5 space-y-3 transition-all relative overflow-hidden`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">{item.name}</span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-2xl font-black text-white">
                          {item.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        <p className="text-[11px] font-mono text-indigo-400/80 font-semibold">{item.symbol} {item.code}</p>
                      </div>
                      
                      {/* Sub-bar indicator */}
                      <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-indigo-500`}
                          style={{ width: `${Math.min(100, Math.max(5, (item.value / (amount || 1)) * 50))}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Quick reference guide / Travel Budget hacks for match days */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-6 md:p-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center">
                <Wallet className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-base font-black uppercase tracking-wider text-white">Travel Budget Guide Cheatsheet</h3>
                <p className="text-xs text-slate-400 mt-0.5">Quickly translate local purchase power back to your home currency</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {hostOutputs.map((host) => {
                const targetCurObj = SUPPORTED_CURRENCIES.find(c => c.code === host.code)!;
                return (
                  <div key={`guide-${host.code}`} className="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-900/80">
                    <div className="flex items-center gap-1.5 border-b border-slate-900 pb-2">
                      <span className="text-[11px] font-black uppercase text-white tracking-widest">{host.code} Guide</span>
                    </div>
                    <div className="space-y-2 font-mono text-xs">
                      {cheatsheetValues.map(val => {
                        const unconverted = convert(val, targetCurObj, sourceCurrency);
                        return (
                          <div key={val} className="flex justify-between items-center text-slate-400 hover:text-white transition-colors py-0.5">
                            <span className="font-bold text-slate-500">{host.symbol}{val}</span>
                            <span className="text-indigo-400 font-bold">{sourceCurrency.symbol}{unconverted.toFixed(2)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right columns - Payment custom guides + visual helpers (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick info alerts */}
          <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5 text-indigo-400 shrink-0" />
              <span className="text-xs font-black uppercase tracking-widest text-slate-300 font-mono">Important Fan Notices</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              These rates are calculated based on standard seasonal predictions for the summer portion of 2026. Exchange bureaus inside dynamic World Cup fan zones or crowded central airports will frequently add markups or service commissions ranging between 5% and 12%.
            </p>
            <div className="p-3.5 bg-indigo-500/5 rounded-xl border border-indigo-500/10 text-xs text-indigo-300 flex gap-2 font-mono">
              <CreditCard className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-black uppercase block tracking-wider mb-0.5">Travel Hack</span>
                <span>To minimize transaction overhead, consider getting a zero-foreign-transaction-fee travel card before taking off.</span>
              </div>
            </div>
          </div>

          {/* Payment habits tips per host nation (USA, CAN, MEX) */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-[2.5rem] p-6 md:p-8 space-y-6">
            <h3 className="text-lg font-black uppercase italic tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
              Host Payment Customs
            </h3>
            
            <div className="space-y-6">
              {LOCAL_TIPS.map((countryObj) => (
                <div key={countryObj.country} className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-900">
                  <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-black uppercase text-white tracking-widest">{countryObj.country}</h4>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest px-2 py-0.5 bg-slate-900 rounded-md">
                      {countryObj.currency}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {countryObj.tips.map((tip) => (
                      <div key={tip.category} className="space-y-1">
                        <span className="text-[9px] font-black uppercase text-indigo-400 tracking-wider block font-mono">
                          {tip.category}
                        </span>
                        <p className="text-xs text-slate-405 leading-relaxed font-medium">
                          {tip.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
