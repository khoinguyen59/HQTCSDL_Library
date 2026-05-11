# Kịch bản demo hoàn chỉnh cho buổi bảo vệ đồ án HQTCSDL

## 1. Chuẩn bị trước khi demo

1. Mở Oracle và chạy các script theo thứ tự:
   - `Database/01_HQTCSDL_Schema.sql`
   - `Database/02_HQTCSDL_Procedures_Triggers.sql`
   - `Database/03_HQTCSDL_Demo_Data.sql`
2. Cấu hình `BackEnd/.env` từ `BackEnd/.env.example`.
3. Chạy backend:
   - `cd BackEnd`
   - `npm install`
   - `npm start`
4. Chạy frontend:
   - `cd FrontEnd`
   - `npm install`
   - `npm run dev`

## 2. Luồng demo giao diện

### Bước 1: Giới thiệu trang chủ

- Truy cập `/`
- Trình bày đây là bản triển khai lại theo đúng yêu cầu đồ án HQTCSDL.
- Nhấn mạnh các trục chính: Oracle, giao tác, trigger, stored procedure, xử lý đồng thời.

### Bước 2: Dashboard HQTCSDL

- Truy cập `/hqtcsdl`
- Giới thiệu các số liệu:
  - số đầu sách;
  - số độc giả;
  - số phiếu đang mượn;
  - số phiếu quá hạn;
  - tổng phạt chưa thu.
- Trình bày các bảng:
  - sách và tồn kho;
  - độc giả;
  - phiếu mượn.

### Bước 3: Demo thao tác nghiệp vụ

- Truy cập `/hqtcsdl/actions`
- Thực hiện lần lượt:
  1. Đăng ký độc giả mới.
  2. Tạo phiếu mượn.
  3. Thêm sách vào phiếu mượn.
  4. Trả sách.
  5. Nhập sách.
- Quay lại `/hqtcsdl` và nhấn "Tải lại dữ liệu" để thấy kết quả thay đổi.

## 3. Luồng demo database

### Phần stored procedure và trigger

Trình bày các file:

- `Database/01_HQTCSDL_Schema.sql`
- `Database/02_HQTCSDL_Procedures_Triggers.sql`

Nhấn mạnh các procedure chính:

- `SP_DANGKY_DOCGIA`
- `SP_TAO_PHIEU_MUON`
- `SP_THEM_CT_PHIEUMUON`
- `SP_TRA_SACH`
- `SP_NHAP_SACH`
- `SP_THANHLY_SACH`

Nhấn mạnh các function chính:

- `FN_SO_SACH_DANG_MUON`
- `FN_SO_LUONG_CON_LAI`
- `FN_KIEM_TRA_THE_HOP_LE`
- `FN_TINH_TIEN_PHAT`

### Phần report

Mở file:

- `Database/05_HQTCSDL_Report_Queries.sql`

Trình bày:

- report đơn giản: danh sách sách và tồn kho;
- report grouping/totals: số lượt mượn theo danh mục;
- report quá hạn;
- report tiền phạt;
- top sách mượn nhiều.

## 4. Luồng demo xử lý đồng thời

Mở hai session Oracle song song.

### Lost Update

- Session 1 khóa dòng tồn kho bằng `FOR UPDATE`.
- Session 2 cố truy cập cùng dòng.
- Giải thích tại sao transaction thứ hai phải chờ.

### Uncommitted Read

- Session 1 cập nhật nhưng chưa commit.
- Session 2 đọc dữ liệu và chứng minh Oracle không cho dirty read.

### Non-repeatable Read / Phantom Read / Deadlock

- Dùng `Database/04_HQTCSDL_Concurrency_Demo.sql`
- Kết hợp thuyết minh trong `Database/Concurrency_Scenarios.md`

## 5. Kết luận khi trình bày

Chốt lại rằng hệ thống đã đáp ứng các yêu cầu của đề bài:

- có ứng dụng thực tế;
- có Oracle database chuẩn hóa;
- có procedure, function, trigger;
- có báo cáo;
- có mô phỏng xử lý đồng thời;
- có frontend/backend để demo trực tiếp.


## 6. L?u ? ki?m ch?ng hi?n t?i

- Frontend ?? c?i dependency b?ng `npm ci` v? build th?nh c?ng v?i `npm run build`.
- Backend ?? c?i dependency b?ng `npm ci` v? c?c file ch?nh ?? qua ki?m tra c? ph?p b?ng `node --check`.
- M?y hi?n c? SQL*Plus, nh?ng Oracle listener t?i `localhost:1521/XEPDB1` ch?a ch?y n?n ch?a th? ch?y end-to-end database/API tr?n m?i tr??ng n?y.
- Tr??c bu?i demo, c?n b?t Oracle service/listener r?i ch?y l?i c?c script database theo th? t? ? m?c 1.
