import { useState, useEffect } from 'react';
import { Stadium } from '../data/stadiums';
import { Map, AdvancedMarker, Pin, useApiLoadingStatus } from '@vis.gl/react-google-maps';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Store, Utensils, Hotel, Compass, Info, Newspaper, Calendar, Trophy, Car, X, Train, ShieldAlert, Timer, Ban, MapPin, ExternalLink, AlertTriangle } from 'lucide-react';
import NearbyPlaces from './NearbyPlaces';
import { getStadiumNews } from '../services/geminiService';
import MatchCountdown from './MatchCountdown';
import ErrorBoundary from './ErrorBoundary';

interface StadiumDetailsProps {
  stadium: Stadium;
  resolvedMatches: any[];
  scores: Record<string, { homeScore: number; awayScore: number }>;
  onBack: () => void;
}

export default function StadiumDetails({ 
  stadium, 
  resolvedMatches, 
  scores, 
  onBack 
}: StadiumDetailsProps) {
  const apiLoadingStatus = useApiLoadingStatus();
  const isAdvancedMarkerAvailable = typeof window !== 'undefined' && 
    !!(window as any).google?.maps?.marker?.AdvancedMarkerElement;
  const isMapError = apiLoadingStatus as string === 'failed' || 
    (apiLoadingStatus as string === 'loaded' && !isAdvancedMarkerAvailable);

  const [news, setNews] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<'restaurant' | 'hotel' | 'attraction' | 'store' | 'parking' | 'emergency'>('restaurant');
  const [isAccessGuideOpen, setIsAccessGuideOpen] = useState(false);
  const stadiumMatches = resolvedMatches.filter((m: any) => m.stadiumId === stadium.id);

  useEffect(() => {
    getStadiumNews(stadium.name).then(setNews);
    window.scrollTo(0, 0);
  }, [stadium.name]);

  const getTransitGuide = (id: string): string => {
    const guides: Record<string, string> = {
      'atlanta': 'MARTA Rail – Dome/GWCC/Philips Arena/CNN Center Station or Vine City Station.',
      'boston': 'MBTA Commuter Rail – Patriots Train service directly from Boston South Station and Providence.',
      'dallas': 'Arlington On-Demand Rideshare or shuttle operations from downtown Fort Worth / Dallas.',
      'guadalajara': 'Mi Macro Periférico – Connect to Troncal lines or dedicated bus loops on matchday.',
      'houston': 'METRORail Red Line – Direct access from NRG Park Station.',
      'kansas-city': 'RideKC Bus Routes or dedicated World Cup shuttles from downtown hub.',
      'los-angeles': 'Metro C Line (Hawthorne/Lennox Station) with direct SoFi Stadium Express Shuttles.',
      'mexico-city': 'Xochimilco Light Rail (Tren Ligero) from Tasqueña Metro Station.',
      'miami': 'Brightline Aventura Station with complimentary shuttle link, or Miami-Dade Transit bus routes.',
      'monterrey': 'Metrorrey Line 1 – Exposición Station, followed by an elegant secure fan walk.',
      'new-york': 'NJ Transit Rail – Meadowlands Rail Station via Secaucus Junction.',
      'philadelphia': 'SEPTA Broad Street Subway Line – NRG Station (South Philadelphia).',
      'san-francisco': 'VTA Light Rail – Great America Station, or Caltrain transfer at Mountain View.',
      'seattle': 'Sounder Commuter Rail / Link Light Rail – International District/Chinatown Station or Stadium Station.',
      'toronto': 'GO Transit Lakeshore West Rail Line – Exhibition GO Station, or TTC 509/511 Streetcars.',
      'vancouver': 'TransLink SkyTrain – Stadium–Chinatown Station (Expo Line).'
    };
    return guides[id] || 'Dedicated Tournament Shuttle loops and designated regional transit hubs.';
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Back to Map</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Info Card */}
        <div className="lg:col-span-2 row-span-2 bg-slate-900 border border-slate-800 rounded-[3rem] p-10 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-[100px] -mr-32 -mt-32 rounded-full transition-all group-hover:bg-indigo-600/10" />
          
          <div className="space-y-6 relative z-10">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-indigo-600/10 border border-indigo-500/20 rounded-full">
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">
                {stadium.city}, {stadium.country}
              </span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] italic text-white">{stadium.name}</h1>
            <p className="text-slate-400 text-lg leading-relaxed font-medium max-w-xl">{stadium.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-8 pt-10 border-t border-slate-800 mt-10 relative z-10">
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Fan Capacity</p>
              <p className="text-4xl font-black font-mono text-white italic">{stadium.capacity}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Opened / Built</p>
              <p className="text-4xl font-black font-mono text-indigo-400 italic">{stadium.opened}</p>
            </div>
          </div>

          <div className="space-y-4 pt-6 mt-6 border-t border-slate-800/60 relative z-10">
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Home Tenants</p>
              <p className="text-sm font-bold text-white leading-snug">{stadium.tenants}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Sports Played</p>
              <p className="text-sm font-bold text-slate-300 leading-snug">{stadium.sports}</p>
            </div>
          </div>

          {stadium.funFacts && stadium.funFacts.length > 0 && (
            <div className="pt-6 mt-6 border-t border-slate-800/60 relative z-10 space-y-3">
              <p className="text-[10px] text-indigo-400 uppercase font-black tracking-widest">Venue Fun Facts</p>
              <ul className="space-y-2.5">
                {stadium.funFacts.map((fact, i) => (
                  <li key={i} className="text-xs text-slate-400 leading-normal font-medium flex gap-2.5">
                    <span className="text-indigo-500 select-none shrink-0">✦</span>
                    <span className="flex-1">{fact}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Top Right: Map Card */}
        <div className="lg:col-span-2 row-span-1 h-[450px] lg:h-auto rounded-[3rem] overflow-hidden border border-slate-800 relative shadow-2xl">
          <ErrorBoundary 
            fallback={
              <div className="w-full h-full min-h-[400px] bg-slate-900 border border-slate-800 rounded-[3rem] p-10 flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border border-indigo-500/10 pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-indigo-500/5 pointer-events-none" />
                
                <div className="space-y-6 relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
                    <AlertTriangle className="w-3.5 h-3.5 animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-widest font-mono">
                      Security Exception Blocked
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl font-black uppercase tracking-tight text-white italic">
                      Domain Referrer Restriction
                    </h3>
                    <p className="text-slate-400 text-xs leading-relaxed font-semibold max-w-md">
                      The Google Maps API key has restrictions that block loading the interactive map here.
                    </p>
                  </div>

                  <div className="bg-slate-950/80 border border-slate-900/60 p-5 rounded-2xl max-w-md text-[10px] text-slate-400 space-y-2 leading-relaxed">
                    <p className="font-extrabold text-white uppercase tracking-wider text-[8px] text-indigo-400">Fix Key Restriction in Google Cloud Console:</p>
                    <ol className="list-decimal list-inside space-y-1.5 text-slate-300 font-medium">
                      <li>Open the Google Maps API Keys Settings.</li>
                      <li>In key restrictions, add this domain as allowed: <br />
                        <code className="text-indigo-400 font-mono select-all bg-indigo-500/10 px-1.5 py-0.5 rounded leading-none block my-1 font-semibold break-all">{window.location.origin}/*</code>
                      </li>
                      <li>Or configure a key with no active origin limits.</li>
                    </ol>
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-slate-800/80 relative z-10 mt-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <span className="text-[8px] text-indigo-400 uppercase font-black tracking-widest font-mono">Coordinates For Gps</span>
                      <p className="text-xs text-slate-300 font-bold uppercase">{stadium.name}</p>
                      <p className="text-[9px] text-slate-500 font-mono">Lat: {stadium.lat} | Lng: {stadium.lng}</p>
                    </div>
                    
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${stadium.name} ${stadium.city}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] shadow-lg shadow-indigo-600/15 transition-all duration-300 active:scale-95 cursor-pointer shrink-0"
                    >
                      <span>Open on Google Maps</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            }
            name="StadiumMap"
          >
            {isMapError ? (
              <div className="w-full h-full min-h-[400px] bg-slate-900 border border-slate-800 rounded-[3rem] p-10 flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border border-indigo-500/10 pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-indigo-500/5 pointer-events-none" />
                
                <div className="space-y-6 relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
                    <AlertTriangle className="w-3.5 h-3.5 animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-widest font-mono">
                      Google Maps Loading Blocked
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl font-black uppercase tracking-tight text-white italic">
                      Domain Referrer Restriction
                    </h3>
                    <p className="text-slate-400 text-xs leading-relaxed font-semibold max-w-md">
                      The current Google Maps API Key blocks requests from this domain name ({window.location.host}).
                    </p>
                  </div>

                  <div className="bg-slate-950/80 border border-slate-900/60 p-5 rounded-2xl max-w-md text-[10px] text-slate-400 space-y-2 leading-relaxed">
                    <p className="font-extrabold text-white uppercase tracking-wider text-[8px] text-indigo-400">Configure key limits in Google Console:</p>
                    <ol className="list-decimal list-inside space-y-1.5 text-slate-300 font-medium">
                      <li>Navigate to APIs &amp; Services &gt; Credentials page.</li>
                      <li>Add this URL origin under HTTP referrers: <br />
                        <code className="text-indigo-400 font-mono select-all bg-indigo-500/10 px-1.5 py-0.5 rounded leading-none block my-1 font-semibold break-all">{window.location.origin}/*</code>
                      </li>
                      <li>Or click below to view the official Google Maps guide directly.</li>
                    </ol>
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-slate-800/80 relative z-10 mt-6 animate-in fade-in duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <span className="text-[8px] text-indigo-400 uppercase font-black tracking-widest font-mono">Venue GPS Placement</span>
                      <p className="text-xs text-slate-300 font-bold uppercase">{stadium.name}</p>
                      <p className="text-[9px] text-slate-500 font-mono">Lat: {stadium.lat} | Lng: {stadium.lng}</p>
                    </div>
                    
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${stadium.name} ${stadium.city}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] shadow-lg shadow-indigo-600/15 transition-all duration-300 active:scale-95 cursor-pointer shrink-0"
                    >
                      <span>Open on Google Maps</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <Map
                 defaultCenter={{ lat: stadium.lat, lng: stadium.lng }}
                 defaultZoom={15}
                 mapId="126216ef8f96b24347eca2b0"
                 internalUsageAttributionIds= {['gmp_mcp_codeassist_v1_aistudio']}
                 className="w-full h-full grayscale-[20%] brightness-[70%] contrast-[120%]"
              >
                 <AdvancedMarker position={{ lat: stadium.lat, lng: stadium.lng }}>
                    <Pin background="#6366f1" glyphColor="#fff" borderColor="#4338ca" />
                 </AdvancedMarker>
              </Map>
            )}
          </ErrorBoundary>
        </div>

        {/* Mid Right: News Bento */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 space-y-6">
          <div className="flex items-center gap-2 text-indigo-400">
            <Newspaper className="w-5 h-5" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Latest Intel</h3>
          </div>
          <ul className="space-y-4">
            {news.map((item, i) => (
              <li key={i} className="text-xs text-slate-400 leading-relaxed font-medium flex gap-3 group">
                <span className="w-1 h-1 rounded-full bg-indigo-500 mt-2 shrink-0 transition-all group-hover:scale-150" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom Right: Fan Info Bento */}
        <div className="lg:col-span-1 bg-indigo-600 rounded-[2.5rem] p-8 flex flex-col justify-between shadow-xl shadow-indigo-500/20 group overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
            <Info className="w-24 h-24" />
          </div>
          <div className="space-y-2 relative z-10">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70 italic">Arrival Protocols</h3>
            <p className="font-black text-2xl leading-none uppercase tracking-tighter text-white italic">Gates open 3h Pre-match. Rail arrival advised.</p>
          </div>
          <button 
            onClick={() => setIsAccessGuideOpen(true)}
            className="w-full py-4 bg-white text-indigo-600 font-extrabold cursor-pointer rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] mt-8 shadow-lg hover:scale-[1.02] active:scale-95 transition-all duration-200"
          >
            View Access Guide
          </button>
        </div>

        {/* World Cup 2026 Match Schedule */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-[3.5rem] p-10 space-y-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-600/5 blur-[120px] -mr-32 -mt-32 rounded-full pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-indigo-400">
                <Trophy className="w-5 h-5 animate-bounce" />
                <span className="text-[10px] font-black uppercase tracking-[0.25em]">FIFA World Cup 2026™ Schedule</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-slate-100 italic">
                Stadium <span className="text-indigo-400">Fixtures</span>
              </h2>
            </div>
            <div className="flex items-center gap-3 bg-slate-950 border border-slate-800/80 px-4 py-2 rounded-2xl">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                {stadiumMatches.length} Matches Confirmed
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {stadiumMatches.map((match) => (
              <div 
                key={match.id} 
                className="bg-slate-950 border border-slate-800/80 hover:border-indigo-500/35 rounded-[2rem] p-6 flex flex-col justify-between gap-5 relative group/match hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-300"
              >
                {/* Accent line */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent group-hover/match:via-indigo-500/60 transition-all duration-300" />
                
                <div className="flex items-center justify-between gap-2 border-b border-slate-900/80 pb-3">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400 font-mono">
                      Match {match.matchNumber}
                    </span>
                    <span className="text-[11px] font-extrabold text-slate-100 opacity-90 uppercase tracking-tight">
                      {match.stage}
                    </span>
                  </div>
                  {match.group && (
                    <span className="text-[8px] font-bold bg-slate-900 text-slate-400 border border-slate-850 px-2.5 py-1 rounded-full uppercase tracking-widest font-mono">
                      {match.group}
                    </span>
                  )}
                </div>

                {/* Teams Display */}
                <div className="flex flex-col gap-4 py-1">
                  {/* Home Team */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm font-black text-slate-100 uppercase tracking-tight truncate">
                        {match.resolvedHomeTeam || match.homeTeam}
                      </span>
                    </div>
                    {scores[match.id] && (
                      <span className="font-mono text-sm font-black text-indigo-400 bg-slate-900 border border-slate-800 px-2.5 py-0.5 rounded-lg">
                        {scores[match.id].homeScore}
                      </span>
                    )}
                  </div>

                  {/* VS Divider styled line */}
                  <div className="flex items-center gap-2">
                    <div className="h-[1px] bg-slate-800 flex-1" />
                    <span className="text-[8px] font-black px-2 py-0.5 bg-slate-900/60 text-slate-500 border border-slate-800/50 rounded uppercase tracking-wider font-mono">
                      {scores[match.id] ? "FT" : "vs"}
                    </span>
                    <div className="h-[1px] bg-slate-800 flex-1" />
                  </div>

                  {/* Away Team */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm font-black text-slate-100 uppercase tracking-tight truncate">
                        {match.resolvedAwayTeam || match.awayTeam}
                      </span>
                    </div>
                    {scores[match.id] && (
                      <span className="font-mono text-sm font-black text-indigo-400 bg-slate-900 border border-slate-800 px-2.5 py-0.5 rounded-lg">
                        {scores[match.id].awayScore}
                      </span>
                    )}
                  </div>
                </div>

                {/* Date / Time Footer */}
                <div className="mt-2 pt-3 border-t border-slate-900/80 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span className="font-semibold text-slate-300">{match.date}</span>
                    </div>
                    <span className="px-2 py-1 bg-slate-900 text-slate-400 border border-slate-850 rounded-lg text-[9px] font-bold font-mono tracking-tight">
                      {match.time}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-950/40 flex justify-between items-center text-[10px]">
                    <span className="text-[9px] font-black uppercase text-slate-500 font-mono tracking-wider">Status</span>
                    {scores[match.id] ? (
                      <span className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded">
                        Concluded
                      </span>
                    ) : (
                      <MatchCountdown dateStr={match.date} timeStr={match.time} />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Full Width Bottom: Discovery Bento */}
        <div className="lg:col-span-4 space-y-8 bg-slate-900/50 border border-slate-800 p-10 rounded-[3.5rem]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1">
              <h2 className="text-3xl font-black uppercase tracking-tighter text-white italic">Discovery <span className="text-indigo-400">Hub</span></h2>
              <p className="text-slate-500 text-sm font-medium">Curation of elite amenities within 1.5 miles of the arena.</p>
            </div>
            
            <div className="flex bg-slate-950 rounded-2xl p-1.5 border border-slate-800 flex-nowrap gap-1 overflow-x-auto max-w-full shrink-0">
              {[
                { id: 'restaurant', icon: Utensils, label: 'Dining' },
                { id: 'hotel', icon: Hotel, label: 'Lodging' },
                { id: 'attraction', icon: Compass, label: 'Culture' },
                { id: 'store', icon: Store, label: 'Official' },
                { id: 'parking', icon: Car, label: 'Parking' },
                { id: 'emergency', icon: ShieldAlert, label: 'Emergency' }
              ].map((cat) => (
                <button 
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id as any)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all duration-300 shrink-0 ${activeCategory === cat.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  <cat.icon className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block md:hidden lg:block">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          <NearbyPlaces 
            stadiumId={stadium.id}
            center={{ lat: stadium.lat, lng: stadium.lng }} 
            category={activeCategory} 
          />
        </div>
      </div>

      {/* Access Guide Modal */}
      <AnimatePresence>
        {isAccessGuideOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAccessGuideOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-slate-900 border border-slate-800 rounded-[2.5rem] w-full max-w-2xl max-h-[85vh] flex flex-col relative overflow-hidden shadow-2xl z-10"
            >
              {/* Corner Accent Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[80px] -mr-32 -mt-32 rounded-full pointer-events-none" />

              {/* Header */}
              <div className="flex items-start justify-between px-6 py-5 md:px-8 md:py-6 pb-4 md:pb-4 border-b border-slate-800/80 relative z-10 bg-slate-900 shrink-0">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-indigo-400">
                    <Info className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Matchday Logistics</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-white italic">
                    Access <span className="text-indigo-400">Guide</span>
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">Official protocols for {stadium.name}</p>
                </div>
                <button
                  onClick={() => setIsAccessGuideOpen(false)}
                  className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800/60 transition-colors rounded-xl text-slate-400 hover:text-white cursor-pointer active:scale-95"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto px-6 md:px-8 py-5 space-y-6 relative z-10">
                {/* Grid content of Protocols */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Public Transit */}
                  <div className="bg-slate-950 border border-slate-850 p-6 rounded-2xl flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-indigo-400">
                      <Train className="w-4 h-4" />
                      <h3 className="text-[10px] font-black uppercase tracking-wider font-mono">Metro &amp; Transit</h3>
                    </div>
                    <p className="text-xs text-slate-300 font-medium leading-relaxed">
                      {getTransitGuide(stadium.id)}
                    </p>
                    <span className="text-[8px] self-start bg-indigo-600/15 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full font-black uppercase tracking-widest font-mono mt-1">
                      highly advised
                    </span>
                  </div>

                  {/* Gates & Opening */}
                  <div className="bg-slate-950 border border-slate-850 p-6 rounded-2xl flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-indigo-400">
                      <Timer className="w-4 h-4" />
                      <h3 className="text-[10px] font-black uppercase tracking-wider font-mono">Gate Timetable</h3>
                    </div>
                    <p className="text-xs text-slate-300 font-medium leading-relaxed">
                      General public gates open exactly <span className="text-white font-bold">3 hours prior</span> to kickoff. VIP and hospitality lounges open 4 hours prior. Re-entry is strictly forbidden.
                    </p>
                  </div>

                  {/* Bag Policy */}
                  <div className="bg-slate-950 border border-slate-850 p-6 rounded-2xl flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-rose-400">
                      <ShieldAlert className="w-4 h-4" />
                      <h3 className="text-[10px] font-black uppercase tracking-wider font-mono">Clear Bag Policy</h3>
                    </div>
                    <p className="text-xs text-slate-300 font-medium leading-relaxed">
                      Only clear plastic, vinyl, or PVC bags not exceeding <span className="text-white font-bold">12" x 6" x 12"</span> are permitted. Clutch purses must be smaller than 4.5" x 6.5".
                    </p>
                  </div>

                  {/* Rideshare Zone */}
                  <div className="bg-slate-950 border border-slate-850 p-6 rounded-2xl flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-indigo-400">
                      <Car className="w-4 h-4" />
                      <h3 className="text-[10px] font-black uppercase tracking-wider font-mono">Rideshare Zone</h3>
                    </div>
                    <p className="text-xs text-slate-300 font-medium leading-relaxed">
                      Ride-hailing drops off strictly at the designated <span className="text-white font-bold">Outer Ring Transit Lot</span>. Please expect safety checkpoints and minor walkups.
                    </p>
                  </div>

                  {/* Prohibited Items Section */}
                  <div className="md:col-span-2 bg-rose-950/20 border border-rose-900/40 p-6 rounded-[2rem] flex flex-col gap-4 relative">
                    <div className="flex items-center gap-2 text-rose-400">
                      <Ban className="w-4 h-4" />
                      <h3 className="text-[10px] font-black uppercase tracking-wider font-mono">Prohibited Items</h3>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      The following items are strictly banned from entering the arena. All spectators are subject to full-body screening and electronic bag scans upon arrival:
                    </p>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                      {[
                        { item: 'Weapons & Lasers', desc: 'Any form of weapon, flare, or laser pointer.' },
                        { item: 'Professional Gear', desc: 'Selfie sticks, drones, or long lens cameras (>3.5").' },
                        { item: 'Large Banners', desc: 'Commercial flags or banners exceeding 2m x 1.5m.' },
                        { item: 'Outside Food/Drinks', desc: 'Glass bottles, cans, thermoses, or coolers.' },
                        { item: 'Noisemakers', desc: 'Air horns, vuvuzelas, or whistles.' },
                        { item: 'Aerosol Cans', desc: 'Spray sunscreen, perfumes, or spray paint cans.' }
                      ].map((pi, idx) => (
                        <div key={idx} className="bg-slate-950/60 border border-slate-900 p-3 rounded-xl flex flex-col gap-1">
                          <span className="text-[10px] font-extrabold text-white flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 animate-pulse" />
                            {pi.item}
                          </span>
                          <span className="text-[9px] text-slate-500 font-medium leading-normal">{pi.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Footer */}
              <div className="px-6 py-4 md:px-8 md:py-5 border-t border-slate-800/80 bg-slate-900 relative z-10 shrink-0">
                <div className="text-center bg-slate-950/60 p-4 border border-slate-850 rounded-xl">
                  <p className="text-[8px] font-black uppercase tracking-[0.25em] text-slate-500 font-mono">
                    ✦ TOURNAMENT SECURITY CONTROL &amp; LOGISTICS ✦
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
