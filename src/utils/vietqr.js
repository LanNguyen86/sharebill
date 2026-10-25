// Tạo link ảnh VietQR tự động theo chuẩn VietQR.io
export const getVietQRUrl = ({
  bankCode,
  accountNo,
  accountName,
  amount,
  description = 'Tien Pickleball',
  template = 'compact2' // compact, compact2, qr_only, print
}) => {
  if (!bankCode || !accountNo) return null;

  const cleanAccountNo = accountNo.toString().trim();
  const cleanAmount = Math.max(0, Math.round(Number(amount) || 0));
  const encodedDesc = encodeURIComponent(description.slice(0, 50));
  const encodedName = encodeURIComponent(accountName ? accountName.toUpperCase() : '');

  return `https://img.vietqr.io/image/${bankCode}-${cleanAccountNo}-${template}.png?amount=${cleanAmount}&addInfo=${encodedDesc}&accountName=${encodedName}`;
};
