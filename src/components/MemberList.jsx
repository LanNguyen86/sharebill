import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  ClipboardPaste, 
  Trash2, 
  Beer, 
  Coffee, 
  Info,
  CheckCircle,
  Hash
} from 'lucide-react';
import { BatchMemberModal } from './BatchMemberModal';

export const MemberList = ({ members, onUpdateMembers }) => {
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberIsDrinker, setNewMemberIsDrinker] = useState(true);
  const [isBatchOpen, setIsBatchOpen] = useState(false);

  // Thêm 1 người
  const handleAddSingleMember = (e) => {
    e.preventDefault();
    const trimmed = newMemberName.trim();
    if (!trimmed) return;

    const newMember = {
      id: 'm_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      name: trimmed,
      phone: '',
      isDrinker: newMemberIsDrinker,
      weight: 1
    };

    onUpdateMembers([...members, newMember]);
    setNewMemberName('');
  };

  // Thêm nhiều người từ modal dán Zalo
  const handleAddBatchMembers = (nameList, defaultIsDrinker) => {
    const newItems = nameList.map((name, idx) => ({
      id: 'm_' + (Date.now() + idx) + '_' + Math.random().toString(36).substr(2, 4),
      name,
      phone: '',
      isDrinker: defaultIsDrinker,
      weight: 1
    }));
    onUpdateMembers([...members, ...newItems]);
  };

  // Cập nhật 1 thuộc tính của member
  const handleUpdateMember = (id, field, value) => {
    const updated = members.map(m => {
      if (m.id === id) {
        return { ...m, [field]: value };
      }
      return m;
    });
    onUpdateMembers(updated);
  };

  // Xóa member
  const handleRemoveMember = (id) => {
    onUpdateMembers(members.filter(m => m.id !== id));
  };

  // Đổi trạng thái uống bia cho tất cả
  const handleSetAllDrinkers = (isDrinker) => {
    const updated = members.map(m => ({ ...m, isDrinker }));
    onUpdateMembers(updated);
  };

  const drinkerCount = members.filter(m => m.isDrinker).length;
  const nonDrinkerCount = members.length - drinkerCount;

  // Màu avatar ngẫu nhiên theo id
  const getAvatarBg = (name) => {
    const colors = [
      'bg-emerald-500', 'bg-blue-500', 'bg-purple-500', 
      'bg-amber-500', 'bg-rose-500', 'bg-teal-500', 'bg-indigo-500'
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-50 to-slate-100/60 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Danh Sách Người Tham Gia</h2>
              <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded-full font-bold">
                {members.length} người
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Đánh dấu ai có uống bia để chia tiền đồ uống có cồn công bằng nhất
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsBatchOpen(true)}
          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-lime-300 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
        >
          <ClipboardPaste className="w-4 h-4" />
          <span>Dán danh sách Zalo</span>
        </button>
      </div>

      {/* Stats Quick Bar */}
      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
            <Beer className="w-3.5 h-3.5 text-amber-600" />
            Có cồn / Bia: <strong>{drinkerCount}</strong>
          </span>
          <span className="flex items-center gap-1 font-medium text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded-md border border-cyan-200">
            <Coffee className="w-3.5 h-3.5 text-cyan-600" />
            Không cồn: <strong>{nonDrinkerCount}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-500">
          <span>Đổi nhanh:</span>
          <button
            onClick={() => handleSetAllDrinkers(true)}
            className="hover:underline text-amber-700 font-medium"
          >
            Tất cả uống bia
          </button>
          <span>•</span>
          <button
            onClick={() => handleSetAllDrinkers(false)}
            className="hover:underline text-cyan-700 font-medium"
          >
            Tất cả không cồn
          </button>
        </div>
      </div>

      {/* Input form thêm 1 người */}
      <form onSubmit={handleAddSingleMember} className="p-4 border-b border-slate-200 bg-emerald-50/30">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              placeholder="Nhập tên người tham gia (vd: Tuấn, Mai, Anh Long...)"
              className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
            />
          </div>

          {/* Toggle Uống bia / Không cồn */}
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shrink-0">
            <button
              type="button"
              onClick={() => setNewMemberIsDrinker(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                newMemberIsDrinker
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Beer className="w-3.5 h-3.5" />
              <span>Có cồn</span>
            </button>
            <button
              type="button"
              onClick={() => setNewMemberIsDrinker(false)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                !newMemberIsDrinker
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Coffee className="w-3.5 h-3.5" />
              <span>Không cồn</span>
            </button>
          </div>

          <button
            type="submit"
            disabled={!newMemberName.trim()}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Thêm</span>
          </button>
        </div>
      </form>

      {/* Member Cards Grid */}
      <div className="p-4 sm:p-5">
        {members.length === 0 ? (
          <div className="text-center py-10 px-4 text-slate-400">
            <Users className="w-12 h-12 mx-auto mb-2 text-slate-300 stroke-1" />
            <p className="text-sm font-medium text-slate-600">Chưa có người tham gia nào</p>
            <p className="text-xs text-slate-400 mt-1">
              Nhập tên ở trên hoặc bấm nút "Dán danh sách Zalo" để thêm nhanh
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {members.map((member, index) => {
              const initial = member.name ? member.name.charAt(0).toUpperCase() : '?';
              return (
                <div
                  key={member.id}
                  className={`p-3 rounded-xl border transition-all duration-200 flex items-center justify-between group ${
                    member.isDrinker 
                      ? 'bg-amber-50/30 border-amber-200 hover:border-amber-300' 
                      : 'bg-cyan-50/30 border-cyan-200 hover:border-cyan-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-full ${getAvatarBg(member.name)} text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-sm`}>
                      {initial}
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1 pr-1">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={member.name}
                          onChange={(e) => handleUpdateMember(member.id, 'name', e.target.value)}
                          className="text-xs font-bold text-slate-800 bg-transparent hover:bg-white/80 focus:bg-white focus:ring-1 focus:ring-emerald-500 rounded px-1 -ml-1 w-full truncate"
                          title="Nhấp để sửa tên"
                        />
                      </div>
                      
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {/* Suất (weight) */}
                        <select
                          value={member.weight || 1}
                          onChange={(e) => handleUpdateMember(member.id, 'weight', parseFloat(e.target.value))}
                          className="text-[10px] bg-white border border-slate-200 rounded px-1.5 py-0.5 text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                          title="Hệ số chia tiền (1 suất, nửa suất cho trẻ em, 2 suất...)"
                        >
                          <option value={1}>1.0 suất (Chuẩn)</option>
                          <option value={0.5}>0.5 suất (Trẻ em)</option>
                          <option value={1.5}>1.5 suất</option>
                          <option value={2}>2.0 suất (Dẫn bạn)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Actions: Toggle Drinker & Delete */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleUpdateMember(member.id, 'isDrinker', !member.isDrinker)}
                      className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                        member.isDrinker
                          ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                          : 'bg-cyan-100 text-cyan-800 hover:bg-cyan-200'
                      }`}
                      title={member.isDrinker ? 'Có uống bia / cồn (Click để đổi sang không cồn)' : 'Không cồn (Click để đổi sang có uống bia)'}
                    >
                      {member.isDrinker ? (
                        <div className="flex items-center gap-0.5">
                          <Beer className="w-3.5 h-3.5 text-amber-600" />
                          <span className="text-[10px] font-bold hidden xs:inline">Bia</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-0.5">
                          <Coffee className="w-3.5 h-3.5 text-cyan-600" />
                          <span className="text-[10px] font-bold hidden xs:inline">Nước ngọt</span>
                        </div>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRemoveMember(member.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Xóa người này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <BatchMemberModal
        isOpen={isBatchOpen}
        onClose={() => setIsBatchOpen(false)}
        onAddMembers={handleAddBatchMembers}
      />
    </div>
  );
};
