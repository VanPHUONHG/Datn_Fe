import axios from "axios";
import type { ICoupon } from "types/coupon";

const API_URL = import.meta.env.VITE_API_URL;

export const getAllCoupons = async () => {
  try {
    const res = await axios.get(`${API_URL}/coupons`);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách coupon:", error);
    throw error;
  }
};

export const getCouponById = async (id: string) => {
  try {
    const res = await axios.get(`${API_URL}/coupons/${id}`);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy coupon theo ID:", error);
    throw error;
  }
};

export const createCoupon = async (
  couponData: Omit<ICoupon, "_id" | "createdAt" | "updatedAt">
) => {
  try {
    const res = await axios.post(`${API_URL}/coupons/add`, couponData);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi tạo coupon:", error);
    throw error;
  }
};

export const updateCoupon = async (id: string, couponData: Partial<ICoupon>) => {
  try {
    const res = await axios.put(`${API_URL}/coupons/${id}`, couponData);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật coupon:", error);
    throw error;
  }
};

export const deleteCoupon = async (id: string) => {
  try {
    const res = await axios.delete(`${API_URL}/coupons/${id}`);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi xoá mềm coupon:", error);
    throw error;
  }
};

export const validateCouponForUser = async (code: string) => {
  try {
    const res = await axios.get(`${API_URL}/coupons/validate/${code}`);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi validate coupon:", error);
    throw error;
  }
};

//Xóa vĩnh viễn
export const permanentlyDeleteCoupon = async (id: string) => {
  try {
    const res = await axios.delete(`${API_URL}/coupons/permanent/${id}`);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi xoá vĩnh viễn coupon:", error);
    throw error;
  }
};
