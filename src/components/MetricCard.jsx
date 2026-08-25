import React from 'react';

export const MetricCard = ({ title, value, subtext, icon: Icon, trend, color = 'indigo', onClick }) => {
  const colorMap = {
    indigo: {
      border: 'border-indigo-200/80',
      iconBg: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      gradient: 'from-indigo-50/80 via-white to-white',
      valueColor: 'text-indigo-950',
      badgeBg: 'text-indigo-700 bg-indigo-50 border-indigo-200'
    },
    cyan: {
      border: 'border-sky-200/80',
      iconBg: 'bg-sky-100 text-sky-700 border-sky-200',
      gradient: 'from-sky-50/80 via-white to-white',
      valueColor: 'text-sky-950',
      badgeBg: 'text-sky-700 bg-sky-50 border-sky-200'
    },
    emerald: {
      border: 'border-emerald-200/80',
      iconBg: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      gradient: 'from-emerald-50/80 via-white to-white',
      valueColor: 'text-emerald-950',
      badgeBg: 'text-emerald-700 bg-emerald-50 border-emerald-200'
    },
    amber: {
      border: 'border-amber-200/80',
      iconBg: 'bg-amber-100 text-amber-700 border-amber-200',
      gradient: 'from-amber-50/80 via-white to-white',
      valueColor: 'text-amber-950',
      badgeBg: 'text-amber-700 bg-amber-50 border-amber-200'
    },
    purple: {
      border: 'border-purple-200/80',
      iconBg: 'bg-purple-100 text-purple-700 border-purple-200',
      gradient: 'from-purple-50/80 via-white to-white',
      valueColor: 'text-purple-950',
      badgeBg: 'text-purple-700 bg-purple-50 border-purple-200'
    }
  };

  const style = colorMap[color] || colorMap.indigo;

  return (
    <div 
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      title={onClick ? `Click to view detailed itemized breakdown for ${title}` : undefined}
      className={`glass-panel p-5 relative overflow-hidden card-interactive bg-white/95 border ${style.border} shadow-sm rounded-2xl ${
        onClick ? 'cursor-pointer hover:border-indigo-400 hover:shadow-lg transition-all duration-200' : ''
      }`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} pointer-events-none opacity-60`} />
      
      <div className="flex items-start justify-between relative z-10">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">{title}</p>
            {onClick && (
              <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-full border ${style.badgeBg}`}>
                Inspect 🔍
              </span>
            )}
          </div>
          <h3 className={`text-2xl lg:text-3xl font-black ${style.valueColor} tracking-tight`}>{value}</h3>
        </div>
        
        {Icon && (
          <div className={`p-2.5 rounded-xl border ${style.iconBg} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-5 h-5 animate-float-slow" />
          </div>
        )}
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium relative z-10">
        <span className="truncate">{subtext}</span>
        {trend && (
          <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 text-[11px] shrink-0 ml-2">
            {trend}
          </span>
        )}
      </div>
    </div>
  );
};
