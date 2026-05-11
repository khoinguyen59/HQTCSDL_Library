# Hệ thống quản lý thư viện - Đồ án HQTCSDL

Dự án này là bản triển khai riêng cho đồ án môn Hệ quản trị cơ sở dữ liệu. Ứng dụng được phát triển từ khung `Jakaria44`, nhưng đã được định hướng lại để bám sát `ĐỒ_ÁN_HQTCSDL.txt`, `Yêu cầu.txt` và `Yeu_cau_Do_an_mon_hoc.txt`.

Do not edit the original report files directly. Add implementation notes and supplement content in this README or in project-side documents instead.

## 1. Mục tiêu

Xây dựng hệ thống quản lý thư viện trường học trên Oracle, hỗ trợ nhiều người dùng cùng lúc và minh họa rõ các nội dung cốt lõi của môn học:

- Mô hình dữ liệu quan hệ.
- Ràng buộc toàn vẹn.
- Stored procedure.
- Trigger.
- Giao tác.
- Khóa và mức cô lập.
- Xử lý đồng thời.
- Report/thống kê.

## 2. Phạm vi nghiệp vụ

Hệ thống tập trung vào các nghiệp vụ chính:

- Quản lý tài khoản và phân quyền.
- Quản lý độc giả.
- Quản lý nhân viên/thủ thư.
- Quản lý danh mục sách.
- Quản lý sách, lô sách và kho sách.
- Lập phiếu mượn.
- Thêm chi tiết phiếu mượn.
- Trả sách.
- Ghi nhận vi phạm và tiền phạt.
- Nhập sách từ nhà cung cấp.
- Báo cáo mượn-trả, tồn kho và tiền phạt.
- Mô phỏng các vấn đề đồng thời.

Các chức năng phụ từ repo gốc như review, favourite, news/message, job/application không còn là trọng tâm.

## 3. Công nghệ

- Frontend: React, Vite, Material UI.
- Backend: Node.js, Express.
- Database: Oracle.
- Oracle driver: `oracledb`.

## 4. Cấu trúc thư mục

```text
library_oracle_hqtcsdl/
├── BackEnd/
│   ├── controllers/
│   │   └── hqtcsdlController.js
│   ├── Database/
│   │   ├── database.js
│   │   └── queryFunctions.js
│   └── routes/
│       └── route.js
├── Database/
│   ├── 01_HQTCSDL_Schema.sql
│   ├── 02_HQTCSDL_Procedures_Triggers.sql
│   ├── 03_HQTCSDL_Demo_Data.sql
│   ├── 04_HQTCSDL_Concurrency_Demo.sql
│   ├── Concurrency_Scenarios.md
│   ├── HQTCSDL_Transactions.sql
│   └── README_HQTCSDL.md
├── FrontEnd/
│   └── src/pages/Home/Home.jsx
├── DOI_CHIEU_YEU_CAU.md
├── HUONG_TRIEN_KHAI.md
├── TINH_NANG_GIU_LAI_VA_LOAI_BO.md
└── README.md
```

## 5. Database Oracle

### 5.1. Thứ tự chạy script

Chạy lần lượt trong Oracle SQL Developer hoặc SQL*Plus:

```sql
@Database/01_HQTCSDL_Schema.sql
@Database/02_HQTCSDL_Procedures_Triggers.sql
@Database/03_HQTCSDL_Demo_Data.sql
```

File `Database/04_HQTCSDL_Concurrency_Demo.sql` dùng để mô phỏng và trình bày trong báo cáo, không nhất thiết chạy toàn bộ một lần.

### 5.2. Các bảng chính

- `TAIKHOAN`
- `DOCGIA`
- `NHANVIEN`
- `DOANHMUC`
- `SACH`
- `LOSACH`
- `KHOSACH`
- `PHIEUMUON`
- `CT_PHIEUMUON`
- `PHIEUTRA`
- `VIPHAM`
- `NHACUNGCAP`
- `PHIEUNHAP`
- `CT_PHIEUNHAP`
- `PHIEUTRANCC`
- `THANHLY`

### 5.3. Function chính

- `FN_SO_SACH_DANG_MUON`
- `FN_SO_LUONG_CON_LAI`
- `FN_KIEM_TRA_THE_HOP_LE`
- `FN_TINH_TIEN_PHAT`

### 5.4. Procedure chính

- `SP_DANGKY_DOCGIA`
- `SP_TAO_PHIEU_MUON`
- `SP_THEM_CT_PHIEUMUON`
- `SP_TRA_SACH`
- `SP_NHAP_SACH`
- `SP_THANHLY_SACH`

### 5.5. Trigger chính

- Trigger sinh mã tự động cho các bảng nghiệp vụ.
- Trigger hỗ trợ cập nhật trạng thái quá hạn.

## 6. Backend API mới cho schema HQTCSDL

Các API mới được thêm dưới prefix `/db-api/hqtcsdl`.

| Method | Endpoint | Mục đích |
|---|---|---|
| GET | `/db-api/hqtcsdl/dashboard` | Lấy số liệu tổng quan |
| GET | `/db-api/hqtcsdl/books` | Danh sách sách và tồn kho |
| GET | `/db-api/hqtcsdl/readers` | Danh sách độc giả |
| POST | `/db-api/hqtcsdl/readers` | Đăng ký độc giả |
| GET | `/db-api/hqtcsdl/loans` | Danh sách phiếu mượn |
| POST | `/db-api/hqtcsdl/loans` | Tạo phiếu mượn |
| POST | `/db-api/hqtcsdl/loan-items` | Thêm sách vào phiếu mượn |
| POST | `/db-api/hqtcsdl/return` | Trả sách |
| POST | `/db-api/hqtcsdl/import-book` | Nhập thêm sách vào kho |

## 7. Cấu hình backend

Tạo file `BackEnd/.env`:

```env
DATABASE_USER=your_oracle_user
DATABASE_PASSWORD=your_oracle_password
DATABASE_CONNECTION_STRING=localhost:1521/XEPDB1
port=3000
```

Cài đặt và chạy backend:

```bash
cd BackEnd
npm install
npm start
```

## 8. Chạy frontend

```bash
cd FrontEnd
npm install
npm run dev
```

Frontend mặc định gọi backend tại:

```text
http://localhost:3000/db-api/
```

## 9. Xử lý đồng thời

Tài liệu và script liên quan:

- `Database/Concurrency_Scenarios.md`
- `Database/04_HQTCSDL_Concurrency_Demo.sql`
- `Database/05_HQTCSDL_Report_Queries.sql`

Các tình huống đã chuẩn bị:

- Lost Update.
- Uncommitted Read.
- Non-repeatable Read.
- Phantom Read.
- Deadlock.

Giải pháp chính:

- Dùng `SELECT ... FOR UPDATE` cho dòng tồn kho hoặc phiếu mượn cần khóa.
- Đưa kiểm tra điều kiện và cập nhật vào cùng procedure.
- Giữ transaction ngắn.
- Thống nhất thứ tự khóa.
- Backend hỗ trợ bắt lỗi và retry khi cần.

## 10. Ghi chú triển khai

Dự án hiện đã có đủ khung để tiếp tục hoàn thiện thành bản demo cuối cùng:

- Database đã được chuẩn hóa theo đề tài thư viện.
- Procedure/trigger/function đã được viết cho nghiệp vụ trọng tâm.
- Dữ liệu mẫu đã có.
- Backend đã có API mới cho schema chuẩn hóa.
- Frontend home page đã được viết lại để phản ánh đúng đồ án.

Khi triển khai thật, cần đảm bảo Oracle đã chạy, file `.env` đúng thông tin kết nối và các script database đã được chạy theo đúng thứ tự.

## 11. Demo and acceptance documents

- `HUONG_DAN_DEMO.md`: step-by-step demo script for the presentation.
- `CHECKLIST_HOAN_THIEN.md`: checklist of completed deliverables.
- `BackEnd/API_HQTCSDL.md`: documentation for the new backend endpoints.
- `Database/CHUONG3_MA_PL_SQL_BO_SUNG.md`: PL/SQL snippets for filling the empty `Ma PL/SQL` sections in Chapter 3 without editing the original report file.
## 12. Latest Project Updates

Recent additions are recorded here instead of editing the original report file:

- Added `SP_THANHLY_SACH` in `Database/02_HQTCSDL_Procedures_Triggers.sql` to lock inventory rows, validate available quantity, and write liquidation records to `THANHLY`.
- Added backend API `POST /db-api/hqtcsdl/liquidate-book` and the book liquidation form in `/hqtcsdl/actions`.
- Updated `Database/Concurrency_Scenarios.md` to use the current schema (`KHOSACH`, `PHIEUMUON`, `CT_PHIEUMUON`, `PHIEUTRA`, `VIPHAM`) instead of inherited tables from the old repo.
- Added `Database/CHUONG3_MA_PL_SQL_BO_SUNG.md` with PL/SQL snippets for Chapter 3, so the original report source remains untouched.
- Updated `HUONG_DAN_DEMO.md`, `CHECKLIST_HOAN_THIEN.md`, `DOI_CHIEU_YEU_CAU.md`, and `BackEnd/API_HQTCSDL.md` so they match the liquidation workflow and concurrency documentation.

## 13. Frontend screens for the project

New screens were added to demo the HQTCSDL schema and API directly:

- `/hqtcsdl`: dashboard using `/db-api/hqtcsdl/dashboard`, `/books`, `/readers`, and `/loans`.
- `/hqtcsdl/actions`: demo forms for reader registration, loan creation, loan item insertion, book return, book import, and book liquidation.
- `/stat`: redirected to the HQTCSDL dashboard for reporting/demo purposes.

These screens demonstrate the core library workflows without depending on the older inherited pages.

