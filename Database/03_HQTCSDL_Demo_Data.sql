-- =============================================================
-- HQTCSDL - Dữ liệu mẫu cho mô hình chuẩn hóa
-- Chạy sau:
-- 1. 01_HQTCSDL_Schema.sql
-- 2. 02_HQTCSDL_Procedures_Triggers.sql
-- =============================================================

INSERT INTO TAIKHOAN(TenDangNhap, MatKhau, VaiTro) VALUES ('admin', 'admin123', 'ADMIN');
INSERT INTO TAIKHOAN(TenDangNhap, MatKhau, VaiTro) VALUES ('thuthu01', 'tt123', 'THU_THU');
INSERT INTO TAIKHOAN(TenDangNhap, MatKhau, VaiTro) VALUES ('quanly01', 'ql123', 'QUAN_LY');
INSERT INTO TAIKHOAN(TenDangNhap, MatKhau, VaiTro) VALUES ('docgia01', 'dg123', 'DOC_GIA');
INSERT INTO TAIKHOAN(TenDangNhap, MatKhau, VaiTro) VALUES ('docgia02', 'dg123', 'DOC_GIA');

INSERT INTO NHANVIEN(MaTaiKhoan, HoTen, ChucVu, Email, SoDienThoai)
SELECT MaTaiKhoan, 'Nguyễn Minh Thư', 'Thủ thư', 'thuthu01@library.edu.vn', '0901000001'
FROM TAIKHOAN WHERE TenDangNhap = 'thuthu01';

INSERT INTO NHANVIEN(MaTaiKhoan, HoTen, ChucVu, Email, SoDienThoai)
SELECT MaTaiKhoan, 'Trần Quốc Quản', 'Quản lý', 'quanly01@library.edu.vn', '0901000002'
FROM TAIKHOAN WHERE TenDangNhap = 'quanly01';

INSERT INTO DOCGIA(MaTaiKhoan, HoTen, Email, SoDienThoai, DiaChi, NgayHetHan)
SELECT MaTaiKhoan, 'Lê Hoàng An', 'docgia01@student.edu.vn', '0911000001', 'Thủ Đức, TP.HCM', ADD_MONTHS(TRUNC(SYSDATE), 12)
FROM TAIKHOAN WHERE TenDangNhap = 'docgia01';

INSERT INTO DOCGIA(MaTaiKhoan, HoTen, Email, SoDienThoai, DiaChi, NgayHetHan)
SELECT MaTaiKhoan, 'Phạm Gia Hân', 'docgia02@student.edu.vn', '0911000002', 'Quận 9, TP.HCM', ADD_MONTHS(TRUNC(SYSDATE), 12)
FROM TAIKHOAN WHERE TenDangNhap = 'docgia02';

INSERT INTO DOANHMUC(TenDoanhMuc, MoTa) VALUES ('Cơ sở dữ liệu', 'Sách về cơ sở dữ liệu và hệ quản trị CSDL');
INSERT INTO DOANHMUC(TenDoanhMuc, MoTa) VALUES ('Lập trình', 'Sách về phát triển phần mềm và ngôn ngữ lập trình');
INSERT INTO DOANHMUC(TenDoanhMuc, MoTa) VALUES ('Phân tích thiết kế', 'Sách về phân tích, thiết kế hệ thống thông tin');

INSERT INTO NHACUNGCAP(TenNhaCungCap, DiaChi, Email, SoDienThoai)
VALUES ('Công ty Sách Giáo dục A', 'Quận 1, TP.HCM', 'ncc_a@books.vn', '0281111111');

INSERT INTO NHACUNGCAP(TenNhaCungCap, DiaChi, Email, SoDienThoai)
VALUES ('Nhà sách Học thuật B', 'Bình Thạnh, TP.HCM', 'ncc_b@books.vn', '0282222222');

INSERT INTO SACH(ISBN, TenSach, TacGia, NhaXuatBan, NamXuatBan, MaDoanhMuc, MoTa)
SELECT '9786041234567', 'Nhập môn Hệ quản trị cơ sở dữ liệu', 'Nguyễn Văn A', 'NXB Giáo Dục', 2023, MaDoanhMuc,
       'Giáo trình nền tảng về mô hình dữ liệu, SQL, giao tác và xử lý đồng thời.'
FROM DOANHMUC WHERE TenDoanhMuc = 'Cơ sở dữ liệu';

INSERT INTO SACH(ISBN, TenSach, TacGia, NhaXuatBan, NamXuatBan, MaDoanhMuc, MoTa)
SELECT '9786041234568', 'Thiết kế hệ thống thư viện', 'Trần Thị B', 'NXB Đại Học', 2022, MaDoanhMuc,
       'Sách về phân tích yêu cầu, thiết kế quy trình và mô hình dữ liệu cho thư viện.'
FROM DOANHMUC WHERE TenDoanhMuc = 'Phân tích thiết kế';

INSERT INTO SACH(ISBN, TenSach, TacGia, NhaXuatBan, NamXuatBan, MaDoanhMuc, MoTa)
SELECT '9786041234569', 'Lập trình Web với Node.js', 'Lê Văn C', 'NXB Công Nghệ', 2024, MaDoanhMuc,
       'Tài liệu về phát triển backend API bằng Node.js và Express.'
FROM DOANHMUC WHERE TenDoanhMuc = 'Lập trình';

DECLARE
    V_MA_NHANVIEN NHANVIEN.MaNhanVien%TYPE;
BEGIN
    SELECT MaNhanVien
    INTO V_MA_NHANVIEN
    FROM NHANVIEN
    WHERE ROWNUM = 1;

    FOR R IN (
        SELECT S.MaSach, N.MaNhaCungCap
        FROM SACH S
        CROSS JOIN (SELECT MaNhaCungCap FROM NHACUNGCAP WHERE ROWNUM = 1) N
    ) LOOP
        SP_NHAP_SACH(R.MaNhaCungCap,
                     V_MA_NHANVIEN,
                     R.MaSach,
                     10,
                     85000);
    END LOOP;
END;
/

DECLARE
    V_MA_PHIEU_MUON PHIEUMUON.MaPhieuMuon%TYPE;
    V_MA_DOCGIA     DOCGIA.MaDocGia%TYPE;
    V_MA_NHANVIEN   NHANVIEN.MaNhanVien%TYPE;
    V_MA_SACH       SACH.MaSach%TYPE;
BEGIN
    SELECT MaDocGia INTO V_MA_DOCGIA FROM DOCGIA WHERE Email = 'docgia01@student.edu.vn';
    SELECT MaNhanVien INTO V_MA_NHANVIEN FROM NHANVIEN WHERE ChucVu = 'Thủ thư' AND ROWNUM = 1;
    SELECT MaSach INTO V_MA_SACH FROM SACH WHERE ISBN = '9786041234567';

    SP_TAO_PHIEU_MUON(V_MA_DOCGIA, V_MA_NHANVIEN, TRUNC(SYSDATE) + 7, V_MA_PHIEU_MUON);
    SP_THEM_CT_PHIEUMUON(V_MA_PHIEU_MUON, V_MA_SACH, 1);
END;
/

COMMIT;
