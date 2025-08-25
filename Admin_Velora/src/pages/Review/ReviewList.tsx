import React, { useEffect, useState } from "react";
import {
  getAllReviews,
  deleteReview,
  adminReplyReview,
} from "services/review/review.service";
import { toast } from "react-toastify";
import { FaReply, FaTrash } from "react-icons/fa";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { DatePicker, Input, Button, Select } from "antd";

dayjs.extend(isBetween);
const { RangePicker } = DatePicker;

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

  // filter states
  const [productFilter, setProductFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(
    null
  );
  const [search, setSearch] = useState<string>("");

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

  try {
    await adminReplyReview(parentId, replyContent);

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

  if (loading)
    return <p className="text-center py-10">Đang tải bình luận...</p>;

  // options sản phẩm
  const productOptions = [
    { label: "Tất cả sản phẩm", value: "all" },
    ...Array.from(
      new Map(
        reviews
          .filter((r) => r.product_id)
          .map((r) => [r.product_id?._id, r.product_id?.name])
      ).entries()
    ).map(([id, name]) => ({ label: name, value: id })),
  ];

  // filter logic
  const filteredReviews = reviews.filter((r) => {
    // lọc theo sản phẩm
    if (
      productFilter !== "all" &&
      r.product_id?._id !== productFilter &&
      !r.product_id?.name
        ?.toLowerCase()
        .includes(productFilter.toLowerCase())
    ) {
      return false;
    }

    // lọc theo thời gian
    if (dateRange && r.createdAt) {
      const created = dayjs(r.createdAt);
      const start = dateRange[0]?.startOf("day");
      const end = dateRange[1]?.endOf("day");

      if (start && end && !created.isBetween(start, end, null, "[]")) {
        return false;
      }
    }

    // lọc theo người bình luận
    if (
      search &&
      !r.user_name.toLowerCase().includes(search.toLowerCase())
    )
      return false;

    return true;
  });

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Danh sách bình luận
      </h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center mb-6">
        <Input
          placeholder="Tìm người bình luận..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
          className="w-60"
        />

        <Select
          showSearch
          allowClear
          mode="combobox"
          placeholder="Chọn hoặc nhập sản phẩm"
          options={productOptions}
          value={productFilter}
          onChange={(val) => setProductFilter(val || "all")}
          className="w-60"
          filterOption={(input, option) =>
            (option?.label as string)
              .toLowerCase()
              .includes(input.toLowerCase())
          }
        />

        <RangePicker
          format="DD/MM/YYYY"
          value={dateRange as any}
          onChange={(val) =>
            setDateRange(val ? [val[0]!, val[1]!] : null)
          }
          allowClear
        />

        <Button
          onClick={() => {
            setProductFilter("all");
            setDateRange(null);
            setSearch("");
          }}
        >
          Reset bộ lọc
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow border border-gray-200 mt-4">
        <table className="min-w-full bg-white text-sm rounded-lg overflow-hidden">
          <thead className="bg-gradient-to-r from-blue-100 to-green-100 text-gray-700 font-semibold">
            <tr>
              <th className="px-4 py-3 border">STT</th>
              <th className="px-4 py-3 border">Người bình luận</th>
              <th className="px-4 py-3 border">Sản phẩm</th>
              <th className="px-4 py-3 border">Nội dung</th>
              <th className="px-4 py-3 border">Thời gian</th>
              <th className="px-4 py-3 border">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredReviews
              .filter((r) => !r.parent_id)
              .map((parent, i) => (
                <React.Fragment key={parent._id}>
                  {/* Bình luận gốc */}
                  <tr className="hover:bg-blue-50 transition text-center border-t">
                    <td className="border px-4 py-3 font-bold">{i + 1}</td>
                    <td className="border px-4 py-3 font-semibold text-blue-700">
                      {parent.user_name}
                    </td>
                    <td className="border px-4 py-3">
                      {parent.product_id?.name || "N/A"}
                    </td>
                    <td className="border px-4 py-3 text-left">
                      {parent.comment}
                    </td>
                    <td className="border px-4 py-3 text-xs">
                      {dayjs(parent.createdAt).format("DD/MM/YYYY")}
                    </td>
                    <td className="border px-4 py-3 flex gap-2 justify-center items-center">
                      <button
                        onClick={() =>
                          setReplyingId(
                            replyingId === parent._id ? null : parent._id
                          )
                        }
                        className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 shadow transition"
                        title="Trả lời"
                      >
                        <FaReply />
                      </button>
                      <button
                        onClick={() => handleDelete(parent._id)}
                        className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 shadow transition"
                        title="Xóa"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>

                  {/* Form trả lời */}
                  {replyingId === parent._id && (
                    <tr className="bg-gray-50">
                      <td colSpan={6} className="p-4">
                        <textarea
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          placeholder="Nhập nội dung trả lời..."
                          className="w-full border rounded p-2 mb-2 resize-none focus:ring-2 focus:ring-blue-300"
                        />
                        <div className="text-right">
                          <button
                            onClick={() => handleReply(parent._id)}
                            className="bg-green-600 text-white px-5 py-2 rounded shadow hover:bg-green-700 transition"
                          >
                            Gửi trả lời
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}

                  {/* Bình luận con */}
                  {filteredReviews
                    .filter((c) => c.parent_id === parent._id)
                    .map((child) => (
                      <tr
                        key={child._id}
                        className="bg-green-50 hover:bg-green-100 transition text-left"
                      >
                        <td className="border px-4 py-3 text-center text-green-600 font-bold">
                          ↳
                        </td>
                        <td className="border px-4 py-3 font-semibold text-green-700">
                          {child.user_name}
                        </td>
                        <td className="border px-4 py-3" colSpan={2}>
                          {child.comment}
                        </td>
                        <td className="border px-4 py-3 text-xs">
                          {dayjs(child.createdAt).format("DD/MM/YYYY")}
                        </td>
                        <td className="border px-4 py-3 text-center">
                          <button
                            onClick={() => handleDelete(child._id)}
                            className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 shadow transition"
                            title="Xóa"
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
    </div>
  );
};

export default ReviewList;
