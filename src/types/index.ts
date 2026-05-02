export interface Vendor {
  id: string;
  name: string;
  slug: string;
  logo_url: string;
  seller_rating: number;
  response_rate: number;
  is_verified: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id?: string;
  icon?: string;
  level: number;
  children?: Category[];
}

export interface Product {
  id: string;
  vendor_id?: string;
  vendor?: Vendor;
  title?: string;
  name?: string; 
  description: string;
  price: number;
  discount_price?: number;
  compare_at_price?: number;
  image?: string;
  images?: string[]; 
  url?: string;
  stock_count: number;
  is_flash_sale: boolean;
  sale_end_at?: string;
  sales_count_last_hour: number;
  created_at?: string;
}
