# He thong quan ly thu vien - Do an HQTCSDL

Du an trien khai he thong quan ly thu vien truong hoc tren Oracle, ho tro nhieu nguoi dung, giao tac an toan, stored procedure, trigger, xu ly dong thoi va bao cao thong ke.

Khong sua truc tiep file bao cao goc `ĐỒ_ÁN_HQTCSDL.txt`. Moi phan bo sung duoc ghi trong README hoac cac tai lieu phu cua du an.

## 1. Muc tieu

- Quan ly tai khoan va phan quyen.
- Quan ly doc gia, nhan vien, danh muc, sach, lo sach va kho sach.
- Lap phieu muon, them sach vao phieu, nhan tra sach.
- Ghi nhan vi pham va tien phat.
- Nhap sach tu nha cung cap va thanh ly sach.
- Bao cao muon-tra, ton kho va tien phat.
- Trinh bay cac van de dong thoi: Lost Update, Uncommitted Read, Non-repeatable Read, Phantom Read, Deadlock.

## 2. Cong nghe

- Frontend: React, Vite, Material UI.
- Backend: Node.js, Express.
- Database: Oracle XE.
- Oracle driver: `oracledb`.
- Desktop staff console: Edge app mode mo rieng phan he thu thu/quan ly.

## 3. Cau truc chinh

```text
library_oracle_hqtcsdl/
├── BackEnd/
│   ├── controllers/hqtcsdlController.js
│   ├── Database/database.js
│   └── routes/route.js
├── Database/
│   ├── 01_HQTCSDL_Schema.sql
│   ├── 02_HQTCSDL_Procedures_Triggers.sql
│   ├── 03_HQTCSDL_Demo_Data.sql
│   ├── 04_HQTCSDL_Concurrency_Demo.sql
│   ├── 05_HQTCSDL_Report_Queries.sql
│   ├── 06_HQTCSDL_Quick_Verify.sql
│   ├── CHUONG3_MA_PL_SQL_BO_SUNG.md
│   ├── Concurrency_Scenarios.md
│   ├── _legacy/
│   └── README_HQTCSDL.md
├── FrontEnd/
├── RUN_DEMO.md
├── BAO_CAO_HOAN_THIEN_DU_AN.md
└── README.md
```

## 4. Database Oracle

Chay theo thu tu:

```sql
@Database/01_HQTCSDL_Schema.sql
@Database/02_HQTCSDL_Procedures_Triggers.sql
@Database/03_HQTCSDL_Demo_Data.sql
@Database/06_HQTCSDL_Quick_Verify.sql
```

Cac bang chinh:

- `TAIKHOAN`, `DOCGIA`, `NHANVIEN`, `DOANHMUC`, `SACH`, `LOSACH`, `KHOSACH`
- `PHIEUMUON`, `CT_PHIEUMUON`, `PHIEUTRA`, `VIPHAM`
- `NHACUNGCAP`, `PHIEUNHAP`, `CT_PHIEUNHAP`, `PHIEUTRANCC`, `THANHLY`

Procedure chinh:

- `SP_DANGKY_DOCGIA`
- `SP_TAO_PHIEU_MUON`
- `SP_THEM_CT_PHIEUMUON`
- `SP_TRA_SACH`
- `SP_NHAP_SACH`
- `SP_THANHLY_SACH`

Function chinh:

- `FN_SO_SACH_DANG_MUON`
- `FN_SO_LUONG_CON_LAI`
- `FN_KIEM_TRA_THE_HOP_LE`
- `FN_TINH_TIEN_PHAT`

## 5. Backend API

Base URL:

```text
http://localhost:3000/db-api/hqtcsdl
```

| Method | Endpoint | Muc dich |
|---|---|---|
| GET | `/dashboard` | Lay so lieu tong quan |
| GET | `/books` | Danh sach sach va ton kho |
| GET | `/readers` | Danh sach doc gia |
| POST | `/readers` | Dang ky doc gia |
| GET | `/loans` | Danh sach phieu muon |
| POST | `/loans` | Tao phieu muon |
| POST | `/loan-items` | Them sach vao phieu muon |
| POST | `/return` | Tra sach |
| POST | `/import-book` | Nhap sach vao kho |
| POST | `/liquidate-book` | Thanh ly sach khoi kho |

## 6. Chay he thong

### Backend

```bash
cd BackEnd
npm install
npm start
```

File `BackEnd/.env`:

```env
DATABASE_USER=LIBRARY_ADMIN
DATABASE_PASSWORD=admin
DATABASE_CONNECTION_STRING=localhost:1521/XEPDB1
PORT=3000
```

### Web OPAC / Reader UI

```bash
cd FrontEnd
npm install
npm run dev
```

Mo:

```text
http://127.0.0.1:5173/index.html
```

### Desktop staff console

Khi Vite dang chay:

```bash
cd FrontEnd
npm run desktop:open
```

Phan he thu thu/quan ly se mo trong cua so ung dung rieng tai `/hqtcsdl/actions`.

## 7. Kiem tra

Backend:

```bash
cd BackEnd
npm run check
```

Frontend:

```bash
cd FrontEnd
npm run check
```

API tong quan:

```text
http://localhost:3000/db-api/hqtcsdl/dashboard
```

## 8. Tai lieu lien quan

- `RUN_DEMO.md`: huong dan chay nhanh.
- `BAO_CAO_HOAN_THIEN_DU_AN.md`: bao cao hoan thien va ket qua kiem chung.
- `HUONG_DAN_DEMO.md`: kich ban trinh bay va van hanh.
- `DOI_CHIEU_YEU_CAU.md`: doi chieu yeu cau voi trien khai.
- `BackEnd/API_HQTCSDL.md`: tai lieu API.
- `Database/README_HQTCSDL.md`: huong dan database.
- `Database/Concurrency_Scenarios.md`: mo ta cac kich ban dong thoi.

## 9. Trang thai hien tai

- Oracle da duoc cau hinh voi user `LIBRARY_ADMIN/admin@localhost:1521/XEPDB1`.
- Database scripts da chay va verify thanh cong.
- Backend API da test voi Oracle.
- Frontend build thanh cong.
- Desktop staff console mo duoc bang Edge app mode.
- File bao cao goc khong bi sua truc tiep.
