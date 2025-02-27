"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useGetDishList } from "@/queries/useDish";
import { cn, formatCurrency, handleErrorApi } from "@/lib/utils";
import Quantity from "./quantity";
import { GuestCreateOrdersBodyType } from "@/schemaValidations/guest.schema";
import { useGuestOrderMutation } from "@/queries/useGuest";
import { useRouter } from "next/navigation";
import { DishStatus } from "@/constants/type";

export default function MenuOrder() {
  const { data } = useGetDishList();
  const dishes = data?.payload.data ?? [];
  const [orders, setOrders] = useState<GuestCreateOrdersBodyType>([]);
  const { mutateAsync } = useGuestOrderMutation();
  const router = useRouter();

  const totalPrice = dishes.reduce((result, dish) => {
    const order = orders.find((order) => order.dishId == dish.id);
    if (!order) return result;
    return result + order.quantity * dish.price;
  }, 0);

  const handleQuantityChange = (dishId: number, quantity: number) => {
    // prevOrders đại diện cho danh sách đơn hàng hiện tại trước khi cập nhật.
    setOrders((prevOrders) => {
      if (quantity == 0) {
        // loại bỏ món ăn có dishId trùng với dishId cần cập nhật
        // .filter(callback) tạo một mảng mới chỉ chứa các phần tử thỏa mãn điều kiện trong callback.
        return prevOrders.filter((order) => order.dishId != dishId);
      }
      const index = prevOrders.findIndex((order) => order.dishId == dishId);

      // Nếu index == -1 (món ăn chưa có trong đơn hàng), thêm mới bằng cách spread (...prevOrders) và thêm {dishId, quantity}
      if (index == -1) {
        return [...prevOrders, { dishId, quantity }];
      }

      // Nếu món ăn đã có → Cập nhật số lượng
      // Tạo bản sao newOrders từ prevOrders để đảm bảo không thay đổi trực tiếp state (tránh mutation).
      const newOrders = [...prevOrders];
      newOrders[index] = { ...newOrders[index], quantity };
      return newOrders;
    });
  };
  // console.log(orders);

  const handleOrder = async () => {
    try {
      await mutateAsync(orders);
      router.push("/guest/orders");
    } catch (error) {
      handleErrorApi({ error });
    }
  };

  return (
    <>
      {dishes
        .filter((dish) => dish.status != DishStatus.Hidden)
        .map((dish) => (
          <div
            key={dish.id}
            className={cn("flex gap-4 ", {
              "pointer-events-none": dish.status == DishStatus.Unavailable,
            })}
          >
            <div className="flex-shrink-0 relative">
              {dish.status == DishStatus.Unavailable && (
                <span className="absolute inset-0 flex items-center justify-center text-sm ">
                  Hết hàng
                </span>
              )}
              <Image
                src={dish.image}
                alt={dish.name}
                height={100}
                width={100}
                quality={100}
                className="object-cover w-[80px] h-[80px] rounded-md"
              />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm">{dish.name}</h3>
              <p className="text-xs">{dish.description}</p>
              <p className="text-xs font-semibold">
                {formatCurrency(dish.price)}
              </p>
            </div>
            <div className="flex-shrink-0 ml-auto flex justify-center items-center">
              <Quantity
                onChange={(value) => handleQuantityChange(dish.id, value)}
                value={
                  orders.find((order) => order.dishId == dish.id)?.quantity ?? 0
                }
              />
            </div>
          </div>
        ))}
      <div className="sticky bottom-0">
        <Button
          className="w-full justify-between"
          onClick={handleOrder}
          disabled={orders.length == 0}
        >
          <span>Đặt hàng · {orders.length} món</span>
          <span>{formatCurrency(totalPrice)}</span>
        </Button>
      </div>
    </>
  );
}
