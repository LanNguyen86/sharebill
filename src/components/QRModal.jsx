import React, { useState } from 'react';
import { X, Copy, Check, Download, QrCode, ShieldCheck } from 'lucide-react';
import { getVietQRUrl } from '../utils/vietqr';
import { formatMoney } from '../utils/formatters';

export const QRModal = ({ isOpen, onClose, bankInfo, debtor, creditor, amount, partyTitle }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !bankInfo || !debtor || amount <= 0) return null;

  // Nội dung chuyển khoản chuẩn: vd "Tuan Kiet Tien Pickleball"
  const cleanDebtorName = debtor.name.replace(/[^a-zA-Z0-9\s]/g, '').trim();
  const description = `${cleanDebtorName} Pickleball`.slice(0, 25);

  const qrUrl = getVietQRUrl({
    bankCode: bankInfo.bankCode,
    accountNo: bankInfo.accountNo,
    accountName: bankInfo.accountName,
    amount: amount,
    description: description,
    template: 'compact2'
  });

  const handleCopyAccountNo = () => {
    navigator.clipboard.writeText(bankInfo.accountNo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl border border-slate-200 overflow-hidden text-center relative">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-900 text-white p-4 relative">
          <button 
            onClick={onClose}
            className="absolute top-3.5 right-3.5 p-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-10 h-10 rounded-2xl bg-lime-400 text-slate-900 flex items-center justify-center mx-auto mb-2 shadow-md">
            <QrCode className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base">Quét Mã VietQR Chuyển Khoản</h3>
          <p className="text-xs text-emerald-200 mt-0.5">
            Thanh toán cho {creditor ? creditor.name : (bankInfo.accountName || 'Thủ quỹ')}
          </p>
        </div>

        {/* QR Code Container */}
        <div className="p-5 flex flex-col items-center">
          <div className="bg-white p-3 rounded-2xl shadow-inner border border-slate-200 max-w-[260px] w-full flex items-center justify-center">
            {qrUrl ? (
              <img
                src={qrUrl}
                alt="VietQR Code"
                className="w-full h-auto rounded-lg select-none"
                loading="eager"
              />
            ) : (
              <div className="p-8 text-xs text-slate-400">
                Chưa cài đặt số tài khoản ngân hàng
              </div>
            )}
          </div>

          {/* Amount Badge */}
          <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-2 w-full">
            <span className="text-[11px] text-slate-500 block">Số tiền cần thanh toán</span>
            <span className="text-xl font-extrabold text-emerald-700">
              {formatMoney(amount)}
            </span>
          </div>

          {/* Bank Info Details */}
          <div className="mt-3.5 w-full bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs text-left space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Ngân hàng:</span>
              <span className="font-bold text-slate-800">{bankInfo.bankName || bankInfo.bankCode}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Số tài khoản:</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-bold text-slate-900 text-sm">{bankInfo.accountNo}</span>
                <button
                  onClick={handleCopyAccountNo}
                  className="p-1 hover:bg-slate-200 rounded text-slate-600 transition-colors"
                  title="Sao chép số tài khoản"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Chủ tài khoản:</span>
              <span className="font-bold text-slate-800 uppercase">{bankInfo.accountName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Nội dung CK:</span>
              <span className="font-mono font-semibold text-emerald-700 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                {description}
              </span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 mt-3 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Quét bằng bất kỳ App Ngân hàng nào (VCB, MB, BIDV, Techcombank...)
          </p>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all shadow"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
};
