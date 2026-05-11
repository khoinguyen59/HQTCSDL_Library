-- Helper Type (Nếu cần)
-- CREATE OR REPLACE TYPE T_NUMBER_TABLE AS TABLE OF NUMBER;
-- /

-- 1. Function tính tiền phạt quá hạn
CREATE OR REPLACE FUNCTION FN_TINH_TIENPHAT (p_maphieumuon IN NUMBER)
RETURN NUMBER
IS
    v_ngayhentra DATE;
    v_songaytre NUMBER;
    v_tienphat NUMBER := 0;
BEGIN
    SELECT NGAYHENTRA INTO v_ngayhentra
    FROM PHIEUMUON
    WHERE MAPHIEUMUON = p_maphieumuon;
    
    v_songaytre := TRUNC(SYSDATE) - TRUNC(v_ngayhentra);
    
    IF v_songaytre > 0 THEN
        v_tienphat := v_songaytre * 5000;
    END IF;
    
    RETURN v_tienphat;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RETURN 0;
END;
/

-- 2. Function đếm số sách đang mượn
CREATE OR REPLACE FUNCTION FN_DEM_SACH_DANG_MUON (p_madocgia IN NUMBER)
RETURN NUMBER
IS
    v_count NUMBER;
BEGIN
    SELECT COUNT(CT.MASACH) INTO v_count
    FROM PHIEUMUON PM
    JOIN CT_PHIEUMUON CT ON PM.MAPHIEUMUON = CT.MAPHIEUMUON
    LEFT JOIN PHIEUTRA PT ON PM.MAPHIEUMUON = PT.MAPHIEUMUON
    WHERE PM.MADOCGIA = p_madocgia AND PT.MAPHIEUTRA IS NULL;
    
    RETURN v_count;
END;
/

-- 3. Function kiểm tra thẻ độc giả hợp lệ
CREATE OR REPLACE FUNCTION FN_KIEM_THE_HOPHANH (p_madocgia IN NUMBER)
RETURN NUMBER
IS
    v_trangthai NUMBER;
    v_ngayhethan DATE;
BEGIN
    SELECT T.TRANGTHAI, T.NGAYHETHANTHE INTO v_trangthai, v_ngayhethan
    FROM DOCGIA D
    JOIN TAIKHOAN T ON D.MATK = T.MATK
    WHERE D.MADOCGIA = p_madocgia;
    
    IF v_trangthai = 1 AND v_ngayhethan >= SYSDATE THEN
        RETURN 1; -- Hợp lệ
    ELSE
        RETURN 0; -- Không hợp lệ
    END IF;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RETURN 0;
END;
/

-- 4. Procedure Cho mượn sách
CREATE OR REPLACE PROCEDURE SP_MUON_SACH (
    p_manhanvien IN NUMBER,
    p_madocgia IN NUMBER,
    p_masach IN NUMBER, -- Mượn 1 cuốn để đơn giản hóa quá trình test đồng thời
    p_tiendatcoc IN NUMBER,
    p_ghichu IN VARCHAR2
)
IS
    v_the_hople NUMBER;
    v_sach_dang_muon NUMBER;
    v_maphieumuon NUMBER;
BEGIN
    -- Thiết lập mức cô lập để xử lý đồng thời
    COMMIT; -- Đảm bảo không có transaction nào đang dang dở
    SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
    SAVEPOINT sp_muon_sach_start;
    
    -- Kiểm tra thẻ độc giả
    v_the_hople := FN_KIEM_THE_HOPHANH(p_madocgia);
    IF v_the_hople = 0 THEN
        RAISE_APPLICATION_ERROR(-20002, 'Thẻ độc giả không hợp lệ hoặc đã bị khóa.');
    END IF;
    
    -- Kiểm tra quota mượn sách (Tối đa 5 cuốn)
    v_sach_dang_muon := FN_DEM_SACH_DANG_MUON(p_madocgia);
    IF v_sach_dang_muon >= 5 THEN
        RAISE_APPLICATION_ERROR(-20003, 'Độc giả đã mượn tối đa số sách cho phép (5 cuốn).');
    END IF;
    
    -- Lập phiếu mượn
    INSERT INTO PHIEUMUON (MANHANVIEN, MADOCGIA, TIENDATCOC, SOLUONGSACH, GHICHU)
    VALUES (p_manhanvien, p_madocgia, p_tiendatcoc, 1, p_ghichu)
    RETURNING MAPHIEUMUON INTO v_maphieumuon;
    
    -- Thêm chi tiết phiếu mượn (Trigger TRG_TRU_TONKHO_MUON sẽ chạy và kiểm tra tồn kho)
    INSERT INTO CT_PHIEUMUON (MAPHIEUMUON, MASACH)
    VALUES (v_maphieumuon, p_masach);
    
    COMMIT;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK TO sp_muon_sach_start;
        RAISE;
END;
/

-- 5. Procedure Nhận trả sách
CREATE OR REPLACE PROCEDURE SP_TRA_SACH (
    p_maphieumuon IN NUMBER,
    p_manhanvien IN NUMBER,
    p_tinhtrang_sach IN VARCHAR2
)
IS
    v_count NUMBER;
    v_masach NUMBER;
    v_madocgia NUMBER;
    v_tienphat NUMBER;
    v_maphieutra NUMBER;
BEGIN
    COMMIT;
    SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
    SAVEPOINT sp_tra_sach_start;
    
    -- Kiểm tra phiếu mượn
    SELECT COUNT(*) INTO v_count
    FROM PHIEUTRA
    WHERE MAPHIEUMUON = p_maphieumuon;
    
    IF v_count > 0 THEN
        RAISE_APPLICATION_ERROR(-20004, 'Phiếu mượn này đã được trả sách.');
    END IF;
    
    -- Lấy thông tin độc giả từ phiếu mượn
    SELECT MADOCGIA INTO v_madocgia FROM PHIEUMUON WHERE MAPHIEUMUON = p_maphieumuon;
    
    -- Tạo phiếu trả
    INSERT INTO PHIEUTRA (MAPHIEUMUON, MANHANVIEN, TINHTRANGSACHKHITRA)
    VALUES (p_maphieumuon, p_manhanvien, p_tinhtrang_sach)
    RETURNING MAPHIEUTRA, TIENPHATQUAHAN INTO v_maphieutra, v_tienphat;
    
    -- Cập nhật lại kho sách
    -- Lấy mã sách từ CT_PHIEUMUON
    FOR r IN (SELECT MASACH FROM CT_PHIEUMUON WHERE MAPHIEUMUON = p_maphieumuon) LOOP
        UPDATE KHOSACH SET SOLUONGKHADUNG = SOLUONGKHADUNG + 1 WHERE MASACH = r.MASACH;
        UPDATE SACH SET TINHTRANG = 'San sang' WHERE MASACH = r.MASACH;
    END LOOP;
    
    -- Xử lý vi phạm nếu sách hỏng hoặc mất
    IF p_tinhtrang_sach IN ('Hu hong', 'Mat') THEN
        INSERT INTO VIPHAM (MADOCGIA, MAPHIEUTRA, LOAIVIPHAM, SOTIENPHAT)
        VALUES (v_madocgia, v_maphieutra, p_tinhtrang_sach, 50000); -- Phạt mặc định 50k
    END IF;
    
    COMMIT;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK TO sp_tra_sach_start;
        RAISE;
END;
/

-- 6. Procedure Đăng ký độc giả
CREATE OR REPLACE PROCEDURE SP_DANGKY_DOCGIA (
    p_tendangnhap IN VARCHAR2,
    p_matkhau IN VARCHAR2,
    p_tendocgia IN VARCHAR2,
    p_sdt IN VARCHAR2,
    p_gioitinh IN VARCHAR2,
    p_ngaysinh IN DATE,
    p_diachi IN VARCHAR2
)
IS
    v_count NUMBER;
    v_matk NUMBER;
BEGIN
    COMMIT;
    SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
    SAVEPOINT sp_dangky_start;
    
    -- Kiểm tra tên đăng nhập
    SELECT COUNT(*) INTO v_count FROM TAIKHOAN WHERE TENDANGNHAP = p_tendangnhap;
    IF v_count > 0 THEN
        RAISE_APPLICATION_ERROR(-20005, 'Tên đăng nhập đã tồn tại.');
    END IF;
    
    -- Tạo tài khoản
    INSERT INTO TAIKHOAN (TENDANGNHAP, MATKHAU, SDT, VAITRO, NGAYHETHANTHE)
    VALUES (p_tendangnhap, p_matkhau, p_sdt, 'Reader', SYSDATE + 365)
    RETURNING MATK INTO v_matk;
    
    -- Tạo độc giả
    INSERT INTO DOCGIA (MATK, TENDOCGIA, SDT, GIOITINH, NGAYSINH, DIACHI)
    VALUES (v_matk, p_tendocgia, p_sdt, p_gioitinh, p_ngaysinh, p_diachi);
    
    COMMIT;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK TO sp_dangky_start;
        RAISE;
END;
/

-- 7. Procedure Thanh lý sách
CREATE OR REPLACE PROCEDURE SP_THANHLY_SACH (
    p_masach IN NUMBER,
    p_soluong IN NUMBER,
    p_lydo IN VARCHAR2,
    p_nguoipheduyet IN NUMBER
)
IS
    v_soluong_khadung NUMBER;
BEGIN
    COMMIT;
    SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
    SAVEPOINT sp_thanhly_start;
    
    -- Lấy số lượng khả dụng
    SELECT SOLUONGKHADUNG INTO v_soluong_khadung FROM KHOSACH WHERE MASACH = p_masach;
    
    IF v_soluong_khadung < p_soluong THEN
        RAISE_APPLICATION_ERROR(-20006, 'Số lượng thanh lý vượt quá số lượng khả dụng trong kho.');
    END IF;
    
    -- Tạo phiếu thanh lý
    INSERT INTO THANHLY (LYDO, MASACH, SOLUONG, NGUOIPHEDUYET)
    VALUES (p_lydo, p_masach, p_soluong, p_nguoipheduyet);
    
    -- Cập nhật kho
    UPDATE KHOSACH SET SOLUONGKHADUNG = SOLUONGKHADUNG - p_soluong WHERE MASACH = p_masach;
    
    -- Cập nhật trạng thái sách nếu kho = 0
    IF v_soluong_khadung - p_soluong = 0 THEN
        UPDATE SACH SET TINHTRANG = 'Da thanh ly' WHERE MASACH = p_masach;
    END IF;
    
    COMMIT;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK TO sp_thanhly_start;
        RAISE;
END;
/
