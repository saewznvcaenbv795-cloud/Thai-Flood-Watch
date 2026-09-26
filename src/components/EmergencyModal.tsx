import React, { useState } from 'react';
import { X, PhoneCall, ShieldAlert, AlertTriangle, CheckSquare, Phone, ExternalLink } from 'lucide-react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EMERGENCY_NUMBERS = [
  { num: '1784', name: 'ปภ. แจ้งเหตุสาธารณภัย', desc: 'สายด่วนกรมป้องกันและบรรเทาสาธารณภัย รับแจ้งภัยพิบัติ 24 ชม.', primary: true },
  { num: '1669', name: 'เจ็บป่วยฉุกเฉิน / กู้ชีพ', desc: 'ศูนย์นเรนทร สพฉ. เรียกรถพยาบาลฉุกเฉินส่งต่อโรงพยาบาลฟรี', primary: true },
  { num: '191', name: 'เหตุด่วนเหตุร้าย ตำรวจ', desc: 'แจ้งความเร่งด่วน เจ้าหน้าที่เข้าตรวจสอบพื้นที่เกิดเหตุทันที' },
  { num: '1555', name: 'ศูนย์เรื่องราว กทม.', desc: 'แจ้งน้ำท่วมขัง ถนนระบายน้ำไม่ทันในพื้นที่กรุงเทพมหานคร' },
  { num: '1460', name: 'สายด่วนกรมชลประทาน', desc: 'สอบถามข้อมูลการระบายน้ำ ท้ายเขื่อน และสถานการณ์น้ำหลาก' },
  { num: '1586', name: 'สายด่วนกรมทางหลวง', desc: 'ตรวจสอบเส้นทางหลวงที่น้ำท่วม รถติด หรือถนนถูกตัดขาด' },
  { num: '1146', name: 'กรมทางหลวงชนบท', desc: 'ตรวจสอบสะพานและถนนสายรองในชุมชน' },
  { num: '1182', name: 'กรมอุตุนิยมวิทยา', desc: 'สอบถามประกาศเตือนภัยพายุและฝนตกหนัก' },
];

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'hotlines' | 'guide'>('hotlines');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white dark:bg-[#112225] rounded-2xl border border-[#d2dedd] dark:border-[#233a3d] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#d2dedd] dark:border-[#233a3d] flex items-center justify-between bg-red-500/10 dark:bg-red-500/15">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-500 text-white flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-red-700 dark:text-red-400 font-display">
                ศูนย์ช่วยเหลือฉุกเฉิน & คำแนะนำรับมือน้ำท่วม
              </h3>
              <p className="text-xs text-[#53676b] dark:text-[#91a6a9]">
                สายด่วน 24 ชั่วโมง และแนวทางปฏิบัติตนเพื่อความปลอดภัย
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#53676b] hover:text-[#0e2429] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-[#d2dedd] dark:border-[#233a3d] bg-[#f4f8f7] dark:bg-[#162b2e] px-4 pt-2 gap-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('hotlines')}
            className={`pb-2.5 px-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'hotlines'
                ? 'border-red-500 text-red-600 dark:text-red-400'
                : 'border-transparent text-[#53676b] dark:text-[#91a6a9] hover:text-[#0e2429]'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>เบอร์โทรฉุกเฉิน (โทรฟรี 24 ชม.)</span>
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`pb-2.5 px-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'guide'
                ? 'border-red-500 text-red-600 dark:text-red-400'
                : 'border-transparent text-[#53676b] dark:text-[#91a6a9] hover:text-[#0e2429]'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>คู่มือรับมือน้ำท่วมฉุกเฉิน</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'hotlines' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {EMERGENCY_NUMBERS.map((item) => (
                <a
                  key={item.num}
                  href={`tel:${item.num}`}
                  className={`p-3 rounded-xl border transition flex items-center justify-between group ${
                    item.primary
                      ? 'bg-red-500/10 border-red-300 dark:border-red-900/60 hover:bg-red-500/15'
                      : 'bg-[#f4f8f7] dark:bg-[#162b2e] border-[#d2dedd] dark:border-[#233a3d] hover:bg-white dark:hover:bg-[#1b3438]'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xl font-bold font-mono-num ${item.primary ? 'text-red-600 dark:text-red-400' : 'text-[#0a6c86] dark:text-[#3fb6d3]'}`}>
                        {item.num}
                      </span>
                      {item.primary && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-red-600 text-white">
                          ด่วนหลัก
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-semibold text-[#0e2429] dark:text-[#e2eeee] mt-0.5">
                      {item.name}
                    </div>
                    <div className="text-[11px] text-[#53676b] dark:text-[#91a6a9] line-clamp-1 mt-0.5">
                      {item.desc}
                    </div>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-white dark:bg-[#112225] border border-[#d2dedd] dark:border-[#233a3d] flex items-center justify-center shrink-0 group-hover:bg-[#0a6c86] group-hover:text-white transition">
                    <Phone className="w-4 h-4" />
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="space-y-3.5 text-xs">
              {/* Step 1 */}
              <div className="p-3.5 rounded-xl bg-[#f4f8f7] dark:bg-[#162b2e] border border-[#d2dedd] dark:border-[#233a3d]">
                <h4 className="font-bold text-sm text-[#0e2429] dark:text-[#e2eeee] mb-2 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs">1</span>
                  <span>ก่อนน้ำท่วม (เตรียมความพร้อมล่วงหน้า)</span>
                </h4>
                <ul className="space-y-1.5 text-[#53676b] dark:text-[#91a6a9] pl-7 list-disc">
                  <li>ยกสิ่งของ เครื่องใช้ไฟฟ้า และเอกสารสำคัญขึ้นที่สูงหรือชั้น 2</li>
                  <li>เตรียมถุงยังชีพ: อาหารแห้ง น้ำดื่ม ยาสามัญ ไฟฉาย และพาวเวอร์แบงก์ชาร์จเต็ม</li>
                  <li>วางแนวกระสอบทรายอุดช่องทางน้ำไหลเข้าบ้าน และเตรียมอุปกรณ์ตักน้ำ</li>
                  <li>จอดรถยนต์ในพื้นที่สูงปลอดภัย เช่น อาคารจอดรถ หรือไหล่ทางที่สูงพ้นน้ำ</li>
                </ul>
              </div>

              {/* Step 2 */}
              <div className="p-3.5 rounded-xl bg-red-500/5 dark:bg-red-500/10 border border-red-200 dark:border-red-950/60">
                <h4 className="font-bold text-sm text-red-600 dark:text-red-400 mb-2 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs">2</span>
                  <span>ขณะเกิดน้ำท่วม (เอาชีวิตรอดและป้องกันภัย)</span>
                </h4>
                <ul className="space-y-1.5 text-[#53676b] dark:text-[#91a6a9] pl-7 list-disc">
                  <li><b>สับคัตเอาต์ตัดกระแสไฟฟ้า</b> ชั้นที่น้ำท่วมทันที ป้องกันไฟฟ้ารั่วช็อตเสียชีวิต</li>
                  <li>อย่าเดินลุยน้ำหรือขับรถฝ่ากระแสน้ำไหลเชี่ยว (ระดับน้ำ 30 ซม. สามารถพัดรถลอยได้)</li>
                  <li>ระวังสัตว์มีพิษ (งู ตะขาบ แมงป่อง) ที่หนีน้ำขึ้นมาหลบซ่อนตามมุมบ้าน</li>
                  <li>หากระดับน้ำสูงถึงวิกฤต ให้รีบอพยพไปยังศูนย์พักพิงชั่วคราวของชุมชน</li>
                </ul>
              </div>

              {/* Step 3 */}
              <div className="p-3.5 rounded-xl bg-[#f4f8f7] dark:bg-[#162b2e] border border-[#d2dedd] dark:border-[#233a3d]">
                <h4 className="font-bold text-sm text-[#0e2429] dark:text-[#e2eeee] mb-2 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">3</span>
                  <span>หลังน้ำลด (ฟื้นฟูอย่างปลอดภัย)</span>
                </h4>
                <ul className="space-y-1.5 text-[#53676b] dark:text-[#91a6a9] pl-7 list-disc">
                  <li>อย่าเพิ่งเปิดระบบไฟจนกว่าช่างไฟฟ้าผู้เชี่ยวชาญจะตรวจสอบปลั๊กและสายไฟที่จมน้ำ</li>
                  <li>สวมรองเท้าบูทและถุงมือยางขณะทำความสะอาดบ้าน ป้องกันเชื้อโรคฉี่หนูและบาดทะยัก</li>
                  <li>ถ่ายภาพความเสียหายของตัวบ้านและทรัพย์สินไว้เป็นหลักฐานยื่นขอเงินเยียวยา ปภ.</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#d2dedd] dark:border-[#233a3d] bg-[#f4f8f7] dark:bg-[#162b2e]/60 flex items-center justify-between text-xs text-[#53676b] dark:text-[#91a6a9]">
          <span>โทรศัพท์ฉุกเฉินทุกเบอร์สามารถกดโทรได้ฟรีแม้ไม่มีเงินในซิม</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 dark:bg-slate-700 text-white font-medium hover:bg-slate-900 transition cursor-pointer"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
};
