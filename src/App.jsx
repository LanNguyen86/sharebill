import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  Receipt, 
  Calculator, 
  Share2, 
  PlusCircle, 
  CreditCard, 
  Sparkles,
  Trophy,
  History,
  RotateCcw,
  Check,
  Camera,
  LayoutDashboard
} from 'lucide-react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { MemberList } from './components/MemberList';
import { ExpenseList } from './components/ExpenseList';
import { ProofGallery } from './components/ProofGallery';
import { SettlementSummary } from './components/SettlementSummary';
import { BankSettingsModal } from './components/BankSettingsModal';
import { ExportBillModal } from './components/ExportBillModal';
import { HistoryModal } from './components/HistoryModal';
import { 
  getSavedParty, 
  saveParty, 
  saveToHistory, 
  getHistory,
  getAllPartiesCombined,
  getDefaultBank, 
  saveDefaultBank,
  INITIAL_DEMO_PARTY 
} from './utils/storage';
import { calculateBill, formatMoney } from './utils/formatters';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' hoặc 'party'
  const [party, setParty] = useState(() => getSavedParty());
  const [bankInfo, setBankInfo] = useState(() => getDefaultBank());
  const [activeTab, setActiveTab] = useState('settlement'); // 'members', 'expenses', 'photos', 'settlement'
  
  // Modals state
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  // Auto save current party to LocalStorage & History
  useEffect(() => {
    saveParty(party);
    saveToHistory(party);
  }, [party]);

  // Reactive calculation cho buổi hiện tại
  const settlement = useMemo(() => {
    return calculateBill(party.members || [], party.expenses || []);
  }, [party.members, party.expenses]);

  // Danh sách tất cả các buổi tiệc (hợp nhất buổi hiện tại & lịch sử)
  const allParties = useMemo(() => {
    return getAllPartiesCombined(party);
  }, [party]);

  // Đếm công nợ chưa thu của buổi hiện tại
  const currentDebtors = settlement.memberStats.filter(m => Math.round(m.netBalance) < -100);
  const currentUnpaidCount = currentDebtors.filter(d => !party.paidStatus || !party.paidStatus[d.id]).length;

  // Cập nhật Party chung
  const handleUpdateParty = (newParty) => {
    setParty(newParty);
  };

  // Cập nhật thành viên
  const handleUpdateMembers = (newMembers) => {
    setParty(prev => ({
      ...prev,
      members: newMembers
    }));
  };

  // Cập nhật chi phí
  const handleUpdateExpenses = (newExpenses) => {
    setParty(prev => ({
      ...prev,
      expenses: newExpenses
    }));
  };

  // Cập nhật ảnh minh chứng
  const handleUpdatePhotos = (newPhotos) => {
    setParty(prev => ({
      ...prev,
      photos: newPhotos
    }));
  };

  // Toggle trạng thái đã thanh toán của thành viên trong buổi tiệc hiện tại
  const handleTogglePaid = (memberId, isPaid) => {
    setParty(prev => ({
      ...prev,
      paidStatus: {
        ...(prev.paidStatus || {}),
        [memberId]: isPaid
      }
    }));
  };

  // Cập nhật nợ đã trả từ Dashboard cho bất kỳ buổi tiệc nào
  const handleUpdatePartyDebtPaid = (targetPartyId, memberId) => {
    if (party.id === targetPartyId) {
      handleTogglePaid(memberId, true);
    } else {
      const history = getHistory();
      const updatedHistory = history.map(p => {
        if (p.id === targetPartyId) {
          return {
            ...p,
            paidStatus: {
              ...(p.paidStatus || {}),
              [memberId]: true
            }
          };
        }
        return p;
      });
      localStorage.setItem('pickle_parties_history_v1', JSON.stringify(updatedHistory));
      // Trigger re-render bằng cách set lại party
      setParty(prev => ({ ...prev }));
    }
  };

  // Tạo buổi tiệc mới
  const handleNewParty = () => {
    if (confirm('Bắt đầu buổi tiệc / giao lưu mới? Buổi hiện tại đã được lưu an toàn vào Lịch sử.')) {
      const newId = 'party_' + Date.now();
      const newParty = {
        id: newId,
        title: `Giao Lưu Pickleball Ngày ${new Date().toLocaleDateString('vi-VN')}`,
        date: new Date().toISOString().split('T')[0],
        location: 'Sân Pickleball',
        organizerName: bankInfo.accountName || 'Quản Lý Sân',
        status: 'active',
        paidStatus: {},
        bankInfo: bankInfo,
        // Giữ lại danh sách hội viên thường chơi để đỡ phải nhập lại
        members: party.members.map(m => ({ ...m })),
        expenses: [],
        photos: []
      };
      setParty(newParty);
      setCurrentView('party');
      setActiveTab('expenses');
    }
  };

  // Nạp lại dữ liệu mẫu Demo
  const handleResetToDemo = () => {
    if (confirm('Khôi phục dữ liệu mẫu Demo ban đầu (đầy đủ sân, mồi lẩu, bia, người uống bia/không cồn)?')) {
      setParty(INITIAL_DEMO_PARTY);
      setCurrentView('party');
      setActiveTab('settlement');
    }
  };

  // Chọn buổi tiệc từ lịch sử hoặc từ Dashboard
  const handleSelectPartyFromHistory = (selectedParty) => {
    setParty(selectedParty);
    setCurrentView('party');
    setActiveTab('settlement');
  };

  // Sao chép thành viên từ buổi cũ sang buổi hiện tại
  const handleCloneMembers = (membersToClone) => {
    setParty(prev => ({
      ...prev,
      members: membersToClone.map(m => ({
        ...m,
        id: 'm_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4)
      }))
    }));
    setCurrentView('party');
    setActiveTab('members');
  };

  // Lưu cài đặt tài khoản ngân hàng
  const handleSaveBankInfo = (newBank) => {
    setBankInfo(newBank);
    setParty(prev => ({
      ...prev,
      bankInfo: newBank
    }));
  };

  return (
    <div className="min-h-screen bg-slate-100/70 pb-16">
      {/* Top Header */}
      <Header
        party={party}
        currentView={currentView}
        onToggleView={(view) => setCurrentView(view)}
        onUpdateParty={handleUpdateParty}
        onNewParty={handleNewParty}
        onOpenHistory={() => setIsHistoryModalOpen(true)}
        onOpenBankSettings={() => setIsBankModalOpen(true)}
        onOpenShareModal={() => setIsExportModalOpen(true)}
        totalExpenses={settlement.totalExpenses}
        memberCount={party.members?.length || 0}
        unpaidDebtCount={currentUnpaidCount}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5">
        
        {/* VIEW 1: DASHBOARD QUẢN LÝ CHUNG */}
        {currentView === 'dashboard' ? (
          <Dashboard
            parties={allParties}
            currentParty={party}
            bankInfo={bankInfo}
            onSelectParty={handleSelectPartyFromHistory}
            onNewParty={handleNewParty}
            onUpdatePartyDebtPaid={handleUpdatePartyDebtPaid}
          />
        ) : (
          /* VIEW 2: CHI TIẾT BUỔI TIỆC ĐANG MỞ */
          <div className="space-y-5 animate-fadeIn">
            
            {/* Navigation Tabs Buổi Tiệc */}
            <div className="bg-white rounded-2xl p-1.5 shadow-sm border border-slate-200 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
                <button
                  onClick={() => setActiveTab('members')}
                  className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 shrink-0 transition-all ${
                    activeTab === 'members'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>1. Người chơi</span>
                  <span className={`px-1.5 py-0.5 rounded-full text-[11px] ${
                    activeTab === 'members' ? 'bg-emerald-700 text-lime-300' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {party.members?.length || 0}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('expenses')}
                  className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 shrink-0 transition-all ${
                    activeTab === 'expenses'
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Receipt className="w-4 h-4" />
                  <span>2. Dịch vụ & Món</span>
                  <span className={`px-1.5 py-0.5 rounded-full text-[11px] ${
                    activeTab === 'expenses' ? 'bg-teal-700 text-teal-200' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {party.expenses?.length || 0}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('photos')}
                  className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 shrink-0 transition-all ${
                    activeTab === 'photos'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  <span>3. Ảnh minh chứng</span>
                  <span className={`px-1.5 py-0.5 rounded-full text-[11px] ${
                    activeTab === 'photos' ? 'bg-purple-700 text-purple-200' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {party.photos?.length || 0}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('settlement')}
                  className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 shrink-0 transition-all ${
                    activeTab === 'settlement'
                      ? 'bg-slate-900 text-lime-400 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Calculator className="w-4 h-4" />
                  <span>4. Chia Tiền & QR</span>
                  <span className="w-2 h-2 rounded-full bg-lime-400 animate-ping"></span>
                </button>
              </div>

              {/* Quick Reset & Back to Dashboard */}
              <div className="hidden md:flex items-center gap-3 pr-2 shrink-0">
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="px-2.5 py-1 text-xs font-bold text-slate-700 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 rounded-lg flex items-center gap-1 transition-colors"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Về Dashboard</span>
                </button>
                <button
                  onClick={handleResetToDemo}
                  className="text-[11px] font-semibold text-slate-500 hover:text-emerald-700 flex items-center gap-1 hover:underline"
                  title="Khôi phục lại dữ liệu mẫu Demo"
                >
                  <RotateCcw className="w-3 h-3" />
                  Mẫu Demo
                </button>
              </div>
            </div>

            {/* Tab Contents */}
            {activeTab === 'members' && (
              <div className="space-y-4 animate-fadeIn">
                <MemberList
                  members={party.members || []}
                  onUpdateMembers={handleUpdateMembers}
                />

                <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Đã thêm {party.members?.length || 0} người. Tiếp theo nhập các khoản tiền sân và đồ ăn uống.
                  </span>
                  <button
                    onClick={() => setActiveTab('expenses')}
                    className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-1.5 shadow"
                  >
                    <span>Sang bước 2: Dịch vụ & Món tiệc</span>
                    <Receipt className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'expenses' && (
              <div className="space-y-4 animate-fadeIn">
                <ExpenseList
                  members={party.members || []}
                  expenses={party.expenses || []}
                  onUpdateExpenses={handleUpdateExpenses}
                />

                <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Tổng cộng: <strong className="text-teal-700 font-bold">{formatMoney(settlement.totalExpenses)}</strong>. Chụp hóa đơn hoặc xem bảng chia tiền.
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab('photos')}
                      className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 shadow"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Bước 3: Chụp ảnh bill ({party.photos?.length || 0})</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('settlement')}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-lime-400 text-xs font-bold flex items-center gap-1.5 shadow"
                    >
                      <span>Xem Bảng Chia Tiền</span>
                      <Calculator className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'photos' && (
              <div className="space-y-4 animate-fadeIn">
                <ProofGallery
                  photos={party.photos || []}
                  onUpdatePhotos={handleUpdatePhotos}
                />

                <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Đã lưu {party.photos?.length || 0} ảnh minh chứng. Xem ngay bảng chia tiền và xuất hóa đơn.
                  </span>
                  <button
                    onClick={() => setActiveTab('settlement')}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-lime-400 text-xs font-bold flex items-center gap-1.5 shadow"
                  >
                    <span>Sang bước 4: Xem Bảng Chia Tiền & VietQR</span>
                    <Calculator className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'settlement' && (
              <div className="animate-fadeIn">
                <SettlementSummary
                  party={party}
                  settlement={settlement}
                  bankInfo={bankInfo}
                  paidStatus={party.paidStatus || {}}
                  onTogglePaid={handleTogglePaid}
                />
              </div>
            )}

          </div>
        )}

      </main>

      {/* Floating Action Button for Mobile: Gửi Zalo */}
      <div className="fixed bottom-4 right-4 sm:hidden z-20">
        <button
          onClick={() => setIsExportModalOpen(true)}
          className="p-3.5 rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-xl flex items-center justify-center border-2 border-white"
        >
          <Share2 className="w-6 h-6 text-lime-300" />
        </button>
      </div>

      {/* Modals */}
      <BankSettingsModal
        isOpen={isBankModalOpen}
        onClose={() => setIsBankModalOpen(false)}
        bankInfo={bankInfo}
        onSave={handleSaveBankInfo}
      />

      <ExportBillModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        party={party}
        members={party.members || []}
        expenses={party.expenses || []}
        photos={party.photos || []}
        settlement={settlement}
        bankInfo={bankInfo}
      />

      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        onSelectParty={handleSelectPartyFromHistory}
        onCloneMembers={handleCloneMembers}
      />

    </div>
  );
}
