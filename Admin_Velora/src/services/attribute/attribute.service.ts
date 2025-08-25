import axios from "axios";
import type { IAttribute } from "types/attribute";

const API_URL = import.meta.env.VITE_API_URL;

// Create attribute
export const createAttribute = async (attributeData: IAttribute) => {
  try {
    const res = await axios.post(`${API_URL}/attributes`, attributeData);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    } else {
      throw new Error("Đã có lỗi xảy ra khi tạo thuộc tính");
    }
  }
};

// Get all attributes (có thể filter theo type)
export const getAttributes = async (type?: string) => {
  try {
    const res = await axios.get(`${API_URL}/attributes`, {
      params: type ? { type } : {},
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Get deleted attributes (phân trang)
export const getDeletedAttributes = async (
  page: number = 1,
  limit: number = 10,
  type?: string
) => {
  try {
    const res = await axios.get(`${API_URL}/attributes/deleted`, {
      params: { page, limit, ...(type ? { type } : {}) },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Get attribute by id
export const getAttributeById = async (id: string) => {
  try {
    const res = await axios.get(`${API_URL}/attributes/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Update attribute
export const updateAttribute = async (id: string, attributeData: IAttribute) => {
  try {
    const res = await axios.put(`${API_URL}/attributes/${id}`, attributeData);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Soft delete attribute
export const deleteAttribute = async (id: string) => {
  try {
    const res = await axios.delete(`${API_URL}/attributes/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Restore attribute
export const restoreAttribute = async (id: string) => {
  try {
    const res = await axios.patch(`${API_URL}/attributes/${id}/restore`);
    return res.data;
  } catch (error) {
    throw error;
  }
};
