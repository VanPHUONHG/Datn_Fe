import React, { useEffect, useState } from "react";
import { getAllReviews, deleteReview, replyToReview } from "services/review/review.service";
import { toast } from "react-toastify";
import { FaReply, FaTrash } from "react-icons/fa";
import dayjs from "dayjs";

interface Review {
    _id: string;
    user_name: string;
    comment: string;
    createdAt: string;
    parent_id?: string;
    product_id?: {
        _id: string;
        name: string;
    };
}

const ReviewList = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
  const [replyingId, setReplyingId] = useState<string | null>(null);
    const [replyContent, setReplyContent] = useState<string>("");

    const fetchData = async () => {
        try {
            const data = await getAllReviews();
            setReviews(data);
        } catch (err) {
            toast.error("Không thể tải bình luận");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bạn có chắc muốn xoá bình luận này không?")) return;
        try {
            await deleteReview(id);
            toast.success("Xoá bình luận thành công");
            fetchData();
        } catch (err) {
            toast.error("Xoá thất bại");
        }
    };

    const handleReply = async (parentId: string) => {
    if (!replyContent.trim()) {
        toast.warning("Vui lòng nhập nội dung trả lời");
        return;
    }

    // Tìm product_id từ review
    const parentReview = reviews.find((r) => r._id === parentId);
    const productId = parentReview?.product_id?._id;

    if (!productId) {
        toast.error("Không tìm thấy sản phẩm của bình luận này");
        return;
    }

    try {
        await replyToReview({
            product_id: productId,
            comment: replyContent,
            parent_id: parentId,
        });

        toast.success("Đã trả lời bình luận");
        setReplyContent("");
        setReplyingId(null);
        fetchData();
    } catch (err) {
        toast.error("Trả lời thất bại");
    }
};

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) return <p className="text-center py-10">Đang tải bình luận...</p>;

    return (
        <div className="p-4 bg-white rounded shadow">
            <h1 className="text-xl font-bold mb-4 text-green-600">Danh sách bình luận</h1>
            <table className="w-full border border-gray-300 text-sm">
                <thead className="bg-green-600 text-white">
                    <tr>
                        <th className="px-3 py-2 border">#</th>
                        <th className="px-3 py-2 border">Người bình luận</th>
                        <th className="px-3 py-2 border">Sản phẩm</th>
                        <th className="px-3 py-2 border">Nội dung</th>
                        <th className="px-3 py-2 border">Thời gian</th>
                        <th className="px-3 py-2 border">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
             {reviews
  .filter((r) => !r.parent_id)
  .map((parent, i) => (
    <React.Fragment key={parent._id}>
      {/* Bình luận gốc */}
      <tr className="text-center border-t bg-white">
        <td className="border px-3 py-2">{i + 1}</td>
        <td className="border px-3 py-2">{parent.user_name}</td>
        <td className="border px-3 py-2">{parent.product_id?.name || "N/A"}</td>
        <td className="border px-3 py-2 text-left">{parent.comment}</td>
        <td className="border px-3 py-2 text-xs">
          {dayjs(parent.createdAt).format("DD/MM/YYYY")}
        </td>
        <td className="border px-3 py-2 flex gap-2 justify-center">
          <button
            onClick={() =>
              setReplyingId(replyingId === parent._id ? null : parent._id)
            }
            className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-500"
          >
            <FaReply />
          </button>
          <button
            onClick={() => handleDelete(parent._id)}
            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-500"
          >
            <FaTrash />
          </button>
        </td>
      </tr>

      {/* Form trả lời */}
      {replyingId === parent._id && (
        <tr className="bg-gray-50">
          <td colSpan={6} className="p-3">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Nhập nội dung trả lời..."
              className="w-full border rounded p-2 mb-2"
            />
            <div className="text-right">
              <button
                onClick={() => handleReply(parent._id)}
                className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
              >
                Gửi trả lời
              </button>
            </div>
          </td>
        </tr>
      )}

      {/* Bình luận con */}
      {reviews
        .filter((c) => c.parent_id === parent._id)
        .map((child) => (
          <tr key={child._id} className="text-sm bg-gray-100 text-left">
            <td className="border px-3 py-2 text-center">↳</td>
            <td className="border px-3 py-2">{child.user_name}</td>
            <td className="border px-3 py-2" colSpan={2}>
              {child.comment}
            </td>
            <td className="border px-3 py-2 text-xs">
              {dayjs(child.createdAt).format("DD/MM/YYYY")}
            </td>
            <td className="border px-3 py-2 text-center">
              <button
                onClick={() => handleDelete(child._id)}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                <FaTrash />
              </button>
            </td>
          </tr>
        ))}
    </React.Fragment>
  ))}


                </tbody>
            </table>
        </div>
    );
};

export default ReviewList;
