export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  image_url: string | null;
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: string;
  products: Product;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Order {
  id: string;
  created_at: string;
  status: string;
  total_amount: string;
  order_items: OrderItem[];
  shipping_address?: ShippingAddress;
}
