
import type { OrderStatus } from "types/order";

export const ORDER_STATUS_VI: Record<OrderStatus, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  shipped: "Đang giao",
  completed: "Hoàn thành",
  cancelled: "Đã huỷ",
};
