# 🎾 PickleSplit Pro - Ứng Dụng Quản Lý Sân & Chia Bill Tiệc Pickleball

Web App chuyên dụng dành riêng cho **Quản lý sân Pickleball**, **Thủ quỹ câu lạc bộ** và **Người tổ chức tiệc liên hoan/giao lưu**.

---

## 🌟 Tính Năng Nổi Bật

### 1. 📊 Hệ Thống Dashboard Quản Lý Chung (Mới!)
- **Thống Kê KPI Toàn Diện**:
  - Tổng dòng tiền chi phí đã luân chuyển qua tất cả các buổi tiệc.
  - Tổng số buổi giao lưu, tổng số lượt người chơi và số hội viên thường xuyên.
  - Tỷ lệ thu hồi tiền (%) và tổng số tiền công nợ chưa thu.
- **Phân Tích Cơ Cấu Chi Phí**:
  - Biểu đồ phân bổ tỷ lệ % trực quan giữa Tiền sân/đèn/bóng, Đồ ăn/tiệc lẩu, và Bia rượu/đồ uống có cồn.
- **Theo Dõi & Thu Hồi Công Nợ (Debt Tracker)**:
  - Danh sách chi tiết những người đang nợ tiền từ các buổi tiệc.
  - Bấm **"Mã QR"** để tạo mã VietQR cho người đó quét trả ngay.
  - Bấm **"Nhắc Zalo"** để sao chép tin nhắn nhắc nộp tiền lịch sự, văn minh gửi qua Zalo.
  - Bấm **"Xác nhận đã nộp"** để gạch nợ ngay lập tức.
- **Bảng Xếp Hạng Hội Viên Tích Cực**: Vinh danh top người chơi tham gia nhiều buổi nhất.
- **Xuất Báo Cáo Excel (CSV)**: Tải file báo cáo tài chính tổng quan bằng 1 click để lưu trữ hoặc gửi ban quản trị.

### 2. 👥 Quản Lý Người Tham Gia
- **Thêm nhanh từng người** hoặc **Dán danh sách từ Zalo / Messenger**: Tự động lọc bỏ số thứ tự (`1.`, `2.`, `3.`), gạch đầu dòng, dấu phẩy.
- **Phân loại Có cồn (🍺) / Không cồn (🥤)**: Giải quyết dứt điểm nỗi lo tính tay tiền bia rượu - người không uống bia không phải chịu tiền bia.
- **Hệ số suất linh hoạt**: Hỗ trợ 1.0 suất (chuẩn), 0.5 suất (trẻ em), 1.5 - 2.0 suất (người dẫn bạn đi cùng).

### 2. 🧾 Quản Lý Dịch Vụ & Món Ăn Trong Buổi Tiệc
- **Nút thêm nhanh Preset dịch vụ sân thể thao**:
  - 🎾 Tiền thuê sân (theo giờ)
  - 💡 Tiền đèn ban đêm
  - 🏓 Hộp bóng Pickleball thi đấu
  - 🏸 Thuê vợt
  - 🥤 Nước bù khoáng Revive / Aquafina
  - 🍲 Lẩu gà, đồ nướng liên hoan
  - 🍺 Thùng bia Tiger / Heineken
  - 🧾 Khăn lạnh, phí phục vụ
- **Hỗ trợ gõ tắt số tiền tiện lợi**: `150k`, `1tr2`, `600000`, `2.5tr`.
- **Cơ chế chia tiền thông minh (Split Type)**:
  - 🌐 Chia đều tất cả
  - 🍺 Chỉ người có uống bia/rượu
  - 🥤 Chỉ người uống nước ngọt/không cồn
- **Ghi nhận ai là người đã chi trả/ứng trước**: Quản lý sân, hoặc từng người tham gia ứng trước món nào hệ thống đều tự động bù trừ.

### 3. 📸 Chụp Ảnh Minh Chứng & Hóa Đơn (Mới!)
- **Chụp trực tiếp bằng Camera**: Mở camera sau/trước của điện thoại hoặc webcam để chụp ngay hóa đơn tại quán hoặc chụp ảnh sân đấu.
- **Tải ảnh từ thư viện**: Cho phép chọn nhiều ảnh bill đã lưu trong máy.
- **Tự động nén ảnh thông minh**: Thu nhỏ dung lượng từ 5MB xuống ~80KB mà vẫn rõ nét từng chi tiết chữ số trên hóa đơn, không lo đầy bộ nhớ.
- **Gắn nhãn (Tag)**: Phân loại nhanh `🧾 Hóa đơn / Bill`, `🎾 Sân Pickleball`, `🍻 Bàn liên hoan`.
- **Xem phóng to (Lightbox)**: Xem ảnh kích thước lớn, tải ảnh về máy, xóa ảnh.
- **Tự động đính kèm vào Hóa đơn & Tin nhắn Zalo**: Minh bạch tuyệt đối, ai cũng có thể đối chiếu.

### 4. ⚡ Bảng Chia Tiền & VietQR Thanh Toán
- **Tự động tính toán thực tế**: Mỗi người phải nộp bao nhiêu (màu đỏ) hoặc nhận lại bao nhiêu (màu xanh).
- **Tích hợp VietQR chuẩn Napas 24/7**:
  - Bấm nút **"Mã QR"** cạnh tên từng người: App hiển thị mã QR kèm đúng số tiền và nội dung chuyển khoản (`Tên Pickleball`).
  - Người chơi chỉ cần bật App ngân hàng (VCB, MB, Techcombank, BIDV, Momo...) quét mã là xong ngay!
- **Theo dõi tiến độ nộp tiền**: Bấm tick hoàn thành khi người chơi chuyển khoản, có hiệu ứng pháo hoa Confetti khi thu đủ 100%.
- **Lộ trình chuyển khoản tối ưu (Debt Minimization)**: Giảm tối đa số giao dịch lòng vòng giữa các thành viên.

### 4. 📲 Xuất Báo Cáo & Gửi Nhóm Zalo
- **1 chạm "Sao chép gửi Zalo"**: Định dạng tin nhắn chuẩn đẹp với icon emojis, chi tiết tiền sân, mồi lẩu, bia, số tiền từng người và số tài khoản nhận tiền.
- **Lưu ảnh Hóa đơn (PNG)**: Xuất hóa đơn phong cách thể thao sắc nét để gửi ảnh trực tiếp vào nhóm Zalo.

### 5. 🗂️ Lưu Trữ & Lịch Sử
- Dữ liệu tự động lưu vào trình duyệt (LocalStorage).
- Lưu lại lịch sử các buổi tiệc trước, có thể mở lại hoặc tái sử dụng danh sách người chơi cho buổi sau.

---

## 🚀 Hướng Dẫn Khởi Chạy

Dự án đã được cài đặt đầy đủ:
- Mở terminal tại thư mục này và chạy:
  ```bash
  npm run dev
  ```
- Mở trình duyệt truy cập: **`http://localhost:3000/`**
- Để mở cho các thiết bị khác (điện thoại, iPad) cùng mạng wifi truy cập:
  ```bash
  npm run dev:host
  ```
