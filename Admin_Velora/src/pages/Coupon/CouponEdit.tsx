import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { message, Switch, Select, DatePicker } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { getCouponById, updateCoupon } from "services/coupon/coupon.service";
import type { ICoupon } from "types/coupon";
import dayjs, { Dayjs } from "dayjs";

const { RangePicker } = DatePicker;

type CouponFormInput = Omit<
  ICoupon,
  "_id" | "createdAt" | "updatedAt" | "start_date" | "end_date"
> & {
  date_range: [Dayjs, Dayjs];
};

const CouponEdit: React.FC = () => {
  const nav = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<CouponFormInput>();

  const discountType = watch("discount_type");

  useEffect(() => {
    const fetchCoupon = async () => {
      try {
        if (!id) return;
        const res = await getCouponById(id);
        const coupon: ICoupon = res.data;

        reset({
          code: coupon.code,
          discount_type: coupon.discount_type,
          discount_value: coupon.discount_value,
          max_discount: coupon.max_discount || 0,
          min_purchase: coupon.min_purchase || 0,
          is_active: coupon.is_active,
          date_range: [dayjs(coupon.start_date), dayjs(coupon.end_date)],
        });
      } catch (error) {
        console.error("Lỗi khi tải coupon:", error);
        message.error("Không thể tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    fetchCoupon();
  }, [id, reset]);

  // Reset lại form khi đổi loại giảm giá
  useEffect(() => {
    reset((prev) => ({
      ...prev,
      discount_type: discountType,
      discount_value: 0,
      max_discount: 0,
      min_purchase: 0,
    }));
  }, [discountType, reset]);

  const onSubmit = async (data: CouponFormInput) => {
    if (!id) return;
    try {
      const [start, end] = data.date_range;
      const payload: Partial<ICoupon> = {
        ...data,
        start_date: start.toISOString(),
        end_date: end.toISOString(),
      };
      delete (payload as any).date_range;

      await updateCoupon(id, payload);
      message.success("Cập nhật mã khuyến mãi thành công");
      nav("/admin/coupon-list");
    } catch (error: any) {
      const errMsg = error?.response?.data?.message || "Lỗi cập nhật";
      message.error(errMsg);
    }
  };

  if (loading)
    return (
      <div className="p-6 text-center text-blue-500">
        Đang tải dữ liệu...
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-xl">
      <h2 className="text-3xl font-bold mb-8 text-center">
        Chỉnh sửa mã giảm giá
      </h2>
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
                onChange={(val) => field.onChange(val)}
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
            className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-6 rounded"
          >
            Cập nhật mã
          </button>
        </div>
      </form>
    </div>
  );
};

export default CouponEdit;
