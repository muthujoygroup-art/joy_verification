import React from 'react';

// Monthly Verification Volume Bar Chart Component
export const VerificationVolumeChart = ({ data }) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
  const values = [4200, 5800, 7100, 8900, 10400, 12100, 13800, 14820];
  const maxValue = Math.max(...values);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
        <span>Monthly Platform Verification Volume (2026)</span>
        <span className="text-indigo-700 font-extrabold">+252% Growth</span>
      </div>

      <div className="h-44 flex items-end gap-2 sm:gap-3 pt-6 pb-2 px-2 border-b border-slate-200 bg-slate-50/50 rounded-xl">
        {months.map((m, idx) => {
          const val = values[idx];
          const heightPercent = Math.round((val / maxValue) * 100);
          return (
            <div key={m} className="flex-1 flex flex-col items-center gap-1 group relative">
              
              {/* Tooltip on hover */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-slate-900 text-white text-[10px] py-1 px-1.5 rounded font-mono pointer-events-none z-10 whitespace-nowrap">
                {val.toLocaleString()} Verifications
              </div>

              <div className="w-full bg-slate-200 rounded-t-md h-full flex items-end overflow-hidden">
                <div 
                  style={{ height: `${heightPercent}%` }}
                  className="w-full bg-gradient-to-t from-indigo-600 to-purple-600 rounded-t-md group-hover:from-indigo-500 group-hover:to-purple-500 transition-all"
                />
              </div>
              <span className="text-[10px] font-bold text-slate-600 mt-1">{m}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// HR Executive Performance Bar Chart
export const HrPerformanceChart = ({ hrUsers }) => {
  return (
    <div className="space-y-3">
      <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
        HR Staff Dispatch vs Completion Velocity
      </h4>

      <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
        {hrUsers.map((hr) => {
          const sent = hr.activeLinks + Math.floor(Math.random() * 20) + 15;
          const completed = Math.floor(sent * 0.85);
          const percent = Math.round((completed / sent) * 100);

          return (
            <div key={hr.id} className="space-y-1">
              <div className="flex justify-between font-bold text-slate-900">
                <span>{hr.name} ({hr.dept})</span>
                <span className="text-emerald-700">{completed} / {sent} Completed ({percent}%)</span>
              </div>

              <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden flex">
                <div 
                  style={{ width: `${percent}%` }}
                  className="h-full bg-gradient-to-r from-sky-600 to-teal-600 rounded-full transition-all"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Turnaround Time (TAT) Distribution Donut/Bar Chart
export const TatDistributionChart = () => {
  const tatData = [
    { label: '< 5 Minutes (Instant)', count: '68%', color: 'bg-emerald-500' },
    { label: '5 - 15 Minutes', count: '24%', color: 'bg-sky-500' },
    { label: '15 - 60 Minutes', count: '6%', color: 'bg-amber-500' },
    { label: '> 1 Hour (Pending Response)', count: '2%', color: 'bg-rose-500' }
  ];

  return (
    <div className="space-y-3">
      <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
        Verification Turnaround Time (TAT) Metrics
      </h4>

      <div className="space-y-2.5 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
        {tatData.map((item) => (
          <div key={item.label} className="space-y-1">
            <div className="flex justify-between font-semibold text-slate-800 text-[11px]">
              <span>{item.label}</span>
              <span className="font-extrabold text-slate-900">{item.count}</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div 
                style={{ width: item.count }} 
                className={`h-full ${item.color} rounded-full`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
