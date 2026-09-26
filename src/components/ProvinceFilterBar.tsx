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
    <div className="bg-white dark:bg-[#202020] p-2.5 rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] shadow-[0_1px_2px_rgba(0,0,0,0.04)] flex flex-wrap items-center justify-between gap-2 text-xs">
      <div className="flex items-center gap-2 overflow-x-auto py-0.5">
        <span className="text-[#615d59] dark:text-[#9b9a97] font-medium flex items-center gap-1 shrink-0">
          <MapPin className="w-3.5 h-3.5 text-[#0075de]" />
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
                  ? 'bg-[#0075de] text-white font-semibold shadow-2xs'
                  : 'bg-[#f6f5f4] dark:bg-[#252525] text-[#31302e] dark:text-[#d4d4d4] hover:bg-white border border-[#e6e6e6] dark:border-[#2f2f2f]'
              }`}
            >
              <span>{name}</span>
              <span className={`text-[10px] font-mono-num font-bold px-1.5 py-0.2 rounded-full ${
                stat.lv5 > 0 ? (isSelected ? 'bg-white text-[#e03e3e]' : 'bg-[#e03e3e] text-white') : (isSelected ? 'bg-white text-[#dd5b00]' : 'bg-[#dd5b00] text-white')
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
          className="flex items-center gap-1 text-[11px] text-[#e03e3e] dark:text-[#ff6464] hover:underline cursor-pointer shrink-0 font-medium"
        >
          <X className="w-3.5 h-3.5" />
          <span>ล้างตัวกรอง ({selectedProvince})</span>
        </button>
      )}
    </div>
  );
};
