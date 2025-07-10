import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:8888/api";

export const addReview = async (product_id: string, comment: string) => {
  const token = localStorage.getItem("token");
  const res = await axios.post(
    `${API}/reviews/addreview/${product_id}`, // ✅ Sửa đúng đường dẫn
    { comment },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const getAllReviewsByProductId = async (product_id: string) => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API}/reviews/by-product/${product_id}`, { // ✅ Sửa đúng đường dẫn
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data.reviews;
};
