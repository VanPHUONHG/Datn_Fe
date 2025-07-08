import axios from "axios";
import type { IProductVariant } from "types/variant";

const API_URL = import.meta.env.VITE_API_URL;

// Lấy danh sách biến thể
export const getAllVariants = async (params: { page: number; limit: number }) => {
  try {
    const res = await axios.get(`${API_URL}/productvariants`, { params });
    return res.data; 
  } catch (error) {
    console.error("Lỗi khi lấy biến thể:", error);
    throw error;
  }
};

// Lấy biến thể đã xóa mềm
export const getDeletedVariants = async (page = 1, limit = 10) => {
  try {
    const res = await axios.get(`${API_URL}/productvariants/deleted`, {
      params: { page, limit },
    });
    return res.data; // { data, pagination }
  } catch (error) {
    console.error("Lỗi khi lấy biến thể đã xóa:", error);
    throw error;
  }
};

// Lấy biến thể theo ID
export const getVariantById = async (id: string) => {
  try {
    const res = await axios.get(`${API_URL}/productvariants/${id}`);
    return res.data; // 1 biến thể
  } catch (error) {
    console.error("Lỗi khi lấy biến thể theo ID:", error);
    throw error;
  }
};

// Tạo biến thể mới
export const createVariant = async (variantData: Partial<IProductVariant>) => {
  try {
    const res = await axios.post(`${API_URL}/productvariants`, variantData);
    return res.data; 
  } catch (error) {
    console.error("Lỗi khi tạo biến thể:", error);
    throw error;
  }
};

// Cập nhật biến thể
export const updateVariant = async (
  id: string,
  variantData: Partial<IProductVariant>
) => {
  try {
    const res = await axios.put(`${API_URL}/productvariants/${id}`, variantData);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật biến thể:", error);
    throw error;
  }
};

// Xóa mềm biến thể
export const deleteVariant = async (id: string) => {
  try {
    const res = await axios.delete(`${API_URL}/productvariants/${id}`);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi xóa mềm biến thể:", error);
    throw error;
  }
};

// Khôi phục biến thể
export const restoreVariant = async (id: string) => {
  try {
    const res = await axios.patch(`${API_URL}/productvariants/restore/${id}`);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi khôi phục biến thể:", error);
    throw error;
  }
};

// Xóa vĩnh viễn biến thể
export const forceDeleteVariant = async (id: string) => {
  try {
    const res = await axios.delete(`${API_URL}/productvariants/forcedelete/${id}`);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi xóa vĩnh viễn biến thể:", error);
    throw error;
  }
};



export const getVariantsByProduct = async (params: {
  product_id: string;
  color?: string;
  page?: number;
  limit?: number;
  isDeleted?: boolean;
}) => {
  try {
    const res = await axios.get(`${API_URL}/productvariants`, {
      params,
    });
    return res.data; // { variants, pagination }
  } catch (error) {
    console.error("Lỗi khi lấy biến thể theo sản phẩm:", error);
    throw error;
  }
};