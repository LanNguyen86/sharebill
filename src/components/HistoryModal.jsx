import React from 'react';
import { X, History, Trash2, Calendar, MapPin, Users, ArrowRight, Copy } from 'lucide-react';
import { getHistory } from '../utils/storage';
import { formatMoney } from '../utils/formatters';

export const HistoryModal = ({ isOpen, onClose, onSelectParty, onCloneMembers }) => {
  if (!isOpen) return null;

  const history = getHistory();

  const handleDeleteHistory = (partyId, e) => {
    e.stopPropagation();
    if (confirm('Bạn có chắc muốn xóa buổi tiệc này khỏi lịch sử?')) {
      const updated = history.filter(p => p.id !== partyId);
      localStorage.setItem('pickle_parties_history_v1', JSON.stringify(updated));
      // Force re-render bằng cách trigger lại
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-teal-950 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-500 text-slate-900 flex items-center justify-center font-bold">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Lịch Sử Các Buổi Tiệc & Giao Lưu</h3>
              <p className="text-xs text-slate-300">Xem lại hoặc tái sử dụng danh sách người chơi</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="p-4 sm:p-5 max-h-[60vh] overflow-y-auto space-y-2.5">
          {history.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <History className="w-10 h-10 mx-auto mb-2 text-slate-300 stroke-1" />
              <p className="text-sm font-medium text-slate-600">Chưa có lịch sử buổi tiệc nào</p>
              <p className="text-xs text-slate-400 mt-1">
                Các buổi tiệc bạn tạo sẽ tự động được lưu trữ tại đây
              </p>
            </div>
          ) : (
            history.map((party) => {
              const totalAmount = party.expenses?.reduce((sum, e) => sum + (Number(e.amount) || 0), 0) || 0;
              return (
                <div
                  key={party.id}
                  onClick={() => {
                    onSelectParty(party);
                    onClose();
                  }}
                  className="p-3.5 rounded-2xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/20 cursor-pointer transition-all flex items-center justify-between gap-3 group"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-800 group-hover:text-emerald-700 truncate">
                        {party.title}
                      </h4>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        {formatMoney(totalAmount)}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {party.date ? new Date(party.date).toLocaleDateString('vi-VN') : 'Không rõ ngày'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        {party.members?.length || 0} người
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCloneMembers(party.members);
                        onClose();
                      }}
                      className="p-1.5 text-xs text-slate-600 hover:text-emerald-700 hover:bg-emerald-100 rounded-lg flex items-center gap-1"
                      title="Lấy danh sách người này cho buổi mới"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Dùng lại nhóm</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleDeleteHistory(party.id, e)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                      title="Xóa khỏi lịch sử"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
};
