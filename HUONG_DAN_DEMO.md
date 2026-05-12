# Kịch bản trình bày và vận hành hệ thống HQTCSDL

## 1. Chuẩn bị môi trường

1. Bật Oracle XE và listener.
2. Chạy các script theo thứ tự:
   - `Database/01_HQTCSDL_Schema.sql`
   - `Database/02_HQTCSDL_Procedures_Triggers.sql`
   - `Database/03_HQTCSDL_Demo_Data.sql`
   - `Database/06_HQTCSDL_Quick_Verify.sql`
3. Cấu hình `BackEnd/.env` theo `BackEnd/.env.example`.
4. Chạy backend:
   - `cd BackEnd`
   - `npm install`
   - `npm start`
5. Chạy frontend:
   - `cd FrontEnd`
   - `npm install`
   - `npm run dev`

## 2. Luồng giao diện người dùng

### Bước 1: Trang chủ / OPAC

- Truy cập `http://127.0.0.1:5173/index.html`.
- Trình bày hệ thống hỗ trợ quản lý sách, tồn kho, độc giả, phiếu mượn, phiếu trả và báo cáo vận hành.

### Bước 2: Tổng quan hệ thống

- Truy cập `/hqtcsdl`.
- Giới thiệu các số liệu:
  - số đầu sách;
  - số độc giả;
  - số phiếu đang mượn;
  - số phiếu quá hạn;
  - tổng tiền phạt chưa thu.
- Trình bày các bảng:
  - sách và tồn kho;
  - độc giả;
  - phiếu mượn.

### Bước 3: Phân hệ nghiệp vụ thủ thư

- Truy cập `/hqtcsdl/actions` hoặc mở desktop staff console bằng `npm run desktop:open`.
- Thực hiện lần lượt:
  1. Cấp thẻ độc giả.
  2. Lập phiếu mượn.
  3. Thêm sách vào phiếu.
  4. Nhận trả sách.
  5. Nhập sách.
  6. Thanh lý sách.
- Quay lại `/hqtcsdl` và nhấn tải lại dữ liệu để xem thay đổi.

## 3. Luồng database

### Stored procedure và trigger

Trình bày các file:

- `Database/01_HQTCSDL_Schema.sql`
- `Database/02_HQTCSDL_Procedures_Triggers.sql`

Procedure chính:

- `SP_DANGKY_DOCGIA`
- `SP_TAO_PHIEU_MUON`
- `SP_THEM_CT_PHIEUMUON`
- `SP_TRA_SACH`
- `SP_NHAP_SACH`
- `SP_THANHLY_SACH`

Function chính:

- `FN_SO_SACH_DANG_MUON`
- `FN_SO_LUONG_CON_LAI`
- `FN_KIEM_TRA_THE_HOP_LE`
- `FN_TINH_TIEN_PHAT`

### Report

Mở file `Database/05_HQTCSDL_Report_Queries.sql` và trình bày:

- danh sách sách và tồn kho;
- số lượt mượn theo danh mục;
- sách đang mượn hoặc quá hạn;
- tiền phạt theo độc giả;
- top sách được mượn nhiều.

## 4. Xử lý đồng thời

Mở hai session Oracle song song.

- Lost Update: khóa dòng tồn kho bằng `SELECT ... FOR UPDATE`.
- Uncommitted Read: Oracle không đọc dữ liệu chưa commit.
- Non-repeatable Read / Phantom Read / Deadlock: dùng `Database/04_HQTCSDL_Concurrency_Demo.sql` và `Database/Concurrency_Scenarios.md`.

## 5. Kiểm chứng hiện tại

- Frontend đã cài dependency và build thành công bằng `npm run check`.
- Backend đã qua kiểm tra cú pháp bằng `npm run check`.
- Oracle đã chạy với user `LIBRARY_ADMIN/admin@localhost:1521/XEPDB1`.
- API dashboard đã trả dữ liệu thật từ Oracle.
- Desktop staff console mở bằng Edge app mode tại `/hqtcsdl/actions`.
