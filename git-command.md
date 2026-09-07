# 🧰 SỔ TAY TOÀN TẬP LỆNH GIT, TERMINAL & PYTHON THỰC CHIẾN (MASTER CHEAT SHEET)
*Dành riêng cho Quản trị Học liệu & Tự động hóa Dự án EDEVX trên VS Code*

---

## ⚡ I. BỘ 3 DÒNG LỆNH "THẦN THÁNH" DÙNG 90% THỜI GIAN MỖI NGÀY

```bash
# 1. ĐẨY BÀI MỚI / SỬA BÀI LÊN MÂY (Gộp 3 trong 1 siêu tốc):
git add . ; git commit -m "Noi dung ghi chu bai hoc" ; git push

# 2. KÉO CẬP NHẬT TỪ BOT / GITHUB VỀ LƯU OFFLINE TRÊN MÁY:
git pull

# 3. CHẠY BOT TỰ ĐỘNG XUẤT BẢN / ẨN BÀI BLOGGER TRÊN MÁY:
python edevx_engine.py


# 4. Dòng lệnh đẩy bài mới hàng ngày - dùng thường xuyên
git add . ; git commit -m "Day file git-commmand.md" ; git push
```

---

## 📋 II. BẢNG TRA CỨU TOÀN BỘ LỆNH GIT THEO TỪNG TÌNH HUỐNG

### 🚀 1. Nhóm Đẩy Dữ Liệu Lên GitHub (Push & Commit)

| Lệnh Git | Ý Nghĩa & Tình Huống Sử Dụng |
| :--- | :--- |
| `git add .` | Gom toàn bộ các file vừa sửa đổi/tạo mới vào khu vực chờ gửi. |
| `git add ten_file.html` | Chỉ gom đúng 1 file cụ thể để chuẩn bị lưu. |
| `git commit -m "Ghi chú"` | Đóng gói và lưu lại lịch sử phiên bản kèm lời nhắn. |
| `git push` | Đẩy các bản commit từ máy tính lên kho lưu trữ `github.com`. |
| `git push -u origin main` | Đẩy code lên nhánh chính `main` và thiết lập theo dõi mặc định. |
| `git push -f origin main` | **Ép đẩy đè (Force Push):** Ghi đè toàn bộ code máy tính lên GitHub (dùng khi cần đồng bộ gấp). |

---

### 📥 2. Nhóm Kéo Dữ Liệu & Khởi Tạo Dự Án (Clone & Pull)

| Lệnh Git | Ý Nghĩa & Tình Huống Sử Dụng |
| :--- | :--- |
| `git pull` | Tải toàn bộ thay đổi mới nhất từ GitHub về máy tính. |
| `git clone <URL_REPO>` | Tải nguyên một dự án từ GitHub về máy tính lần đầu tiên. |
| `git init` | Khởi tạo một thư mục thường thành một kho Git trên máy. |
| `git remote add origin <URL>` | Kết nối thư mục trên máy tính với địa chỉ GitHub trên mạng. |
| `git remote -v` | Kiểm tra xem máy tính đang kết nối với địa chỉ GitHub nào. |

---

### 🔍 3. Nhóm Kiểm Tra Trạng Thái & Lịch Sử (Status & Log)

| Lệnh Git | Ý Nghĩa & Tình Huống Sử Dụng |
| :--- | :--- |
| `git status` | **Soi trạng thái:** Xem file nào đang sửa (màu đỏ), file nào đã sẵn sàng gửi (màu xanh). |
| `git log --oneline -n 5` | Xem danh sách tóm tắt 5 lần lưu bài gần đây nhất kèm mã Hash. |
| `git diff` | Xem chi tiết từng dòng code vừa được thêm (xanh) hoặc bớt (đỏ). |

---

### 🆘 4. Nhóm Cứu Hộ & Hoàn Tác (Undo / Reset Khi Gõ Nhầm)

| Lệnh Git | Ý Nghĩa & Tình Huống Sử Dụng |
| :--- | :--- |
| `git restore ten_file.html` | Hủy bỏ các sửa đổi nháp của 1 file, quay về bản lưu gần nhất. |
| `git restore .` | Hủy bỏ toàn bộ các sửa đổi nháp của tất cả các file trong thư mục. |
| `git reset HEAD~1` | Hủy lệnh commit vừa bấm (giữ nguyên code để sửa lại). |
| `git stash` | Tạm thời cất giấu các đoạn code đang viết dở vào góc riêng. |
| `git stash pop` | Lấy lại các đoạn code đang viết dở vừa cất ra để viết tiếp. |

---

### ⚡ 5. Nhóm Lấy Mã Hash Để Cập Nhật jsDelivr CDN

| Lệnh Git | Ý Nghĩa & Tình Huống Sử Dụng |
| :--- | :--- |
| `git rev-parse --short HEAD` | In ra ngay **7 ký tự mã Hash commit hiện tại** (ví dụ: `8f3a9b1`) để dán vào `theme.xml` cập nhật giao diện Blogger trong 1 giây. |
| `git tag v4.0 ; git push --tags` | Đánh dấu phát hành phiên bản mới `v4.0` lên toàn hệ thống. |

---

### 🌿 6. Nhóm Quản Lý Nhánh (Branches) Khi Thử Nghiệm

| Lệnh Git | Ý Nghĩa & Tình Huống Sử Dụng |
| :--- | :--- |
| `git branch` | Xem danh sách các nhánh trong dự án (nhánh chính là `main`). |
| `git checkout -b feature-moi` | Tạo và nhảy sang một nhánh mới để thử nghiệm tính năng mà không sợ hỏng code gốc. |
| `git checkout main` | Chuyển quay trở lại nhánh chính `main`. |
| `git merge feature-moi` | Gộp code thử nghiệm từ nhánh phụ vào nhánh chính. |
| `git branch -D feature-moi` | Xóa nhánh phụ sau khi đã thử nghiệm xong. |

---

## 🐍 III. BỘ LỆNH PYTHON & AUTOMATION DỰ ÁN EDEVX

```bash
# 1. Chạy cỗ máy tự động đăng / sửa / ẩn bài viết lên Blogger:
python edevx_engine.py

# 2. Nối 50 câu trắc nghiệm từ draft.json vào file Master:
python merge_json.py

# 3. Nối trắc nghiệm vào môn học chỉ định (Ví dụ Toán 6):
python merge_json.py database/lop06/toan6_t1.json

# 4. Cài đặt toàn bộ thư viện cần thiết cho dự án:
pip install google-api-python-client google-auth-oauthlib python-frontmatter gspread oauth2client

# 5. Thoát khỏi môi trường ảo (.venv):
deactivate
```

---

## 💻 IV. CÁC LỆNH TERMINAL / POWERSHELL ĐIỀU HƯỚNG CƠ BẢN

```bash
# Di chuyển vào thư mục con (ví dụ: edevx-vault):
cd edevx-vault

# Quay trở lại thư mục cha ở ngoài:
cd ..

# Xem danh sách các file trong thư mục hiện tại:
dir          # (Trên Windows)
ls           # (Trên Mac / Linux)

# Xóa sạch màn hình Terminal cho gọn mắt:
clear        # (hoặc phím tắt Ctrl + L)
```

---

## 💡 V. BẢNG TRA CỨU "TÔI MUỐN LÀM GÌ ➔ GÕ LỆNH GÌ"

| Bạn Muốn Làm Gì? | Câu Lệnh Cần Gõ |
| :--- | :--- |
| **Muốn đăng 1 bài viết mới** | Đổi `status: "PENDING"` $\rightarrow$ `git add . ; git commit -m "Them bai moi" ; git push` |
| **Muốn ẩn 1 bài về nháp** | Đổi `status: "DRAFT"` $\rightarrow$ `git add . ; git commit -m "An bai ve nhap" ; git push` |
| **Muốn sửa nội dung bài đã đăng** | Đổi `status: "UPDATE"` $\rightarrow$ `git add . ; git commit -m "Cap nhat noi dung" ; git push` |
| **Muốn cập nhật link bài về máy** | `git pull` |
| **Muốn ghép 50 câu trắc nghiệm** | Dán vào `draft.json` $\rightarrow$ `python merge_json.py` |
| **Muốn lấy mã Hash CDN** | `git rev-parse --short HEAD` |
| **Muốn hủy bỏ sửa nhầm code** | `git restore .` |

---

🎯 **MẸO BÀN PHÍM SIÊU NHANH:** 
Bấm **Mũi Tên Lên (⬆️)** trên bàn phím để gọi lại dòng lệnh dài vừa gõ trước đó mà không cần phải gõ lại từ đầu!

