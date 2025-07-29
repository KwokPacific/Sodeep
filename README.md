# Sodeep - Hệ thống thông minh cho nội dung sâu lắng

Sodeep là một ứng dụng web hiện đại sử dụng công nghệ tiên tiến để tạo ra nội dung chất lượng cao và sâu sắc. Với giao diện đẹp mắt và tính năng mạnh mẽ, Sodeep giúp bạn tạo ra những nội dung có giá trị một cách dễ dàng.

## ✨ Tính năng chính

### 🔐 Quản lý dịch vụ an toàn
- Lưu trữ khóa dịch vụ an toàn trong localStorage của trình duyệt
- Mã hóa cơ bản để bảo vệ thông tin
- Tính năng hiện/ẩn khóa dịch vụ
- Validation và xử lý lỗi toàn diện

### 🎨 Giao diện đẹp mắt
- Logo SVG được thiết kế riêng với hiệu ứng depth
- Design responsive hoạt động trên mọi thiết bị
- Theme gradient hiện đại với glassmorphism
- Animation mượt mà và chuyển tiếp đẹp mắt

### 🚀 Tạo nội dung thông minh
- Giao diện đơn giản, dễ sử dụng
- Xử lý đầu vào linh hoạt
- Hiển thị kết quả rõ ràng
- Tính năng sao chép kết quả một clic

### 📱 Tương thích đa nền tảng
- Responsive design cho mobile, tablet, desktop
- Tối ưu hóa cho các trình duyệt hiện đại
- Progressive Web App ready

## 🛠️ Công nghệ sử dụng

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: CSS3 với Flexbox và Grid
- **Storage**: localStorage cho dữ liệu cục bộ
- **Icons**: Unicode icons và SVG
- **Animation**: CSS animations và transitions

## 📂 Cấu trúc dự án

```
Sodeep/
├── index.html          # Trang chính của ứng dụng
├── style.css           # Stylesheet cho giao diện
├── script.js           # Logic và functionality
└── README.md           # Tài liệu hướng dẫn
```

## 🚀 Cách sử dụng

### 1. Cài đặt
```bash
# Clone repository
git clone https://github.com/KwokPacific/Sodeep.git

# Mở thư mục dự án
cd Sodeep

# Mở index.html trong trình duyệt
# Hoặc sử dụng local server
python -m http.server 8000
# Truy cập http://localhost:8000
```

### 2. Cấu hình dịch vụ
1. Nhập khóa dịch vụ của bạn vào ô "Khóa dịch vụ"
2. Nhấn "Lưu khóa" để lưu trữ an toàn
3. Khóa sẽ được mã hóa và lưu trong localStorage

### 3. Tạo nội dung
1. Nhập mô tả nội dung bạn muốn trong ô textarea
2. Nhấn "Tạo ra nội dung"
3. Chờ hệ thống xử lý và hiển thị kết quả
4. Sử dụng nút "Sao chép kết quả" để copy nội dung

## 🔧 Cấu hình và tùy chỉnh

### Thay đổi theme
Bạn có thể tùy chỉnh màu sắc trong file `style.css`:
```css
/* Gradient chính */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Màu chủ đạo */
--primary-color: #3498db;
--secondary-color: #2980b9;
```

### Tùy chỉnh logo
Logo được tạo bằng SVG inline trong file `index.html`. Bạn có thể chỉnh sửa:
- Màu sắc gradient
- Kích thước và vị trí
- Font chữ và style

## 🔒 Bảo mật

- Khóa dịch vụ được mã hóa cơ bản trước khi lưu
- Không gửi dữ liệu nhạy cảm lên server
- Xử lý input để tránh XSS
- Validation đầu vào nghiêm ngặt

## 🌐 Hỗ trợ trình duyệt

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 📱 Responsive breakpoints

- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px
- **Mobile**: < 768px
- **Small mobile**: < 480px

## 🎯 Roadmap

- [ ] Dark mode toggle
- [ ] Themes tùy chỉnh
- [ ] Export kết quả ra file
- [ ] History và bookmark
- [ ] Offline support (PWA)
- [ ] Multiple language support

## 🤝 Đóng góp

Chúng tôi hoan nghênh mọi đóng góp! Vui lòng:

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📄 License

Dự án này được phân phối dưới MIT License. Xem file `LICENSE` để biết thêm chi tiết.

## 📞 Hỗ trợ

Nếu bạn gặp vấn đề hoặc có câu hỏi:

- Tạo issue trên GitHub
- Email: support@sodeep.com
- Documentation: [Wiki](https://github.com/KwokPacific/Sodeep/wiki)

## 🙏 Cảm ơn

Cảm ơn tất cả những người đã đóng góp và sử dụng Sodeep!

---

Made with ❤️ by Sodeep Team