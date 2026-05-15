import oracledb from 'oracledb';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const config = {
  user: process.env.DB_USER || 'LIBRARY_ADMIN',
  password: process.env.DB_PASSWORD || 'admin',
  connectString: process.env.DB_CONNECT_STRING || '127.0.0.1:1521/XEPDB1',
};

async function setupAuth() {
  let conn;
  try {
    conn = await oracledb.getConnection(config);
    console.log('Connected to Oracle.');

    // Add MatKhau column if not exists
    try {
      await conn.execute(`ALTER TABLE NHANVIEN ADD MatKhau VARCHAR2(255)`);
      console.log('Added MatKhau column to NHANVIEN.');
    } catch (e) {
      if (e.message.includes('ORA-01430')) {
        console.log('Column MatKhau already exists in NHANVIEN.');
      } else {
        throw e;
      }
    }

    // Add Username column if not exists
    try {
      await conn.execute(`ALTER TABLE NHANVIEN ADD TenDangNhap VARCHAR2(50) UNIQUE`);
      console.log('Added TenDangNhap column to NHANVIEN.');
    } catch (e) {
      if (e.message.includes('ORA-01430')) {
        console.log('Column TenDangNhap already exists in NHANVIEN.');
      } else {
        throw e;
      }
    }

    // Set default admin account
    const hash = await bcrypt.hash('123456', 10);
    // Let's check if NV000001 exists
    const result = await conn.execute(`SELECT MaNhanVien FROM NHANVIEN WHERE MaNhanVien = 'NV000001'`);
    if (result.rows.length > 0) {
      await conn.execute(
        `UPDATE NHANVIEN SET TenDangNhap = :p_user, MatKhau = :p_pass WHERE MaNhanVien = 'NV000001'`,
        { p_user: 'admin', p_pass: hash },
        { autoCommit: true }
      );
      console.log('Updated NV000001 with default username (admin) and password (123456).');
    } else {
      // Create admin if table is empty
      await conn.execute(
        `INSERT INTO NHANVIEN (MaNhanVien, HoTen, TenDangNhap, MatKhau) VALUES ('NV000001', 'Thủ thư 01', :p_user, :p_pass)`,
        { p_user: 'admin', p_pass: hash },
        { autoCommit: true }
      );
      console.log('Inserted NV000001 with default username (admin) and password (123456).');
    }

    console.log('Auth setup complete.');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    if (conn) {
      await conn.close();
    }
  }
}

setupAuth();
