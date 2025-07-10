import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { addReview, getAllReviewsByProductId } from "services/review/review.service";

interface Review {
  _id: string;
  user_name: string;
  comment: string;
  createdAt: string;
}

const ProductReviewSection = () => {
  const { id: product_id } = useParams();
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);

  const fetchReviews = async () => {
    try {
      const data = await getAllReviewsByProductId(product_id!);
      setReviews(data);
    } catch (err) {
      toast.error("Không thể tải bình luận", {
        icon: <FaExclamationCircle />,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      await addReview(product_id!, comment);
      toast.success("Bình luận thành công!", { icon: <FaCheckCircle /> });
      setComment("");
      fetchReviews();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Lỗi gửi bình luận", {
        icon: <FaExclamationCircle />,
      });
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [product_id]);

  return (
    <div className="mt-12">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Bình luận sản phẩm</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Nhập bình luận..."
          className="w-full p-3 border rounded mb-3"
        />
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Gửi bình luận
        </button>
      </form>

      {/* Danh sách bình luận */}
      <div className="space-y-4">
        {reviews.length === 0 && (
          <p className="text-gray-500 italic">Chưa có bình luận nào.</p>
        )}
        {reviews.map((r) => (
          <div key={r._id} className="bg-gray-100 p-3 rounded">
            <p className="text-sm font-medium text-gray-700">{r.user_name}</p>
            <p className="text-gray-600 text-sm">{r.comment}</p>
            <p className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductReviewSection;


