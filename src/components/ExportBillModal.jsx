import React, { useRef, useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Download, 
  Share2, 
  Trophy, 
  Sparkles,
  Calendar,
  MapPin,
  Beer,
  Coffee,
  Receipt
} from 'lucide-react';
import { toPng } from 'html-to-image';
import { formatMoney, generateZaloMessage } from '../utils/formatters';
import brandLogo from '../assets/logo-pick247.png';

export const ExportBillModal = ({ 
  isOpen, 
  onClose, 
  party, 
  members, 
  expenses, 
  photos = [],
  settlement, 
  bankInfo 
}) => {
  const billRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [isExportingImg, setIsExportingImg] = useState(false);

  if (!isOpen) return null;

  const zaloMessage = generateZaloMessage(party, members, expenses, settlement, bankInfo);

  // Copy tin nhắn Zalo
  const handleCopyZalo = () => {
    navigator.clipboard.writeText(zaloMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Tải ảnh hóa đơn PNG
  const handleDownloadImage = async () => {
    if (!billRef.current) return;
    try {
      setIsExportingImg(true);
      const dataUrl = await toPng(billRef.current, { quality: 0.95, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `Bill-Pickleball-${party.title || 'Lien-hoan'}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Lỗi khi xuất ảnh bill:', err);
      alert('Không thể xuất ảnh, vui lòng thử lại hoặc chụp màn hình.');
    } finally {
      setIsExportingImg(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="bg-slate-100 rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-4">
        
        {/* Header Action Bar */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-lime-400" />
            <h3 className="font-bold text-sm sm:text-base">Hóa Đơn & Tin Nhắn Gửi Nhóm Zalo</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Buttons Bar */}
        <div className="p-3 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyZalo}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
            >
              {copied ? <Check className="w-4 h-4 text-lime-300" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Đã sao chép tin nhắn!' : 'Sao chép gửi Zalo'}</span>
            </button>

            <button
              onClick={handleDownloadImage}
              disabled={isExportingImg}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isExportingImg ? 'Đang xuất ảnh...' : 'Lưu ảnh Hóa đơn (PNG)'}</span>
            </button>
          </div>

          <span className="text-[11px] text-slate-500 hidden sm:inline">
            💡 Gửi ảnh hoặc tin nhắn vào nhóm Zalo để mọi người nộp tiền
          </span>
        </div>

        {/* Bill Preview Area (Sẽ được chụp thành ảnh) */}
        <div className="p-4 sm:p-6 max-h-[70vh] overflow-y-auto flex justify-center">
          <div 
            ref={billRef}
            className="bg-white rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-lg border border-slate-200 text-slate-800 space-y-5"
          >
            {/* Bill Header */}
            <div className="text-center border-b border-dashed border-slate-300 pb-4">
              {/* Logo Thương Hiệu PICK 247 */}
              <div className="flex justify-center mb-2.5">
                <img
                  src={brandLogo}
                  alt="Logo PICK 247"
                  className="h-10 sm:h-12 w-auto object-contain"
                />
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-0.5 bg-lime-100 text-emerald-900 rounded-full text-[11px] font-black uppercase tracking-wider mb-2">
                <span>🎾</span> HÓA ĐƠN TIỆC & GIAO LƯU <span>🍻</span>
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                {party.title || 'Giao Lưu Pickleball'}
              </h2>
              <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-500 mt-1.5">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  {party.date ? new Date(party.date).toLocaleDateString('vi-VN') : 'Hôm nay'}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  {party.location || 'Sân Pickleball PICK 247'}
                </span>
              </div>
            </div>

            {/* Expenses List */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
                <span>Dịch vụ & Món ăn</span>
                <span>Số tiền</span>
              </h4>
              <div className="space-y-1.5 text-xs">
                {expenses.map((exp, idx) => (
                  <div key={idx} className="flex justify-between items-center py-1 border-b border-slate-100">
                    <span className="text-slate-700">
                      {idx + 1}. {exp.name}
                      {exp.splitType === 'drinkers' && <span className="text-amber-600 font-semibold ml-1">(Chỉ người uống bia)</span>}
                    </span>
                    <span className="font-bold text-slate-900 shrink-0">
                      {formatMoney(exp.amount)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total Expenses */}
              <div className="flex justify-between items-center pt-2.5 mt-2 border-t border-slate-300">
                <span className="font-extrabold text-sm text-slate-900 uppercase">Tổng Cộng Tiệc:</span>
                <span className="font-black text-base text-emerald-700">
                  {formatMoney(settlement.totalExpenses)}
                </span>
              </div>
            </div>

            {/* Member Breakdown */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Phân bổ chi phí từng người ({members.length} người)
              </h4>
              <div className="space-y-1.5 text-xs">
                {settlement.memberStats.map((mem) => {
                  const net = Math.round(mem.netBalance);
                  return (
                    <div 
                      key={mem.id} 
                      className="flex justify-between items-center p-2 rounded-lg bg-slate-50 border border-slate-100"
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="font-bold text-slate-800">{mem.name}</span>
                        <span className="text-[10px] text-slate-400">
                          {mem.isDrinker ? '🍺' : '🥤'}
                        </span>
                      </div>
                      
                      <div className="shrink-0 text-right">
                        {net < -100 ? (
                          <span className="font-bold text-rose-600">
                            Cần nộp: {formatMoney(Math.abs(net))}
                          </span>
                        ) : net > 100 ? (
                          <span className="font-bold text-emerald-600">
                            Nhận lại: +{formatMoney(net)}
                          </span>
                        ) : (
                          <span className="font-semibold text-slate-400">Hòa</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Photos Proof Preview (nếu có) */}
            {photos.length > 0 && (
              <div className="pt-2 border-t border-dashed border-slate-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                  <span>📸 Ảnh Minh Chứng & Hóa Đơn ({photos.length} ảnh):</span>
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {photos.slice(0, 3).map((photo) => (
                    <div key={photo.id} className="relative aspect-4/3 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                      <img src={photo.dataUrl} alt={photo.caption} className="w-full h-full object-cover" />
                      <span className="absolute bottom-0 inset-x-0 bg-slate-900/70 text-white text-[9px] px-1 py-0.5 truncate text-center">
                        {photo.caption}
                      </span>
                    </div>
                  ))}
                </div>
                {photos.length > 3 && (
                  <p className="text-[10px] text-slate-400 mt-1 italic text-center">
                    (Và còn {photos.length - 3} ảnh minh chứng khác đã lưu trữ)
                  </p>
                )}
              </div>
            )}

            {/* Bank Info */}
            {bankInfo && bankInfo.accountNo && (
              <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs space-y-1">
                <div className="font-bold text-emerald-900 flex items-center gap-1">
                  <span>🏦 Thông tin chuyển khoản:</span>
                </div>
                <div className="text-slate-700">
                  Ngân hàng: <strong>{bankInfo.bankName || bankInfo.bankCode}</strong>
                </div>
                <div className="text-slate-700">
                  Số tài khoản: <strong className="text-emerald-800 font-mono text-sm">{bankInfo.accountNo}</strong>
                </div>
                <div className="text-slate-700">
                  Chủ tài khoản: <strong className="uppercase">{bankInfo.accountName}</strong>
                </div>
                <div className="text-[11px] text-slate-500 italic mt-1">
                  Nội dung CK: [Tên của bạn] Pickleball
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="text-center pt-2 text-[11px] text-slate-400 border-t border-dashed border-slate-200">
              PICK 247 • Hệ thống quản lý sân & Chia bill tiệc thể thao • Cảm ơn cả nhà! 🎾🔥
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
