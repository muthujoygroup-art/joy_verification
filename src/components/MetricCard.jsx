import React from 'react';

export const MetricCard = ({ title, value, subtext, icon: Icon, trend, color = 'indigo' }) => {
  const colorMap = {
    indigo: {
      border: 'border-indigo-200',
      iconBg: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      gradient: 'from-indigo-50/90 via-white to-white',
      valueColor: 'text-indigo-950'
    },
    cyan: {
      border: 'border-sky-200',
      iconBg: 'bg-sky-100 text-sky-700 border-sky-200',
      gradient: 'from-sky-50/90 via-white to-white',
      valueColor: 'text-sky-950'
    },
    emerald: {
      border: 'border-emerald-200',
      iconBg: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      gradient: 'from-emerald-50/90 via-white to-white',
      valueColor: 'text-emerald-950'
    },
    amber: {
      border: 'border-amber-200',
      iconBg: 'bg-amber-100 text-amber-700 border-amber-200',
      gradient: 'from-amber-50/90 via-white to-white',
      valueColor: 'text-amber-950'
    },
    purple: {
      border: 'border-purple-200',
      iconBg: 'bg-purple-100 text-purple-700 border-purple-200',
      gradient: 'from-purple-50/90 via-white to-white',
      valueColor: 'text-purple-950'
    }
  };

  const style = colorMap[color] || colorMap.indigo;

  return (
    <div className={`p-5 relative overflow-hidden bg-white border ${style.border} shadow-xs hover:shadow-md transition-all rounded-2xl flex flex-col justify-between min-h-[130px]`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} pointer-events-none opacity-70`} />
      
      <div className="flex items-start justify-between gap-3 relative z-10">
        <div className="space-y-1">
          <p className="text-[11px] font-black uppercase tracking-wider text-slate-500">{title}</p>
          <h3 className={`text-2xl sm:text-3xl font-black ${style.valueColor} tracking-tight leading-none`}>{value}</h3>
        </div>
        
        {Icon && (
          <div className={`p-2.5 rounded-xl border ${style.iconBg} shadow-xs shrink-0`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-100/90 flex items-center justify-between text-xs text-slate-500 font-medium relative z-10">
        <span className="truncate">{subtext}</span>
        {trend && (
          <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 text-[10px] shrink-0 ml-2">
            {trend}
          </span>
        )}
      </div>
    </div>
  );
};
