import { calculateBill } from './formatters';

export const calculateDashboardStats = (parties = []) => {
  let totalMoney = 0;
  let totalCourtAndLight = 0;
  let totalFood = 0;
  let totalBeer = 0;
  let totalOther = 0;
  let totalPhotos = 0;

  const playerTurnMap = {}; // Tên/ID -> { name, turnCount, totalPaid, totalOwed, drinkerCount }
  const unpaidDebtsList = []; // Danh sách người còn nợ chưa nộp

  let totalCollectedMoney = 0;
  let totalUncollectedMoney = 0;

  if (Array.isArray(parties)) {
    parties.forEach(party => {
      if (!party) return;
      const expenses = Array.isArray(party.expenses) ? party.expenses : [];
      const members = Array.isArray(party.members) ? party.members : [];
      const paidStatus = (party.paidStatus && typeof party.paidStatus === 'object') ? party.paidStatus : {};
      const photos = Array.isArray(party.photos) ? party.photos : [];

      totalPhotos += photos.length;

      // Chi phí từng mục
      expenses.forEach(e => {
        if (!e) return;
        const amount = Number(e.amount) || 0;
        totalMoney += amount;

        if (e.category === 'court' || e.category === 'light' || e.category === 'ball_equipment') {
          totalCourtAndLight += amount;
        } else if (e.category === 'food') {
          totalFood += amount;
        } else if (e.category === 'beer') {
          totalBeer += amount;
        } else {
          totalOther += amount;
        }
      });

      // Tính toán bill cho buổi tiệc này để xem công nợ
      const partySettlement = calculateBill(members, expenses);

      if (partySettlement && Array.isArray(partySettlement.memberStats)) {
        partySettlement.memberStats.forEach(mem => {
          if (!mem || !mem.name) return;
          // Cập nhật thống kê người chơi
          if (!playerTurnMap[mem.name]) {
            playerTurnMap[mem.name] = {
              name: mem.name,
              phone: mem.phone || '',
              turnCount: 0,
              totalCost: 0,
              isDrinker: !!mem.isDrinker
            };
          }
          playerTurnMap[mem.name].turnCount += 1;
          playerTurnMap[mem.name].totalCost += (Number(mem.totalCost) || 0);

          // Kiểm tra công nợ
          const net = Math.round(Number(mem.netBalance) || 0);
          if (net < -100) {
            const debtAmount = Math.abs(net);
            const isPaid = !!paidStatus[mem.id];

            if (isPaid) {
              totalCollectedMoney += debtAmount;
            } else {
              totalUncollectedMoney += debtAmount;
              unpaidDebtsList.push({
                partyId: party.id || 'p_' + Math.random(),
                partyTitle: party.title || 'Buổi giao lưu',
                partyDate: party.date || 'Hôm nay',
                memberId: mem.id,
                memberName: mem.name,
                phone: mem.phone || '',
                isDrinker: !!mem.isDrinker,
                amount: debtAmount
              });
            }
          }
        });
      }
    });
  }

  // Top người chơi tham gia nhiều nhất
  const topPlayers = Object.values(playerTurnMap)
    .sort((a, b) => b.turnCount - a.turnCount || b.totalCost - a.totalCost)
    .slice(0, 10);

  // Tỷ lệ thu hồi tiền
  const totalDebtAmount = totalCollectedMoney + totalUncollectedMoney;
  const collectionRate = totalDebtAmount > 0 
    ? Math.round((totalCollectedMoney / totalDebtAmount) * 100) 
    : 100;

  // Tỷ lệ chi phí theo danh mục (%)
  const courtPct = totalMoney > 0 ? Math.round((totalCourtAndLight / totalMoney) * 100) : 0;
  const foodPct = totalMoney > 0 ? Math.round((totalFood / totalMoney) * 100) : 0;
  const beerPct = totalMoney > 0 ? Math.round((totalBeer / totalMoney) * 100) : 0;
  const otherPct = Math.max(0, 100 - courtPct - foodPct - beerPct);

  return {
    totalParties: Array.isArray(parties) ? parties.length : 0,
    totalMoney,
    totalCourtAndLight,
    totalFood,
    totalBeer,
    totalOther,
    totalPhotos,
    courtPct,
    foodPct,
    beerPct,
    otherPct,
    totalUncollectedMoney,
    totalCollectedMoney,
    collectionRate,
    unpaidDebtsList,
    uniquePlayersCount: Object.keys(playerTurnMap).length,
    topPlayers
  };
};

// Xuất file CSV báo cáo tài chính
export const exportDashboardCSV = (parties = [], stats) => {
  if (!stats) return;
  let csv = "\uFEFF"; // UTF-8 BOM để Excel hiển thị tiếng Việt không bị lỗi font
  csv += "BÁO CÁO TỔNG HỢP QUẢN LÝ SÂN PICKLEBALL & LIÊN HOAN\n";
  csv += `Ngày xuất: ${new Date().toLocaleDateString('vi-VN')}\n`;
  csv += `Tổng số buổi tiệc: ${stats.totalParties}\n`;
  csv += `Tổng dòng tiền chi phí: ${stats.totalMoney} đ\n`;
  csv += `Tiền sân & đèn: ${stats.totalCourtAndLight} đ\n`;
  csv += `Tiền đồ ăn lẩu/nướng: ${stats.totalFood} đ\n`;
  csv += `Tiền bia rượu: ${stats.totalBeer} đ\n`;
  csv += `Tổng tiền còn nợ chưa thu: ${stats.totalUncollectedMoney} đ\n`;
  csv += `Tỷ lệ thu tiền: ${stats.collectionRate}%\n\n`;

  csv += "DANH SÁCH CÁC BUỔI TIỆC GIAO LƯU:\n";
  csv += "STT,Tên Buổi Tiệc,Ngày,Địa Điểm,Số Người,Tổng Tiền,Trạng Thái\n";

  if (Array.isArray(parties)) {
    parties.forEach((p, idx) => {
      if (!p) return;
      const total = (p.expenses || []).reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
      csv += `${idx + 1},"${p.title || ''}","${p.date || ''}","${p.location || ''}",${p.members?.length || 0},${total},"${p.status === 'settled' ? 'Đã hoàn tất' : 'Đang xử lý'}"\n`;
    });
  }

  csv += "\nDANH SÁCH CÔNG NỢ CHƯA THU:\n";
  csv += "Tên Người Chơi,Số Tiền Nợ,Tên Buổi Tiệc,Ngày\n";
  if (Array.isArray(stats.unpaidDebtsList)) {
    stats.unpaidDebtsList.forEach(d => {
      csv += `"${d.memberName}",${d.amount},"${d.partyTitle}","${d.partyDate}"\n`;
    });
  }

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `Bao-Cao-Quan-Ly-Pickleball-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
};
