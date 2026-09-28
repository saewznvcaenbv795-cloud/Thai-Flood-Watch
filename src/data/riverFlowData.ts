export interface RiverCheckpoint {
  id: string;
  name: string;
  stationCode?: string; // e.g. "C.2", "C.13", "C.35", "M.7"
  province: string;
  amphoe: string;
  lat: number;
  lng: number;
  stageType: 'origin' | 'checkpoint' | 'dam' | 'junction' | 'outflow';
  stageOrder: number; // 1, 2, 3...
  distanceFromPrevKm: number; // km from previous checkpoint
  travelTimeHours: string; // e.g. "12-16 ชม."
  criticalBankLevelMsl?: number; // ระดับตลิ่งวิกฤต ม.รทก.
  warningDischargeM3s?: number; // อัตราการไหลเฝ้าระวัง ลบ.ม./วินาที
  maxSafeDischargeM3s?: number; // อัตราการไหลสูงสุดที่ลำน้ำรับได้ ลบ.ม./วินาที
  description: string;
  impactZone: string; // ชุมชนเสี่ยงภัยท้ายน้ำ
}

export interface RiverBasinPath {
  id: string;
  name: string;
  thaiName: string;
  description: string;
  totalLengthKm: number;
  color: string;
  coordinates: [number, number][]; // Polyline coords for Leaflet [lat, lng]
  checkpoints: RiverCheckpoint[];
  keyRisks: string[];
}

export const RIVER_BASIN_PATHS: RiverBasinPath[] = [
  {
    id: 'chaophraya',
    name: 'Chao Phraya Mainstem',
    thaiName: 'ลุ่มน้ำเจ้าพระยา (สายนครสวรรค์ - กรุงเทพฯ - อ่าวไทย)',
    description: 'เส้นทางระบายมวลน้ำหลักของประเทศไทย รวมน้ำจากปิง วัง ยม น่าน ผ่านเขื่อนเจ้าพระยา สู่ทุ่งรับน้ำ อยุธยา ปทุมธานี นนทบุรี และกรุงเทพมหานคร ก่อนออกสู่อ่าวไทย',
    totalLengthKm: 372,
    color: '#0075de',
    coordinates: [
      [15.700, 100.138], // ปากน้ำโพ นครสวรรค์
      [15.670, 100.125], // C.2 นครสวรรค์
      [15.420, 100.150], // พยุหะคีรี
      [15.280, 100.140], // มโนรมย์ ชัยนาท
      [15.158, 100.183], // C.13 เขื่อนเจ้าพระยา
      [15.010, 100.320], // สรรพยา
      [14.980, 100.390], // อินทร์บุรี
      [14.890, 100.400], // C.3 เมืองสิงห์บุรี
      [14.750, 100.410], // พรหมบุรี
      [14.650, 100.430], // ไชโย อ่างทอง
      [14.588, 100.455], // C.7A เมืองอ่างทอง
      [14.470, 100.490], // ป่าโมก
      [14.360, 100.560], // พระนครศรีอยุธยา (เกาะเมือง)
      [14.280, 100.540], // บางปะอิน
      [14.167, 100.518], // C.35 บางไทร อยุธยา
      [14.070, 100.530], // เชียงราก / สามโคก
      [14.020, 100.530], // เมืองปทุมธานี
      [13.910, 100.490], // ปากเกร็ด นนทบุรี
      [13.859, 100.485], // ท่าน้ำนนทบุรี
      [13.780, 100.500], // สะพานพระราม 7
      [13.738, 100.499], // C.29 สะพานพุทธยอดฟ้า กทม.
      [13.680, 100.520], // คลองเตย / ยานนาวา
      [13.630, 100.560], // พระประแดง สมุทรปราการ
      [13.590, 100.595], // เมืองสมุทรปราการ (ปากอ่าว)
      [13.530, 100.600], // อ่าวไทย
    ],
    checkpoints: [
      {
        id: 'cp-c2',
        name: 'สถานี C.2 ปากน้ำโพ',
        stationCode: 'C.2',
        province: 'นครสวรรค์',
        amphoe: 'เมืองนครสวรรค์',
        lat: 15.670,
        lng: 100.125,
        stageType: 'junction',
        stageOrder: 1,
        distanceFromPrevKm: 0,
        travelTimeHours: 'จุดเริ่มต้นรวมน้ำ',
        criticalBankLevelMsl: 26.20,
        warningDischargeM3s: 2000,
        maxSafeDischargeM3s: 3590,
        description: 'จุดรวมน้ำหลัก 4 สาย (ปิง วัง ยม น่าน) รวมเป็นแม่น้ำเจ้าพระยา วัดปริมาณน้ำหลากก่อนเข้าสู่ภาคกลางตอนล่าง',
        impactZone: 'ชุมชนริมน้ำปากน้ำโพ, ตลาดเก้าเลี้ยว, เกาะยม'
      },
      {
        id: 'cp-c13',
        name: 'สถานี C.13 เขื่อนเจ้าพระยา',
        stationCode: 'C.13',
        province: 'ชัยนาท',
        amphoe: 'สรรพยา',
        lat: 15.158,
        lng: 100.183,
        stageType: 'dam',
        stageOrder: 2,
        distanceFromPrevKm: 60,
        travelTimeHours: '12 - 16 ชม.',
        criticalBankLevelMsl: 16.50,
        warningDischargeM3s: 2000,
        maxSafeDischargeM3s: 2700,
        description: 'หัวใจการบริหารจัดการน้ำลุ่มเจ้าพระยา ตัดยอดน้ำเข้าคลองฝั่งตะวันตกและตะวันออก และปล่อยน้ำลงสู่แม่น้ำเจ้าพระยาท้ายเขื่อน',
        impactZone: 'พื้นที่ลุ่มต่ำท้ายเขื่อน: อ.สรรพยา จ.ชัยนาท'
      },
      {
        id: 'cp-c3',
        name: 'สถานี C.3 สิงห์บุรี',
        stationCode: 'C.3',
        province: 'สิงห์บุรี',
        amphoe: 'เมืองสิงห์บุรี',
        lat: 14.890,
        lng: 100.400,
        stageType: 'checkpoint',
        stageOrder: 3,
        distanceFromPrevKm: 42,
        travelTimeHours: '8 - 12 ชม.',
        criticalBankLevelMsl: 11.70,
        warningDischargeM3s: 1800,
        maxSafeDischargeM3s: 2340,
        description: 'จุดเฝ้าระวังน้ำเอ่อล้นตลิ่งชุมชนริมแม่น้ำเจ้าพระยาและพื้นที่เกษตรกรรม จ.สิงห์บุรี',
        impactZone: 'อ.อินทร์บุรี (ต.น้ำตาล ต.ประศุก), อ.เมืองสิงห์บุรี, อ.พรหมบุรี'
      },
      {
        id: 'cp-c7a',
        name: 'สถานี C.7A อ่างทอง',
        stationCode: 'C.7A',
        province: 'อ่างทอง',
        amphoe: 'เมืองอ่างทอง',
        lat: 14.588,
        lng: 100.455,
        stageType: 'checkpoint',
        stageOrder: 4,
        distanceFromPrevKm: 35,
        travelTimeHours: '6 - 9 ชม.',
        criticalBankLevelMsl: 9.32,
        warningDischargeM3s: 1600,
        maxSafeDischargeM3s: 2690,
        description: 'พื้นที่เสี่ยงน้ำท่วมซ้ำซากระดับตลิ่งต่ำ หากระบายเกิน 1,800 ลบ.ม./วินาที น้ำจะเริ่มเอ่อล้นแนวคันกั้นน้ำดิน',
        impactZone: 'ต.โผงเผง อ.ป่าโมก, ชุมชนคลองโผงเผง, ต.จรเข้ร้อง อ.ไชโย'
      },
      {
        id: 'cp-c35',
        name: 'สถานี C.35 บางไทร (จุดวัดก่อนเข้า กทม.)',
        stationCode: 'C.35',
        province: 'พระนครศรีอยุธยา',
        amphoe: 'บางไทร',
        lat: 14.167,
        lng: 100.518,
        stageType: 'junction',
        stageOrder: 5,
        distanceFromPrevKm: 48,
        travelTimeHours: '10 - 14 ชม.',
        criticalBankLevelMsl: 3.40,
        warningDischargeM3s: 2500,
        maxSafeDischargeM3s: 3500,
        description: 'จุดรวมน้ำเจ้าพระยาและแม่น้ำป่าสัก เป็นสถานีชี้ชะตาน้ำหลากเข้าสู่กรุงเทพฯ และปริมณฑล เกณฑ์ปลอดภัยของ กทม. คืออัตราไหลผ่านไม่เกิน 2,500-3,000 ลบ.ม./วินาที',
        impactZone: 'เกาะเรียน, บางบาล, เสนา (คลองโผงเผง-คลองบางบาล), อ.บางไทร'
      },
      {
        id: 'cp-pathum',
        name: 'สถานี ปทุมธานี (สามโคก)',
        stationCode: 'C.53',
        province: 'ปทุมธานี',
        amphoe: 'สามโคก',
        lat: 14.070,
        lng: 100.530,
        stageType: 'checkpoint',
        stageOrder: 6,
        distanceFromPrevKm: 22,
        travelTimeHours: '4 - 6 ชม.',
        criticalBankLevelMsl: 2.80,
        warningDischargeM3s: 2600,
        maxSafeDischargeM3s: 3300,
        description: 'ประตูหน้าน้ำสู่นนทบุรีและกรุงเทพฯ ชุมชนริมแม่น้ำนอกแนวคันกั้นน้ำเริ่มได้รับผลกระทบน้ำขึ้นสูงตามจังหวะน้ำทะเลหนุน',
        impactZone: 'ต.กระแชง อ.สามโคก, ต.บ้านกระแชง, ชุมชนริมแม่น้ำเมืองปทุมธานี'
      },
      {
        id: 'cp-nonthaburi',
        name: 'สถานี ท่าน้ำนนทบุรี',
        stationCode: 'C.22A',
        province: 'นนทบุรี',
        amphoe: 'เมืองนนทบุรี',
        lat: 13.859,
        lng: 100.485,
        stageType: 'checkpoint',
        stageOrder: 7,
        distanceFromPrevKm: 25,
        travelTimeHours: '4 - 5 ชม.',
        criticalBankLevelMsl: 2.20,
        warningDischargeM3s: 2800,
        maxSafeDischargeM3s: 3500,
        description: 'จุดตรวจวัดน้ำก่อนเข้าเขต กทม. ตอนบน น้ำหนุนสูงจะดันเข้ามาถึงจุดนี้อย่างชัดเจน',
        impactZone: 'ท่าน้ำนนท์, ชุมชนตลาดขวัญ, บางกรวย, วัดเขมาภิรตาราม'
      },
      {
        id: 'cp-c29',
        name: 'สถานี C.29 สะพานพุทธยอดฟ้า (กทม.)',
        stationCode: 'C.29',
        province: 'กรุงเทพมหานคร',
        amphoe: 'พระนคร',
        lat: 13.738,
        lng: 100.499,
        stageType: 'checkpoint',
        stageOrder: 8,
        distanceFromPrevKm: 18,
        travelTimeHours: '3 - 4 ชม.',
        criticalBankLevelMsl: 2.50,
        warningDischargeM3s: 2800,
        maxSafeDischargeM3s: 3600,
        description: 'สถานีศูนย์กลางวัดระดับน้ำ กทม. คันกั้นน้ำพระราชดำริสูง 2.80 - 3.00 ม.รทก. มีระบบประตูระบายน้ำและสถานีสูบน้ำคลองผันน้ำ',
        impactZone: 'ชุมชนนอกคันกั้นน้ำ กทม. (ซังฮี้, เทเวศร์, ท่าเตียน, กุฎีจีน)'
      },
      {
        id: 'cp-gulf',
        name: 'สถานี ปากน้ำสมุทรปราการ (อ่าวไทย)',
        stationCode: 'C.29A',
        province: 'สมุทรปราการ',
        amphoe: 'เมืองสมุทรปราการ',
        lat: 13.590,
        lng: 100.595,
        stageType: 'outflow',
        stageOrder: 9,
        distanceFromPrevKm: 28,
        travelTimeHours: '4 - 6 ชม.',
        criticalBankLevelMsl: 2.40,
        warningDischargeM3s: 3000,
        maxSafeDischargeM3s: 4500,
        description: 'ปากแม่น้ำเจ้าพระยาออกสู่อ่าวไทย ขึ้นอยู่กับตารางน้ำขึ้น-น้ำลงของกรมอุทกศาสตร์ กองทัพเรือ ประตูป้องกันน้ำเค็มและคลองลัดโพธิ์',
        impactZone: 'ป้อมพระจุลจอมเกล้า, ปากน้ำสมุทรปราการ, พระประแดง'
      }
    ],
    keyRisks: [
      'หาก C.2 นครสวรรค์ เกิน 2,500 ลบ.ม./วินาที เขื่อนเจ้าพระยาจำเป็นต้องปรับระบายเกิน 2,000 ลบ.ม./วินาที',
      'ท้ายเขื่อนเจ้าพระยา: สิงห์บุรี, อ่างทอง, อยุธยา จะได้รับผลกระทบน้ำท่วมล้นตลิ่งก่อนใน 24-48 ชั่วโมง',
      'หากน้ำเหนือไหลมาบรรจบกับช่วง น้ำทะเลหนุนสูง (King Tide) ในอ่าวไทย จะทำให้ระดับน้ำ กทม. ยกตัวสูงขึ้นฉับพลัน 0.4 - 0.7 เมตร'
    ]
  },
  {
    id: 'chimun',
    name: 'Chi-Mun Basin',
    thaiName: 'ลุ่มน้ำชี - มูล (ภาคอีสานสู่แม่น้ำโขง อุบลราชธานี)',
    description: 'เส้นทางน้ำสายเลือดหลักของภาคอีสาน รวมแม่น้ำชี (ชัยภูมิ-ขอนแก่น-ร้อยเอ็ด-ยโสธร) และแม่น้ำมูล (โคราช-บุรีรัมย์-สุรินทร์-ศรีสะเกษ) มาบรรจบกันที่ จ.อุบลราชธานี ก่อนไหลลงแม่น้ำโขงที่ อ.โขงเจียม',
    totalLengthKm: 750,
    color: '#dd5b00',
    coordinates: [
      [15.800, 102.000], // ชัยภูมิ
      [16.200, 102.800], // ขอนแก่น
      [16.180, 103.300], // มหาสารคาม
      [16.050, 103.650], // ร้อยเอ็ด
      [15.790, 104.140], // ยโสธร
      [15.228, 104.858], // M.7 อุบลราชธานี
      [15.319, 105.500], // อ.โขงเจียม (แม่น้ำโขง)
    ],
    checkpoints: [
      {
        id: 'cm-chaiyaphum',
        name: 'ต้นน้ำแม่น้ำชี (ชัยภูมิ)',
        province: 'ชัยภูมิ',
        amphoe: 'เมืองชัยภูมิ',
        lat: 15.800,
        lng: 102.000,
        stageType: 'origin',
        stageOrder: 1,
        distanceFromPrevKm: 0,
        travelTimeHours: 'ต้นน้ำชี',
        criticalBankLevelMsl: 185.0,
        description: 'พื้นที่รับน้ำจากเทือกเขาพญาฝ่อและเทือกเขาพังเหย หลากเข้าเขตเทศบาลเมืองชัยภูมิ',
        impactZone: 'อ.หนองบัวระเหว, อ.บ้านเขว้า, อ.เมืองชัยภูมิ'
      },
      {
        id: 'cm-khonkaen',
        name: 'สถานีชีตอนกลาง (ขอนแก่น/เขื่อนอุบลรัตน์)',
        province: 'ขอนแก่น',
        amphoe: 'เมืองขอนแก่น',
        lat: 16.200,
        lng: 102.800,
        stageType: 'checkpoint',
        stageOrder: 2,
        distanceFromPrevKm: 120,
        travelTimeHours: '24 - 36 ชม.',
        criticalBankLevelMsl: 152.0,
        description: 'จุดระบายน้ำจากเขื่อนอุบลรัตน์ลงลำน้ำพอง มาบรรจบแม่น้ำชี',
        impactZone: 'อ.ชนบท, อ.มัญจาคีรี, อ.เมืองขอนแก่น'
      },
      {
        id: 'cm-yasothon',
        name: 'สถานี ยโสธร (ชีตอนล่าง)',
        province: 'ยโสธร',
        amphoe: 'เมืองยโสธร',
        lat: 15.790,
        lng: 104.140,
        stageType: 'checkpoint',
        stageOrder: 3,
        distanceFromPrevKm: 160,
        travelTimeHours: '36 - 48 ชม.',
        criticalBankLevelMsl: 123.5,
        description: 'จุดคอขวดของแม่น้ำชีตอนล่างก่อนไหลเข้าเขตอุบลราชธานี มักเกิดน้ำท่วมขังทุ่งกุลาร้องไห้',
        impactZone: 'อ.มหาชนะชัย, อ.ค้อวัง, อ.เมืองยโสธร'
      },
      {
        id: 'cm-m7',
        name: 'สถานี M.7 สะพานเสรีประชาธิปไตย (อุบลฯ)',
        stationCode: 'M.7',
        province: 'อุบลราชธานี',
        amphoe: 'เมืองอุบลราชธานี',
        lat: 15.228,
        lng: 104.858,
        stageType: 'junction',
        stageOrder: 4,
        distanceFromPrevKm: 95,
        travelTimeHours: '24 - 30 ชม.',
        criticalBankLevelMsl: 112.0,
        warningDischargeM3s: 2300,
        maxSafeDischargeM3s: 3500,
        description: 'จุดวัดระดับน้ำวิกฤตของภาคอีสาน เป็นจุดที่แม่น้ำชีและแม่น้ำมูลไหลมาบรรจบกันเต็มกำลัง',
        impactZone: 'เทศบาลเมืองวารินชำราบ, ตลาดสดวาริน, ชุมชนท่ากอไผ่, อ.เมืองอุบลฯ'
      },
      {
        id: 'cm-mekong',
        name: 'สถานี ปากมูล อ.โขงเจียม (ไหลลงแม่น้ำโขง)',
        province: 'อุบลราชธานี',
        amphoe: 'โขงเจียม',
        lat: 15.319,
        lng: 105.500,
        stageType: 'outflow',
        stageOrder: 5,
        distanceFromPrevKm: 85,
        travelTimeHours: '18 - 24 ชม.',
        criticalBankLevelMsl: 98.0,
        description: 'จุดบรรจบแม่น้ำมูลกับแม่น้ำโขง (แม่น้ำสองสี) หากแม่น้ำโขงหนุนสูงจะทำให้การระบายน้ำอุบลฯ ชะงักและท่วมขังยาวนาน',
        impactZone: 'แก่งสะพือ พิบูลมังสาหาร, อ.โขงเจียม'
      }
    ],
    keyRisks: [
      'หากน้ำในแม่น้ำโขงสูงกว่าระดับปากแม่น้ำมูล จะเกิดปรากฏการณ์น้ำโขงดันกลับ (Backwater Effect)',
      'สถานี M.7 วารินชำราบ หากระดับน้ำเกิน 112.0 ม.รทก. น้ำจะเริ่มท่วมทะลักเข้าเขตเศรษฐกิจ อ.วารินชำราบ ทันที'
    ]
  },
  {
    id: 'pasak',
    name: 'Pasak River Basin',
    thaiName: 'ลุ่มน้ำป่าสัก (เพชรบูรณ์ - เขื่อนป่าสักชลสิทธิ์ - อยุธยา)',
    description: 'ลำน้ำป่าสักมีความลาดชันสูง ไหลเร็วจากเพชรบูรณ์ ลงเขื่อนป่าสักชลสิทธิ์ และระบายผ่านเขื่อนพระรามหก สู่แม่น้ำเจ้าพระยาที่เกาะเมืองอยุธยา',
    totalLengthKm: 513,
    color: '#2a9d99',
    coordinates: [
      [16.770, 101.240], // หล่มสัก เพชรบูรณ์
      [16.420, 101.160], // เมืองเพชรบูรณ์
      [15.350, 101.070], // ลพบุรี / ชัยบาดาล
      [14.860, 101.100], // เขื่อนป่าสักชลสิทธิ์
      [14.620, 100.740], // ท่าหลวง / เขื่อนพระรามหก สระบุรี
      [14.360, 100.580], // อยุธยา (บรรจบเจ้าพระยา)
    ],
    checkpoints: [
      {
        id: 'ps-lomsak',
        name: 'สถานี หล่มสัก เพชรบูรณ์',
        province: 'เพชรบูรณ์',
        amphoe: 'หล่มสัก',
        lat: 16.770,
        lng: 101.240,
        stageType: 'origin',
        stageOrder: 1,
        distanceFromPrevKm: 0,
        travelTimeHours: 'ต้นน้ำป่าสัก',
        criticalBankLevelMsl: 135.0,
        description: 'พื้นที่เสี่ยงน้ำป่าไหลหลากฉับพลันจากเทือกเขาเพชรบูรณ์เข้าท่วมตัวเมืองหล่มสัก',
        impactZone: 'ชุมชนตลาดตาลเดี่ยว, เทศบาลเมืองหล่มสัก'
      },
      {
        id: 'ps-dam',
        name: 'เขื่อนป่าสักชลสิทธิ์ (ลพบุรี)',
        province: 'ลพบุรี',
        amphoe: 'พัฒนานิคม',
        lat: 14.860,
        lng: 101.100,
        stageType: 'dam',
        stageOrder: 2,
        distanceFromPrevKm: 210,
        travelTimeHours: '36 - 48 ชม.',
        criticalBankLevelMsl: 43.0,
        warningDischargeM3s: 400,
        maxSafeDischargeM3s: 800,
        description: 'เขื่อนกักเก็บน้ำหลักความจุ 960 ล้าน ลบ.ม. หากเกิน 80% ต้องเร่งระบายลงท้ายเขื่อนสู่สระบุรีและอยุธยา',
        impactZone: 'อ.พัฒนานิคม, อ.ชัยบาดาล'
      },
      {
        id: 'ps-saraburi',
        name: 'เขื่อนพระรามหก / อ.ท่าเรือ',
        province: 'พระนครศรีอยุธยา',
        amphoe: 'ท่าเรือ',
        lat: 14.620,
        lng: 100.740,
        stageType: 'checkpoint',
        stageOrder: 3,
        distanceFromPrevKm: 45,
        travelTimeHours: '12 - 16 ชม.',
        criticalBankLevelMsl: 9.5,
        warningDischargeM3s: 450,
        maxSafeDischargeM3s: 700,
        description: 'จุดระบายน้ำป่าสักก่อนบรรจบเจ้าพระยา',
        impactZone: 'อ.เสาไห้ สระบุรี, อ.ท่าเรือ, อ.นครหลวง อยุธยา'
      },
      {
        id: 'ps-ayutthaya',
        name: 'จุดสบแม่น้ำเจ้าพระยา (เกาะเมืองอยุธยา)',
        province: 'พระนครศรีอยุธยา',
        amphoe: 'พระนครศรีอยุธยา',
        lat: 14.360,
        lng: 100.580,
        stageType: 'junction',
        stageOrder: 4,
        distanceFromPrevKm: 32,
        travelTimeHours: '6 - 8 ชม.',
        criticalBankLevelMsl: 4.8,
        description: 'จุดที่แม่น้ำป่าสักรวมเข้ากับแม่น้ำเจ้าพระยา ไหลรวมกันมุ่งหน้าสู่สถานี C.35 บางไทร',
        impactZone: 'โบราณสถานวัดไชยวัฒนาราม, ชุมชนหัวแหลม, เกาะเมืองอยุธยา'
      }
    ],
    keyRisks: [
      'หากเขื่อนป่าสักชลสิทธิ์ระบายเกิน 500 ลบ.ม./วินาที อ.ท่าเรือ และ อ.นครหลวง จะถูกน้ำท่วมตลิ่ง',
      'น้ำป่าสักจะไปรวมกับน้ำเจ้าพระยาที่อยุธยา ทำให้แรงดันน้ำมุ่งสู่ปทุมธานีและ กทม. เพิ่มขึ้นเท่าตัว'
    ]
  },
  {
    id: 'thachin',
    name: 'Tha Chin River Basin',
    thaiName: 'ลุ่มน้ำท่าจีน (ชัยนาท - สุพรรณบุรี - นครปฐม - สมุทรสาคร)',
    description: 'ทางระบายน้ำฝั่งตะวันตก ผันน้ำจากแม่น้ำเจ้าพระยาที่ปากคลองมะขามเฒ่า ผ่านสุพรรณบุรี นครปฐม และออกสู่อ่าวไทยที่ จ.สมุทรสาคร',
    totalLengthKm: 325,
    color: '#62aef0',
    coordinates: [
      [15.160, 100.080], // วัดสิงห์ ชัยนาท
      [14.980, 100.120], // เดิมบางนางบวช
      [14.750, 100.100], // สามชุก
      [14.470, 100.120], // เมืองสุพรรณบุรี
      [14.150, 100.180], // บางปลาม้า / สองพี่น้อง
      [13.820, 100.220], // นครชัยศรี นครปฐม
      [13.540, 100.270], // เมืองสมุทรสาคร (ออกอ่าวไทย)
    ],
    checkpoints: [
      {
        id: 'tc-chainat',
        name: 'ประตูน้ำพลเทพ (ชัยนาท)',
        province: 'ชัยนาท',
        amphoe: 'วัดสิงห์',
        lat: 15.160,
        lng: 100.080,
        stageType: 'origin',
        stageOrder: 1,
        distanceFromPrevKm: 0,
        travelTimeHours: 'จุดรับน้ำจากเจ้าพระยา',
        description: 'ผันน้ำจากเหนือเขื่อนเจ้าพระยาเข้าสู่แม่น้ำท่าจีนเพื่อบรรเทาปริมาณน้ำหลาก',
        impactZone: 'อ.วัดสิงห์'
      },
      {
        id: 'tc-suphanburi',
        name: 'สถานี T.1 เมืองสุพรรณบุรี',
        stationCode: 'T.1',
        province: 'สุพรรณบุรี',
        amphoe: 'เมืองสุพรรณบุรี',
        lat: 14.470,
        lng: 100.120,
        stageType: 'checkpoint',
        stageOrder: 2,
        distanceFromPrevKm: 90,
        travelTimeHours: '20 - 28 ชม.',
        criticalBankLevelMsl: 6.2,
        warningDischargeM3s: 300,
        description: 'จุดคอขวดแม่น้ำท่าจีนตอนกลาง มักมีน้ำเอ่อท่วมตลาดสามชุกและบางปลาม้า',
        impactZone: 'อ.บางปลาม้า, อ.สองพี่น้อง, ตลาดเก้าห้อง'
      },
      {
        id: 'tc-nakhonpathom',
        name: 'สถานี T.14 นครชัยศรี (นครปฐม)',
        stationCode: 'T.14',
        province: 'นครปฐม',
        amphoe: 'นครชัยศรี',
        lat: 13.820,
        lng: 100.220,
        stageType: 'checkpoint',
        stageOrder: 3,
        distanceFromPrevKm: 80,
        travelTimeHours: '18 - 24 ชม.',
        criticalBankLevelMsl: 2.1,
        warningDischargeM3s: 280,
        description: 'แม่น้ำท่าจีนมีความคดเคี้ยวมาก ระบายน้ำได้ช้า มักท่วมขังพื้นที่เกษตรสวนกล้วยไม้และชุมชนริมน้ำ',
        impactZone: 'อ.บางเลน, อ.นครชัยศรี, อ.สามพราน'
      },
      {
        id: 'tc-samutsakhon',
        name: 'สถานี มหาชัย (สมุทรสาคร ออกอ่าวไทย)',
        stationCode: 'T.15',
        province: 'สมุทรสาคร',
        amphoe: 'เมืองสมุทรสาคร',
        lat: 13.540,
        lng: 100.270,
        stageType: 'outflow',
        stageOrder: 4,
        distanceFromPrevKm: 35,
        travelTimeHours: '8 - 12 ชม.',
        criticalBankLevelMsl: 1.9,
        description: 'ออกสู่อ่าวไทยที่มหาชัย เจอน้ำทะเลหนุนสูงเป็นประจำ มีเรือผลักดันน้ำติดตั้งช่วงน้ำหลาก',
        impactZone: 'ตลาดมหาชัย, อ.กระทุ่มแบน, ท่าฉลอม'
      }
    ],
    keyRisks: [
      'แม่น้ำท่าจีนมีความจุต่ำ (รองรับได้เพียง 300-400 ลบ.ม./วินาที) น้ำจะเอ่อล้นเข้าท่วมทุ่งสองพี่น้องและบางเลนเป็นเวลานาน',
      'ต้องอาศัยเครื่องผลักดันน้ำของกองทัพเรือช่วยดันน้ำออกอ่าวไทยช่วงน้ำลง'
    ]
  }
];
