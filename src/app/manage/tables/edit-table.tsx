"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  getTableLink,
  getVietnameseTableStatus,
  handleErrorApi,
} from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  UpdateTableBody,
  UpdateTableBodyType,
} from "@/schemaValidations/table.schema";
import { TableStatus, TableStatusValues } from "@/constants/type";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import { useGetTable, useUpdateTableMutation } from "@/queries/useTable";
import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import QRCodeTable from "@/components/qrcode-table";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function EditTable({
  id,
  setId,
  onSubmitSuccess,
}: {
  id?: number | undefined;
  setId: (value: number | undefined) => void;
  onSubmitSuccess?: () => void;
}) {
  const form = useForm<UpdateTableBodyType>({
    resolver: zodResolver(UpdateTableBody),
    defaultValues: {
      capacity: 2,
      status: TableStatus.Hidden,
      changeToken: false,
    },
  });

  const updateTableMutation = useUpdateTableMutation();

  const { data } = useGetTable({
    id: id as number,
    enabled: Boolean(id),
  });

  useEffect(() => {
    if (data) {
      const { capacity, status } = data.payload.data;
      form.reset({
        capacity,
        status,
        changeToken: form.getValues("changeToken"),
      });
    }
  }, [data, form]);

  const reset = () => {
    setId(undefined);
  };

  const onSubmit = async (values: UpdateTableBodyType) => {
    if (updateTableMutation.isPending) return;
    try {
      const body: UpdateTableBodyType & { id: number } = {
        id: id as number,
        ...values,
      };
      const result = await updateTableMutation.mutateAsync(body);
      toast({
        description: result.payload.message,
      });
      reset();
      onSubmitSuccess?.();
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError,
      });
    }
  };

  return (
    <Dialog
      open={Boolean(id)}
      onOpenChange={(value) => {
        if (!value) {
          setId(undefined);
        }
      }}
    >
      <DialogContent
        className="sm:max-w-[700px] max-h-[90vh] overflow-auto "
        onCloseAutoFocus={() => {
          form.reset();
          setId(undefined);
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-purple-700">
            Cập nhật bàn ăn
          </DialogTitle>
        </DialogHeader>
        <Separator className="my-4" />
        <Form {...form}>
          <form
            noValidate
            className="space-y-6"
            id="edit-table-form"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <Card className="bg-white shadow-md">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  <FormItem>
                    <Label
                      htmlFor="name"
                      className="text-sm font-medium text-gray-700"
                    >
                      Số hiệu bàn
                    </Label>
                    <Input
                      id="number"
                      type="number"
                      className="mt-1"
                      value={data?.payload.data.number ?? 0}
                      readOnly
                    />
                    <FormMessage />
                  </FormItem>

                  <FormField
                    control={form.control}
                    name="capacity"
                    render={({ field }) => (
                      <FormItem>
                        <Label
                          htmlFor="capacity"
                          className="text-sm font-medium text-gray-700"
                        >
                          Sức chứa (người)
                        </Label>
                        <Input
                          id="capacity"
                          className="mt-1"
                          {...field}
                          type="number"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-md">
              <CardContent className="p-6">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <Label
                        htmlFor="status"
                        className="text-sm font-medium text-gray-700"
                      >
                        Trạng thái
                      </Label>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Chọn trạng thái" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {TableStatusValues.map((status) => (
                            <SelectItem key={status} value={status}>
                              <Badge
                                variant={
                                  status === TableStatus.Available
                                    ? "default"
                                    : status === TableStatus.Reserved
                                    ? "destructive"
                                    : "secondary"
                                }
                              >
                                {getVietnameseTableStatus(status)}
                              </Badge>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card className="bg-white shadow-md">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <Label
                    htmlFor="changeToken"
                    className="text-sm font-medium text-gray-700"
                  >
                    Đổi QR Code
                  </Label>
                  <FormField
                    control={form.control}
                    name="changeToken"
                    render={({ field }) => (
                      <Switch
                        id="changeToken"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>
              </CardContent>
            </Card>
            {data && (
              <Card className="bg-white shadow-md">
                <CardContent className="p-6 ">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        QR Code
                      </Label>
                      <div className="mt-2 flex justify-center">
                        <QRCodeTable
                          token={data.payload.data.token}
                          tableNumber={data.payload.data.number}
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        URL gọi món
                      </Label>
                      <Link
                        href={getTableLink({
                          token: data.payload.data.token,
                          tableNumber: data.payload.data.number,
                        })}
                        target="_blank"
                        className="mt-2 block text-sm text-blue-600 hover:text-blue-800 break-all"
                      >
                        {getTableLink({
                          token: data.payload.data.token,
                          tableNumber: data.payload.data.number,
                        })}
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </form>
        </Form>
        <DialogFooter>
          <Button type="submit" form="edit-table-form">
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
