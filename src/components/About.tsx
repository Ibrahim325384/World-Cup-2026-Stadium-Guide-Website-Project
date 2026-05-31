import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  MapPin, 
  HelpCircle, 
  Sparkles, 
  Users, 
  ChevronRight, 
  CheckCircle2, 
  Flame, 
  Layers, 
  ShieldAlert, 
  Earth 
} from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

export default function About() {
  const [activeTab, setActiveTab] = useState<'overview' | 'countries' | 'format'>('overview');
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  const FAQS: FAQItem[] = [
    {
      question: "Why has the tournament expanded to 48 teams?",
      answer: "The expansion from 32 to 48 teams allows for wider global representation, giving more nations the chance to participate in the biggest sporting event on Earth. This inclusive structure welcome debutants and increases the matches from 64 to 104, making it the most watched and comprehensive World Cup to date."
    },
    {
      question: "Which country will host the final match?",
      answer: "The prestigious Final will be hosted in the United States at the New York New Jersey Stadium (MetLife Stadium) in East Rutherford on July 19, 2026."
    },
    {
      question: "How does the Round of 32 work?",
      answer: "With 12 groups of 4, the top two teams from each group will automatically qualify. In addition, the 8 best-ranked third-place teams across all groups will secure a spot, completing the 32-team bracket for the brand-new, high-stakes single-elimination knockout phase."
    },
    {
      question: "What is the historical significance of the chosen venues?",
      answer: "Mexico's Estadio Azteca makes history as the first venue to host matches in three separate World Cups (1970, 1986, and 2026). Meanwhile, Canada hosts its first-ever Men's World Cup, and the United States brings back World Cup action for the first time since their record-breaking 1994 tournament."
    }
  ];

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-12">
      {/* Page Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-indigo-400">
            <Trophy className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-[0.2em]">Tournament Profile</span>
          </div>
          <h1 className="text-6xl font-black uppercase tracking-tighter leading-none italic text-white text-white-always">
            About the <span className="text-[#F27D26] block sm:inline">2026 World Cup</span>
          </h1>
          <p className="text-slate-400 max-w-2xl font-medium text-sm md:text-base">
            Discover the unprecedented scale, structure, and cooperative spirit behind the first tri-nation FIFA World Cup in history.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest leading-tight">Total Match Count</p>
            <p className="text-xl font-mono font-black text-white text-white-always">104 Matches</p>
          </div>
          <div className="px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest leading-tight">Expanded Field</p>
            <p className="text-xl font-mono font-black text-indigo-400">48 Teams</p>
          </div>
        </div>
      </header>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-800 p-1 bg-slate-900/40 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'overview' 
              ? 'bg-indigo-600 text-white shadow-md' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Tournament Scale
        </button>
        <button
          onClick={() => setActiveTab('countries')}
          className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'countries' 
              ? 'bg-indigo-600 text-white shadow-md' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Host Countries
        </button>
        <button
          onClick={() => setActiveTab('format')}
          className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'format' 
              ? 'bg-indigo-600 text-white shadow-md' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          New Format
        </button>
      </div>

      <AnimatePresence mode="wait">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-12"
          >
            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Highlight Card 1 */}
              <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-[2rem] flex flex-col justify-between dark:hover:border-slate-700 hover:border-slate-400 transition-all shadow-xl group">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#F27D26]/10 flex items-center justify-center text-[#F27D26] group-hover:scale-110 transition-transform">
                    <Earth className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold uppercase tracking-tight text-white text-white-always">Tri-Nation Host</h3>
                  <p className="text-sm text-slate-400 leading-relaxed font-medium">
                    Co-hosted by Canada, Mexico, and the United States. An incredible continent-wide integration spanning three currencies, three timezones, and various diverse climates.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#F27D26]">First Time Ever</span>
                </div>
              </div>

              {/* Highlight Card 2 */}
              <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-[2rem] flex flex-col justify-between dark:hover:border-slate-700 hover:border-slate-400 transition-all shadow-xl group">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                    <Users className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold uppercase tracking-tight text-white text-white-always">48 Nations</h3>
                  <p className="text-sm text-slate-400 leading-relaxed font-medium">
                    The tournament welcomes an expanded field of 48 teams instead of 32. This provides extra representation for Asia, Africa, South America, North America, Oceania, and Europe.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400">Largest Field in History</span>
                </div>
              </div>

              {/* Highlight Card 3 */}
              <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-[2rem] flex flex-col justify-between dark:hover:border-slate-700 hover:border-slate-400 transition-all shadow-xl group">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                    <Layers className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold uppercase tracking-tight text-white text-white-always">104 Live Fixtures</h3>
                  <p className="text-sm text-slate-400 leading-relaxed font-medium">
                    More tactical battles across 39 action-packed days. The event is custom-engineered to minimize athlete travel distress while delivering maximum high-stakes action.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400">Legacy Schedule</span>
                </div>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="bg-gradient-to-br from-indigo-900/10 to-indigo-950/20 border border-indigo-900/20 rounded-[2.5rem] p-8 md:p-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="space-y-1">
                  <span className="text-slate-500 font-mono text-[10px] uppercase font-bold tracking-wider">Host Cities</span>
                  <p className="text-4xl md:text-5xl font-black italic text-indigo-400">16</p>
                  <p className="text-xs text-slate-300 font-medium">Spectacular host venues</p>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-500 font-mono text-[10px] uppercase font-bold tracking-wider">Tournament Span</span>
                  <p className="text-4xl md:text-5xl font-black italic text-[#F27D26]">39</p>
                  <p className="text-xs text-slate-300 font-medium">Days of elite soccer</p>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-500 font-mono text-[10px] uppercase font-bold tracking-wider">Historic Title Holders</span>
                  <p className="text-4xl md:text-5xl font-black italic text-indigo-400">Argentina</p>
                  <p className="text-xs text-slate-300 font-medium">Defending champions (2022)</p>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-500 font-mono text-[10px] uppercase font-bold tracking-wider">Expected Viewers</span>
                  <p className="text-4xl md:text-5xl font-black italic text-emerald-400">6B+</p>
                  <p className="text-xs text-slate-300 font-medium">Estimated global viewers</p>
                </div>
              </div>
            </div>

            {/* General FAQs Container */}
            <div className="space-y-6">
              <h3 className="text-2xl font-black uppercase tracking-tight text-white text-white-always flex items-center gap-2">
                <HelpCircle className="w-6 h-6 text-[#F27D26]" />
                Frequently Asked Questions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {FAQS.map((faq, i) => (
                  <div 
                    key={i} 
                    className="bg-slate-900/40 border border-slate-855 rounded-2xl p-6 hover:bg-slate-900/60 transition-colors cursor-pointer"
                    onClick={() => toggleFaq(i)}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm font-bold text-white text-white-always uppercase tracking-tight">{faq.question}</p>
                      <ChevronRight className={`w-4 h-4 text-indigo-400 shrink-0 transition-transform ${faqOpen === i ? 'rotate-90' : ''}`} />
                    </div>
                    {faqOpen === i && (
                      <motion.p 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="text-xs text-slate-400 leading-relaxed font-medium mt-4 pt-4 border-t border-slate-800"
                      >
                        {faq.answer}
                      </motion.p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: COUNTRIES */}
        {activeTab === 'countries' && (
          <motion.div
            key="countries"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* CANADA */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-[2.5rem] p-8 flex flex-col justify-between dark:hover:border-slate-700 hover:border-slate-400 transition-all relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 blur-3xl rounded-full" />
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">🇨🇦</span>
                    <span className="px-3 py-1 bg-red-600/10 border border-red-600/20 text-[9px] font-black uppercase tracking-widest text-red-400 rounded-full">Canada</span>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-3xl font-black uppercase tracking-tight italic text-white text-white-always">2 Host Cities</h4>
                    <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">Vancouver • Toronto</p>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                    Canada's West Coast jewel Vancouver (BC Place) and East Coast metropolitan center Toronto (BMO Field) are hosting matches. It will be the first time Canada hosts Men's FIFA World Cup matches.
                  </p>
                  <ul className="space-y-2 text-xs pt-2">
                    <li className="flex items-center gap-2 text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span>13 Total Matches scheduled</span>
                    </li>
                    <li className="flex items-center gap-2 text-slate-300 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span>Toronto hosts opening Canada match</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* MEXICO */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-[2.5rem] p-8 flex flex-col justify-between dark:hover:border-slate-700 hover:border-slate-400 transition-all relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600/5 blur-3xl rounded-full" />
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">🇲🇽</span>
                    <span className="px-3 py-1 bg-emerald-600/10 border border-emerald-600/20 text-[9px] font-black uppercase tracking-widest text-[#2e7d32] dark:text-emerald-400 rounded-full">Mexico</span>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-3xl font-black uppercase tracking-tight italic text-white text-white-always">3 Host Cities</h4>
                    <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">CDMX • Monterrey • GDL</p>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                    Home to a spectacular soccer history. Mexico holds the historic record of being the first country to host the tournament three times: in 1970, 1986, and now 2026.
                  </p>
                  <ul className="space-y-2 text-xs pt-2">
                    <li className="flex items-center gap-2 text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>13 Total Matches scheduled</span>
                    </li>
                    <li className="flex items-center gap-2 text-slate-300 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>Estadio Azteca hosts the Tournament Opening Match</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* UNITED STATES */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-[2.5rem] p-8 flex flex-col justify-between dark:hover:border-slate-700 hover:border-slate-400 transition-all relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 blur-3xl rounded-full" />
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">🇺🇸</span>
                    <span className="px-3 py-1 bg-indigo-600/10 border border-indigo-600/20 text-[9px] font-black uppercase tracking-widest text-indigo-400 rounded-full">United States</span>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-3xl font-black uppercase tracking-tight italic text-white text-white-always">11 Host Cities</h4>
                    <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">coast-to-coast hubs</p>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                    From Seattle's soccer passion to Boston's sporting legacy. The USA dominates the fixture split, hosting 78 matches including everything from the Quarterfinals onwards.
                  </p>
                  <ul className="space-y-2 text-xs pt-2">
                    <li className="flex items-center gap-2 text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>78 Total Matches, including Knockout playoffs</span>
                    </li>
                    <li className="flex items-center gap-2 text-slate-300 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>Grand Final in NY/NJ Stadium (MetLife Stadium)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Stadium Host Cities List Grid */}
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] space-y-6">
              <div className="space-y-2">
                <h4 className="text-xl font-black uppercase tracking-tight text-white text-white-always flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-indigo-400" />
                  List of 16 Host Cities & Corresponding Venues
                </h4>
                <p className="text-xs text-slate-400 font-medium">Three geographic regions: Western, Central, and Eastern to optimize transit routes.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 text-xs font-medium">
                {/* Western Region */}
                <div className="space-y-3 bg-slate-950/40 p-5 border border-slate-850/60 rounded-2xl">
                  <h5 className="font-black text-white uppercase tracking-wider text-[10px] text-indigo-400 font-mono">Western Region</h5>
                  <div className="space-y-2 text-slate-300">
                    <p>📍 Vancouver — BC Place</p>
                    <p>📍 Seattle — Lumen Field</p>
                    <p>📍 San Francisco — Levi's Stadium</p>
                    <p>📍 Los Angeles — SoFi Stadium</p>
                    <p>📍 Guadalajara — Estadio Akron</p>
                  </div>
                </div>

                {/* Central Region */}
                <div className="space-y-3 bg-slate-950/40 p-5 border border-slate-850/60 rounded-2xl">
                  <h5 className="font-black text-white uppercase tracking-wider text-[10px] text-[#F27D26] font-mono">Central Region</h5>
                  <div className="space-y-2 text-slate-300">
                    <p>📍 Kansas City — GEHA Field at Arrowhead</p>
                    <p>📍 Dallas — AT&T Stadium</p>
                    <p>📍 Houston — NRG Stadium</p>
                    <p>📍 Atlanta — Mercedes-Benz-Stadium</p>
                    <p>📍 Monterrey — Estadio BBVA</p>
                    <p>📍 Mexico City — Estadio Azteca</p>
                  </div>
                </div>

                {/* Eastern Region */}
                <div className="space-y-3 bg-slate-950/40 p-5 border border-slate-850/60 rounded-2xl">
                  <h5 className="font-black text-white uppercase tracking-wider text-[10px] text-emerald-400 font-mono">Eastern Region</h5>
                  <div className="space-y-2 text-slate-300">
                    <p>📍 Toronto — BMO Field</p>
                    <p>📍 Boston — Gillette Stadium</p>
                    <p>📍 Philadelphia — Lincoln Financial Field</p>
                    <p>📍 Miami — Hard Rock Stadium</p>
                    <p>📍 New York/New Jersey — MetLife Stadium</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 3: FORMAT */}
        {activeTab === 'format' && (
          <motion.div
            key="format"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Explanatory Banner */}
            <div className="bg-gradient-to-br from-indigo-950/50 to-slate-900 border border-indigo-500/10 p-8 rounded-[2.5rem] grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="px-3 py-1 bg-[#F27D26]/10 border border-[#F27D26]/20 text-[9px] font-black uppercase tracking-[0.2em] text-[#F27D26] rounded-full w-fit block">
                  How It Works
                </span>
                <h3 className="text-4xl font-black uppercase tracking-tighter leading-none italic text-white text-white-always">
                  The Journey to <br /> <span className="text-indigo-400">Glory Expanded</span>
                </h3>
                <p className="text-xs md:text-sm text-slate-400 leading-relaxed font-semibold">
                  To keep the competitive thrill alive, the group matches will occur in groups of four. This preserves the high-tension environment of final group matchdays and eliminates the chance of collusion.
                </p>
              </div>

              {/* Fun visual roadmap */}
              <div className="space-y-3">
                <div className="p-4 bg-slate-950/40 border border-slate-850 rounded-2xl flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-indigo-300">Group Stage</span>
                  <span className="text-xs text-slate-400 font-bold">12 Groups • 4 Teams each</span>
                </div>
                <div className="p-4 bg-slate-950/40 border border-slate-850 rounded-2xl flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-indigo-300">Round of 32 Knockouts</span>
                  <span className="text-xs text-slate-400 font-bold">Top 2 + 8 best 3rd place teams</span>
                </div>
                <div className="p-4 bg-slate-950/40 border border-slate-850 rounded-2xl flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-indigo-300">To the Final</span>
                  <span className="text-xs text-slate-400 font-bold">39 Days total of intense bracket combat</span>
                </div>
              </div>
            </div>

            {/* Contrast Columns of Format Structure */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Group phase insights */}
              <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-[2rem] space-y-4">
                <div className="flex items-center gap-2 text-indigo-400">
                  <Sparkles className="w-5 h-5" />
                  <h4 className="text-lg font-black uppercase tracking-tight text-white text-white-always">Group Stage Drama</h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                  Every team plays exactly three group matches. This format guarantees that every group match is highly consequential. Fans will see unparalleled battles as traditional powerhouses compete to avoid the wildcard 3rd-place comparison.
                </p>
                <div className="pt-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#F27D26]">12 Groups total (A to L)</span>
                </div>
              </div>

              {/* Tournament integrity */}
              <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-[2rem] space-y-4">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Flame className="w-5 h-5" />
                  <h4 className="text-lg font-black uppercase tracking-tight text-white text-white-always">Bigger Rest Cycles</h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                  Despite the increased field size, the scheduling preserves healthy recovery timelines for athletes. Teams are assigned geographical clusters to decrease air travel hours between match days, making game conditions fair and safe.
                </p>
                <div className="pt-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400">Optimized flight paths</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
