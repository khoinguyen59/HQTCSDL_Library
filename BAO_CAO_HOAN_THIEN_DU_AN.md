# Bao cao hoan thien du an HQTCSDL

## 1. Muc tieu da xu ly

- Bam theo file goc `DO_AN_HQTCSDL`/`ĐỒ_ÁN_HQTCSDL.txt`: he thong quan ly thu vien dung Oracle, co giao tac, stored procedure, trigger, xu ly dong thoi va ung dung minh hoa.
- Khop lai diem lech ve giao dien: web dung cho doc gia/OPAC, desktop staff console dung cho thu thu/quan ly.
- Khong sua file bao cao goc `ĐỒ_ÁN_HQTCSDL.txt`; cac ghi chu bo sung nam trong README va cac file md rieng.

## 2. Database Oracle

Da bat va cau hinh Oracle XE:

- `OracleServiceXE`: Running.
- `OracleOraDB21Home1TNSListener`: Running.
- PDB `XEPDB1`: READ WRITE.
- User Oracle: `LIBRARY_ADMIN/admin@localhost:1521/XEPDB1`.

Da tao user `LIBRARY_ADMIN` va cap quyen:

- `CONNECT`
- `RESOURCE`
- `CREATE VIEW`
- `CREATE SEQUENCE`
- `CREATE TRIGGER`
- `CREATE PROCEDURE`

Da chay thanh cong cac script:

- `Database/01_HQTCSDL_Schema.sql`
- `Database/02_HQTCSDL_Procedures_Triggers.sql`
- `Database/03_HQTCSDL_Demo_Data.sql`
- `Database/06_HQTCSDL_Quick_Verify.sql`

Ket qua verify sau khi reset data:

- `TAIKHOAN=5`
- `DOCGIA=2`
- `NHANVIEN=2`
- `SACH=3`
- `KHOSACH=3`
- `PHIEUMUON=1`

## 3. Sua loi database/procedure

- Sua `SP_TRA_SACH` de cong lai ton kho truoc khi cap nhat chi tiet phieu muon sang `DA_TRA`, tranh loi khong cong kho.
- Them/giu `SP_THANHLY_SACH` cho nghiep vu thanh ly sach.
- Sua `SP_NHAP_SACH` de khong dung `SELECT COUNT(*) ... FOR UPDATE` sai ngu nghia khoa dong trong Oracle.
- Sua `Database/03_HQTCSDL_Demo_Data.sql` de khong truyen subquery truc tiep vao tham so procedure trong PL/SQL.
- Tao `Database/06_HQTCSDL_Quick_Verify.sql` de kiem tra nhanh du lieu sau khi chay script.

## 4. Backend

Backend da cai dependency bang `npm ci` va dang chay tai:

```text
http://localhost:3000
```

Da them/cap nhat API HQTCSDL:

- `GET /db-api/hqtcsdl/dashboard`
- `GET /db-api/hqtcsdl/books`
- `GET /db-api/hqtcsdl/readers`
- `POST /db-api/hqtcsdl/readers`
- `GET /db-api/hqtcsdl/loans`
- `POST /db-api/hqtcsdl/loans`
- `POST /db-api/hqtcsdl/loan-items`
- `POST /db-api/hqtcsdl/return`
- `POST /db-api/hqtcsdl/import-book`
- `POST /db-api/hqtcsdl/liquidate-book`

Da bo sung validate input o controller:

- Dang ky doc gia can `username`, `password`, `fullName`.
- Tao phieu muon can `readerId`, `employeeId`, `dueDate`.
- Them sach can `loanId`, `bookId`, `quantity > 0`.
- Tra sach can `loanId`, `employeeId`.
- Nhap sach can `supplierId`, `employeeId`, `bookId`, `quantity > 0`, `price >= 0`.
- Thanh ly can `bookId`, `employeeId`, `quantity > 0`.

Da kiem tra:

```powershell
npm run check
```

Ket qua: pass.

Da test API thuc te voi Oracle:

- Dashboard: OK, tra `totalBooks`, `totalReaders`, `activeLoans`, `overdueLoans`, `unpaidFines`.
- Dang ky doc gia: OK.
- Tao phieu muon: OK.
- Them sach vao phieu muon: OK.
- Tra sach: OK.
- Nhap sach: OK.
- Thanh ly sach: OK.

Sau khi test API, da reset database ve du lieu khoi tao sach.

## 5. Frontend web

Frontend da cai dependency va build thanh cong:

```powershell
npm run build
```

Ket qua: pass.

Frontend dang chay bang Vite tai:

```text
http://127.0.0.1:5173/index.html
```

Cac route chinh:

- `/` hoac `/index.html`: trang gioi thieu/web OPAC.
- `/hqtcsdl`: dashboard HQTCSDL.
- `/hqtcsdl/actions`: phan he nghiep vu thu thu.

Da sua khop output backend/frontend:

- Dashboard dung dung alias `TENDOANHMUC` tu API books.
- Actions co du form: dang ky doc gia, tao phieu muon, them sach, tra sach, nhap sach, thanh ly sach.

## 6. Desktop staff console

De khop voi bao cao goc mo ta phan he thu thu/quan ly la Desktop Application, da them script desktop app mode trong `FrontEnd/package.json`:

- `npm run desktop`: chay Vite va mo staff console bang Edge app mode.
- `npm run desktop:open`: mo staff console khi Vite da chay.
- `npm run desktop:chrome`: tuy chon mo bang Chrome app mode.

Desktop staff console mo truc tiep:

```text
http://127.0.0.1:5173/hqtcsdl/actions
```

Da test lenh:

```powershell
npm run desktop:open
```

Ket qua: Edge app mode mo thanh cong, co process `msedge` moi.

Ghi chu: desktop staff console duoc mo bang Edge app mode de dam bao chay on-site on dinh, tach thanh cua so app rieng cho phan he thu thu/quan ly.

## 7. Tai lieu da cap nhat/them

- `README.md`: cap nhat trang thai, API, procedure, canh bao khong sua file goc.
- `RUN_DEMO.md`: huong dan chay Oracle, backend, web, desktop staff console.
- `HUONG_DAN_DEMO.md`: cap nhat script demo va ghi chu kiem chung.
- `BackEnd/API_HQTCSDL.md`: bo sung endpoint thanh ly sach.
- `Database/README_HQTCSDL.md`: bo sung script verify.
- `Database/Concurrency_Scenarios.md`: chuan hoa theo schema hien tai.
- `Database/CHUONG3_MA_PL_SQL_BO_SUNG.md`: ma PL/SQL bo sung cho bao cao, khong sua file goc.
- `BAO_CAO_HOAN_THIEN_DU_AN.md`: file bao cao nay.

## 8. Cach chay nhanh

1. Bat Oracle neu chua chay:

```powershell
Start-Service OracleServiceXE
Start-Service OracleOraDB21Home1TNSListener
```

2. Chay backend:

```powershell
cd C:\Users\Nguyen Trong Khoi\Downloads\HQTSCDL_DA\library_oracle_hqtcsdl\BackEnd
npm start
```

3. Chay frontend:

```powershell
cd C:\Users\Nguyen Trong Khoi\Downloads\HQTSCDL_DA\library_oracle_hqtcsdl\FrontEnd
npm run dev
```

4. Mo web doc gia/OPAC:

```text
http://127.0.0.1:5173/index.html
```

5. Mo desktop staff console:

```powershell
cd C:\Users\Nguyen Trong Khoi\Downloads\HQTSCDL_DA\library_oracle_hqtcsdl\FrontEnd
npm run desktop:open
```

6. Test API dashboard:

```text
http://localhost:3000/db-api/hqtcsdl/dashboard
```

## 9. Trang thai cuoi

- Oracle: da chay va verify OK.
- Database scripts: chay OK.
- Backend: chay OK, API test OK.
- Frontend web: build OK, dev server OK.
- Desktop staff console: mo OK bang Edge app mode.
- Bao cao goc: khong bi sua truc tiep.
- Du an hien da san sang trinh bay theo huong: Web OPAC cho doc gia + Desktop staff console cho thu thu/quan ly + Oracle transaction/concurrency scripts.


## 10. Cap nhat sau recheck1

- S1: Da sua Actions UI, bo chu demo va bo thong tin API/script khoi giao dien.
- S2: Da viet lai `HUONG_DAN_DEMO.md`, khong con mojibake o muc kiem chung.
- S3: `FrontEnd/dist` khong nam trong git tracked files.
- M1: Da refactor `BackEnd/Database/database.js`, bo anti-pattern `new Promise(async ...)`.
- M3/M4: Da sua Home va Header de khong lo noi dung copy/ky thuat.
- M5: README da co endpoint `liquidate-book`.
- M6: Da chuyen cac file SQL cu vao `Database/_legacy/`.
- L2: Da thong nhat Actions gui JSON dung voi `httpCommonParam.js`.
- L3: Da sua log sai bien trong `BackEnd/index.js`.
- Kiem tra lai: `npm run check` frontend pass, `npm run check` backend pass.
