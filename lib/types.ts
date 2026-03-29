export type Category = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  usage: string;
  price: number;
  image_url: string | null;
  category_id: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
  categories?: Pick<Category, 'id' | 'name' | 'slug'>;
};

export type AdminAccessRequest = {
  id: string;
  device_id: string;
  device_name: string;
  browser_info: string;
  requested_at: string;
  status: 'pending' | 'approved' | 'rejected';
  approved_at: string | null;
  approved_by: string | null;
  email_target: string;
};
