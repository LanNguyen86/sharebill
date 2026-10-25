import React, { useState } from 'react';
import { 
  Calculator, 
  CheckCircle2, 
  Circle, 
  QrCode, 
  Beer, 
  Coffee, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  TrendingUp,
  ReceiptText,
  BadgeAlert
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatMoney } from '../utils/formatters';
import { QRModal } from './QRModal';

export const SettlementSummary = ({ 
  party, 
  settlement, 
  bankInfo, 
  paidStatus = {}, 
  onTogglePaid 
}) => {
  const [selectedQR, setSelectedQR] = useState(null); // { debtor, creditor, amount }
  const [expandedMemberId, setExpandedMemberId] = useState(null);

  const { totalExpenses, memberStats, debts } = settlement;

  // Tính số người nợ đã thanh toán
  const debtorsList = memberStats.filter(m => Math.round(m.netBalance) < -100);
  const paidCount = debtorsList.filter(d => paidStatus[d.id]).length;
  const isAllPaid = debtorsList.length > 0 && paidCount === debtorsList.length;

  // Xử lý khi tick thanh toán
  const handlePaidToggle = (memberId) => {
    const nextState = !paidStatus[memberId];
    onTogglePaid(memberId, nextState);

    // Nếu vừa đánh dấu hoàn thành người cuối cùng
    if (nextState && paidCount + 1 === debtorsList.length) {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  // Tính mức trung bình
  const drinkers = memberStats.filter(m => m.isDrinker);
  const nonDrinkers = memberStats.filter(m => !m.isDrinker);

  const avgDrinkerCost = drinkers.length > 0 
    ? drinkers.reduce((sum, d) => sum + d.totalCost, 0) / drinkers.length 
    : 0;

  const avgNonDrinkerCost = nonDrinkers.length > 0 
    ? nonDrinkers.reduce((sum, nd) => sum + nd.totalCost, 0) / nonDrinkers.length 
    : 0;

  return (
    <div className="space-y-6">
      
      {/* 1. Thống kê tổng quan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Tổng tiền */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-800 text-white rounded-2xl p-4 shadow-sm border border-emerald-500/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-emerald-100">Tổng Chi Phí Buổi Tiệc</span>
            <span className="p-1.5 bg-white/10 rounded-lg text-lime-300">
              <Calculator className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black mt-2 tracking-tight">
            {formatMoney(totalExpenses)}
          </div>
          <div className="text-[11px] text-emerald-200 mt-1">
            Gồm {party.expenses?.length || 0} dịch vụ & món ăn
          </div>
        </div>

        {/* Mức chia người uống bia */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-amber-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
              <Beer className="w-3.5 h-3.5 text-amber-500" />
              Mỗi người uống bia ({drinkers.length})
            </span>
            <span className="p-1.5 bg-amber-50 rounded-lg text-amber-600">
              🍺
            </span>
          </div>
          <div className="text-xl font-extrabold text-amber-600 mt-2">
            ~ {formatMoney(avgDrinkerCost)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Gồm tiền sân, ăn + bia/rượu
          </div>
        </div>

        {/* Mức chia người không cồn */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-cyan-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
              <Coffee className="w-3.5 h-3.5 text-cyan-600" />
              Mỗi người không cồn ({nonDrinkers.length})
            </span>
            <span className="p-1.5 bg-cyan-50 rounded-lg text-cyan-600">
              🥤
            </span>
          </div>
          <div className="text-xl font-extrabold text-cyan-700 mt-2">
            ~ {formatMoney(avgNonDrinkerCost)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Đã trừ tiền bia, công bằng 100%
          </div>
        </div>

        {/* Tiến độ thu tiền */}
        <div className={`rounded-2xl p-4 shadow-sm border transition-all ${
          isAllPaid 
            ? 'bg-gradient-to-br from-lime-500 to-emerald-600 text-white border-lime-400' 
            : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-medium ${isAllPaid ? 'text-lime-100' : 'text-slate-500'}`}>
              Tiến Độ Thu Tiền
            </span>
            <span className={`p-1.5 rounded-lg ${isAllPaid ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className={`text-xl font-extrabold mt-2 ${isAllPaid ? 'text-white' : 'text-slate-900'}`}>
            {paidCount} / {debtorsList.length} người
          </div>
          <div className={`text-[11px] mt-1 ${isAllPaid ? 'text-lime-100 font-semibold' : 'text-slate-400'}`}>
            {isAllPaid ? '🎉 Đã thu đủ 100% tiền tiệc!' : `Còn ${debtorsList.length - paidCount} người chưa nộp`}
          </div>
        </div>
      </div>

      {/* 2. Bảng phân bổ chi tiết từng thành viên */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-50 to-slate-100/60 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-lime-400 flex items-center justify-center font-bold">
              <ReceiptText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Chi Tiết Chia Tiền Từng Người</h3>
              <p className="text-xs text-slate-500">Bấm "Mã QR" để người tham gia quét app ngân hàng trả ngay</p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {memberStats.map((member) => {
            const net = Math.round(member.netBalance);
            const isDebtor = net < -100;
            const isCreditor = net > 100;
            const isSettled = !isDebtor && !isCreditor;
            const isPaid = !!paidStatus[member.id];
            const isExpanded = expandedMemberId === member.id;

            return (
              <div 
                key={member.id} 
                className={`transition-colors ${
                  isPaid ? 'bg-emerald-50/20' : 'hover:bg-slate-50/80'
                }`}
              >
                <div className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Left: Member info */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Checkbox đã nộp (chỉ áp dụng cho người nợ tiền) */}
                    {isDebtor ? (
                      <button
                        onClick={() => handlePaidToggle(member.id)}
                        className={`w-6 h-6 rounded-full flex items-center justify-center transition-all shrink-0 ${
                          isPaid
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'border-2 border-slate-300 hover:border-emerald-500 text-transparent'
                        }`}
                        title={isPaid ? 'Đã thu tiền (Bấm để hủy)' : 'Chưa thu tiền (Bấm để xác nhận đã nộp)'}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    ) : (
                      <div className="w-6 h-6 flex items-center justify-center shrink-0">
                        <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-sm ${isPaid ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                          {member.name}
                        </span>
                        
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold flex items-center gap-0.5 ${
                          member.isDrinker 
                            ? 'bg-amber-100 text-amber-800' 
                            : 'bg-cyan-100 text-cyan-800'
                        }`}>
                          {member.isDrinker ? '🍺 Uống bia' : '🥤 Không cồn'}
                        </span>

                        {member.weight !== 1 && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                            {member.weight} suất
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span>Chi phí: <strong>{formatMoney(member.totalCost)}</strong></span>
                        {member.totalPaid > 0 && (
                          <>
                            <span>•</span>
                            <span className="text-teal-700">Đã ứng: <strong>{formatMoney(member.totalPaid)}</strong></span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Net Balance & Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                    {/* Số tiền cần nộp hoặc nhận lại */}
                    <div className="text-right">
                      {isDebtor ? (
                        <div>
                          <span className="text-xs text-rose-500 font-semibold block">Cần nộp</span>
                          <span className="text-base font-extrabold text-rose-600">
                            {formatMoney(Math.abs(net))}
                          </span>
                        </div>
                      ) : isCreditor ? (
                        <div>
                          <span className="text-xs text-emerald-600 font-semibold block">Được nhận lại</span>
                          <span className="text-base font-extrabold text-emerald-600">
                            +{formatMoney(net)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                          Hòa tiền
                        </span>
                      )}
                    </div>

                    {/* Button QR Chuyển khoản (Cho người nợ) */}
                    {isDebtor && (
                      <button
                        type="button"
                        onClick={() => setSelectedQR({
                          debtor: member,
                          creditor: null,
                          amount: Math.abs(net)
                        })}
                        className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 shadow-sm transition-transform active:scale-95"
                        title="Tạo mã VietQR quét trả tiền"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>Mã QR</span>
                      </button>
                    )}

                    {/* Toggle Breakdown */}
                    <button
                      onClick={() => setExpandedMemberId(isExpanded ? null : member.id)}
                      className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                      title="Xem các món chi tiết của người này"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Chi tiết Breakdown dropdown */}
                {isExpanded && (
                  <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-600 space-y-1.5 animate-fadeIn">
                    <p className="font-bold text-slate-700 text-[11px] uppercase tracking-wider">
                      Các khoản cấu thành ({member.breakdown.length} mục):
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                      {member.breakdown.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-white p-2 rounded-lg border border-slate-200">
                          <span className="truncate pr-2">{item.expenseName}</span>
                          <span className="font-semibold text-slate-800 shrink-0">
                            {formatMoney(item.myShare)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Lộ trình thanh toán tối ưu (Debt Minimization) */}
      {debts.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2">
              <span className="text-lg">⚡</span>
              <div>
                <h4 className="font-bold text-sm text-slate-900">Cách Chuyển Khoản Tối Ưu Nhất</h4>
                <p className="text-xs text-slate-500">
                  Rút gọn tối đa số lần chuyển khoản giữa các thành viên
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {debts.map((debt, index) => (
              <div 
                key={index} 
                className="p-3 bg-slate-50 hover:bg-emerald-50/50 rounded-xl border border-slate-200 flex items-center justify-between gap-2 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0 text-xs">
                  <span className="font-bold text-slate-800 truncate">{debt.fromName}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-bold text-emerald-700 truncate">{debt.toName}</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-extrabold text-xs text-slate-900">
                    {formatMoney(debt.amount)}
                  </span>
                  <button
                    onClick={() => setSelectedQR({
                      debtor: { name: debt.fromName },
                      creditor: { name: debt.toName },
                      amount: debt.amount
                    })}
                    className="p-1 rounded-lg bg-white border border-slate-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300"
                    title="Mã QR"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QR Modal */}
      {selectedQR && (
        <QRModal
          isOpen={true}
          onClose={() => setSelectedQR(null)}
          bankInfo={bankInfo}
          debtor={selectedQR.debtor}
          creditor={selectedQR.creditor}
          amount={selectedQR.amount}
          partyTitle={party.title}
        />
      )}

    </div>
  );
};
