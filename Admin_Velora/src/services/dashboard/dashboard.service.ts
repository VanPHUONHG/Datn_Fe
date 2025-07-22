import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
export const getDashboardOverview = async (from?: string, to?: string) => {
  try {
    const params: any = {};
    if (from) params.from = from;
    if (to) params.to = to;

    const res = await axios.get(`${API_URL}/dashboard/overview`, {
      params,
    });
    return res.data.data;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu dashboard overview:", error);
    throw error;
  }
};

export const getRevenueByRange = async (from?: string, to?: string) => {
  try {
    const params: any = {};
    if (from) params.from = from;
    if (to) params.to = to;

    const res = await axios.get(`${API_URL}/dashboard/revenue`, {
      params,
    });
    return res.data.data;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu doanh thu:", error);
    throw error;
  }
};

export const getTopSellingProducts = async ({
  limit = 5,
  from,
  to,
}: {
  limit?: number;
  from?: string;
  to?: string;
} = {}) => {
  try {
    const params: any = { limit };
    if (from) params.from = from;
    if (to) params.to = to;

    const res = await axios.get(`${API_URL}/dashboard/top-products`, {
      params,
    });
    return res.data.data;
  } catch (error) {
    console.error("Lỗi khi lấy top sản phẩm bán chạy:", error);
    throw error;
  }
};
