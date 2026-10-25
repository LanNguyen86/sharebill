import React, { useState } from 'react';
import { 
  Receipt, 
  Plus, 
  Trash2, 
  Zap, 
  Users, 
  Beer, 
  Coffee, 
  Tag, 
  DollarSign, 
  UserCheck, 
  SlidersHorizontal,
  ChevronDown,
  Check
} from 'lucide-react';
import { EXPENSE_CATEGORIES, DEFAULT_QUICK_SERVICES } from '../constants/banks';
import { formatMoney, parseSmartMoney } from '../utils/formatters';

export const ExpenseList = ({ members, expenses, onUpdateExpenses }) => {
  const [name, setName] = useState('');
  const [rawAmount, setRawAmount] = useState('');
  const [category, setCategory] = useState('court');
  const [payerId, setPayerId] = useState(members[0]?.id || '');
  const [splitType, setSplitType] = useState('all'); // all, drinkers, non_drinkers, custom
  const [customMembers, setCustomMembers] = useState([]);
  const [showCustomSelect, setShowCustomSelect] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Sync payerId nếu members thay đổi
  React.useEffect(() => {
    if (!payerId && members.length > 0) {
      setPayerId(members[0].id);
    }
  }, [members, payerId]);

  // Thêm khoản chi mới
  const handleAddExpense = (e) => {
    e.preventDefault();
    const cleanAmount = parseSmartMoney(rawAmount);
    if (!name.trim() || cleanAmount <= 0) return;

    const newExpense = {
      id: 'e_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      name: name.trim(),
      amount: cleanAmount,
      category,
      payerId: payerId || (members[0] ? members[0].id : ''),
      splitType,
      customMembers: splitType === 'custom' ? customMembers : []
    };

    onUpdateExpenses([...expenses, newExpense]);
    setName('');
    setRawAmount('');
    setIsAddingNew(false);
  };

  // Nạp nhanh từ Preset
  const handleAddQuickService = (preset) => {
    const defaultPayer = members[0] ? members[0].id : '';
    const newExpense = {
      id: 'e_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      name: preset.name,
      amount: preset.amount,
      category: preset.category,
      payerId: defaultPayer,
      splitType: preset.splitType,
      customMembers: []
    };
    onUpdateExpenses([...expenses, newExpense]);
  };

  // Xóa khoản chi
  const handleRemoveExpense = (id) => {
    onUpdateExpenses(expenses.filter(e => e.id !== id));
  };

  // Cập nhật người trả trước trực tiếp trong danh sách
  const handleUpdatePayer = (expenseId, newPayerId) => {
    onUpdateExpenses(expenses.map(e => e.id === expenseId ? { ...e, payerId: newPayerId } : e));
  };

  // Cập nhật kiểu chia trực tiếp trong danh sách
  const handleUpdateSplitType = (expenseId, newSplitType) => {
    onUpdateExpenses(expenses.map(e => e.id === expenseId ? { ...e, splitType: newSplitType } : e));
  };

  // Toggle custom member trong modal/dropdown
  const toggleCustomMember = (memId) => {
    if (customMembers.includes(memId)) {
      setCustomMembers(customMembers.filter(id => id !== memId));
    } else {
      setCustomMembers([...customMembers, memId]);
    }
  };

  const totalExpenseAmount = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

  const getCategoryMeta = (catId) => {
    return EXPENSE_CATEGORIES.find(c => c.id === catId) || EXPENSE_CATEGORIES[0];
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      
      {/* Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-50 to-slate-100/60 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-sm">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Dịch Vụ & Món Tiệc Đã Dùng</h2>
              <span className="bg-teal-100 text-teal-800 text-xs px-2 py-0.5 rounded-full font-bold">
                {expenses.length} mục
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Tổng chi phí: <strong className="text-teal-700 font-bold">{formatMoney(totalExpenseAmount)}</strong>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsAddingNew(!isAddingNew)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
            isAddingNew
              ? 'bg-slate-200 text-slate-700'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>{isAddingNew ? 'Đóng form' : 'Thêm khoản chi'}</span>
        </button>
      </div>

      {/* Preset Quick Add Bar */}
      <div className="px-4 py-2.5 bg-slate-50/80 border-b border-slate-200 overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1 mr-1">
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Thêm nhanh:
          </span>
          {DEFAULT_QUICK_SERVICES.map((preset, idx) => {
            const cat = getCategoryMeta(preset.category);
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleAddQuickService(preset)}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 flex items-center gap-1.5 shadow-2xs transition-all"
                title={`Thêm ${preset.name} (${formatMoney(preset.amount)})`}
              >
                <span>{cat.icon}</span>
                <span>{preset.name}</span>
                <span className="text-emerald-600 font-semibold text-[11px]">
                  {formatMoney(preset.amount)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Form thêm mới */}
      {isAddingNew && (
        <form onSubmit={handleAddExpense} className="p-4 sm:p-5 bg-teal-50/30 border-b border-slate-200 space-y-3.5 animate-fadeIn">
          <div className="font-bold text-xs text-teal-900 flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-teal-600" />
            Nhập khoản chi hoặc dịch vụ mới:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Tên món */}
            <div className="sm:col-span-5">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tên dịch vụ / Món ăn</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="VD: Tiền sân 2h, Thùng bia Heineken, Mồi lẩu..."
                className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                required
              />
            </div>

            {/* Số tiền */}
            <div className="sm:col-span-4">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Số tiền (nhập 350k, 1.2tr hoặc số)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={rawAmount}
                  onChange={(e) => setRawAmount(e.target.value)}
                  placeholder="VD: 450k hoặc 450000"
                  className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                  required
                />
                {rawAmount && (
                  <span className="absolute right-3 top-2 text-xs font-bold text-emerald-600">
                    = {formatMoney(parseSmartMoney(rawAmount))}
                  </span>
                )}
              </div>
            </div>

            {/* Danh mục */}
            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Danh mục</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
              >
                {EXPENSE_CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
            {/* Ai là người ứng tiền */}
            <div className="sm:col-span-6">
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                Ai đã ứng tiền trả khoản này?
              </label>
              <select
                value={payerId}
                onChange={(e) => setPayerId(e.target.value)}
                className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white font-medium"
              >
                {members.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name} {m.id === members[0]?.id ? '(Thủ quỹ / Quản lý)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Cơ chế chia tiền */}
            <div className="sm:col-span-6">
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-teal-600" />
                Ai sẽ chịu chia khoản này?
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => setSplitType('all')}
                  className={`px-2 py-1.5 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1 transition-all ${
                    splitType === 'all'
                      ? 'bg-teal-600 text-white border-teal-600'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Users className="w-3 h-3" /> Tất cả
                </button>
                <button
                  type="button"
                  onClick={() => setSplitType('drinkers')}
                  className={`px-2 py-1.5 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1 transition-all ${
                    splitType === 'drinkers'
                      ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                  title="Chỉ những người được đánh dấu uống bia"
                >
                  <Beer className="w-3 h-3" /> Chỉ uống bia
                </button>
                <button
                  type="button"
                  onClick={() => setSplitType('non_drinkers')}
                  className={`px-2 py-1.5 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1 transition-all ${
                    splitType === 'non_drinkers'
                      ? 'bg-cyan-600 text-white border-cyan-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                  title="Chỉ những người không uống bia"
                >
                  <Coffee className="w-3 h-3" /> Không cồn
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 shadow-md"
            >
              <Check className="w-4 h-4" />
              Lưu Khoản Chi
            </button>
          </div>
        </form>
      )}

      {/* Danh sách khoản chi */}
      <div className="divide-y divide-slate-100">
        {expenses.length === 0 ? (
          <div className="text-center py-10 px-4 text-slate-400">
            <Receipt className="w-12 h-12 mx-auto mb-2 text-slate-300 stroke-1" />
            <p className="text-sm font-medium text-slate-600">Chưa có khoản chi nào</p>
            <p className="text-xs text-slate-400 mt-1">
              Bấm vào các nút gợi ý "Thêm nhanh" hoặc nút "Thêm khoản chi" ở trên
            </p>
          </div>
        ) : (
          expenses.map((expense) => {
            const cat = getCategoryMeta(expense.category);
            const payer = members.find(m => m.id === expense.payerId);

            return (
              <div 
                key={expense.id} 
                className="p-3.5 sm:p-4 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                {/* Info */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0 border ${cat.color}`}>
                    {cat.icon}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 truncate">
                        {expense.name}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-slate-100 text-slate-600 border border-slate-200">
                        {cat.label}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                      {/* Người trả trước */}
                      <span className="flex items-center gap-1">
                        <span className="text-slate-400">Ứng trước:</span>
                        <select
                          value={expense.payerId}
                          onChange={(e) => handleUpdatePayer(expense.id, e.target.value)}
                          className="bg-transparent font-semibold text-emerald-700 hover:underline cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-400 rounded px-1"
                        >
                          {members.map(m => (
                            <option key={m.id} value={m.id}>{m.name}</option>
                          ))}
                        </select>
                      </span>

                      <span>•</span>

                      {/* Ai chịu */}
                      <span className="flex items-center gap-1">
                        <span className="text-slate-400">Chia cho:</span>
                        <select
                          value={expense.splitType}
                          onChange={(e) => handleUpdateSplitType(expense.id, e.target.value)}
                          className={`font-semibold rounded px-1.5 py-0.5 text-xs focus:outline-none cursor-pointer ${
                            expense.splitType === 'drinkers' 
                              ? 'bg-amber-100 text-amber-800' 
                              : expense.splitType === 'non_drinkers'
                              ? 'bg-cyan-100 text-cyan-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          <option value="all">👥 Tất cả ({members.length} người)</option>
                          <option value="drinkers">🍺 Chỉ người uống bia ({members.filter(m => m.isDrinker).length} người)</option>
                          <option value="non_drinkers">🥤 Chỉ người không cồn ({members.filter(m => !m.isDrinker).length} người)</option>
                        </select>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Amount & Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="text-right">
                    <span className="text-base font-extrabold text-slate-900">
                      {formatMoney(expense.amount)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveExpense(expense.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Xóa khoản chi này"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
