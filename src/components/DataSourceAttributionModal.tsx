import React from 'react';
import { X, ExternalLink, ShieldCheck, Database, Layers, Compass, Mountain, BookOpen, Clock, CheckCircle2 } from 'lucide-react';

interface DataSourceAttributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  updatedAt?: Date;
}

export const DataSourceAttributionModal: React.FC<DataSourceAttributionModalProps> = ({
  isOpen,
  onClose,
  updatedAt = new Date(),
}) => {
  if (!isOpen) return null;

  // Format Thai date and time e.g. 29 ก.ย. 2569 เวลา 18:50 น.
  const formatThaiDateTime = (d: Date) => {
    const thaiMonths = [
      'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
      'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.',
    ];
    const day = d.getDate();
    const month = thaiMonths[d.getMonth()];
    const year = d.getFullYear() + 543;
    const hours = String(d.getHours()).padStart(2, '0');
    const mins = String(d.getMinutes()).padStart(2, '0');
    return `${day} ${month} ${year} เวลา ${hours}:${mins} น.`;
  };

  const sources = [
    {
      category: 'ระดับน้ำและปริมาณน้ำในเขื่อน',
      icon: <Database className="w-5 h-5 text-[#0075de]" />,
      provider: 'คลังข้อมูลน้ำแห่งชาติ (ThaiWater) สถาบันสารสนเทศทรัพยากรน้ำ (องค์การมหาชน)',
      syncInfo: `ดึงผ่าน API ของ สสน. ปรับปรุงทุก 10 นาที ข้อมูลล่าสุด ณ ${formatThaiDateTime(updatedAt)}`,
      license: 'สัญญาอนุญาตการใช้ข้อมูลเปิดภาครัฐ (Open Government Data License)',
      url: 'https://www.thaiwater.net',
      badge: 'API สสน. สดทุก 10 นาที',
      badgeColor: 'bg-[#1aae39]/10 text-[#1aae39] border-[#1aae39]/30',
      description: 'รวบรวมข้อมูลโทรมาตรระดับน้ำ ปริมาณน้ำฝนสะสม และสถานะอ่างเก็บน้ำขนาดใหญ่จากหน่วยงานหลัก 40 แห่ง (กรมชลประทาน, กฟผ., ปภ., กรมอุตุนิยมวิทยา)',
    },
    {
      category: 'โครงข่ายลำน้ำและทิศทางการไหล',
      icon: <Layers className="w-5 h-5 text-[#0075de]" />,
      provider: 'HydroRIVERS (Lehner & Grill 2013), WWF HydroSHEDS',
      syncInfo: 'Vectorized River Network & Strahler Stream Order Analysis',
      license: 'สัญญาอนุญาต HydroSHEDS (World Wildlife Fund - WWF)',
      url: 'https://www.hydrosheds.org/page/hydrorivers',
      badge: 'WWF HydroSHEDS',
      badgeColor: 'bg-[#0075de]/10 text-[#0075de] dark:text-[#62aef0] border-[#0075de]/30',
      description: 'โครงข่ายลำน้ำแบบเวกเตอร์ทั่วโลก แสดงลำดับความสำคัญของแม่น้ำ (Strahler order), พื้นที่รับน้ำ (Catchment Area), และทิศทางการไหลของมวลน้ำสู่ปากอ่าว',
    },
    {
      category: 'แนวแม่น้ำสายหลัก คลอง ชื่อ อ่างเก็บน้ำ และเขตอำเภอ',
      icon: <Compass className="w-5 h-5 text-[#2a9d99]" />,
      provider: '© ผู้ร่วมพัฒนา OpenStreetMap (OpenStreetMap Contributors)',
      syncInfo: 'แนวคลองส่งน้ำชลประทาน ประตูระบายน้ำ และเขตการปกครองระดับอำเภอ',
      license: 'สัญญาอนุญาต Open Data Commons Open Database License (ODbL)',
      url: 'https://www.openstreetmap.org/copyright',
      badge: 'ODbL License',
      badgeColor: 'bg-[#2a9d99]/10 text-[#2a9d99] border-[#2a9d99]/30',
      description: 'ข้อมูลเส้นทางแม่น้ำสายรอง คลองระบายน้ำ ประตูน้ำ ชุมชนริมน้ำ และขอบเขตอำเภอทั่วราชอาณาจักรไทย',
    },
    {
      category: 'ขอบเขตประเทศ จังหวัด และเมือง',
      icon: <ShieldCheck className="w-5 h-5 text-[#9065b0]" />,
      provider: 'Natural Earth (สาธารณสมบัติ)',
      syncInfo: 'Vector Boundaries 1:10m Scale Admin-0 & Admin-1',
      license: 'สาธารณสมบัติ (Public Domain)',
      url: 'https://www.naturalearthdata.com/',
      badge: 'Public Domain',
      badgeColor: 'bg-[#9065b0]/10 text-[#9065b0] border-[#9065b0]/30',
      description: 'ขอบเขตทางภูมิศาสตร์ รอยต่อจังหวัด ชายแดนประเทศ และจุดพิกัดเมืองสำคัญ',
    },
    {
      category: 'ความสูงภูมิประเทศ',
      icon: <Mountain className="w-5 h-5 text-[#dd5b00]" />,
      provider: 'AWS Terrain Tiles (Mapzen) (SRTM และแหล่งข้อมูลความสูงอื่น)',
      syncInfo: 'Shuttle Radar Topography Mission (SRTM) & Global Digital Elevation Model',
      license: 'Mapzen Attribution & Open Data',
      url: 'https://registry.opendata.aws/terrain-tiles/',
      badge: 'SRTM Elevation',
      badgeColor: 'bg-[#dd5b00]/10 text-[#dd5b00] border-[#dd5b00]/30',
      description: 'ระดับความสูงภูมิประเทศเหนือระดับน้ำทะเลปานกลาง (ม.รทก. / m MSL) ใช้ประเมินความลาดชันและทิศทางการหลากของน้ำ',
    },
    {
      category: 'ความจุ ความสูง และปีที่แล้วเสร็จของเขื่อน',
      icon: <BookOpen className="w-5 h-5 text-[#0075de]" />,
      provider: 'Wikipedia / Wikidata',
      syncInfo: 'Dam Crest Elevation, Height, Length, Impounded Rivers, Completed Year & Structural Types',
      license: 'สัญญาอนุญาตครีเอทีฟคอมมอนส์ (CC BY-SA 4.0 / CC0)',
      url: 'https://www.wikidata.org/',
      badge: 'CC BY-SA / CC0',
      badgeColor: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700',
      description: 'ข้อมูลจำเพาะเชิงโครงสร้างทางวิศวกรรมของเขื่อนสำคัญ 35 แห่งในไทย: ความสูงสันเขื่อน, ความยาวสันเขื่อน, ชนิดโครงสร้าง, กำลังผลิตไฟฟ้า และแม่น้ำที่สร้างกั้น',
    },
  ];

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col bg-white dark:bg-[#1e1e1e] rounded-2xl border border-[#e6e6e6] dark:border-[#2f2f2f] shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[#e6e6e6] dark:border-[#2f2f2f] flex items-center justify-between bg-[#f6f5f4] dark:bg-[#252525] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0075de] text-white flex items-center justify-center font-bold text-sm shadow-xs">
              🌊
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[#000000] dark:text-[#ffffff] flex items-center gap-2">
                <span>ที่มาของข้อมูลและลิขสิทธิ์</span>
                <span className="text-[11px] font-normal text-[#615d59] dark:text-[#9b9a97] hidden sm:inline">
                  (Data Sources & Attribution)
                </span>
              </h2>
              <p className="text-[11px] text-[#615d59] dark:text-[#9b9a97]">
                ระบบติดตามสถานการณ์น้ำ อ้างอิงมาตรฐานเปิดตามหลักสากล
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#615d59] hover:text-[#000000] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition cursor-pointer"
            title="ปิดหน้าต่าง"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Status Banner */}
        <div className="px-5 py-2.5 bg-[#0075de]/10 dark:bg-[#0075de]/20 border-b border-[#0075de]/20 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-[#0075de] dark:text-[#62aef0]">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#1aae39]" />
            <span className="font-semibold">สถานะการเชื่อมต่อ:</span>
            <span>API คลังข้อมูลน้ำแห่งชาติ สสน. ทำงานปกติ</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#615d59] dark:text-[#9b9a97] text-[11px] font-mono-num">
            <Clock className="w-3.5 h-3.5" />
            <span>ปรับปรุงทุก 10 นาที (ล่าสุด {formatThaiDateTime(updatedAt)})</span>
          </div>
        </div>

        {/* Content list */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          <div className="grid grid-cols-1 gap-3.5">
            {sources.map((src, index) => (
              <div
                key={index}
                className="p-4 rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] bg-[#fbfbfa] dark:bg-[#232323] hover:border-[#0075de]/40 transition-all flex flex-col gap-2"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-white dark:bg-[#2c2c2c] border border-[#e6e6e6] dark:border-[#383838] shrink-0">
                      {src.icon}
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-[#000000] dark:text-[#ffffff]">
                        {src.category}
                      </h3>
                      <div className="text-xs font-semibold text-[#0075de] dark:text-[#62aef0]">
                        {src.provider}
                      </div>
                    </div>
                  </div>

                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${src.badgeColor}`}>
                    {src.badge}
                  </span>
                </div>

                <div className="text-xs text-[#31302e] dark:text-[#d4d4d4] font-medium pl-10">
                  {src.syncInfo}
                </div>

                <p className="text-[11px] text-[#615d59] dark:text-[#9b9a97] leading-relaxed pl-10">
                  {src.description}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#e6e6e6] dark:border-[#2f2f2f] pl-10 text-[11px]">
                  <span className="text-[#615d59] dark:text-[#9b9a97]">
                    <b>ลิขสิทธิ์:</b> {src.license}
                  </span>

                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0075de] dark:text-[#62aef0] font-medium hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>แหล่งอ้างอิง</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#232323] border border-slate-200 dark:border-[#2f2f2f] text-xs text-[#615d59] dark:text-[#9b9a97] leading-relaxed">
            💡 <b>การนำไปใช้ประโยชน์:</b> ข้อมูลในระบบนี้รวบรวมจากแหล่งข้อมูลเปิดของหน่วยงานภาครัฐและโครงการระดับสากล เพื่อวัตถุประสงค์ในการเฝ้าระวัง แจ้งเตือนภัยล่วงหน้า และลดความสูญเสียจากอุทกภัยแก่ประชาชน ชุมชน และเกษตรกรชาวไทยโดยไม่คิดค่าบริการ
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#e6e6e6] dark:border-[#2f2f2f] flex items-center justify-between bg-[#f6f5f4] dark:bg-[#252525] shrink-0 text-xs">
          <div className="text-[11px] text-[#615d59] dark:text-[#9b9a97]">
            ระบบรวบรวมและวิเคราะห์ข้อมูลเพื่อสาธารณประโยชน์
          </div>
          <button
            onClick={onClose}
            className="py-1.5 px-4 rounded-lg bg-[#0075de] hover:bg-[#005bab] text-white font-medium transition cursor-pointer"
          >
            ปิดหน้าต่าง
          </button>
        </div>

      </div>
    </div>
  );
};
