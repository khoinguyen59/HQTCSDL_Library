-- =============================================================
-- HQTCSDL - Các truy vấn báo cáo phục vụ đồ án
-- Chạy sau khi đã có dữ liệu mẫu.
-- =============================================================

-- 1. Báo cáo đơn giản: danh sách sách và tồn kho hiện tại.
SELECT S.MaSach,
       S.TenSach,
       DM.TenDoanhMuc,
       NVL(KS.SoLuongTong, 0) AS SoLuongTong,
       NVL(KS.SoLuongCon, 0) AS SoLuongCon,
       NVL(KS.SoLuongHong, 0) AS SoLuongHong
FROM SACH S
LEFT JOIN DOANHMUC DM ON DM.MaDoanhMuc = S.MaDoanhMuc
LEFT JOIN KHOSACH KS ON KS.MaSach = S.MaSach
ORDER BY S.TenSach;

-- 2. Báo cáo grouping & totals: số lượt mượn theo danh mục.
SELECT DM.TenDoanhMuc,
       COUNT(DISTINCT PM.MaPhieuMuon) AS SoPhieuMuon,
       NVL(SUM(CT.SoLuong), 0) AS TongSoSachMuon
FROM DOANHMUC DM
LEFT JOIN SACH S ON S.MaDoanhMuc = DM.MaDoanhMuc
LEFT JOIN CT_PHIEUMUON CT ON CT.MaSach = S.MaSach
LEFT JOIN PHIEUMUON PM ON PM.MaPhieuMuon = CT.MaPhieuMuon
GROUP BY DM.TenDoanhMuc
ORDER BY TongSoSachMuon DESC;

-- 3. Báo cáo sách đang mượn hoặc quá hạn.
SELECT PM.MaPhieuMuon,
       DG.HoTen AS TenDocGia,
       PM.NgayMuon,
       PM.NgayHenTra,
       PM.TrangThai,
       S.TenSach,
       CT.SoLuong
FROM PHIEUMUON PM
JOIN DOCGIA DG ON DG.MaDocGia = PM.MaDocGia
JOIN CT_PHIEUMUON CT ON CT.MaPhieuMuon = PM.MaPhieuMuon
JOIN SACH S ON S.MaSach = CT.MaSach
WHERE PM.TrangThai IN ('DANG_MUON', 'QUA_HAN')
ORDER BY PM.NgayHenTra;

-- 4. Báo cáo tiền phạt theo độc giả.
SELECT DG.MaDocGia,
       DG.HoTen,
       COUNT(VP.MaViPham) AS SoLanViPham,
       NVL(SUM(VP.TienPhat), 0) AS TongTienPhat,
       NVL(SUM(CASE WHEN VP.TrangThai = 'CHUA_THANH_TOAN' THEN VP.TienPhat ELSE 0 END), 0) AS TienPhatChuaThanhToan
FROM DOCGIA DG
LEFT JOIN PHIEUMUON PM ON PM.MaDocGia = DG.MaDocGia
LEFT JOIN VIPHAM VP ON VP.MaPhieuMuon = PM.MaPhieuMuon
GROUP BY DG.MaDocGia, DG.HoTen
ORDER BY TongTienPhat DESC;

-- 5. Top sách được mượn nhiều nhất.
SELECT S.MaSach,
       S.TenSach,
       NVL(SUM(CT.SoLuong), 0) AS TongLuotMuon
FROM SACH S
LEFT JOIN CT_PHIEUMUON CT ON CT.MaSach = S.MaSach
GROUP BY S.MaSach, S.TenSach
ORDER BY TongLuotMuon DESC;
