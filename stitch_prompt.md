---
page: library-management-dashboard
---

**PROJECT OVERVIEW:**
This is an Enterprise Library Management System (Hệ thống Quản lý Thư viện) built on Oracle Database. The target users are Librarians and Library Administrators.

**DESIGN SYSTEM (REQUIRED STYLE):**
- **Aesthetic:** Minimalist, Enterprise-grade, clean, and highly professional. DO NOT use flashy colors, heavy gradients, or excessive glassmorphism.
- **Color Palette:** 
  - Background: Very light gray (`#F9FAFB`) or pure white (`#FFFFFF`).
  - Text: Dark slate (`#111827`) for primary text, cool gray (`#6B7280`) for secondary text.
  - Accents: Subtle corporate blue (`#2563EB`) or deep indigo (`#4F46E5`) for active states and primary buttons only.
- **Typography:** Inter or Roboto. Clean, highly legible, hierarchical.
- **Shapes:** Sharp or slightly rounded corners (e.g., `4px` or `8px` border-radius). Flat design with very subtle drop shadows only on floating elements.
- **Layout:** Dense but breathable information architecture, suited for complex data entry and data tables.

**PAGE STRUCTURE & FEATURES:**

**1. Global Layout (App Shell)**
- **Left Sidebar:**
  - Logo/Branding: "Oracle Library" (Minimalist text logo).
  - Navigation Menu (Vietnamese exactly as follows):
    - "Trang chủ" (Home)
    - "Tổng quan" (Dashboard/Overview)
    - "Giao dịch thư viện" (Librarian Operations) - **Active state**.
- **Top Header:**
  - Page Title: "Giao dịch thư viện"
  - Status Badge: A small, professional pill indicating "Oracle Database: Connected".
  - User Profile: Avatar and name "Thủ thư 01" with a dropdown caret.

**2. Main Content Area (Giao dịch thư viện)**
- The layout should feature a **Vertical Tabs** component on the left side of the main content area (next to the sidebar) to switch between different operational forms. 
- **Tab Items:**
  - "Cấp thẻ độc giả" (Register Reader)
  - "Nhập sách mới" (Import Books)
  - "Lập phiếu mượn" (Create Loan Ticket)
  - "Thêm sách vào phiếu" (Add Books to Loan)
  - "Nhận trả sách" (Return Books)
  - "Thanh lý sách" (Liquidate Books)

**3. Active Tab Content ("Lập phiếu mượn" - Create Loan Ticket)**
- Display a clean, professional form with the following fields:
  - Form Title: "Lập phiếu mượn sách"
  - Input Field: "Mã tài khoản độc giả" (Reader ID) - Placeholder: "Nhập ID độc giả..."
  - Date Picker: "Ngày lập phiếu" (Date Created) - Default to today.
  - Select/Dropdown: "Trạng thái phiếu" (Status) - Options: Đang mượn (Borrowing), Đã trả (Returned).
- **Action Buttons:**
  - Primary Button: "Tạo phiếu mượn" (Create Ticket) - Solid accent color.
  - Secondary Button: "Hủy" (Cancel) - Ghost/Outline style.
- **Data Table (Recent Loans Preview):**
  - Below the form, show a minimalist table of recently created loans.
  - Columns: Mã phiếu (Ticket ID), Độc giả (Reader), Ngày mượn (Borrow Date), Trạng thái (Status).

**INSTRUCTIONS FOR STITCH:**
Generate a clean, responsive React layout using Tailwind CSS. Focus strictly on proper alignment, enterprise spacing, and professional muted color palettes. Ensure all Vietnamese text is rendered correctly with proper diacritics.
