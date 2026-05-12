# COMPREHENSIVE UI SPECIFICATION FOR STITCH
**Project Name:** Oracle Library Management System (Hệ thống Quản lý Thư viện)
**Target Tool:** Stitch MCP / AI UI Generator

---

## 1. DESIGN SYSTEM & AESTHETICS (STRICT REQUIREMENTS)
- **Vibe:** Enterprise SaaS, Minimalist, Clean, Professional.
- **Color Palette:** 
  - Background: `#F9FAFB` (Main App), `#FFFFFF` (Cards/Panels).
  - Text: `#111827` (Headings), `#4B5563` (Body text).
  - Primary Accent: `#2563EB` (Corporate Blue) for primary buttons and active states.
  - Success/Danger: `#059669` (Green for success/connected), `#DC2626` (Red for delete/error).
- **Typography:** 'Inter' or 'Roboto'. Use medium weights for headers, regular for inputs.
- **Borders & Shadows:** 1px solid borders (`#E5E7EB`), soft 4px border-radius. Use subtle drop shadows (`shadow-sm`) only for hovering cards or dropdowns. No gradients, no glassmorphism.

---

## 2. GLOBAL LAYOUT (APP SHELL)
The application uses a persistent Side-Navigation layout.

### 2.1. Left Sidebar (Fixed, 250px width)
- **Top Brand Area:** Minimal text logo "Oracle Library" with a small database icon.
- **Navigation Menu (List of links):**
  - Item 1: Icon (Home) + Text "Trang chủ"
  - Item 2: Icon (PieChart) + Text "Tổng quan"
  - Item 3: Icon (Action/Terminal) + Text "Giao dịch thư viện" (Set this as ACTIVE - with blue background/text).
- **Bottom Area:** A "Logout" (Đăng xuất) button with a generic user avatar "Thủ thư 01".

### 2.2. Top Header (Fixed, 64px height)
- **Left Side:** Page Title dynamically showing "Giao dịch thư viện".
- **Right Side:** 
  - A small green pill badge with text: "🟢 Oracle Connected".
  - A notification bell icon.

---

## 3. PAGE 1: TRANG CHỦ (HOME PAGE)
- **Hero Section:** A simple, clean greeting: "Chào mừng trở lại, Thủ thư 01".
- **Quick Actions (3 Cards side-by-side):**
  - Card 1: "Lập phiếu mượn nhanh" -> Button: "Tạo ngay".
  - Card 2: "Tra cứu độc giả" -> Input search bar + Button "Tìm".
  - Card 3: "Báo cáo cuối ngày" -> Button "Xuất báo cáo".

---

## 4. PAGE 2: TỔNG QUAN (DASHBOARD METRICS)
A dense dashboard displaying database metrics.
- **Top Row (4 Metric Cards):**
  - Card 1: "Tổng số sách" (Total Books) - Value: 34,102.
  - Card 2: "Độc giả đang hoạt động" (Active Readers) - Value: 1,420.
  - Card 3: "Phiếu đang mượn" (Active Loans) - Value: 234.
  - Card 4: "Phiếu quá hạn" (Overdue) - Value: 12 (Text in Red).
- **Bottom Row:** A simple Bar Chart placeholder showing "Lượng sách mượn trong tuần" (Loans this week).

---

## 5. PAGE 3: GIAO DỊCH THƯ VIỆN (CORE OPERATIONS)
This is the most complex page. It uses a **Vertical Tabs Layout**.
- **Left Column (Vertical Tabs list, 20% width):** A vertical list of operation categories.
- **Right Column (Tab Content Area, 80% width):** Displays the form corresponding to the selected tab.

### 5.1. Tab 1: Cấp thẻ độc giả (Register Reader)
- **Title:** "Đăng ký độc giả mới"
- **Form Inputs:**
  - `Tên đăng nhập` (Text input)
  - `Mật khẩu` (Password input)
  - `Họ tên` (Text input)
  - `Giới tính` (Dropdown: Nam, Nữ)
  - `Ngày sinh` (Date picker)
  - `Số điện thoại` (Text input)
  - `Địa chỉ` (Text input)
- **Buttons:** 
  - Primary Button: "Đăng ký thẻ" (Register)
  - Secondary Button: "Xóa trắng" (Clear)

### 5.2. Tab 2: Nhập sách mới (Import Books)
- **Title:** "Nhập sách vào kho"
- **Form Inputs:**
  - `Mã nhà cung cấp` (Text input)
  - `Mã sách (ISBN)` (Text input)
  - `Tên sách` (Text input)
  - `Tác giả` (Text input)
  - `Nhà xuất bản` (Text input)
  - `Năm xuất bản` (Number input)
  - `Danh mục` (Dropdown/Select: Cơ sở dữ liệu, Lập trình, Kinh tế...)
  - `Số lượng nhập` (Number input)
  - `Giá nhập` (Number input)
- **Buttons:**
  - Primary Button: "Nhập kho" (Import)

### 5.3. Tab 3: Lập phiếu mượn (Create Loan Ticket)
- **Title:** "Khởi tạo phiếu mượn sách"
- **Form Inputs:**
  - `Mã tài khoản độc giả` (Text input - Reader ID)
  - `Ngày mượn` (Date picker, default today)
- **Buttons:**
  - Primary Button: "Tạo phiếu mượn" (Create Ticket)
- **Below Form:** A data table titled "Phiếu mượn gần đây" (Recent Tickets) with columns: `Mã phiếu`, `Mã Độc giả`, `Ngày mượn`, `Trạng thái`.

### 5.4. Tab 4: Thêm sách vào phiếu (Add Books to Loan)
- **Title:** "Thêm sách vào phiếu mượn đã tạo"
- **Form Inputs:**
  - `Mã phiếu mượn` (Text input)
  - `Mã sách (ISBN)` (Text input)
- **Buttons:**
  - Primary Button: "Thêm sách" (Add Book)

### 5.5. Tab 5: Nhận trả sách (Return Books)
- **Title:** "Xử lý trả sách"
- **Form Inputs:**
  - `Mã phiếu mượn` (Text input)
  - `Tình trạng sách khi trả` (Dropdown: Bình thường, Hư hỏng, Mất)
- **Buttons:**
  - Primary Button: "Xác nhận trả" (Confirm Return)
  - Danger Button (Red): "Báo mất sách / Phạt" (Report Lost/Fine)

### 5.6. Tab 6: Thanh lý sách (Liquidate Books)
- **Title:** "Thanh lý sách cũ/hỏng"
- **Form Inputs:**
  - `Mã sách (ISBN)` (Text input)
  - `Số lượng thanh lý` (Number input)
  - `Lý do thanh lý` (TextArea)
- **Buttons:**
  - Danger Primary Button (Red): "Thực hiện thanh lý" (Execute Liquidation)

---

## INSTRUCTION FOR STITCH GENERATION:
1. Build the full layout with the Sidebar and Header visible.
2. Render the "Giao dịch thư viện" (Librarian Operations) page as the active view.
3. Show the **Tab 3: Lập phiếu mượn** as the currently active form in the Right Column to demonstrate the form inputs, buttons, and the data table below it.
4. Keep the styling strict, flat, and enterprise-focused using standard Tailwind utility classes. Do not use custom complex CSS. Ensure all Vietnamese labels are placed exactly as specified.
