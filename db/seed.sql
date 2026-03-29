insert into public.categories (name, slug)
values
('Chăm sóc da', 'cham-soc-da'),
('Thực phẩm bổ sung', 'thuc-pham-bo-sung'),
('Đời sống', 'doi-song')
on conflict (slug) do nothing;

insert into public.products (name, slug, description, usage, price, image_url, category_id, featured)
select
  'Serum Vitamin C Premium',
  'serum-vitamin-c-premium',
  'Tinh chất làm sáng da cao cấp, kết cấu nhẹ, thấm nhanh.',
  'Dùng sau toner, trước kem dưỡng, sáng và tối.',
  450000,
  'https://images.unsplash.com/photo-1556228578-8c89e6adf883',
  c.id,
  true
from public.categories c where c.slug = 'cham-soc-da'
on conflict (slug) do nothing;

insert into public.products (name, slug, description, usage, price, image_url, category_id, featured)
select
  'Omega 3 Ultra Pure',
  'omega-3-ultra-pure',
  'Bổ sung dinh dưỡng chất lượng cao cho tim mạch và trí não.',
  'Uống 2 viên/ngày sau bữa ăn.',
  320000,
  'https://images.unsplash.com/photo-1577401239170-897942555fb3',
  c.id,
  false
from public.categories c where c.slug = 'thuc-pham-bo-sung'
on conflict (slug) do nothing;


insert into public.admin_users (email, full_name)
values ('thangnebg91@gmail.com', 'Primary Admin')
on conflict (email) do nothing;
