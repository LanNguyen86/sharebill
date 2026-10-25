import React, { useState } from 'react';
import { X, CreditCard, Check, Building2, User, Hash, QrCode } from 'lucide-react';
import { VIETNAMESE_BANKS } from '../constants/banks';
import { getVietQRUrl } from '../utils/vietqr';
import { saveDefaultBank } from '../utils/storage';

export const BankSettingsModal = ({ isOpen, onClose, bankInfo, onSave }) => {
  const [bankCode, setBankCode] = useState(bankInfo?.bankCode || 'MB');
  const [accountNo, setAccountNo] = useState(bankInfo?.accountNo || '');
  const [accountName, setAccountName] = useState(bankInfo?.accountName || '');

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    if (!accountNo.trim()) return;

    const selectedBank = VIETNAMESE_BANKS.find(b => b.code === bankCode);
    const newBankInfo = {
      bankCode,
      bankName: selectedBank ? selectedBank.name : bankCode,
      accountNo: accountNo.trim(),
      accountName: accountName.trim().toUpperCase()
    };

    saveDefaultBank(newBankInfo);
    onSave(newBankInfo);
    onClose();
  };

  const previewQR = getVietQRUrl({
    bankCode,
    accountNo,
    accountName,
    amount: 50000,
    description: 'TEST QR PICKLEBALL',
    template: 'compact2'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-lime-400 text-slate-900 flex items-center justify-center font-bold shadow">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Cài Đặt Tài Khoản VietQR</h3>
              <p className="text-xs text-emerald-200">Tài khoản của bạn để mọi người quét mã chuyển khoản</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSave} className="p-5 space-y-4">
          <div className="space-y-3.5">
            {/* Chọn Ngân hàng */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                Ngân hàng thụ hưởng
              </label>
              <select
                value={bankCode}
                onChange={(e) => setBankCode(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
              >
                {VIETNAMESE_BANKS.map((bank) => (
                  <option key={bank.code} value={bank.code}>
                    {bank.shortName} - {bank.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Số tài khoản */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-emerald-600" />
                Số tài khoản ngân hàng
              </label>
              <input
                type="text"
                value={accountNo}
                onChange={(e) => setAccountNo(e.target.value)}
                placeholder="Ví dụ: 0988889999 hoặc 1903..."
                className="w-full text-sm font-mono px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                required
              />
            </div>

            {/* Tên chủ tài khoản */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-600" />
                Tên chủ tài khoản (Viết hoa không dấu)
              </label>
              <input
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                placeholder="Ví dụ: NGUYEN VAN A"
                className="w-full text-sm uppercase px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                required
              />
            </div>
          </div>

          {/* Preview VietQR nếu có số tài khoản */}
          {accountNo.trim().length >= 4 && (
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
              <div className="w-16 h-16 bg-white p-1 rounded-xl border border-slate-200 shrink-0 flex items-center justify-center">
                {previewQR ? (
                  <img src={previewQR} alt="QR Preview" className="w-full h-full object-contain" />
                ) : (
                  <QrCode className="w-6 h-6 text-slate-400" />
                )}
              </div>
              <div className="text-xs">
                <span className="font-bold text-slate-800 block">Xem trước mã QR hoạt động tốt:</span>
                <span className="text-slate-500 text-[11px] block mt-0.5">
                  Mã VietQR sẽ tự động đính kèm số tiền và nội dung cho từng người chuyển!
                </span>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="pt-2 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 shadow"
            >
              <Check className="w-4 h-4" />
              Lưu Tài Khoản
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
