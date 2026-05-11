-- Trigger 1: Tự động tính ngày hẹn trả khi mượn sách nếu chưa có
CREATE OR REPLACE TRIGGER TRG_AUTO_NGAYHENTRA
BEFORE INSERT ON PHIEUMUON
FOR EACH ROW
BEGIN
    IF :NEW.NGAYHENTRA IS NULL THEN
        :NEW.NGAYHENTRA := :NEW.NGAYMUON + 14; -- Mặc định mượn 14 ngày
    END IF;
END;
/

-- Trigger 2: Tự động trừ tồn kho khi mượn sách
CREATE OR REPLACE TRIGGER TRG_TRU_TONKHO_MUON
AFTER INSERT ON CT_PHIEUMUON
FOR EACH ROW
DECLARE
    v_soluong_khadung NUMBER;
BEGIN
    -- Lấy số lượng khả dụng hiện tại
    SELECT SOLUONGKHADUNG INTO v_soluong_khadung
    FROM KHOSACH
    WHERE MASACH = :NEW.MASACH;
    
    -- Kiểm tra nếu không còn sách
    IF v_soluong_khadung <= 0 THEN
        RAISE_APPLICATION_ERROR(-20001, 'Sách không còn đủ số lượng trong kho.');
    END IF;
    
    -- Trừ số lượng khả dụng
    UPDATE KHOSACH
    SET SOLUONGKHADUNG = SOLUONGKHADUNG - 1
    WHERE MASACH = :NEW.MASACH;
    
    -- Cập nhật trạng thái sách nếu số lượng về 0
    IF v_soluong_khadung - 1 = 0 THEN
        UPDATE SACH
        SET TINHTRANG = 'Da muon'
        WHERE MASACH = :NEW.MASACH;
    END IF;
END;
/

-- Trigger 3: Tự động tính tiền phạt quá hạn khi trả sách
CREATE OR REPLACE TRIGGER TRG_TINH_TIENPHAT
BEFORE INSERT ON PHIEUTRA
FOR EACH ROW
DECLARE
    v_ngayhentra DATE;
    v_songaytre NUMBER;
BEGIN
    -- Lấy ngày hẹn trả từ phiếu mượn
    SELECT NGAYHENTRA INTO v_ngayhentra
    FROM PHIEUMUON
    WHERE MAPHIEUMUON = :NEW.MAPHIEUMUON;
    
    -- Tính số ngày trễ
    v_songaytre := TRUNC(:NEW.NGAYTHUCTRA) - TRUNC(v_ngayhentra);
    
    IF v_songaytre > 0 THEN
        -- Đơn giá phạt là 5000 VND/ngày
        :NEW.TIENPHATQUAHAN := v_songaytre * 5000;
    ELSE
        :NEW.TIENPHATQUAHAN := 0;
    END IF;
END;
/

-- Trigger 4: Tự động cập nhật kho khi nhập sách
CREATE OR REPLACE TRIGGER TRG_CAPNHAT_KHO_NHAP
AFTER INSERT ON CT_PHIEUNHAP
FOR EACH ROW
DECLARE
    v_count NUMBER;
BEGIN
    -- Kiểm tra xem sách đã có trong kho chưa
    SELECT COUNT(*) INTO v_count
    FROM KHOSACH
    WHERE MASACH = :NEW.MASACH;
    
    IF v_count > 0 THEN
        -- Nếu đã có thì cộng thêm số lượng
        UPDATE KHOSACH
        SET SOLUONGKHADUNG = SOLUONGKHADUNG + :NEW.SOLUONG
        WHERE MASACH = :NEW.MASACH;
    ELSE
        -- Nếu chưa có thì thêm mới vào kho
        INSERT INTO KHOSACH (MASACH, SOLUONGKHADUNG, DONVITINH)
        VALUES (:NEW.MASACH, :NEW.SOLUONG, :NEW.DONVITINH);
    END IF;
    
    -- Cập nhật trạng thái sách thành sẵn sàng
    UPDATE SACH
    SET TINHTRANG = 'San sang'
    WHERE MASACH = :NEW.MASACH;
END;
/
