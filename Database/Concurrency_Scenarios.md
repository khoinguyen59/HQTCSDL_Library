# Kich ban xu ly dong thoi cho do an HQTCSDL

File nay dung cho phan xu ly dong thoi trong bao cao va demo Oracle. Cac kich ban bam theo mo hinh chuan cua do an thu vien:

- `KHOSACH`: ton kho theo dau sach, gom `SoLuongTong`, `SoLuongCon`, `SoLuongHong`.
- `PHIEUMUON`: phieu muon, trang thai `DANG_MUON`, `QUA_HAN`, `DA_TRA`, `HUY`.
- `CT_PHIEUMUON`: chi tiet sach trong phieu muon.
- `PHIEUTRA`: phieu tra.
- `VIPHAM`: vi pham/phat qua han, hu hong, mat sach.

Cac procedure chinh nam trong `Database/02_HQTCSDL_Procedures_Triggers.sql`:

- `SP_TAO_PHIEU_MUON`
- `SP_THEM_CT_PHIEUMUON`
- `SP_TRA_SACH`
- `SP_NHAP_SACH`
- `SP_THANHLY_SACH`

---

## 1. Lost Update khi hai thu thu cung cho muon mot sach con it ton

### Tinh huong loi

Gia su `MaSach = 'S000001'` chi con `SoLuongCon = 1` trong `KHOSACH`.

- T1 doc so luong con lai cua `S000001` la 1.
- T2 cung doc so luong con lai cua `S000001` la 1.
- T1 them sach vao phieu muon va tru ton kho xuong 0.
- T2 van dua tren du lieu cu va cung them sach vao phieu muon.
- Ket qua sai: he thong ghi nhan cho muon 2 cuon trong khi kho chi con 1 cuon.

### Cach phong tranh trong he thong

Trong `SP_THEM_CT_PHIEUMUON`, dong ton kho duoc khoa truoc khi kiem tra va tru so luong:

```sql
SELECT SoLuongCon
INTO V_SO_LUONG_CON
FROM KHOSACH
WHERE MaSach = P_MA_SACH
FOR UPDATE;
```

Sau khi T1 khoa dong `KHOSACH` cua sach do, T2 phai cho T1 `COMMIT` hoac `ROLLBACK`. Khi T2 duoc chay tiep, T2 doc lai so luong moi. Neu so luong khong du, procedure bao loi:

```sql
RAISE_APPLICATION_ERROR(-20103, 'Khong du so luong sach con trong kho.');
```

### Demo T1/T2

Session T1:

```sql
SELECT SoLuongCon FROM KHOSACH WHERE MaSach = 'S000001' FOR UPDATE;
-- Giu transaction, chua COMMIT.
```

Session T2:

```sql
SELECT SoLuongCon FROM KHOSACH WHERE MaSach = 'S000001' FOR UPDATE;
-- Bi cho den khi T1 ket thuc transaction.
```

---

## 2. Uncommitted Read khi doc du lieu tra sach chua commit

### Tinh huong loi

- T1 dang xu ly tra sach: them `PHIEUTRA`, cap nhat `CT_PHIEUMUON`, cong lai `KHOSACH.SoLuongCon`, co the them `VIPHAM`.
- T1 chua commit.
- T2 tra cuu ton kho hoac danh sach sach san sang cho muon.
- Neu DBMS cho doc du lieu chua commit, T2 co the thay sach da tra va cho nguoi khac muon, trong khi T1 sau do rollback.

### Cach phong tranh trong Oracle

Oracle mac dinh dung `READ COMMITTED` va MVCC, nen mot transaction khong doc du lieu chua commit cua transaction khac. T2 chi thay du lieu da commit truoc thoi diem cau lenh SELECT bat dau.

Backend khong nen tu tach roi cac thao tac ghi quan trong. Backend goi procedure (`SP_TRA_SACH`, `SP_THEM_CT_PHIEUMUON`) de DBMS kiem soat dieu kien, khoa dong va rollback khi loi.

### Demo T1/T2

Session T1:

```sql
UPDATE KHOSACH
SET SoLuongCon = SoLuongCon + 1
WHERE MaSach = 'S000001';
-- Chua COMMIT.
```

Session T2:

```sql
SELECT SoLuongCon FROM KHOSACH WHERE MaSach = 'S000001';
-- Khong thay gia tri chua commit cua T1.
```

---

## 3. Non-repeatable Read khi kiem tra gioi han muon cua doc gia

### Tinh huong loi

Gia su quy dinh doc gia duoc muon toi da 5 cuon.

- T1 kiem tra doc gia `DG000001` dang muon 4 cuon.
- T2 tao them phieu muon/chi tiet phieu muon cho cung doc gia va commit.
- T1 kiem tra lai thay doc gia dang muon 5 cuon.
- Neu T1 van tiep tuc them sach dua tren ket qua doc ban dau, doc gia co the vuot quota.

### Cach phong tranh trong he thong

He thong dua kiem tra dieu kien muon vao stored procedure va tinh so sach dang muon bang function:

```sql
FN_SO_SACH_DANG_MUON(P_MA_DOCGIA)
```

Khi can muc nhat quan cao hon trong demo hoac khi mo rong nghiep vu, co the:

- Chay transaction o muc `SERIALIZABLE` truoc khi tao phieu muon.
- Khoa cac dong `PHIEUMUON` dang mo cua doc gia bang `SELECT ... FOR UPDATE`.
- Tao bang/quy tac han muc rieng va khoa dong han muc cua doc gia truoc khi them sach.

---

## 4. Phantom Read khi thong ke danh sach phieu qua han

### Tinh huong loi

- T1 chay bao cao dem so phieu muon qua han.
- T2 cap nhat them mot phieu sang `QUA_HAN` hoac tao du lieu thoa dieu kien bao cao va commit.
- T1 chay lai cung cau truy van trong cung phien va thay them dong moi.
- Bao cao co the khong nhat quan neu nhieu cau truy van trong cung bao cao khong dung chung moc thoi gian.

### Cach phong tranh trong he thong

Voi bao cao, nen chot mot thoi diem bao cao va dung cung moc do cho toan bo truy van:

```sql
WHERE PM.TrangThai = 'QUA_HAN'
   OR (PM.TrangThai = 'DANG_MUON' AND PM.NgayHenTra < :REPORT_TIME)
```

Neu yeu cau bao cao tuyet doi nhat quan, co the chay trong transaction `SERIALIZABLE` hoac dung co che snapshot phu hop cua Oracle.

---

## 5. Deadlock giua nghiep vu muon/tra va cap nhat ton kho

### Tinh huong loi

Deadlock xay ra khi hai transaction khoa tai nguyen theo thu tu nguoc nhau.

- T1 khoa dong `KHOSACH` cua `S000001`, sau do can cap nhat `PHIEUMUON`.
- T2 khoa dong `PHIEUMUON`, sau do can cap nhat `KHOSACH` cua `S000001`.
- T1 cho T2, T2 cho T1, DBMS phat hien deadlock.

### Cach phong tranh trong he thong

Cac procedure phai thong nhat thu tu khoa:

- Nghiep vu them sach vao phieu muon: khoa `KHOSACH` truoc, sau do them `CT_PHIEUMUON`.
- Nghiep vu tra sach: xu ly `PHIEUTRA`/`CT_PHIEUMUON`, sau do cap nhat `KHOSACH` theo danh sach sach trong phieu.
- Nghiep vu nhap/thanh ly sach: khoa `KHOSACH` truoc khi cong/tru ton kho.

Backend can bat loi Oracle deadlock (`ORA-00060`) va co the cho nguoi dung thu lai thao tac. Transaction phai ngan, khong giu khoa trong luc cho nhap lieu tu giao dien.

---

## 6. Ghi chu khi demo

Moi kich ban nen demo bang 2 session Oracle SQL Developer hoac SQL*Plus:

- Session 1: T1.
- Session 2: T2.

Khi demo qua backend, can luu y `queryExecute` dang bat `autoCommit` mac dinh. Vi vay phan T1/T2 nen demo truc tiep bang SQL Developer de giu transaction mo. Backend phu hop de demo luong nghiep vu hoan chinh: tao phieu muon, them sach, tra sach, nhap sach, thanh ly sach.
