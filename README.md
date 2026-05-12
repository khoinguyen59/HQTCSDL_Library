# He thong quan ly thu vien - Do an HQTCSDL

Du an trien khai he thong quan ly thu vien truong hoc tren Oracle Database, ho tro nhieu nguoi dung, giao tac an toan, stored procedure, trigger, xu ly dong thoi va bao cao thong ke.

## 1. Muc tieu

- Quan ly tai khoan va phan quyen.
- Quan ly doc gia, nhan vien, danh muc, sach, lo sach va kho sach.
- Lap phieu muon, them sach vao phieu, nhan tra sach.
- Ghi nhan vi pham va tien phat.
- Nhap sach tu nha cung cap va thanh ly sach.
- Bao cao muon-tra, ton kho va tien phat.
- Trinh bay cac van de dong thoi: Lost Update, Uncommitted Read, Non-repeatable Read, Phantom Read, Deadlock.

## 2. Cong nghe

| Thanh phan | Cong nghe |
|---|---|
| Frontend | React, Vite, Material UI |
| Backend | Node.js, Express |
| Database | Oracle Database 21c XE |
| Oracle driver | `oracledb` (thin mode) |

## 3. Cau truc du an

```text
library_oracle_hqtcsdl/
├── BackEnd/
│   ├── controllers/hqtcsdlController.js   # API logic + Oracle error mapping
│   ├── Database/database.js               # Oracle connection pool
│   ├── routes/route.js                    # Express routes
│   └── .env                               # DB credentials (not committed)
├── Database/
│   ├── 01_HQTCSDL_Schema.sql             # Tables, constraints, sequences
│   ├── 02_HQTCSDL_Procedures_Triggers.sql # SP, Functions, Triggers
│   ├── 03_HQTCSDL_Demo_Data.sql          # Sample data
│   ├── 04_HQTCSDL_Concurrency_Demo.sql   # Concurrency test scenarios
│   ├── 05_HQTCSDL_Report_Queries.sql     # Report queries
│   └── 06_HQTCSDL_Quick_Verify.sql       # Quick verification
├── FrontEnd/
│   └── src/pages/HQTCSDL/
│       ├── Actions.jsx                    # Transaction forms (MUI)
│       └── Dashboard.jsx                  # Statistics dashboard
└── README.md
```

## 4. Database Oracle

### Khoi tao

Chay theo thu tu trong SQL*Plus hoac SQL Developer voi user `LIBRARY_ADMIN`:

```sql
@Database/01_HQTCSDL_Schema.sql
@Database/02_HQTCSDL_Procedures_Triggers.sql
@Database/03_HQTCSDL_Demo_Data.sql
@Database/06_HQTCSDL_Quick_Verify.sql
```

### Cac bang chinh

- `TAIKHOAN`, `DOCGIA`, `NHANVIEN`, `DOANHMUC`, `SACH`, `LOSACH`, `KHOSACH`
- `PHIEUMUON`, `CT_PHIEUMUON`, `PHIEUTRA`, `VIPHAM`
- `NHACUNGCAP`, `PHIEUNHAP`, `CT_PHIEUNHAP`, `PHIEUTRANCC`, `THANHLY`

### Stored Procedures

| Procedure | Chuc nang |
|---|---|
| `SP_DANGKY_DOCGIA` | Dang ky doc gia moi |
| `SP_TAO_PHIEU_MUON` | Tao phieu muon (tra ve ma phieu) |
| `SP_THEM_CT_PHIEUMUON` | Them sach vao phieu muon |
| `SP_TRA_SACH` | Nhan tra sach, tinh phat |
| `SP_NHAP_SACH` | Nhap sach tu nha cung cap |
| `SP_THANHLY_SACH` | Thanh ly sach khoi kho |

### Functions

| Function | Chuc nang |
|---|---|
| `FN_SO_SACH_DANG_MUON` | Dem so sach dang muon |
| `FN_SO_LUONG_CON_LAI` | Kiem tra ton kho |
| `FN_KIEM_TRA_THE_HOP_LE` | Xac nhan the doc gia con han |
| `FN_TINH_TIEN_PHAT` | Tinh tien phat qua han |

## 5. Backend API

Base URL: `http://localhost:3000/db-api/hqtcsdl`

| Method | Endpoint | Chuc nang |
|---|---|---|
| GET | `/dashboard` | So lieu tong quan (sach, doc gia, phieu muon, phat) |
| GET | `/books` | Danh sach sach va ton kho |
| GET | `/readers` | Danh sach doc gia |
| POST | `/readers` | Dang ky doc gia moi |
| GET | `/loans` | Danh sach phieu muon |
| POST | `/loans` | Tao phieu muon (tra ve `loanId`) |
| POST | `/loan-items` | Them sach vao phieu muon |
| POST | `/return` | Nhan tra sach |
| POST | `/import-book` | Nhap sach vao kho |
| POST | `/liquidate-book` | Thanh ly sach |

### Xu ly loi

Backend tu dong dich ma loi Oracle thanh thong bao de hieu:

| Ma Oracle | Thong bao |
|---|---|
| `ORA-00001` | Du lieu bi trung lap |
| `ORA-02291` | Ma tham chieu khong ton tai |
| `ORA-02292` | Du lieu dang duoc su dung |
| `ORA-20xxx` | Thong bao tu procedure/trigger |
| Thieu field | Liet ke cac truong can nhap |

## 6. Huong dan chay

### 1. Khoi dong Oracle

Dam bao 2 service dang chay:
- `OracleServiceXE`
- `OracleOraDB21Home1TNSListener`

### 2. Khoi dong Backend

```bash
cd BackEnd
npm install
npm start
```

File `.env` can co:

```env
DATABASE_USER=LIBRARY_ADMIN
DATABASE_PASSWORD=admin
DATABASE_CONNECTION_STRING=localhost:1521/XEPDB1
PORT=3000
```

### 3. Khoi dong Frontend

```bash
cd FrontEnd
npm install
npm run dev
```

Truy cap: `http://127.0.0.1:5173`

### 4. Kiem tra nhanh

```bash
# Backend syntax check
cd BackEnd && npm run check

# Frontend build check
cd FrontEnd && npm run build

# API test
curl http://localhost:3000/db-api/hqtcsdl/dashboard
```

## 7. Giao dien chinh

Trang **Giao dich thu vien** (`/hqtcsdl/actions`) gom 6 tab:

1. **Cap the doc gia** - Dang ky doc gia moi
2. **Nhap sach** - Nhap sach tu nha cung cap
3. **Lap phieu muon** - Tao phieu muon cho doc gia
4. **Them sach vao phieu** - Them sach vao phieu muon da tao
5. **Nhan tra sach** - Thu hoi sach va tinh phat
6. **Thanh ly sach** - Ghi nhan sach loai khoi luu thong

Trang **Dashboard** (`/hqtcsdl/dashboard`) hien thi thong ke tong quan.

## 8. Trang thai

- Oracle: `LIBRARY_ADMIN/admin@localhost:1521/XEPDB1`
- Backend: syntax check PASS
- Frontend: production build PASS
- API GET/POST: da kiem tra thanh cong
- Error handling: Oracle errors duoc dich sang thong bao ro rang
