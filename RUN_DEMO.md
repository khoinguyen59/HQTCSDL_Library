# Run demo HQTCSDL Library

## 1. Oracle

Oracle XE da duoc cau hinh tren may nay voi thong tin:

- User: `LIBRARY_ADMIN`
- Password: `admin`
- Connect string: `localhost:1521/XEPDB1`

Neu Oracle bi tat, bat lai service:

```powershell
Start-Service OracleServiceXE
Start-Service OracleOraDB21Home1TNSListener
```

Reset database ve du lieu demo:

```powershell
cd C:\Users\Nguyen Trong Khoi\Downloads\HQTSCDL_DA\library_oracle_hqtcsdl
sqlplus LIBRARY_ADMIN/admin@localhost:1521/XEPDB1
```

Trong SQL*Plus chay:

```sql
@Database/01_HQTCSDL_Schema.sql
@Database/02_HQTCSDL_Procedures_Triggers.sql
@Database/03_HQTCSDL_Demo_Data.sql
@Database/06_HQTCSDL_Quick_Verify.sql
```

## 2. Backend

```powershell
cd C:\Users\Nguyen Trong Khoi\Downloads\HQTSCDL_DA\library_oracle_hqtcsdl\BackEnd
npm start
```

Backend URL:

```text
http://localhost:3000/db-api/hqtcsdl/dashboard
```

## 3. Web OPAC / Reader UI

```powershell
cd C:\Users\Nguyen Trong Khoi\Downloads\HQTSCDL_DA\library_oracle_hqtcsdl\FrontEnd
npm run dev
```

Open:

```text
http://127.0.0.1:5173/index.html
http://127.0.0.1:5173/hqtcsdl
```

## 4. Desktop staff console

Bao cao goc mo ta phan he thu thu/quan ly la Desktop Application. Ban demo nay dung Edge app mode de dong goi React staff console thanh cua so desktop rieng, khong co address bar nhu web browser thong thuong.

Khi Vite dang chay, mo desktop staff console:

```powershell
cd C:\Users\Nguyen Trong Khoi\Downloads\HQTSCDL_DA\library_oracle_hqtcsdl\FrontEnd
npm run desktop:open
```

Hoac chay ca Vite va desktop:

```powershell
npm run desktop
```

Man hinh desktop mac dinh:

```text
http://127.0.0.1:5173/hqtcsdl/actions
```

## 5. Checklist Chạy Demo Bảo Vệ

Để đảm bảo buổi demo diễn ra trơn tru, hãy thực hiện theo trình tự sau:

1. **Khởi động & Kiểm tra:**
   - [ ] Mở SQL Developer hoặc SQL*Plus, kết nối tài khoản `LIBRARY_ADMIN/admin`.
   - [ ] Chạy lệnh `@Database/03_HQTCSDL_Demo_Data.sql` để reset lại toàn bộ dữ liệu sạch.
   - [ ] Bật Backend (`npm start` trong thư mục `BackEnd`).
   - [ ] Bật Frontend (`npm run dev` trong thư mục `FrontEnd`).

2. **Demo UI & Chức năng cơ bản:**
   - [ ] Mở Web dành cho độc giả tại `http://127.0.0.1:5173/index.html`.
   - [ ] Mở **Desktop Console** dành cho thủ thư bằng lệnh `npm run desktop:open`.
   - [ ] Vào mục **Giao dịch thư viện** (`/hqtcsdl/actions`).
   - [ ] Demo thao tác: Đăng ký độc giả mới -> Nhập sách mới -> Lập phiếu mượn -> Thêm sách vào phiếu -> Nhận trả sách.
   - [ ] Vào mục **Tổng quan** (`/hqtcsdl`) để cho thấy số liệu cập nhật real-time từ DB.

3. **Demo Xử lý Đồng thời (Concurrency):**
   - [ ] Mở 2 phiên bản SQL Developer (T1 và T2) chia nửa màn hình.
   - [ ] Mở file `Database/04_HQTCSDL_Concurrency_Demo.sql` và `Database/Concurrency_Scenarios.md`.
   - [ ] Copy & chạy từng lệnh theo thứ tự của 5 kịch bản đồng thời.
   - [ ] Giải thích cách Oracle giải quyết (VD: lock dòng bằng `FOR UPDATE`, Deadlock detection).
