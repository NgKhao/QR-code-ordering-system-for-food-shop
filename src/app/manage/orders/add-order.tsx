"use client";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle, ShoppingCart, Users, Utensils } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  GuestLoginBody,
  GuestLoginBodyType,
} from "@/schemaValidations/guest.schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { TablesDialog } from "@/app/manage/orders/tables-dialog";
import { GetListGuestsResType } from "@/schemaValidations/account.schema";
import { Switch } from "@/components/ui/switch";
import GuestsDialog from "@/app/manage/orders/guests-dialog";
import { CreateOrdersBodyType } from "@/schemaValidations/order.schema";
import Quantity from "@/app/guest/menu/quantity";
import Image from "next/image";
import { cn, formatCurrency, handleErrorApi } from "@/lib/utils";
import { DishStatus } from "@/constants/type";
import { DishListResType } from "@/schemaValidations/dish.schema";
import { useGetDishList } from "@/queries/useDish";
import { useCreateGuestMutation } from "@/queries/useAccount";
import { useCreateOrderMutation } from "@/queries/useOrder";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function AddOrder() {
  const [open, setOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<
    GetListGuestsResType["data"][0] | null
  >(null);
  const [isNewGuest, setIsNewGuest] = useState(true);
  const [orders, setOrders] = useState<CreateOrdersBodyType["orders"]>([]);
  const { data } = useGetDishList();
  const dishes = useMemo(() => data?.payload.data ?? [], [data]);

  const totalPrice = useMemo(() => {
    return dishes.reduce((result, dish) => {
      const order = orders.find((order) => order.dishId === dish.id);
      if (!order) return result;
      return result + order.quantity * dish.price;
    }, 0);
  }, [dishes, orders]);

  const createOrderMutation = useCreateOrderMutation();
  const createGuestMutation = useCreateGuestMutation();
  const form = useForm<GuestLoginBodyType>({
    resolver: zodResolver(GuestLoginBody),
    defaultValues: {
      name: "",
      tableNumber: 0,
    },
  });
  const name = form.watch("name");
  const tableNumber = form.watch("tableNumber");

  const handleQuantityChange = (dishId: number, quantity: number) => {
    setOrders((prevOrders) => {
      if (quantity === 0) {
        return prevOrders.filter((order) => order.dishId !== dishId);
      }
      const index = prevOrders.findIndex((order) => order.dishId === dishId);
      if (index === -1) {
        return [...prevOrders, { dishId, quantity }];
      }
      const newOrders = [...prevOrders];
      newOrders[index] = { ...newOrders[index], quantity };
      return newOrders;
    });
  };

  const handleOrder = async () => {
    try {
      let guestId = selectedGuest?.id;
      if (isNewGuest) {
        const guestRes = await createGuestMutation.mutateAsync({
          name,
          tableNumber,
        });
        guestId = guestRes.payload.data.id;
      }
      if (!guestId) {
        toast({
          description: "Hãy chọn một khách hàng",
        });
        return;
      }
      await createOrderMutation.mutateAsync({
        guestId,
        orders,
      });
      reset();
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError,
      });
    }
  };

  const reset = () => {
    form.reset();
    setSelectedGuest(null);
    setIsNewGuest(true);
    setOrders([]);
    setOpen(false);
  };

  return (
    <Dialog
      onOpenChange={(value) => {
        if (!value) reset();
        setOpen(value);
      }}
      open={open}
    >
      <DialogTrigger asChild>
        <Button size="sm" className="h-7 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Tạo đơn hàng
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Tạo đơn hàng
          </DialogTitle>
        </DialogHeader>
        <div className="flex-grow overflow-hidden">
          <ScrollArea className="h-[calc(100vh-200px)] w-full">
            <div className="space-y-4 pr-4">
              <Tabs defaultValue="new-guest" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger
                    value="new-guest"
                    onClick={() => setIsNewGuest(true)}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Khách hàng mới
                  </TabsTrigger>
                  <TabsTrigger
                    value="existing-guest"
                    onClick={() => setIsNewGuest(false)}
                  >
                    <Utensils className="mr-2 h-4 w-4" />
                    Khách hàng hiện có
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="new-guest">
                  <Form {...form}>
                    <form
                      noValidate
                      className="space-y-4"
                      id="add-employee-form"
                    >
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tên khách hàng</FormLabel>
                            <FormControl>
                              <Input className="w-full" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="tableNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Chọn bàn</FormLabel>
                            <FormControl>
                              <div className="flex items-center gap-4">
                                <Input
                                  readOnly
                                  value={field.value}
                                  className="w-20"
                                />
                                <TablesDialog
                                  onChoose={(table) => {
                                    field.onChange(table.number);
                                  }}
                                />
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </form>
                  </Form>
                </TabsContent>
                <TabsContent value="existing-guest">
                  <GuestsDialog
                    onChoose={(guest) => {
                      setSelectedGuest(guest);
                    }}
                  />
                  {selectedGuest && (
                    <Card className="mt-4">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{selectedGuest.name}</p>
                          <p className="text-sm text-gray-500">
                            ID: #{selectedGuest.id}
                          </p>
                        </div>
                        <Badge variant="secondary">
                          Bàn: {selectedGuest.tableNumber}
                        </Badge>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                {dishes
                  .filter((dish) => dish.status !== DishStatus.Hidden)
                  .map((dish) => (
                    <Card
                      key={dish.id}
                      className={cn("overflow-hidden", {
                        "opacity-50": dish.status === DishStatus.Unavailable,
                      })}
                    >
                      <CardContent className="p-0">
                        <div className="relative">
                          <Image
                            src={dish.image}
                            alt={dish.name}
                            height={150}
                            width={300}
                            className="w-full h-[150px] object-cover"
                          />
                          {dish.status === DishStatus.Unavailable && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                              <span className="text-white font-semibold">
                                Hết hàng
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold mb-1">{dish.name}</h3>
                          <p className="text-sm text-gray-500 mb-2">
                            {dish.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-green-600">
                              {formatCurrency(dish.price)}
                            </span>
                            <Quantity
                              onChange={(value) =>
                                handleQuantityChange(dish.id, value)
                              }
                              value={
                                orders.find((order) => order.dishId === dish.id)
                                  ?.quantity ?? 0
                              }
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          </ScrollArea>
        </div>
        <DialogFooter className="mt-4">
          <Button
            className="w-full justify-between bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
            onClick={handleOrder}
            disabled={orders.length === 0}
          >
            <span className="flex items-center">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Đặt hàng · {orders.length} món
            </span>
            <span>{formatCurrency(totalPrice)}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
