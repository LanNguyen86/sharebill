// Danh sách các ngân hàng tại Việt Nam hỗ trợ VietQR
export const VIETNAMESE_BANKS = [
  { code: 'MB', name: 'MBBank (Quân Đội)', bin: '970422', shortName: 'MB' },
  { code: 'VCB', name: 'Vietcombank', bin: '970436', shortName: 'Vietcombank' },
  { code: 'TCB', name: 'Techcombank', bin: '970407', shortName: 'Techcombank' },
  { code: 'BIDV', name: 'BIDV (Đầu Tư & Phát Triển)', bin: '970418', shortName: 'BIDV' },
  { code: 'ICB', name: 'VietinBank', bin: '970415', shortName: 'VietinBank' },
  { code: 'ACB', name: 'ACB (Á Châu)', bin: '970416', shortName: 'ACB' },
  { code: 'VPB', name: 'VPBank', bin: '970432', shortName: 'VPBank' },
  { code: 'TPB', name: 'TPBank (Tiên Phong)', bin: '970423', shortName: 'TPBank' },
  { code: 'STB', name: 'Sacombank', bin: '970403', shortName: 'Sacombank' },
  { code: 'HDB', name: 'HDBank', bin: '970437', shortName: 'HDBank' },
  { code: 'VIB', name: 'VIB (Quốc Tế)', bin: '970441', shortName: 'VIB' },
  { code: 'MSB', name: 'MSB (Hàng Hải)', bin: '970426', shortName: 'MSB' },
  { code: 'OCB', name: 'OCB (Phương Đông)', bin: '970448', shortName: 'OCB' },
  { code: 'SHB', name: 'SHB (Sài Gòn - Hà Nội)', bin: '970443', shortName: 'SHB' },
  { code: 'LPB', name: 'LPBank (Lộc Phát VN)', bin: '970449', shortName: 'LPBank' },
  { code: 'SEAB', name: 'SeABank', bin: '970440', shortName: 'SeABank' },
  { code: 'VBA', name: 'Agribank (Nông Nghiệp)', bin: '970405', shortName: 'Agribank' }
];

export const EXPENSE_CATEGORIES = [
  { id: 'court', label: 'Tiền sân Pickleball', icon: '🎾', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  { id: 'light', label: 'Tiền đèn chiếu sáng', icon: '💡', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  { id: 'ball_equipment', label: 'Bóng & Thuê vợt', icon: '🏓', color: 'bg-lime-100 text-lime-800 border-lime-300' },
  { id: 'food', label: 'Đồ ăn / Mồi nhậu', icon: '🍲', color: 'bg-orange-100 text-orange-800 border-orange-300' },
  { id: 'beer', label: 'Bia / Đồ uống có cồn', icon: '🍺', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  { id: 'soft_drink', label: 'Nước ngọt / Nước suối', icon: '🥤', color: 'bg-cyan-100 text-cyan-800 border-cyan-300' },
  { id: 'service', label: 'Phí dịch vụ / Khác', icon: '🧾', color: 'bg-purple-100 text-purple-800 border-purple-300' },
];

export const DEFAULT_QUICK_SERVICES = [
  { name: 'Tiền thuê sân (2 tiếng)', category: 'court', amount: 360000, splitType: 'all' },
  { name: 'Bóng Pickleball (3 quả)', category: 'ball_equipment', amount: 105000, splitType: 'all' },
  { name: 'Nước lọc / Revive bù khoáng', category: 'soft_drink', amount: 90000, splitType: 'all' },
  { name: 'Lẩu gà lá é & đồ nhắm', category: 'food', amount: 650000, splitType: 'all' },
  { name: 'Thùng bia Tiger bạc', category: 'beer', amount: 420000, splitType: 'drinkers' },
];
