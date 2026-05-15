# KỊCH BẢN KIỂM THỬ ĐỒ ÁN HQTCSDL

> **Công cụ cần mở song song:**
> - **Oracle SQL Developer** (xem dữ liệu DB trước/sau)
> - **Trình duyệt Web** (thao tác trên giao diện ứng dụng)
> - **2 cửa sổ Terminal** (chạy Backend + Frontend)

> **Quy tắc:** Mỗi test case đều có 3 bước:
> **(1)** Chạy query trên SQL Developer → xem DB **TRƯỚC**
> **(2)** Thao tác trên giao diện Web
> **(3)** Chạy lại query trên SQL Developer → xem DB **SAU** → so sánh thay đổi

---

## PHẦN A — KHỞI ĐỘNG

### A1. Mở Oracle SQL Developer
1. Mở **Oracle SQL Developer**.
2. Tạo kết nối (hoặc chọn kết nối có sẵn):
   - **Connection Name:** `LIBRARY_ADMIN`
   - **Username:** `LIBRARY_ADMIN`
   - **Password:** `admin`
   - **Hostname:** `localhost`
   - **Port:** `1521`
   - **Service name:** `XEPDB1`
3. Bấm **Connect**. ✅ Kết nối thành công, thấy cây schema bên trái.
4. Mở một **SQL Worksheet** mới (Ctrl+Shift+N hoặc menu Tools → SQL Worksheet).

### A2. Khởi động Backend
Mở **Terminal 1**, gõ:
```
cd "C:\Users\Nguyen Trong Khoi\Downloads\HQTSCDL_DA\library_oracle_hqtcsdl\BackEnd"
npm start
```
✅ Thấy: `Web server listening on localhost:3000` + `Startup complete`

### A3. Khởi động Frontend
Mở **Terminal 2**, gõ:
```
cd "C:\Users\Nguyen Trong Khoi\Downloads\HQTSCDL_DA\library_oracle_hqtcsdl\FrontEnd"
npm run dev
```
✅ Thấy: `VITE v4.x.x ready`

### A4. Đăng nhập Web
Mở trình duyệt → `http://localhost:5173/login`
- Ô **Tên đăng nhập**: `admin`
- Ô **Mật khẩu**: `123456`
- Bấm **Đăng nhập** → Vào trang Tổng quan.

---

## PHẦN B — TEST CHỨC NĂNG

Trên trình duyệt: Bấm menu **"Giao dịch thư viện"** trên Sidebar.

---

### B1. Cấp thẻ độc giả

**(1) SQL Developer — DB TRƯỚC:**
Paste query sau vào SQL Worksheet, bấm **Run** (nút ▶ hoặc Ctrl+Enter):
```sql
SELECT MaDocGia, HoTen, Email, TrangThai FROM DOCGIA ORDER BY MaDocGia;
```
✅ Xem kết quả ở bảng phía dưới. Ghi nhận: hiện có 2 dòng (DG000001, DG000002).

**(2) Giao diện Web — Bấm tab "Cấp thẻ độc giả", điền:**

| Ô | Giá trị điền |
|---|---|
| **Tên đăng nhập** * | `docgia_test01` |
| **Mật khẩu** * | `123456` |
| **Họ tên** * | `Nguyễn Văn Kiểm Thử` |
| **Email** | `test01@student.edu.vn` |
| **Số điện thoại** | `0901999888` |
| **Địa chỉ** | `Quận Thủ Đức, TP.HCM` |
| **Ngày hết hạn** | Chọn ngày `15/05/2027` |

Bấm **"Xác nhận"**. ✅ Thanh xanh: `"Đăng ký độc giả thành công."`

**(3) SQL Developer — DB SAU:**
Bấm **Run** lại cùng query ở bước (1).
✅ Xuất hiện thêm dòng mới: `DG000003 | Nguyễn Văn Kiểm Thử | test01@student.edu.vn | HOAT_DONG`

---

### B2. Lập phiếu mượn

**(1) SQL Developer — DB TRƯỚC:**
```sql
SELECT MaPhieuMuon, MaDocGia, MaNhanVien, TrangThai, NgayMuon, NgayHenTra FROM PHIEUMUON ORDER BY MaPhieuMuon;
```
✅ Ghi nhận: có 1 dòng PM000001.

**(2) Giao diện Web — Bấm tab "Lập phiếu mượn", điền:**

| Ô | Giá trị điền |
|---|---|
| **Mã độc giả** * | `DG000002` |
| **Mã nhân viên** * | `NV000001` |
| **Ngày hẹn trả** * | Chọn ngày `29/05/2026` |

Bấm **"Xác nhận"**. ✅ Thanh xanh: `"Tạo phiếu mượn thành công. (Mã phiếu: PM000002)"` — **Ghi nhớ mã phiếu.**

**(3) SQL Developer — DB SAU:**
Bấm **Run** lại query bước (1).
✅ Thêm dòng: `PM000002 | DG000002 | NV000001 | DANG_MUON | 15/05/2026 | 29/05/2026`

---

### B3. Thêm sách vào phiếu (test trigger trừ kho)

**(1) SQL Developer — DB TRƯỚC:**
```sql
SELECT S.MaSach, S.TenSach, KS.SoLuongTong, KS.SoLuongCon
FROM KHOSACH KS JOIN SACH S ON S.MaSach = KS.MaSach
ORDER BY S.MaSach;
```
✅ Ghi nhận S000002: `SoLuongTong = 10, SoLuongCon = 10`.

**(2) Giao diện Web — Bấm tab "Thêm sách vào phiếu", điền:**

| Ô | Giá trị điền |
|---|---|
| **Mã phiếu mượn** * | `PM000002` |
| **Mã sách** * | `S000002` |
| **Số lượng** * | `2` |

Bấm **"Xác nhận"**. ✅ Thanh xanh: `"Thêm sách vào phiếu mượn thành công."`

**(3) SQL Developer — DB SAU:**
Bấm **Run** lại query bước (1).
✅ S000002: `SoLuongCon` giảm từ `10` → `8`. **→ Chứng minh procedure tự động trừ kho.**

Kiểm tra thêm chi tiết phiếu mượn:
```sql
SELECT * FROM CT_PHIEUMUON WHERE MaPhieuMuon = 'PM000002';
```
✅ Thấy dòng: `PM000002 | S000002 | 2 | DANG_MUON`

---

### B4. Nhận trả sách (test trigger hoàn kho + tính phạt)

**(1) SQL Developer — DB TRƯỚC:**
```sql
-- Trạng thái phiếu mượn
SELECT MaPhieuMuon, TrangThai FROM PHIEUMUON WHERE MaPhieuMuon = 'PM000001';
-- Tồn kho sách S000001
SELECT MaSach, SoLuongCon FROM KHOSACH WHERE MaSach = 'S000001';
-- Vi phạm hiện có
SELECT * FROM VIPHAM WHERE MaPhieuMuon = 'PM000001';
```
✅ PM000001: `DANG_MUON`. S000001: ghi nhận SoLuongCon. VIPHAM: không có dòng nào.

**(2) Giao diện Web — Bấm tab "Nhận trả sách", điền:**

| Ô | Giá trị điền |
|---|---|
| **Mã phiếu mượn** * | `PM000001` |
| **Mã nhân viên** * | `NV000001` |

Bấm **"Xác nhận"**. ✅ Thanh xanh: `"Trả sách thành công."`

**(3) SQL Developer — DB SAU:** Chạy lại 3 query ở bước (1).
✅ Thay đổi:
- PM000001: `DA_TRA` (trước là `DANG_MUON`)
- S000001: `SoLuongCon` tăng lên (kho được hoàn)
- Nếu trả trễ hạn → bảng VIPHAM có dòng mới: LoaiViPham = `QUA_HAN`, TienPhat = số ngày trễ × 1000đ

Kiểm tra phiếu trả:
```sql
SELECT * FROM PHIEUTRA WHERE MaPhieuMuon = 'PM000001';
```
✅ Có 1 dòng phiếu trả mới.

---

### B5. Nhập sách (test trigger cộng kho)

**(1) SQL Developer — DB TRƯỚC:**
```sql
SELECT MaSach, SoLuongTong, SoLuongCon FROM KHOSACH WHERE MaSach = 'S000003';
```
✅ VD: `Tong = 10, Con = 10`

**(2) Giao diện Web — Bấm tab "Nhập sách", điền:**

| Ô | Giá trị điền |
|---|---|
| **Mã nhà cung cấp** * | `NCC000001` |
| **Mã nhân viên** * | `NV000001` |
| **Mã sách** * | `S000003` |
| **Số lượng** * | `5` |
| **Đơn giá** * | `95000` |

Bấm **"Xác nhận"**. ✅ Thanh xanh: `"Nhập sách thành công."`

**(3) SQL Developer — DB SAU:**
```sql
SELECT MaSach, SoLuongTong, SoLuongCon FROM KHOSACH WHERE MaSach = 'S000003';
SELECT MaPhieuNhap, TongTien FROM PHIEUNHAP ORDER BY MaPhieuNhap DESC FETCH FIRST 1 ROW ONLY;
```
✅ Kho: `Tong = 15, Con = 15`. Phiếu nhập mới: TongTien = `475000` (5 × 95000).

---

### B6. Thanh lý sách

**(1) SQL Developer — DB TRƯỚC:**
```sql
SELECT MaSach, SoLuongTong, SoLuongCon FROM KHOSACH WHERE MaSach = 'S000003';
```
✅ VD: `Tong = 15, Con = 15`

**(2) Giao diện Web — Bấm tab "Thanh lý sách", điền:**

| Ô | Giá trị điền |
|---|---|
| **Mã sách** * | `S000003` |
| **Mã nhân viên** * | `NV000001` |
| **Số lượng** * | `3` |
| **Lý do thanh lý** | `Sách hư hỏng nặng` |

Bấm **"Xác nhận"**. ✅ Thanh xanh: `"Thanh lý sách thành công."`

**(3) SQL Developer — DB SAU:**
```sql
SELECT MaSach, SoLuongTong, SoLuongCon FROM KHOSACH WHERE MaSach = 'S000003';
SELECT * FROM THANHLY ORDER BY MaThanhLy DESC FETCH FIRST 1 ROW ONLY;
```
✅ Kho: `Tong = 12, Con = 12`. Có bản ghi thanh lý: SoLuong = 3, LyDo = `Sách hư hỏng nặng`.

---

## PHẦN C — DEMO XỬ LÝ ĐỒNG THỜI

> Mở **2 SQL Worksheet** trong SQL Developer (Ctrl+Shift+N), đặt tên:
> - Worksheet 1 = **T1** (Thủ thư A)
> - Worksheet 2 = **T2** (Thủ thư B)
>
> Mỗi Worksheet là 1 session riêng biệt trong Oracle.

---

### C1. Lost Update

**T1 — Paste vào Worksheet 1, bấm Run:**
```sql
SELECT SoLuongCon FROM KHOSACH WHERE MaSach = 'S000001' FOR UPDATE;
```
✅ Hiện kết quả bình thường. T1 đang giữ khóa dòng S000001.

**T2 — Paste vào Worksheet 2, bấm Run:**
```sql
SELECT SoLuongCon FROM KHOSACH WHERE MaSach = 'S000001' FOR UPDATE;
```
✅ SQL Developer hiện **vòng xoay loading** — T2 bị chờ (WAIT), không có kết quả.
→ *"T2 đang chờ T1 nhả khóa, nên không thể xảy ra Lost Update."*

**T1 — Commit để nhả khóa:**
```sql
UPDATE KHOSACH SET SoLuongCon = SoLuongCon - 1 WHERE MaSach = 'S000001';
COMMIT;
```
✅ T2 lập tức hết loading, hiện kết quả mới.

**T2 — Dọn dẹp:** `ROLLBACK;`

---

### C2. Dirty Read (Oracle chặn)

**T1:** Chạy nhưng **KHÔNG commit**:
```sql
UPDATE KHOSACH SET SoLuongCon = SoLuongCon - 5 WHERE MaSach = 'S000002';
SELECT SoLuongCon FROM KHOSACH WHERE MaSach = 'S000002';
```
✅ T1 thấy giá trị đã bị trừ 5.

**T2:** Đọc cùng dòng:
```sql
SELECT SoLuongCon FROM KHOSACH WHERE MaSach = 'S000002';
```
✅ T2 thấy **giá trị CŨ** (chưa trừ). → *"Oracle dùng READ COMMITTED, T2 không đọc được dữ liệu chưa commit."*

**T1:** `ROLLBACK;`

---

### C3. Phantom Read

**T1:** Đếm lần 1:
```sql
SELECT COUNT(*) AS SO_QUA_HAN FROM PHIEUMUON WHERE TrangThai = 'QUA_HAN';
```
✅ Ghi nhận kết quả (VD: 0).

**T2:** Cập nhật + commit:
```sql
UPDATE PHIEUMUON SET TrangThai = 'QUA_HAN' WHERE MaPhieuMuon = 'PM000002';
COMMIT;
```

**T1:** Đếm lần 2 (chạy lại cùng query):
✅ Kết quả **KHÁC** lần 1 (VD: 1). → *"Phantom Read xảy ra ở mức READ COMMITTED."*

**Khắc phục:** Reset T2: `UPDATE PHIEUMUON SET TrangThai='DANG_MUON' WHERE MaPhieuMuon='PM000002'; COMMIT;`

T1 chạy với SERIALIZABLE:
```sql
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
SELECT COUNT(*) AS SO_QUA_HAN FROM PHIEUMUON WHERE TrangThai = 'QUA_HAN';
```
T2 lại update+commit. T1 chạy lại SELECT → ✅ Kết quả **GIỐNG** lần 1.
T1: `COMMIT;`

---

### C4. Deadlock

**T1:** `UPDATE KHOSACH SET SoLuongCon = SoLuongCon WHERE MaSach = 'S000001';`
**T2:** `UPDATE KHOSACH SET SoLuongCon = SoLuongCon WHERE MaSach = 'S000002';`
**T1:** `UPDATE KHOSACH SET SoLuongCon = SoLuongCon WHERE MaSach = 'S000002';` → ✅ T1 loading (chờ).
**T2:** `UPDATE KHOSACH SET SoLuongCon = SoLuongCon WHERE MaSach = 'S000001';`
→ ✅ ~3 giây sau, 1 Worksheet báo lỗi: `ORA-00060: deadlock detected while waiting for resource`
→ *"Oracle tự phát hiện deadlock và rollback 1 bên để giải phóng."*

Cả hai: `ROLLBACK;`
