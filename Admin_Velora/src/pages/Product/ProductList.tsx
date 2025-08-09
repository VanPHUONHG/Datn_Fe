import { Input, message, Popconfirm, Select } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllCategories } from "services/category/category.service";
import { deleteProductById, getAllProducts } from "services/product/product.service";

import type { Product } from "types/product";

const ProductList = () => {
  const [products, setProduct] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const perPage = 10;

  //Tìm theo tên và lọc danh mục 
  const [searchName, setSearchName] = useState("");
const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
const { Option } = Select;

useEffect(() => {
  const fetchCategories = async () => {
    try {
      const res = await getAllCategories(); // bạn cần implement hàm này trong service
      setCategories(res || []);
    } catch (error) {
      console.error("Lỗi khi lấy danh mục", error);
    }
  };

  fetchCategories();
}, []);


  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await getAllProducts();
const sorted = (data.products || []).sort(
  (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
);
setProduct(sorted);
      } catch (error) {
        console.log(error);
      }
    };
    getProducts();
  }, []);

  //Tìm kiếm tên và lọc theo danh mục
const filteredProducts = products.filter((item) => {
  const nameMatch = item.name.toLowerCase().includes(searchName.toLowerCase());
  const categoryMatch = selectedCategory
    ? item.category?.name === selectedCategory
    : true;
  return nameMatch && categoryMatch;
});

const totalPages = Math.ceil(filteredProducts.length / perPage);
const currentProducts = filteredProducts.slice((page - 1) * perPage, page * perPage);


  const DelProduct = async (id: string) => {
    try {
      await deleteProductById(id);
      const newProduct = products.filter((item) => item._id != id);
      setProduct(newProduct);
       message.success("Xóa mềm sản phẩm thành công");

    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Quản lý sản phẩm
        </h2>
      </div>
      <div className="mb-6 flex justify-end">
        <Link to={"/admin/product-delete"}
          className="px-4 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 border border-red-300 shadow transition"
        >
          Xem sản phẩm đã xóa
        </Link>
      </div>
      <div className="mb-4 flex gap-4 items-center">
  <Input
    placeholder="Tìm theo tên sản phẩm"
    value={searchName}
    onChange={(e) => setSearchName(e.target.value)}
    className="w-64"
  />
  <Select
    allowClear
    placeholder="Lọc theo danh mục"
    value={selectedCategory}
    onChange={(value) => setSelectedCategory(value)}
    className="w-64"
  >
    {categories.map((cat) => (
      <Option key={cat._id} value={cat.name}>
        {cat.name}
      </Option>
    ))}
  </Select>
</div>

      <div >
        
        <table className="min-w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              {[
                "STT",
                "Tên sản phẩm",
                "Ảnh sản phẩm",
                "Giá (VNĐ)",
                "Danh mục",
                "Ngày cập nhật",
                "Thao tác",
              ].map((header) => (
                <th
                  key={header}
                  className="border px-4 py-3 text-left text-gray-700 font-medium select-none"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentProducts.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-6 text-gray-500">
                  Đang tải sản phẩm
                </td>
              </tr>
            ) : (
              currentProducts.map((item, index) => (
                <tr
                  key={item._id}
                  className="even:bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <td className="border px-4 py-2 align-middle">
                    {(page - 1) * perPage + index + 1}
                  </td>
                  <td
                    className="border px-4 py-2 align-middle font-semibold text-gray-800 max-w-xs truncate"
                    title={item.name}
                  >
                    {item.name}
                  </td>
                  <td className="border px-4 py-2 align-middle">
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
                  <td className="border px-4 py-2 align-middle">
                    {item.price.toLocaleString()}
                  </td>
      
                  <td className="border px-4 py-2 align-middle">
                    {item.category?.name || "Không có"}
                  </td>
                  <td className="border px-4 py-2 align-middle text-gray-600 text-sm">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  <td className="border px-4 py-2 align-middle">
                    <div className="flex gap-3">
                      <Link
                        to={`/admin/product-edit/${item._id}`}
                        className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition font-semibold"
                      >
                        Sửa
                      </Link>
                      <Popconfirm
                        title="Bạn có chắc muốn xóa?"
                        okText="Có"
                        cancelText="Không"
                        onConfirm={() => DelProduct(item._id)}
                      >
                        <button
                          className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition font-semibold"
                        >
                          Xóa
                        </button>
                      </Popconfirm>
                    </div>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-center items-center gap-2 text-sm select-none">
  {/* Nút về trang đầu tiên */}
  <button
    disabled={page === 1}
    onClick={() => setPage(1)}
    className={`px-3 py-1 rounded-lg border transition font-medium
      ${page === 1
        ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
      }`}
    title="Trang đầu"
  >
    «
  </button>

  {/* Nút về trang trước */}
  <button
    disabled={page === 1}
    onClick={() => setPage(prev => Math.max(prev - 1, 1))}
    className={`px-3 py-1 rounded-lg border transition font-medium
      ${page === 1
        ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
      }`}
    title="Trang trước"
  >
    ‹
  </button>

  {/* Các số trang */}
  {Array.from({ length: totalPages }, (_, i) => (
    <button
      key={i}
      onClick={() => setPage(i + 1)}
      className={`px-3 py-1 rounded-lg border transition font-semibold
        ${page === i + 1
          ? "bg-blue-600 text-white border-blue-600"
          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
        }`}
    >
      {i + 1}
    </button>
  ))}

  {/* Nút sang trang sau */}
  <button
    disabled={page === totalPages}
    onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
    className={`px-3 py-1 rounded-lg border transition font-medium
      ${page === totalPages
        ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
      }`}
    title="Trang sau"
  >
    ›
  </button>

  {/* Nút về trang cuối */}
  <button
    disabled={page === totalPages}
    onClick={() => setPage(totalPages)}
    className={`px-3 py-1 rounded-lg border transition font-medium
      ${page === totalPages
        ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
      }`}
    title="Trang cuối"
  >
    »
  </button>
</div>

    </div>
  );
};

export default ProductList; 