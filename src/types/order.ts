export interface IOrderItem {
    productId: string;
    variantId: string;
    productImage: string;
    productName: string;
    variant: {
        size: string;
        color: string;
    };
    quantity: number;
    price: number;
}

export interface IOrder {
    _id: string; // ID của đơn hàng
    user: string;
    items: IOrderItem[];

    totalAmount: number;
    discountAmount: number;
    finalAmount: number;

    coupon?: {
        couponId?: string;
        code?: string;
        discountAmount?: number;
    };

    shippingAddress: {
        name: string;
        phone: string;
        addressLine: string;
    };

    note?: string;

    paymentMethod: 'cod' | 'vnpay';
    status: 'pending' | 'confirmed' | 'shipped' | 'completed' | 'cancelled';

    createdAt: string;
    updatedAt: string;
}
export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'completed' | 'cancelled';
