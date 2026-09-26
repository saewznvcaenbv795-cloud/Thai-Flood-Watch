import React, { useMemo } from 'react';
import { Search, MapPin, X } from 'lucide-react';
import { WaterStation } from '../types';

interface ProvinceFilterBarProps {
  stations: WaterStation[];
  selectedProvince: string;
  onSelectProvince: (prov: string) => void;
  onClear: () => void;
}

const REGIONS: Record<string, string[]> = {
  'ภาคเหนือ': ['เชียงใหม่', 'เชียงราย', 'ลำพูน', 'ลำปาง', 'แพร่', 'น่าน', 'พะเยา', 'แม่ฮ่องสอน', 'อุตรดิตถ์', 'สุโขทัย', 'พิษณุโลก', 'พิจิตร', 'กำแพงเพชร', 'ตาก', 'นครสวรรค์', 'อุทัยธานี'],
  'ภาคกลาง': ['กรุงเทพมหานคร', 'นนทบุรี', 'ปทุมธานี', 'พระนครศรีอยุธยา', 'อ่างทอง', 'ลพบุรี', 'สิงห์บุรี', 'ชัยนาท', 'สระบุรี', 'สมุทรปราการ', 'สมุทรสาคร', 'สมุทรสงคราม', 'นครปฐม', 'สุพรรณบุรี'],
  'ภาคอีสาน': ['นครราชสีมา', 'อุบลราชธานี', 'ขอนแก่น', 'อุดรธานี', 'บุรีรัมย์', 'สุรินทร์', 'ร้อยเอ็ด', 'สกลนคร', 'กาฬสินธุ์', 'มหาสารคาม', 'ชัยภูมิ', 'มุกดาหาร', 'ยโสธร', 'เลย', 'หนองคาย', 'หนองบัวลำภู', 'บึงกาฬ', 'อำนาจเจริญ', 'นครพนม', 'ศรีสะเกษ'],
  'ภาคใต้': ['สงขลา', 'นครศรีธรรมราช', 'สุราษฎร์ธานี', 'ภูเก็ต', 'กระบี่', 'พังงา', 'ตรัง', 'พัทลุง', 'ชุมพร', 'ระนอง', 'สตูล', 'ปัตตานี', 'ยะลา', 'นราธิวาส'],
};

export const ProvinceFilterBar: React.FC<ProvinceFilterBarProps> = ({
  stations,
  selectedProvince,
  onSelectProvince,
  onClear,
}) => {
  // Extract provinces with risk stations
  const riskProvinces = useMemo(() => {
    const map = new Map<string, { lv5: number; lv4: number }>();
    for (const s of stations) {
      if (!s.province || s.level < 4) continue;
      const cur = map.get(s.province) || { lv5: 0, lv4: 0 };
      if (s.level === 5) cur.lv5++;
      else cur.lv4++;
      map.set(s.province, cur);
    }
    return [...map.entries()]
      .sort((a, b) => b[1].lv5 * 3 + b[1].lv4 - (a[1].lv5 * 3 + a[1].lv4))
      .slice(0, 10);
  }, [stations]);

  return (
    <div className="bg-white dark:bg-[#112225] p-2.5 rounded-xl border border-[#d2dedd] dark:border-[#233a3d] flex flex-wrap items-center justify-between gap-2 text-xs">
      <div className="flex items-center gap-2 overflow-x-auto py-0.5">
        <span className="text-[#53676b] dark:text-[#91a6a9] font-medium flex items-center gap-1 shrink-0">
          <MapPin className="w-3.5 h-3.5 text-[#0a6c86] dark:text-[#3fb6d3]" />
          จุดเสี่ยงเร่งด่วน:
        </span>

        {riskProvinces.map(([name, stat]) => {
          const isSelected = selectedProvince === name;
          return (
            <button
              key={name}
              onClick={() => onSelectProvince(isSelected ? '' : name)}
              className={`px-2.5 py-1 rounded-md transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                isSelected
                  ? 'bg-[#0a6c86] text-white font-semibold'
                  : 'bg-[#f4f8f7] dark:bg-[#162b2e] text-[#0e2429] dark:text-[#e2eeee] hover:bg-[#e9efee] border border-[#d2dedd] dark:border-[#233a3d]'
              }`}
            >
              <span>{name}</span>
              <span className={`text-[10px] font-mono-num font-bold px-1 rounded ${
                stat.lv5 > 0 ? (isSelected ? 'bg-red-400 text-slate-900' : 'bg-red-500 text-white') : (isSelected ? 'bg-amber-400 text-slate-900' : 'bg-amber-500 text-white')
              }`}>
                {stat.lv5 > 0 ? `${stat.lv5} ล้น` : `${stat.lv4}`}
              </span>
            </button>
          );
        })}
      </div>

      {selectedProvince && (
        <button
          onClick={onClear}
          className="flex items-center gap-1 text-[11px] text-red-600 dark:text-red-400 hover:underline cursor-pointer shrink-0 font-medium"
        >
          <X className="w-3.5 h-3.5" />
          <span>ล้างตัวกรอง ({selectedProvince})</span>
        </button>
      )}
    </div>
  );
};
