# 🏛️ EDEVX THEME — HỆ SINH THÁI HỌC LIỆU SỐ & ĐỘNG CƠ VECTOR EDTECH (V8.2)

[![GitHub License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![EDEVX Version](https://img.shields.io/badge/Version-Master%20V8.2-indigo.svg)](#)
[![CSS Master](https://img.shields.io/badge/edevx.css-V3.9%20Master-purple.svg)](#)
[![JS Engine](https://img.shields.io/badge/edevx.js-V2.0%20Core-emerald.svg)](#)
[![jsDelivr CDN](https://img.shields.io/badge/CDN-jsDelivr%20Global-orange.svg)](https://www.jsdelivr.com/)
[![Target Platform](https://img.shields.io/badge/Platform-Blogger%20%7C%20Web%20%7C%20PWA-teal.svg)](https://edevx.blogspot.com)

> **EDEVX** (*Education DevX*) là nền tảng hạ tầng công nghệ giáo dục không máy chủ (Serverless & Headless EdTech Architecture). Hệ thống tích hợp các cỗ máy sư phạm tương tác đa phương thức: Bài giảng Web Active Recall, Trình chiếu Slide 16:9, Phiếu đề thi PDF A4 in ấn chuẩn 5 trang, Động cơ Vector luyện chữ ô ly 4 ly, và Ngân hàng câu hỏi trắc nghiệm K-12.

---

## ⚡ 1. CÁCH NHÚNG CDN NHANH (QUICKSTART)

Nhúng trực tiếp 2 file lõi vào thẻ `<head>` của website/Blogger để kích hoạt toàn bộ sức mạnh của EDEVX:

```html
<!-- EDEVX Master Stylesheet (CSS V3.9) -->
<link href="https://cdn.jsdelivr.net/gh/thientridev/edevx-theme@main/edevx.css" rel="stylesheet" />

<!-- EDEVX Master JavaScript Core Engine (JS V2.0) -->
<script defer src="https://cdn.jsdelivr.net/gh/thientridev/edevx-theme@main/edevx.js"></script>
```

---

## 📁 2. CẤU TRÚC REPOSITORY CHUẨN

```text
📁 edevx-theme/
├── 📁 fonts/                          ──► 14 File font chữ tập viết chuẩn Bộ GD&ĐT
│   ├── 📄 HP001_tieuhoc.ttf           ──► Font chữ chuẩn tiểu học HP001
│   ├── 📄 HP001_4H_Bold.ttf           ──► Font chữ đậm tập tô
│   ├── 📄 Andika-Regular.ttf          ──► Font chữ cấp 2 tốc viết không chân
│   └── 📄 Quicksand-Bold.ttf          ──► Font tiêu đề & thẻ đánh giá
│
├── 📁 database/                       ──► Ngân hàng trắc nghiệm phân tầng K-12
│   ├── 📁 lop1/ đến 📁 lop5/          ──► Học liệu Tiểu học
│   ├── 📁 lop6/                       ──► tienganh6_t1.json, toan6_t1.json, khtn6_t1.json
│   ├── 📁 lop7/ đến 📁 lop9/          ──► Học liệu Cấp 2 (THCS)
│   └── 📁 lop10/ đến 📁 lop12/        ──► Học liệu Cấp 3 & Luyện thi ĐH
│
├── 📄 edevx.css                       ──► Định dạng A4, Dark Mode, Slide, Vở ô ly 4 ly
├── 📄 edevx.js                        ──► Động cơ DOM Auto-Engines, KaTeX, Quiz DB RAM Cache
├── 📄 edevx-quotes.js                 ──► Ngân hàng châm ngôn giáo dục & danh ngôn
└── 📄 README.md                       ──► Tài liệu hướng dẫn hệ sinh thái EDEVX
```

---

## 🎛️ 3. TỔNG QUAN 5 CHẾ ĐỘ XUẤT BẢN (5 EDEVX MODES)

| Chế Độ (Mode) | Định Dạng Đầu Ra | Đặc Điểm Sư Phạm & Kỹ Thuật |
| :--- | :--- | :--- |
| **🟢 Mode 1** | **Bài Học Web Tương Tác** | Cấu trúc 7 phần tự động: Sổ Cornell Active Recall, Sơ đồ tư duy Markmap, Góc bóc tách 4 bẫy sư phạm, Trắc nghiệm chấm điểm tự động. |
| **🟣 Mode 2** | **Slide Trình Chiếu 16:9** | Tấm phông White Canvas, tự động phân trang Slide XX/YY, tự động tạo nút xuất file trình chiếu PDF. |
| **🟤 Mode 2B** | **Phiếu In PDF A4 (5 Trang)** | Khóa cứng 5 trang A4 không lệch lề: P1 Lý thuyết & 4 Bẫy $\rightarrow$ P2 MĐ1-MĐ2 $\rightarrow$ P3 Dạng thi 2025 $\rightarrow$ P4 Thực tế $\rightarrow$ P5 Lời giải 4 bước. |
| **✍️ Mode 2C** | **Luyện Chữ Vector 4 Ly** | Động cơ OpenType Vector Engine căn chân chữ chuẩn xác $0.000\text{mm}$, lưới sương mù Soft Pastel Grid chống mỏi mắt. |
| **🟡 Mode 3** | **Ngân Hàng JSON Database** | Chuẩn Schema quốc tế phân loại nhận thức Bloom 2D (`MĐ1` $\rightarrow$ `MĐ4`), tích hợp bộ nhớ đệm RAM Cache. |

---

## 🧠 4. ĐỘNG CƠ SƯ PHẠM ĐA MÔN (MOON.VN DNA)

Mọi nội dung trong hệ thống EDEVX đều tuân thủ nghiêm ngặt theo:
1. **Lộ trình 5 Bước Khép Kín:**
   $$\text{Lý thuyết cốt lõi} \longrightarrow \text{Ví dụ mẫu 4 bước} \longrightarrow \text{Tự luyện 30-50 câu} \longrightarrow \text{Tra cứu ID} \longrightarrow \text{"NGẪM" Sổ Cornell}$$
2. **Quy tắc Lời giải 4 bước:**
   * `[Bước 1: Phân tích đề]` $\rightarrow$ `[Bước 2: Cơ sở lý thuyết]` $\rightarrow$ `[Bước 3: Trình bày]` $\rightarrow$ `[Bước 4: Nhận xét & Bẫy sư phạm]`.
3. **KaTeX Protector Protocol:**
   * Khóa font KaTeX toàn cục chống lỗi đè font.
   * Quy chuẩn cú pháp dấu khác chuẩn toán học `$a \ne 0$` ($\ne$).

---

## 💻 5. CÁCH GỌI NGÂN HÀNG TRẮC NGHIỆM TRONG BÀI VIẾT (MODE 1)

Nhúng khối trắc nghiệm tự động gọi dữ liệu từ GitHub CDN chỉ với **1 dòng HTML**:

```html
<div class="edevx-quiz-db" 
     data-source="database/lop6/tienganh6_t1.json" 
     data-topic="ta6_u1_my_new_school" 
     data-limit="10" 
     data-random="true"></div>
```

---

## 🤖 6. TỰ ĐỘNG HÓA VẬN HÀNH (CI/CD DEVOPS)

* **Quản lý học liệu:** Bằng file `.html` và `.json` trên **VS Code**.
* **Đồng bộ đám mây:** Tự động qua **GitHub Private Cloud**.
* **Robot xuất bản:** **GitHub Actions + Python (`edevx_engine.py`)** chạy ngầm quét trạng thái `PENDING` và tự động xuất bản bài viết lên Blogger API v3.

---

## 👤 TÁC GIẢ & BẢN QUYỀN

* **Đơn vị phát triển:** EDEVX Project (*Education DevX*)
* **Quản trị viên:** **[@thientridev](https://github.com/thientridev)**
* **Hệ thống Website:** [https://edevx.blogspot.com](https://edevx.blogspot.com)
* **Giấy phép:** [MIT License](LICENSE) — Miễn phí cho mục đích giáo dục và phi thương mại.