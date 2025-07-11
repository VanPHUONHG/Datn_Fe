import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const REVIEW_ENDPOINT = `${API_URL}/reviews`;

export const getAllReviews = async () => {
  const token = localStorage.getItem("token_admin"); 

  if (!token) {
    throw new Error("Không tìm thấy token admin");
  }

  const res = await axios.get(`${REVIEW_ENDPOINT}/allreviews`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data.reviews;
};

export const deleteReview = async (review_id: string) => {
  const token = localStorage.getItem("token_admin");

  if (!token) {
    throw new Error("Không tìm thấy token admin");
  }

  const res = await axios.delete(`${REVIEW_ENDPOINT}/deletereview/${review_id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};


export const replyToReview = async ({
  product_id,
  comment,
  parent_id,
}: {
  product_id: string;
  comment: string;
  parent_id: string;
}) => {
  const token = localStorage.getItem("token_admin");
  if (!token) throw new Error("Không tìm thấy token admin");

  const res = await axios.post(
    `${REVIEW_ENDPOINT}/addreview/${product_id}`,
    { comment, parent_id },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data.review;
};

