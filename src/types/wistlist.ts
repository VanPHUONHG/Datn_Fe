import type { Product } from "interface/product";

interface WishlistItem extends Product {
  addedAt: Date;
}

export interface Wishlist {
    _id?: string;           // Mongoose sẽ tự tạo _id
    user_id: string;
    products: WishlistItem[];
}

