import React, { useState } from 'react';
import { Waves, ExternalLink, Filter, Info, ShieldCheck, Mountain, Calendar, Layers, ChevronDown, ChevronUp } from 'lucide-react';
import { DamData } from '../types';
import { fmt } from '../utils/formatters';
import { getDamSpecByName, DamSpec } from '../data/damSpecs';

interface MajorDamsProps {
  dams: DamData[];
  onSelectDamCoords?: (lat: number, lng: number) => void;
  onOpenAttributionModal?: () => void;
}

export const MajorDams: React.FC<MajorDamsProps> = ({
  dams,
  onSelectDamCoords,
  onOpenAttributionModal,
}) => {
  const [onlyOver80, setOnlyOver80] = useState(false);
  const [selectedDamDetail, setSelectedDamDetail] = useState<{ dam: DamData; spec?: DamSpec } | null>(null);

  const sortedDams = [...dams]
    .filter((d) => !onlyOver80 || d.pct >= 80)
    .sort((a, b) => b.pct - a.pct);

  return (
    <section className="bg-white dark:bg-[#202020] rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-4 flex flex-col h-full">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#0075de]/10 text-[#0075de] dark:text-[#62aef0] flex items-center justify-center font-bold">
            <Waves className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-[#000000] dark:text-[#ffffff] font-display flex items-center gap-1.5">
              เขื่อนขนาดใหญ่ทั่วประเทศ
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setOnlyOver80(!onlyOver80)}
            className={`text-xs px-2.5 py-1 rounded-md border transition cursor-pointer flex items-center gap-1 ${
              onlyOver80
                ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30 font-semibold'
                : 'border-[#e6e6e6] dark:border-[#2f2f2f] text-[#615d59] dark:text-[#9b9a97] hover:bg-[#f6f5f4] dark:hover:bg-[#252525]'
            }`}
          >
            <Filter className="w-3 h-3" />
            <span>&ge; 80% ({dams.filter((d) => d.pct >= 80).length})</span>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-[#615d59] dark:text-[#9b9a97] mb-3">
        <span>ปริมาณน้ำกักเก็บเทียบความจุ (% รนก.) พร้อมสเปกวิศวกรรม Wikipedia</span>
        {onOpenAttributionModal && (
          <button
            onClick={onOpenAttributionModal}
            className="text-[#0075de] dark:text-[#62aef0] hover:underline cursor-pointer flex items-center gap-1"
          >
            <Info className="w-3 h-3" />
            <span>ที่มาข้อมูล & ลิขสิทธิ์</span>
          </button>
        )}
      </div>

      {sortedDams.length === 0 ? (
        <div className="py-8 text-center text-xs text-[#615d59] dark:text-[#9b9a97]">
          ไม่มีข้อมูลเขื่อนที่ตรงตามเงื่อนไข
        </div>
      ) : (
        <div className="space-y-2 overflow-y-auto pr-1 flex-1 max-h-[420px]">
          {sortedDams.map((d) => {
            const isOver = d.pct >= 100;
            const isHigh = d.pct >= 80;
            const spec = getDamSpecByName(d.name);

            return (
              <div
                key={d.id}
                className="p-3 rounded-xl hover:bg-[#fbfbfa] dark:hover:bg-[#252525] border border-[#e6e6e6] dark:border-[#2f2f2f] transition flex flex-col gap-1.5"
              >
                <div className="flex items-start justify-between text-xs gap-2">
                  <div
                    onClick={() => onSelectDamCoords && onSelectDamCoords(d.lat, d.lng)}
                    className="cursor-pointer group flex-1"
                    title="คลิกเพื่อซูมแผนที่ไปยังตำแหน่งเขื่อน"
                  >
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-[#000000] dark:text-[#ffffff] group-hover:text-[#0075de] dark:group-hover:text-[#62aef0] transition">
                        เขื่อน{d.name}
                      </span>
                      {d.province && (
                        <span className="text-[11px] text-[#615d59] dark:text-[#9b9a97]">
                          จ.{d.province}
                        </span>
                      )}
                      {spec && (
                        <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded font-mono">
                          กั้น{spec.river}
                        </span>
                      )}
                    </div>

                    {spec && (
                      <div className="text-[10.5px] text-[#615d59] dark:text-[#9b9a97] flex items-center gap-2 mt-0.5 flex-wrap">
                        <span>สูง {spec.crestHeightMeters} ม.</span>
                        <span>•</span>
                        <span>ยาว {fmt(spec.crestLengthMeters, 0)} ม.</span>
                        <span>•</span>
                        <span>สร้างเสร็จ พ.ศ. {spec.completedYearTh}</span>
                        <span>•</span>
                        <span>{spec.operator}</span>
                      </div>
                    )}
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`font-mono-num font-bold text-sm ${
                        isOver
                          ? 'text-[#e03e3e]'
                          : isHigh
                          ? 'text-[#dd5b00]'
                          : 'text-[#0075de] dark:text-[#62aef0]'
                      }`}
                    >
                      {fmt(d.pct, 0)}%
                    </span>
                    <div className="text-[10px] text-[#615d59] dark:text-[#9b9a97]">
                      {d.date ? `ข้อมูล ${d.date}` : 'อัปเดตสด'}
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-[#f6f5f4] dark:bg-[#282828] h-2 rounded-full overflow-hidden border border-[#e6e6e6]/60 dark:border-[#383838]">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isOver ? 'bg-[#e03e3e]' : isHigh ? 'bg-[#dd5b00]' : 'bg-[#0075de]'
                    }`}
                    style={{ width: `${Math.min(d.pct, 100)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10.5px] text-[#615d59] dark:text-[#9b9a97] font-mono-num pt-0.5">
                  <span>กักเก็บ {fmt(d.storage, 0)} / {fmt(d.normal || spec?.normalCapacityMcm || d.storage, 0)} ล้าน ลบ.ม.</span>
                  <div className="flex items-center gap-2">
                    {d.inflow > 0 && <span className="text-[#1aae39]">เข้า +{fmt(d.inflow, 1)}</span>}
                    {d.released > 0 && <span className="text-[#e03e3e]">ออก -{fmt(d.released, 1)}</span>}
                    <button
                      onClick={() => setSelectedDamDetail({ dam: d, spec })}
                      className="text-[#0075de] dark:text-[#62aef0] font-medium hover:underline cursor-pointer ml-1"
                    >
                      รายละเอียด
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Attribution Footer note */}
      <div className="mt-3 pt-2.5 border-t border-[#e6e6e6] dark:border-[#2f2f2f] text-[11px] text-[#615d59] dark:text-[#9b9a97] flex flex-wrap items-center justify-between gap-1">
        <span>💧 ระดับน้ำ สสน. ThaiWater (ทุก 10 นาที)</span>
        <span>📐 สเปกเขื่อน Wikipedia / Wikidata (CC BY-SA)</span>
      </div>

      {/* Dam Detailed Specifications Modal */}
      {selectedDamDetail && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs transition-opacity animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#202020] rounded-2xl border border-[#e6e6e6] dark:border-[#2f2f2f] shadow-2xl p-5 overflow-hidden">
            <div className="flex items-start justify-between mb-3 border-b border-[#e6e6e6] dark:border-[#2f2f2f] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#000000] dark:text-[#ffffff] flex items-center gap-2">
                  <span>เขื่อน{selectedDamDetail.dam.name}</span>
                  {selectedDamDetail.spec?.operator && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#0075de]/10 text-[#0075de] dark:text-[#62aef0]">
                      {selectedDamDetail.spec.operator}
                    </span>
                  )}
                </h3>
                <p className="text-xs text-[#615d59] dark:text-[#9b9a97]">
                  {selectedDamDetail.spec?.wikiName || `เขื่อน${selectedDamDetail.dam.name}`} • จ.{selectedDamDetail.dam.province}
                </p>
              </div>

              <button
                onClick={() => setSelectedDamDetail(null)}
                className="text-[#615d59] hover:text-[#000000] dark:hover:text-white p-1 rounded-md cursor-pointer text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs max-h-[70vh] overflow-y-auto pr-1">
              {/* Telemetry Status Grid */}
              <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-[#f6f5f4] dark:bg-[#252525]">
                <div>
                  <div className="text-[11px] text-[#615d59] dark:text-[#9b9a97]">ปริมาณน้ำปัจจุบัน</div>
                  <div className="font-bold text-sm text-[#0075de] font-mono-num">
                    {fmt(selectedDamDetail.dam.storage, 1)} ล้าน ลบ.ม. ({fmt(selectedDamDetail.dam.pct, 0)}%)
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-[#615d59] dark:text-[#9b9a97]">ความจุเก็บกักปกติ</div>
                  <div className="font-bold text-sm text-[#000000] dark:text-white font-mono-num">
                    {fmt(selectedDamDetail.dam.normal || selectedDamDetail.spec?.normalCapacityMcm || selectedDamDetail.dam.storage, 1)} ล้าน ลบ.ม.
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-[#615d59] dark:text-[#9b9a97]">น้ำไหลลงอ่าง (24 ชม.)</div>
                  <div className="font-bold text-xs text-[#1aae39] font-mono-num">
                    +{fmt(selectedDamDetail.dam.inflow, 2)} ล้าน ลบ.ม.
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-[#615d59] dark:text-[#9b9a97]">น้ำระบายออก (24 ชม.)</div>
                  <div className="font-bold text-xs text-[#e03e3e] font-mono-num">
                    -{fmt(selectedDamDetail.dam.released, 2)} ล้าน ลบ.ม.
                  </div>
                </div>
              </div>

              {/* Wikipedia Specifications */}
              {selectedDamDetail.spec ? (
                <div className="space-y-2 border-t border-[#e6e6e6] dark:border-[#2f2f2f] pt-2">
                  <div className="font-bold text-[#000000] dark:text-white flex items-center justify-between">
                    <span>ข้อมูลทางวิศวกรรม (Wikipedia / Wikidata)</span>
                    <span className="text-[10px] text-[#615d59] font-normal">CC BY-SA / CC0</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11.5px]">
                    <div className="p-2 rounded-lg bg-white dark:bg-[#252525] border border-[#e6e6e6] dark:border-[#2f2f2f]">
                      <span className="text-[#615d59] block">แม่น้ำที่กั้น:</span>
                      <b className="text-[#000000] dark:text-white">{selectedDamDetail.spec.river}</b>
                    </div>
                    <div className="p-2 rounded-lg bg-white dark:bg-[#252525] border border-[#e6e6e6] dark:border-[#2f2f2f]">
                      <span className="text-[#615d59] block">ปีที่สร้างแล้วเสร็จ:</span>
                      <b className="text-[#000000] dark:text-white">พ.ศ. {selectedDamDetail.spec.completedYearTh} ({selectedDamDetail.spec.completedYearEn})</b>
                    </div>
                    <div className="p-2 rounded-lg bg-white dark:bg-[#252525] border border-[#e6e6e6] dark:border-[#2f2f2f]">
                      <span className="text-[#615d59] block">ความสูงสันเขื่อน:</span>
                      <b className="text-[#000000] dark:text-white">{selectedDamDetail.spec.crestHeightMeters} เมตร</b>
                    </div>
                    <div className="p-2 rounded-lg bg-white dark:bg-[#252525] border border-[#e6e6e6] dark:border-[#2f2f2f]">
                      <span className="text-[#615d59] block">ความยาวสันเขื่อน:</span>
                      <b className="text-[#000000] dark:text-white">{fmt(selectedDamDetail.spec.crestLengthMeters, 0)} เมตร</b>
                    </div>
                    <div className="p-2 rounded-lg bg-white dark:bg-[#252525] border border-[#e6e6e6] dark:border-[#2f2f2f]">
                      <span className="text-[#615d59] block">ระดับสันเขื่อน:</span>
                      <b className="text-[#000000] dark:text-white">{selectedDamDetail.spec.crestElevationMsl} ม.รทก.</b>
                    </div>
                    <div className="p-2 rounded-lg bg-white dark:bg-[#252525] border border-[#e6e6e6] dark:border-[#2f2f2f]">
                      <span className="text-[#615d59] block">กำลังผลิตไฟฟ้า:</span>
                      <b className="text-[#000000] dark:text-white">{selectedDamDetail.spec.powerCapacityMw ? `${selectedDamDetail.spec.powerCapacityMw} MW` : 'ไม่มีโรงไฟฟ้า'}</b>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white dark:bg-[#252525] border border-[#e6e6e6] dark:border-[#2f2f2f] text-[11px]">
                    <span className="text-[#615d59] block">ประเภทโครงสร้างเขื่อน:</span>
                    <b className="text-[#000000] dark:text-white">{selectedDamDetail.spec.damType}</b>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white dark:bg-[#252525] border border-[#e6e6e6] dark:border-[#2f2f2f] text-[11px]">
                    <span className="text-[#615d59] block">วัตถุประสงค์หลัก:</span>
                    <span className="text-[#31302e] dark:text-[#d4d4d4]">{selectedDamDetail.spec.purpose}</span>
                  </div>

                  {selectedDamDetail.spec.wikiUrl && (
                    <a
                      href={selectedDamDetail.spec.wikiUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0075de] dark:text-[#62aef0] font-medium hover:underline flex items-center gap-1 pt-1"
                    >
                      <span>เปิดอ่านบทความเขื่อนบน Wikipedia</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              ) : (
                <div className="text-[11px] text-[#615d59] italic">
                  ไม่มีข้อมูลสเปกวิศวกรรมเพิ่มเติมสำหรับเขื่อนนี้
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-[#e6e6e6] dark:border-[#2f2f2f] flex items-center justify-between text-xs">
              <button
                onClick={() => {
                  if (onSelectDamCoords) {
                    onSelectDamCoords(selectedDamDetail.dam.lat, selectedDamDetail.dam.lng);
                  }
                  setSelectedDamDetail(null);
                }}
                className="py-1.5 px-3 rounded-lg bg-[#0075de] hover:bg-[#005bab] text-white font-medium cursor-pointer transition"
              >
                ดูตำแหน่งบนแผนที่สด
              </button>

              <button
                onClick={() => setSelectedDamDetail(null)}
                className="py-1.5 px-3 rounded-lg border border-[#e6e6e6] dark:border-[#2f2f2f] text-[#615d59] dark:text-white hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
