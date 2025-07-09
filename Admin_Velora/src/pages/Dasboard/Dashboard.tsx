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

  const [filter, setFilter] = useState<FilterType>("7ngay");
  const [chartType, setChartType] = useState<ChartType>("line");

  const [revenueData, setRevenueData] = useState<RevenueItem[]>([]);
  const [loadingRevenue, setLoadingRevenue] = useState(false);

  const [overviewFilter, setOverviewFilter] = useState<FilterType>("7ngay");
const [revenueFilter, setRevenueFilter] = useState<FilterType>("7ngay");
const [topProductFilter, setTopProductFilter] = useState<FilterType>("7ngay");

  const [topProducts, setTopProducts] = useState<
  { name: string; sold: number; price: number; totalRevenue?: number }[]
>([]);

  // Fetch overview
  useEffect(() => {
    const fetchOverview = async () => {
      try {
            const range = overviewFilter === "7ngay" ? 7 : overviewFilter === "14ngay" ? 14 : 30;
        const data = await getDashboardOverview(range);
        setOverviewData(data);
      } catch (err) {
        console.error("Lỗi khi fetch dashboard overview:", err);
      }
    };
    fetchOverview();
  }, [overviewFilter]);

  // Fetch revenue chart
  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        setLoadingRevenue(true);
        const range = filter === "7ngay" ? 7 : filter === "14ngay" ? 14 : 30;
        const res = await getRevenueByRange(range);
        console.log("Dữ liệu từ getRevenueByRange:", res);

        const mapped = res.map((item: any) => ({
          day: item._id,
          revenue: item.revenue,
        }));
        console.log("mapped revenueData:", mapped);
        setRevenueData(mapped);
      } catch (err) {
        console.error("Lỗi khi lấy doanh thu:", err);
      } finally {
        setLoadingRevenue(false);
      }
    };
    fetchRevenue();
  }, [filter]);


 useEffect(() => {
  const fetchTopProducts = async () => {
    try {
      const range =
        topProductFilter === "7ngay" ? "week" : topProductFilter === "14ngay" ? "2week" : "month";

      // Lưu ý: backend chỉ xử lý "day", "week", "month"
      // Nên bạn cần chuẩn hóa lại
      const rangeConverted = topProductFilter === "7ngay"
        ? "week"
        : topProductFilter === "14ngay"
        ? "week" // fallback
        : "month";

      const products = await getTopSellingProducts(5, rangeConverted);
      setTopProducts(products);
    } catch (error) {
      console.error("Lỗi khi lấy top sản phẩm:", error);
    }
  };
  fetchTopProducts();
}, [topProductFilter]);

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
<div className="flex justify-end mb-4">
  <select
    value={overviewFilter}
    onChange={(e) => setOverviewFilter(e.target.value as FilterType)}
    className="border rounded px-3 py-1 text-sm"
  >
    <option value="7ngay">Tổng quan 7 ngày</option>
    <option value="14ngay">Tổng quan 14 ngày</option>
    <option value="30ngay">Tổng quan 30 ngày</option>
  </select>
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
              value={filter}
              onChange={(e) => setFilter(e.target.value as FilterType)}
              className="border rounded px-3 py-1 text-sm"
            >
              <option value="7ngay">7 ngày gần nhất</option>
              <option value="14ngay">14 ngày gần nhất</option>
              <option value="30ngay">30 ngày gần nhất</option>
            </select>
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
  <select
    value={topProductFilter}
    onChange={(e) => setTopProductFilter(e.target.value as FilterType)}
    className="border rounded px-3 py-1 text-sm"
  >
    <option value="7ngay">Top 7 ngày</option>
    <option value="14ngay">Top 14 ngày</option>
    <option value="30ngay">Top 30 ngày</option>
  </select>
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
