"use client";
import { formatCurrency, getVietnameseOrderStatus } from "@/lib/utils";
import { useGuestGetOrderListQuery } from "@/queries/useGuest";
import React, { useEffect, useMemo } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  PayGuestOrdersResType,
  UpdateOrderResType,
} from "@/schemaValidations/order.schema";
import { toast } from "@/hooks/use-toast";
import { OrderStatus } from "@/constants/type";
import { useAppContext } from "@/components/app-provider";

export default function OrdersCart() {
  const { data, refetch } = useGuestGetOrderListQuery();
  const orders = useMemo(() => data?.payload.data ?? [], [data]);
  // console.log(orders);
  const { socket } = useAppContext();
  const { waitingForPaying, paid } = useMemo(() => {
    return orders.reduce(
      (result, order) => {
        if (
          order.status == OrderStatus.Delivered ||
          order.status == OrderStatus.Processing ||
          order.status == OrderStatus.Pending
        ) {
          return {
            ...result,
            waitingForPaying: {
              price:
                result.waitingForPaying.price +
                order.dishSnapshot.price * order.quantity,
              quantity: result.waitingForPaying.quantity + order.quantity,
            },
          };
        }
        if (order.status == OrderStatus.Paid) {
          return {
            ...result,
            paid: {
              price:
                result.paid.price + order.dishSnapshot.price * order.quantity,
              quantity: result.paid.quantity + order.quantity,
            },
          };
        }
        return result;
      },
      {
        waitingForPaying: {
          price: 0,
          quantity: 0,
        },
        paid: {
          price: 0,
          quantity: 0,
        },
      }
    );
  }, [orders]);

  useEffect(() => {
    if (socket?.connected) {
      onConnect();
    }
    function onConnect() {
      console.log(socket?.id);
    }

    function onDisconnect() {
      console.log("disconnect");
    }

    function onUpdateOrder(data: UpdateOrderResType["data"]) {
      console.log(data);
      const {
        dishSnapshot: { name },
        quantity,
        status,
      } = data;
      toast({
        description: `Món ${name} (SL: ${quantity}) vừa được cập nhật sang trạng thái "${getVietnameseOrderStatus(
          status
        )}"`,
      });
      refetch();
    }

    function onPayment(data: PayGuestOrdersResType["data"]) {
      const { guest } = data[0];
      toast({
        description: `${guest?.name} tại bàn ${guest?.tableNumber} thanh toán thành công ${data.length} đơn`,
      });
      refetch();
    }
    socket?.on("update-order", onUpdateOrder);
    socket?.on("connect", onConnect);
    socket?.on("disconnect", onDisconnect);
    socket?.on("payment", onPayment);

    return () => {
      socket?.off("connect", onConnect);
      socket?.off("disconnect", onDisconnect);
      socket?.off("update-order", onUpdateOrder);
      socket?.off("payment", onPayment);
    };
  }, [refetch, socket]);

  return (
    <>
      {orders.map((order, index) => (
        <div key={order.id} className="flex gap-4 ">
          <div className="text-sm font-semibold">{index + 1}</div>
          <div className="flex-shrink-0 relative">
            <Image
              src={order.dishSnapshot.image}
              alt={order.dishSnapshot.name}
              height={100}
              width={100}
              quality={100}
              className="object-cover w-[80px] h-[80px] rounded-md"
            />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm">{order.dishSnapshot.name}</h3>
            <div className="text-xs font-semibold">
              {formatCurrency(order.dishSnapshot.price)} x{" "}
              <Badge className="px-1">{order.quantity}</Badge>
            </div>
          </div>
          <div className="flex-shrink-0 ml-auto flex justify-center items-center">
            <Badge variant={"outline"}>
              {getVietnameseOrderStatus(order.status)}
            </Badge>
          </div>
        </div>
      ))}
      {paid.quantity != 0 && (
        <div className="sticky bottom-0">
          <div className="w-full flex space-x-4 text-xl font-semibold">
            <span>Đơn đã thanh toán · {paid.quantity} món</span>
            <span>{formatCurrency(paid.price)}</span>
          </div>
        </div>
      )}
      <div className="sticky bottom-0">
        <div className="w-full flex space-x-4 text-xl font-semibold">
          <span>Đơn chưa thanh toán · {waitingForPaying.quantity} món</span>
          <span>{formatCurrency(waitingForPaying.price)}</span>
        </div>
      </div>
    </>
  );
}
