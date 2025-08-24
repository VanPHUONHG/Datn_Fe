import { message, Popconfirm, Select } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllProducts } from "services/product/product.service";
import { deleteVariant, getAllVariants  } from "services/variant/variant.service";
import type { Product } from "types/product";
import type { IProductVariant } from "types/variant";

const VariantList = () => {
 const [variants, setVariants] = useState<IProductVariant[]>([]);
const [page, setPage] = useState(1);
const [total, setTotal] = useState(0); // tổng biến thể
const perPage = 20;

//Lọc sku , size,màu,giá
const [searchSku, setSearchSku] = useState("");
const [filterSize, setFilterSize] = useState<string | undefined>();
const [filterColor, setFilterColor] = useState<string | undefined>();
const [minPrice, setMinPrice] = useState<number | undefined>();
const [maxPrice, setMaxPrice] = useState<number | undefined>();

const [productOptions, setProductOptions] = useState<Product[]>([]);
const [productId, setProductId] = useState<string | undefined>();

useEffect(() => {
  const fetchProducts = async () => {
    try {
      const data = await getAllProducts({ limit: 9999 });
      setProductOptions(data.products || []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    }
  };

  fetchProducts();
}, []);

useEffect(() => {
  const fetchVariants = async () => {
    try {
    const data = await getAllVariants({ product_id: productId } as any);

      const sorted = (data.variants || []).sort(
        (a: any, b: any) =>
          new Date(b.created_at || "").getTime() -
          new Date(a.created_at || "").getTime()
      );

      setVariants(sorted);
      setTotal(data.pagination?.totalItem || 0);
    } catch (error) {
      console.error("Lỗi khi lấy biến thể:", error);
    }
  };

  fetchVariants();
}, [productId]);


  const handleDelete = async (id: string) => {
    try {
      await deleteVariant(id);
      const updated = variants.filter((item) => item._id !== id);
      setVariants(updated);
    message.success("Xóa mềm biến thể thành công");
    } catch (error) {
      console.log(error);
    }
  };

//Lọc cho về trang 1
useEffect(() => {
  setPage(1);
}, [searchSku, filterSize, filterColor, minPrice, maxPrice]);

  // Lọc biến thể theo điều kiện đã nhập
const filteredVariants = variants.filter((item) => {
  const skuMatch = item.sku?.toLowerCase().includes(searchSku.toLowerCase());
  const sizeMatch = filterSize ? item.size === filterSize : true;
const colorMatch = filterColor
  ? item.color?.toLowerCase() === filterColor.toLowerCase()
  : true;
    const priceMatch =
    (minPrice === undefined || item.price >= minPrice) &&
    (maxPrice === undefined || item.price <= maxPrice);

  return skuMatch && sizeMatch && colorMatch && priceMatch;
});

// Phân trang cho danh sách đã lọc
const currentVariants = filteredVariants.slice((page - 1) * perPage, page * perPage);
const totalPages = Math.ceil(filteredVariants.length / perPage);


  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Quản lý biến thể</h2>
      </div>

      <div className="mb-6 flex justify-between">
         <div className="bg-green-50 px-4 py-2 rounded-lg shadow-sm flex items-center">
    <span className="text-lg font-semibold text-gray-800">
      Tổng biến thể:
    </span>
    <span className="ml-2 text-lg font-bold text-green-600">
      {total.toLocaleString()}
    </span>
  </div>
        <Link
          to="/admin/variant-delete"
          className="px-3 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 border border-red-300 shadow transition"
        >
          Xem biến thể đã xóa
        </Link>
      </div>
<div className="mb-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
  <Select
  showSearch
  allowClear
  placeholder="Chọn sản phẩm"
  className="w-full"
  value={productId}
  onChange={(value) => setProductId(value || undefined)}
  optionFilterProp="label"
  options={productOptions.map((product) => ({
    value: product._id,
    label: product.name,
  }))}
/>

  <input
    type="text"
    placeholder="Tìm theo SKU"
    value={searchSku}
    onChange={(e) => setSearchSku(e.target.value)}
    className="border px-3 py-2 rounded w-full"
  />
  <input
    type="text"
    placeholder="Lọc theo size"
    value={filterSize || ""}
    onChange={(e) => setFilterSize(e.target.value || undefined)}
    className="border px-3 py-2 rounded w-full"
  />
  <input
    type="text"
    placeholder="Lọc theo màu"
    value={filterColor || ""}
    onChange={(e) => setFilterColor(e.target.value || undefined)}
    className="border px-3 py-2 rounded w-full"
  />
  <div className="flex gap-2">
   <input
  type="text"
  placeholder="Giá từ"
  value={minPrice !== undefined ? minPrice.toLocaleString() : ""}
  onChange={(e) => {
    const raw = e.target.value.replace(/,/g, ""); // loại dấu ,
    const number = raw ? parseInt(raw) : undefined;
    setMinPrice(number);
  }}
  className="border px-3 py-2 rounded w-full"
/>

  <input
  type="text"
  placeholder="Đến"
  value={maxPrice !== undefined ? maxPrice.toLocaleString() : ""}
  onChange={(e) => {
    const raw = e.target.value.replace(/,/g, ""); // loại dấu ,
    const number = raw ? parseInt(raw) : undefined;
    setMaxPrice(number);
  }}
  className="border px-3 py-2 rounded w-full"
/>

  </div>
</div>

      <table className="min-w-full border border-gray-300 text-sm">
        <thead className="bg-gray-100 sticky top-0 z-10">
          <tr>
            {["STT", "Tên sản phẩm", "Sku", "Size", "Màu sắc", "Ảnh", "Giá gốc", "Giá KM", "Tồn kho", "Ngày cập nhật", "Thao tác"].map(header => (
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
          {currentVariants.length === 0 ? (
            <tr>
              <td colSpan={12} className="text-center py-6 text-gray-500">Đang tải biến thể</td>
            </tr>
          ) : (
            currentVariants.map((item, index) => (
              <tr key={item._id} className="even:bg-gray-50 hover:bg-gray-100 transition-colors">
                <td className=" px-4 py-2">{(page - 1) * perPage + index + 1}</td>
<td className=" px-4 py-2">{(item.product_id as { name?: string })?.name || "Không có"}</td>
                <td className=" px-4 py-2">{item.sku}</td>
                <td className=" px-4 py-2">{item.size}</td>
                <td className=" px-4 py-2">{item.color}</td>
                <td className=" px-4 py-2">
                  <img
                    src={item.image}
                    alt=""
                    className="w-12 h-12 object-cover rounded-md shadow-sm"
                  />
                </td>
                <td className=" px-4 py-2">{item.price.toLocaleString()}₫</td>
                <td className=" px-4 py-2">{item.discount_price?.toLocaleString() || "—"}₫</td>
                <td className=" px-4 py-2">{item.stock_quantity}</td>
               <td className=" px-4 py-2 text-sm text-gray-600">
  {new Date(item.updated_at as string).toLocaleDateString()}
</td>
                <td className=" px-4 py-2">
                  <div className="flex gap-2">
                    <Link
                      to={`/admin/variant-edit/${item._id}`}
                      className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                    >
                      Sửa
                    </Link>
                    <Popconfirm
                      title="Bạn có chắc muốn xóa?"
                      okText="Có"
                      cancelText="Không"
                      onConfirm={() => handleDelete(item._id)}
                    >
                      <button className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition">
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

      <div className="mt-6 flex justify-center items-center gap-2 text-sm select-none">
        <button disabled={page === 1} onClick={() => setPage(1)} className={`px-3 py-1 rounded-lg border transition font-medium ${page === 1 ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"}`} title="Trang đầu">«</button>
        <button disabled={page === 1} onClick={() => setPage(prev => Math.max(prev - 1, 1))} className={`px-3 py-1 rounded-lg border transition font-medium ${page === 1 ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"}`} title="Trang trước">‹</button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i} onClick={() => setPage(i + 1)} className={`px-3 py-1 rounded-lg border transition font-semibold ${page === i + 1 ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"}`}>{i + 1}</button>
        ))}
        <button disabled={page === totalPages} onClick={() => setPage(prev => Math.min(prev + 1, totalPages))} className={`px-3 py-1 rounded-lg border transition font-medium ${page === totalPages ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"}`} title="Trang sau">›</button>
        <button disabled={page === totalPages} onClick={() => setPage(totalPages)} className={`px-3 py-1 rounded-lg border transition font-medium ${page === totalPages ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"}`} title="Trang cuối">»</button>
      </div>
    </div>
  );
};

export default VariantList;