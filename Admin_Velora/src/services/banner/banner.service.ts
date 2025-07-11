import axios from "axios";
import type { IBanner } from "types/banner";

const API_URL = import.meta.env.VITE_API_URL;

export const createBanner = async (bannerData: IBanner) => {
  try {
    const res = await axios.post(`${API_URL}/banners`, bannerData);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    } else {
      throw new Error("Đã có lỗi xảy ra khi tạo banner");
    }
  }
};


// Lấy tất cả banner
export const getAllBanners = async () => {
  try {
    const res = await axios.get(`${API_URL}/banners`);
    return res.data; // có thể là Array<IBanner>
  } catch (error) {
    handleError(error, "lấy danh sách banner");
  }
};

// Lấy banner theo ID
export const getBannerById = async (id: string) => {
  try {
    const res = await axios.get(`${API_URL}/banners/${id}`);
    return res.data; // IBanner
  } catch (error) {
    handleError(error, "lấy thông tin banner");
  }
};

// Cập nhật banner
export const updateBanner = async (id: string, data: Partial<IBanner>) => {
  try {
    const res = await axios.put(`${API_URL}/banners/${id}`, data);
    return res.data; // { message, banner }
  } catch (error) {
    handleError(error, "cập nhật banner");
  }
};

// Xoá banner
export const deleteBanner = async (id: string) => {
  try {
    const res = await axios.delete(`${API_URL}/banners//${id}`);
    return res.data; // { message }
  } catch (error) {
    handleError(error, "xoá banner");
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
