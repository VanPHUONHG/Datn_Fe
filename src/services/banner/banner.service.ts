import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Lấy tất cả banner
export const getAllBanners = async () => {
  try {
    const res = await axios.get(`${API_URL}/banners`);
    return res.data; 
  } catch (error) {
    handleError(error, "lấy danh sách banner");
  }
};


// Hàm xử lý lỗi chung
const handleError = (error: unknown, action: string) => {
  if (axios.isAxiosError(error)) {
    console.error(`Lỗi khi ${action}:`, error.response?.data || error.message);
    throw error;
  } else {
    throw new Error(`Đã có lỗi xảy ra khi ${action}`);
  }
};
