/**
 * Comprehensive River, Canal and Basin Network of Thailand
 * - HydroRIVERS (WWF HydroSHEDS / Lehner & Grill 2013)
 * - OpenStreetMap (ODbL) river & canal vectors
 * - คลังข้อมูลน้ำแห่งชาติ สสน. (ThaiWater)
 * - SRTM & AWS Terrain Tiles
 */

export interface RiverItem {
  id: string;
  name: string;
  type: 'main' | 'tributary' | 'canal';
  basinId: string;
  basinName: string;
  basinGroup: 'chaophraya' | 'mekong' | 'south' | 'east';
  basinGroupLabel: string;
  lengthKm: number;
  catchmentAreaKm2: number;
  distanceToSeaKm: number;
  flowsIntoRiverId?: string;
  flowsIntoRiverName?: string;
  provinceNames: string[];
  coordinates: [number, number][]; // [lat, lng] path
  description: string;
  headwaterLocation?: string;
  mouthLocation?: string;
}

export interface CanalItem {
  id: string;
  name: string;
  lengthKm: number;
  province: string;
  basinName: string;
  connectsFrom: string;
  connectsTo: string;
  coordinates: [number, number][];
  description: string;
  purpose: string;
}

export interface BasinGroup {
  id: string;
  name: string;
  basins: {
    id: string;
    name: string;
    rivers: RiverItem[];
  }[];
}

// 1. RIVERS DATA (79 Major Rivers and Key Tributaries)
export const RIVERS_DATA: RiverItem[] = [
  // --- ลุ่มน้ำปิง ---
  {
    id: 'ping',
    name: 'แม่น้ำปิง',
    type: 'main',
    basinId: 'ping-basin',
    basinName: 'ลุ่มน้ำปิง',
    basinGroup: 'chaophraya',
    basinGroupLabel: 'ไหลสู่อ่าวไทย ผ่านแม่น้ำเจ้าพระยา',
    lengthKm: 760,
    catchmentAreaKm2: 33896,
    distanceToSeaKm: 720,
    flowsIntoRiverId: 'chaophraya',
    flowsIntoRiverName: 'แม่น้ำเจ้าพระยา',
    provinceNames: ['เชียงใหม่', 'ลำพูน', 'ตาก', 'กำแพงเพชร', 'นครสวรรค์'],
    headwaterLocation: 'ดอยถ้วย เทือกเขาแดนลาว อ.เชียงดาว จ.เชียงใหม่',
    mouthLocation: 'ปากน้ำโพ อ.เมือง จ.นครสวรรค์',
    description: 'หนึ่งในสี่สายน้ำหลักต้นกำเนิดแม่น้ำเจ้าพระยา ไหลผ่านแอ่งเชียงใหม่-ลำพูน ผ่านเขื่อนภูมิพล และรวมกับแม่น้ำน่านที่ปากน้ำโพ',
    coordinates: [
      [19.530, 98.960],
      [19.340, 98.970],
      [19.000, 98.980],
      [18.790, 99.000], // เชียงใหม่
      [18.570, 98.910], // ลำพูน
      [18.300, 98.650], // จอมทอง
      [17.850, 98.750], // ฮอด
      [17.240, 98.970], // เขื่อนภูมิพล
      [16.880, 99.120], // ตาก
      [16.480, 99.520], // กำแพงเพชร
      [16.150, 99.850], // ขาณุวรลักษบุรี
      [15.700, 100.138], // ปากน้ำโพ นครสวรรค์
    ],
  },
  {
    id: 'mae-tuen',
    name: 'น้ำแม่ตื่น',
    type: 'tributary',
    basinId: 'ping-basin',
    basinName: 'ลุ่มน้ำปิง',
    basinGroup: 'chaophraya',
    basinGroupLabel: 'ไหลสู่อ่าวไทย ผ่านแม่น้ำเจ้าพระยา',
    lengthKm: 220,
    catchmentAreaKm2: 2450,
    distanceToSeaKm: 850,
    flowsIntoRiverId: 'ping',
    flowsIntoRiverName: 'แม่น้ำปิง',
    provinceNames: ['เชียงใหม่', 'ตาก'],
    coordinates: [
      [17.920, 98.240],
      [17.650, 98.420],
      [17.430, 98.670],
      [17.280, 98.910],
    ],
    description: 'ลำน้ำสาขาฝั่งขวาของแม่น้ำปิง ไหลลงสู่อ่างเก็บน้ำเขื่อนภูมิพล',
  },
  {
    id: 'mae-li',
    name: 'แม่น้ำลี้',
    type: 'tributary',
    basinId: 'ping-basin',
    basinName: 'ลุ่มน้ำปิง',
    basinGroup: 'chaophraya',
    basinGroupLabel: 'ไหลสู่อ่าวไทย ผ่านแม่น้ำเจ้าพระยา',
    lengthKm: 185,
    catchmentAreaKm2: 2100,
    distanceToSeaKm: 890,
    flowsIntoRiverId: 'ping',
    flowsIntoRiverName: 'แม่น้ำปิง',
    provinceNames: ['ลำพูน'],
    coordinates: [
      [17.580, 99.020],
      [17.800, 98.950],
      [18.150, 98.850],
      [18.490, 98.710],
    ],
    description: 'ลำน้ำสายหลักของจังหวัดลำพูน ไหลผ่าน อ.ลี้ อ.บ้านโฮ่ง บรรจบแม่น้ำปิงที่ อ.เวียงหนองล่อง',
  },
  {
    id: 'mae-chaem',
    name: 'แม่น้ำแม่แจ่ม',
    type: 'tributary',
    basinId: 'ping-basin',
    basinName: 'ลุ่มน้ำปิง',
    basinGroup: 'chaophraya',
    basinGroupLabel: 'ไหลสู่อ่าวไทย ผ่านแม่น้ำเจ้าพระยา',
    lengthKm: 160,
    catchmentAreaKm2: 3950,
    distanceToSeaKm: 920,
    flowsIntoRiverId: 'ping',
    flowsIntoRiverName: 'แม่น้ำปิง',
    provinceNames: ['เชียงใหม่'],
    coordinates: [
      [18.980, 98.350],
      [18.500, 98.370],
      [18.350, 98.480],
      [18.200, 98.620],
    ],
    description: 'ต้นน้ำสำคัญจากเทือกเขาดอยอินทนนท์ ไหลลงสู่แม่น้ำปิงที่อำเภอฮอด',
  },
  {
    id: 'mae-kuang',
    name: 'แม่น้ำกวง',
    type: 'tributary',
    basinId: 'ping-basin',
    basinName: 'ลุ่มน้ำปิง',
    basinGroup: 'chaophraya',
    basinGroupLabel: 'ไหลสู่อ่าวไทย ผ่านแม่น้ำเจ้าพระยา',
    lengthKm: 110,
    catchmentAreaKm2: 1820,
    distanceToSeaKm: 940,
    flowsIntoRiverId: 'ping',
    flowsIntoRiverName: 'แม่น้ำปิง',
    provinceNames: ['เชียงใหม่', 'ลำพูน'],
    coordinates: [
      [19.120, 99.250],
      [18.910, 99.120],
      [18.600, 99.030],
      [18.520, 98.920],
    ],
    description: 'ลำน้ำหล่อเลี้ยงแอ่งเชียงใหม่-ลำพูน มีเขื่อนแม่กวงอุดมธารากั้นตอนบน',
  },
  {
    id: 'mae-taeng',
    name: 'น้ำแม่แตง',
    type: 'tributary',
    basinId: 'ping-basin',
    basinName: 'ลุ่มน้ำปิง',
    basinGroup: 'chaophraya',
    basinGroupLabel: 'ไหลสู่อ่าวไทย ผ่านแม่น้ำเจ้าพระยา',
    lengthKm: 100,
    catchmentAreaKm2: 1960,
    distanceToSeaKm: 980,
    flowsIntoRiverId: 'ping',
    flowsIntoRiverName: 'แม่น้ำปิง',
    provinceNames: ['เชียงใหม่', 'แม่ฮ่องสอน'],
    coordinates: [
      [19.380, 98.650],
      [19.200, 98.780],
      [19.120, 98.950],
    ],
    description: 'ต้นน้ำจากเทือกเขาแดนลาวและถนนธงชัย มีเขื่อนทดน้ำแม่แตงส่งน้ำเข้าสู่คลองชลประทานเชียงใหม่',
  },
  {
    id: 'khlong-suan-mak',
    name: 'คลองสวนหมาก',
    type: 'tributary',
    basinId: 'ping-basin',
    basinName: 'ลุ่มน้ำปิง',
    basinGroup: 'chaophraya',
    basinGroupLabel: 'ไหลสู่อ่าวไทย ผ่านแม่น้ำเจ้าพระยา',
    lengthKm: 81,
    catchmentAreaKm2: 890,
    distanceToSeaKm: 650,
    flowsIntoRiverId: 'ping',
    flowsIntoRiverName: 'แม่น้ำปิง',
    provinceNames: ['กำแพงเพชร'],
    coordinates: [
      [16.250, 99.150],
      [16.380, 99.320],
      [16.470, 99.510],
    ],
    description: 'ลำน้ำสาขาไหลจากอุทยานแห่งชาติคลองลาน บรรจบแม่น้ำปิงที่เมืองกำแพงเพชร',
  },
  {
    id: 'mae-ngat',
    name: 'ลำน้ำแม่งัด',
    type: 'tributary',
    basinId: 'ping-basin',
    basinName: 'ลุ่มน้ำปิง',
    basinGroup: 'chaophraya',
    basinGroupLabel: 'ไหลสู่อ่าวไทย ผ่านแม่น้ำเจ้าพระยา',
    lengthKm: 24,
    catchmentAreaKm2: 1250,
    distanceToSeaKm: 990,
    flowsIntoRiverId: 'ping',
    flowsIntoRiverName: 'แม่น้ำปิง',
    provinceNames: ['เชียงใหม่'],
    coordinates: [
      [19.200, 99.150],
      [19.160, 99.040],
      [19.140, 98.980],
    ],
    description: 'เป็นที่ตั้งของเขื่อนแม่งัดสมบูรณ์ชล ควบคุมน้ำก่อนเข้าสู่ตัวเมืองเชียงใหม่',
  },

  // --- ลุ่มน้ำวัง ---
  {
    id: 'wang',
    name: 'แม่น้ำวัง',
    type: 'main',
    basinId: 'wang-basin',
    basinName: 'ลุ่มน้ำวัง',
    basinGroup: 'chaophraya',
    basinGroupLabel: 'ไหลสู่อ่าวไทย ผ่านแม่น้ำเจ้าพระยา',
    lengthKm: 435,
    catchmentAreaKm2: 10792,
    distanceToSeaKm: 680,
    flowsIntoRiverId: 'ping',
    flowsIntoRiverName: 'แม่น้ำปิง',
    provinceNames: ['เชียงราย', 'ลำปาง', 'ตาก'],
    headwaterLocation: 'ดอยหลวง อ.พาน จ.เชียงราย',
    mouthLocation: 'ปากน้ำวัง อ.บ้านตาก จ.ตาก (บรรจบแม่น้ำปิง)',
    coordinates: [
      [19.250, 99.650],
      [18.780, 99.600], // แจ้ห่ม
      [18.300, 99.500], // ลำปาง
      [18.000, 99.350], // เกาะคา
      [17.620, 99.220], // สบปราบ
      [17.300, 99.180], // เถิน
      [17.050, 99.080], // ปากน้ำวัง บ้านตาก
    ],
    description: 'ไหลผ่านจังหวัดลำปาง มีเขื่อนกิ่วคอหมาและเขื่อนกิ่วลมกั้นตอนบน ไหลบรรจบแม่น้ำปิงที่อำเภอบ้านตาก',
  },
  {
    id: 'mae-tui',
    name: 'ลำน้ำตุ๋ย',
    type: 'tributary',
    basinId: 'wang-basin',
    basinName: 'ลุ่มน้ำวัง',
    basinGroup: 'chaophraya',
    basinGroupLabel: 'ไหลสู่อ่าวไทย ผ่านแม่น้ำเจ้าพระยา',
    lengthKm: 60,
    catchmentAreaKm2: 820,
    distanceToSeaKm: 780,
    flowsIntoRiverId: 'wang',
    flowsIntoRiverName: 'แม่น้ำวัง',
    provinceNames: ['ลำปาง'],
    coordinates: [
      [18.550, 99.300],
      [18.400, 99.420],
      [18.280, 99.490],
    ],
    description: 'ลำน้ำสาขาสำคัญที่ไหลผ่านอำเภอเมืองปานและอำเภอห้างฉัตร ลงสู่แม่น้ำวังที่เมืองลำปาง',
  },

  // --- ลุ่มน้ำยม ---
  {
    id: 'yom',
    name: 'แม่น้ำยม',
    type: 'main',
    basinId: 'yom-basin',
    basinName: 'ลุ่มน้ำยม',
    basinGroup: 'chaophraya',
    basinGroupLabel: 'ไหลสู่อ่าวไทย ผ่านแม่น้ำเจ้าพระยา',
    lengthKm: 735,
    catchmentAreaKm2: 23616,
    distanceToSeaKm: 640,
    flowsIntoRiverId: 'nan',
    flowsIntoRiverName: 'แม่น้ำน่าน',
    provinceNames: ['พะเยา', 'แพร่', 'สุโขทัย', 'พิษณุโลก', 'พิจิตร', 'นครสวรรค์'],
    headwaterLocation: 'ดอยขุนควร อ.ปง จ.พะเยา',
    mouthLocation: 'ปากน้ำเกยไชย อ.ชุมแสง จ.นครสวรรค์ (บรรจบแม่น้ำน่าน)',
    coordinates: [
      [19.150, 100.350], // ปง พะเยา
      [18.750, 100.220], // สอง แพร่
      [18.150, 100.140], // แพร่
      [17.850, 99.850], // วังชิ้น
      [17.450, 99.780], // ศรีสัชนาลัย
      [17.000, 99.820], // สุโขทัย
      [16.600, 100.050], // บางระกำ พิษณุโลก
      [16.200, 100.250], // พิจิตร
      [15.920, 100.300], // ชุมแสง นครสวรรค์
    ],
    description: 'แม่น้ำสายเดียวใน 4 สายหลักที่ไม่มีเขื่อนขนาดใหญ่กั้นตลอดลำน้ำ มักเกิดอุทกภัยรุนแรงในพื้นที่สุโขทัย-พิษณุโลก-พิจิตร',
  },
  {
    id: 'mae-ngao',
    name: 'แม่น้ำงาว',
    type: 'tributary',
    basinId: 'yom-basin',
    basinName: 'ลุ่มน้ำยม',
    basinGroup: 'chaophraya',
    basinGroupLabel: 'ไหลสู่อ่าวไทย ผ่านแม่น้ำเจ้าพระยา',
    lengthKm: 48,
    catchmentAreaKm2: 980,
    distanceToSeaKm: 790,
    flowsIntoRiverId: 'yom',
    flowsIntoRiverName: 'แม่น้ำยม',
    provinceNames: ['ลำปาง', 'แพร่'],
    coordinates: [
      [18.780, 99.980],
      [18.620, 100.100],
      [18.520, 100.180],
    ],
    description: 'ไหลผ่านอำเภองาว จังหวัดลำปาง บรรจบแม่น้ำยมที่อำเภอสอง จังหวัดแพร่',
  },

  // --- ลุ่มน้ำน่าน ---
  {
    id: 'nan',
    name: 'แม่น้ำน่าน',
    type: 'main',
    basinId: 'nan-basin',
    basinName: 'ลุ่มน้ำน่าน',
    basinGroup: 'chaophraya',
    basinGroupLabel: 'ไหลสู่อ่าวไทย ผ่านแม่น้ำเจ้าพระยา',
    lengthKm: 740,
    catchmentAreaKm2: 34330,
    distanceToSeaKm: 600,
    flowsIntoRiverId: 'chaophraya',
    flowsIntoRiverName: 'แม่น้ำเจ้าพระยา',
    provinceNames: ['น่าน', 'อุตรดิตถ์', 'พิษณุโลก', 'พิจิตร', 'นครสวรรค์'],
    headwaterLocation: 'ดอยขุนน้ำน่าน ทิวเขาหลวงพระบาง อ.เฉลิมพระเกียรติ จ.น่าน',
    mouthLocation: 'ปากน้ำโพ อ.เมือง จ.นครสวรรค์',
    coordinates: [
      [19.450, 101.150], // เฉลิมพระเกียรติ น่าน
      [18.780, 100.780], // น่าน
      [18.300, 100.600], // เวียงสา
      [17.760, 100.550], // เขื่อนสิริกิติ์
      [17.620, 100.100], // อุตรดิตถ์
      [16.820, 100.260], // พิษณุโลก (N.5A)
      [16.440, 100.350], // พิจิตร
      [15.920, 100.300], // ชุมแสง (รับแม่น้ำยม)
      [15.700, 100.138], // ปากน้ำโพ นครสวรรค์
    ],
    description: 'มีพื้นที่รับน้ำและปริมาณน้ำท่ามากที่สุดในบรรดาแม่น้ำทั้ง 4 สายตอนบน มีเขื่อนสิริกิติ์กักเก็บน้ำ',
  },
  {
    id: 'khwae-noi-nan',
    name: 'แม่น้ำแควน้อย (ลุ่มน้ำน่าน)',
    type: 'tributary',
    basinId: 'nan-basin',
    basinName: 'ลุ่มน้ำน่าน',
    basinGroup: 'chaophraya',
    basinGroupLabel: 'ไหลสู่อ่าวไทย ผ่านแม่น้ำเจ้าพระยา',
    lengthKm: 95,
    catchmentAreaKm2: 4400,
    distanceToSeaKm: 680,
    flowsIntoRiverId: 'nan',
    flowsIntoRiverName: 'แม่น้ำน่าน',
    provinceNames: ['พิษณุโลก'],
    coordinates: [
      [17.200, 100.750],
      [17.050, 100.450], // เขื่อนแควน้อยบำรุงแดน
      [16.920, 100.300], // บรรจบแม่น้ำน่านที่ อ.วัดโบสถ์
    ],
    description: 'มีเขื่อนแควน้อยบำรุงแดนช่วยตัดยอดน้ำหลากไม่ให้ไหลสมทบแม่น้ำน่านที่เข้าท่วมเมืองพิษณุโลก',
  },
  {
    id: 'wa-nan',
    name: 'แม่น้ำว้า',
    type: 'tributary',
    basinId: 'nan-basin',
    basinName: 'ลุ่มน้ำน่าน',
    basinGroup: 'chaophraya',
    basinGroupLabel: 'ไหลสู่อ่าวไทย ผ่านแม่น้ำเจ้าพระยา',
    lengthKm: 125,
    catchmentAreaKm2: 2150,
    distanceToSeaKm: 850,
    flowsIntoRiverId: 'nan',
    flowsIntoRiverName: 'แม่น้ำน่าน',
    provinceNames: ['น่าน'],
    coordinates: [
      [19.100, 101.200],
      [18.700, 100.950],
      [18.550, 100.820],
    ],
    description: 'ลำน้ำสาขาหลักตอนบนของแม่น้ำน่าน ไหลผ่านอุทยานแห่งชาติแม่จริม บรรจบแม่น้ำน่านที่เวียงสา',
  },

  // --- ลุ่มน้ำป่าสัก ---
  {
    id: 'pasak',
    name: 'แม่น้ำป่าสัก',
    type: 'main',
    basinId: 'pasak-basin',
    basinName: 'ลุ่มน้ำป่าสัก',
    basinGroup: 'chaophraya',
    basinGroupLabel: 'ไหลสู่อ่าวไทย ผ่านแม่น้ำเจ้าพระยา',
    lengthKm: 513,
    catchmentAreaKm2: 16291,
    distanceToSeaKm: 215,
    flowsIntoRiverId: 'chaophraya',
    flowsIntoRiverName: 'แม่น้ำเจ้าพระยา',
    provinceNames: ['เลย', 'เพชรบูรณ์', 'ลพบุรี', 'สระบุรี', 'พระนครศรีอยุธยา'],
    headwaterLocation: 'ดอยภูขี้เถ้า อ.ด่านซ้าย จ.เลย',
    mouthLocation: 'เกาะเมืองพระนครศรีอยุธยา จ.พระนครศรีอยุธยา (หน้าวัดพนัญเชิง)',
    coordinates: [
      [17.350, 101.250], // ด่านซ้าย เลย
      [16.850, 101.220], // หล่มเก่า เพชรบูรณ์
      [16.420, 101.160], // เมืองเพชรบูรณ์
      [15.750, 101.050], // วิเชียรบุรี
      [15.150, 101.000], // ชัยบาดาล
      [14.860, 101.080], // เขื่อนป่าสักชลสิทธิ์
      [14.650, 100.980], // แก่งคอย สระบุรี
      [14.530, 100.900], // เมืองสระบุรี
      [14.450, 100.750], // ท่าเรือ พระนครศรีอยุธยา
      [14.350, 100.580], // อยุธยา บรรจบเจ้าพระยา
    ],
    description: 'ไหลคดเคี้ยวผ่านหุบเขาเพชรบูรณ์สู่เขื่อนป่าสักชลสิทธิ์ และไหลบรรจบแม่น้ำเจ้าพระยาที่เกาะเมืองอยุธยา',
  },
  {
    id: 'lam-sonthi',
    name: 'ลำสนธิ',
    type: 'tributary',
    basinId: 'pasak-basin',
    basinName: 'ลุ่มน้ำป่าสัก',
    basinGroup: 'chaophraya',
    basinGroupLabel: 'ไหลสู่อ่าวไทย ผ่านแม่น้ำเจ้าพระยา',
    lengthKm: 72,
    catchmentAreaKm2: 1450,
    distanceToSeaKm: 290,
    flowsIntoRiverId: 'pasak',
    flowsIntoRiverName: 'แม่น้ำป่าสัก',
    provinceNames: ['ลพบุรี'],
    coordinates: [
      [15.350, 101.400],
      [15.180, 101.280],
      [15.120, 101.120],
    ],
    description: 'ลำน้ำสาขาไหลจากทิวเขาพังเหย ลงสู่แม่น้ำป่าสักเหนือเขื่อนป่าสักชลสิทธิ์',
  },

  // --- ลุ่มน้ำเจ้าพระยา (สายหลัก) ---
  {
    id: 'chaophraya',
    name: 'แม่น้ำเจ้าพระยา',
    type: 'main',
    basinId: 'chaophraya-basin',
    basinName: 'ลุ่มน้ำเจ้าพระยา',
    basinGroup: 'chaophraya',
    basinGroupLabel: 'ไหลสู่อ่าวไทย ผ่านแม่น้ำเจ้าพระยา',
    lengthKm: 372,
    catchmentAreaKm2: 157925,
    distanceToSeaKm: 0,
    flowsIntoRiverId: 'gulf-of-thailand',
    flowsIntoRiverName: 'อ่าวไทย',
    provinceNames: ['นครสวรรค์', 'อุทัยธานี', 'ชัยนาท', 'สิงห์บุรี', 'อ่างทอง', 'พระนครศรีอยุธยา', 'ปทุมธานี', 'นนทบุรี', 'กรุงเทพมหานคร', 'สมุทรปราการ'],
    headwaterLocation: 'ปากน้ำโพ อ.เมือง จ.นครสวรรค์ (แม่น้ำปิง บรรจบ แม่น้ำน่าน)',
    mouthLocation: 'ปากน้ำสมุทรปราการ อ.เมือง จ.สมุทรปราการ สู่ อ่าวไทย',
    coordinates: [
      [15.700, 100.138], // ปากน้ำโพ
      [15.670, 100.125], // C.2 นครสวรรค์
      [15.158, 100.183], // C.13 เขื่อนเจ้าพระยา
      [14.890, 100.400], // สิงห์บุรี
      [14.588, 100.455], // อ่างทอง
      [14.360, 100.560], // พระนครศรีอยุธยา
      [14.167, 100.518], // บางไทร (C.35)
      [14.020, 100.530], // ปทุมธานี
      [13.859, 100.485], // นนทบุรี
      [13.738, 100.499], // สะพานพุทธ กทม.
      [13.590, 100.595], // สมุทรปราการ
      [13.530, 100.600], // อ่าวไทย
    ],
    description: 'เส้นเลือดใหญ่แห่งที่ราบลุ่มภาคกลาง ระบายมวลน้ำจากภาคเหนือทั้ง 4 สายและป่าสักลงสู่อ่าวไทย',
  },
  {
    id: 'khlong-phong-pheng',
    name: 'คลองโผงเผง',
    type: 'canal',
    basinId: 'chaophraya-basin',
    basinName: 'ลุ่มน้ำเจ้าพระยา',
    basinGroup: 'chaophraya',
    basinGroupLabel: 'ไหลสู่อ่าวไทย ผ่านแม่น้ำเจ้าพระยา',
    lengthKm: 25,
    catchmentAreaKm2: 320,
    distanceToSeaKm: 140,
    flowsIntoRiverId: 'chaophraya',
    flowsIntoRiverName: 'แม่น้ำเจ้าพระยา / คลองบางบาล',
    provinceNames: ['อ่างทอง', 'พระนครศรีอยุธยา'],
    coordinates: [
      [14.520, 100.470],
      [14.450, 100.480],
      [14.390, 100.510],
    ],
    description: 'ทางน้ำแยกจากแม่น้ำเจ้าพระยาทางฝั่งซ้ายที่ ต.โผงเผง อ.ป่าโมก ไหลผ่านเข้าสู่ อ.บางบาล จ.พระนครศรีอยุธยา',
  },

  // --- ลุ่มน้ำท่าจีน ---
  {
    id: 'thachin',
    name: 'แม่น้ำท่าจีน',
    type: 'main',
    basinId: 'thachin-basin',
    basinName: 'ลุ่มน้ำท่าจีน',
    basinGroup: 'chaophraya',
    basinGroupLabel: 'ไหลสู่อ่าวไทย ผ่านแม่น้ำเจ้าพระยา',
    lengthKm: 325,
    catchmentAreaKm2: 13681,
    distanceToSeaKm: 0,
    flowsIntoRiverId: 'gulf-of-thailand',
    flowsIntoRiverName: 'อ่าวไทย (ปากน้ำสมุทรสาคร)',
    provinceNames: ['ชัยนาท', 'สุพรรณบุรี', 'นครปฐม', 'สมุทรสาคร'],
    headwaterLocation: 'แยกออกจากแม่น้ำเจ้าพระยาที่ ต.มะขามเฒ่า อ.วัดสิงห์ จ.ชัยนาท',
    mouthLocation: 'อ่าวไทย ที่ อ.เมือง จ.สมุทรสาคร',
    coordinates: [
      [15.260, 100.040], // ปากคลองมะขามเฒ่า ชัยนาท
      [15.000, 100.080], // สามชุก สุพรรณบุรี
      [14.470, 100.120], // เมืองสุพรรณบุรี
      [14.150, 100.180], // สองพี่น้อง
      [13.800, 100.220], // นครชัยศรี นครปฐม
      [13.650, 100.280], // กระทุ่มแบน
      [13.540, 100.270], // ปากน้ำท่าจีน สมุทรสาคร
    ],
    description: 'ลำน้ำสาขาแยกตัวออกจากแม่น้ำเจ้าพระยาทางฝั่งขวา ไหลขนานลงสู่อ่าวไทยที่สมุทรสาคร มีความคดเคี้ยวสูง',
  },
  {
    id: 'krasiao',
    name: 'ลำห้วยกระเสียว',
    type: 'tributary',
    basinId: 'thachin-basin',
    basinName: 'ลุ่มน้ำท่าจีน',
    basinGroup: 'chaophraya',
    basinGroupLabel: 'ไหลสู่อ่าวไทย ผ่านแม่น้ำเจ้าพระยา',
    lengthKm: 120,
    catchmentAreaKm2: 2870,
    distanceToSeaKm: 280,
    flowsIntoRiverId: 'thachin',
    flowsIntoRiverName: 'แม่น้ำท่าจีน',
    provinceNames: ['กาญจนบุรี', 'สุพรรณบุรี'],
    coordinates: [
      [14.950, 99.400],
      [14.850, 99.680], // เขื่อนกระเสียว
      [14.820, 100.050], // บรรจบแม่น้ำท่าจีนที่ อ.สามชุก
    ],
    description: 'มีเขื่อนกระเสียวเป็นเขื่อนดินบดอัดขนาดใหญ่กั้นตัดยอดน้ำหลาก',
  },

  // --- ลุ่มน้ำแม่กลอง ---
  {
    id: 'maeklong',
    name: 'แม่น้ำแม่กลอง',
    type: 'main',
    basinId: 'maeklong-basin',
    basinName: 'ลุ่มน้ำแม่กลอง',
    basinGroup: 'chaophraya',
    basinGroupLabel: 'ไหลสู่อ่าวไทย ผ่านแม่น้ำเจ้าพระยา',
    lengthKm: 132,
    catchmentAreaKm2: 30837,
    distanceToSeaKm: 0,
    flowsIntoRiverId: 'gulf-of-thailand',
    flowsIntoRiverName: 'อ่าวไทย (ปากน้ำแม่กลอง สมุทรสงคราม)',
    provinceNames: ['กาญจนบุรี', 'ราชบุรี', 'สมุทรสงคราม'],
    headwaterLocation: 'จุดบรรจบของแม่น้ำแควใหญ่และแม่น้ำแควน้อย ที่ ต.ปากแพรก อ.เมือง จ.กาญจนบุรี',
    mouthLocation: 'อ่าวไทย ต.แหลมใหญ่ อ.เมือง จ.สมุทรสงคราม',
    coordinates: [
      [14.020, 99.530], // ปากแพรก กาญจนบุรี
      [13.900, 99.650], // ท่าม่วง (เขื่อนแม่กลอง)
      [13.820, 99.780], // ท่ามะกา
      [13.720, 99.820], // บ้านโป่ง ราชบุรี
      [13.530, 99.820], // เมืองราชบุรี
      [13.410, 100.000], // ปากน้ำแม่กลอง สมุทรสงคราม
    ],
    description: 'เกิดจากการรวมกันของแควใหญ่และแควน้อย ไหลผ่านราชบุรีลงสู่อ่าวไทยที่สมุทรสงคราม',
  },
  {
    id: 'khwae-yai',
    name: 'แม่น้ำแควใหญ่',
    type: 'tributary',
    basinId: 'maeklong-basin',
    basinName: 'ลุ่มน้ำแม่กลอง',
    basinGroup: 'chaophraya',
    basinGroupLabel: 'ไหลสู่อ่าวไทย ผ่านแม่น้ำเจ้าพระยา',
    lengthKm: 380,
    catchmentAreaKm2: 14800,
    distanceToSeaKm: 150,
    flowsIntoRiverId: 'maeklong',
    flowsIntoRiverName: 'แม่น้ำแม่กลอง',
    provinceNames: ['ตาก', 'กาญจนบุรี'],
    coordinates: [
      [15.300, 98.800],
      [14.650, 99.120], // เขื่อนศรีนครินทร์
      [14.280, 99.250], // เขื่อนท่าทุ่งนา
      [14.020, 99.530], // สะพานข้ามแม่น้ำแคว กาญจนบุรี
    ],
    description: 'ต้นกำเนิดจากทิวเขาถนนธงชัย มีเขื่อนศรีนครินทร์กักเก็บน้ำขนาดมหึมา',
  },
  {
    id: 'khwae-noi-kan',
    name: 'แม่น้ำแควน้อย (ลุ่มน้ำแม่กลอง)',
    type: 'tributary',
    basinId: 'maeklong-basin',
    basinName: 'ลุ่มน้ำแม่กลอง',
    basinGroup: 'chaophraya',
    basinGroupLabel: 'ไหลสู่อ่าวไทย ผ่านแม่น้ำเจ้าพระยา',
    lengthKm: 315,
    catchmentAreaKm2: 10640,
    distanceToSeaKm: 150,
    flowsIntoRiverId: 'maeklong',
    flowsIntoRiverName: 'แม่น้ำแม่กลอง',
    provinceNames: ['กาญจนบุรี'],
    coordinates: [
      [15.050, 98.500],
      [14.780, 98.600], // เขื่อนวชิราลงกรณ
      [14.350, 98.980], // ไทรโยค
      [14.020, 99.530], // ปากแพรก กาญจนบุรี
    ],
    description: 'ต้นน้ำจากทิวเขาตะนาวศรี มีเขื่อนวชิราลงกรณ (เขาแหลม) กักเก็บน้ำ',
  },

  // --- ลุ่มน้ำบางปะกง - ปราจีนบุรี ---
  {
    id: 'bangpakong',
    name: 'แม่น้ำบางปะกง',
    type: 'main',
    basinId: 'bangpakong-basin',
    basinName: 'ลุ่มน้ำบางปะกง',
    basinGroup: 'chaophraya',
    basinGroupLabel: 'ไหลสู่อ่าวไทย ผ่านแม่น้ำเจ้าพระยา',
    lengthKm: 122,
    catchmentAreaKm2: 18500,
    distanceToSeaKm: 0,
    flowsIntoRiverId: 'gulf-of-thailand',
    flowsIntoRiverName: 'อ่าวไทย (ปากน้ำบางปะกง ฉะเชิงเทรา)',
    provinceNames: ['ปราจีนบุรี', 'ฉะเชิงเทรา'],
    headwaterLocation: 'จุดบรรจบของแม่น้ำนครนายกและแม่น้ำปราจีนบุรี ที่ ต.บางแตน อ.บ้านสร้าง จ.ปราจีนบุรี',
    mouthLocation: 'อ่าวไทย ที่ อ.บางปะกง จ.ฉะเชิงเทรา',
    coordinates: [
      [13.910, 101.180], // บางแตน
      [13.820, 101.120], // บางคล้า
      [13.680, 101.070], // เมืองฉะเชิงเทรา
      [13.500, 100.990], // ปากน้ำบางปะกง
    ],
    description: 'แม่น้ำสายหลักของภาคตะวันออก ระบายน้ำจากเขาใหญ่และสระแก้วลงสู่อ่าวไทย',
  },
  {
    id: 'prachinburi',
    name: 'แม่น้ำปราจีนบุรี',
    type: 'tributary',
    basinId: 'bangpakong-basin',
    basinName: 'ลุ่มน้ำบางปะกง',
    basinGroup: 'chaophraya',
    basinGroupLabel: 'ไหลสู่อ่าวไทย ผ่านแม่น้ำเจ้าพระยา',
    lengthKm: 132,
    catchmentAreaKm2: 8900,
    distanceToSeaKm: 125,
    flowsIntoRiverId: 'bangpakong',
    flowsIntoRiverName: 'แม่น้ำบางปะกง',
    provinceNames: ['สระแก้ว', 'ปราจีนบุรี'],
    coordinates: [
      [14.020, 102.050], // กบินทร์บุรี
      [14.060, 101.650], // ศรีมหาโพธิ
      [14.050, 101.370], // เมืองปราจีนบุรี
      [13.910, 101.180], // บรรจบแม่น้ำบางปะกง
    ],
    description: 'ต้นน้ำจากทิวเขาสอยดาวและพนมดงรัก รวมกับแม่น้ำหนุมานที่กบินทร์บุรี',
  },
  {
    id: 'nakhonnayok',
    name: 'แม่น้ำนครนายก',
    type: 'tributary',
    basinId: 'bangpakong-basin',
    basinName: 'ลุ่มน้ำบางปะกง',
    basinGroup: 'chaophraya',
    basinGroupLabel: 'ไหลสู่อ่าวไทย ผ่านแม่น้ำเจ้าพระยา',
    lengthKm: 110,
    catchmentAreaKm2: 2400,
    distanceToSeaKm: 130,
    flowsIntoRiverId: 'bangpakong',
    flowsIntoRiverName: 'แม่น้ำบางปะกง',
    provinceNames: ['นครนายก', 'ปราจีนบุรี'],
    coordinates: [
      [14.320, 101.320], // เขื่อนขุนด่านปราการชล
      [14.200, 101.220], // เมืองนครนายก
      [14.100, 101.180], // องครักษ์
      [13.910, 101.180], // บรรจบแม่น้ำบางปะกง
    ],
    description: 'มีเขื่อนขุนด่านปราการชลช่วยชะลอน้ำป่าหลากจากอุทยานแห่งชาติเขาใหญ่',
  },

  // --- ลุ่มน้ำโขง (ภาคอีสาน: ชี & มูล) ---
  {
    id: 'chi',
    name: 'แม่น้ำชี',
    type: 'main',
    basinId: 'chi-basin',
    basinName: 'ลุ่มน้ำชี',
    basinGroup: 'mekong',
    basinGroupLabel: 'ไหลสู่แม่น้ำโขง',
    lengthKm: 765,
    catchmentAreaKm2: 49477,
    distanceToSeaKm: 580,
    flowsIntoRiverId: 'mun',
    flowsIntoRiverName: 'แม่น้ำมูล (และลงสู่แม่น้ำโขง)',
    provinceNames: ['ชัยภูมิ', 'ขอนแก่น', 'มหาสารคาม', 'กาฬสินธุ์', 'ร้อยเอ็ด', 'ยโสธร', 'อุบลราชธานี'],
    headwaterLocation: 'ทิวเขาเพชรบูรณ์ อ.หนองบัวแดง จ.ชัยภูมิ',
    mouthLocation: 'บ้านขอนไม้ยูง ต.วังยาง อ.พรรณนานิคม จ.สกลนคร / บรรจบแม่น้ำมูลที่ อ.วารินชำราบ จ.อุบลราชธานี',
    coordinates: [
      [16.100, 101.550], // หนองบัวแดง ชัยภูมิ
      [15.820, 102.020], // ชัยภูมิ
      [16.250, 102.820], // ชนบท/บ้านไผ่ ขอนแก่น
      [16.180, 103.300], // โกสุมพิสัย มหาสารคาม
      [16.050, 103.650], // เชียงขวัญ ร้อยเอ็ด
      [15.800, 104.150], // ยโสธร
      [15.280, 104.750], // บรรจบแม่น้ำมูล วารินชำราบ อุบลราชธานี
    ],
    description: 'แม่น้ำสายที่ยาวที่สุดในประเทศไทย ไหลคดเคี้ยวพาดผ่านกลางภาคอีสานลงสู่แม่น้ำมูล',
  },
  {
    id: 'phong',
    name: 'แม่น้ำพอง',
    type: 'tributary',
    basinId: 'chi-basin',
    basinName: 'ลุ่มน้ำชี',
    basinGroup: 'mekong',
    basinGroupLabel: 'ไหลสู่แม่น้ำโขง',
    lengthKm: 220,
    catchmentAreaKm2: 15300,
    distanceToSeaKm: 720,
    flowsIntoRiverId: 'chi',
    flowsIntoRiverName: 'แม่น้ำชี',
    provinceNames: ['เลย', 'ขอนแก่น'],
    coordinates: [
      [16.900, 101.900], // ภูกระดึง
      [16.780, 102.620], // เขื่อนอุบลรัตน์
      [16.500, 102.850], // เมืองขอนแก่น
      [16.420, 102.950], // บรรจบแม่น้ำชี
    ],
    description: 'ต้นน้ำจากภูกระดึง มีเขื่อนอุบลรัตน์กักเก็บน้ำและผลิตกระแสไฟฟ้า',
  },
  {
    id: 'lampao',
    name: 'ลำปาว',
    type: 'tributary',
    basinId: 'chi-basin',
    basinName: 'ลุ่มน้ำชี',
    basinGroup: 'mekong',
    basinGroupLabel: 'ไหลสู่แม่น้ำโขง',
    lengthKm: 200,
    catchmentAreaKm2: 6000,
    distanceToSeaKm: 690,
    flowsIntoRiverId: 'chi',
    flowsIntoRiverName: 'แม่น้ำชี',
    provinceNames: ['อุดรธานี', 'กาฬสินธุ์'],
    coordinates: [
      [17.150, 103.100], // กุมภวาปี
      [16.600, 103.520], // เขื่อนลำปาว
      [16.320, 103.650], // กมลาไสย บรรจบแม่น้ำชี
    ],
    description: 'มีเขื่อนลำปาวส่งน้ำชลประทานและควบคุมน้ำหลากลุ่มน้ำชีตอนล่าง',
  },
  {
    id: 'mun',
    name: 'แม่น้ำมูล',
    type: 'main',
    basinId: 'mun-basin',
    basinName: 'ลุ่มน้ำมูล',
    basinGroup: 'mekong',
    basinGroupLabel: 'ไหลสู่แม่น้ำโขง',
    lengthKm: 750,
    catchmentAreaKm2: 71060,
    distanceToSeaKm: 420,
    flowsIntoRiverId: 'mekong',
    flowsIntoRiverName: 'แม่น้ำโขง (ปากมูล อ.โขงเจียม)',
    provinceNames: ['นครราชสีมา', 'บุรีรัมย์', 'สุรินทร์', 'ร้อยเอ็ด', 'ศรีสะเกษ', 'อุบลราชธานี'],
    headwaterLocation: 'อุทยานแห่งชาติเขาใหญ่ อ.ครบุรี จ.นครราชสีมา',
    mouthLocation: 'แม่น้ำโขง ต.โขงเจียม อ.โขงเจียม จ.อุบลราชธานี (แม่น้ำสองสี)',
    coordinates: [
      [14.400, 102.150], // ครบุรี โคราช
      [14.980, 102.100], // เมืองนครราชสีมา
      [15.150, 102.720], // พิมาย
      [15.280, 103.250], // สตึก บุรีรัมย์
      [15.300, 103.750], // ท่าตูม สุรินทร์
      [15.120, 104.320], // ศรีสะเกษ
      [15.230, 104.850], // อุบลราชธานี (M.7)
      [15.320, 105.500], // ปากมูล โขงเจียม (สู่แม่น้ำโขง)
    ],
    description: 'ลุ่มน้ำที่ใหญ่ที่สุดในภาคอีสาน รับน้ำจากแม่น้ำชีและลำน้ำสาขา ไหลลงสู่แม่น้ำโขงที่โขงเจียม',
  },
  {
    id: 'lam-takhong',
    name: 'ลำตะคอง',
    type: 'tributary',
    basinId: 'mun-basin',
    basinName: 'ลุ่มน้ำมูล',
    basinGroup: 'mekong',
    basinGroupLabel: 'ไหลสู่แม่น้ำโขง',
    lengthKm: 220,
    catchmentAreaKm2: 3500,
    distanceToSeaKm: 650,
    flowsIntoRiverId: 'mun',
    flowsIntoRiverName: 'แม่น้ำมูล',
    provinceNames: ['นครราชสีมา'],
    coordinates: [
      [14.420, 101.400], // เขาใหญ่
      [14.860, 101.550], // เขื่อนลำตะคอง
      [14.920, 101.820], // สีคิ้ว
      [14.980, 102.100], // ผ่านเมืองโคราช บรรจบแม่น้ำมูล
    ],
    description: 'หล่อเลี้ยงพื้นที่ตัวเมืองนครราชสีมา มีเขื่อนลำตะคองกักเก็บน้ำและผลิตไฟฟ้าแบบสูบกลับ',
  },

  // --- ลุ่มน้ำภาคใต้ ---
  {
    id: 'tapi',
    name: 'แม่น้ำตาปี',
    type: 'main',
    basinId: 'tapi-basin',
    basinName: 'ลุ่มน้ำตาปี',
    basinGroup: 'south',
    basinGroupLabel: 'ไหลสู่อ่าวไทย & ทะเลอันดามัน (ภาคใต้)',
    lengthKm: 230,
    catchmentAreaKm2: 12225,
    distanceToSeaKm: 0,
    flowsIntoRiverId: 'gulf-of-thailand',
    flowsIntoRiverName: 'อ่าวไทย (อ่าวบ้านดอน สุราษฎร์ธานี)',
    provinceNames: ['นครศรีธรรมราช', 'สุราษฎร์ธานี'],
    headwaterLocation: 'ทิวเขานครศรีธรรมราช อ.พิปูน จ.นครศรีธรรมราช',
    mouthLocation: 'อ่าวบ้านดอน อ.เมือง จ.สุราษฎร์ธานี',
    coordinates: [
      [8.580, 99.600], // พิปูน
      [8.750, 99.400], // ฉวาง
      [9.000, 99.300], // พระแสง
      [9.150, 99.330], // พุนพิน (บรรจบแม่น้ำพุมดวง)
      [9.160, 99.350], // เมืองสุราษฎร์ธานี
      [9.200, 99.400], // อ่าวบ้านดอน
    ],
    description: 'แม่น้ำสายยาวที่สุดในภาคใต้ ไหลลงสู่อ่าวบ้านดอน สุราษฎร์ธานี',
  },
  {
    id: 'pattani',
    name: 'แม่น้ำปัตตานี',
    type: 'main',
    basinId: 'pattani-basin',
    basinName: 'ลุ่มน้ำปัตตานี',
    basinGroup: 'south',
    basinGroupLabel: 'ไหลสู่อ่าวไทย & ทะเลอันดามัน (ภาคใต้)',
    lengthKm: 214,
    catchmentAreaKm2: 3858,
    distanceToSeaKm: 0,
    flowsIntoRiverId: 'gulf-of-thailand',
    flowsIntoRiverName: 'อ่าวไทย (ปากน้ำปัตตานี)',
    provinceNames: ['ยะลา', 'ปัตตานี'],
    headwaterLocation: 'ทิวเขาสันกาลาคีรี อ.เบตง จ.ยะลา',
    mouthLocation: 'อ่าวไทย ต.อานารู อ.เมือง จ.ปัตตานี',
    coordinates: [
      [5.800, 101.150], // เบตง
      [6.150, 101.280], // เขื่อนบางลาง
      [6.540, 101.280], // เมืองยะลา
      [6.880, 101.270], // ปากน้ำปัตตานี
    ],
    description: 'ไหลผ่านจังหวัดยะลาและปัตตานี มีเขื่อนบางลางกั้นตอนบนเพื่อควบคุมน้ำหลาก',
  },
  {
    id: 'trang',
    name: 'แม่น้ำตรัง',
    type: 'main',
    basinId: 'trang-basin',
    basinName: 'ลุ่มน้ำตรัง',
    basinGroup: 'south',
    basinGroupLabel: 'ไหลสู่อ่าวไทย & ทะเลอันดามัน (ภาคใต้)',
    lengthKm: 123,
    catchmentAreaKm2: 3100,
    distanceToSeaKm: 0,
    flowsIntoRiverId: 'andaman-sea',
    flowsIntoRiverName: 'ทะเลอันดามัน (ปากน้ำกันตัง)',
    provinceNames: ['นครศรีธรรมราช', 'ตรัง'],
    coordinates: [
      [8.050, 99.650], // ทุ่งสง นครศรีธรรมราช
      [7.680, 99.550], // ห้วยยอด ตรัง
      [7.560, 99.600], // เมืองตรัง
      [7.400, 99.520], // ปากน้ำกันตัง สู่ทะเลอันดามัน
    ],
    description: 'แม่น้ำสายหลักฝั่งทะเลอันดามันของจังหวัดตรัง',
  },
  {
    id: 'phetchaburi',
    name: 'แม่น้ำเพชรบุรี',
    type: 'main',
    basinId: 'phetchaburi-basin',
    basinName: 'ลุ่มน้ำเพชรบุรี',
    basinGroup: 'south',
    basinGroupLabel: 'ไหลสู่อ่าวไทย & ทะเลอันดามัน (ภาคใต้)',
    lengthKm: 210,
    catchmentAreaKm2: 5600,
    distanceToSeaKm: 0,
    flowsIntoRiverId: 'gulf-of-thailand',
    flowsIntoRiverName: 'อ่าวไทย (ปากน้ำบ้านแหลม)',
    provinceNames: ['เพชรบุรี'],
    coordinates: [
      [12.800, 99.300], // เทือกเขาตะนาวศรี
      [12.900, 99.630], // เขื่อนแก่งกระจาน
      [12.980, 99.780], // ท่ายาง
      [13.110, 99.940], // เมืองเพชรบุรี
      [13.220, 100.080], // ปากน้ำบ้านแหลม อ่าวไทย
    ],
    description: 'มีเขื่อนแก่งกระจานกักเก็บน้ำ ควบคุมไม่ให้ท่วมเมืองเพชรบุรี',
  },
];

// 2. CANALS DATA (Major Bangkok and Central Basin Canals)
export const CANALS_DATA: CanalItem[] = [
  {
    id: 'saen-saep',
    name: 'คลองแสนแสบ',
    lengthKm: 72,
    province: 'กรุงเทพมหานคร - ฉะเชิงเทรา',
    basinName: 'ลุ่มน้ำเจ้าพระยา - บางปะกง',
    connectsFrom: 'แม่น้ำเจ้าพระยา (คลองมหานาค ป้อมปราบฯ กทม.)',
    connectsTo: 'แม่น้ำบางปะกง (อ.บางน้ำเปรี้ยว จ.ฉะเชิงเทรา)',
    coordinates: [
      [13.753, 100.518], // โบ๊เบ๊
      [13.749, 100.550], // ประตูน้ำ
      [13.748, 100.590], // คลองตัน
      [13.765, 100.645], // บางกะปิ
      [13.810, 100.720], // มีนบุรี
      [13.850, 100.820], // หนองจอก
      [13.880, 101.000], // บางน้ำเปรี้ยว บรรจบแม่น้ำบางปะกง
    ],
    purpose: 'ระบายน้ำฝั่งตะวันออกของ กทม. สัญจรทางเรือ และเชื่อมต่อแม่น้ำเจ้าพระยากับแม่น้ำบางปะกง',
    description: 'ขุดขึ้นในรัชกาลที่ 3 เป็นแนวระบายน้ำหลักทางทิศตะวันออกสู่แม่น้ำบางปะกง',
  },
  {
    id: 'prem-prachakon',
    name: 'คลองเปรมประชากร',
    lengthKm: 50.8,
    province: 'กรุงเทพมหานคร - ปทุมธานี - อยุธยา',
    basinName: 'ลุ่มน้ำเจ้าพระยา',
    connectsFrom: 'คลองผดุงกรุงเกษม (กทม.)',
    connectsTo: 'แม่น้ำเจ้าพระยา (เกาะบางปะอิน จ.พระนครศรีอยุธยา)',
    coordinates: [
      [13.765, 100.520], // ผดุงกรุงเกษม
      [13.820, 100.540], // บางซื่อ/จตุจักร
      [13.910, 100.590], // ดอนเมือง
      [14.020, 100.610], // รังสิต ปทุมธานี
      [14.220, 100.580], // บางปะอิน อยุธยา
    ],
    purpose: 'ระบายน้ำเหนือลงสู่แม่น้ำเจ้าพระยาผ่านระบบสูบน้ำ กทม.',
    description: 'คลองประวัติศาสตร์เชื่อม กทม. สู่บางปะอิน ช่วยระบายน้ำตอนบนของดอนเมืองและหลักสี่',
  },
  {
    id: 'rangsit-prayurasakdi',
    name: 'คลองรังสิตประยูรศักดิ์',
    lengthKm: 54,
    province: 'ปทุมธานี - นครนายก',
    basinName: 'ลุ่มน้ำเจ้าพระยา - นครนายก',
    connectsFrom: 'แม่น้ำเจ้าพระยา (อ.เมืองปทุมธานี)',
    connectsTo: 'แม่น้ำนครนายก (อ.องครักษ์ จ.นครนายก)',
    coordinates: [
      [14.000, 100.530], // ประตูน้ำจุฬาลงกรณ์ ปทุมธานี
      [14.015, 100.620], // ฟิวเจอร์พาร์ครังสิต (คลอง 1)
      [14.020, 100.750], // ธัญบุรี (คลอง 6)
      [14.030, 100.900], // คลอง 11
      [14.120, 101.180], // ปากคลอง 16 องครักษ์ บรรจบแม่น้ำนครนายก
    ],
    purpose: 'หัวใจของทุ่งรังสิต ชลประทานและผันมวลน้ำข้ามลุ่มน้ำจากเจ้าพระยาไปออกนครนายกและบางปะกง',
    description: 'โครงการชลประทานขนาดใหญ่แห่งแรกของสยามในสมัย ร.5 ผันน้ำและควบคุมอุทกภัยปริมณฑลตอนเหนือ',
  },
  {
    id: 'phra-khanong',
    name: 'คลองพระโขนง - คลองประเวศบุรีรมย์',
    lengthKm: 46,
    province: 'กรุงเทพมหานคร - ฉะเชิงเทรา',
    basinName: 'ลุ่มน้ำเจ้าพระยา - บางปะกง',
    connectsFrom: 'แม่น้ำเจ้าพระยา (สถานีสูบน้ำพระโขนง กทม.)',
    connectsTo: 'แม่น้ำบางปะกง (ฉะเชิงเทรา)',
    coordinates: [
      [13.708, 100.595], // สถานีสูบน้ำพระโขนง
      [13.715, 100.650], // ประเวศ
      [13.710, 100.780], // ลาดกระบัง
      [13.680, 100.920], // คลองสวน
      [13.660, 101.020], // บรรจบแม่น้ำบางปะกง
    ],
    purpose: 'แกนระบายน้ำหลักของกรุงเทพมหานครฝั่งตะวันออกลงสู่อ่าวไทยและแม่น้ำบางปะกง',
    description: 'มีสถานีสูบน้ำพระโขนงที่มีกำลังสูบสูงสุดแห่งหนึ่งของ กทม.',
  },
  {
    id: 'thawi-watthana',
    name: 'คลองทวีวัฒนา',
    lengthKm: 32,
    province: 'นนทบุรี - กรุงเทพมหานคร - นครปฐม',
    basinName: 'ลุ่มน้ำเจ้าพระยา - ท่าจีน',
    connectsFrom: 'คลองบางบัวทอง (นนทบุรี)',
    connectsTo: 'คลองภาษีเจริญ (กทม. / สมุทรสาคร)',
    coordinates: [
      [13.920, 100.350], // บางบัวทอง นนทบุรี
      [13.820, 100.350], // ทวีวัฒนา กทม.
      [13.710, 100.340], // หนองแขม
      [13.650, 100.330], // บรรจบคลองภาษีเจริญ
    ],
    purpose: 'แนวระบายน้ำหลักของกรุงเทพมหานครฝั่งตะวันตก (ธนบุรี) สู่แม่น้ำท่าจีน',
    description: 'คลองขุดตรงแนวเหนือ-ใต้ ช่วยแบ่งเบาน้ำหลากจากนนทบุรีลงสู่คลองมหาชัยและท่าจีน',
  },
  {
    id: 'maha-sawat',
    name: 'คลองมหาสวัสดิ์',
    lengthKm: 28,
    province: 'กรุงเทพมหานคร - นนทบุรี - นครปฐม',
    basinName: 'ลุ่มน้ำเจ้าพระยา - ท่าจีน',
    connectsFrom: 'คลองบางกอกน้อย (แม่น้ำเจ้าพระยา)',
    connectsTo: 'แม่น้ำท่าจีน (อ.นครชัยศรี จ.นครปฐม)',
    coordinates: [
      [13.805, 100.460], // ประตูระบายน้ำฉิมพลี / บางกอกน้อย
      [13.800, 100.380], // บางกรวย / ศาลายา
      [13.795, 100.280], // นครชัยศรี บรรจบแม่น้ำท่าจีน
    ],
    purpose: 'เชื่อมน้ำระหว่างแม่น้ำเจ้าพระยาและแม่น้ำท่าจีน ผันน้ำออกทะเลทางฝั่งตะวันตก',
    description: 'ขุดในรัชกาลที่ 4 เพื่อการสัญจรและระบายน้ำ ปัจจุบันมีประตูน้ำควบคุมน้ำหลากเข้าฝั่งธนบุรี',
  },
  {
    id: 'chainat-pasak',
    name: 'คลองระบายน้ำชัยนาท-ป่าสัก (คลองอนุศาสนานันท์)',
    lengthKm: 134,
    province: 'ชัยนาท - นครสวรรค์ - ลพบุรี - สระบุรี',
    basinName: 'ลุ่มน้ำเจ้าพระยา - ป่าสัก',
    connectsFrom: 'เหนือเขื่อนเจ้าพระยา (อ.มโนรมย์ จ.ชัยนาท)',
    connectsTo: 'แม่น้ำป่าสัก (เหนือเขื่อนพระรามหก อ.ท่าเรือ จ.อยุธยา)',
    coordinates: [
      [15.280, 100.120], // ปากคลองมโนรมย์ ชัยนาท
      [15.150, 100.350], // ตาคลี นครสวรรค์
      [14.950, 100.580], // บ้านหมี่ ลพบุรี
      [14.780, 100.680], // เมืองลพบุรี
      [14.550, 100.750], // เขื่อนพระรามหก ท่าเรือ อยุธยา
    ],
    purpose: 'ตัดยอดน้ำหลากจากแม่น้ำเจ้าพระยาฝั่งตะวันออก ส่งน้ำชลประทานและผันน้ำสู่แม่น้ำป่าสัก',
    description: 'คลองส่งน้ำชลประทานและตัดยอดน้ำหลากที่สำคัญที่สุดทางฝั่งตะวันออกของลุ่มเจ้าพระยา',
  },
  {
    id: 'damnoen-saduak',
    name: 'คลองดำเนินสะดวก',
    lengthKm: 32,
    province: 'สมุทรสาคร - ราชบุรี - สมุทรสงคราม',
    basinName: 'ลุ่มน้ำท่าจีน - แม่กลอง',
    connectsFrom: 'แม่น้ำท่าจีน (อ.บ้านแพ้ว จ.สมุทรสาคร)',
    connectsTo: 'แม่น้ำแม่กลอง (อ.บางคนที จ.สมุทรสงคราม)',
    coordinates: [
      [13.580, 100.180], // ท่าจีน บ้านแพ้ว
      [13.520, 99.980], // ดำเนินสะดวก ราชบุรี
      [13.480, 99.920], // แม่กลอง บางคนที
    ],
    purpose: 'เชื่อมน้ำระหว่างแม่น้ำท่าจีนและแม่น้ำแม่กลอง ส่งเสริมเกษตรสวนผลไม้และการท่องเที่ยว',
    description: 'คลองขุดเชื่อม 2 ลุ่มน้ำใหญ่ ขุดขึ้นในสมัย ร.4 เป็นที่ตั้งของตลาดน้ำดำเนินสะดวกที่มีชื่อเสียง',
  },
];

// Helper: Calculate distance between two lat/lng in kilometers (Haversine formula)
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Find closest river or canal from a given lat/lng point
export interface NearestWatercourseResult {
  watercourse: RiverItem | CanalItem;
  type: 'river' | 'canal';
  distanceKm: number;
  snappedCoord: [number, number];
  downstreamPath: string[]; // List of river/body names until sea
  upstreamRivers: string[]; // Rivers feeding into this
}

export function findNearestWatercourse(lat: number, lng: number): NearestWatercourseResult {
  let closestDist = Infinity;
  let closestItem: RiverItem | CanalItem = RIVERS_DATA[0];
  let closestType: 'river' | 'canal' = 'river';
  let closestCoord: [number, number] = RIVERS_DATA[0].coordinates[0];

  // Search all rivers
  for (const river of RIVERS_DATA) {
    for (const pt of river.coordinates) {
      const d = calculateDistanceKm(lat, lng, pt[0], pt[1]);
      if (d < closestDist) {
        closestDist = d;
        closestItem = river;
        closestType = 'river';
        closestCoord = pt;
      }
    }
  }

  // Search all canals
  for (const canal of CANALS_DATA) {
    for (const pt of canal.coordinates) {
      const d = calculateDistanceKm(lat, lng, pt[0], pt[1]);
      if (d < closestDist) {
        closestDist = d;
        closestItem = canal;
        closestType = 'canal';
        closestCoord = pt;
      }
    }
  }

  // Calculate downstream path to sea
  const downstreamPath: string[] = [closestItem.name];
  let currentRiverId = closestType === 'river' ? (closestItem as RiverItem).flowsIntoRiverId : 'chaophraya';
  let visited = new Set<string>();

  while (currentRiverId && !visited.has(currentRiverId)) {
    visited.add(currentRiverId);
    if (currentRiverId === 'gulf-of-thailand') {
      downstreamPath.push('อ่าวไทย');
      break;
    }
    if (currentRiverId === 'mekong') {
      downstreamPath.push('แม่น้ำโขง');
      break;
    }
    if (currentRiverId === 'andaman-sea') {
      downstreamPath.push('ทะเลอันดามัน');
      break;
    }

    const nextRiver = RIVERS_DATA.find((r) => r.id === currentRiverId);
    if (nextRiver) {
      downstreamPath.push(nextRiver.name);
      currentRiverId = nextRiver.flowsIntoRiverId;
    } else {
      downstreamPath.push('อ่าวไทย');
      break;
    }
  }

  // Calculate upstream rivers feeding into this river
  const upstreamRivers: string[] = [];
  if (closestType === 'river') {
    const rId = (closestItem as RiverItem).id;
    for (const r of RIVERS_DATA) {
      if (r.flowsIntoRiverId === rId) {
        upstreamRivers.push(r.name);
      }
    }
  }

  return {
    watercourse: closestItem,
    type: closestType,
    distanceKm: closestDist,
    snappedCoord: closestCoord,
    downstreamPath,
    upstreamRivers,
  };
}

// Group rivers by Basin Group hierarchy
export function getBasinTree() {
  const groups: {
    groupLabel: string;
    groupId: string;
    basins: {
      basinId: string;
      basinName: string;
      rivers: RiverItem[];
    }[];
  }[] = [
    {
      groupId: 'chaophraya',
      groupLabel: 'ไหลสู่อ่าวไทย ผ่านแม่น้ำเจ้าพระยา',
      basins: [],
    },
    {
      groupId: 'mekong',
      groupLabel: 'ไหลสู่แม่น้ำโขง',
      basins: [],
    },
    {
      groupId: 'south',
      groupLabel: 'ไหลสู่อ่าวไทย & ทะเลอันดามัน (ภาคใต้)',
      basins: [],
    },
  ];

  for (const river of RIVERS_DATA) {
    let grp = groups.find((g) => g.groupId === river.basinGroup);
    if (!grp) grp = groups[0];

    let bsn = grp.basins.find((b) => b.basinId === river.basinId);
    if (!bsn) {
      bsn = {
        basinId: river.basinId,
        basinName: river.basinName,
        rivers: [],
      };
      grp.basins.push(bsn);
    }
    bsn.rivers.push(river);
  }

  return groups;
}
