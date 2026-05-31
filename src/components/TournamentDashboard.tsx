import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MATCHES } from '../data/matches';
import { STADIUMS, Stadium } from '../data/stadiums';
import MatchCountdown from './MatchCountdown';
import { computeStandings, computeResolvedMatches } from '../utils/tournamentEngine';
import { 
  Calendar, 
  Search, 
  MapPin,
  Clock,
  Filter,
  Info
} from 'lucide-react';

interface TournamentDashboardProps {
  onSelectStadium: (stadium: Stadium) => void;
  // Keep props structurally backward compatible, although no longer utilized for mutation
  scores?: Record<string, { homeScore: number; awayScore: number }>;
  userOverrides?: Record<string, { homeScore: number; awayScore: number }>;
  setUserOverrides?: React.Dispatch<React.SetStateAction<Record<string, { homeScore: number; awayScore: number }>>>;
}

export default function TournamentDashboard({ 
  onSelectStadium 
}: TournamentDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStadiumId, setSelectedStadiumId] = useState<string>('all');
  const [selectedStage, setSelectedStage] = useState<string>('all');

  // Map stadiums for fast detail resolution
  const stadiumMap = useMemo(() => {
    const map: Record<string, Stadium> = {};
    STADIUMS.forEach(s => {
      map[s.id] = s;
    });
    return map;
  }, []);

  // Compute standings with empty scores (for static placeholders to render properly)
  const standings = useMemo(() => {
    return computeStandings({});
  }, []);

  // Dynamically resolve qualified placeholder paths for future knockouts
  const resolvedMatches = useMemo(() => {
    return computeResolvedMatches({}, standings);
  }, [standings]);

  // Filtered upcoming schedule
  const filteredMatches = useMemo(() => {
    return resolvedMatches.filter(match => {
      const stadium = stadiumMap[match.stadiumId];
      const matchVenueName = stadium ? stadium.name : '';
      const matchCity = stadium ? stadium.city : '';
      
      const matchesSearch = searchTerm === '' || 
        match.resolvedHomeTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.resolvedAwayTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.homeTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.awayTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.stage.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (match.group && match.group.toLowerCase().includes(searchTerm.toLowerCase())) ||
        matchVenueName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        matchCity.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStadium = selectedStadiumId === 'all' || match.stadiumId === selectedStadiumId;

      const matchesStage = selectedStage === 'all' || 
        (selectedStage === 'group' && match.group) ||
        (selectedStage === 'knockout' && !match.group) ||
        match.stage === selectedStage;

      return matchesSearch && matchesStadium && matchesStage;
    });
  }, [resolvedMatches, searchTerm, selectedStadiumId, selectedStage, stadiumMap]);

  // Unique match stages list for filters
  const stagesList = useMemo(() => {
    const list = new Set<string>();
    MATCHES.forEach(m => list.add(m.stage));
    return Array.from(list);
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-24">
      {/* Tab Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-0.5 w-12 bg-indigo-500" />
            <span className="text-[10px] uppercase font-black tracking-[0.3em] text-indigo-400">Schedule & Fixtures</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85] italic text-white/95">
            Tournament <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-indigo-400 to-indigo-600">Schedules</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl font-medium">
            Explore the master schedule of elite international fixtures across North America. Search by teams, venues, cities, or tournament rounds.
          </p>
        </div>

        <div className="flex gap-4 shrink-0">
          <div className="px-5 py-3.5 bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-col justify-center min-w-[200px]">
            <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest font-mono">Host Countries</span>
            <span className="text-sm font-black text-white mt-1.5 uppercase tracking-wide">Canada • Mexico • USA</span>
          </div>
        </div>
      </header>

      {/* Filter controls */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-[2.5rem] grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Search */}
        <div className="md:col-span-4 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search teams, venues, or stages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800/80 rounded-2xl pl-11 pr-4 py-3.5 text-xs font-medium text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-600"
          />
        </div>

        {/* Stadium Dropdown */}
        <div className="md:col-span-4">
          <select
            value={selectedStadiumId}
            onChange={(e) => setSelectedStadiumId(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800/80 rounded-2xl px-4 py-3.5 text-xs font-medium text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
          >
            <option value="all">All Stadiums / Venues</option>
            {STADIUMS.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.city}, {s.country})
              </option>
            ))}
          </select>
        </div>

        {/* Stage Dropdown */}
        <div className="md:col-span-4">
          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800/80 rounded-2xl px-4 py-3.5 text-xs font-medium text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
          >
            <option value="all">All Stages</option>
            <option value="group">Group Stage Only</option>
            <option value="knockout">Knockout Phase Only</option>
            {stagesList.map(stg => (
              <option key={stg} value={stg}>{stg}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Matches stats bar */}
      <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-slate-500 font-mono px-4">
        <span>Found {filteredMatches.length} Matches Schedules</span>
        <span className="flex items-center gap-1.5 text-indigo-400">
          <Info className="w-3.5 h-3.5" /> Selection zooms map directly to venue details
        </span>
      </div>

      {/* Empty Matches State */}
      {filteredMatches.length === 0 && (
        <div className="bg-slate-900 border border-slate-850 p-16 rounded-[3rem] text-center space-y-4">
          <p className="text-slate-400 text-base font-semibold">No tournament fixtures match your search criteria.</p>
          <button
            onClick={() => { setSearchTerm(''); setSelectedStage('all'); setSelectedStadiumId('all'); }}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black uppercase tracking-widest rounded-full transition-transform"
          >
            Clear Search Filters
          </button>
        </div>
      )}

      {/* Matches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMatches.map(match => {
          const stadium = stadiumMap[match.stadiumId];

          return (
            <motion.div
              key={match.id}
              layout
              whileHover={{ y: -4 }}
              className="bg-slate-900/95 border border-slate-800 hover:border-slate-700/85 rounded-[2.25rem] p-6 flex flex-col justify-between gap-5 relative group transition-all duration-300"
            >
              {/* Header info */}
              <div className="flex items-center justify-between gap-2 border-b border-slate-950 pb-3">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400 font-mono">
                    Match #{match.matchNumber}
                  </span>
                  <span className="text-[11px] font-extrabold text-white/90 uppercase tracking-tight">
                    {match.stage}
                  </span>
                </div>
                
                {match.group && (
                  <span className="text-[9px] font-bold bg-slate-950 text-slate-400 border border-slate-800 px-3 py-1 rounded-full uppercase tracking-widest font-mono">
                    {match.group}
                  </span>
                )}
              </div>

              {/* Match Schedule block */}
              <div className="flex items-center justify-center gap-12 py-3 bg-slate-950/45 border border-slate-850/60 rounded-2xl px-4 relative">
                {/* Home Team */}
                <div className="flex items-center justify-end flex-1 min-w-0 text-right">
                  <span className="text-xs font-black text-white uppercase tracking-tight truncate" title={match.resolvedHomeTeam}>
                    {match.resolvedHomeTeam}
                  </span>
                </div>

                {/* VS Divider */}
                <div className="flex flex-col items-center shrink-0">
                  <span className="text-[8px] font-black px-2.5 py-1 bg-indigo-600/10 text-indigo-400 border border-indigo-500/15 rounded-full uppercase tracking-wider font-mono">
                    VS
                  </span>
                </div>

                {/* Away Team */}
                <div className="flex items-center justify-start flex-1 min-w-0 text-left">
                  <span className="text-xs font-black text-white uppercase tracking-tight truncate" title={match.resolvedAwayTeam}>
                    {match.resolvedAwayTeam}
                  </span>
                </div>
              </div>

              {/* Venue & Time Footer */}
              <div className="mt-1 pt-3 border-t border-slate-950 flex flex-col gap-2.5">
                <div 
                  onClick={() => stadium && onSelectStadium(stadium)}
                  className="flex items-center justify-between group/venue cursor-pointer text-slate-400 text-[10px] font-extrabold uppercase tracking-widest hover:text-indigo-400 transition-colors"
                >
                  <span className="truncate max-w-[90%] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{stadium ? `${stadium.name}, ${stadium.city}` : 'TBD'}</span>
                  </span>
                  <span className="text-indigo-500 text-[9px] font-bold uppercase shrink-0 opacity-0 group-hover/venue:opacity-100 transition-opacity flex items-center">
                    INFO
                  </span>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-505 text-slate-500 font-bold font-mono">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                    <span>{match.date}</span>
                  </span>
                  <span className="px-2 py-0.5 bg-slate-950 text-slate-400 border border-slate-850 rounded text-[9px] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-650 text-slate-500 shrink-0" />
                    <span>{match.time}</span>
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-950 flex justify-between items-center">
                  <span className="text-[9px] font-black uppercase text-indigo-400/40 font-mono tracking-wider">Countdown</span>
                  <MatchCountdown dateStr={match.date} timeStr={match.time} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
