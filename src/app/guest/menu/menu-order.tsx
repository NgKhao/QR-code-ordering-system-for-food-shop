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
import { Card, CardContent } from "@/components/ui/card";
import { ChefHat, Clock, ShoppingBag, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
      <div className="space-y-3">
        {dishes
          .filter((dish) => dish.status !== DishStatus.Hidden)
          .map((dish) => (
            <Card
              key={dish.id}
              className={`overflow-hidden transition-all duration-200 ${
                dish.status === DishStatus.Unavailable
                  ? "opacity-60"
                  : "hover:shadow-md"
              }`}
            >
              <CardContent className="p-0">
                <div className="flex p-3 gap-3">
                  <div className="relative flex-shrink-0">
                    <div className="overflow-hidden rounded-lg h-24 w-24">
                      <Image
                        src={dish.image}
                        alt={dish.name}
                        height={100}
                        width={100}
                        quality={100}
                        className="object-cover h-full w-full transition-all duration-300 hover:scale-110"
                      />
                    </div>

                    {dish.status === DishStatus.Unavailable && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg">
                        <Badge
                          variant="outline"
                          className="bg-white/70 border-none font-semibold"
                        >
                          Hết hàng
                        </Badge>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col">
                    <h3 className="font-medium text-gray-900 text-sm mb-1">
                      {dish.name}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mb-1">
                      {dish.description}
                    </p>
                    <p className="text-sm font-bold text-orange-600 mt-auto">
                      {formatCurrency(dish.price)}
                    </p>
                  </div>

                  <div className="flex items-center">
                    <Quantity
                      onChange={(value) => handleQuantityChange(dish.id, value)}
                      value={
                        orders.find((order) => order.dishId == dish.id)
                          ?.quantity ?? 0
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      <div className="sticky bottom-4 z-10 pt-2">
        <Card className="shadow-lg border-orange-200 animate-pulse">
          <CardContent className="p-0">
            <Button
              className="w-full justify-between py-6 text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 border-none"
              onClick={handleOrder}
              disabled={orders.length == 0}
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                <span className="font-bold">
                  Đặt hàng · {orders.length} món
                </span>
              </div>
              <span className="font-bold">{formatCurrency(totalPrice)}</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
