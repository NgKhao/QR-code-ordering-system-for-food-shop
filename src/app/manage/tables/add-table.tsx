"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { getVietnameseTableStatus, handleErrorApi } from "@/lib/utils";
import {
  CreateTableBody,
  CreateTableBodyType,
} from "@/schemaValidations/table.schema";
import { TableStatus, TableStatusValues } from "@/constants/type";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAddTableMutation } from "@/queries/useTable";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AddTable() {
  const [open, setOpen] = useState(false);
  const addTableMutation = useAddTableMutation();
  const form = useForm<CreateTableBodyType>({
    resolver: zodResolver(CreateTableBody),
    defaultValues: {
      number: 0,
      capacity: 2,
      status: TableStatus.Hidden,
    },
  });
  const reset = () => {
    form.reset();
  };

  const onSubmit = async (values: CreateTableBodyType) => {
    // Kiểm tra nếu mutation đang trong trạng thái pending, không làm gì cả
    if (addTableMutation.isPending) return;
    try {
      const result = await addTableMutation.mutateAsync(values);
      toast({
        description: result.payload.message,
      });
      reset();
      setOpen(false);
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError,
      });
    }
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
        <Button size="sm" className="h-9 px-4 gap-2">
          <PlusCircle className="h-4 w-4" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            {" "}
            Thêm bàn
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[500px]"
        onCloseAutoFocus={() => form.reset()}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Thêm bàn mới</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            className="space-y-6"
            id="add-table-form"
            onSubmit={form.handleSubmit(onSubmit)}
            onReset={reset}
          >
            {/* <div className="grid gap-4 py-4"> */}
            <Card>
              <CardContent className="pt-6">
                <FormField
                  control={form.control}
                  name="number"
                  render={({ field }) => (
                    <FormItem>
                      {/* <div className="grid grid-cols-4 items-center justify-items-start gap-4"> */}
                      <FormLabel>Số hiệu bàn</FormLabel>
                      {/* <div className="col-span-3 w-full space-y-2"> */}
                      <Input
                        id="number"
                        type="number"
                        className="w-full"
                        {...field}
                      />
                      <FormMessage />
                      {/* </div> */}
                      {/* </div> */}
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            {/* <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                    <Label htmlFor="price">Lượng khách cho phép</Label>
                    <div className="col-span-3 w-full space-y-2">
                      <Input
                        id="capacity"
                        className="w-full"
                        {...field}
                        type="number"
                      />
                      <FormMessage />
                    </div>
                  </div>
                </FormItem>
              )}
            /> */}
            <Card>
              <CardContent className="pt-6">
                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sức chứa</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Nhập sức chứa"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            {/* <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                    <Label htmlFor="description">Trạng thái</Label>
                    <div className="col-span-3 w-full space-y-2">
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn trạng thái" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {TableStatusValues.map((status) => (
                            <SelectItem key={status} value={status}>
                              {getVietnameseTableStatus(status)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <FormMessage />
                  </div>
                </FormItem>
              )}
            /> */}
            {/* </div> */}
            <Card>
              <CardContent className="pt-6">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trạng thái</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
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
          </form>
        </Form>
        <DialogFooter>
          <Button type="submit" form="add-table-form" className="w-full">
            Thêm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
