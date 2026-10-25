import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, RefreshCw, Check, FlipHorizontal, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { compressFromVideo, compressImage } from '../utils/imageCompressor';

export const CameraCaptureModal = ({ isOpen, onClose, onSavePhoto }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [capturedDataUrl, setCapturedDataUrl] = useState(null);
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' (cam sau) hoặc 'user' (cam trước)
  const [cameraError, setCameraError] = useState(null);
  const [caption, setCaption] = useState('');
  const [tag, setTag] = useState('bill'); // 'bill', 'court', 'party', 'other'
  const fileInputRef = useRef(null);

  // Khởi động Camera khi mở modal
  useEffect(() => {
    if (!isOpen || capturedDataUrl) return;

    let isMounted = true;
    const startCamera = async () => {
      setCameraError(null);
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Trình duyệt không hỗ trợ truy cập camera trực tiếp. Vui lòng chọn tải ảnh.');
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: facingMode },
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          },
          audio: false
        });

        if (isMounted) {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(e => console.log('Video play error:', e));
          }
        } else {
          stream.getTracks().forEach(track => track.stop());
        }
      } catch (err) {
        console.error('Lỗi khởi động camera:', err);
        if (isMounted) {
          setCameraError(err.message || 'Không thể mở camera. Vui lòng cấp quyền truy cập camera.');
        }
      }
    };

    startCamera();

    return () => {
      isMounted = false;
      stopCamera();
    };
  }, [isOpen, facingMode, capturedDataUrl]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  // Đổi camera trước / sau
  const handleToggleFacingMode = () => {
    stopCamera();
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  };

  // Chụp ảnh từ luồng video
  const handleCapture = () => {
    if (!videoRef.current) return;
    try {
      const dataUrl = compressFromVideo(videoRef.current, 1200, 0.8);
      stopCamera();
      setCapturedDataUrl(dataUrl);
    } catch (err) {
      console.error('Lỗi khi chụp ảnh:', err);
    }
  };

  // Chọn ảnh từ file (khi camera lỗi hoặc muốn tải ảnh từ máy)
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImage(file, 1200, 1200, 0.8);
      stopCamera();
      setCapturedDataUrl(dataUrl);
    } catch (err) {
      console.error('Lỗi đọc ảnh:', err);
      alert('Không thể đọc ảnh, vui lòng thử lại.');
    }
  };

  // Chụp lại
  const handleRetake = () => {
    setCapturedDataUrl(null);
    setCameraError(null);
  };

  // Lưu ảnh
  const handleConfirmSave = () => {
    if (!capturedDataUrl) return;

    onSavePhoto({
      id: 'photo_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      dataUrl: capturedDataUrl,
      caption: caption.trim() || getDefaultCaption(tag),
      tag,
      createdAt: new Date().toISOString()
    });

    handleClose();
  };

  const getDefaultCaption = (selectedTag) => {
    switch (selectedTag) {
      case 'bill': return 'Hóa đơn / Phiếu thu';
      case 'court': return 'Ảnh check-in sân Pickleball';
      case 'party': return 'Ảnh bàn tiệc liên hoan';
      default: return 'Ảnh minh chứng';
    }
  };

  const handleClose = () => {
    stopCamera();
    setCapturedDataUrl(null);
    setCaption('');
    setCameraError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 rounded-3xl max-w-lg w-full shadow-2xl border border-slate-700 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 bg-slate-800/90 text-white flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-lime-400 text-slate-900 flex items-center justify-center font-bold">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base">Chụp Ảnh Minh Chứng</h3>
              <p className="text-[11px] text-slate-400">Hóa đơn thanh toán, bill sân hoặc ảnh check-in</p>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder / Preview Body */}
        <div className="relative flex-1 bg-black flex items-center justify-center min-h-[300px] overflow-hidden">
          {capturedDataUrl ? (
            /* Ảnh vừa chụp được */
            <div className="relative w-full h-full max-h-[420px] flex items-center justify-center p-2">
              <img
                src={capturedDataUrl}
                alt="Captured Proof"
                className="max-h-[400px] max-w-full object-contain rounded-xl shadow-lg border border-slate-700"
              />
              <span className="absolute top-4 left-4 bg-lime-400 text-slate-950 font-bold text-xs px-2.5 py-1 rounded-full shadow">
                Đã chụp thành công
              </span>
            </div>
          ) : cameraError ? (
            /* Khi không mở được camera */
            <div className="p-6 text-center text-slate-300 max-w-sm">
              <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-3" />
              <p className="text-sm font-semibold text-white mb-1">Không thể mở Camera</p>
              <p className="text-xs text-slate-400 mb-4">{cameraError}</p>
              
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 mx-auto shadow-md"
              >
                <ImageIcon className="w-4 h-4" />
                <span>Chọn ảnh từ thư viện máy</span>
              </button>
            </div>
          ) : (
            /* Camera Live Viewfinder */
            <div className="relative w-full h-full min-h-[320px] flex items-center justify-center">
              <video
                ref={videoRef}
                playsInline
                muted
                autoPlay
                className="w-full h-full object-cover max-h-[400px]"
              />

              {/* Grid Overlay cho bố cục chụp hóa đơn */}
              <div className="absolute inset-0 pointer-events-none border-2 border-white/20 m-6 rounded-2xl flex flex-col justify-between p-4">
                <div className="text-white/60 text-[11px] bg-black/40 self-center px-2 py-0.5 rounded-full backdrop-blur-xs">
                  Căn chỉnh hóa đơn / cảnh chụp vào giữa khung
                </div>
              </div>

              {/* Nút lật camera trước / sau */}
              <button
                type="button"
                onClick={handleToggleFacingMode}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors backdrop-blur-sm"
                title="Đổi camera trước / sau"
              >
                <FlipHorizontal className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Chỉnh sửa thông tin & Nút hành động */}
        <div className="p-4 bg-slate-800 text-white space-y-3 border-t border-slate-700">
          
          {capturedDataUrl ? (
            /* Giao diện khi đã chụp xong: Chọn Tag & Ghi chú */
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Phân loại minh chứng:
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setTag('bill')}
                    className={`py-1.5 px-2 rounded-xl font-semibold border flex items-center justify-center gap-1 transition-all ${
                      tag === 'bill'
                        ? 'bg-amber-500 text-slate-950 border-amber-400'
                        : 'bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600'
                    }`}
                  >
                    <span>🧾 Hóa đơn / Bill</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTag('court')}
                    className={`py-1.5 px-2 rounded-xl font-semibold border flex items-center justify-center gap-1 transition-all ${
                      tag === 'court'
                        ? 'bg-emerald-500 text-white border-emerald-400'
                        : 'bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600'
                    }`}
                  >
                    <span>🎾 Sân Pickleball</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTag('party')}
                    className={`py-1.5 px-2 rounded-xl font-semibold border flex items-center justify-center gap-1 transition-all ${
                      tag === 'party'
                        ? 'bg-purple-500 text-white border-purple-400'
                        : 'bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600'
                    }`}
                  >
                    <span>🍻 Bàn liên hoan</span>
                  </button>
                </div>
              </div>

              <div>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder={`Ghi chú (mặc định: ${getDefaultCaption(tag)})`}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-900 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-lime-400"
                />
              </div>

              <div className="flex items-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={handleRetake}
                  className="flex-1 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Chụp lại</span>
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSave}
                  className="flex-1 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-lg shadow-lime-400/20 transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>Lưu minh chứng</span>
                </button>
              </div>
            </div>
          ) : (
            /* Nút bấm chụp ảnh lớn & Nút tải ảnh */
            <div className="flex items-center justify-between px-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs text-slate-300 hover:text-white flex items-center gap-1.5 py-2 px-3 rounded-xl hover:bg-slate-700/80 transition-colors"
              >
                <ImageIcon className="w-4 h-4 text-emerald-400" />
                <span>Thư viện</span>
              </button>

              {/* Shutter Button */}
              <button
                type="button"
                onClick={handleCapture}
                disabled={!!cameraError}
                className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center bg-lime-400 text-slate-900 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-lime-400/30 disabled:opacity-40 disabled:cursor-not-allowed"
                title="Bấm để chụp ảnh"
              >
                <div className="w-12 h-12 rounded-full border-2 border-slate-900/40 bg-lime-400"></div>
              </button>

              <button
                type="button"
                onClick={handleClose}
                className="text-xs text-slate-400 hover:text-white py-2 px-3"
              >
                Hủy
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
