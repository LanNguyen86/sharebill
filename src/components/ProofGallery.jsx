import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Image as ImageIcon, 
  Trash2, 
  Eye, 
  Plus, 
  Receipt, 
  Sparkles, 
  ShieldCheck,
  Calendar,
  Filter
} from 'lucide-react';
import { CameraCaptureModal } from './CameraCaptureModal';
import { ImageViewerModal } from './ImageViewerModal';
import { compressImage } from '../utils/imageCompressor';

export const ProofGallery = ({ photos = [], onUpdatePhotos }) => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [selectedViewerPhoto, setSelectedViewerPhoto] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('all'); // 'all', 'bill', 'court', 'party'
  const fileInputRef = useRef(null);

  // Thêm ảnh mới
  const handleAddPhoto = (newPhoto) => {
    onUpdatePhotos([newPhoto, ...photos]);
  };

  // Tải nhiều ảnh từ thư viện máy
  const handleUploadMultiple = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const newPhotosList = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const dataUrl = await compressImage(file, 1200, 1200, 0.8);
        newPhotosList.push({
          id: 'photo_' + (Date.now() + i) + '_' + Math.random().toString(36).substr(2, 4),
          dataUrl,
          caption: file.name.replace(/\.[^/.]+$/, "") || 'Ảnh minh chứng',
          tag: 'bill',
          createdAt: new Date().toISOString()
        });
      }
      onUpdatePhotos([...newPhotosList, ...photos]);
    } catch (err) {
      console.error('Lỗi khi tải ảnh:', err);
      alert('Có lỗi khi tải ảnh, vui lòng thử lại.');
    }
  };

  // Xóa ảnh
  const handleDeletePhoto = (id) => {
    onUpdatePhotos(photos.filter(p => p.id !== id));
  };

  // Lọc ảnh
  const filteredPhotos = selectedFilter === 'all' 
    ? photos 
    : photos.filter(p => p.tag === selectedFilter);

  const billCount = photos.filter(p => p.tag === 'bill').length;
  const courtCount = photos.filter(p => p.tag === 'court').length;
  const partyCount = photos.filter(p => p.tag === 'party').length;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      
      {/* Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-50 to-slate-100/60 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-sm">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Ảnh Minh Chứng & Hóa Đơn</h2>
              <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full font-bold">
                {photos.length} ảnh
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Chụp bill sân, hóa đơn quán nhậu hoặc ảnh check-in để minh bạch 100% chi phí
            </p>
          </div>
        </div>

        {/* Nút hành động */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <ImageIcon className="w-4 h-4 text-slate-600" />
            <span>Tải ảnh từ máy</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCameraOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all transform active:scale-95"
          >
            <Camera className="w-4 h-4" />
            <span>Chụp ảnh ngay</span>
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleUploadMultiple}
          className="hidden"
        />
      </div>

      {/* Filter Tabs Bar */}
      {photos.length > 0 && (
        <div className="px-4 py-2.5 bg-slate-50/80 border-b border-slate-200 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Lọc:
          </span>
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
              selectedFilter === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            Tất cả ({photos.length})
          </button>

          <button
            onClick={() => setSelectedFilter('bill')}
            className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 transition-all ${
              selectedFilter === 'bill'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <span>🧾 Hóa đơn / Bill</span>
            <span className="font-bold">({billCount})</span>
          </button>

          <button
            onClick={() => setSelectedFilter('court')}
            className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 transition-all ${
              selectedFilter === 'court'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <span>🎾 Sân Pickleball</span>
            <span className="font-bold">({courtCount})</span>
          </button>

          <button
            onClick={() => setSelectedFilter('party')}
            className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 transition-all ${
              selectedFilter === 'party'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <span>🍻 Bàn liên hoan</span>
            <span className="font-bold">({partyCount})</span>
          </button>
        </div>
      )}

      {/* Gallery Grid */}
      <div className="p-4 sm:p-5">
        {filteredPhotos.length === 0 ? (
          <div className="text-center py-12 px-4 text-slate-400">
            <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-400 mx-auto mb-3 flex items-center justify-center">
              <Camera className="w-8 h-8 stroke-1" />
            </div>
            <p className="text-sm font-semibold text-slate-700">Chưa có ảnh minh chứng nào</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Bấm <strong>"Chụp ảnh ngay"</strong> để mở camera chụp hóa đơn/bill tính tiền hoặc tải ảnh chụp từ máy điện thoại lên.
            </p>

            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsCameraOpen(true)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 shadow"
              >
                <Camera className="w-4 h-4" />
                <span>Chụp bill / ảnh ngay</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
            {filteredPhotos.map((photo) => {
              return (
                <div
                  key={photo.id}
                  className="group relative rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
                >
                  {/* Image container */}
                  <div 
                    onClick={() => setSelectedViewerPhoto(photo)}
                    className="relative aspect-4/3 w-full bg-slate-200 cursor-pointer overflow-hidden flex items-center justify-center"
                  >
                    <img
                      src={photo.dataUrl}
                      alt={photo.caption}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <span className="p-2 rounded-full bg-white/90 text-slate-900 shadow">
                        <Eye className="w-4 h-4" />
                      </span>
                    </div>

                    {/* Tag Badge */}
                    <div className="absolute top-2 left-2">
                      {photo.tag === 'bill' && (
                        <span className="bg-amber-500 text-slate-950 font-bold text-[10px] px-2 py-0.5 rounded-full shadow">
                          🧾 Hóa đơn
                        </span>
                      )}
                      {photo.tag === 'court' && (
                        <span className="bg-emerald-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-full shadow">
                          🎾 Sân đấu
                        </span>
                      )}
                      {photo.tag === 'party' && (
                        <span className="bg-purple-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-full shadow">
                          🍻 Bàn tiệc
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Caption & Info footer */}
                  <div className="p-2.5 bg-white flex items-center justify-between gap-1 flex-1">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-800 truncate" title={photo.caption}>
                        {photo.caption}
                      </p>
                      {photo.createdAt && (
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {new Date(photo.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('Xóa ảnh minh chứng này?')) {
                          handleDeletePhoto(photo.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors shrink-0"
                      title="Xóa ảnh này"
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

      {/* Camera Capture Modal */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onSavePhoto={handleAddPhoto}
      />

      {/* Full-size Image Viewer Lightbox */}
      <ImageViewerModal
        isOpen={!!selectedViewerPhoto}
        onClose={() => setSelectedViewerPhoto(null)}
        photo={selectedViewerPhoto}
        onDeletePhoto={handleDeletePhoto}
      />

    </div>
  );
};
