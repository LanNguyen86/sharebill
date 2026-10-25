// Tiện ích nén ảnh client-side bằng HTML5 Canvas để tiết kiệm bộ nhớ
export const compressImage = (file, maxWidth = 1200, maxHeight = 1200, quality = 0.75) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Tính toán tỷ lệ co lại nếu lớn hơn maxWidth hoặc maxHeight
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Xuất data URL dạng JPEG chất lượng tối ưu
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

// Chuyển đổi Blob từ Camera Stream thành Data URL nén
export const compressFromVideo = (videoElement, maxWidth = 1200, quality = 0.8) => {
  const canvas = document.createElement('canvas');
  let width = videoElement.videoWidth || 640;
  let height = videoElement.videoHeight || 480;

  if (width > maxWidth) {
    height = Math.round((height * maxWidth) / width);
    width = maxWidth;
  }

  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(videoElement, 0, 0, width, height);

  return canvas.toDataURL('image/jpeg', quality);
};
