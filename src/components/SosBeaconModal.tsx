import React, { useState } from 'react';
import { X, Navigation, Phone, Share2, Copy, Check, AlertOctagon, MessageCircle } from 'lucide-react';
import { fmt } from '../utils/formatters';
import { requestAccurateGeolocation, AccurateUserLocation } from '../utils/geolocation';

interface SosBeaconModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SosBeaconModal: React.FC<SosBeaconModalProps> = ({ isOpen, onClose }) => {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [accurateLoc, setAccurateLoc] = useState<AccurateUserLocation | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [peopleCount, setPeopleCount] = useState('1');
  const [condition, setCondition] = useState('น้ำท่วมเข้าบ้านชั้นล่าง ต้องการอพยพ');
  const [hasSpecialCare, setHasSpecialCare] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleGetLocation = async () => {
    setIsLocating(true);
    try {
      const loc = await requestAccurateGeolocation();
      setCoords({ lat: loc.lat, lng: loc.lng });
      setAccurateLoc(loc);
    } catch (err: any) {
      console.warn('GPS error in SOS modal:', err);
    } finally {
      setIsLocating(false);
    }
  };

  const mapsUrl = coords ? `https://www.google.com/maps?q=${coords.lat},${coords.lng}` : '';

  const sosMessage = `🚨 [ขอความช่วยเหลือเร่งด่วน น้ำท่วม]
📍 พิกัด GPS: ${coords ? `${fmt(coords.lat, 5)}, ${fmt(coords.lng, 5)}` : 'ยังไม่ได้ระบุพิกัด'}
📌 สถานที่: ${accurateLoc?.displayName || '-'}
🎯 ความแม่นยำ: ${accurateLoc?.accuracyText || '-'}
🗺️ แผนที่นำทาง: ${mapsUrl || '-'}
👤 ผู้แจ้ง: ${name || 'ผู้ประสบภัย'}
📞 เบอร์ติดต่อ: ${phone || '-'}
👥 จำนวนผู้ประสบภัย: ${peopleCount} คน ${hasSpecialCare ? '(มีผู้สูงอายุ / ผู้ป่วยติดเตียง / เด็กเล็ก)' : ''}
⚠️ สภาพการณ์: ${condition}

(แจ้งผ่านระบบฉุกเฉิน https://thaiflood.online)`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sosMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const lineShareUrl = `https://line.me/R/msg/text/?${encodeURIComponent(sosMessage)}`;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-[#112225] rounded-2xl border border-red-500/40 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-red-200 dark:border-red-950/60 bg-red-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-display">
                ส่งสัญญาณขอความช่วยเหลือฉุกเฉิน (SOS)
              </h3>
              <p className="text-xs text-red-100">
                ดึงพิกัด GPS ส่งตรงให้ทีมกู้ภัยและญาติทาง LINE ทันที
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
          {/* Step 1: GPS Location */}
          <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="font-bold text-red-700 dark:text-red-400 flex items-center gap-1.5">
                <Navigation className="w-4 h-4" />
                1. พิกัดตำแหน่งเพื่อกู้ภัยเข้าช่วยเหลือ
              </span>
              <button
                type="button"
                onClick={handleGetLocation}
                disabled={isLocating}
                className="px-2.5 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold transition cursor-pointer"
              >
                {isLocating ? 'กำลังดึงพิกัด…' : coords ? 'อัปเดตพิกัดใหม่' : 'ดึงพิกัด GPS ตอนนี้'}
              </button>
            </div>

            {coords ? (
              <div className="text-[#000000] dark:text-[#ffffff] font-mono-num bg-white dark:bg-[#202020] p-2.5 rounded-lg border border-[#e6e6e6] dark:border-[#2f2f2f] space-y-1">
                <div className="font-sans font-bold text-xs text-[#0075de]">
                  📍 {accurateLoc?.displayName || 'พิกัด GPS ของคุณ'}
                </div>
                <div>
                  ละติจูด: <b>{fmt(coords.lat, 5)}</b>, ลองจิจูด: <b>{fmt(coords.lng, 5)}</b>
                </div>
                <div className="text-[11px] text-[#1aae39] font-medium font-sans">
                  🎯 {accurateLoc?.accuracyText || 'ความแม่นยำสูง พร้อมส่งลิงก์ Google Maps ให้ทีมกู้ภัย'}
                </div>
              </div>
            ) : (
              <p className="text-[#53676b] dark:text-[#91a6a9]">
                กดปุ่ม <b>"ดึงพิกัด GPS ตอนนี้"</b> เพื่อให้เรือกู้ภัยค้นหาตำแหน่งบ้านคุณได้อย่างแม่นยำ
              </p>
            )}
          </div>

          {/* Form fields */}
          <div className="space-y-2.5">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-[#53676b] dark:text-[#91a6a9] mb-1">
                  ชื่อผู้แจ้ง / ผู้ประสบภัย
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="เช่น สมชาย ใจดี"
                  className="w-full px-3 py-1.5 rounded-lg border border-[#d2dedd] dark:border-[#233a3d] bg-[#f4f8f7] dark:bg-[#162b2e] text-[#0e2429] dark:text-[#e2eeee]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#53676b] dark:text-[#91a6a9] mb-1">
                  เบอร์โทรติดต่อกลับ
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="เช่น 081-234-5678"
                  className="w-full px-3 py-1.5 rounded-lg border border-[#d2dedd] dark:border-[#233a3d] bg-[#f4f8f7] dark:bg-[#162b2e] text-[#0e2429] dark:text-[#e2eeee]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 items-center">
              <div>
                <label className="block text-[11px] font-semibold text-[#53676b] dark:text-[#91a6a9] mb-1">
                  จำนวนผู้ประสบภัย (คน)
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={peopleCount}
                  onChange={(e) => setPeopleCount(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-[#d2dedd] dark:border-[#233a3d] bg-[#f4f8f7] dark:bg-[#162b2e] text-[#0e2429] dark:text-[#e2eeee]"
                />
              </div>

              <div className="pt-4">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-red-600 dark:text-red-400">
                  <input
                    type="checkbox"
                    checked={hasSpecialCare}
                    onChange={(e) => setHasSpecialCare(e.target.checked)}
                    className="rounded accent-red-600 w-4 h-4 cursor-pointer"
                  />
                  <span>มีผู้ป่วยติดเตียง / คนชรา</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#53676b] dark:text-[#91a6a9] mb-1">
                สถานการณ์และจุดสังเกต
              </label>
              <textarea
                rows={2}
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                placeholder="เช่น น้ำท่วมชั้น 1 มิดหัวเข่า บ้านทาสีฟ้า ใกล้เสาไฟต้นที่ 3"
                className="w-full px-3 py-1.5 rounded-lg border border-[#d2dedd] dark:border-[#233a3d] bg-[#f4f8f7] dark:bg-[#162b2e] text-[#0e2429] dark:text-[#e2eeee]"
              />
            </div>
          </div>

          {/* Message Preview */}
          <div className="p-3 rounded-lg bg-[#f4f8f7] dark:bg-[#162b2e] border border-[#d2dedd] dark:border-[#233a3d]">
            <div className="text-[11px] text-[#53676b] dark:text-[#91a6a9] mb-1 font-semibold">
              ตัวอย่างข้อความฉุกเฉินที่จะส่ง:
            </div>
            <pre className="text-[11px] whitespace-pre-wrap font-sans text-[#0e2429] dark:text-[#e2eeee]">
              {sosMessage}
            </pre>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#d2dedd] dark:border-[#233a3d] bg-[#f4f8f7] dark:bg-[#162b2e]/60 flex flex-wrap items-center gap-2">
          {/* Share to LINE */}
          <a
            href={lineShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2 px-3 rounded-lg bg-[#06c755] hover:bg-[#05b34c] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
          >
            <MessageCircle className="w-4 h-4" />
            <span>แชร์ขอความช่วยเหลือเข้า LINE</span>
          </a>

          {/* Copy Message */}
          <button
            onClick={handleCopy}
            className="py-2 px-3 rounded-lg border border-[#d2dedd] dark:border-[#233a3d] bg-white dark:bg-[#112225] text-xs font-semibold hover:bg-black/5 flex items-center gap-1 transition cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'คัดลอกแล้ว' : 'คัดลอกข้อความ'}</span>
          </button>

          {/* Direct call 1784 */}
          <a
            href="tel:1784"
            className="py-2 px-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 transition"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>โทร 1784 ทันที</span>
          </a>
        </div>
      </div>
    </div>
  );
};
