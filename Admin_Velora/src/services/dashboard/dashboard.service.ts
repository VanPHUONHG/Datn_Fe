import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getDashboardOverview = async (range: number = 7) => {
  try {
    const res = await axios.get(`${API_URL}/dashboard/overview`, {
      params: { range },
    });
    return res.data.data;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu dashboard overview:", error);
    throw error;
  }
};



export const getRevenueByRange = async (range: number = 7) => {
  try {
    const res = await axios.get(`${API_URL}/dashboard/revenue` , {
  params: { range }
});
    return res.data.data; 
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu doanh thu:", error);
    throw error;
  }
};


export const getTopSellingProducts = async (limit = 5, range: string = "month") => {
  try {
    const res = await axios.get(`${API_URL}/dashboard/top-products`, {
      params: { limit, range },
    });
    return res.data.data; 
  } catch (error) {
    console.error("Lỗi khi lấy top sản phẩm bán chạy:", error);
    throw error;
  }
};
