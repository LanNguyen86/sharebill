import React, { useState } from 'react';
import { 
  Trophy, 
  Calendar, 
  MapPin, 
  CreditCard, 
  History, 
  PlusCircle, 
  Share2, 
  Download,
  Edit3,
  Check,
  LayoutDashboard,
  Sparkles
} from 'lucide-react';
import brandLogo from '../assets/logo-pick247.png';

export const Header = ({ 
  party, 
  currentView = 'party', // 'dashboard' hoặc 'party'
  onToggleView,
  onUpdateParty, 
  onNewParty, 
  onOpenHistory, 
  onOpenBankSettings,
  onOpenShareModal,
  totalExpenses,
  memberCount,
  unpaidDebtCount = 0
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(party.title);
  const [tempLocation, setTempLocation] = useState(party.location);
  const [tempDate, setTempDate] = useState(party.date);

  const handleSaveInfo = () => {
    onUpdateParty({
      ...party,
      title: tempTitle || 'Buổi giao lưu Pickleball',
      location: tempLocation,
      date: tempDate
    });
    setIsEditingTitle(false);
  };

  return (
    <header className="bg-gradient-to-r from-slate-950 via-teal-950 to-slate-900 text-white shadow-xl border-b border-emerald-600/30 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          {/* Brand Logo & Party Name */}
          <div className="flex items-center space-x-3.5">
            {/* Logo Thương Hiệu PICK 247 */}
            <div 
              onClick={() => onToggleView && onToggleView('dashboard')}
              className="relative group shrink-0 cursor-pointer p-1 rounded-2xl bg-white/95 hover:bg-white transition-all shadow-md shadow-lime-400/10 flex items-center justify-center transform group-hover:scale-105"
              title="PICK 247 - Về Dashboard quản lý chung"
            >
              <img
                src={brandLogo}
                alt="Logo PICK 247"
                className="h-9 sm:h-10 w-auto object-contain select-none"
              />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full bg-lime-400/20 text-lime-300 border border-lime-400/30">
                  Pickleball 24/7
                </span>
                
                {/* Switcher Tabs View on Header */}
                <div className="flex items-center bg-slate-900/80 p-0.5 rounded-xl border border-slate-700 text-xs">
                  <button
                    onClick={() => onToggleView && onToggleView('dashboard')}
                    className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-all ${
                      currentView === 'dashboard'
                        ? 'bg-lime-400 text-slate-950 shadow'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>Dashboard</span>
                    {unpaidDebtCount > 0 && (
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                    )}
                  </button>

                  <button
                    onClick={() => onToggleView && onToggleView('party')}
                    className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-all ${
                      currentView === 'party'
                        ? 'bg-emerald-600 text-white shadow'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <span>🎾 Buổi Tiệc</span>
                  </button>
                </div>
              </div>

              {isEditingTitle ? (
                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                  <input
                    type="text"
                    value={tempTitle}
                    onChange={(e) => setTempTitle(e.target.value)}
                    placeholder="Tên buổi tiệc / giao lưu"
                    className="bg-emerald-950/80 border border-emerald-500/50 rounded-lg px-2.5 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-lime-400"
                  />
                  <input
                    type="text"
                    value={tempLocation}
                    onChange={(e) => setTempLocation(e.target.value)}
                    placeholder="Sân tổ chức"
                    className="bg-emerald-950/80 border border-emerald-500/50 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:ring-2 focus:ring-lime-400"
                  />
                  <button
                    onClick={handleSaveInfo}
                    className="bg-lime-400 text-slate-900 px-3 py-1 rounded-lg text-xs font-bold hover:bg-lime-300 flex items-center gap-1 shadow"
                  >
                    <Check className="w-3.5 h-3.5" /> Lưu
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 mt-0.5">
                  <h1 className="text-sm sm:text-base font-bold tracking-tight text-white flex items-center gap-1.5 truncate max-w-xs sm:max-w-md">
                    {party.title}
                  </h1>
                  <button
                    onClick={() => {
                      setTempTitle(party.title);
                      setTempLocation(party.location);
                      setTempDate(party.date);
                      setIsEditingTitle(true);
                    }}
                    className="text-emerald-400 hover:text-lime-300 p-1 rounded-md hover:bg-white/5 transition-colors"
                    title="Chỉnh sửa thông tin buổi tiệc"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                </div>
              )}

              {!isEditingTitle && (
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-emerald-200/70">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-lime-400" />
                    {party.date ? new Date(party.date).toLocaleDateString('vi-VN') : 'Hôm nay'}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-lime-400" />
                    {party.location || 'Sân Pickleball PICK 247'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center flex-wrap gap-2">
            <button
              onClick={onOpenBankSettings}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
              title="Cài đặt thông tin tài khoản VietQR để nhận tiền"
            >
              <CreditCard className="w-3.5 h-3.5 text-lime-400" />
              <span className="hidden sm:inline">Tài khoản</span> VietQR
            </button>

            <button
              onClick={onOpenHistory}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
              title="Xem lịch sử các buổi tiệc đã lưu"
            >
              <History className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Lịch sử</span>
            </button>

            <button
              onClick={onOpenShareModal}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-950/40 transition-all transform active:scale-95"
            >
              <Share2 className="w-3.5 h-3.5 text-lime-300" />
              <span>Gửi Zalo</span>
            </button>

            <button
              onClick={onNewParty}
              className="px-3 py-1.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-lime-400/20 transition-all transform active:scale-95"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Buổi Mới</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
