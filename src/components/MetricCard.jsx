import React from 'react';

export const MetricCard = ({ title, value, subtext, icon: Icon, trend, color = 'indigo' }) => {
  const colorMap = {
    indigo: {
      border: 'border-indigo-200/80',
      iconBg: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      gradient: 'from-indigo-50/80 via-white to-white',
      valueColor: 'text-indigo-950'
    },
    cyan: {
      border: 'border-sky-200/80',
      iconBg: 'bg-sky-100 text-sky-700 border-sky-200',
      gradient: 'from-sky-50/80 via-white to-white',
      valueColor: 'text-sky-950'
    },
    emerald: {
      border: 'border-emerald-200/80',
      iconBg: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      gradient: 'from-emerald-50/80 via-white to-white',
      valueColor: 'text-emerald-950'
    },
    amber: {
      border: 'border-amber-200/80',
      iconBg: 'bg-amber-100 text-amber-700 border-amber-200',
      gradient: 'from-amber-50/80 via-white to-white',
      valueColor: 'text-amber-950'
    },
    purple: {
      border: 'border-purple-200/80',
      iconBg: 'bg-purple-100 text-purple-700 border-purple-200',
      gradient: 'from-purple-50/80 via-white to-white',
      valueColor: 'text-purple-950'
    }
  };

  const style = colorMap[color] || colorMap.indigo;

  return (
    <div className={`glass-panel p-5 relative overflow-hidden card-interactive bg-white/95 border ${style.border} shadow-sm rounded-2xl`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} pointer-events-none opacity-60`} />
      
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">{title}</p>
          <h3 className={`text-2xl lg:text-3xl font-black ${style.valueColor} tracking-tight`}>{value}</h3>
        </div>
        
        {Icon && (
          <div className={`p-2.5 rounded-xl border ${style.iconBg} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-5 h-5 animate-float-slow" />
          </div>
        )}
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium relative z-10">
        <span>{subtext}</span>
        {trend && (
          <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 text-[11px]">
            {trend}
          </span>
        )}
      </div>
    </div>
  );
};
