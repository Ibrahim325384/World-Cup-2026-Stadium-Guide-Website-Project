import { Stadium } from '../data/stadiums';
import { motion } from 'motion/react';
import { MapPin, Users, Calendar } from 'lucide-react';
import { MATCHES } from '../data/matches';

interface StadiumListProps {
  stadiums: Stadium[];
  onSelect: (stadium: Stadium) => void;
}

export default function StadiumList({ stadiums, onSelect }: StadiumListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {stadiums.map((stadium, index) => {
        const stadiumMatches = MATCHES.filter(m => m.stadiumId === stadium.id);
        
        return (
          <motion.div
            key={stadium.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelect(stadium)}
            className="group relative cursor-pointer overflow-hidden rounded-[2.5rem] bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all duration-500 shadow-xl hover:shadow-indigo-500/10"
          >
            {/* Matches Badge */}
            <div className="absolute top-6 right-6 z-10 bg-slate-950/80 border border-slate-800/80 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-indigo-400 font-mono shadow-xl backdrop-blur-md flex items-center gap-1.5 transition-colors group-hover:text-emerald-400 group-hover:border-emerald-500/30">
              <Calendar className="w-3 h-3" />
              {stadiumMatches.length} Matches
            </div>

            <div className="aspect-[4/5] overflow-hidden">
              <img 
                src={stadium.image} 
                alt={stadium.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-50 group-hover:grayscale-0"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src === stadium.image) {
                    target.src = stadium.secondaryImage;
                  } else if (target.src === stadium.secondaryImage) {
                    target.src = 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80';
                  }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-90" />
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-8 space-y-3">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">
                <MapPin className="w-3 h-3" />
                {stadium.city}, {stadium.country}
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight group-hover:text-white transition-colors line-clamp-2 leading-none italic">
                {stadium.name}
              </h3>
              <div className="flex items-center gap-4 pt-3 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 duration-500">
                 <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                   <Users className="w-3.5 h-3.5 text-indigo-500" />
                   {stadium.capacity}
                 </div>
                 <div className="h-px flex-1 bg-slate-800" />
                 <span className="text-[10px] font-black uppercase text-white px-3 py-1 bg-indigo-600 rounded-full shadow-lg shadow-indigo-500/20">Explore Venue</span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
