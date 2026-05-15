import { start, stop, queryExecute } from './Database/database.js';

async function updateName() {
  try {
    await start();
    console.log("Connected to database.");
    
    // Update the HoTen for NV000001
    const result = await queryExecute(
      `UPDATE NHANVIEN SET HoTen = :hoTen WHERE MaNhanVien = 'NV000001'`,
      { hoTen: 'Admin (Thủ thư 01)' },
      { autoCommit: true }
    );
    
    console.log("Updated rows:", result.rowsAffected);
  } catch (err) {
    console.error("Error updating database:", err);
  } finally {
    await stop();
  }
}

updateName();
