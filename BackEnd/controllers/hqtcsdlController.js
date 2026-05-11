import OracleDB from 'oracledb';
import { queryExecute } from '../Database/database.js';

function ok(res, data = {}) {
  res.status(200).json(data);
}

function fail(next, err) {
  next(err);
}

export async function getDashboard(req, res, next) {
  try {
    const queries = {
      totalBooks: 'SELECT COUNT(*) AS VALUE FROM SACH',
      totalReaders: 'SELECT COUNT(*) AS VALUE FROM DOCGIA',
      activeLoans: "SELECT COUNT(*) AS VALUE FROM PHIEUMUON WHERE TrangThai IN ('DANG_MUON', 'QUA_HAN')",
      overdueLoans: "SELECT COUNT(*) AS VALUE FROM PHIEUMUON WHERE TrangThai = 'QUA_HAN' OR (TrangThai = 'DANG_MUON' AND NgayHenTra < TRUNC(SYSDATE))",
      unpaidFines: "SELECT NVL(SUM(TienPhat), 0) AS VALUE FROM VIPHAM WHERE TrangThai = 'CHUA_THANH_TOAN'"
    };

    const result = {};
    for (const [key, sql] of Object.entries(queries)) {
      const data = await queryExecute(sql, {});
      result[key] = data.rows[0]?.VALUE ?? 0;
    }

    ok(res, result);
  } catch (err) {
    fail(next, err);
  }
}

export async function listBooks(req, res, next) {
  try {
    const result = await queryExecute(`
      SELECT S.MaSach, S.ISBN, S.TenSach, S.TacGia, S.NhaXuatBan, S.NamXuatBan,
             DM.TenDoanhMuc, NVL(KS.SoLuongTong, 0) AS SoLuongTong,
             NVL(KS.SoLuongCon, 0) AS SoLuongCon, NVL(KS.SoLuongHong, 0) AS SoLuongHong
      FROM SACH S
      LEFT JOIN DOANHMUC DM ON DM.MaDoanhMuc = S.MaDoanhMuc
      LEFT JOIN KHOSACH KS ON KS.MaSach = S.MaSach
      ORDER BY S.TenSach
    `, {});
    ok(res, { rows: result.rows });
  } catch (err) {
    fail(next, err);
  }
}

export async function listReaders(req, res, next) {
  try {
    const result = await queryExecute(`
      SELECT MaDocGia, HoTen, Email, SoDienThoai, DiaChi, NgayDangKy, NgayHetHan, TrangThai
      FROM DOCGIA
      ORDER BY HoTen
    `, {});
    ok(res, { rows: result.rows });
  } catch (err) {
    fail(next, err);
  }
}

export async function listLoans(req, res, next) {
  try {
    const result = await queryExecute(`
      SELECT PM.MaPhieuMuon, DG.HoTen AS TenDocGia, NV.HoTen AS TenNhanVien,
             PM.NgayMuon, PM.NgayHenTra, PM.TrangThai,
             LISTAGG(S.TenSach || ' x' || CT.SoLuong, '; ') WITHIN GROUP (ORDER BY S.TenSach) AS DanhSachSach
      FROM PHIEUMUON PM
      JOIN DOCGIA DG ON DG.MaDocGia = PM.MaDocGia
      JOIN NHANVIEN NV ON NV.MaNhanVien = PM.MaNhanVien
      LEFT JOIN CT_PHIEUMUON CT ON CT.MaPhieuMuon = PM.MaPhieuMuon
      LEFT JOIN SACH S ON S.MaSach = CT.MaSach
      GROUP BY PM.MaPhieuMuon, DG.HoTen, NV.HoTen, PM.NgayMuon, PM.NgayHenTra, PM.TrangThai
      ORDER BY PM.NgayMuon DESC
    `, {});
    ok(res, { rows: result.rows });
  } catch (err) {
    fail(next, err);
  }
}

export async function createReader(req, res, next) {
  try {
    const binds = {
      username: req.body.username,
      password: req.body.password,
      fullName: req.body.fullName,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      expiredAt: req.body.expiredAt ? new Date(req.body.expiredAt) : null
    };
    await queryExecute(`
      BEGIN
        SP_DANGKY_DOCGIA(:username, :password, :fullName, :email, :phone, :address, :expiredAt);
      END;
    `, binds);
    ok(res, { message: 'Dang ky doc gia thanh cong' });
  } catch (err) {
    fail(next, err);
  }
}

export async function createLoan(req, res, next) {
  try {
    const binds = {
      readerId: req.body.readerId,
      employeeId: req.body.employeeId,
      dueDate: new Date(req.body.dueDate),
      loanId: { dir: OracleDB.BIND_OUT, type: OracleDB.STRING, maxSize: 20 }
    };
    const result = await queryExecute(`
      BEGIN
        SP_TAO_PHIEU_MUON(:readerId, :employeeId, :dueDate, :loanId);
      END;
    `, binds);
    ok(res, { message: 'Tao phieu muon thanh cong', loanId: result.outBinds.loanId });
  } catch (err) {
    fail(next, err);
  }
}

export async function addLoanItem(req, res, next) {
  try {
    const binds = {
      loanId: req.body.loanId,
      bookId: req.body.bookId,
      quantity: Number(req.body.quantity || 1)
    };
    await queryExecute(`
      BEGIN
        SP_THEM_CT_PHIEUMUON(:loanId, :bookId, :quantity);
      END;
    `, binds);
    ok(res, { message: 'Them sach vao phieu muon thanh cong' });
  } catch (err) {
    fail(next, err);
  }
}

export async function returnLoan(req, res, next) {
  try {
    const binds = {
      loanId: req.body.loanId,
      employeeId: req.body.employeeId
    };
    await queryExecute(`
      BEGIN
        SP_TRA_SACH(:loanId, :employeeId);
      END;
    `, binds);
    ok(res, { message: 'Tra sach thanh cong' });
  } catch (err) {
    fail(next, err);
  }
}

export async function importBook(req, res, next) {
  try {
    const binds = {
      supplierId: req.body.supplierId,
      employeeId: req.body.employeeId,
      bookId: req.body.bookId,
      quantity: Number(req.body.quantity),
      price: Number(req.body.price)
    };
    await queryExecute(`
      BEGIN
        SP_NHAP_SACH(:supplierId, :employeeId, :bookId, :quantity, :price);
      END;
    `, binds);
    ok(res, { message: 'Nhap sach thanh cong' });
  } catch (err) {
    fail(next, err);
  }
}


export async function liquidateBook(req, res, next) {
  try {
    const binds = {
      bookId: req.body.bookId,
      employeeId: req.body.employeeId,
      quantity: Number(req.body.quantity),
      reason: req.body.reason
    };
    await queryExecute(`
      BEGIN
        SP_THANHLY_SACH(:bookId, :employeeId, :quantity, :reason);
      END;
    `, binds);
    ok(res, { message: 'Thanh ly sach thanh cong' });
  } catch (err) {
    fail(next, err);
  }
}
