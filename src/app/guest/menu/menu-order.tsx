"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useGetDishList } from "@/queries/useDish";
import { formatCurrency } from "@/lib/utils";
import Quantity from "./quantity";
import { GuestCreateOrdersBodyType } from "@/schemaValidations/guest.schema";

export default function MenuOrder() {
  const { data } = useGetDishList();
  const dishes = data?.payload.data ?? [];
  const [orders, setOrders] = useState<GuestCreateOrdersBodyType>([]);

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

  return (
    <>
      {dishes.map((dish) => (
        <div key={dish.id} className="flex gap-4">
          <div className="flex-shrink-0">
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
        <Button className="w-full justify-between">
          <span>Giỏ hàng · {orders.length} món</span>
          <span>{formatCurrency(totalPrice)}</span>
        </Button>
      </div>
    </>
  );
}
