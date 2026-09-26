export interface ProvinceLocation {
  name: string;
  enName: string;
  region: 'north' | 'northeast' | 'central' | 'east' | 'west' | 'south';
  regionName: string;
  lat: number;
  lng: number;
  isFloodHotspot?: boolean;
}

export const THAI_PROVINCES: ProvinceLocation[] = [
  // ภาคกลางและปริมณฑล
  { name: 'กรุงเทพมหานคร', enName: 'Bangkok', region: 'central', regionName: 'ภาคกลาง/กทม.', lat: 13.7563, lng: 100.5018, isFloodHotspot: true },
  { name: 'นนทบุรี', enName: 'Nonthaburi', region: 'central', regionName: 'ภาคกลาง/กทม.', lat: 13.8621, lng: 100.5134, isFloodHotspot: true },
  { name: 'ปทุมธานี', enName: 'Pathum Thani', region: 'central', regionName: 'ภาคกลาง/กทม.', lat: 14.0208, lng: 100.5250, isFloodHotspot: true },
  { name: 'สมุทรปราการ', enName: 'Samut Prakan', region: 'central', regionName: 'ภาคกลาง/กทม.', lat: 13.5991, lng: 100.5998, isFloodHotspot: true },
  { name: 'สมุทรสาคร', enName: 'Samut Sakhon', region: 'central', regionName: 'ภาคกลาง', lat: 13.5475, lng: 100.2744 },
  { name: 'สมุทรสงคราม', enName: 'Samut Songkhram', region: 'central', regionName: 'ภาคกลาง', lat: 13.4098, lng: 99.9968 },
  { name: 'พระนครศรีอยุธยา', enName: 'Phra Nakhon Si Ayutthaya', region: 'central', regionName: 'ภาคกลาง', lat: 14.3532, lng: 100.5684, isFloodHotspot: true },
  { name: 'อ่างทอง', enName: 'Ang Thong', region: 'central', regionName: 'ภาคกลาง', lat: 14.5896, lng: 100.4550, isFloodHotspot: true },
  { name: 'สิงห์บุรี', enName: 'Sing Buri', region: 'central', regionName: 'ภาคกลาง', lat: 14.8911, lng: 100.4048, isFloodHotspot: true },
  { name: 'ชัยนาท', enName: 'Chai Nat', region: 'central', regionName: 'ภาคกลาง', lat: 15.1852, lng: 100.1251, isFloodHotspot: true },
  { name: 'ลพบุรี', enName: 'Lop Buri', region: 'central', regionName: 'ภาคกลาง', lat: 14.7995, lng: 100.6534, isFloodHotspot: true },
  { name: 'สระบุรี', enName: 'Saraburi', region: 'central', regionName: 'ภาคกลาง', lat: 14.5289, lng: 100.9108 },
  { name: 'นครนายก', enName: 'Nakhon Nayok', region: 'central', regionName: 'ภาคกลาง', lat: 14.2069, lng: 101.2131 },
  { name: 'สุพรรณบุรี', enName: 'Suphan Buri', region: 'central', regionName: 'ภาคกลาง', lat: 14.4745, lng: 100.1177, isFloodHotspot: true },
  { name: 'นครปฐม', enName: 'Nakhon Pathom', region: 'central', regionName: 'ภาคกลาง', lat: 13.8196, lng: 100.0443, isFloodHotspot: true },
  { name: 'นครสวรรค์', enName: 'Nakhon Sawan', region: 'central', regionName: 'ภาคกลาง', lat: 15.7030, lng: 100.1371, isFloodHotspot: true },
  { name: 'อุทัยธานี', enName: 'Uthai Thani', region: 'central', regionName: 'ภาคกลาง', lat: 15.3835, lng: 100.0245, isFloodHotspot: true },
  { name: 'กำแพงเพชร', enName: 'Kamphaeng Phet', region: 'central', regionName: 'ภาคกลาง', lat: 16.4828, lng: 99.5227 },
  { name: 'พิจิตร', enName: 'Phichit', region: 'central', regionName: 'ภาคกลาง', lat: 16.4429, lng: 100.3488, isFloodHotspot: true },
  { name: 'พิษณุโลก', enName: 'Phitsanulok', region: 'central', regionName: 'ภาคกลาง', lat: 16.8211, lng: 100.2659, isFloodHotspot: true },
  { name: 'เพชรบูรณ์', enName: 'Phetchabun', region: 'central', regionName: 'ภาคกลาง', lat: 16.4190, lng: 101.1567, isFloodHotspot: true },
  { name: 'สุโขทัย', enName: 'Sukhothai', region: 'central', regionName: 'ภาคกลาง', lat: 17.0056, lng: 99.8264, isFloodHotspot: true },

  // ภาคเหนือ
  { name: 'เชียงใหม่', enName: 'Chiang Mai', region: 'north', regionName: 'ภาคเหนือ', lat: 18.7961, lng: 98.9882, isFloodHotspot: true },
  { name: 'เชียงราย', enName: 'Chiang Rai', region: 'north', regionName: 'ภาคเหนือ', lat: 19.9105, lng: 99.8406, isFloodHotspot: true },
  { name: 'ลำปาง', enName: 'Lampang', region: 'north', regionName: 'ภาคเหนือ', lat: 18.2888, lng: 99.4928, isFloodHotspot: true },
  { name: 'ลำพูน', enName: 'Lamphun', region: 'north', regionName: 'ภาคเหนือ', lat: 18.5745, lng: 99.0087, isFloodHotspot: true },
  { name: 'แม่ฮ่องสอน', enName: 'Mae Hong Son', region: 'north', regionName: 'ภาคเหนือ', lat: 19.3021, lng: 97.9654 },
  { name: 'น่าน', enName: 'Nan', region: 'north', regionName: 'ภาคเหนือ', lat: 18.7838, lng: 100.7783, isFloodHotspot: true },
  { name: 'พะเยา', enName: 'Phayao', region: 'north', regionName: 'ภาคเหนือ', lat: 19.1664, lng: 99.9022, isFloodHotspot: true },
  { name: 'แพร่', enName: 'Phrae', region: 'north', regionName: 'ภาคเหนือ', lat: 18.1446, lng: 100.1410, isFloodHotspot: true },
  { name: 'อุตรดิตถ์', enName: 'Uttaradit', region: 'north', regionName: 'ภาคเหนือ', lat: 17.6201, lng: 100.0993 },

  // ภาคตะวันออกเฉียงเหนือ (อีสาน)
  { name: 'นครราชสีมา', enName: 'Nakhon Ratchasima', region: 'northeast', regionName: 'ภาคอีสาน', lat: 14.9799, lng: 102.0978, isFloodHotspot: true },
  { name: 'ขอนแก่น', enName: 'Khon Kaen', region: 'northeast', regionName: 'ภาคอีสาน', lat: 16.4419, lng: 102.8360, isFloodHotspot: true },
  { name: 'อุบลราชธานี', enName: 'Ubon Ratchathani', region: 'northeast', regionName: 'ภาคอีสาน', lat: 15.2449, lng: 104.8473, isFloodHotspot: true },
  { name: 'อุดรธานี', enName: 'Udon Thani', region: 'northeast', regionName: 'ภาคอีสาน', lat: 17.4157, lng: 102.7859 },
  { name: 'บุรีรัมย์', enName: 'Buri Ram', region: 'northeast', regionName: 'ภาคอีสาน', lat: 14.9951, lng: 103.1029 },
  { name: 'สุรินทร์', enName: 'Surin', region: 'northeast', regionName: 'ภาคอีสาน', lat: 14.8818, lng: 103.4936 },
  { name: 'ศรีสะเกษ', enName: 'Si Sa Ket', region: 'northeast', regionName: 'ภาคอีสาน', lat: 15.1186, lng: 104.3220, isFloodHotspot: true },
  { name: 'ร้อยเอ็ด', enName: 'Roi Et', region: 'northeast', regionName: 'ภาคอีสาน', lat: 16.0538, lng: 103.6520, isFloodHotspot: true },
  { name: 'กาฬสินธุ์', enName: 'Kalasin', region: 'northeast', regionName: 'ภาคอีสาน', lat: 16.4322, lng: 103.5063, isFloodHotspot: true },
  { name: 'มหาสารคาม', enName: 'Maha Sarakham', region: 'northeast', regionName: 'ภาคอีสาน', lat: 16.1848, lng: 103.3007 },
  { name: 'ชัยภูมิ', enName: 'Chaiyaphum', region: 'northeast', regionName: 'ภาคอีสาน', lat: 15.8105, lng: 102.0288, isFloodHotspot: true },
  { name: 'เลย', enName: 'Loei', region: 'northeast', regionName: 'ภาคอีสาน', lat: 17.4939, lng: 101.7268 },
  { name: 'หนองคาย', enName: 'Nong Khai', region: 'northeast', regionName: 'ภาคอีสาน', lat: 17.8783, lng: 102.7420, isFloodHotspot: true },
  { name: 'บึงกาฬ', enName: 'Bueng Kan', region: 'northeast', regionName: 'ภาคอีสาน', lat: 18.3609, lng: 103.6531, isFloodHotspot: true },
  { name: 'หนองบัวลำภู', enName: 'Nong Bua Lam Phu', region: 'northeast', regionName: 'ภาคอีสาน', lat: 17.2044, lng: 102.4407 },
  { name: 'สกลนคร', enName: 'Sakon Nakhon', region: 'northeast', regionName: 'ภาคอีสาน', lat: 17.1664, lng: 104.1486 },
  { name: 'นครพนม', enName: 'Nakhon Phanom', region: 'northeast', regionName: 'ภาคอีสาน', lat: 17.4042, lng: 104.7787, isFloodHotspot: true },
  { name: 'มุกดาหาร', enName: 'Mukdahan', region: 'northeast', regionName: 'ภาคอีสาน', lat: 16.5434, lng: 104.7235 },
  { name: 'ยโสธร', enName: 'Yasothon', region: 'northeast', regionName: 'ภาคอีสาน', lat: 15.7926, lng: 104.1453, isFloodHotspot: true },
  { name: 'อำนาจเจริญ', enName: 'Amnat Charoen', region: 'northeast', regionName: 'ภาคอีสาน', lat: 15.8657, lng: 104.6258 },

  // ภาคตะวันออก
  { name: 'ชลบุรี', enName: 'Chon Buri', region: 'east', regionName: 'ภาคตะวันออก', lat: 13.3611, lng: 100.9847 },
  { name: 'ระยอง', enName: 'Rayong', region: 'east', regionName: 'ภาคตะวันออก', lat: 12.6814, lng: 101.2816, isFloodHotspot: true },
  { name: 'จันทบุรี', enName: 'Chanthaburi', region: 'east', regionName: 'ภาคตะวันออก', lat: 12.6114, lng: 102.1039, isFloodHotspot: true },
  { name: 'ตราด', enName: 'Trat', region: 'east', regionName: 'ภาคตะวันออก', lat: 12.2428, lng: 102.5175, isFloodHotspot: true },
  { name: 'ฉะเชิงเทรา', enName: 'Chachoengsao', region: 'east', regionName: 'ภาคตะวันออก', lat: 13.6904, lng: 101.0779, isFloodHotspot: true },
  { name: 'ปราจีนบุรี', enName: 'Prachin Buri', region: 'east', regionName: 'ภาคตะวันออก', lat: 14.0509, lng: 101.3717, isFloodHotspot: true },
  { name: 'สระแก้ว', enName: 'Sa Kaeo', region: 'east', regionName: 'ภาคตะวันออก', lat: 13.8140, lng: 102.0718 },

  // ภาคตะวันตก
  { name: 'กาญจนบุรี', enName: 'Kanchanaburi', region: 'west', regionName: 'ภาคตะวันตก', lat: 14.0228, lng: 99.5328 },
  { name: 'ราชบุรี', enName: 'Ratchaburi', region: 'west', regionName: 'ภาคตะวันตก', lat: 13.5283, lng: 99.8134 },
  { name: 'ตาก', enName: 'Tak', region: 'west', regionName: 'ภาคตะวันตก', lat: 16.8839, lng: 99.1258, isFloodHotspot: true },
  { name: 'เพชรบุรี', enName: 'Phetchaburi', region: 'west', regionName: 'ภาคตะวันตก', lat: 13.1114, lng: 99.9391, isFloodHotspot: true },
  { name: 'ประจวบคีรีขันธ์', enName: 'Prachuap Khiri Khan', region: 'west', regionName: 'ภาคตะวันตก', lat: 11.8124, lng: 99.7972 },

  // ภาคใต้
  { name: 'นครศรีธรรมราช', enName: 'Nakhon Si Thammarat', region: 'south', regionName: 'ภาคใต้', lat: 8.4304, lng: 99.9631, isFloodHotspot: true },
  { name: 'สงขลา', enName: 'Songkhla', region: 'south', regionName: 'ภาคใต้', lat: 7.1756, lng: 100.6143, isFloodHotspot: true },
  { name: 'สุราษฎร์ธานี', enName: 'Surat Thani', region: 'south', regionName: 'ภาคใต้', lat: 9.1382, lng: 99.3217, isFloodHotspot: true },
  { name: 'ภูเก็ต', enName: 'Phuket', region: 'south', regionName: 'ภาคใต้', lat: 7.8804, lng: 98.3923, isFloodHotspot: true },
  { name: 'กระบี่', enName: 'Krabi', region: 'south', regionName: 'ภาคใต้', lat: 8.0863, lng: 98.9063 },
  { name: 'พังงา', enName: 'Phang Nga', region: 'south', regionName: 'ภาคใต้', lat: 8.4501, lng: 98.5255 },
  { name: 'ระนอง', enName: 'Ranong', region: 'south', regionName: 'ภาคใต้', lat: 9.9529, lng: 98.6348, isFloodHotspot: true },
  { name: 'ชุมพร', enName: 'Chumphon', region: 'south', regionName: 'ภาคใต้', lat: 10.4930, lng: 99.1800, isFloodHotspot: true },
  { name: 'ตรัง', enName: 'Trang', region: 'south', regionName: 'ภาคใต้', lat: 7.5563, lng: 99.6114 },
  { name: 'พัทลุง', enName: 'Phatthalung', region: 'south', regionName: 'ภาคใต้', lat: 7.6166, lng: 100.0740, isFloodHotspot: true },
  { name: 'สตูล', enName: 'Satun', region: 'south', regionName: 'ภาคใต้', lat: 6.6238, lng: 100.0674, isFloodHotspot: true },
  { name: 'ปัตตานี', enName: 'Pattani', region: 'south', regionName: 'ภาคใต้', lat: 6.8696, lng: 101.2501, isFloodHotspot: true },
  { name: 'ยะลา', enName: 'Yala', region: 'south', regionName: 'ภาคใต้', lat: 6.5411, lng: 101.2813, isFloodHotspot: true },
  { name: 'นราธิวาส', enName: 'Narathiwat', region: 'south', regionName: 'ภาคใต้', lat: 6.4255, lng: 101.8253, isFloodHotspot: true },
];
