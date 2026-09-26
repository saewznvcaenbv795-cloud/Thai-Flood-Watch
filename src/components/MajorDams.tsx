import React, { useState } from 'react';
import { Waves, ExternalLink, Filter } from 'lucide-react';
import { DamData } from '../types';
import { fmt } from '../utils/formatters';

interface MajorDamsProps {
  dams: DamData[];
  onSelectDamCoords?: (lat: number, lng: number) => void;
}

export const MajorDams: React.FC<MajorDamsProps> = ({ dams, onSelectDamCoords }) => {
  const [onlyOver80, setOnlyOver80] = useState(false);

  const sortedDams = [...dams]
    .filter((d) => !onlyOver80 || d.pct >= 80)
    .sort((a, b) => b.pct - a.pct);

  return (
    <section className="bg-white dark:bg-[#112225] rounded-xl border border-[#d2dedd] dark:border-[#233a3d] shadow-xs p-4 flex flex-col h-full">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-base font-bold text-[#0e2429] dark:text-[#e2eeee] font-display flex items-center gap-1.5">
          <Waves className="w-4 h-4 text-[#0a6c86] dark:text-[#3fb6d3]" />
          เขื่อนขนาดใหญ่
        </h2>
        <button
          onClick={() => setOnlyOver80(!onlyOver80)}
          className={`text-xs px-2 py-0.5 rounded-md border transition cursor-pointer flex items-center gap-1 ${
            onlyOver80
              ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-500/40 font-semibold'
              : 'border-[#d2dedd] dark:border-[#233a3d] text-[#53676b] dark:text-[#91a6a9] hover:bg-[#f4f8f7] dark:hover:bg-[#162b2e]'
          }`}
        >
          <Filter className="w-3 h-3" />
          <span>&ge; 80% ({dams.filter((d) => d.pct >= 80).length})</span>
        </button>
      </div>

      <p className="text-xs text-[#53676b] dark:text-[#91a6a9] mb-3">
        ปริมาณน้ำกักเก็บเทียบความจุ (% รนก.) เรียงจากมากไปน้อย
      </p>

      {sortedDams.length === 0 ? (
        <div className="py-8 text-center text-xs text-[#53676b] dark:text-[#91a6a9]">
          ไม่มีข้อมูลเขื่อน
        </div>
      ) : (
        <div className="space-y-2 overflow-y-auto pr-1 flex-1 max-h-[380px]">
          {sortedDams.map((d) => {
            const isOver = d.pct >= 100;
            const isHigh = d.pct >= 80;

            return (
              <div
                key={d.id}
                onClick={() => onSelectDamCoords && onSelectDamCoords(d.lat, d.lng)}
                className="p-2 rounded-lg hover:bg-[#f4f8f7] dark:hover:bg-[#162b2e] border border-transparent hover:border-[#d2dedd] dark:hover:border-[#233a3d] transition cursor-pointer group"
                title={`เขื่อน${d.name} จ.${d.province} - ปริมาณ ${fmt(d.storage, 0)} ล้าน ลบ.ม. (น้ำเข้า ${fmt(d.inflow, 2)}, ระบาย ${fmt(d.released, 2)})`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-[#0e2429] dark:text-[#e2eeee] group-hover:text-[#0a6c86] dark:group-hover:text-[#3fb6d3] truncate max-w-[170px]">
                    เขื่อน{d.name}
                    {d.province && (
                      <span className="text-[11px] font-normal text-[#53676b] dark:text-[#91a6a9] ml-1">
                        จ.{d.province}
                      </span>
                    )}
                  </span>
                  <span
                    className={`font-mono-num font-bold text-xs ${
                      isOver
                        ? 'text-red-600 dark:text-red-400'
                        : isHigh
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-[#0a6c86] dark:text-[#3fb6d3]'
                    }`}
                  >
                    {fmt(d.pct, 0)}%
                  </span>
                </div>

                {/* Gauge bar */}
                <div className="w-full bg-[#e2eded] dark:bg-[#233a3d] h-2 rounded-full overflow-hidden mb-1">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isOver ? 'bg-red-500' : isHigh ? 'bg-amber-500' : 'bg-[#0a6c86] dark:bg-[#3fb6d3]'
                    }`}
                    style={{ width: `${Math.min(d.pct, 100)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] text-[#53676b] dark:text-[#91a6a9] font-mono-num">
                  <span>กักเก็บ {fmt(d.storage, 0)} ล้าน ลบ.ม.</span>
                  <span>ระบาย {fmt(d.released, 1)} ลบ.ม./วัน</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-3 pt-2 border-t border-[#e2eded] dark:border-[#233a3d] text-[11px] text-[#53676b] dark:text-[#91a6a9]">
        ข้อมูลล่าสุดจาก กฟผ. และกรมชลประทาน ผ่านคลังข้อมูลน้ำแห่งชาติ
      </div>
    </section>
  );
};
