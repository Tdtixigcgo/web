# LuxCatalog - Next.js + Tailwind + TypeScript + Supabase

Website trưng bày sản phẩm hiện đại, responsive, có admin dashboard ẩn tại `/ad` với cơ chế duyệt thiết bị theo yêu cầu, tối ưu để deploy ổn định trên Vercel.

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
  api/                     # server routes (CRUD, device approval, email, health)
components/
lib/
  server/                  # auth/session server utilities
services/
supabase/
middleware.ts
db/
  schema.sql
  seed.sql
vercel.json                # cron keep-alive
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
ADMIN_SESSION_SECRET=
```

> `ADMIN_SESSION_SECRET` nên là chuỗi ngẫu nhiên dài (>= 32 ký tự) khi chạy production.

## 4) Setup Supabase

1. Tạo project Supabase mới.
2. Vào SQL Editor, chạy `db/schema.sql`.
3. Chạy tiếp `db/seed.sql` để tạo data mẫu + admin user mẫu.
4. Trong Storage, xác nhận bucket `product-images` đã có.
5. Trong Authentication, tạo user admin trùng email có trong bảng `admin_users`.

## 5) Chạy local

```bash
npm install
npm run dev
```

Truy cập:
- Public site: `http://localhost:3000`
- Admin hidden path: `http://localhost:3000/ad`

## 6) Luồng duyệt admin theo thiết bị (secure hơn bản cũ)

1. Truy cập `/ad`.
2. Client tạo/đọc `device_id` từ localStorage.
3. API `/api/admin/device-status` kiểm tra approved thật trong bảng `approved_devices`.
4. Nếu chưa duyệt -> gửi request qua `/api/admin/access-request`.
5. Server tạo `admin_access_requests` và gửi email qua `/api/send-approval-email`.
6. Admin duyệt/từ chối trong `/ad/requests`.
7. Khi duyệt, API tạo/cập nhật `approved_devices`.
8. User đăng nhập Supabase Auth xong, gọi `/api/admin/session` để server xác thực:
   - user có trong bảng `admin_users`
   - thiết bị đã approved
9. Server cấp `HttpOnly signed cookie` `ad_session`; middleware + API admin dùng cookie này để bảo vệ route.
10. localStorage chỉ là UX cache, không phải nguồn xác thực chính.

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
- Login Supabase Auth + server session.
- Dashboard thống kê.
- CRUD sản phẩm (kèm upload ảnh + preview).
- CRUD danh mục.
- Quản lý yêu cầu truy cập admin (approve/reject).
- Xác nhận trước khi xóa sản phẩm.

## 8) Deploy Vercel + uptime

1. Push code lên GitHub.
2. Import project vào Vercel.
3. Set đầy đủ Environment Variables như mục (3) cho Production/Preview.
4. Deploy.
5. `vercel.json` đã cấu hình cron gọi `/api/health` mỗi 10 phút để monitoring/keep-warm nhẹ.
6. Kiểm tra endpoint health: `https://<your-domain>/api/health` trả về `{ status: "ok" }`.

## 9) Gợi ý triển khai production nâng cao

- Chuyển email sender sang domain riêng (Resend verified domain).
- Log/audit thêm cho approve/reject.
- Áp chính sách RLS chi tiết hơn theo role nội bộ.
- Bổ sung rate-limit cho API gửi request duyệt thiết bị.
