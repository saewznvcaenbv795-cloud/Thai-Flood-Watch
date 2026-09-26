import React, { useMemo } from 'react';
import { MapPin, AlertCircle } from 'lucide-react';
import { WaterStation, RainStation } from '../types';

interface WatchlistProvincesProps {
  stations: WaterStation[];
  rain: RainStation[];
  onSelectProvince: (provinceName: string, points: [number, number][]) => void;
}

interface ProvinceAgg {
  name: string;
  lv5: number;
  lv4: number;
  rain90: number;
  points: [number, number][];
}

export const WatchlistProvinces: React.FC<WatchlistProvincesProps> = ({
  stations,
  rain,
  onSelectProvince,
}) => {
  const rankedProvinces = useMemo(() => {
    const map = new Map<string, ProvinceAgg>();
    const getOrCreate = (name: string): ProvinceAgg => {
      if (!map.has(name)) {
        map.set(name, { name, lv5: 0, lv4: 0, rain90: 0, points: [] });
      }
      return map.get(name)!;
    };

    // Aggregate water stations (level 4 & 5)
    for (const s of stations) {
      if (s.level < 4 || !s.province) continue;
      const agg = getOrCreate(s.province);
      if (s.level === 5) agg.lv5++;
      else agg.lv4++;
      agg.points.push([s.lat, s.lng]);
    }

    // Aggregate rain stations (> 90mm)
    for (const r of rain) {
      if (r.mm <= 90 || !r.province) continue;
      const agg = getOrCreate(r.province);
      agg.rain90++;
      agg.points.push([r.lat, r.lng]);
    }

    const score = (a: ProvinceAgg) => a.lv5 * 3 + a.lv4 * 1 + a.rain90 * 2;
    return [...map.values()]
      .sort((a, b) => score(b) - score(a))
      .slice(0, 15);
  }, [stations, rain]);

  const maxTotal = useMemo(() => {
    if (rankedProvinces.length === 0) return 1;
    return Math.max(1, ...rankedProvinces.map((p) => p.lv5 + p.lv4 + p.rain90));
  }, [rankedProvinces]);

  return (
    <section className="bg-white dark:bg-[#112225] rounded-xl border border-[#d2dedd] dark:border-[#233a3d] shadow-xs p-4 flex flex-col h-full">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-base font-bold text-[#0e2429] dark:text-[#e2eeee] font-display flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-[#0a6c86] dark:text-[#3fb6d3]" />
          จังหวัดที่ต้องเฝ้าระวัง
        </h2>
        <span className="text-[11px] text-[#53676b] dark:text-[#91a6a9]">
          เรียงตามความเสี่ยงรวม
        </span>
      </div>
      <p className="text-xs text-[#53676b] dark:text-[#91a6a9] mb-3">
        นับสถานีน้ำล้นตลิ่ง น้ำมาก และฝนหนักมาก (&gt;90 มม.) กดเพื่อดูบนแผนที่
      </p>

      {rankedProvinces.length === 0 ? (
        <div className="py-8 text-center text-xs text-[#53676b] dark:text-[#91a6a9]">
          ยังไม่มีจังหวัดที่มีสถานีน้ำมากหรือฝนหนักมากในขณะนี้
        </div>
      ) : (
        <div className="space-y-1.5 overflow-y-auto pr-1 flex-1 max-h-[380px]">
          {rankedProvinces.map((p, i) => {
            const wLv5 = (p.lv5 / maxTotal) * 100;
            const wLv4 = (p.lv4 / maxTotal) * 100;
            const wRain = (p.rain90 / maxTotal) * 100;

            return (
              <button
                key={p.name}
                type="button"
                onClick={() => onSelectProvince(p.name, p.points)}
                className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-[#f4f8f7] dark:hover:bg-[#162b2e] border border-transparent hover:border-[#d2dedd] dark:hover:border-[#233a3d] transition cursor-pointer text-left group"
                title={`ล้นตลิ่ง ${p.lv5} · น้ำมาก ${p.lv4} · ฝนตกหนักมาก ${p.rain90}`}
              >
                {/* Rank number */}
                <span className="w-5 text-center text-xs font-mono-num font-bold text-[#53676b] dark:text-[#91a6a9] group-hover:text-[#0a6c86] dark:group-hover:text-[#3fb6d3]">
                  {i + 1}
                </span>

                {/* Province Name */}
                <span className="w-28 text-xs font-semibold text-[#0e2429] dark:text-[#e2eeee] truncate">
                  จ.{p.name}
                </span>

                {/* Segmented Bar */}
                <div className="flex-1 h-2 bg-[#e2eded] dark:bg-[#233a3d] rounded-full overflow-hidden flex">
                  {p.lv5 > 0 && (
                    <div
                      className="h-full bg-red-500"
                      style={{ width: `${wLv5}%` }}
                    />
                  )}
                  {p.lv4 > 0 && (
                    <div
                      className="h-full bg-amber-500"
                      style={{ width: `${wLv4}%` }}
                    />
                  )}
                  {p.rain90 > 0 && (
                    <div
                      className="h-full bg-blue-600"
                      style={{ width: `${wRain}%` }}
                    />
                  )}
                </div>

                {/* Breakdown numbers */}
                <span className="text-[11px] font-mono-num text-right shrink-0">
                  <span className="text-red-600 dark:text-red-400 font-bold">{p.lv5}</span>
                  <span className="text-[#53676b] dark:text-[#91a6a9]">/</span>
                  <span className="text-amber-600 dark:text-amber-400 font-semibold">{p.lv4}</span>
                  <span className="text-[#53676b] dark:text-[#91a6a9]">/</span>
                  <span className="text-blue-600 dark:text-blue-400">{p.rain90}</span>
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Footnote legend */}
      <div className="mt-3 pt-2 border-t border-[#e2eded] dark:border-[#233a3d] text-[11px] text-[#53676b] dark:text-[#91a6a9] flex items-center justify-between">
        <span>
          สัดส่วน: <b className="text-red-600 dark:text-red-400">ล้นตลิ่ง</b> /{' '}
          <b className="text-amber-600 dark:text-amber-400">น้ำมาก</b> /{' '}
          <b className="text-blue-600 dark:text-blue-400">ฝน &gt;90มม.</b>
        </span>
      </div>
    </section>
  );
};
