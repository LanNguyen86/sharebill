import React from 'react';
import { X, Download, Trash2, Calendar, Tag } from 'lucide-react';

export const ImageViewerModal = ({ isOpen, onClose, photo, onDeletePhoto }) => {
  if (!isOpen || !photo) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = photo.dataUrl;
    link.download = `MinhChung-${photo.caption || 'Pickleball'}.jpg`;
    link.click();
  };

  const getTagBadge = (t) => {
    switch (t) {
      case 'bill':
        return <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full text-xs font-semibold">🧾 Hóa đơn / Bill</span>;
      case 'court':
        return <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full text-xs font-semibold">🎾 Sân Pickleball</span>;
      case 'party':
        return <span className="bg-purple-500/20 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded-full text-xs font-semibold">🍻 Bàn liên hoan</span>;
      default:
        return <span className="bg-slate-500/20 text-slate-300 border border-slate-500/40 px-2 py-0.5 rounded-full text-xs font-semibold">📸 Minh chứng</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div className="relative max-w-4xl w-full flex flex-col items-center max-h-[95vh]">
        
        {/* Top Control Bar */}
        <div className="w-full flex items-center justify-between p-3 bg-slate-900/80 rounded-2xl border border-slate-700 text-white mb-3 backdrop-blur-sm">
          <div className="flex items-center gap-2.5 truncate">
            {getTagBadge(photo.tag)}
            <span className="font-bold text-sm truncate">{photo.caption}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleDownload}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors"
              title="Tải ảnh về máy"
            >
              <Download className="w-4 h-4" />
            </button>

            {onDeletePhoto && (
              <button
                onClick={() => {
                  if (confirm('Bạn có chắc muốn xóa ảnh minh chứng này?')) {
                    onDeletePhoto(photo.id);
                    onClose();
                  }
                }}
                className="p-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 transition-colors"
                title="Xóa ảnh này"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Image Display */}
        <div className="relative flex-1 max-h-[75vh] w-full flex items-center justify-center overflow-hidden rounded-2xl bg-slate-950 border border-slate-800">
          <img
            src={photo.dataUrl}
            alt={photo.caption}
            className="max-h-[72vh] max-w-full object-contain rounded-xl select-none"
          />
        </div>

        {/* Date info footer */}
        {photo.createdAt && (
          <div className="mt-2 text-xs text-slate-400 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>Chụp lúc: {new Date(photo.createdAt).toLocaleString('vi-VN')}</span>
          </div>
        )}

      </div>
    </div>
  );
};
