import React, { useMemo } from 'react';
import { Waves, AlertTriangle, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { WaterStation } from '../types';
import { fmt } from '../utils/formatters';

interface BasinSummaryProps {
  stations: WaterStation[];
  onSelectBasin: (basinName: string, points: [number, number][]) => void;
}

interface BasinStat {
  name: string;
  total: number;
  lv5: number;
  lv4: number;
  avgPct: number;
  risingCount: number;
  points: [number, number][];
}

export const BasinSummary: React.FC<BasinSummaryProps> = ({ stations, onSelectBasin }) => {
  const basinStats = useMemo(() => {
    const map = new Map<string, { total: number; lv5: number; lv4: number; sumPct: number; validPctCount: number; rising: number; points: [number, number][] }>();

    for (const s of stations) {
      if (!s.basin) continue;
      const b = map.get(s.basin) || { total: 0, lv5: 0, lv4: 0, sumPct: 0, validPctCount: 0, rising: 0, points: [] };
      b.total++;
      if (s.level === 5) b.lv5++;
      if (s.level === 4) b.lv4++;
      if (s.pct !== null) {
        b.sumPct += s.pct;
        b.validPctCount++;
      }
      if (s.delta !== null && s.delta > 0) {
        b.rising++;
      }
      b.points.push([s.lat, s.lng]);
      map.set(s.basin, b);
    }

    return [...map.entries()]
      .map(([name, stat]) => ({
        name,
        total: stat.total,
        lv5: stat.lv5,
        lv4: stat.lv4,
        avgPct: stat.validPctCount > 0 ? stat.sumPct / stat.validPctCount : 0,
        risingCount: stat.rising,
        points: stat.points,
      }))
      .sort((a, b) => b.lv5 * 4 + b.lv4 * 2 + b.avgPct * 0.1 - (a.lv5 * 4 + a.lv4 * 2 + a.avgPct * 0.1));
  }, [stations]);

  return (
    <section className="bg-white dark:bg-[#112225] rounded-xl border border-[#d2dedd] dark:border-[#233a3d] shadow-xs p-4 flex flex-col">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-base font-bold text-[#0e2429] dark:text-[#e2eeee] font-display flex items-center gap-1.5">
          <Waves className="w-4 h-4 text-[#0a6c86] dark:text-[#3fb6d3]" />
          สรุปสถานการณ์น้ำแยกตามลุ่มน้ำหลัก (River Basins)
        </h2>
        <span className="text-xs text-[#53676b] dark:text-[#91a6a9]">
          เรียงตามระดับความเสี่ยง
        </span>
      </div>
      <p className="text-xs text-[#53676b] dark:text-[#91a6a9] mb-3">
        กดที่ชื่อลุ่มน้ำเพื่อซูมดูสถานีทั้งหมดในลุ่มน้ำนั้นบนแผนที่
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 overflow-y-auto max-h-[380px] pr-1">
        {basinStats.map((b) => {
          const isCrit = b.lv5 > 0;
          const isWarn = b.lv4 > 0;

          return (
            <div
              key={b.name}
              onClick={() => onSelectBasin(b.name, b.points)}
              className={`p-3 rounded-xl border transition cursor-pointer flex flex-col justify-between group ${
                isCrit
                  ? 'bg-red-500/5 hover:bg-red-500/10 border-red-200 dark:border-red-950/60'
                  : isWarn
                  ? 'bg-amber-500/5 hover:bg-amber-500/10 border-amber-200 dark:border-amber-950/60'
                  : 'bg-[#f4f8f7] dark:bg-[#162b2e] hover:bg-[#ebf2f1] dark:hover:bg-[#1d3539] border-[#d2dedd] dark:border-[#233a3d]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-[#0e2429] dark:text-[#e2eeee] group-hover:text-[#0a6c86] dark:group-hover:text-[#3fb6d3]">
                    ลุ่มน้ำ{b.name}
                  </span>
                  <span className="text-[10px] text-[#53676b] dark:text-[#91a6a9]">
                    {b.total} สถานี
                  </span>
                </div>

                <div className="w-full bg-[#d2dedd] dark:bg-[#233a3d] h-2 rounded-full overflow-hidden my-1.5">
                  <div
                    className={`h-full rounded-full ${
                      isCrit ? 'bg-red-500' : isWarn ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(b.avgPct, 100)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#53676b] dark:text-[#91a6a9]">ความจุเฉลี่ย:</span>
                  <span className="font-mono-num font-bold text-[#0e2429] dark:text-[#e2eeee]">
                    {fmt(b.avgPct, 0)}%
                  </span>
                </div>
              </div>

              <div className="mt-2.5 pt-2 border-t border-[#d2dedd]/50 dark:border-[#233a3d] flex items-center justify-between text-[10px] text-[#53676b] dark:text-[#91a6a9]">
                <div>
                  {b.lv5 > 0 ? (
                    <span className="text-red-600 font-bold">ล้นตลิ่ง {b.lv5} จุด</span>
                  ) : b.lv4 > 0 ? (
                    <span className="text-amber-600 font-semibold">น้ำมาก {b.lv4} จุด</span>
                  ) : (
                    <span className="text-emerald-600 font-medium">ปกติทุกสถานี</span>
                  )}
                </div>

                <div className="font-mono-num flex items-center gap-0.5">
                  {b.risingCount > 0 && (
                    <span className="text-red-500 flex items-center gap-0.5">
                      <TrendingUp className="w-2.5 h-2.5" /> {b.risingCount} กำลังขึ้น
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
