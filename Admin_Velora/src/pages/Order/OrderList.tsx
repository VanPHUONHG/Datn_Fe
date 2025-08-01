import { DatePicker, Input, Tabs, Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getAllOrdersAdmin } from "services/order/order.service";
import type { IOrder } from "types/order";
import { ORDER_STATUS_VI } from "../../types/orderStatusMap";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const OrderList = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [page, setPage] = useState(1);
  const perPage = 20;

  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });

  useEffect(() => {
    getAllOrdersAdmin()
      .then(setOrders)
      .catch(console.error);
  }, []);
  
const formatCurrency = (value: string) => {
  const number = value.replace(/\D/g, ""); // chỉ giữ số
  return number.replace(/\B(?=(\d{3})+(?!\d))/g, ","); // thêm dấu phẩy phân cách
};

const parseCurrency = (value: string) => {
  return Number(value.replace(/,/g, "")); // bỏ dấu , để parse về số
};

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter ? order.status === statusFilter : true;

const matchesSearch = !searchTerm || (
  typeof order.user !== "string" &&
  order.user &&
  order.user.full_name.toLowerCase().includes(searchTerm.toLowerCase())
);


    const matchesDate =
      !dateRange ||
      (order.createdAt &&
        dayjs(order.createdAt).isBetween(
          dateRange[0].startOf("day"),
          dateRange[1].endOf("day"),
          null,
          "[]"
        ));

  const matchesPrice =
  (!priceRange.min || order.finalAmount >= parseCurrency(priceRange.min)) &&
  (!priceRange.max || order.finalAmount <= parseCurrency(priceRange.max));

    return matchesStatus && matchesSearch && matchesDate && matchesPrice;
  });

  const totalPages = Math.ceil(filteredOrders.length / perPage);
  const currentOrders = filteredOrders.slice((page - 1) * perPage, page * perPage);

const exportToExcel = (data: IOrder[]) => {
  const sheetData = data.map((order) => {
    const isGuest = typeof order.user === "string";
    const user = isGuest ? null : order.user;

    return {
      "Mã đơn": order._id,
"Tên khách": typeof order.user === "string" || !order.user ? "Guest" : (order.user as any).full_name,
      "SĐT": order.shippingAddress?.phone || "N/A",
      "Tổng tiền": order.finalAmount,
      "Ngày đặt": dayjs(order.createdAt).format("DD/MM/YYYY"),
      "Trạng thái":
        ORDER_STATUS_VI[order.status as keyof typeof ORDER_STATUS_VI] || "Không rõ",
    };
  });

  const ws = XLSX.utils.json_to_sheet(sheetData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Đơn hàng");
  XLSX.writeFile(wb, "don_hang.xlsx");
};





 const removeVietnameseTones = (str: string) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D");
};

const exportToPDF = () => {
  const doc = new jsPDF("l", "mm", "a4");

  const headers = [["STT", "Ten tai khoan", "SDT", "Tong tien", "Ngay dat", "Trang thai"]];

  const rows = filteredOrders.map((order, index) => [
    index + 1,
removeVietnameseTones(
  typeof order.user === "string" || !order.user ? "N/A" : order.user.full_name
),
    order.shippingAddress?.phone || "N/A",
    order.finalAmount.toLocaleString() + " đ",
    order.createdAt ? dayjs(order.createdAt).format("DD/MM/YYYY") : "N/A",
    removeVietnameseTones(ORDER_STATUS_VI[order.status as keyof typeof ORDER_STATUS_VI] || "Khong ro"),
  ]);

  autoTable(doc, {
    head: headers,
    body: rows,
    styles: { fontSize: 10 },
  });

  doc.save("don_hang.pdf");
};



  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Danh sách đơn hàng</h2>

      {/* Filters */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
        <Tabs
          activeKey={statusFilter || "all"}
          onChange={(key) => {
            setStatusFilter(key === "all" ? null : key);
            setPage(1);
          }}
          className="w-full md:w-auto"
        >
          <TabPane tab="Tất cả" key="all" />
          {Object.entries(ORDER_STATUS_VI).map(([key, label]) => (
            <TabPane key={key} tab={label} />
          ))}
        </Tabs>

        <div className="flex flex-wrap gap-4 items-center w-full md:w-auto">
          <Input
            placeholder="Tìm tên khách hàng..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            allowClear
            className="w-60"
          />

          <RangePicker
            format="DD/MM/YYYY"
            value={dateRange}
            onChange={(val) => {
              setDateRange(val as [dayjs.Dayjs, dayjs.Dayjs]);
              setPage(1);
            }}
            allowClear
          />

      <div className="flex items-center gap-2">
  <Input
    type="text"
    placeholder="1,000,000"
    value={priceRange.min}
    onChange={(e) => {
      const formatted = formatCurrency(e.target.value);
      setPriceRange({ ...priceRange, min: formatted });
      setPage(1);
    }}
    className="w-32"
  />
  <span>đến</span>
  <Input
    type="text"
    placeholder="2,000,000"
    value={priceRange.max}
    onChange={(e) => {
      const formatted = formatCurrency(e.target.value);
      setPriceRange({ ...priceRange, max: formatted });
      setPage(1);
    }}
    className="w-32"
  />
</div>



          <Button
            icon={<DownloadOutlined />}
            onClick={() => exportToExcel(filteredOrders)}
            className="bg-green-600 text-white hover:bg-green-700"
          >
            Xuất Excel
          </Button>

          <Button
            icon={<DownloadOutlined />}
            onClick={() => exportToPDF()}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            Xuất PDF
          </Button>
        </div>
      </div>

      {/* Table */}
      <table className="min-w-full border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            {["STT", "Tên tài khoản", "SĐT", "Tổng tiền", "Ngày đặt", "Trạng thái", "Thao tác"].map((h) => (
              <th key={h} className="border px-4 py-2 text-left text-gray-700 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentOrders.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center py-6 text-gray-500">
                Không tìm thấy đơn hàng nào
              </td>
            </tr>
          ) : (
            currentOrders.map((order, idx) => (
              <tr key={order._id} className="even:bg-gray-50 hover:bg-gray-100 transition-colors">
                <td className="border px-4 py-2">{(page - 1) * perPage + idx + 1}</td>
<td className="border px-4 py-2">
  {typeof order.user === "string" || !order.user ? "Người dùng đã bị xóa" : order.user.full_name}
</td>
                <td className="border px-4 py-2">{order.shippingAddress?.phone || "N/A"}</td>
                <td className="border px-4 py-2">{order.finalAmount.toLocaleString()} ₫</td>
                <td className="border px-4 py-2">{order.createdAt ? dayjs(order.createdAt).format("DD/MM/YYYY") : "N/A"}</td>
                <td className="border px-4 py-2 capitalize">{ORDER_STATUS_VI[order.status as keyof typeof ORDER_STATUS_VI] || "Không rõ"}</td>
                <td className="border px-4 py-2">
                  <div className="flex gap-3">
                    <Link to={`/admin/order-detail/${order._id}`} className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                      Chi tiết
                    </Link>
              {typeof order.user !== "string" && order.user ? (
  <Link to={`/admin/order-update/${order._id}`} className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">
    Cập nhật
  </Link>
) : (
  <span className="px-3 py-1 bg-gray-300 text-gray-600 rounded cursor-not-allowed">
    Không thể cập nhật
  </span>
)}

                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-6 overflow-x-auto">
        <div className="flex justify-center items-center gap-2 text-sm select-none w-max min-w-full px-2">
          <button disabled={page === 1} onClick={() => setPage(1)} className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50">«</button>
          <button disabled={page === 1} onClick={() => setPage((p) => Math.max(p - 1, 1))} className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50">‹</button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded border font-medium ${page === i + 1 ? "bg-blue-600 text-white" : "bg-white hover:bg-gray-100"}`}
            >
              {i + 1}
            </button>
          ))}
          <button disabled={page === totalPages} onClick={() => setPage((p) => Math.min(p + 1, totalPages))} className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50">›</button>
          <button disabled={page === totalPages} onClick={() => setPage(totalPages)} className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50">»</button>
        </div>
      </div>
    </div>
  );
};

export default OrderList;
