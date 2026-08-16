import type { OrderOut, OrderCreate, OrderStatus } from "~/types";

export const OrderApi = {
  // سفارش‌های خودِ کاربر لاگین‌شده -> GET /order (روت get_my_orders در بک‌اند)
  list: ($api: any) =>
    $api(`/order`, { method: "GET" }) as Promise<OrderOut[]>,

  get: ($api: any, orderId: number) =>
    $api(`/order/${orderId}`, { method: "GET" }) as Promise<OrderOut>,

  create: ($api: any, payload: OrderCreate) =>
    $api(`/order/create`, {
      method: "POST",
      body: payload,
    }) as Promise<OrderOut>,

  remove: ($api: any, orderId: number) =>
    $api(`/order/${orderId}`, { method: "DELETE" }) as Promise<void>,

  // -------- ادمین --------
  // TODO: این روت هنوز در بک‌اند وجود نداره. باید یه اندپوینت جدید مثل
  // GET /order/admin/all بسازی که همه‌ی سفارش‌ها رو (بدون فیلتر user_id)
  // با joinedload(Order.items) و joinedload(Order.user) برگردونه،
  // و پشت یه dependency مثل get_current_admin باشه (نه get_current_user).
  adminList: ($api: any) =>
    $api(`/order/admin/all`, { method: "GET" }) as Promise<OrderOut[]>,

  // TODO: این روت هم باید در بک‌اند اضافه بشه، مثلا:
  // PATCH /order/admin/{order_id}/status  با بدنه‌ی { status }
  // پشت get_current_admin، و مقدار status رو با enum OrderStatus بک‌اند چک کن.
  updateStatus: ($api: any, orderId: number, status: OrderStatus) =>
    $api(`/order/admin/${orderId}/status`, {
      method: "PATCH",
      body: { status },
    }) as Promise<OrderOut>,
};