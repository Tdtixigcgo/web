# LuxCatalog - Next.js + Tailwind + TypeScript + Supabase

Website trưng bày sản phẩm hiện đại, responsive, có admin dashboard ẩn tại `/ad` với cơ chế duyệt thiết bị theo yêu cầu.

## 1) Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (Database + Auth + Storage)
- Resend (gửi email thông báo yêu cầu duyệt thiết bị)
- Sonner (toast)

## 2) Cấu trúc thư mục

```bash
app/
  (public)/                # giao diện public catalog
  ad/                      # admin entry + dashboard
  api/                     # server routes (CRUD, device approval, email)
components/
  public/
  admin/
  ui/
lib/
services/
supabase/
middleware.ts
db/
  schema.sql
  seed.sql
```

## 3) Biến môi trường

Copy `.env.example` -> `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
ADMIN_APPROVAL_EMAIL=thangnebg91@gmail.com
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 4) Setup Supabase

1. Tạo project Supabase mới.
2. Vào SQL Editor, chạy `db/schema.sql`.
3. Chạy tiếp `db/seed.sql` để tạo data mẫu.
4. Trong Storage, xác nhận bucket `product-images` đã có.
5. Trong Authentication, tạo user admin để đăng nhập `/ad`.

## 5) Chạy local

```bash
npm install
npm run dev
```

Truy cập:
- Public site: `http://localhost:3000`
- Admin hidden path: `http://localhost:3000/ad`

## 6) Luồng duyệt admin theo thiết bị

1. Truy cập `/ad`.
2. Client tạo/đọc `device_id` từ localStorage.
3. API `/api/admin/device-status` kiểm tra thiết bị đã approved trong Supabase chưa.
4. Nếu chưa duyệt -> gửi request qua `/api/admin/access-request`.
5. Server tạo bản ghi `admin_access_requests` (pending) và gửi email tới `thangnebg91@gmail.com` qua `/api/send-approval-email`.
6. Admin vào `/ad/requests` để duyệt/từ chối.
7. Khi duyệt, API `/api/admin/approve-device` tạo/cập nhật `approved_devices`.
8. Lần sau thiết bị check lại thấy approved từ Supabase, mới cho vào login admin.
9. localStorage chỉ là cache UX, không thay thế kiểm tra server.

## 7) Tính năng đã có

### Public
- Landing section hiện đại.
- Grid card sản phẩm.
- Tìm kiếm + lọc theo danh mục, giá tối thiểu, featured.
- Load more phân trang.
- Trang chi tiết có breadcrumbs, SEO metadata cơ bản.
- Responsive mobile/tablet/desktop.

### Admin
- Hidden admin path `/ad`.
- Màn hình chờ duyệt thiết bị.
- Login Supabase Auth.
- Dashboard thống kê.
- CRUD sản phẩm (kèm upload ảnh + preview).
- CRUD danh mục.
- Quản lý yêu cầu truy cập admin (approve/reject).
- Xác nhận trước khi xóa sản phẩm.

## 8) Gợi ý triển khai production bảo mật cao hơn

- Bổ sung RLS chặt chẽ theo role admin.
- Kiểm tra JWT Supabase trong middleware/server APIs.
- Tách email sender sang Supabase Edge Function.
- Chuyển duyệt một-click qua token ký số/time-limited link.

