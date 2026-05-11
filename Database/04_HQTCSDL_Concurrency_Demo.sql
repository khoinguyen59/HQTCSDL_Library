-- =============================================================
-- HQTCSDL - Demo xử lý đồng thời T1/T2
-- Dùng cho báo cáo chương giao tác và đồng thời
-- =============================================================

-- KỊCH BẢN 1: LOST UPDATE
-- Chuẩn bị: chọn một MaSach chỉ còn SoLuongCon = 1 để demo.
-- Session T1:
--   SELECT SoLuongCon FROM KHOSACH WHERE MaSach = 'S000001' FOR UPDATE;
--   -- giữ transaction chưa commit
-- Session T2:
--   SELECT SoLuongCon FROM KHOSACH WHERE MaSach = 'S000001' FOR UPDATE;
--   -- bị chờ cho đến khi T1 commit/rollback
-- Kết quả: tránh hai thủ thư cùng trừ số lượng một lúc.

-- KỊCH BẢN 2: UNCOMMITTED READ
-- Session T1:
--   UPDATE KHOSACH SET SoLuongCon = SoLuongCon - 1 WHERE MaSach = 'S000001';
--   -- chưa commit
-- Session T2:
--   SELECT SoLuongCon FROM KHOSACH WHERE MaSach = 'S000001';
-- Oracle sẽ không đọc dữ liệu chưa commit của T1.

-- KỊCH BẢN 3: NON-REPEATABLE READ
-- Session T1:
--   SELECT FN_SO_SACH_DANG_MUON('DG000001') FROM DUAL;
-- Session T2:
--   -- tạo thêm phiếu mượn cho DG000001 và commit
-- Session T1:
--   SELECT FN_SO_SACH_DANG_MUON('DG000001') FROM DUAL;
-- Kết quả có thể khác nếu không gói kiểm tra và cập nhật trong cùng procedure.

-- KỊCH BẢN 4: PHANTOM READ
-- Session T1:
--   SELECT COUNT(*) FROM PHIEUMUON WHERE TrangThai = 'QUA_HAN';
-- Session T2:
--   UPDATE PHIEUMUON SET TrangThai = 'QUA_HAN' WHERE MaPhieuMuon = 'PM000001';
--   COMMIT;
-- Session T1:
--   SELECT COUNT(*) FROM PHIEUMUON WHERE TrangThai = 'QUA_HAN';

-- KỊCH BẢN 5: DEADLOCK
-- Session T1:
--   UPDATE KHOSACH SET SoLuongCon = SoLuongCon - 1 WHERE MaSach = 'S000001';
--   -- sau đó update PHIEUMUON
-- Session T2:
--   UPDATE PHIEUMUON SET TrangThai = 'DANG_MUON' WHERE MaPhieuMuon = 'PM000001';
--   -- sau đó update KHOSACH
-- Nếu thứ tự khóa khác nhau giữa các transaction, có thể phát sinh deadlock.

-- KHUYẾN NGHỊ TRIỂN KHAI
-- 1. Thống nhất thứ tự khóa bảng/dòng trong các stored procedure.
-- 2. Dùng SELECT ... FOR UPDATE với dòng tồn kho và phiếu mượn.
-- 3. Giữ transaction ngắn, commit đúng thời điểm.
-- 4. Nếu cần, backend phải hỗ trợ retry khi gặp deadlock.
