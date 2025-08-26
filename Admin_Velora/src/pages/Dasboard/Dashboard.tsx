import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { getDashboardOverview, getRevenueByRange, getTopSellingProducts } from "services/dashboard/dashboard.service";

type RevenueItem = { day: string; revenue: number };
type FilterType = "7ngay" | "14ngay" | "30ngay";
type ChartType = "line" | "bar";

const Dashboard = () => {
  const [overviewData, setOverviewData] = useState<{
    totalProducts: number;
    totalVariants: number;
    totalBlogs: number;
    totalUsers: number;
    totalCoupons: number;
    totalOrders: number;
    totalRevenue: number;
    topSellingProducts: {
      name: string;
      sold: number;
      price: number;
      totalRevenue: number;
    }[];
  } | null>(null);

  const [chartType, setChartType] = useState<ChartType>("line");

  const [revenueData, setRevenueData] = useState<RevenueItem[]>([]);
  const [loadingRevenue, setLoadingRevenue] = useState(false);
const [fromDate, setFromDate] = useState<string | null>(null);
const [toDate, setToDate] = useState<string | null>(null);


  const [topProducts, setTopProducts] = useState<
  { name: string; sold: number; price: number; totalRevenue?: number }[]
>([]);

useEffect(() => {
  const fetchOverview = async () => {
    try {
      const data = fromDate && toDate
        ? await getDashboardOverview(fromDate, toDate)
        : await getDashboardOverview(); // Gọi không truyền ngày

      setOverviewData(data);
    } catch (err) {
      console.error("Lỗi khi fetch dashboard overview:", err);
    }
  };
  fetchOverview();
}, [fromDate, toDate]);

  // Fetch revenue chart
useEffect(() => {
  const fetchRevenue = async () => {
    try {
      setLoadingRevenue(true);

      const res = fromDate && toDate
        ? await getRevenueByRange(fromDate, toDate)
        : await getRevenueByRange();

      const mapped = res.map((item: any) => ({
        day: item._id,
        revenue: item.revenue,
      }))
       .sort((a: RevenueItem, b: RevenueItem) => {
    // Tách "dd/MM"
    const [dayA, monthA] = a.day.split("/").map(Number);
    const [dayB, monthB] = b.day.split("/").map(Number);

    // Tạo Date với năm hiện tại (hoặc có thể lấy từ backend nếu có)
    const dateA = new Date(2025, monthA - 1, dayA);
    const dateB = new Date(2025, monthB - 1, dayB);

    return dateA.getTime() - dateB.getTime();
  });
      setRevenueData(mapped);
    } catch (err) {
      console.error("Lỗi khi lấy doanh thu:", err);
    } finally {
      setLoadingRevenue(false);
    }
  };
  fetchRevenue();
}, [fromDate, toDate]);



useEffect(() => {
  const fetchTopProducts = async () => {
    try {
      const products = fromDate && toDate
        ? await getTopSellingProducts({ from: fromDate, to: toDate })
        : await getTopSellingProducts(); // Không truyền ngày

      setTopProducts(products);
    } catch (error) {
      console.error("Lỗi khi lấy top sản phẩm:", error);
    }
  };
  fetchTopProducts();
}, [fromDate, toDate]);

const totalRevenue = useMemo(() => {
  if (overviewData && Number(overviewData.totalRevenue) > 0) {
    return Number(overviewData.totalRevenue);
  }
  return revenueData.reduce((sum, item) => sum + item.revenue, 0);
}, [overviewData, revenueData]);

  const stats = overviewData
  ? [
      {
        label: "Sản phẩm",
        value: overviewData.totalProducts,
        link: "/admin/product-list",
        bg: "from-blue-500 via-indigo-500 to-purple-500",
      },
      {
        label: "Biến thể",
        value: overviewData.totalVariants,
        link: "/admin/variant-list",
        bg: "from-green-400 via-teal-500 to-green-700",
      },
      {
        label: "Blog",
        value: overviewData.totalBlogs,
        link: "/admin/blog-list",
        bg: "from-yellow-300 via-orange-400 to-red-400",
      },
      {
        label: "Tài khoản",
        value: overviewData.totalUsers,
        link: "/admin/user-list",
        bg: "from-purple-400 via-pink-500 to-red-500",
      },
      {
        label: "Mã khuyến mãi",
        value: overviewData.totalCoupons,
        link: "/admin/coupon-list",
        bg: "from-pink-400 via-fuchsia-500 to-purple-600",
      },
      {
        label: "Đơn hàng",
        value: overviewData.totalOrders,
        link: "/admin/order-list",
        bg: "from-red-400 via-orange-500 to-yellow-500",
      },
    ]
  : [];

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans">
      
      <h1 className="text-3xl font-bold text-gray-800 mb-10">Bảng điều khiển quản trị</h1>


{/* Bộ lọc ngày chung */}
<div className="flex flex-col sm:flex-row items-center justify-end gap-3 mb-6">
  <label className="text-sm font-medium text-gray-700">
    Từ ngày:
   <input
  type="date"
  value={fromDate ?? ""}
  onChange={(e) => setFromDate(e.target.value || null)}
  className="border rounded px-2 py-1 ml-2"
/>
  </label>
  <label className="text-sm font-medium text-gray-700">
    Đến ngày:
  <input
  type="date"
  value={toDate ?? ""}
  onChange={(e) => setToDate(e.target.value || null)}
  className="border rounded px-2 py-1 ml-2"
/>
  </label>
</div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {stats.map((item, idx) => (
          <Link
            key={idx}
            to={item.link}
            className={`p-6 rounded-xl shadow-md hover:shadow-xl transform hover:scale-[1.02] transition duration-300 bg-gradient-to-br ${item.bg} text-white`}
          >
            <h2 className="text-base font-medium opacity-90">{item.label}</h2>
            <p className="text-2xl font-bold mt-1">{item.value}</p>
          </Link>
        ))}
      </div>

      {/* Revenue chart */}
      <div className="bg-white rounded-xl shadow p-6 mb-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-3">
          <h2 className="text-2xl font-semibold text-gray-800">Biểu đồ doanh thu</h2>
          <div className="flex items-center gap-2">
        
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value as ChartType)}
              className="border rounded px-3 py-1 text-sm"
            >
              <option value="line">Biểu đồ đường</option>
              <option value="bar">Biểu đồ cột</option>
            </select>
          </div>
        </div>

        <p className="text-right text-base text-gray-600 font-medium mb-2">
          Tổng doanh thu:{" "}
          <span className="text-green-600 font-bold">
            {totalRevenue.toLocaleString()} ₫
          </span>
        </p>

        <ResponsiveContainer width="100%" height={300}>
          {chartType === "line" ? (
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis tickFormatter={(value: number) => `${(value / 1_000_000).toFixed(1)}tr`} />
              <Tooltip formatter={(value: any) => `${(+value).toLocaleString()} ₫`} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          ) : (
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis tickFormatter={(value: number) => `${(value / 1_000_000).toFixed(1)}tr`} />
              <Tooltip formatter={(value: any) => `${(+value).toLocaleString()} ₫`} />
              <Bar dataKey="revenue" fill="#3b82f6" barSize={40} radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Top Products */}
   <div className="bg-white rounded-xl shadow p-6">
  <h2 className="text-2xl font-semibold text-gray-800 mb-4">Top sản phẩm bán chạy</h2>
  <div className="flex justify-end mb-2">
</div>

  <table className="min-w-full text-sm text-left">
    <thead className="bg-gray-100 text-gray-700 font-semibold text-sm">
      <tr>
        <th className="px-4 py-2">#</th>
        <th className="px-4 py-2">Tên sản phẩm</th>
        <th className="px-4 py-2">Đơn giá</th>
        <th className="px-4 py-2">Số lượng bán</th>
        <th className="px-4 py-2">Tổng tiền</th>
      </tr>
    </thead>
    <tbody className="text-gray-800 text-sm">
      {topProducts.map((product, idx) => (
        <tr key={idx} className="hover:bg-gray-50 transition duration-200 border-b">
          <td className="px-4 py-2 font-medium">{idx + 1}</td>
          <td className="px-4 py-2">{product.name}</td>
          <td className="px-4 py-2">{product.price.toLocaleString()} ₫</td>
          <td className="px-4 py-2 text-blue-600 font-medium">{product.sold}</td>
          <td className="px-4 py-2 text-green-600 font-semibold">
            {(product.sold * product.price).toLocaleString()} ₫
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

    </div>
  );
};

export default Dashboard;
