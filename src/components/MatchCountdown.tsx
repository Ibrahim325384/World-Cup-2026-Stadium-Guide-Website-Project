import { useEffect, useState } from 'react';
import { Clock, Timer } from 'lucide-react';

interface MatchCountdownProps {
  dateStr: string; // e.g. "June 11, 2026"
  timeStr: string; // e.g. "15:00"
  referenceDate?: Date;
}

export default function MatchCountdown({ dateStr, timeStr, referenceDate }: MatchCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    status: 'upcoming' | 'live' | 'finished';
  } | null>(null);

  useEffect(() => {
    // Parse target date and time
    // dateStr e.g. "June 11, 2026", timeStr e.g. "15:00"
    const targetDateTime = new Date(`${dateStr} ${timeStr}`);
    
    const calculateTime = () => {
      const now = referenceDate || new Date();
      const difference = targetDateTime.getTime() - now.getTime();
      
      // A match is typically live for about 2 hours (120 minutes)
      const matchDurationMs = 2 * 60 * 60 * 1000; 

      if (difference <= 0 && difference >= -matchDurationMs) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, status: 'live' });
      } else if (difference < -matchDurationMs) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, status: 'finished' });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        setTimeLeft({ days, hours, minutes, seconds, status: 'upcoming' });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [dateStr, timeStr]);

  if (!timeLeft) return null;

  if (timeLeft.status === 'live') {
    return (
      <div className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest font-mono px-2.5 py-1 rounded-lg animate-pulse">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
        <span>Live Now</span>
      </div>
    );
  }

  if (timeLeft.status === 'finished') {
    return (
      <div className="flex items-center gap-1.5 bg-slate-950 text-slate-500 text-[10px] font-black uppercase tracking-widest font-mono px-2.5 py-1 rounded-lg border border-slate-900">
        <span>Concluded</span>
      </div>
    );
  }

  // Formatting strings
  const pad = (num: number) => String(num).padStart(2, '0');

  // If match is long away (more than 7 days), just display compact format or days count nicely
  if (timeLeft.days > 7) {
    return (
      <div className="flex items-center gap-1.5 bg-slate-950 text-slate-400 text-[10px] font-bold font-mono px-2.5 py-1 rounded-lg border border-slate-900 hover:text-indigo-400 transition-colors">
        <Clock className="w-3 h-3 text-slate-500 shrink-0" />
        <span>{timeLeft.days}d {pad(timeLeft.hours)}h remaining</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 bg-slate-950/80 border border-slate-900/60 p-1.5 rounded-xl text-[10px] font-mono leading-none">
      <Timer className="w-3 h-3 text-indigo-400 shrink-0 mr-1 animate-pulse" />
      
      {timeLeft.days > 0 && (
        <span className="flex items-baseline gap-0.5">
          <span className="font-black text-white text-xs">{timeLeft.days}</span>
          <span className="text-slate-500 font-sans font-medium mr-1.5">d</span>
        </span>
      )}
      
      <span className="flex items-baseline gap-0.5">
        <span className="font-black text-white text-xs">{pad(timeLeft.hours)}</span>
        <span className="text-slate-500 font-sans font-medium mr-1.5">h</span>
      </span>

      <span className="flex items-baseline gap-0.5">
        <span className="font-black text-white text-xs">{pad(timeLeft.minutes)}</span>
        <span className="text-slate-500 font-sans font-medium mr-1.5">m</span>
      </span>

      {timeLeft.days === 0 && (
        <span className="flex items-baseline gap-0.5">
          <span className="font-black text-indigo-400 text-xs">{pad(timeLeft.seconds)}</span>
          <span className="text-slate-500 font-sans font-medium">s</span>
        </span>
      )}
    </div>
  );
}
