# 🌊 Sodeep - Tạo Câu Nói Hay và Sâu Lắng

![Sodeep Banner](https://via.placeholder.com/800x200/6366f1/ffffff?text=Sodeep+-+Deep+Quotes+Generator)

Sodeep là một ứng dụng web hiện đại giúp bạn tạo ra những câu nói hay, sâu lắng và đầy cảm hứng bằng công nghệ AI Gemini Pro 2.5. Với giao diện đẹp mắt và tính năng đa ngôn ngữ, Sodeep mang đến trải nghiệm tuyệt vời cho những ai yêu thích triết lý và sự suy tư.

## ✨ Tính năng chính

### 🎨 Tạo câu nói đa dạng
- **Nhiều văn phong**: Sâu lắng, lãng mạn, triết lý, truyền cảm hứng, thơ mộng
- **Đa chủ đề**: Tình yêu, cuộc sống, tình bạn, gia đình, sự nghiệp, thành công
- **3 ngôn ngữ**: Tiếng Việt, English, 中文

### 🤖 Tích hợp AI mạnh mẽ
- Sử dụng **Google Gemini Pro 2.5** để tạo nội dung chất lượng cao
- Prompt engineering được tối ưu hóa
- Xử lý lỗi thông minh và retry logic
- Rate limiting để tối ưu hiệu suất

### 🎯 Trải nghiệm người dùng xuất sắc
- **Responsive design**: Hoạt động mượt mà trên mọi thiết bị
- **Dark/Light mode**: Chuyển đổi giao diện theo sở thích
- **Copy to clipboard**: Sao chép câu nói dễ dàng
- **Lịch sử**: Lưu trữ và quản lý câu nói đã tạo
- **Animations**: Hiệu ứng mượt mà và thu hút

### 🔧 Tính năng kỹ thuật
- **Progressive Web App**: Có thể cài đặt như ứng dụng native
- **Offline support**: Hoạt động cơ bản khi không có internet
- **Local storage**: Lưu trữ dữ liệu cục bộ an toàn
- **Accessibility**: Tuân thủ chuẩn WCAG

## 🚀 Cài đặt và Sử dụng

### 1. Clone Repository

```bash
git clone https://github.com/KwokPacific/Sodeep.git
cd Sodeep
```

### 2. Cấu hình API Key

1. Truy cập [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Tạo API key mới cho Gemini
3. Copy file `.env.example` thành `.env` (nếu cần)
4. Thêm API key vào ứng dụng khi được yêu cầu

### 3. Chạy ứng dụng

#### Phương pháp 1: Sử dụng Live Server (Recommended)

```bash
# Cài đặt live-server globally
npm install -g live-server

# Chạy ứng dụng
npm run dev
```

#### Phương pháp 2: Sử dụng Python HTTP Server

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

#### Phương pháp 3: Sử dụng Node.js serve

```bash
npm install -g serve
npm start
```

### 4. Truy cập ứng dụng

Mở trình duyệt và truy cập: `http://localhost:8000` (hoặc port tương ứng)

## 📖 Hướng dẫn sử dụng

### Tạo câu nói mới

1. **Chọn văn phong**: Lựa chọn tone viết phù hợp với tâm trạng
2. **Chọn chủ đề**: Xác định nội dung bạn muốn khám phá
3. **Nhấn "Tạo câu nói"**: Đợi AI xử lý và tạo ra câu nói
4. **Thưởng thức kết quả**: Xem câu nói bằng 3 ngôn ngữ khác nhau

### Sao chép câu nói

- Nhấn nút **Copy** bên cạnh mỗi câu nói
- Câu nói sẽ được sao chép vào clipboard
- Thông báo xác nhận sẽ hiển thị

### Xem lịch sử

- Nhấn nút **Lịch sử** để xem các câu nói đã tạo
- Lịch sử được lưu trữ cục bộ trên thiết bị
- Có thể xóa lịch sử khi cần thiết

### Chuyển đổi giao diện

- Nhấn nút **🌙/☀️** ở góc trên bên phải
- Chuyển đổi giữa chế độ sáng và tối
- Thiết lập được lưu tự động

## ⌨️ Phím tắt

| Phím tắt | Chức năng |
|----------|-----------|
| `Ctrl/Cmd + Enter` | Tạo câu nói |
| `Ctrl/Cmd + H` | Mở lịch sử |
| `Ctrl/Cmd + D` | Chuyển đổi theme |
| `Escape` | Đóng modal |

## 🏗️ Cấu trúc dự án

```
Sodeep/
├── 📄 index.html              # Trang chính
├── 📁 css/
│   ├── 🎨 styles.css          # CSS chính
│   └── 🌙 themes.css          # Themes (Dark/Light)
├── 📁 js/
│   ├── ⚡ app.js              # Logic ứng dụng chính
│   ├── 🤖 gemini-api.js       # Tích hợp Gemini API
│   └── 🔧 utils.js            # Tiện ích và helper functions
├── 📁 assets/
│   └── 📁 images/
│       └── 🖼️ logo.png        # Logo ứng dụng
├── ⚙️ .env.example            # Cấu hình môi trường mẫu
├── 📦 package.json            # Metadata dự án
└── 📖 README.md               # Tài liệu này
```

## 🔧 Tùy chỉnh và Phát triển

### Thêm văn phong mới

Chỉnh sửa file `index.html`, thêm option mới vào select `#style`:

```html
<option value="văn phong mới">Văn phong mới</option>
```

### Thêm chủ đề mới

Tương tự, thêm option vào select `#topic`:

```html
<option value="chủ đề mới">Chủ đề mới</option>
```

### Tùy chỉnh prompt

Chỉnh sửa method `createPrompt()` trong file `js/gemini-api.js` để tối ưu hóa kết quả AI.

### Thêm theme mới

Tạo CSS variables mới trong file `css/themes.css`:

```css
[data-theme="custom"] {
  --color-primary: #your-color;
  /* ... other colors */
}
```

## 🔒 Bảo mật và Quyền riêng tư

- **API Key**: Được lưu trữ cục bộ trên thiết bị người dùng
- **Dữ liệu**: Không có dữ liệu nào được gửi đến server của chúng tôi
- **Lịch sử**: Lưu trữ hoàn toàn offline bằng localStorage
- **HTTPS**: Khuyến khích sử dụng HTTPS khi deploy production

## 🚀 Deployment

### Netlify (Recommended)

1. Fork repository này
2. Kết nối với Netlify
3. Deploy tự động từ nhánh main

### Vercel

1. Import project từ GitHub
2. Deploy với cấu hình mặc định

### GitHub Pages

1. Bật GitHub Pages trong repository settings
2. Chọn source là nhánh main
3. Truy cập qua URL GitHub Pages

### Custom Server

Upload tất cả files vào web hosting của bạn. Đảm bảo:
- Support HTTPS
- Serve static files
- Proper MIME types

## 🤝 Đóng góp

Chúng tôi hoan nghênh mọi đóng góp! Hãy:

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

### Quy tắc đóng góp

- Code phải clean và có comment
- Tuân thủ coding standards hiện tại
- Test kỹ trước khi submit
- Cập nhật documentation nếu cần

## 🐛 Báo lỗi

Gặp vấn đề? Hãy [tạo issue](https://github.com/KwokPacific/Sodeep/issues) với:

- Mô tả chi tiết lỗi
- Steps to reproduce
- Screenshots (nếu có)
- Browser và OS version
- Console errors (nếu có)

## 📝 License

Dự án này được phân phối dưới MIT License. Xem file `LICENSE` để biết thêm chi tiết.

## 👨‍💻 Tác giả

**Thái Bình Dương**
- GitHub: [@KwokPacific](https://github.com/KwokPacific)
- Email: contact@thaibinhduong.com

## 🙏 Lời cảm ơn

- [Google Gemini](https://deepmind.google/technologies/gemini/) - AI mạnh mẽ
- [Font Awesome](https://fontawesome.com/) - Icons tuyệt vời
- [Google Fonts](https://fonts.google.com/) - Typography đẹp
- Cộng đồng developers Việt Nam

## 🎯 Roadmap

### Version 1.1.0
- [ ] PWA support hoàn chỉnh
- [ ] Export/Import lịch sử
- [ ] Themes tùy chỉnh
- [ ] Chia sẻ lên social media

### Version 1.2.0
- [ ] Tích hợp text-to-speech
- [ ] Widget cho website khác
- [ ] API cho developers
- [ ] Multi-language interface

### Version 2.0.0
- [ ] AI models khác (Claude, GPT)
- [ ] Collaboration features
- [ ] Analytics dashboard
- [ ] Premium features

---

<div align="center">
  
**Được tạo với ❤️ bởi Thái Bình Dương**

[🌊 Trải nghiệm Sodeep](https://sodeep.vercel.app) | [📖 Documentation](https://github.com/KwokPacific/Sodeep/wiki) | [💬 Discord](https://discord.gg/sodeep)

</div>