"use client";
import {
  formatCurrency,
  formatDateTimeToDateString,
  formatDateTimeToTimeString,
  getVietnameseOrderStatus,
} from "@/lib/utils";
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
import { useAppStore } from "@/components/app-provider";
import {
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  Receipt,
  ShoppingBag,
  X,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function OrdersCart() {
  const { data, refetch } = useGuestGetOrderListQuery();
  console.log(data);
  const orders = useMemo(() => data?.payload.data ?? [], [data]);
  // console.log(orders);
  const socket = useAppStore((stase) => stase.socket);
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

  // Custom badge với các biến thể màu sắc
  const StatusBadge = ({
    status,
    children,
  }: {
    status: (typeof OrderStatus)[keyof typeof OrderStatus];
    children: React.ReactNode;
  }) => {
    const getStatusStyles = () => {
      switch (status) {
        case "Paid":
          return "bg-blue-100 text-blue-800 hover:bg-blue-100";
        case "Processing":
          return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
        case "Pending":
          return "bg-gray-100 text-gray-800 hover:bg-gray-100";
        case "Delivered":
          return "bg-green-100 text-green-800 hover:bg-green-100";
        case "Rejected":
          return "bg-red-100 text-red-800 hover:bg-red-100";
        default:
          return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      }
    };

    // Thêm icon tương ứng với trạng thái
    const getStatusIcon = () => {
      switch (status) {
        case "Paid":
          return <CreditCard className="h-3 w-3 mr-1" />;
        case "Processing":
          return <Clock className="h-3 w-3 mr-1 animate-pulse" />;
        case "Pending":
          return <Clock className="h-3 w-3 mr-1" />;
        case "Delivered":
          return <CheckCircle2 className="h-3 w-3 mr-1" />;
        case "Rejected":
          return <X className="h-3 w-3 mr-1" />;
        default:
          return null;
      }
    };
    return (
      <Badge
        variant="outline"
        className={`${getStatusStyles()} border-none flex items-center`}
      >
        {getStatusIcon()}
        {children}
      </Badge>
    );
  };

  return (
    <>
      <Card className="max-w-md mx-auto shadow-md border-blue-100">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white pb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Đơn hàng của bạn
            </CardTitle>
            <Badge
              variant="outline"
              className="bg-white/20 text-white border-none"
            >
              <Calendar className="h-3 w-3 mr-1" />{" "}
              {formatDateTimeToDateString(
                data?.payload.data[0].createdAt as unknown as string
              )}
            </Badge>
          </div>
          <p className="text-sm mt-1 opacity-90">
            Bàn #{data?.payload.data[0].tableNumber}
          </p>
        </CardHeader>

        <CardContent className="p-4">
          <div className="flex justify-between text-sm text-gray-500 mb-3">
            <span className="flex items-center gap-1">
              <ShoppingBag className="h-4 w-4" /> Tổng đơn:{" "}
              {waitingForPaying.quantity + paid.quantity} món
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" /> Thời gian:{" "}
              {formatDateTimeToTimeString(
                data?.payload.data[0].createdAt as unknown as string
              )}
            </span>
          </div>

          <Separator className="my-2" />

          <ScrollArea className="h- pr-3">
            <div className="space-y-4 pt-2">
              {orders.map((order, index) => (
                <div
                  key={order.id}
                  className="flex gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-center bg-blue-100 text-blue-600 h-6 w-6 rounded-full font-medium text-sm flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-shrink-0 relative">
                    <div className="overflow-hidden rounded-lg h-20 w-20 border border-gray-100">
                      <Image
                        src={order.dishSnapshot.image}
                        alt={order.dishSnapshot.name}
                        height={100}
                        width={100}
                        quality={100}
                        className="object-cover h-full w-full"
                      />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="text-sm">{order.dishSnapshot.name}</h3>
                    </div>
                    <div className="flex items-center mt-1">
                      <span className="text-sm font-semibold text-blue-700">
                        {formatCurrency(order.dishSnapshot.price)}
                      </span>
                      <span className="mx-1 text-gray-400">×</span>
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-700 hover:bg-blue-100"
                      >
                        {order.quantity}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-auto flex justify-center items-center">
                    <StatusBadge status={order.status}>
                      {getVietnameseOrderStatus(order.status)}
                    </StatusBadge>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="flex flex-col p-0">
          <Separator />
          {paid.quantity !== 0 && (
            <div className="w-full p-3 bg-green-50 flex justify-between items-center">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-medium">
                  Đã thanh toán · {paid.quantity} món
                </span>
              </div>
              <span className="font-bold text-green-700">
                {formatCurrency(paid.price)}
              </span>
            </div>
          )}

          <div className="w-full p-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              <span className="font-medium">
                Chưa thanh toán · {waitingForPaying.quantity} món
              </span>
            </div>
            <span className="font-bold">
              {formatCurrency(waitingForPaying.price)}
            </span>
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
