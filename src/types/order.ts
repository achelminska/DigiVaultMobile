export interface OrderItem {
  idCourse: number;
  title: string;
  price: number;
}

export interface OrderSummary {
  idOrder: number;
  totalPrice: number;
  itemsCount: number;
  createdAt: string;
}

export interface Order extends OrderSummary {
  orderItems: OrderItem[];
}
