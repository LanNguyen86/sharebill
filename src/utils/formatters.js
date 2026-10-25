// Format tiền tệ Việt Nam (VND)
export const formatMoney = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '0 đ';
  const rounded = Math.round(amount);
  return new Intl.NumberFormat('vi-VN').format(rounded) + ' đ';
};

// Parse chuỗi số tiền thông minh (hỗ trợ 150k, 1.5m, 1tr2, dấu chấm, dấu phẩy)
export const parseSmartMoney = (input) => {
  if (!input) return 0;
  if (typeof input === 'number') return Math.max(0, input);
  
  let str = input.toString().trim().toLowerCase();
  
  // Xử lý 1tr2, 2tr5
  const trRegex = /^(\d+)(tr|m)(\d+)?$/;
  const trMatch = str.match(trRegex);
  if (trMatch) {
    const million = parseInt(trMatch[1], 10) * 1000000;
    const sub = trMatch[3] ? parseInt(trMatch[3], 10) * 100000 : 0;
    return million + sub;
  }
  
  // Xử lý có chữ k hoặc nghìn
  if (str.endsWith('k') || str.endsWith('nghin') || str.endsWith('nghìn')) {
    const num = parseFloat(str.replace(/[^\d.]/g, ''));
    return isNaN(num) ? 0 : Math.round(num * 1000);
  }
  
  // Xử lý có chữ tr hoặc triệu hoặc m
  if (str.endsWith('tr') || str.endsWith('trieu') || str.endsWith('triệu') || str.endsWith('m')) {
    const num = parseFloat(str.replace(/[^\d.]/g, ''));
    return isNaN(num) ? 0 : Math.round(num * 1000000);
  }

  // Loại bỏ các ký tự không phải số
  const cleanStr = str.replace(/[^\d]/g, '');
  const parsed = parseInt(cleanStr, 10);
  return isNaN(parsed) ? 0 : parsed;
};

// Thuật toán chia bill thông minh
export const calculateBill = (members, expenses) => {
  // 1. Khởi tạo thống kê cho từng người
  const memberStats = {};
  members.forEach(m => {
    memberStats[m.id] = {
      id: m.id,
      name: m.name,
      phone: m.phone || '',
      isDrinker: !!m.isDrinker,
      weight: m.weight !== undefined ? m.weight : 1, // trọng số (1 suất, 0.5 suất)
      totalPaid: 0, // Đã ứng trước
      totalCost: 0, // Chi phí phải gánh
      netBalance: 0, // totalPaid - totalCost (Dương: nhận lại, Âm: phải nộp)
      breakdown: [] // Danh sách từng khoản chi tiết
    };
  });

  let totalExpenses = 0;

  // 2. Tính toán từng khoản chi
  expenses.forEach(exp => {
    const amount = Number(exp.amount) || 0;
    totalExpenses += amount;

    // Cộng số tiền người đã ứng trước
    if (exp.payerId && memberStats[exp.payerId]) {
      memberStats[exp.payerId].totalPaid += amount;
    }

    // Xác định danh sách người chịu khoản này
    let targetMemberIds = [];

    if (exp.splitType === 'all') {
      // Chia đều cho tất cả mọi người có mặt
      targetMemberIds = members.map(m => m.id);
    } else if (exp.splitType === 'drinkers') {
      // Chỉ người uống bia / cồn
      targetMemberIds = members.filter(m => m.isDrinker).map(m => m.id);
      // Nếu không ai được đánh dấu là uống bia thì fallback về tất cả
      if (targetMemberIds.length === 0) {
        targetMemberIds = members.map(m => m.id);
      }
    } else if (exp.splitType === 'non_drinkers') {
      // Chỉ người không uống bia
      targetMemberIds = members.filter(m => !m.isDrinker).map(m => m.id);
      if (targetMemberIds.length === 0) {
        targetMemberIds = members.map(m => m.id);
      }
    } else if (exp.splitType === 'custom' && Array.isArray(exp.customMembers) && exp.customMembers.length > 0) {
      targetMemberIds = exp.customMembers;
    } else {
      targetMemberIds = members.map(m => m.id);
    }

    // Tính tổng trọng số của nhóm chịu chi phí này
    const totalWeight = targetMemberIds.reduce((sum, id) => {
      const mem = memberStats[id];
      return sum + (mem ? mem.weight : 1);
    }, 0);

    // Phân bổ chi phí cho từng người
    if (totalWeight > 0) {
      targetMemberIds.forEach(id => {
        const mem = memberStats[id];
        if (mem) {
          const share = (amount * mem.weight) / totalWeight;
          mem.totalCost += share;
          mem.breakdown.push({
            expenseId: exp.id,
            expenseName: exp.name,
            totalExpenseAmount: amount,
            myShare: share,
            category: exp.category
          });
        }
      });
    }
  });

  // 3. Tính netBalance cho từng người
  Object.values(memberStats).forEach(mem => {
    mem.netBalance = mem.totalPaid - mem.totalCost;
  });

  // 4. Thuật toán tối giản số lượng giao dịch chuyển khoản (Minimizing Cash Flow)
  const debts = []; // { fromId, toId, fromName, toName, amount }

  // Phân loại người nợ (debtors: netBalance < 0) và người nhận (creditors: netBalance > 0)
  const debtors = [];
  const creditors = [];

  Object.values(memberStats).forEach(mem => {
    const roundedNet = Math.round(mem.netBalance);
    if (roundedNet < -100) { // Sai số làm tròn < 100đ
      debtors.push({ id: mem.id, name: mem.name, amount: -roundedNet });
    } else if (roundedNet > 100) {
      creditors.push({ id: mem.id, name: mem.name, amount: roundedNet });
    }
  });

  // Sắp xếp giảm dần theo số tiền
  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);

  let i = 0; // Con trỏ debtors
  let j = 0; // Con trỏ creditors

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];

    const transferAmount = Math.min(debtor.amount, creditor.amount);
    if (transferAmount > 100) {
      debts.push({
        fromId: debtor.id,
        fromName: debtor.name,
        toId: creditor.id,
        toName: creditor.name,
        amount: Math.round(transferAmount)
      });
    }

    debtor.amount -= transferAmount;
    creditor.amount -= transferAmount;

    if (debtor.amount < 100) i++;
    if (creditor.amount < 100) j++;
  }

  return {
    totalExpenses,
    memberStats: Object.values(memberStats),
    debts
  };
};

// Tạo format tin nhắn gửi qua Zalo
export const generateZaloMessage = (party, members, expenses, settlement, bankInfo) => {
  const dateStr = party.date ? new Date(party.date).toLocaleDateString('vi-VN') : 'Hôm nay';
  const photoCount = party.photos?.length || 0;
  
  let msg = `🎾🍻 PICK 247 - TỔNG KẾT CHI PHÍ SÂN & LIÊN HOAN 🍻🎾\n`;
  msg += `📌 Buổi: ${party.title || 'Giao lưu Pickleball'}\n`;
  msg += `📅 Ngày: ${dateStr}\n`;
  msg += `📍 Sân: ${party.location || 'Sân Pickleball PICK 247'}\n`;
  msg += `👥 Số người tham gia: ${members.length} người\n`;
  if (photoCount > 0) {
    msg += `📸 Minh chứng đính kèm: ${photoCount} ảnh hóa đơn & bill sân\n`;
  }
  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  
  msg += `💰 1. CHI TIẾT CÁC KHOẢN CHI:\n`;
  expenses.forEach((exp, idx) => {
    let splitNote = '';
    if (exp.splitType === 'drinkers') splitNote = ' (chỉ người uống bia)';
    else if (exp.splitType === 'non_drinkers') splitNote = ' (chỉ người nước ngọt)';
    else if (exp.splitType === 'custom') splitNote = ` (${exp.customMembers?.length || 0} người)`;
    
    msg += ` ${idx + 1}. ${exp.name}: ${formatMoney(exp.amount)}${splitNote}\n`;
  });
  
  msg += `👉 TỔNG CỘNG: ${formatMoney(settlement.totalExpenses)}\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  
  msg += `📋 2. CHI PHÍ TỪNG THÀNH VIÊN:\n`;
  settlement.memberStats.forEach(mem => {
    const net = Math.round(mem.netBalance);
    const tag = mem.isDrinker ? '🍺 Có cồn' : '🥤 Không cồn';
    
    if (net < -100) {
      msg += `🔴 ${mem.name} (${tag}): Cần nộp ${formatMoney(Math.abs(net))}\n`;
    } else if (net > 100) {
      msg += `🟢 ${mem.name}: Đã ứng trước ${formatMoney(mem.totalPaid)} ➔ Nhận lại ${formatMoney(net)}\n`;
    } else {
      msg += `⚪ ${mem.name}: Đã xong (Hòa tiền)\n`;
    }
  });
  
  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `📲 3. THÔNG TIN CHUYỂN KHOẢN:\n`;
  if (bankInfo && bankInfo.accountNo) {
    msg += `🏦 Ngân hàng: ${bankInfo.bankName || bankInfo.bankCode}\n`;
    msg += `💳 STK: ${bankInfo.accountNo}\n`;
    msg += `👤 Chủ TK: ${bankInfo.accountName}\n`;
    msg += `📝 Nội dung CK: [Tên của bạn] Pickleball\n`;
  } else {
    msg += `Vui lòng chuyển khoản cho Thủ quỹ / Người ứng trước!\n`;
  }
  
  msg += `\nSân Pickleball PICK 247 cảm ơn cả nhà đã tham gia! Hẹn gặp lại trận sau! 🚀🎾`;
  return msg;
};
