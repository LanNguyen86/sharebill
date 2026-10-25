import React, { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  Receipt, 
  Calculator, 
  AlertCircle, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  Download, 
  PlusCircle, 
  ArrowRight, 
  QrCode, 
  Copy, 
  Check, 
  Trophy, 
  Beer, 
  Coffee, 
  DollarSign, 
  Layers, 
  Camera, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { calculateDashboardStats, exportDashboardCSV } from '../utils/dashboardStats';
import { formatMoney, calculateBill } from '../utils/formatters';
import { QRModal } from './QRModal';
import brandLogo from '../assets/logo-pick247.png';

export const Dashboard = ({ 
  parties = [], 
  currentParty, 
  bankInfo, 
  onSelectParty, 
  onNewParty, 
  onUpdatePartyDebtPaid 
}) => {
  const [selectedQR, setSelectedQR] = useState(null);
  const [copiedDebtId, setCopiedDebtId] = useState(null);

  const safeParties = Array.isArray(parties) ? parties : [];
  const stats = calculateDashboardStats(safeParties);

  // Sao chép tin nhắn nhắc nợ gửi Zalo
  const handleCopyDebtReminder = (debt) => {
    if (!debt) return;
    let msg = `Chào ${debt.memberName} ơi! 🎾\n`;
    msg += `Khoản tiền tham gia buổi [${debt.partyTitle}] (${debt.partyDate}) của bạn là ${formatMoney(debt.amount)}.\n`;
    if (bankInfo && bankInfo.accountNo) {
      msg += `Bạn chuyển khoản giúp mình qua:\n`;
      msg += `🏦 ${bankInfo.bankName || bankInfo.bankCode} - STK: ${bankInfo.accountNo} (${bankInfo.accountName})\n`;
      msg += `📝 Nội dung: ${debt.memberName} Pickleball\n`;
    }
    msg += `Cảm ơn bạn nhiều nhé! 🙌`;

    navigator.clipboard.writeText(msg);
    setCopiedDebtId(debt.memberId + '_' + debt.partyId);
    setTimeout(() => setCopiedDebtId(null), 2500);
  };

  return (
    <div className="space-y-6 pb-8 animate-fadeIn">
      
      {/* 1. Header Banner Dashboard */}
      <div className="bg-gradient-to-r from-slate-950 via-teal-950 to-slate-900 text-white rounded-3xl p-5 sm:p-7 shadow-xl border border-emerald-600/30 flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
        <div className="relative z-10 flex items-start gap-4">
          {/* Logo PICK 247 trên Banner */}
          <div className="p-2 rounded-2xl bg-white shadow-lg shrink-0 hidden sm:flex items-center justify-center">
            <img
              src={brandLogo}
              alt="Logo PICK 247"
              className="h-12 w-auto object-contain"
            />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lime-400/20 text-lime-300 border border-lime-400/30 text-xs font-bold uppercase tracking-wider mb-2">
              <span>🎾</span> Sân Pickleball PICK 247 • Trung Tâm Điều Hành
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span>Báo Cáo Hoạt Động & Công Nợ</span>
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200/80 mt-1 max-w-xl">
              Tổng hợp dữ liệu dòng tiền, cơ cấu chi phí tiệc, phân loại đồ uống và theo dõi công nợ toàn bộ các buổi giao lưu tại PICK 247.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 relative z-10 shrink-0">
          <button
            onClick={() => exportDashboardCSV(safeParties, stats)}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-2 transition-all shadow-sm"
            title="Xuất file báo cáo tài chính định dạng Excel/CSV"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Xuất Excel / CSV</span>
          </button>

          <button
            onClick={onNewParty}
            className="px-4 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 shadow-lg shadow-lime-400/20 transition-all transform active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tạo Buổi Tiệc Mới</span>
          </button>
        </div>

        {/* Decorative Pickleball Court background shape */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-lime-400/5 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* 2. Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Tổng chi phí đã xử lý */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Tổng Dòng Tiền Đã Xử Lý</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {formatMoney(stats.totalMoney)}
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Đã thu: {formatMoney(stats.totalCollectedMoney)}</span>
            </div>
          </div>
        </div>

        {/* Số buổi tiệc & ảnh minh chứng */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Quy Mô Tổ Chức</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {stats.totalParties} buổi tiệc
            </div>
            <div className="text-[11px] text-purple-600 font-semibold mt-1 flex items-center gap-1">
              <Camera className="w-3.5 h-3.5" />
              <span>{stats.totalPhotos} ảnh hóa đơn & minh chứng</span>
            </div>
          </div>
        </div>

        {/* Người chơi tham gia */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Cộng Đồng Hội Viên</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {stats.uniquePlayersCount} người chơi
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">
              Thành viên thường xuyên giao lưu sân
            </div>
          </div>
        </div>

        {/* Công nợ chưa thu */}
        <div className={`rounded-2xl p-5 shadow-sm border flex flex-col justify-between transition-all ${
          stats.totalUncollectedMoney > 0 
            ? 'bg-rose-50/50 border-rose-200' 
            : 'bg-emerald-50/50 border-emerald-200'
        }`}>
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className={stats.totalUncollectedMoney > 0 ? 'text-rose-700' : 'text-emerald-700'}>
              Công Nợ Tồn Đọng
            </span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              stats.totalUncollectedMoney > 0 ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'
            }`}>
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className={`text-2xl font-black tracking-tight ${
              stats.totalUncollectedMoney > 0 ? 'text-rose-600' : 'text-emerald-600'
            }`}>
              {formatMoney(stats.totalUncollectedMoney)}
            </div>
            
            {/* Tỷ lệ thu hồi */}
            <div className="mt-2">
              <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                <span>Tỷ lệ thu hồi tiền:</span>
                <span className="font-bold text-slate-900">{stats.collectionRate}%</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    stats.collectionRate >= 90 ? 'bg-emerald-500' : stats.collectionRate >= 70 ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${stats.collectionRate}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 3. Cơ cấu chi phí & Phân loại món (Cost Breakdown) */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>📊</span> Cơ Cấu Chi Phí Qua Các Buổi
            </h3>
            <p className="text-xs text-slate-500">Tỷ trọng tiền sân, đồ ăn tiệc và bia rượu</p>
          </div>
          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
            Tổng cộng: {formatMoney(stats.totalMoney)}
          </span>
        </div>

        {/* Thanh tỷ lệ phần trăm đa màu (Stacked Progress Bar) */}
        <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
          <div 
            style={{ width: `${stats.courtPct}%` }} 
            className="bg-emerald-600 hover:opacity-90 transition-all" 
            title={`Tiền sân & Đèn: ${stats.courtPct}%`}
          />
          <div 
            style={{ width: `${stats.foodPct}%` }} 
            className="bg-orange-500 hover:opacity-90 transition-all" 
            title={`Đồ ăn & Tiệc lẩu: ${stats.foodPct}%`}
          />
          <div 
            style={{ width: `${stats.beerPct}%` }} 
            className="bg-amber-400 hover:opacity-90 transition-all" 
            title={`Bia & Đồ uống có cồn: ${stats.beerPct}%`}
          />
          <div 
            style={{ width: `${stats.otherPct}%` }} 
            className="bg-cyan-500 hover:opacity-90 transition-all" 
            title={`Khác & Nước ngọt: ${stats.otherPct}%`}
          />
        </div>

        {/* Chú giải chi tiết */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
          <div className="p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100">
            <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              <span>Sân, Đèn & Bóng:</span>
            </div>
            <div className="text-sm font-black text-slate-900 mt-1">
              {formatMoney(stats.totalCourtAndLight)}
            </div>
            <span className="text-[11px] text-emerald-700 font-medium">({stats.courtPct}%)</span>
          </div>

          <div className="p-2.5 rounded-xl bg-orange-50/50 border border-orange-100">
            <div className="flex items-center gap-1.5 text-orange-800 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
              <span>Mồi & Đồ ăn liên hoan:</span>
            </div>
            <div className="text-sm font-black text-slate-900 mt-1">
              {formatMoney(stats.totalFood)}
            </div>
            <span className="text-[11px] text-orange-700 font-medium">({stats.foodPct}%)</span>
          </div>

          <div className="p-2.5 rounded-xl bg-amber-50/50 border border-amber-100">
            <div className="flex items-center gap-1.5 text-amber-800 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span>Bia & Đồ uống có cồn:</span>
            </div>
            <div className="text-sm font-black text-slate-900 mt-1">
              {formatMoney(stats.totalBeer)}
            </div>
            <span className="text-[11px] text-amber-700 font-medium">({stats.beerPct}%)</span>
          </div>

          <div className="p-2.5 rounded-xl bg-cyan-50/50 border border-cyan-100">
            <div className="flex items-center gap-1.5 text-cyan-800 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span>
              <span>Nước ngọt & Khác:</span>
            </div>
            <div className="text-sm font-black text-slate-900 mt-1">
              {formatMoney(stats.totalOther)}
            </div>
            <span className="text-[11px] text-cyan-700 font-medium">({stats.otherPct}%)</span>
          </div>
        </div>
      </div>

      {/* 4. Công Nợ Cần Thu (🚨 Unpaid Debt Tracker) */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 sm:p-5 bg-gradient-to-r from-rose-50 to-amber-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold shadow-sm">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base text-slate-900">
                  Theo Dõi Công Nợ Chưa Thu
                </h3>
                <span className="bg-rose-100 text-rose-800 text-xs px-2 py-0.5 rounded-full font-bold">
                  {stats.unpaidDebtsList.length} khoản
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Tổng tiền cần thu hồi: <strong className="text-rose-600">{formatMoney(stats.totalUncollectedMoney)}</strong>
              </p>
            </div>
          </div>
        </div>

        {stats.unpaidDebtsList.length === 0 ? (
          <div className="text-center py-10 px-4 text-slate-400">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-emerald-500 stroke-1" />
            <p className="text-sm font-bold text-slate-800">Không có công nợ tồn đọng!</p>
            <p className="text-xs text-slate-400 mt-0.5">Tất cả người chơi đã thanh toán đầy đủ 100%.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {stats.unpaidDebtsList.map((debt, idx) => {
              const isCopied = copiedDebtId === (debt.memberId + '_' + debt.partyId);
              const initialLetter = debt.memberName ? debt.memberName.trim().charAt(0).toUpperCase() : '?';

              return (
                <div 
                  key={idx}
                  className="p-3.5 sm:p-4 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center text-xs shrink-0">
                      {initialLetter}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{debt.memberName}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                          {debt.isDrinker ? '🍺 Uống bia' : '🥤 Không cồn'}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="font-medium text-slate-700 truncate">{debt.partyTitle}</span>
                        <span>•</span>
                        <span className="text-slate-400">{debt.partyDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Nợ & Hành động */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                    <div className="text-right">
                      <span className="text-[11px] text-slate-400 block">Số tiền nợ</span>
                      <span className="text-base font-black text-rose-600">
                        {formatMoney(debt.amount)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Nút VietQR */}
                      <button
                        onClick={() => setSelectedQR({
                          debtor: { name: debt.memberName },
                          creditor: null,
                          amount: debt.amount,
                          partyTitle: debt.partyTitle
                        })}
                        className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 shadow-sm transition-transform active:scale-95"
                        title="Tạo mã VietQR cho người này quét nộp tiền"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Mã QR</span>
                      </button>

                      {/* Nút Nhắc nợ Zalo */}
                      <button
                        onClick={() => handleCopyDebtReminder(debt)}
                        className="px-2.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1 shadow-sm transition-transform active:scale-95"
                        title="Sao chép tin nhắn nhắc nộp tiền gửi qua Zalo"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-lime-300" /> : <Copy className="w-3.5 h-3.5" />}
                        <span className="hidden sm:inline">{isCopied ? 'Đã chép' : 'Nhắc Zalo'}</span>
                      </button>

                      {/* Nút Đã thu tiền */}
                      {onUpdatePartyDebtPaid && (
                        <button
                          onClick={() => onUpdatePartyDebtPaid(debt.partyId, debt.memberId)}
                          className="p-1.5 rounded-xl bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-700 transition-colors"
                          title="Xác nhận người này đã thanh toán xong"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. Hai cột: Top Hội viên & Danh sách các buổi tiệc gần đây */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Cột 1: Danh sách các buổi tiệc gần đây (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>Các Buổi Tiệc & Giao Lưu Gần Đây</span>
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              {safeParties.length} buổi
            </span>
          </div>

          <div className="space-y-2.5">
            {safeParties.map((p) => {
              if (!p) return null;
              const totalAmount = (p.expenses || []).reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
              const isCurrent = currentParty && currentParty.id === p.id;
              
              // Đếm số người nợ của party này
              const pSettlement = calculateBill(p.members || [], p.expenses || []);
              const pDebtors = (pSettlement && pSettlement.memberStats) ? pSettlement.memberStats.filter(m => Math.round(m.netBalance) < -100) : [];
              const pPaidCount = pDebtors.filter(d => p.paidStatus && p.paidStatus[d.id]).length;
              const pIsDone = pDebtors.length > 0 && pPaidCount === pDebtors.length;

              return (
                <div
                  key={p.id}
                  onClick={() => onSelectParty(p)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 group ${
                    isCurrent
                      ? 'bg-emerald-50/50 border-emerald-400 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50/80'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-emerald-700 truncate">
                        {p.title}
                      </h4>
                      {isCurrent && (
                        <span className="bg-lime-400 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                          Đang mở
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {p.date ? new Date(p.date).toLocaleDateString('vi-VN') : 'Hôm nay'}
                      </span>
                      <span>•</span>
                      <span>{p.members?.length || 0} người</span>
                      <span>•</span>
                      <span>{p.photos?.length || 0} ảnh</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-sm font-black text-slate-900">
                      {formatMoney(totalAmount)}
                    </div>
                    <div className="mt-0.5">
                      {pIsDone ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          Đã thu đủ 100%
                        </span>
                      ) : pDebtors.length > 0 ? (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                          Đã thu {pPaidCount}/{pDebtors.length}
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                          Chưa có chi phí
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cột 2: Bảng Xếp Hạng Hội Viên Thân Thiết (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Hội Viên Tích Cực Nhất</span>
            </h3>
            <span className="text-xs text-slate-400">Tham gia nhiều nhất</span>
          </div>

          <div className="space-y-2">
            {(stats.topPlayers || []).map((player, rank) => {
              return (
                <div 
                  key={rank}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center font-black text-[11px] shrink-0 ${
                      rank === 0 ? 'bg-amber-400 text-slate-950 shadow-sm' :
                      rank === 1 ? 'bg-slate-300 text-slate-900' :
                      rank === 2 ? 'bg-amber-700 text-white' :
                      'text-slate-500'
                    }`}>
                      {rank + 1}
                    </span>

                    <div className="min-w-0">
                      <div className="font-bold text-slate-800 truncate">{player.name}</div>
                      <div className="text-[10px] text-slate-400">
                        {player.isDrinker ? '🍺 Có cồn' : '🥤 Không cồn'}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-extrabold text-emerald-700 block">
                      {player.turnCount} buổi
                    </span>
                    <span className="text-[10px] text-slate-400">
                      ~ {formatMoney(player.totalCost)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* QR Modal khi bấm xem mã trả nợ */}
      {selectedQR && (
        <QRModal
          isOpen={true}
          onClose={() => setSelectedQR(null)}
          bankInfo={bankInfo}
          debtor={selectedQR.debtor}
          creditor={selectedQR.creditor}
          amount={selectedQR.amount}
          partyTitle={selectedQR.partyTitle || 'Pickleball'}
        />
      )}

    </div>
  );
};
