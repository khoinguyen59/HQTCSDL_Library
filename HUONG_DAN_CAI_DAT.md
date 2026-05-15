# HƯỚNG DẪN CÀI ĐẶT HỆ THỐNG QUẢN LÝ THƯ VIỆN

> Tài liệu này hướng dẫn cách cài đặt và chạy dự án từ đầu trên một máy tính mới sau khi clone repo về.

## Yêu cầu phần mềm

| Phần mềm | Phiên bản tối thiểu | Ghi chú |
|---|---|---|
| **Oracle Database** | 21c XE hoặc 19c | Cần cài đặt và khởi động trước |
| **Oracle SQL Developer** | 23.x | Giao diện đồ họa để quản lý DB |
| **Node.js** | v16+ | Khuyến nghị v18 LTS |
| **npm** | v8+ | Đi kèm Node.js |
| **Git** | 2.x | Để clone repo |
| **Trình duyệt** | Chrome / Edge | Chạy giao diện web |

---

## Bước 1 — Clone repo

```bash
git clone https://github.com/khoinguyen59/HQTCSDL_Library.git
cd HQTCSDL_Library
```

---

## Bước 2 — Cài đặt Oracle Database

### 2.1. Tải và cài Oracle XE

- Tải tại: https://www.oracle.com/database/technologies/xe-downloads.html
- Chạy installer, đặt mật khẩu cho tài khoản `SYS` và `SYSTEM` (ghi nhớ mật khẩu này).
- Sau khi cài xong, đảm bảo 2 service Windows đang chạy:
  - `OracleServiceXE`
  - `OracleOraDB21Home1TNSListener` (tên có thể khác tùy phiên bản)

> **Kiểm tra nhanh:** Mở CMD, gõ `lsnrctl status`. Nếu thấy `Service "XEPDB1" has 1 instance(s)` là Oracle đã sẵn sàng.

### 2.2. Tạo user LIBRARY_ADMIN

Mở **Oracle SQL Developer**, tạo kết nối:
- **Username:** `sys`
- **Role:** `SYSDBA`
- **Password:** (mật khẩu bạn đặt khi cài Oracle)
- **Hostname:** `localhost`
- **Port:** `1521`
- **Service name:** `XEPDB1`

Kết nối thành công → Mở SQL Worksheet → Paste và chạy (F5):

```sql
-- Tạo user cho đồ án
CREATE USER LIBRARY_ADMIN IDENTIFIED BY admin;

-- Cấp quyền
GRANT CONNECT, RESOURCE TO LIBRARY_ADMIN;
GRANT CREATE SESSION, CREATE TABLE, CREATE SEQUENCE TO LIBRARY_ADMIN;
GRANT CREATE VIEW, CREATE PROCEDURE, CREATE TRIGGER TO LIBRARY_ADMIN;
ALTER USER LIBRARY_ADMIN QUOTA UNLIMITED ON USERS;
```

### 2.3. Khởi tạo schema và dữ liệu mẫu

Tạo kết nối mới trong SQL Developer:
- **Username:** `LIBRARY_ADMIN`
- **Password:** `admin`
- **Hostname:** `localhost`
- **Port:** `1521`
- **Service name:** `XEPDB1`

Kết nối thành công → Mở và chạy lần lượt (F5) theo đúng thứ tự:

| Thứ tự | File | Nội dung |
|---|---|---|
| 1 | `Database/01_HQTCSDL_Schema.sql` | Tạo 16 bảng, ràng buộc, sequence |
| 2 | `Database/02_HQTCSDL_Procedures_Triggers.sql` | Stored Procedures, Functions, Triggers |
| 3 | `Database/03_HQTCSDL_Demo_Data.sql` | Dữ liệu mẫu (sách, độc giả, nhân viên...) |
| 4 | `Database/06_HQTCSDL_Quick_Verify.sql` | *(Tùy chọn)* Kiểm tra dữ liệu đã vào đúng |

> **Lưu ý:** Mỗi file phải chạy **hoàn tất không lỗi** trước khi chạy file tiếp theo. Nếu gặp lỗi, kiểm tra xem đã đúng thứ tự chưa.

---

## Bước 3 — Cài đặt Backend (Node.js)

### 3.1. Cài dependencies

```bash
cd BackEnd
npm install
```

### 3.2. Tạo file cấu hình môi trường

File `.env` chứa thông tin kết nối DB, **không được đẩy lên GitHub** vì lý do bảo mật. Bạn cần tạo thủ công.

Tạo file `BackEnd/.env` với nội dung sau:

```env
DATABASE_USER=LIBRARY_ADMIN
DATABASE_PASSWORD=admin
DATABASE_CONNECTION_STRING=localhost:1521/XEPDB1
PORT=3000
```

> **Nếu máy bạn dùng port hoặc service name khác** (ví dụ `ORCL` thay vì `XEPDB1`), hãy đổi dòng `DATABASE_CONNECTION_STRING` cho phù hợp.

### 3.3. Khởi động Backend

```bash
npm start
```

✅ Thành công khi thấy:
```
Web server listening on localhost:3000
Startup complete
```

❌ Nếu thấy `ORA-xxxxx` hoặc `ECONNREFUSED` → Kiểm tra lại Oracle đã chạy chưa và thông tin `.env` có đúng không.

---

## Bước 4 — Cài đặt Frontend (React/Vite)

Mở **Terminal mới** (giữ nguyên Terminal Backend đang chạy):

```bash
cd FrontEnd
npm install
npm run dev
```

✅ Thành công khi thấy:
```
VITE v4.x.x ready in xxx ms
➜  Local:   http://localhost:5173/
```

---

## Bước 5 — Sử dụng

1. Mở trình duyệt → truy cập: **http://localhost:5173/login**
2. Đăng nhập:
   - **Tên đăng nhập:** `admin`
   - **Mật khẩu:** `123456`
3. Vào trang **Tổng quan** (`/hqtcsdl`) để xem Dashboard.
4. Vào trang **Giao dịch thư viện** (`/hqtcsdl/actions`) để thao tác nghiệp vụ.

---

## Tóm tắt cấu trúc kết nối

```
Trình duyệt (port 5173)
    ↕ HTTP
Backend Node.js (port 3000)
    ↕ oracledb thin driver
Oracle Database (port 1521, service XEPDB1)
    → User: LIBRARY_ADMIN / admin
```

---

## Xử lý sự cố thường gặp

| Lỗi | Nguyên nhân | Cách xử lý |
|---|---|---|
| `ECONNREFUSED 127.0.0.1:1521` | Oracle chưa chạy | Kiểm tra 2 service Oracle trong Services.msc |
| `Service "XEPDB1" is not registered` | Listener chưa đăng ký service | Chờ 1-2 phút sau khi Oracle khởi động, hoặc gõ `lsnrctl reload` |
| `ORA-01017: invalid username/password` | Sai thông tin `.env` | Kiểm tra lại user/password trong file `.env` |
| `ORA-01045: user lacks CREATE SESSION` | Thiếu quyền | Chạy lại `GRANT CONNECT, RESOURCE TO LIBRARY_ADMIN;` bằng SYS |
| `npm ERR! missing script: start` | Sai thư mục | Đảm bảo đang đứng trong thư mục `BackEnd` |
| Trang web trắng | Frontend chưa chạy | Kiểm tra Terminal 2 đã chạy `npm run dev` chưa |
