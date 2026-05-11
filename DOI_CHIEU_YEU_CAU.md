# Đối chiếu yêu cầu đồ án HQTCSDL

## 1. Yêu cầu từ đề bài

| Yêu cầu | Cách triển khai trong thư mục này |
|---|---|
| Ứng dụng thực tế hỗ trợ nhiều người dùng | Dùng React + Express + Oracle, có đăng nhập và phân quyền |
| Oracle DBMS | Toàn bộ schema/procedure/trigger đặt trong `Database` |
| Stored procedure và trigger | Giữ và chuẩn hóa các script trong `Database`, bổ sung script `HQTCSDL_Transactions.sql` |
| Giao tác tường minh | Mượn/trả sách được đưa vào procedure có kiểm tra điều kiện, khóa dòng và commit/rollback do backend điều phối |
| Xử lý đồng thời | Có script `Concurrency_Scenarios.md` mô tả Lost Update, Uncommitted Read, Non-repeatable Read, Phantom Read, Deadlock |
| Giao diện | Tái sử dụng frontend của `Jakaria44`, tập trung các màn hình sách, yêu cầu mượn, lịch sử, phạt, thống kê |
| Report | Tận dụng thống kê rent/fine và đề xuất dashboard theo sách đang mượn, quá hạn, top sách, tồn kho, tiền phạt |

## 2. Phạm vi ưu tiên

Ưu tiên cao:

- Quản lý sách/edition/tồn kho.
- Độc giả gửi yêu cầu mượn.
- Thủ thư duyệt yêu cầu mượn.
- Độc giả trả sách.
- Tính phạt quá hạn.
- Báo cáo rent/fine.
- Mô phỏng xử lý đồng thời.

Giảm ưu tiên:

- Review/rating.
- Favourite.
- News/message.
- Job/application.

## 3. Mapping mô hình hiện tại sang mô hình đồ án

| Mô hình hiện tại | Mô hình đồ án tương ứng |
|---|---|
| `USER` | `TAIKHOAN`, `DOCGIA`, `NHANVIEN` |
| `ADMIN`, `EMPLOYEE` | Vai trò quản trị viên/thủ thư |
| `BOOK` | `SACH` |
| `EDITION` | `LOSACH` hoặc bản sao/tồn kho sách |
| `REQUEST` | Yêu cầu mượn/đặt chỗ |
| `RENT_HISTORY` | `PHIEUMUON` và trạng thái trả |
| `FINE_HISTORY` | `VIPHAM`/phạt quá hạn |
| `PUBLISHER` | `NHACUNGCAP` hoặc nhà xuất bản |
| `GENRE` | `DOANHMUC` |
