# Cấu trúc triển khai trong thư mục `Database`

Thư mục `Database` có hai nhóm script:

## 1. Nhóm script chuẩn cho đồ án HQTCSDL

Đây là nhóm nên dùng cho báo cáo và demo chính thức:

- `01_HQTCSDL_Schema.sql`: tạo schema đúng tên bảng của đồ án.
- `02_HQTCSDL_Procedures_Triggers.sql`: tạo sequence, trigger, function và procedure.
- `03_HQTCSDL_Demo_Data.sql`: tạo dữ liệu mẫu.
- `04_HQTCSDL_Concurrency_Demo.sql`: kịch bản T1/T2 cho xử lý đồng thời.
- `05_HQTCSDL_Report_Queries.sql`: truy vấn báo cáo đơn giản và báo cáo có grouping/totals.
- `Concurrency_Scenarios.md`: giải thích các vấn đề Lost Update, Uncommitted Read, Non-repeatable Read, Phantom Read và Deadlock.

## 2. Nhóm script kế thừa từ repo gốc

Các file này được giữ để tham khảo và để frontend/backend cũ vẫn có thể đối chiếu khi cần:

- `Create_Tables.sql`
- `Dummy_Data.sql`
- `Triggers.sql`
- `Running_tri&func.sql`
- `HQTCSDL_Transactions.sql`

## Thứ tự chạy khuyến nghị

Nếu triển khai theo mô hình chuẩn của đồ án, chạy lần lượt:

1. `01_HQTCSDL_Schema.sql`
2. `02_HQTCSDL_Procedures_Triggers.sql`
3. `03_HQTCSDL_Demo_Data.sql`
4. `05_HQTCSDL_Report_Queries.sql` khi cần kiểm tra báo cáo

File `04_HQTCSDL_Concurrency_Demo.sql` nên dùng theo từng đoạn trong hai session Oracle để demo xử lý đồng thời.
