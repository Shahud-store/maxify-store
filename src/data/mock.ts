import { Category, Product, Vendor } from '../types';

const MOCK_VENDOR: Vendor = {
  id: 'v1',
  name: 'Luxe Electronics',
  slug: 'luxe-electronics',
  logo_url: 'https://api.dicebear.com/7.x/initials/svg?seed=LE',
  seller_rating: 4.9,
  response_rate: 98,
  is_verified: true
};

export const MOCK_CATEGORIES: Category[] = [
  {
    id: '1',
    name: 'Electronics',
    slug: 'electronics',
    level: 1,
    children: [
      {
        id: '11', name: 'Smartphones', slug: 'smartphones', level: 2, 
        children: [{ id: '111', name: 'Apple', slug: 'apple', level: 3 }, { id: '112', name: 'Samsung', slug: 'samsung', level: 3 }]
      },
      {
        id: '12', name: 'Computing', slug: 'computing', level: 2,
        children: [{ id: '121', name: 'Dell', slug: 'dell', level: 3 }, { id: '122', name: 'HP', slug: 'hp', level: 3 }]
      }
    ]
  },
  { id: '2', name: 'Fashion', slug: 'fashion', level: 1, children: [] },
  { id: '3', name: 'Home & Living', slug: 'home-and-living', level: 1, children: [] },
  { id: '4', name: 'Health & Beauty', slug: 'health-and-beauty', level: 1, children: [] },
  { id: '5', name: 'Sports', slug: 'sports', level: 1, children: [] },
  { id: '6', name: 'Automotive', slug: 'automotive', level: 1, children: [] },
];

export const MOCK_FLASH_SALE: Product[] = [
  {
    id: 'fs1',
    vendor_id: 'v1',
    name: 'AirPods Pro (2nd Gen) with MagSafe',
    description: 'Noise cancelling earphones with high fidelity sound.',
    price: 249.00,
    discount_price: 189.99,
    images: ['https://images.unsplash.com/photo-1628202926206-c63a34b1618f?q=80&w=1000'],
    stock_count: 5,
    is_flash_sale: true,
    sales_count_last_hour: 12
  },
  {
    id: 'fs2',
    name: 'Samsung 32" Curved Monitor',
    description: 'Immersive curved display for gaming and productivity.',
    price: 399.00,
    discount_price: 299.00,
    images: ['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=1000'],
    stock_count: 8,
    is_flash_sale: true,
    vendor_id: 'v1',
    sales_count_last_hour: 3
  },
  {
    id: 'fs3',
    name: 'Mechanical Gaming Keyboard',
    description: 'Tactile switches and customizable RGB lighting.',
    price: 129.00,
    discount_price: 89.00,
    images: ['https://images.unsplash.com/photo-1618384881397-3c6cd2176b6b?q=80&w=1000'],
    stock_count: 22,
    is_flash_sale: true,
    vendor_id: 'v1',
    sales_count_last_hour: 45
  },
  {
    id: 'fs4',
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Industry-leading noise cancellation and superior sound.',
    price: 349.00,
    discount_price: 299.00,
    images: ['https://images.unsplash.com/photo-1648447444451-24641bc38647?q=80&w=1000'],
    stock_count: 2,
    is_flash_sale: true,
    vendor_id: 'v1',
    sales_count_last_hour: 9
  },
  {
    id: 'fs5',
    name: 'Wireless Ergonomic Mouse',
    description: 'Designed for comfort and precision throughout the day.',
    price: 59.99,
    discount_price: 39.99,
    images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=1000'],
    stock_count: 50,
    is_flash_sale: true,
    vendor_id: 'v1',
    sales_count_last_hour: 121
  }
];

export const MOCK_PRODUCTS: Product[] = [
  ...MOCK_FLASH_SALE,
  {
    id: 'p1',
    vendor_id: 'v1',
    vendor: MOCK_VENDOR,
    name: 'MacBook Pro 14 M3 Chip Space Black',
    description: 'The most advanced laptop for creators.',
    price: 1999.00,
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000'],
    stock_count: 15,
    is_flash_sale: false,
    sales_count_last_hour: 4
  },
  {
    id: 'p2',
    vendor_id: 'v1',
    vendor: MOCK_VENDOR,
    name: 'Nike Air Max 270 React',
    description: 'Lifestyle shoe with high comfort.',
    price: 150.00,
    discount_price: 120.00,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000'],
    stock_count: 4,
    is_flash_sale: false,
    sales_count_last_hour: 33
  },
  {
    id: 'p3',
    vendor_id: 'v1',
    vendor: MOCK_VENDOR,
    name: 'Instax Mini 12 Instant Camera',
    description: 'Capture fun memories.',
    price: 99.00,
    images: ['https://images.unsplash.com/photo-1526170315873-3a91b5ef309e?q=80&w=1000'],
    stock_count: 60,
    is_flash_sale: false,
    sales_count_last_hour: 15
  },
  {
    id: 'p4',
    vendor_id: 'v1',
    vendor: MOCK_VENDOR,
    name: 'Hydro Flask 32oz Wide Mouth',
    description: 'Insulated water bottle.',
    price: 49.95,
    images: ['https://images.unsplash.com/photo-1602143302703-f75d77681471?q=80&w=1000'],
    stock_count: 100,
    is_flash_sale: false,
    sales_count_last_hour: 200
  },
];
