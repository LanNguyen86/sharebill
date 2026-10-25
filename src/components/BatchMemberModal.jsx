import React, { useState } from 'react';
import { X, Users, ClipboardList, CheckCircle2 } from 'lucide-react';

export const BatchMemberModal = ({ isOpen, onClose, onAddMembers }) => {
  const [rawText, setRawText] = useState('');
  const [defaultIsDrinker, setDefaultIsDrinker] = useState(true);

  if (!isOpen) return null;

  const handleProcess = () => {
    if (!rawText.trim()) return;

    // Tách theo dòng hoặc dấu phẩy
    const lines = rawText.split(/\r?\n|,/);
    const names = [];

    lines.forEach(line => {
      // Loại bỏ tiền tố như "1.", "1/", "1-", "-", "*", "•", "@", v.v.
      let clean = line
        .replace(/^[\s\d+.\-–—*•#\)>]+/, '')
        .trim();

      // Loại bỏ các ghi chú trong ngoặc đơn nếu có thể giữ hoặc tách
      if (clean.length > 0) {
        names.push(clean);
      }
    });

    if (names.length === 0) return;

    onAddMembers(names, defaultIsDrinker);
    setRawText('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-lime-400 text-slate-900 flex items-center justify-center font-bold">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Dán danh sách từ Zalo / Nhóm</h3>
              <p className="text-xs text-emerald-200">Nhập nhiều người chơi cùng lúc chỉ bằng 1 thao tác</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Dán danh sách tin nhắn vào đây:
            </label>
            <textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder={`Ví dụ sao chép từ Zalo:
1. Anh Nam (sân)
2. Hoàng Long
3. Tuấn Kiệt
4. Chị Thảo
5. Mai Anh`}
              rows={7}
              className="w-full text-sm p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              💡 Hệ thống sẽ tự động lọc bỏ số thứ tự (1, 2, 3...), gạch đầu dòng và khoảng trắng thừa.
            </p>
          </div>

          {/* Option mặc định uống bia hay không */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-700">Mặc định nhóm này:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDefaultIsDrinker(true)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  defaultIsDrinker 
                    ? 'bg-amber-500 text-white shadow-sm' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>🍺 Có uống bia</span>
              </button>
              <button
                type="button"
                onClick={() => setDefaultIsDrinker(false)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  !defaultIsDrinker 
                    ? 'bg-cyan-600 text-white shadow-sm' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>🥤 Không uống bia</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-5 py-3.5 border-t border-slate-200 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={handleProcess}
            disabled={!rawText.trim()}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-md transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            Thêm vào danh sách
          </button>
        </div>

      </div>
    </div>
  );
};
