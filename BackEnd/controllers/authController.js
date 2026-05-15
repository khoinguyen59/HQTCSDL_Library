import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { queryExecute } from '../Database/database.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-for-library-system';

export async function login(req, res) {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập Tên đăng nhập và Mật khẩu.' });
    }

    const sql = `SELECT MaNhanVien, HoTen, MatKhau FROM NHANVIEN WHERE TenDangNhap = :username`;
    const result = await queryExecute(sql, { username });

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Tên đăng nhập không tồn tại.' });
    }

    const user = result.rows[0];

    const match = await bcrypt.compare(password, user.MATKHAU);
    if (!match) {
      return res.status(401).json({ message: 'Mật khẩu không chính xác.' });
    }

    // Generate token
    const token = jwt.sign(
      { 
        employeeId: user.MANHANVIEN, 
        fullName: user.HOTEN,
        username: username 
      },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    return res.status(200).json({
      message: 'Đăng nhập thành công',
      token,
      user: {
        employeeId: user.MANHANVIEN,
        fullName: user.HOTEN
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Lỗi hệ thống khi đăng nhập.' });
  }
}
