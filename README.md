# Hệ thống Quản lý Thư viện - Đồ án HQTCSDL

Đồ án triển khai hệ thống quản lý thư viện trường học trên Oracle Database, hỗ trợ nhiều người dùng, giao tác an toàn, Stored Procedure, Trigger, xử lý đồng thời và báo cáo thống kê.

## 1. Mục tiêu

- Quản lý tài khoản và phân quyền.
- Quản lý độc giả, nhân viên, danh mục, sách, lô sách và kho sách.
- Lập phiếu mượn, thêm sách vào phiếu, nhận trả sách.
- Ghi nhận vi phạm và tiền phạt.
- Nhập sách từ nhà cung cấp và thanh lý sách.
- Báo cáo mượn-trả, tồn kho và tiền phạt.
- Trình bày các vấn đề đồng thời: Lost Update, Uncommitted Read, Non-repeatable Read, Phantom Read, Deadlock.

## 2. Công nghệ

| Thành phần | Công nghệ |
|---|---|
| Frontend | React, Vite, Material UI |
| Backend | Node.js, Express |
| Database | Oracle Database 21c XE |
| Oracle driver | `oracledb` (thin mode) |

## 3. Cấu trúc dự án

```text
library_oracle_hqtcsdl/
├── BackEnd/
│   ├── controllers/hqtcsdlController.js   # API logic + Oracle error mapping
│   ├── Database/database.js               # Oracle connection pool
│   ├── routes/route.js                    # Express routes
│   └── .env                               # DB credentials (không commit)
├── Database/
│   ├── 01_HQTCSDL_Schema.sql             # Bảng, ràng buộc, sequence
│   ├── 02_HQTCSDL_Procedures_Triggers.sql # SP, Functions, Triggers
│   ├── 03_HQTCSDL_Demo_Data.sql          # Dữ liệu mẫu
│   ├── 04_HQTCSDL_Concurrency_Demo.sql   # Kịch bản đồng thời
│   ├── 05_HQTCSDL_Report_Queries.sql     # Truy vấn báo cáo
│   └── 06_HQTCSDL_Quick_Verify.sql       # Kiểm tra nhanh
├── FrontEnd/
│   └── src/pages/HQTCSDL/
│       ├── Actions.jsx                    # Form giao dịch (MUI)
│       └── Dashboard.jsx                  # Bảng thống kê
└── README.md
```

## 4. Kịch bản Kiểm thử & Xử lý đồng thời

Dự án bao gồm kịch bản kiểm thử toàn diện kết hợp giữa giao diện Web và **Oracle SQL Developer**.

**Quy trình chuẩn cho mỗi test case:**
1. Chạy query trên **SQL Developer** để xem dữ liệu TRƯỚC khi giao dịch.
2. Thao tác chức năng trên giao diện **Web** (Ví dụ: Thêm phiếu mượn).
3. Chạy lại query trên **SQL Developer** để kiểm chứng dữ liệu SAU giao dịch (Ví dụ: Số lượng tồn kho tự động giảm).

**Các kịch bản đồng thời (Concurrency) đã xử lý:**
- **Lost Update:** Sử dụng `SELECT ... FOR UPDATE` (Thủ thư 2 phải chờ Thủ thư 1 nhả khóa).
- **Uncommitted Read (Dirty Read):** Oracle mặc định mức cô lập `READ COMMITTED`, chặn đọc dữ liệu chưa commit.
- **Phantom Read:** Khắc phục bằng cách thiết lập `SET TRANSACTION ISOLATION LEVEL SERIALIZABLE`.
- **Deadlock:** Oracle tự phát hiện khóa chéo (`ORA-00060`) và tự động rollback 1 giao dịch.

## 4. Database Oracle

### Khởi tạo

Chạy theo thứ tự trong SQL*Plus hoặc SQL Developer với user `LIBRARY_ADMIN`:

```sql
@Database/01_HQTCSDL_Schema.sql
@Database/02_HQTCSDL_Procedures_Triggers.sql
@Database/03_HQTCSDL_Demo_Data.sql
@Database/06_HQTCSDL_Quick_Verify.sql
```

### Các bảng chính

- `TAIKHOAN`, `DOCGIA`, `NHANVIEN`, `DOANHMUC`, `SACH`, `LOSACH`, `KHOSACH`
- `PHIEUMUON`, `CT_PHIEUMUON`, `PHIEUTRA`, `VIPHAM`
- `NHACUNGCAP`, `PHIEUNHAP`, `CT_PHIEUNHAP`, `PHIEUTRANCC`, `THANHLY`

### Stored Procedures

| Procedure | Chức năng |
|---|---|
| `SP_DANGKY_DOCGIA` | Đăng ký độc giả mới |
| `SP_TAO_PHIEU_MUON` | Tạo phiếu mượn (trả về mã phiếu) |
| `SP_THEM_CT_PHIEUMUON` | Thêm sách vào phiếu mượn |
| `SP_TRA_SACH` | Nhận trả sách, tính phạt |
| `SP_NHAP_SACH` | Nhập sách từ nhà cung cấp |
| `SP_THANHLY_SACH` | Thanh lý sách khỏi kho |

### Functions

| Function | Chức năng |
|---|---|
| `FN_SO_SACH_DANG_MUON` | Đếm số sách đang mượn |
| `FN_SO_LUONG_CON_LAI` | Kiểm tra tồn kho |
| `FN_KIEM_TRA_THE_HOP_LE` | Xác nhận thẻ độc giả còn hạn |
| `FN_TINH_TIEN_PHAT` | Tính tiền phạt quá hạn |

## 5. Backend API

Base URL: `http://localhost:3000/db-api/hqtcsdl`

| Method | Endpoint | Chức năng |
|---|---|---|
| GET | `/dashboard` | Số liệu tổng quan (sách, độc giả, phiếu mượn, phạt) |
| GET | `/books` | Danh sách sách và tồn kho |
| GET | `/readers` | Danh sách độc giả |
| POST | `/readers` | Đăng ký độc giả mới |
| GET | `/loans` | Danh sách phiếu mượn |
| POST | `/loans` | Tạo phiếu mượn (trả về `loanId`) |
| POST | `/loan-items` | Thêm sách vào phiếu mượn |
| POST | `/return` | Nhận trả sách |
| POST | `/import-book` | Nhập sách vào kho |
| POST | `/liquidate-book` | Thanh lý sách |

### Xử lý lỗi

Backend tự động dịch mã lỗi Oracle thành thông báo tiếng Việt có dấu rõ ràng:

| Mã Oracle | Thông báo |
|---|---|
| `ORA-00001` | Dữ liệu bị trùng lặp hoặc đã tồn tại trong hệ thống. |
| `ORA-02291` | Dữ liệu tham chiếu không tồn tại. |
| `ORA-02292` | Không thể thao tác vì dữ liệu đang được sử dụng ở nơi khác. |
| `ORA-20xxx` | Thông báo từ Procedure/Trigger |
| Thiếu field | Vui lòng nhập đầy đủ các thông tin: ... |

## 6. Hướng dẫn chạy

### 1. Khởi động Oracle

Đảm bảo 2 service đang chạy:
- `OracleServiceXE`
- `OracleOraDB21Home1TNSListener`

### 2. Khởi động Backend

```bash
cd BackEnd
npm install
npm start
```

File `.env` cần có:

```env
DATABASE_USER=LIBRARY_ADMIN
DATABASE_PASSWORD=admin
DATABASE_CONNECTION_STRING=localhost:1521/XEPDB1
PORT=3000
```

### 3. Khởi động Frontend

```bash
cd FrontEnd
npm install
npm run dev
```

Truy cập: `http://127.0.0.1:5173`

### 4. Kiểm tra nhanh

```bash
# Kiểm tra cú pháp Backend
cd BackEnd && npm run check

# Build Frontend
cd FrontEnd && npm run build

# Test API
curl http://localhost:3000/db-api/hqtcsdl/dashboard
```

## 7. Giao diện chính

Trang **Giao dịch thư viện** (`/hqtcsdl/actions`) gồm 6 tab:

1. **Cấp thẻ độc giả** — Đăng ký độc giả mới
2. **Nhập sách** — Nhập sách từ nhà cung cấp
3. **Lập phiếu mượn** — Tạo phiếu mượn cho độc giả
4. **Thêm sách vào phiếu** — Thêm sách vào phiếu mượn đã tạo
5. **Nhận trả sách** — Thu hồi sách và tính phạt
6. **Thanh lý sách** — Ghi nhận sách loại khỏi lưu thông

Trang **Dashboard** (`/hqtcsdl/dashboard`) hiển thị thống kê tổng quan.

## 8. Trạng thái

- Oracle: `LIBRARY_ADMIN/admin@localhost:1521/XEPDB1`
- Backend: syntax check PASS
- Frontend: production build PASS
- API GET/POST: đã kiểm tra thành công
- Error handling: lỗi Oracle được dịch sang thông báo rõ ràng
