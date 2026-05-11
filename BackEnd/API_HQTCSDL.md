# API mới theo schema HQTCSDL

Base URL:

```text
http://localhost:3000/db-api/hqtcsdl
```

## 1. Dashboard

```http
GET /dashboard
```

Trả về số liệu tổng quan:

- `totalBooks`
- `totalReaders`
- `activeLoans`
- `overdueLoans`
- `unpaidFines`

## 2. Danh sách sách

```http
GET /books
```

Trả về danh sách sách kèm tồn kho.

## 3. Danh sách độc giả

```http
GET /readers
```

## 4. Đăng ký độc giả

```http
POST /readers
Content-Type: application/x-www-form-urlencoded

username=docgia03&password=dg123&fullName=Nguyen Van D&email=docgia03@student.edu.vn&phone=0911000003&address=TP.HCM&expiredAt=2027-12-31
```

## 5. Danh sách phiếu mượn

```http
GET /loans
```

## 6. Tạo phiếu mượn

```http
POST /loans
Content-Type: application/x-www-form-urlencoded

readerId=DG000001&employeeId=NV000001&dueDate=2026-06-01
```

## 7. Thêm sách vào phiếu mượn

```http
POST /loan-items
Content-Type: application/x-www-form-urlencoded

loanId=PM000002&bookId=S000001&quantity=1
```

## 8. Trả sách

```http
POST /return
Content-Type: application/x-www-form-urlencoded

loanId=PM000001&employeeId=NV000001
```

## 9. Nhập sách

```http
POST /import-book
Content-Type: application/x-www-form-urlencoded

supplierId=NCC000001&employeeId=NV000001&bookId=S000001&quantity=5&price=85000
```

## 10. Thanh ly sach

```http
POST /liquidate-book
Content-Type: application/x-www-form-urlencoded

bookId=S000001&employeeId=NV000001&quantity=1&reason=Sach cu, it su dung
```

API nay goi `SP_THANHLY_SACH`, khoa dong ton kho bang `SELECT ... FOR UPDATE`, kiem tra so luong kha dung roi ghi nhan vao bang `THANHLY`.
