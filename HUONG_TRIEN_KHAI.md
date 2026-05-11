# Kế hoạch triển khai ứng dụng theo đồ án HQTCSDL

Thư mục này là bản triển khai riêng được tạo từ `repos/Jakaria44` để phát triển thành ứng dụng đúng theo `ĐỒ_ÁN_HQTCSDL.txt`, `Yêu cầu.txt`, `Yeu_cau_Do_an_mon_hoc.txt` và phân tích trong `phan_tich_chon_repo_va_huong_lam.md`.

## Định hướng chính

Ứng dụng được phát triển theo hướng: **Hệ thống quản lý thư viện trường học trên Oracle, tập trung vào mượn-trả sách, tồn kho bản sao, đặt mượn, phạt quá hạn, báo cáo và xử lý đồng thời**.

## Nguyên tắc triển khai

- Giữ khung kỹ thuật tốt nhất từ `Jakaria44`: React frontend, Node.js/Express backend, Oracle database.
- Ưu tiên nghiệp vụ cốt lõi của đồ án: độc giả, thủ thư, quản trị viên, sách, kho, yêu cầu mượn, phiếu mượn, phiếu trả, phạt.
- Đưa nghiệp vụ quan trọng xuống Oracle bằng stored procedure, function và trigger.
- Các nghiệp vụ có tranh chấp dữ liệu phải có transaction, lock và isolation level rõ ràng.
- Các module phụ như review, favourite, news, job/application chỉ giữ nếu không làm loãng trọng tâm.

## Việc đã thực hiện

- Tạo thư mục riêng: `library_oracle_hqtcsdl`.
- Sao chép base project từ `repos/Jakaria44`.
- Rà soát cấu trúc frontend/backend/database.
- Xác định phần cần ưu tiên chỉnh đầu tiên: database transaction cho mượn-trả và tồn kho.

## Các bước tiếp theo

1. Chuẩn hóa tài liệu database theo mô hình đồ án.
2. Chỉnh procedure mượn/trả để dùng khóa dòng và transaction an toàn.
3. Bổ sung script minh họa các tình huống đồng thời T1/T2.
4. Chỉnh backend để gọi procedure an toàn hơn.
5. Cập nhật README triển khai và dữ liệu demo.
