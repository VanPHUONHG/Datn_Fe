import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Product } from "types/product";
import { getProductsByCategory } from "services/category/category.service";

const CategoryInProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProductsByCategory(id || "");
        setProducts(data);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Lỗi khi tải sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [id]);


  if (loading) return <p>Đang tải...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Sản phẩm thuộc danh mục</h1>
        <button
          onClick={() => navigate("/admin/category-list")}
          className="px-4 py-2 bg-blue-200 text-white rounded hover:bg-gray-500 transition"
        >
          Quay về danh mục
        </button>
      </div>

      <table className="min-w-full border border-gray-300 text-sm">
        <thead className="bg-gray-100 sticky top-0 z-10">
          <tr>
            {[
              "STT",
              "Tên sản phẩm",
              "Ảnh sản phẩm",
              "Giá (VNĐ)",
              "Giá khuyến mại",
              "Danh mục",
              "Ngày tạo",
            ].map((header) => (
              <th
                key={header}
                className=" px-4 py-3 text-left text-gray-700 font-medium select-none"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center py-6 text-gray-500">
                Không có sản phẩm nào
              </td>
            </tr>
          ) : (
            products.map((item, index) => (
              <tr
                key={item._id}
                className="even:bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <td className=" px-4 py-2 align-middle">
                  {index + 1}
                </td>
                <td
                  className=" px-4 py-2 align-middle font-semibold text-gray-800 max-w-xs truncate"
                  title={item.name}
                >
                  {item.name}
                </td>
                <td className=" px-4 py-2 align-middle">
                  {item.images && item.images.length > 0 ? (
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md shadow-sm"
                    />
                  ) : (
                    <span className="text-gray-400 italic">Chưa có ảnh</span>
                  )}
                </td>
                <td className=" px-4 py-2 align-middle">
                  {item.price.toLocaleString()}
                </td>
                   <td className=" px-4 py-2 align-middle">
                  {item.discount_price.toLocaleString()}
                </td>
                <td className=" px-4 py-2 align-middle">
                  {(item.category_id as { name?: string })?.name || "Không có"}
                </td>
                <td className=" px-4 py-2 align-middle text-gray-600 text-sm">
                  {new Date(item.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryInProduct;
