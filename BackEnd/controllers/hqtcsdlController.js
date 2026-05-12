import OracleDB from 'oracledb';
import { queryExecute } from '../Database/database.js';

function ok(res, data = {}) {
  res.status(200).json(data);
}

function translateOracleError(err) {
  const raw = err?.message || 'Loi he thong khong xac dinh.';
  if (raw.includes('ORA-00001')) {
    return 'Du lieu bi trung lap hoac da ton tai trong he thong. Vui long kiem tra lai ma.';
  }
  if (raw.includes('ORA-02291')) {
    return 'Du lieu tham chieu khong ton tai. Vui long kiem tra lai ma doc gia, nhan vien, sach hoac nha cung cap.';
  }
  if (raw.includes('ORA-02292')) {
    return 'Khong the thao tac vi du lieu dang duoc su dung o noi khac.';
  }
  if (/ORA-20\d{3}/.test(raw)) {
    const match = raw.match(/ORA-20\d{3}:\s*([^\r\n]+)/);
    return match?.[1] || raw;
  }
  return raw;
}

function fail(res, err) {
  console.error(err);
  res.status(500).json({ message: translateOracleError(err) });
}

function required(body, fields) {
  return fields.filter((field) => body[field] === undefined || body[field] === null || body[field] === '');
}

function badRequest(res, fields) {
  res.status(400).json({ message: `Vui long nhap day du cac thong tin: ${fields.join(', ')}` });
}

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : NaN;
}

export async function getDashboard(req, res) {
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
    fail(res, err);
  }
}

export async function listBooks(req, res) {
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
    fail(res, err);
  }
}

export async function listReaders(req, res) {
  try {
    const result = await queryExecute(`
      SELECT MaDocGia, HoTen, Email, SoDienThoai, DiaChi, NgayDangKy, NgayHetHan, TrangThai
      FROM DOCGIA
      ORDER BY HoTen
    `, {});
    ok(res, { rows: result.rows });
  } catch (err) {
    fail(res, err);
  }
}

export async function listLoans(req, res) {
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
    fail(res, err);
  }
}

export async function createReader(req, res) {
  try {
    const missing = required(req.body, ['username', 'password', 'fullName']);
    if (missing.length) return badRequest(res, missing);

    await queryExecute(`
      BEGIN
        SP_DANGKY_DOCGIA(:username, :password, :fullName, :email, :phone, :address, :expiredAt);
      END;
    `, {
      username: req.body.username,
      password: req.body.password,
      fullName: req.body.fullName,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      expiredAt: req.body.expiredAt ? new Date(req.body.expiredAt) : null
    });
    ok(res, { message: 'Dang ky doc gia thanh cong' });
  } catch (err) {
    fail(res, err);
  }
}

export async function createLoan(req, res) {
  try {
    const missing = required(req.body, ['readerId', 'employeeId', 'dueDate']);
    if (missing.length) return badRequest(res, missing);

    const result = await queryExecute(`
      BEGIN
        SP_TAO_PHIEU_MUON(:readerId, :employeeId, :dueDate, :loanId);
      END;
    `, {
      readerId: req.body.readerId,
      employeeId: req.body.employeeId,
      dueDate: new Date(req.body.dueDate),
      loanId: { dir: OracleDB.BIND_OUT, type: OracleDB.STRING, maxSize: 20 }
    });
    ok(res, { message: 'Tao phieu muon thanh cong', loanId: result.outBinds.loanId });
  } catch (err) {
    fail(res, err);
  }
}

export async function addLoanItem(req, res) {
  try {
    const missing = required(req.body, ['loanId', 'bookId']);
    if (missing.length) return badRequest(res, missing);
    const quantity = toNumber(req.body.quantity || 1);
    if (!Number.isFinite(quantity) || quantity <= 0) return badRequest(res, ['quantity']);

    await queryExecute(`
      BEGIN
        SP_THEM_CT_PHIEUMUON(:loanId, :bookId, :quantity);
      END;
    `, { loanId: req.body.loanId, bookId: req.body.bookId, quantity });
    ok(res, { message: 'Them sach vao phieu muon thanh cong' });
  } catch (err) {
    fail(res, err);
  }
}

export async function returnLoan(req, res) {
  try {
    const missing = required(req.body, ['loanId', 'employeeId']);
    if (missing.length) return badRequest(res, missing);

    await queryExecute(`
      BEGIN
        SP_TRA_SACH(:loanId, :employeeId);
      END;
    `, { loanId: req.body.loanId, employeeId: req.body.employeeId });
    ok(res, { message: 'Tra sach thanh cong' });
  } catch (err) {
    fail(res, err);
  }
}

export async function importBook(req, res) {
  try {
    const missing = required(req.body, ['supplierId', 'employeeId', 'bookId', 'quantity', 'price']);
    if (missing.length) return badRequest(res, missing);
    const quantity = toNumber(req.body.quantity);
    const price = toNumber(req.body.price);
    if (!Number.isFinite(quantity) || quantity <= 0) return badRequest(res, ['quantity']);
    if (!Number.isFinite(price) || price < 0) return badRequest(res, ['price']);

    await queryExecute(`
      BEGIN
        SP_NHAP_SACH(:supplierId, :employeeId, :bookId, :quantity, :price);
      END;
    `, { supplierId: req.body.supplierId, employeeId: req.body.employeeId, bookId: req.body.bookId, quantity, price });
    ok(res, { message: 'Nhap sach thanh cong' });
  } catch (err) {
    fail(res, err);
  }
}

export async function liquidateBook(req, res) {
  try {
    const missing = required(req.body, ['bookId', 'employeeId', 'quantity']);
    if (missing.length) return badRequest(res, missing);
    const quantity = toNumber(req.body.quantity);
    if (!Number.isFinite(quantity) || quantity <= 0) return badRequest(res, ['quantity']);

    await queryExecute(`
      BEGIN
        SP_THANHLY_SACH(:bookId, :employeeId, :quantity, :reason);
      END;
    `, { bookId: req.body.bookId, employeeId: req.body.employeeId, quantity, reason: req.body.reason });
    ok(res, { message: 'Thanh ly sach thanh cong' });
  } catch (err) {
    fail(res, err);
  }
}
