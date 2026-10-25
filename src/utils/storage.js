import { SAMPLE_HISTORY_PARTIES } from '../constants/sampleData';

const STORAGE_KEYS = {
  CURRENT_PARTY: 'pickle_current_party_v1',
  HISTORY: 'pickle_parties_history_v1',
  DEFAULT_BANK: 'pickle_default_bank_v1'
};

export const INITIAL_DEMO_PARTY = {
  id: 'party-demo-1',
  title: 'Giao Lưu Pickleball & Tiệc Lẩu Cuối Tuần',
  date: new Date().toISOString().split('T')[0],
  location: 'Sân Pickleball D-Sport (Sân 3)',
  organizerName: 'Quản Lý Sân',
  status: 'active', // active, settled
  paidStatus: {}, // memberId: boolean (đã thanh toán hay chưa)
  photos: [], // Danh sách ảnh chụp minh chứng hóa đơn/sân/tiệc
  bankInfo: {
    bankCode: 'MB',
    bankName: 'MBBank (Quân Đội)',
    accountNo: '0988889999',
    accountName: 'NGUYEN VAN QUAN LY'
  },
  members: [
    { id: 'm1', name: 'Nguyễn Văn Nam (Quản Lý)', phone: '0988889999', isDrinker: true, weight: 1 },
    { id: 'm2', name: 'Hoàng Long', phone: '0912345678', isDrinker: true, weight: 1 },
    { id: 'm3', name: 'Tuấn Kiệt', phone: '0903112233', isDrinker: true, weight: 1 },
    { id: 'm4', name: 'Chị Thảo Lê', phone: '0977665544', isDrinker: false, weight: 1 },
    { id: 'm5', name: 'Mai Anh', phone: '0933445566', isDrinker: false, weight: 1 },
    { id: 'm6', name: 'Dũng Béo', phone: '0944556677', isDrinker: true, weight: 1 },
    { id: 'm7', name: 'Huy Cường', phone: '0966778899', isDrinker: true, weight: 1 },
    { id: 'm8', name: 'Bác Hùng', phone: '0988112233', isDrinker: false, weight: 1 },
  ],
  expenses: [
    {
      id: 'e1',
      name: 'Tiền thuê sân 3 tiếng',
      amount: 600000,
      category: 'court',
      payerId: 'm1',
      splitType: 'all',
      customMembers: []
    },
    {
      id: 'e2',
      name: 'Tiền đèn chiếu sáng ban đêm',
      amount: 150000,
      category: 'light',
      payerId: 'm1',
      splitType: 'all',
      customMembers: []
    },
    {
      id: 'e3',
      name: 'Hộp bóng Franklin X-40 (3 quả)',
      amount: 120000,
      category: 'ball_equipment',
      payerId: 'm1',
      splitType: 'all',
      customMembers: []
    },
    {
      id: 'e4',
      name: 'Nước lọc & Revive tại sân',
      amount: 160000,
      category: 'soft_drink',
      payerId: 'm1',
      splitType: 'all',
      customMembers: []
    },
    {
      id: 'e5',
      name: 'Lẩu dê 7 món & đồ nướng liên hoan',
      amount: 1760000,
      category: 'food',
      payerId: 'm2', // Hoàng ứng
      splitType: 'all',
      customMembers: []
    },
    {
      id: 'e6',
      name: '2 Thùng bia Tiger bạc lon',
      amount: 840000,
      category: 'beer',
      payerId: 'm3', // Tuấn Kiệt ứng
      splitType: 'drinkers', // CHỈ NGƯỜI UỐNG BIA MỚI CHIA KHOẢN NÀY!
      customMembers: []
    },
    {
      id: 'e7',
      name: 'Nước ngọt, trà đá & khăn lạnh quán nhậu',
      amount: 110000,
      category: 'soft_drink',
      payerId: 'm4', // Chị Thảo ứng
      splitType: 'non_drinkers', // CHỈ NGƯỜI KHÔNG UỐNG BIA
      customMembers: []
    }
  ]
};

export const getSavedParty = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_PARTY);
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed && typeof parsed === 'object') {
        return {
          ...INITIAL_DEMO_PARTY,
          ...parsed,
          members: Array.isArray(parsed.members) && parsed.members.length > 0 ? parsed.members : INITIAL_DEMO_PARTY.members,
          expenses: Array.isArray(parsed.expenses) ? parsed.expenses : INITIAL_DEMO_PARTY.expenses,
          photos: Array.isArray(parsed.photos) ? parsed.photos : [],
          paidStatus: (parsed.paidStatus && typeof parsed.paidStatus === 'object') ? parsed.paidStatus : {},
          bankInfo: (parsed.bankInfo && parsed.bankInfo.accountNo) ? parsed.bankInfo : INITIAL_DEMO_PARTY.bankInfo
        };
      }
    }
  } catch (err) {
    console.error('Lỗi khi đọc party từ storage:', err);
  }
  return INITIAL_DEMO_PARTY;
};

export const saveParty = (party) => {
  try {
    if (party) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_PARTY, JSON.stringify(party));
    }
  } catch (err) {
    console.error('Lỗi khi lưu party vào storage:', err);
  }
};

export const getHistory = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    // Nếu chưa có lịch sử, khởi tạo với dữ liệu mẫu lịch sử
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(SAMPLE_HISTORY_PARTIES));
    return SAMPLE_HISTORY_PARTIES;
  } catch (err) {
    console.error('Lỗi khi đọc history:', err);
  }
  return SAMPLE_HISTORY_PARTIES;
};

export const saveToHistory = (party) => {
  try {
    if (!party || !party.id) return;
    const history = getHistory();
    const existingIndex = history.findIndex(p => p.id === party.id);
    let updated;
    if (existingIndex >= 0) {
      updated = [...history];
      updated[existingIndex] = party;
    } else {
      updated = [party, ...history];
    }
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated.slice(0, 30)));
  } catch (err) {
    console.error('Lỗi khi lưu history:', err);
  }
};

// Lấy tất cả các buổi tiệc (buổi hiện tại + lịch sử) không trùng id
export const getAllPartiesCombined = (currentParty) => {
  const history = getHistory();
  const map = new Map();
  if (currentParty && currentParty.id) {
    map.set(currentParty.id, currentParty);
  }
  if (Array.isArray(history)) {
    history.forEach(p => {
      if (p && p.id && !map.has(p.id)) {
        map.set(p.id, p);
      }
    });
  }
  return Array.from(map.values()).sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
};

export const getDefaultBank = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.DEFAULT_BANK);
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed && parsed.accountNo) return parsed;
    }
  } catch (err) {
    console.error('Lỗi khi đọc default bank:', err);
  }
  return INITIAL_DEMO_PARTY.bankInfo;
};

export const saveDefaultBank = (bankInfo) => {
  try {
    if (bankInfo) {
      localStorage.setItem(STORAGE_KEYS.DEFAULT_BANK, JSON.stringify(bankInfo));
    }
  } catch (err) {
    console.error('Lỗi khi lưu default bank:', err);
  }
};
