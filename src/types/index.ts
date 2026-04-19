export interface ProductVariant {
  size: '1kg' | '2.5kg';
  price: number;
}

export interface ProductDef {
  id: string;
  name: string;
  slug: string;
  description: string;
  emoji: string;
  variants: ProductVariant[];
  image: string;
  soldOut?: boolean;
}

export interface CartItem {
  productSlug: string;
  productName: string;
  size: '1kg' | '2.5kg';
  price: number;
  quantity: number;
}

export interface OrderFormData {
  name: string;
  phone: string;
  email: string;
  address: string;
  deliveryType: 'delivery' | 'pickup';
  notes?: string;
}

export interface OrderItem {
  productSlug: string;
  productName: string;
  size: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  deliveryType: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: string;
  paymentId?: string | null;
  pfPaymentId?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'processing'
  | 'ready'
  | 'delivered'
  | 'cancelled';
