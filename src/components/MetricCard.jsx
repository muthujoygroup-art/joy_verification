import React from 'react';
import { Search, ArrowUpRight, Sparkles } from 'lucide-react';

export const MetricCard = ({ title, value, subtext, icon: Icon, trend, color = 'indigo', onClick, tourStep }) => {
  const colorMap = {
    indigo: {
      border: 'border-indigo-200/90 hover:border-indigo-400',
      iconBg: 'bg-indigo-600 text-white shadow-indigo-500/30',
      glow: 'from-indigo-500/10 via-indigo-50/40 to-white',
      valueColor: 'text-indigo-950',
      badgeBg: 'text-indigo-700 bg-indigo-50 border-indigo-200 group-hover:bg-indigo-600 group-hover:text-white',
      accentDot: 'bg-indigo-500',
      lightIconBg: 'bg-indigo-50 text-indigo-700 border-indigo-200/80'
    },
    cyan: {
      border: 'border-sky-200/90 hover:border-sky-400',
      iconBg: 'bg-sky-600 text-white shadow-sky-500/30',
      glow: 'from-sky-500/10 via-sky-50/40 to-white',
      valueColor: 'text-sky-950',
      badgeBg: 'text-sky-700 bg-sky-50 border-sky-200 group-hover:bg-sky-600 group-hover:text-white',
      accentDot: 'bg-sky-500',
      lightIconBg: 'bg-sky-50 text-sky-700 border-sky-200/80'
    },
    emerald: {
      border: 'border-emerald-200/90 hover:border-emerald-400',
      iconBg: 'bg-emerald-600 text-white shadow-emerald-500/30',
      glow: 'from-emerald-500/10 via-emerald-50/40 to-white',
      valueColor: 'text-emerald-950',
      badgeBg: 'text-emerald-700 bg-emerald-50 border-emerald-200 group-hover:bg-emerald-600 group-hover:text-white',
      accentDot: 'bg-emerald-500',
      lightIconBg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
    },
    amber: {
      border: 'border-amber-200/90 hover:border-amber-400',
      iconBg: 'bg-amber-500 text-white shadow-amber-500/30',
      glow: 'from-amber-500/10 via-amber-50/40 to-white',
      valueColor: 'text-amber-950',
      badgeBg: 'text-amber-700 bg-amber-50 border-amber-200 group-hover:bg-amber-600 group-hover:text-white',
      accentDot: 'bg-amber-500',
      lightIconBg: 'bg-amber-50 text-amber-700 border-amber-200/80'
    },
    purple: {
      border: 'border-purple-200/90 hover:border-purple-400',
      iconBg: 'bg-purple-600 text-white shadow-purple-500/30',
      glow: 'from-purple-500/10 via-purple-50/40 to-white',
      valueColor: 'text-purple-950',
      badgeBg: 'text-purple-700 bg-purple-50 border-purple-200 group-hover:bg-purple-600 group-hover:text-white',
      accentDot: 'bg-purple-500',
      lightIconBg: 'bg-purple-50 text-purple-700 border-purple-200/80'
    }
  };

  const style = colorMap[color] || colorMap.indigo;

  return (
    <div 
      data-tour-step={tourStep}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      title={onClick ? `Click to inspect detailed itemized records for ${title}` : undefined}
      className={`group relative overflow-hidden bg-white border ${style.border} shadow-sm hover:shadow-xl rounded-2xl p-4 sm:p-5 transition-all duration-300 transform hover:-translate-y-1 select-none ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      {/* Background Soft Glow & Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${style.glow} pointer-events-none opacity-70 group-hover:opacity-100 transition-opacity duration-300`} />
      
      {/* Top Header Row: Title & Modern Animated Icon Capsule */}
      <div className="flex items-start justify-between gap-3 relative z-10">
        <div className="flex-1 min-w-0 pr-2">
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className={`w-2 h-2 rounded-full ${style.accentDot} animate-pulse shrink-0`} />
            <p className="text-[11px] font-black uppercase tracking-wider text-slate-500 truncate" title={title}>
              {title}
            </p>
          </div>
          <h3 className={`text-2xl sm:text-3xl font-black ${style.valueColor} tracking-tight leading-none mt-1`}>
            {value}
          </h3>
        </div>
        
        {Icon && (
          <div className={`p-3 rounded-2xl ${style.lightIconBg} border shadow-xs group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shrink-0 flex items-center justify-center`}>
            <Icon className="w-5 h-5 transition-colors duration-300" />
          </div>
        )}
      </div>

      {/* Bottom Footer Row: Subtext & Action / Trend Badge */}
      <div className="mt-3.5 pt-2.5 border-t border-slate-100/90 flex items-center justify-between gap-2 text-xs relative z-10">
        <span className="text-slate-500 font-semibold text-[11px] truncate" title={subtext}>
          {subtext}
        </span>
        
        <div className="flex items-center gap-1.5 shrink-0">
          {trend && (
            <span className="font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[10px] flex items-center gap-0.5 shrink-0">
              <ArrowUpRight className="w-3 h-3 text-emerald-600" />
              {trend}
            </span>
          )}

          {onClick && (
            <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${style.badgeBg} flex items-center gap-1 transition-all duration-200 shadow-2xs shrink-0`}>
              <span>Inspect</span>
              <Search className="w-3 h-3" />
            </span>
          )}
        </div>
      </div>

      {/* Subtle Bottom Accent Indicator */}
      <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${style.accentDot} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
    </div>
  );
};
