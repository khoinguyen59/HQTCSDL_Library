-- =============================================================
-- HQTCSDL - Quick verification script
-- Run after 01, 02, 03 scripts to check demo readiness.
-- =============================================================

SET SERVEROUTPUT ON;

DECLARE
    V_COUNT NUMBER;
BEGIN
    SELECT COUNT(*) INTO V_COUNT FROM TAIKHOAN;
    DBMS_OUTPUT.PUT_LINE('TAIKHOAN=' || V_COUNT);

    SELECT COUNT(*) INTO V_COUNT FROM DOCGIA;
    DBMS_OUTPUT.PUT_LINE('DOCGIA=' || V_COUNT);

    SELECT COUNT(*) INTO V_COUNT FROM NHANVIEN;
    DBMS_OUTPUT.PUT_LINE('NHANVIEN=' || V_COUNT);

    SELECT COUNT(*) INTO V_COUNT FROM SACH;
    DBMS_OUTPUT.PUT_LINE('SACH=' || V_COUNT);

    SELECT COUNT(*) INTO V_COUNT FROM KHOSACH;
    DBMS_OUTPUT.PUT_LINE('KHOSACH=' || V_COUNT);

    SELECT COUNT(*) INTO V_COUNT FROM PHIEUMUON;
    DBMS_OUTPUT.PUT_LINE('PHIEUMUON=' || V_COUNT);
END;
/

SELECT S.MaSach,
       S.TenSach,
       KS.SoLuongTong,
       KS.SoLuongCon
FROM SACH S
JOIN KHOSACH KS ON KS.MaSach = S.MaSach
ORDER BY S.MaSach;

SELECT PM.MaPhieuMuon,
       DG.HoTen AS TenDocGia,
       PM.TrangThai,
       PM.NgayMuon,
       PM.NgayHenTra
FROM PHIEUMUON PM
JOIN DOCGIA DG ON DG.MaDocGia = PM.MaDocGia
ORDER BY PM.MaPhieuMuon;
