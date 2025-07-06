import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getAllVariantsByProductId = async (product_id: string) => {
  try {
    const response = await axios.get(`${API_URL}/productvariants`, {
      params: {
        product_id,
        isDeleted: false,  
        page: 1,
        limit: 1000,      
      },
    });

    return response.data.variants;
  } catch (error) {
    console.error("Error fetching product variants for client:", error);
    throw error;
  }
};
export const getVariantById = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/productvariants/${id}`);
    console.log("👉 Variant detail:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching variant by ID:", error);
    throw error;
  }
};

export const getAllProductVariants = async () => {
  try {
    const response = await axios.get(`${API_URL}/productvariants`, {
      params: {
        isDeleted: false,
        page: 1,
        limit: 1000,
      },
    });
    return response.data.variants;
  } catch (error) {
    console.error("Error fetching all product variants:", error);
    throw error;
  }
};