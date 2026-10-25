// Dữ liệu các buổi tiệc mẫu trong lịch sử để Dashboard hiển thị số liệu phân tích chân thực
export const SAMPLE_HISTORY_PARTIES = [
  {
    id: 'party-past-1',
    title: 'Giải Đấu Tứ Hùng & Tiệc Hải Sản',
    date: '2026-10-18',
    location: 'Sân Pickleball D-Sport (Sân 1 & 2)',
    organizerName: 'Quản Lý Sân',
    status: 'settled',
    photos: [
      {
        id: 'p_hist_1',
        caption: 'Hóa đơn hải sản Biển Đông',
        tag: 'bill',
        createdAt: '2026-10-18T21:30:00Z',
        dataUrl: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="100%" height="100%" fill="%23f1f5f9"/><text x="50%" y="40%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="18" fill="%23475569">Hoa don Hai San 2.450.000d</text><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="13" fill="%2394a3b8">Da thanh toan du</text></svg>'
      }
    ],
    paidStatus: { 'm_h1': true, 'm_h2': true, 'm_h3': true, 'm_h4': true, 'm_h5': true, 'm_h6': true },
    members: [
      { id: 'm_h1', name: 'Nguyễn Văn Nam (Quản Lý)', phone: '0988889999', isDrinker: true, weight: 1 },
      { id: 'm_h2', name: 'Hoàng Long', phone: '0912345678', isDrinker: true, weight: 1 },
      { id: 'm_h3', name: 'Tuấn Kiệt', phone: '0903112233', isDrinker: true, weight: 1 },
      { id: 'm_h4', name: 'Chị Thảo Lê', phone: '0977665544', isDrinker: false, weight: 1 },
      { id: 'm_h5', name: 'Quốc Bảo', phone: '0938887766', isDrinker: true, weight: 1 },
      { id: 'm_h6', name: 'Văn Đức', phone: '0944112233', isDrinker: false, weight: 1 }
    ],
    expenses: [
      { id: 'e_h1', name: 'Thuê 2 sân thi đấu 3 tiếng', amount: 960000, category: 'court', payerId: 'm_h1', splitType: 'all' },
      { id: 'e_h2', name: 'Đèn cao áp 2 sân', amount: 240000, category: 'light', payerId: 'm_h1', splitType: 'all' },
      { id: 'e_h3', name: 'Mâm tiệc cua, tôm, mực nướng', amount: 2450000, category: 'food', payerId: 'm_h2', splitType: 'all' },
      { id: 'e_h4', name: '2 Thùng bia Heineken', amount: 920000, category: 'beer', payerId: 'm_h3', splitType: 'drinkers' },
      { id: 'e_h5', name: 'Nước ép trái cây & nước suối', amount: 150000, category: 'soft_drink', payerId: 'm_h4', splitType: 'non_drinkers' }
    ]
  },
  {
    id: 'party-past-2',
    title: 'Giao Lưu Pickleball Thứ 4 & Bò Nướng',
    date: '2026-10-14',
    location: 'Sân Pickleball D-Sport (Sân 3)',
    organizerName: 'Quản Lý Sân',
    status: 'pending',
    photos: [],
    paidStatus: { 'm_p1': true, 'm_p2': true, 'm_p3': false }, // m_p3 còn nợ
    members: [
      { id: 'm_p1', name: 'Nguyễn Văn Nam (Quản Lý)', phone: '0988889999', isDrinker: true, weight: 1 },
      { id: 'm_p2', name: 'Mai Anh', phone: '0933445566', isDrinker: false, weight: 1 },
      { id: 'm_p3', name: 'Dũng Béo', phone: '0944556677', isDrinker: true, weight: 1 },
      { id: 'm_p4', name: 'Huy Cường', phone: '0966778899', isDrinker: true, weight: 1 }
    ],
    expenses: [
      { id: 'e_p1', name: 'Thuê sân 2 tiếng', amount: 360000, category: 'court', payerId: 'm_p1', splitType: 'all' },
      { id: 'e_p2', name: 'Bò nướng tảng & nầm', amount: 880000, category: 'food', payerId: 'm_p1', splitType: 'all' },
      { id: 'e_p3', name: '1 Thùng bia Tiger', amount: 410000, category: 'beer', payerId: 'm_p3', splitType: 'drinkers' }
    ]
  }
];
