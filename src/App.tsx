/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import { STADIUMS, Stadium } from './data/stadiums';
import StadiumList from './components/StadiumList';
import StadiumDetails from './components/StadiumDetails';
import About from './components/About';
import TournamentDashboard from './components/TournamentDashboard';
import CurrencyConverter from './components/CurrencyConverter';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, MapPin, Newspaper, Tickets, ExternalLink, Coins, Sun, Moon } from 'lucide-react';
import { cn } from './lib/utils';
import { 
  computeStandings, 
  computeResolvedMatches,
  isMatchCompleted,
  getSimulatedScore
} from './utils/tournamentEngine';
import { MATCHES } from './data/matches';
import Logo from './components/Logo';

const GOOGLE_MAPS_API_KEY = 
  (process.env.GOOGLE_MAPS_PLATFORM_KEY as string) ||
  ((import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY as string) ||
  ((import.meta as any).env?.VITE_GOOGLE_MAPS_KEY as string) ||
  '';

export default function App() {
  const [selectedStadium, setSelectedStadium] = useState<Stadium | null>(null);
  const [activeTab, setActiveTab] = useState<'stadiums' | 'standings' | 'about' | 'tickets' | 'exchange'>('stadiums');

  const [isLightMode, setIsLightMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('theme');
      return saved === 'light';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      if (isLightMode) {
        document.documentElement.classList.add('light');
        localStorage.setItem('theme', 'light');
      } else {
        document.documentElement.classList.remove('light');
        localStorage.setItem('theme', 'dark');
      }
    } catch (e) {
      console.warn("Could not write theme configuration", e);
    }
  }, [isLightMode]);

  const [userOverrides, setUserOverrides] = useState<Record<string, { homeScore: number; awayScore: number }>>(() => {
    const initialScores: Record<string, { homeScore: number; awayScore: number }> = {};
    const referenceDate = new Date();
    MATCHES.forEach(match => {
      if (isMatchCompleted(match.date, match.time, referenceDate)) {
        initialScores[match.id] = getSimulatedScore(match.id);
      }
    });
    return initialScores;
  });

  const scores = useMemo(() => {
    return userOverrides;
  }, [userOverrides]);

  const standings = useMemo(() => computeStandings(scores), [scores]);
  
  const resolvedMatches = useMemo(() => computeResolvedMatches(scores, standings), [scores, standings]);

  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY} version="weekly">
      <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500 selection:text-white">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-900 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => { setSelectedStadium(null); setActiveTab('stadiums'); }}>
            <Logo className="w-11 h-11 transition-transform duration-300 group-hover:scale-105" />
            <h1 className="text-xl font-black tracking-tighter uppercase text-white italic">World Cup <span className="text-indigo-400">2026</span></h1>
          </div>
          
          <div className="hidden md:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            <button 
              onClick={() => { setSelectedStadium(null); setActiveTab('stadiums'); }}
              className={cn("hover:text-white transition-all", (activeTab === 'stadiums' && !selectedStadium) && "text-indigo-400 border-b-2 border-indigo-500 pb-1")}
            >
              Stadiums
            </button>
            <button 
              onClick={() => { setSelectedStadium(null); setActiveTab('standings'); }}
              className={cn("hover:text-white transition-all", activeTab === 'standings' && "text-indigo-400 border-b-2 border-indigo-500 pb-1")}
            >
              Schedule
            </button>
            <button 
              onClick={() => { setSelectedStadium(null); setActiveTab('exchange'); }}
              className={cn("hover:text-white transition-all", activeTab === 'exchange' && "text-indigo-400 border-b-2 border-indigo-500 pb-1")}
            >
              Exchange Rates
            </button>
            <button 
              onClick={() => { setSelectedStadium(null); setActiveTab('tickets'); }}
              className={cn("hover:text-white transition-all", activeTab === 'tickets' && "text-indigo-400 border-b-2 border-indigo-500 pb-1")}
            >
              Tickets
            </button>
            <button 
              onClick={() => { setSelectedStadium(null); setActiveTab('about'); }}
              className={cn("hover:text-white transition-all", activeTab === 'about' && "text-indigo-400 border-b-2 border-indigo-500 pb-1")}
            >
              About
            </button>
          </div>

          {/* Quick Select for Mobile */}
          <div className="block md:hidden">
            <select
              value={selectedStadium ? 'stadiums' : activeTab}
              onChange={(e) => {
                const val = e.target.value as any;
                setSelectedStadium(null);
                setActiveTab(val);
              }}
              className="bg-slate-900 border border-slate-800 text-[10px] font-black uppercase tracking-wider text-slate-300 rounded-xl px-3 py-1.5 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="stadiums">Venues</option>
              <option value="standings">Schedule</option>
              <option value="exchange">Exchange Hub</option>
              <option value="tickets">Tickets</option>
              <option value="about">About</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            {/* Elegant Theme Toggle Switch */}
            <button
              onClick={() => setIsLightMode(!isLightMode)}
              className="p-2.5 bg-slate-900 border border-slate-800 rounded-2xl hover:bg-slate-800/60 hover:border-slate-700 hover:text-indigo-400 transition-all text-slate-400 flex items-center justify-center cursor-pointer active:scale-90"
              title={isLightMode ? "Switch to Dark Mode" : "Switch to Light Mode"}
              id="theme-toggle"
            >
              {isLightMode ? (
                <Moon className="w-4 h-4 text-indigo-500 fill-indigo-500/20" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400 fill-amber-400/20" />
              )}
            </button>
          </div>
        </nav>

        <main className="pt-24 pb-12 px-6">
          <AnimatePresence mode="wait">
            {selectedStadium ? (
              <motion.div
                key="details-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <StadiumDetails 
                  stadium={selectedStadium} 
                  resolvedMatches={resolvedMatches}
                  scores={scores}
                  onBack={() => setSelectedStadium(null)} 
                />
              </motion.div>
            ) : activeTab === 'stadiums' ? (
              <motion.div
                key="list"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <div className="max-w-7xl mx-auto space-y-12">
                  <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="h-0.5 w-12 bg-indigo-500" />
                        <span className="text-[10px] uppercase font-black tracking-[0.3em] text-indigo-400">Host Venues</span>
                      </div>
                      <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase leading-[0.85] italic text-white">
                        The World's <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-600">Stage</span>
                      </h1>
                      <p className="text-slate-400 text-lg max-w-2xl font-medium">
                        Architectural masterpieces and local hotspots across North America. Explore the 16 host stadiums of FIFA World Cup 2026.
                      </p>
                    </div>

                    <div className="flex gap-4 shrink-0">
                      <div className="px-5 py-3.5 bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-col justify-center min-w-[200px]">
                        <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest font-mono">Host Countries</span>
                        <span className="text-sm font-black text-white mt-1.5 uppercase tracking-wide">Canada • Mexico • USA</span>
                      </div>
                    </div>
                  </header>
                  <StadiumList stadiums={STADIUMS} onSelect={setSelectedStadium} />
                </div>
              </motion.div>
            ) : activeTab === 'standings' ? (
              <motion.div
                key="standings-tab"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="max-w-7xl mx-auto space-y-8"
              >
                <TournamentDashboard 
                  onSelectStadium={(stadium) => { setSelectedStadium(stadium); setActiveTab('stadiums'); }} 
                  scores={scores}
                />
              </motion.div>
            ) : activeTab === 'about' ? (
              <About key="about" />
            ) : activeTab === 'exchange' ? (
              <motion.div
                key="exchange-tab"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <CurrencyConverter />
              </motion.div>
            ) : (
              <div key="tickets" className="max-w-4xl mx-auto text-center py-12 md:py-20 space-y-12">
                 <div className="w-24 h-24 bg-indigo-600/10 border border-indigo-500/20 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-indigo-500/10">
                   <Tickets className="w-10 h-10 text-indigo-400" />
                 </div>
                 
                 <div className="space-y-4">
                   <span className="flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-[9px] font-black uppercase tracking-[0.2em] text-indigo-400 rounded-full w-fit mx-auto">
                     Official Access Gateway
                   </span>
                   <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic text-white leading-none">
                     FIFA WORLD CUP <span className="text-indigo-400">TICKETS</span>
                   </h2>
                   <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
                     Secure your place in history. All ticket sales, applications, and transfers are exclusively processed through the official FIFA portal.
                   </p>
                 </div>

                 {/* Official Redirect Bento Box */}
                 <div className="bg-slate-900/60 border border-slate-800 rounded-[3rem] p-8 md:p-12 relative overflow-hidden shadow-2xl shadow-indigo-500/5 max-w-3xl mx-auto">
                   <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 blur-[100px] -mr-40 -mt-40 rounded-full pointer-events-none" />
                   
                   <div className="space-y-8 relative z-10">
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-2xl mx-auto pt-2">
                       <div className="bg-slate-950/60 border border-slate-900 p-5 rounded-2xl space-y-1.5">
                         <span className="text-[10px] font-black text-white uppercase tracking-wider block">Official Ticket Sales</span>
                         <span className="text-xs text-slate-400 leading-relaxed block font-medium">FIFA operates the only authorized marketplace for general matches, opening games, and the 2026 Final.</span>
                       </div>
                       <div className="bg-slate-950/60 border border-slate-900 p-5 rounded-2xl space-y-1.5">
                         <span className="text-[10px] font-black text-rose-400 uppercase tracking-wider block">Beware of Resellers</span>
                         <span className="text-xs text-slate-400 leading-relaxed block font-medium">Tickets purchased via unauthorized third-party platforms are invalid and will be deactivated at scanning checkpoints.</span>
                       </div>
                     </div>

                     <div className="pt-4 max-w-md mx-auto">
                       <a
                         href="https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/tickets"
                         target="_blank"
                         rel="noopener noreferrer"
                         className="group flex items-center justify-center gap-3 w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/20 transition-all duration-300 active:scale-95 hover:scale-[1.02] cursor-pointer"
                       >
                         <span>Open Official FIFA Tickets</span>
                         <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                       </a>
                     </div>
                   </div>
                 </div>
              </div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </APIProvider>
  );
}

