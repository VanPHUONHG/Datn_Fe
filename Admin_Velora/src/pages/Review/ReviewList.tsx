import { useEffect, useState } from "react";
import { getAllReviews, deleteReview } from "services/review/review.service";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";
import dayjs from "dayjs";

interface Review {
    _id: string;
    user_name: string;
    comment: string;
    createdAt: string;
    product_id?: {
        name: string;
    };
}

const ReviewList = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

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
                    {reviews.map((r, i) => (
                        <tr key={r._id} className="text-center border-t">
                            <td className="border px-3 py-2">{i + 1}</td>
                            <td className="border px-3 py-2">{r.user_name}</td>
                            <td className="border px-3 py-2">{r.product_id?.name || "N/A"}</td>
                            <td className="border px-3 py-2 text-left">{r.comment}</td>
                            <td className="border px-3 py-2 text-xs">
                                {dayjs(r.createdAt).format("DD/MM/YYYY")}
                            </td>
                            <td className="border px-3 py-2">
                                <button
                                    onClick={() => handleDelete(r._id)}
                                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                >
                                    <FaTrash />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ReviewList;
