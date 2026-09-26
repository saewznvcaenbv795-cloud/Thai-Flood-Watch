import React from 'react';
import { PhoneCall, ShieldAlert, Phone } from 'lucide-react';

const HOTLINES = [
  { tel: '1784', name: 'ปภ. กรมป้องกันและบรรเทาสาธารณภัย', desc: 'แจ้งเหตุน้ำท่วม ดินถล่ม ขอความช่วยเหลือ 24 ชม.', highlight: true },
  { tel: '1669', name: 'เจ็บป่วยฉุกเฉิน / กู้ชีพ', desc: 'ศูนย์นเรนทร เรียกรถพยาบาลฉุกเฉินฟรี 24 ชม.', highlight: true },
  { tel: '191', name: 'เหตุด่วนเหตุร้าย', desc: 'สถานีตำรวจภูธร/นครบาล แจ้งเหตุฉุกเฉินทุกกรณี' },
  { tel: '1555', name: 'ศูนย์กทม. (กรุงเทพมหานคร)', desc: 'ร้องทุกข์น้ำท่วมขัง ท่อตัน และช่วยเหลือในเขตกทม.' },
  { tel: '1460', name: 'กรมชลประทาน', desc: 'ศูนย์ปฏิบัติการน้ำอัจฉริยะ สอบถามสถานการณ์น้ำ' },
  { tel: '1182', name: 'กรมอุตุนิยมวิทยา', desc: 'พยากรณ์อากาศ เตือนภัยพายุและฝนตกหนัก' },
  { tel: '1586', name: 'กรมทางหลวง (สายด่วนทางหลวง)', desc: 'สอบถามเส้นทางน้ำท่วม รถเสียบนทางหลวง' },
  { tel: '1146', name: 'กรมทางหลวงชนบท', desc: 'ตรวจสอบถนนสะพานชนบทและทางเลี่ยงน้ำท่วม' },
];

export const EmergencyHotlines: React.FC = () => {
  return (
    <section className="bg-white dark:bg-[#112225] rounded-xl border border-[#d2dedd] dark:border-[#233a3d] shadow-xs p-4 flex flex-col h-full">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-base font-bold text-[#0e2429] dark:text-[#e2eeee] font-display flex items-center gap-1.5">
          <PhoneCall className="w-4 h-4 text-red-500" />
          สายด่วนขอความช่วยเหลือ
        </h2>
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 font-semibold border border-red-500/20">
          โทรฟรี 24 ชม.
        </span>
      </div>
      <p className="text-xs text-[#53676b] dark:text-[#91a6a9] mb-3">
        กดที่เบอร์เพื่อโทรออกทันทีจากสมาร์ตโฟน
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 flex-1">
        {HOTLINES.map((h) => (
          <a
            key={h.tel}
            href={`tel:${h.tel}`}
            className={`p-3 rounded-lg border transition flex flex-col justify-between group ${
              h.highlight
                ? 'bg-red-500/5 hover:bg-red-500/10 border-red-200 dark:border-red-950/60'
                : 'bg-[#f4f8f7] dark:bg-[#162b2e] hover:bg-[#ebf2f1] dark:hover:bg-[#1d3539] border-[#d2dedd] dark:border-[#233a3d]'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span
                className={`text-xl font-bold font-mono-num ${
                  h.highlight ? 'text-red-600 dark:text-red-400' : 'text-[#0a6c86] dark:text-[#3fb6d3]'
                }`}
              >
                {h.tel}
              </span>
              <Phone className="w-4 h-4 text-[#53676b] group-hover:text-[#0a6c86] dark:group-hover:text-[#3fb6d3] transition" />
            </div>
            <div>
              <div className="text-xs font-semibold text-[#0e2429] dark:text-[#e2eeee] line-clamp-1">
                {h.name}
              </div>
              <div className="text-[11px] text-[#53676b] dark:text-[#91a6a9] line-clamp-2 mt-0.5">
                {h.desc}
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};
