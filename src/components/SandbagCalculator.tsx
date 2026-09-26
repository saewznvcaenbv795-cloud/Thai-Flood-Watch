import React, { useState, useEffect } from 'react';
import { Calculator, CheckSquare, ShieldCheck, Info, Package, AlertCircle } from 'lucide-react';
import { fmt } from '../utils/formatters';

const DEFAULT_CHECKLIST = [
  { id: 'item-1', text: 'สับคัตเอาต์/เบรกเกอร์ตัดกระแสไฟฟ้าชั้นล่าง', checked: false, critical: true },
  { id: 'item-2', text: 'เก็บเอกสารสำคัญ (บัตร ปชช., โฉนด, ทะเบียนบ้าน) ในซองกันน้ำ', checked: false, critical: true },
  { id: 'item-3', text: 'น้ำดื่มสะอาดอย่างน้อย 3 ลิตร/คน/วัน (สำรอง 3 วัน)', checked: false },
  { id: 'item-4', text: 'อาหารแห้ง ปลากระป๋อง บะหมี่กึ่งสำเร็จรูปที่ไม่ต้องต้ม', checked: false },
  { id: 'item-5', text: 'ยาสามัญประจำบ้าน ยาประจำตัวผู้ป่วย และชุดทำแผล', checked: false },
  { id: 'item-6', text: 'ไฟฉาย ถ่านสำรอง เทียนไข และไฟแช็ก', checked: false },
  { id: 'item-7', text: 'พาวเวอร์แบงก์ชาร์จแบตเตอรี่เต็ม 100%', checked: false },
  { id: 'item-8', text: 'รองเท้าบูทยาง ถุงมือยาง ป้องกันเชื้อโรคฉี่หนูและของมีคม', checked: false },
  { id: 'item-9', text: 'ย้ายสิ่งของ เครื่องใช้ไฟฟ้าขึ้นที่สูงหรือชั้น 2', checked: false },
  { id: 'item-10', text: 'อพยพสัตว์เลี้ยง (สุนัข แมว) ไปยังที่ปลอดภัย ไม่ผูกล่ามทิ้งไว้', checked: false },
];

export const SandbagCalculator: React.FC = () => {
  // Calculator inputs
  const [doorWidth, setDoorWidth] = useState<number>(1.5); // meters
  const [floodHeight, setFloodHeight] = useState<number>(50); // cm

  // Checklist state
  const [checklist, setChecklist] = useState(() => {
    try {
      const saved = localStorage.getItem('thai_flood_checklist');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}
    return DEFAULT_CHECKLIST;
  });

  useEffect(() => {
    try {
      localStorage.setItem('thai_flood_checklist', JSON.stringify(checklist));
    } catch {}
  }, [checklist]);

  const toggleItem = (id: string) => {
    setChecklist((prev: any[]) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const handleResetChecklist = () => {
    setChecklist(DEFAULT_CHECKLIST.map((item) => ({ ...item, checked: false })));
  };

  // Sandbag calculation formula:
  // Height in layers = floodHeight (cm) / 10 cm per compacted sandbag
  // Width in bags = (doorWidth * 100 cm) / 45 cm (effective overlapping length)
  // Pyramid stacking multiplier: base width should be 3 times height for water pressure
  const layers = Math.max(1, Math.ceil(floodHeight / 10));
  const bagsPerLayer = Math.max(1, Math.ceil((doorWidth * 100) / 45));

  // If height > 30cm, pyramid stacking is required
  let totalBags = 0;
  if (layers <= 2) {
    totalBags = layers * bagsPerLayer;
  } else {
    // 3 layers: base 3 bags wide, 2nd 2 bags, top 1 bag => triangular section
    totalBags = Math.ceil(((layers * (layers + 1)) / 2) * bagsPerLayer * 0.75);
  }

  // Weight: ~18 kg per bag
  const totalWeightKg = totalBags * 18;
  // Sand volume: ~0.012 m³ per bag
  const totalSandVolumeM3 = totalBags * 0.012;
  // Plastic sheet length needed
  const plasticLengthM = doorWidth + 1.0;

  const completedCount = checklist.filter((i: any) => i.checked).length;

  return (
    <section className="bg-white dark:bg-[#112225] rounded-xl border border-[#d2dedd] dark:border-[#233a3d] shadow-xs p-4 space-y-5">
      <div>
        <h2 className="text-base font-bold text-[#0e2429] dark:text-[#e2eeee] font-display flex items-center gap-1.5">
          <Calculator className="w-4 h-4 text-[#0a6c86] dark:text-[#3fb6d3]" />
          เครื่องคำนวณแนวกระสอบทราย & เช็กลิสต์เตรียมรับมือน้ำท่วม
        </h2>
        <p className="text-xs text-[#53676b] dark:text-[#91a6a9]">
          คำนวณจำนวนกระสอบทรายตามหลักวิศวกรรมชลศาสตร์ และเช็กลิสต์ความปลอดภัยในบ้านเรือน
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Sandbag Calculator (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 rounded-xl bg-[#f4f8f7] dark:bg-[#162b2e] border border-[#d2dedd] dark:border-[#233a3d] space-y-3">
            <h3 className="font-bold text-xs text-[#0a6c86] dark:text-[#3fb6d3] flex items-center gap-1.5">
              <Package className="w-4 h-4" />
              คำนวณจำนวนกระสอบทรายกั้นหน้าบ้าน / ประตู
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-[#53676b] dark:text-[#91a6a9] mb-1">
                  ความกว้างช่องทาง / ประตู (เมตร)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0.8"
                    max="6.0"
                    step="0.1"
                    value={doorWidth}
                    onChange={(e) => setDoorWidth(Number(e.target.value))}
                    className="flex-1 accent-[#0a6c86] cursor-pointer"
                  />
                  <span className="w-14 font-mono-num font-bold text-right text-xs">
                    {fmt(doorWidth, 1)} ม.
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#53676b] dark:text-[#91a6a9] mb-1">
                  ความสูงน้ำที่ต้องการป้องกัน (ซม.)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="20"
                    max="120"
                    step="5"
                    value={floodHeight}
                    onChange={(e) => setFloodHeight(Number(e.target.value))}
                    className="flex-1 accent-[#0a6c86] cursor-pointer"
                  />
                  <span className="w-14 font-mono-num font-bold text-right text-xs">
                    {fmt(floodHeight, 0)} ซม.
                  </span>
                </div>
              </div>
            </div>

            {/* Result Display */}
            <div className="mt-3 p-3.5 rounded-xl bg-white dark:bg-[#112225] border border-[#d2dedd] dark:border-[#233a3d] grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
              <div className="p-2 rounded-lg bg-[#0a6c86]/10 dark:bg-[#3fb6d3]/15">
                <div className="text-[10px] text-[#53676b] dark:text-[#91a6a9]">จำนวนกระสอบทราย</div>
                <div className="text-xl font-bold font-mono-num text-[#0a6c86] dark:text-[#3fb6d3]">
                  ~{fmt(totalBags)} <span className="text-xs font-normal">ลูก</span>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-amber-500/10">
                <div className="text-[10px] text-[#53676b] dark:text-[#91a6a9]">ทรายหยาบที่ใช้</div>
                <div className="text-xl font-bold font-mono-num text-amber-700 dark:text-amber-400">
                  {fmt(totalSandVolumeM3, 2)} <span className="text-xs font-normal">คิว</span>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-slate-500/10">
                <div className="text-[10px] text-[#53676b] dark:text-[#91a6a9]">น้ำหนักรวม</div>
                <div className="text-xl font-bold font-mono-num text-[#0e2429] dark:text-[#e2eeee]">
                  {fmt(totalWeightKg, 0)} <span className="text-xs font-normal">กก.</span>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-blue-500/10">
                <div className="text-[10px] text-[#53676b] dark:text-[#91a6a9]">ผ้ายางพลาสติกรอง</div>
                <div className="text-xl font-bold font-mono-num text-blue-600 dark:text-blue-400">
                  {fmt(plasticLengthM, 1)} <span className="text-xs font-normal">เมตร</span>
                </div>
              </div>
            </div>

            {/* Practical Tip */}
            <div className="text-[11px] text-[#53676b] dark:text-[#91a6a9] leading-relaxed flex items-start gap-1.5 pt-1">
              <Info className="w-3.5 h-3.5 text-[#0a6c86] dark:text-[#3fb6d3] shrink-0 mt-0.5" />
              <span>
                <b>เทคนิคการวางกระสอบทราย:</b> บรรจุทรายเพียง <b>1/2 ถึง 2/3 ของกระสอบ</b> (ห้ามบรรจุแน่นเกินไปเพื่อให้ทรายแบนตัวแนบชิดกัน), หันปากกระสอบเข้าด้านในบ้าน และปูผ้ายางพลาสติกด้านนอกแนวคันกั้นน้ำเพื่อป้องกันน้ำซึมผ่านร่อง
              </span>
            </div>
          </div>
        </div>

        {/* Right: Emergency Kit Checklist (5 cols) */}
        <div className="lg:col-span-5 p-4 rounded-xl bg-[#f4f8f7] dark:bg-[#162b2e] border border-[#d2dedd] dark:border-[#233a3d] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-xs text-[#0e2429] dark:text-[#e2eeee] flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4 text-emerald-600" />
                เช็กลิสต์ความพร้อมก่อนน้ำท่วม ({completedCount}/{checklist.length})
              </h3>
              <button
                onClick={handleResetChecklist}
                className="text-[10px] text-[#53676b] hover:text-red-500 cursor-pointer"
              >
                รีเซ็ต
              </button>
            </div>

            <div className="w-full bg-[#d2dedd] dark:bg-[#233a3d] h-1.5 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${(completedCount / checklist.length) * 100}%` }}
              />
            </div>

            <div className="space-y-1.5 max-h-[260px] overflow-y-auto pr-1">
              {checklist.map((item: any) => (
                <label
                  key={item.id}
                  className={`flex items-start gap-2 p-2 rounded-lg border transition cursor-pointer text-xs ${
                    item.checked
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200'
                      : item.critical
                      ? 'bg-red-500/5 border-red-200 dark:border-red-950/60 hover:bg-red-500/10'
                      : 'bg-white dark:bg-[#112225] border-[#d2dedd] dark:border-[#233a3d] hover:bg-[#eef3f2]'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => toggleItem(item.id)}
                    className="rounded accent-emerald-600 w-3.5 h-3.5 mt-0.5 cursor-pointer shrink-0"
                  />
                  <span className={item.checked ? 'line-through opacity-70' : 'font-medium'}>
                    {item.text}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-[#d2dedd] dark:border-[#233a3d] text-[10px] text-[#53676b] dark:text-[#91a6a9]">
            บันทึกความคืบหน้าอัตโนมัติบนอุปกรณ์ของคุณ
          </div>
        </div>
      </div>
    </section>
  );
};
