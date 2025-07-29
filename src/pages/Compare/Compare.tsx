import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { addToCart } from "services/cart/cart.service";
import { getAllProducts } from "services/product/product.service";
import { getAllVariantsByProductId, getVariantById } from "services/productVariant/productVariant.service";
import type { Product } from "types/product";
import type { IProductVariant } from "types/productVariant";

const Compare = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [variantsMap, setVariantsMap] = useState<{ [productId: string]: IProductVariant[] }>({});
  const [selectedProductIds, setSelectedProductIds] = useState<{ p1: string; p2: string }>({ p1: "", p2: "" });
  const [selectedVariantIds, setSelectedVariantIds] = useState<{ v1: string; v2: string }>({ v1: "", v2: "" });
  const [variants, setVariants] = useState<{ v1: IProductVariant | null; v2: IProductVariant | null }>({ v1: null, v2: null });

  useEffect(() => {
    getAllProducts().then((data) => setProducts(data));
  }, []);

  useEffect(() => {
    const loadVariants = async (productId: string) => {
      const variants = await getAllVariantsByProductId(productId);
      setVariantsMap((prev) => ({ ...prev, [productId]: variants }));
    };

    if (selectedProductIds.p1 && !variantsMap[selectedProductIds.p1]) {
      loadVariants(selectedProductIds.p1);
    }
    if (selectedProductIds.p2 && !variantsMap[selectedProductIds.p2]) {
      loadVariants(selectedProductIds.p2);
    }
  }, [selectedProductIds]);

  useEffect(() => {
    const fetchDetails = async () => {
      const [v1, v2] = await Promise.all([
        selectedVariantIds.v1 ? getVariantById(selectedVariantIds.v1) : null,
        selectedVariantIds.v2 ? getVariantById(selectedVariantIds.v2) : null,
      ]);
      setVariants({ v1, v2 });
    };
    fetchDetails();
  }, [selectedVariantIds]);

  const renderValue = (v: IProductVariant | null, key: keyof IProductVariant) => {
    if (!v) return "-";
    if (key === "price") {
      return v.discount_price ? (
        <>
          <span className="line-through text-red-400 mr-2">{v.price.toLocaleString()}₫</span>
          <span className="text-green-500">{v.discount_price.toLocaleString()}₫</span>
        </>
      ) : (
        <span>{v.price.toLocaleString()}₫</span>
      );
    }
    if (key === "product_id") {
      return typeof v.product_id === "object" ? v.product_id.name : "";
    }
    return v[key];
  };

const lastToastTimeRef = useRef<number>(0);

const handleAddToCart = async (variantId?: string, productId?: string) => {
  if (!variantId || !productId) return;

  try {
    await addToCart({ product_id: productId, variant_id: variantId, quantity: 1 });

    const now = Date.now();
       if (now - lastToastTimeRef.current >= 3000) {
      toast.success(" Đã thêm vào giỏ hàng!");
      lastToastTimeRef.current = now;
    }

    window.dispatchEvent(new Event("update-wishlist-cart"));
  }  catch (error: any) {
    const message = error?.response?.data?.message || "Thêm vào giỏ hàng thất bại!";
    toast.error(` ${message}`, {
    toastId: "add-to-cart-error", 
  });
  }
};

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">So sánh sản phẩm</h2>

<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-10">
        {[1, 2].map((num) => {
          const productId = selectedProductIds[`p${num}` as "p1" | "p2"];
          const variantId = selectedVariantIds[`v${num}` as "v1" | "v2"];
          const variants = variantsMap[productId] || [];

          return (
            <div key={num}>
              <label className="block mb-1 text-sm font-medium text-gray-700">Chọn sản phẩm {num}</label>
              <select
                value={productId}
                onChange={(e) => {
                  setSelectedProductIds((prev) => ({ ...prev, [`p${num}`]: e.target.value }));
                  setSelectedVariantIds((prev) => ({ ...prev, [`v${num}`]: "" }));
                }}
                className="w-full border rounded px-3 py-2 mb-2"
              >
                <option value="">-- Chọn sản phẩm --</option>
                {products.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>

              {productId && (
                <>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Chọn biến thể</label>
                  <select
                    value={variantId}
                    onChange={(e) => setSelectedVariantIds((prev) => ({ ...prev, [`v${num}`]: e.target.value }))}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">-- Chọn biến thể --</option>
                    {variants.map((v) => (
                      <option key={v._id} value={v._id}>
                        {v.color} - {v.size}
                      </option>
                    ))}
                  </select>
                </>
              )}
            </div>
          );
        })}
      </div>

      {variants.v1 && variants.v2 ? (
<div className="overflow-x-auto w-full">
<table className="min-w-[600px] w-full border border-gray-200 text-sm text-left bg-white shadow-md rounded-md overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 font-semibold">Thuộc tính</th>
                <th className="p-3 font-semibold text-blue-600">Sản phẩm 1</th>
                <th className="p-3 font-semibold text-green-600">Sản phẩm 2</th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: "Ảnh", key: "image" },
                { label: "Tên sản phẩm", key: "product_id" },
                { label: "SKU", key: "sku" },
                { label: "Giá", key: "price" },
                { label: "Size", key: "size" },
                { label: "Màu", key: "color" },
              ].map((row) => (
                <tr key={row.key} className="border-t">
                  <td className="p-3 font-medium">{row.label}</td>
               <td className="p-3">
  {row.key === "image" ? (
    <img src={variants.v1?.image} alt="" className="w-30" />
  ) : (
    renderValue(variants.v1, row.key as keyof IProductVariant)
  )}
</td>
<td className="p-3">
  {row.key === "image" ? (
    <img src={variants.v2?.image} alt="" className="w-30" />
  ) : (
    renderValue(variants.v2, row.key as keyof IProductVariant)
  )}
</td>

                </tr>
              ))}

              <tr className="border-t bg-gray-50">
  <td className="p-3 font-medium">Thao tác</td>
  <td className="p-3">
    <button
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      onClick={() => handleAddToCart(variants.v1?._id, selectedProductIds.p1)}
      disabled={!variants.v1}
    >
      Thêm vào giỏ
    </button>
  </td>
  <td className="p-3">
    <button
      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      onClick={() => handleAddToCart(variants.v2?._id, selectedProductIds.p2)}
      disabled={!variants.v2}
    >
      Thêm vào giỏ
    </button>
  </td>
</tr>

            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-500 py-10">Vui lòng chọn đủ 2 biến thể để so sánh.</p>
      )}
    </div>
  );
};

export default Compare;
