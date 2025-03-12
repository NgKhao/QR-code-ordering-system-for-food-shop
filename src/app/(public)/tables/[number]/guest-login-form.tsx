"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  GuestLoginBody,
  GuestLoginBodyType,
} from "@/schemaValidations/guest.schema";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useGuestLoginMutation } from "@/queries/useGuest";
import { useAppStore } from "@/components/app-provider";
import { generateSocketInstance, handleErrorApi } from "@/lib/utils";
import { Coffee, User, Utensils, Lock } from "lucide-react";

export default function GuestLoginForm() {
  const setRole = useAppStore((stase) => stase.setRole);
  const setSocket = useAppStore((stase) => stase.setSocket);
  const searchParams = useSearchParams();
  const params = useParams();
  console.log(params, searchParams.get("token"));
  const tableNumber = Number(params.number);
  const token = searchParams.get("token");
  const router = useRouter();
  const loginMutation = useGuestLoginMutation();
  const form = useForm<GuestLoginBodyType>({
    resolver: zodResolver(GuestLoginBody),
    defaultValues: {
      name: "",
      token: token ?? "",
      tableNumber,
    },
  });

  useEffect(() => {
    if (!token) {
      router.push("/");
    }
  }, [token, router]);

  const onSubmit = async (values: GuestLoginBodyType) => {
    if (loginMutation.isPending) return;
    try {
      const result = await loginMutation.mutateAsync(values);
      setRole(result.payload.data.guest.role);
      setSocket(generateSocketInstance(result.payload.data.accessToken));
      router.push("/guest/menu");
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError,
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4">
      <Card className="w-full max-w-md shadow-lg border-none">
        <CardHeader className="pb-4 space-y-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">
              Đăng nhập gọi món
            </CardTitle>
            <Coffee className="h-6 w-6" />
          </div>
          <CardDescription className="text-orange-100">
            Chào mừng quý khách đến với dịch vụ đặt món của chúng tôi
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form
              className="space-y-4"
              noValidate
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <div className="flex items-center">
                      <Label
                        htmlFor="name"
                        className="text-lg font-medium flex items-center gap-2"
                      >
                        <User className="h-4 w-4" />
                        Tên khách hàng
                      </Label>
                    </div>
                    <div className="relative">
                      <Input
                        id="name"
                        type="text"
                        required
                        className="pl-3 pr-3 py-6 text-lg border-2 focus:border-orange-400 focus:ring-orange-400"
                        placeholder="Nhập tên của bạn"
                        {...field}
                      />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <div className="pt-3">
                <Button
                  type="submit"
                  className="w-full py-6 text-lg bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 transition-all duration-300 shadow-md"
                >
                  <Utensils className="mr-2 h-5 w-5" /> Đăng nhập
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 border-t px-6 py-4 text-center text-sm text-gray-600">
          <p>Đặt món nhanh chóng - Phục vụ tận tâm</p>
          <div className="flex items-center justify-center space-x-1">
            <Lock className="h-3 w-3" />
            <span>Bảo mật thông tin khách hàng</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
