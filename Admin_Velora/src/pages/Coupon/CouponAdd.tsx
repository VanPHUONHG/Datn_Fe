import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { message, Switch, Select, DatePicker } from "antd";
import { useNavigate } from "react-router-dom";
import { createCoupon } from "services/coupon/coupon.service";
import type { ICoupon } from "types/coupon";
import dayjs, { Dayjs } from "dayjs";

const { RangePicker } = DatePicker;

type CouponFormInput = Omit<
  ICoupon,
  "_id" | "createdAt" | "updatedAt" | "start_date" | "end_date"
> & {
  date_range: [Dayjs, Dayjs];
};

const CouponAdd: React.FC = () => {
  const nav = useNavigate();

  const {
  register,
  handleSubmit,
  control,
  watch,
  reset,
  formState: { errors },
} = useForm<CouponFormInput>({
  defaultValues: {
    code: "",
    discount_type: "percent",
    discount_value: 0,
    max_discount: 0,
    min_purchase: 0,
    is_active: true,
    date_range: [dayjs(), dayjs().add(7, "day")],
  },
});

const discountType = watch("discount_type");

// Reset khi đổi loại giảm giá
useEffect(() => {
  reset({
    code: "",
    discount_type: discountType, // giữ loại mới được chọn
    discount_value: 0,
    max_discount: 0,
    min_purchase: 0,
    is_active: true,
    date_range: [dayjs(), dayjs().add(7, "day")],
  });
}, [discountType, reset]);


  const onSubmit = async (data: CouponFormInput) => {
    try {
      const [start, end] = data.date_range;
      const payload: Omit<ICoupon, "_id" | "createdAt" | "updatedAt"> = {
        ...data,
        start_date: start.toISOString(),
        end_date: end.toISOString(),
      };
      delete (payload as any).date_range;

      await createCoupon(payload);
      message.success("Tạo mã khuyến mãi thành công");
      nav("/admin/coupon-list");
    } catch (error: any) {
      const errMsg = error?.response?.data?.message || "Đã xảy ra lỗi";
      message.error(errMsg);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-xl">
      <h2 className="text-3xl font-bold mb-8 text-center">Thêm mã giảm giá</h2>
      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <label className="block font-semibold mb-1">Mã khuyến mãi</label>
          <input
            {...register("code", { required: "Không được để trống" })}
            className="w-full border rounded p-2"
            placeholder="Nhập mã"
          />
          {errors.code && (
            <p className="text-red-500 text-sm">{errors.code.message}</p>
          )}
        </div>

        <div>
          <label className="block font-semibold mb-1">Loại giảm giá</label>
          <Controller
            name="discount_type"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                className="w-full"
                onChange={(value) => field.onChange(value)}
                value={field.value}
              >
                <Select.Option value="percent">Phần trăm (%)</Select.Option>
                <Select.Option value="fixed">Cố định (VNĐ)</Select.Option>
              </Select>
            )}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Giá trị giảm</label>
          <input
            type="number"
            {...register("discount_value", {
              required:
                discountType === "percent" ? "Không được để trống" : false,
              min:
                discountType === "percent"
                  ? { value: 1, message: "Phải ≥ 1%" }
                  : undefined,
              max:
                discountType === "percent"
                  ? { value: 100, message: "Không được vượt quá 100%" }
                  : undefined,
            })}
            className="w-full border rounded p-2"
            placeholder={
              discountType === "percent" ? "Nhập % giảm" : "Không áp dụng"
            }
            disabled={discountType === "fixed"}
          />
          {errors.discount_value && (
            <p className="text-red-500 text-sm">
              {errors.discount_value.message}
            </p>
          )}
        </div>

        <div>
          <label className="block font-semibold mb-1">Giảm tối đa</label>
          <input
            type="number"
            {...register("max_discount", { min: 0 })}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">
            Giá trị mua tối thiểu
          </label>
          <input
            type="number"
            {...register("min_purchase", { min: 0 })}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">
            Khoảng thời gian áp dụng
          </label>
          <Controller
            name="date_range"
            control={control}
            rules={{ required: "Chọn khoảng thời gian" }}
            render={({ field }) => (
              <RangePicker
                {...field}
                value={field.value}
                onChange={(dates) => field.onChange(dates as [Dayjs, Dayjs])}
                className="w-full"
              />
            )}
          />
          {errors.date_range && (
            <p className="text-red-500 text-sm">Vui lòng chọn ngày</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block font-semibold mb-1">Kích hoạt</label>
          <Controller
            name="is_active"
            control={control}
            render={({ field }) => (
              <Switch checked={field.value} onChange={field.onChange} />
            )}
          />
        </div>

        <div className="md:col-span-2 text-center mt-4">
          <button
            type="submit"
            className="bg-green-700 hover:bg-green-800 text-white font-semibold py-2 px-6 rounded"
          >
            Tạo mã
          </button>
        </div>
      </form>
    </div>
  );
};

export default CouponAdd;
