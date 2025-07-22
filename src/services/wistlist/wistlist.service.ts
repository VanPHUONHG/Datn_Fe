
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Lấy danh sách wishlist theo user_id
export const getWishlistByUser = async (userId: string) => {
    try {
        const response = await axios.get(`${API_URL}/wishlist/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy wishlist:", error);
        throw error;
    }
};

// Thêm sản phẩm vào wishlist
export const addToWishlist = async (userId: string, productId: string) => {
    try {
        const response = await axios.post(`${API_URL}/wishlist`, {
            user_id: userId,
            product_id: productId,
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi thêm vào wishlist:", error);
        throw error;
    }
};

// Xóa sản phẩm khỏi wishlist
export const removeFromWishlist = async (userId: string, productId: string) => {
    try {
        const response = await axios.delete(`${API_URL}/wishlist`, {
            data: { user_id: userId, product_id: productId },
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi xóa khỏi wishlist:", error);
        throw error;
    }
};
