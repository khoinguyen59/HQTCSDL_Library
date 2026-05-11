# Ma PL/SQL bo sung cho Chuong 3

File nay tong hop cac doan ma co the chen vao cac muc `Ma PL/SQL:` trong bao cao. Ma bam theo script trien khai chinh `Database/02_HQTCSDL_Procedures_Triggers.sql`.

## 3.1.2.1. Trigger tu dong sinh ngay hen tra

```sql
CREATE OR REPLACE TRIGGER TRG_AUTO_NGAYHENTRA
BEFORE INSERT ON PHIEUMUON
FOR EACH ROW
BEGIN
    IF :NEW.NgayHenTra IS NULL THEN
        :NEW.NgayHenTra := TRUNC(:NEW.NgayMuon) + 14;
    END IF;
END;
/
```

## 3.1.2.2. Trigger tru ton kho khi muon sach

Trong ban trien khai, thao tac tru ton kho duoc dat trong `SP_THEM_CT_PHIEUMUON` de khoa dong bang `SELECT ... FOR UPDATE`. Neu bao cao can trinh bay dang trigger, co the dung doan sau:

```sql
CREATE OR REPLACE TRIGGER TRG_TRU_TONKHO_MUON
AFTER INSERT ON CT_PHIEUMUON
FOR EACH ROW
DECLARE
    V_SO_LUONG_CON NUMBER;
BEGIN
    SELECT SoLuongCon
    INTO V_SO_LUONG_CON
    FROM KHOSACH
    WHERE MaSach = :NEW.MaSach
    FOR UPDATE;

    IF V_SO_LUONG_CON < :NEW.SoLuong THEN
        RAISE_APPLICATION_ERROR(-20103, 'Khong du so luong sach trong kho.');
    END IF;

    UPDATE KHOSACH
    SET SoLuongCon = SoLuongCon - :NEW.SoLuong
    WHERE MaSach = :NEW.MaSach;
END;
/
```

## 3.1.2.3. Trigger tinh tien phat qua han

Trong schema hien tai, tien phat duoc ghi vao `VIPHAM` trong `SP_TRA_SACH`. Neu muon trinh bay dung dang trigger, co the dung:

```sql
CREATE OR REPLACE TRIGGER TRG_TINH_TIENPHAT
AFTER INSERT ON PHIEUTRA
FOR EACH ROW
DECLARE
    V_NGAY_HEN_TRA DATE;
    V_TIEN_PHAT NUMBER;
BEGIN
    SELECT NgayHenTra
    INTO V_NGAY_HEN_TRA
    FROM PHIEUMUON
    WHERE MaPhieuMuon = :NEW.MaPhieuMuon;

    V_TIEN_PHAT := GREATEST(TRUNC(:NEW.NgayTra) - TRUNC(V_NGAY_HEN_TRA), 0) * 1000;

    IF V_TIEN_PHAT > 0 THEN
        INSERT INTO VIPHAM(MaPhieuMuon, LoaiViPham, TienPhat)
        VALUES (:NEW.MaPhieuMuon, 'QUA_HAN', V_TIEN_PHAT);
    END IF;
END;
/
```

## 3.1.2.4. Trigger cap nhat kho khi nhap sach

Trong ban trien khai, cap nhat kho duoc dat trong `SP_NHAP_SACH`. Neu bao cao can trigger, co the trinh bay:

```sql
CREATE OR REPLACE TRIGGER TRG_CAPNHAT_KHO_NHAP
AFTER INSERT ON CT_PHIEUNHAP
FOR EACH ROW
DECLARE
    V_HAS_KHO NUMBER;
BEGIN
    SELECT COUNT(*)
    INTO V_HAS_KHO
    FROM KHOSACH
    WHERE MaSach = :NEW.MaSach;

    IF V_HAS_KHO = 0 THEN
        INSERT INTO KHOSACH(MaSach, SoLuongTong, SoLuongCon, SoLuongHong)
        VALUES (:NEW.MaSach, :NEW.SoLuong, :NEW.SoLuong, 0);
    ELSE
        UPDATE KHOSACH
        SET SoLuongTong = SoLuongTong + :NEW.SoLuong,
            SoLuongCon = SoLuongCon + :NEW.SoLuong
        WHERE MaSach = :NEW.MaSach;
    END IF;
END;
/
```

## 3.2.2.1. Tao phieu muon va them sach vao phieu muon

```sql
CREATE OR REPLACE PROCEDURE SP_TAO_PHIEU_MUON(
    P_MA_DOCGIA IN VARCHAR2,
    P_MA_NHANVIEN IN VARCHAR2,
    P_NGAY_HEN_TRA IN DATE,
    P_MA_PHIEU_MUON OUT VARCHAR2
)
IS
BEGIN
    IF FN_KIEM_TRA_THE_HOP_LE(P_MA_DOCGIA) = 0 THEN
        RAISE_APPLICATION_ERROR(-20101, 'The doc gia khong hop le hoac da het han.');
    END IF;

    INSERT INTO PHIEUMUON(MaDocGia, MaNhanVien, NgayMuon, NgayHenTra, TrangThai)
    VALUES (P_MA_DOCGIA, P_MA_NHANVIEN, SYSDATE, P_NGAY_HEN_TRA, 'DANG_MUON')
    RETURNING MaPhieuMuon INTO P_MA_PHIEU_MUON;
END;
/

CREATE OR REPLACE PROCEDURE SP_THEM_CT_PHIEUMUON(
    P_MA_PHIEU_MUON IN VARCHAR2,
    P_MA_SACH IN VARCHAR2,
    P_SO_LUONG IN NUMBER DEFAULT 1
)
IS
    V_SO_LUONG_CON NUMBER;
BEGIN
    SELECT SoLuongCon
    INTO V_SO_LUONG_CON
    FROM KHOSACH
    WHERE MaSach = P_MA_SACH
    FOR UPDATE;

    IF P_SO_LUONG <= 0 THEN
        RAISE_APPLICATION_ERROR(-20102, 'So luong muon phai lon hon 0.');
    END IF;

    IF V_SO_LUONG_CON < P_SO_LUONG THEN
        RAISE_APPLICATION_ERROR(-20103, 'Khong du so luong sach con trong kho.');
    END IF;

    INSERT INTO CT_PHIEUMUON(MaPhieuMuon, MaSach, SoLuong)
    VALUES (P_MA_PHIEU_MUON, P_MA_SACH, P_SO_LUONG);

    UPDATE KHOSACH
    SET SoLuongCon = SoLuongCon - P_SO_LUONG
    WHERE MaSach = P_MA_SACH;
END;
/
```

## 3.2.2.2. Nhan tra sach

```sql
CREATE OR REPLACE PROCEDURE SP_TRA_SACH(
    P_MA_PHIEU_MUON IN VARCHAR2,
    P_MA_NHANVIEN IN VARCHAR2
)
IS
    V_TIEN_PHAT NUMBER;
BEGIN
    INSERT INTO PHIEUTRA(MaPhieuMuon, MaNhanVien, NgayTra)
    VALUES (P_MA_PHIEU_MUON, P_MA_NHANVIEN, SYSDATE);

    UPDATE CT_PHIEUMUON
    SET TrangThai = 'DA_TRA'
    WHERE MaPhieuMuon = P_MA_PHIEU_MUON
      AND TrangThai = 'DANG_MUON';

    UPDATE KHOSACH KS
    SET KS.SoLuongCon = KS.SoLuongCon + (
        SELECT SUM(CT.SoLuong)
        FROM CT_PHIEUMUON CT
        WHERE CT.MaPhieuMuon = P_MA_PHIEU_MUON
          AND CT.MaSach = KS.MaSach
    )
    WHERE EXISTS (
        SELECT 1
        FROM CT_PHIEUMUON CT
        WHERE CT.MaPhieuMuon = P_MA_PHIEU_MUON
          AND CT.MaSach = KS.MaSach
    );

    V_TIEN_PHAT := FN_TINH_TIEN_PHAT(P_MA_PHIEU_MUON);

    IF V_TIEN_PHAT > 0 THEN
        INSERT INTO VIPHAM(MaPhieuMuon, LoaiViPham, TienPhat)
        VALUES (P_MA_PHIEU_MUON, 'QUA_HAN', V_TIEN_PHAT);
        UPDATE PHIEUMUON SET TrangThai = 'QUA_HAN' WHERE MaPhieuMuon = P_MA_PHIEU_MUON;
    ELSE
        UPDATE PHIEUMUON SET TrangThai = 'DA_TRA' WHERE MaPhieuMuon = P_MA_PHIEU_MUON;
    END IF;
END;
/
```

## 3.2.2.3. Nhap sach tu nha cung cap

```sql
CREATE OR REPLACE PROCEDURE SP_NHAP_SACH(
    P_MA_NCC IN VARCHAR2,
    P_MA_NHANVIEN IN VARCHAR2,
    P_MA_SACH IN VARCHAR2,
    P_SO_LUONG IN NUMBER,
    P_DON_GIA IN NUMBER
)
IS
    V_MA_PHIEU_NHAP PHIEUNHAP.MaPhieuNhap%TYPE;
    V_HAS_KHO NUMBER;
BEGIN
    IF P_SO_LUONG <= 0 THEN
        RAISE_APPLICATION_ERROR(-20104, 'So luong nhap phai lon hon 0.');
    END IF;

    INSERT INTO PHIEUNHAP(MaNhaCungCap, MaNhanVien, NgayNhap, TongTien)
    VALUES (P_MA_NCC, P_MA_NHANVIEN, SYSDATE, P_SO_LUONG * P_DON_GIA)
    RETURNING MaPhieuNhap INTO V_MA_PHIEU_NHAP;

    INSERT INTO CT_PHIEUNHAP(MaPhieuNhap, MaSach, SoLuong, DonGia)
    VALUES (V_MA_PHIEU_NHAP, P_MA_SACH, P_SO_LUONG, P_DON_GIA);

    BEGIN
        SELECT 1 INTO V_HAS_KHO
        FROM KHOSACH
        WHERE MaSach = P_MA_SACH
        FOR UPDATE;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            V_HAS_KHO := 0;
    END;

    IF V_HAS_KHO = 0 THEN
        INSERT INTO KHOSACH(MaSach, SoLuongTong, SoLuongCon, SoLuongHong)
        VALUES (P_MA_SACH, P_SO_LUONG, P_SO_LUONG, 0);
    ELSE
        UPDATE KHOSACH
        SET SoLuongTong = SoLuongTong + P_SO_LUONG,
            SoLuongCon = SoLuongCon + P_SO_LUONG
        WHERE MaSach = P_MA_SACH;
    END IF;
END;
/
```

## 3.2.2.4. Dang ky the doc gia

```sql
CREATE OR REPLACE PROCEDURE SP_DANGKY_DOCGIA(
    P_TEN_DANG_NHAP IN VARCHAR2,
    P_MAT_KHAU IN VARCHAR2,
    P_HO_TEN IN VARCHAR2,
    P_EMAIL IN VARCHAR2,
    P_SO_DIEN_THOAI IN VARCHAR2,
    P_DIA_CHI IN VARCHAR2,
    P_NGAY_HET_HAN IN DATE DEFAULT NULL
)
IS
    V_MA_TAI_KHOAN TAIKHOAN.MaTaiKhoan%TYPE;
BEGIN
    INSERT INTO TAIKHOAN(TenDangNhap, MatKhau, VaiTro)
    VALUES (P_TEN_DANG_NHAP, P_MAT_KHAU, 'DOC_GIA')
    RETURNING MaTaiKhoan INTO V_MA_TAI_KHOAN;

    INSERT INTO DOCGIA(MaTaiKhoan, HoTen, Email, SoDienThoai, DiaChi, NgayHetHan)
    VALUES (V_MA_TAI_KHOAN, P_HO_TEN, P_EMAIL, P_SO_DIEN_THOAI, P_DIA_CHI, P_NGAY_HET_HAN);
END;
/
```

## 3.2.2.5. Thanh ly sach

```sql
CREATE OR REPLACE PROCEDURE SP_THANHLY_SACH(
    P_MA_SACH IN VARCHAR2,
    P_MA_NHANVIEN IN VARCHAR2,
    P_SO_LUONG IN NUMBER,
    P_LY_DO IN VARCHAR2
)
IS
    V_SO_LUONG_CON KHOSACH.SoLuongCon%TYPE;
BEGIN
    IF P_SO_LUONG <= 0 THEN
        RAISE_APPLICATION_ERROR(-20105, 'So luong thanh ly phai lon hon 0.');
    END IF;

    SELECT SoLuongCon
    INTO V_SO_LUONG_CON
    FROM KHOSACH
    WHERE MaSach = P_MA_SACH
    FOR UPDATE;

    IF V_SO_LUONG_CON < P_SO_LUONG THEN
        RAISE_APPLICATION_ERROR(-20106, 'So luong thanh ly vuot qua so luong kha dung.');
    END IF;

    INSERT INTO THANHLY(MaSach, MaNhanVien, SoLuong, LyDo)
    VALUES (P_MA_SACH, P_MA_NHANVIEN, P_SO_LUONG, P_LY_DO);

    UPDATE KHOSACH
    SET SoLuongTong = SoLuongTong - P_SO_LUONG,
        SoLuongCon = SoLuongCon - P_SO_LUONG
    WHERE MaSach = P_MA_SACH;

    UPDATE SACH
    SET TrangThai = 'NGUNG_LUU_THONG'
    WHERE MaSach = P_MA_SACH
      AND NOT EXISTS (
          SELECT 1 FROM KHOSACH WHERE MaSach = P_MA_SACH AND SoLuongTong > 0
      );
END;
/
```

## 3.3.2.1. Tinh tien phat qua han

```sql
CREATE OR REPLACE FUNCTION FN_TINH_TIEN_PHAT(P_MA_PHIEUMUON IN VARCHAR2)
RETURN NUMBER
IS
    V_NGAY_HEN_TRA DATE;
    V_SO_NGAY_TRE NUMBER;
BEGIN
    SELECT NgayHenTra
    INTO V_NGAY_HEN_TRA
    FROM PHIEUMUON
    WHERE MaPhieuMuon = P_MA_PHIEUMUON;

    V_SO_NGAY_TRE := GREATEST(TRUNC(SYSDATE) - TRUNC(V_NGAY_HEN_TRA), 0);
    RETURN V_SO_NGAY_TRE * 1000;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RETURN 0;
END;
/
```

## 3.3.2.2. Dem so sach dang muon

```sql
CREATE OR REPLACE FUNCTION FN_SO_SACH_DANG_MUON(P_MA_DOCGIA IN VARCHAR2)
RETURN NUMBER
IS
    V_COUNT NUMBER;
BEGIN
    SELECT NVL(SUM(CT.SoLuong), 0)
    INTO V_COUNT
    FROM PHIEUMUON PM
    JOIN CT_PHIEUMUON CT ON CT.MaPhieuMuon = PM.MaPhieuMuon
    WHERE PM.MaDocGia = P_MA_DOCGIA
      AND PM.TrangThai IN ('DANG_MUON', 'QUA_HAN');

    RETURN V_COUNT;
END;
/
```

## 3.3.2.3. Kiem tra the doc gia hop le

```sql
CREATE OR REPLACE FUNCTION FN_KIEM_TRA_THE_HOP_LE(P_MA_DOCGIA IN VARCHAR2)
RETURN NUMBER
IS
    V_COUNT NUMBER;
BEGIN
    SELECT COUNT(*)
    INTO V_COUNT
    FROM DOCGIA
    WHERE MaDocGia = P_MA_DOCGIA
      AND TrangThai = 'HOAT_DONG'
      AND (NgayHetHan IS NULL OR NgayHetHan >= TRUNC(SYSDATE));

    RETURN CASE WHEN V_COUNT = 1 THEN 1 ELSE 0 END;
END;
/
```
