import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FaCheckCircle, FaExclamationCircle, FaReply } from "react-icons/fa";
import { addReview, getAllReviewsByProductId } from "services/review/review.service";
import dayjs from "dayjs";

interface Review {
  _id: string;
  user_name: string;
  comment: string;
  comment_time: string;
  parent_id?: string;
}

const ProductReviewSection = () => {
  const { id: product_id } = useParams();
  const [comment, setComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
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
      await addReview(product_id!, comment, replyingTo);
      toast.success("Bình luận thành công!", { icon: <FaCheckCircle /> });
      setComment("");
      setReplyingTo(null);
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

  const renderComments = (parentId: string | null = null, level = 0) => {
    const filtered = reviews.filter((r) => r.parent_id === parentId);

    return filtered.map((comment) => (
      <div
        key={comment._id}
        className={`mt-3 ml-${level * 4} ${
          level === 0 ? "bg-gray-100" : "bg-white"
        } p-3 rounded `}
      >
        <p className="text-sm font-semibold text-gray-800">{comment.user_name}</p>
        <p className="text-gray-700 text-sm mt-1">{comment.comment}</p>
        <p className="text-xs text-gray-500 mt-1">
          {dayjs(comment.comment_time).format("HH:mm DD/MM/YYYY")}
        </p>

        {/* <button
          onClick={() => setReplyingTo(comment._id)}
          className="text-blue-600 text-xs mt-2 hover:underline flex items-center gap-1"
        >
          <FaReply className="text-sm" />
          Trả lời
        </button> */}

        {renderComments(comment._id, level + 1)}
      </div>
    ));
  };

  return (
    <div className="mt-12">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Bình luận sản phẩm</h2>

      {/* Form nhập bình luận */}
      <form onSubmit={handleSubmit} className="mb-6">
        {replyingTo && (
          <p className="text-sm text-gray-600 mb-2">
            Đang trả lời{" "}
            <strong className="text-blue-600">
              @{reviews.find((r) => r._id === replyingTo)?.user_name || "ẩn danh"}
            </strong>{" "}
            —
            <button
              type="button"
              onClick={() => setReplyingTo(null)}
              className="text-red-500 underline ml-1"
            >
              Huỷ
            </button>
          </p>
        )}
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Nhập bình luận..."
          className="w-full p-3 border rounded mb-3 resize-none h-24"
        />
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded font-medium"
        >
          {replyingTo ? "Gửi trả lời" : "Gửi bình luận"}
        </button>
      </form>

      {/* Danh sách bình luận */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-gray-500 italic">Chưa có bình luận nào.</p>
        ) : (
          renderComments()
        )}
      </div>
    </div>
  );
};

export default ProductReviewSection;
