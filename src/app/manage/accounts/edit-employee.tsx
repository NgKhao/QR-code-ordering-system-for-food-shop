"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  UpdateEmployeeAccountBody,
  UpdateEmployeeAccountBodyType,
} from "@/schemaValidations/account.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { useGetAccount, useUpdateAccountMutation } from "@/queries/useAccount";
import { useUploadMediaMutation } from "@/queries/useMedia";
import { toast } from "@/hooks/use-toast";
import { handleErrorApi } from "@/lib/utils";
import { Role, RoleValues } from "@/constants/type";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";

export default function EditEmployee({
  id,
  setId,
  onSubmitSuccess,
}: {
  id?: number | undefined;
  setId: (value: number | undefined) => void;
  onSubmitSuccess?: () => void;
}) {
  // console.log(id);
  const [file, setFile] = useState<File | null>(null);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const { data } = useGetAccount({
    id: id as number,
    enabled: Boolean(id),
  });
  const updateAccountMutation = useUpdateAccountMutation();
  const uploadMediaMutation = useUploadMediaMutation();
  const form = useForm<UpdateEmployeeAccountBodyType>({
    resolver: zodResolver(UpdateEmployeeAccountBody),
    defaultValues: {
      name: "",
      email: "",
      avatar: undefined,
      password: undefined,
      confirmPassword: undefined,
      changePassword: false,
      role: Role.Employee,
    },
  });
  const avatar = form.watch("avatar");
  const name = form.watch("name");
  const changePassword = form.watch("changePassword");

  // Theo dõi thay đổi của switch và reset password khi tắt
  useEffect(() => {
    if (!changePassword) {
      form.setValue("password", undefined);
      form.setValue("confirmPassword", undefined);
    }
  }, [changePassword, form]);

  const previewAvatarFromFile = useMemo(() => {
    if (file) {
      return URL.createObjectURL(file);
    }
    return avatar;
  }, [file, avatar]);

  useEffect(() => {
    if (data) {
      const { name, avatar, email, role } = data.payload.data;
      form.reset({
        name,
        avatar: avatar ?? undefined,
        email,
        changePassword: form.getValues("changePassword"),
        password: form.getValues("password"),
        confirmPassword: form.getValues("confirmPassword"),
        role,
      });
    }
  }, [data, form, id]);

  const onSubmit = async (values: UpdateEmployeeAccountBodyType) => {
    // Kiểm tra nếu mutation đang trong trạng thái pending, không làm gì cả
    if (updateAccountMutation.isPending) return;
    try {
      let body: UpdateEmployeeAccountBodyType & { id: number } = {
        id: id as number,
        ...values,
      };

      // Nếu có file (ảnh đại diện mới), thực hiện upload file
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        // Gọi mutation để upload file và chờ kết quả
        const uploadImageResult = await uploadMediaMutation.mutateAsync(
          formData
        );
        const imageUrl = uploadImageResult.payload.data;

        // Cập nhật body với URL của ảnh đại diện mới
        body = {
          ...body,
          avatar: imageUrl,
        };
      }
      const result = await updateAccountMutation.mutateAsync(body);
      toast({
        description: result.payload.message,
      });
      console.log("Form data:", data);
      reset();
      onSubmitSuccess?.();
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError,
      });
    }
  };

  const reset = () => {
    setId(undefined);
    setFile(null);
  };

  return (
    <Dialog
      open={Boolean(id)}
      onOpenChange={(value) => {
        if (!value) {
          reset();
        }
      }}
    >
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-purple-700">
            Cập nhật tài khoản
          </DialogTitle>
          <DialogDescription>
            Các trường tên, email, mật khẩu là bắt buộc
          </DialogDescription>
        </DialogHeader>
        <Separator className="my-4" />
        <Form {...form}>
          <form
            noValidate
            className="space-y-6"
            id="edit-employee-form"
            onSubmit={form.handleSubmit(onSubmit, console.error)}
          >
            {/* <div className="grid gap-4 py-4"> */}
            <Card className="bg-white shadow-md">
              <CardContent className="p-6">
                <FormField
                  control={form.control}
                  name="avatar"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex gap-2 items-start justify-start">
                        <Avatar className="aspect-square w-[100px] h-[100px] rounded-md object-cover">
                          <AvatarImage src={previewAvatarFromFile} />
                          <AvatarFallback className="rounded-none">
                            {name || "Avatar"}
                          </AvatarFallback>
                        </Avatar>
                        <input
                          type="file"
                          accept="image/*"
                          ref={avatarInputRef}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setFile(file);
                              field.onChange(
                                "http://localhost:3000/" + file.name
                              );
                            }
                          }}
                          className="hidden"
                        />
                        <button
                          className="flex aspect-square w-[100px] items-center justify-center rounded-md border border-dashed"
                          type="button"
                          onClick={() => avatarInputRef.current?.click()}
                        >
                          <Upload className="h-4 w-4 text-muted-foreground" />
                          <span className="sr-only">Upload</span>
                        </button>
                      </div>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card className="bg-white shadow-md">
              <CardContent className="p-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                        <Label htmlFor="name">Tên</Label>
                        <div className="col-span-3 w-full space-y-2">
                          <Input id="name" className="w-full" {...field} />
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card className="bg-white shadow-md">
              <CardContent className="p-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                        <Label htmlFor="email">Email</Label>
                        <div className="col-span-3 w-full space-y-2">
                          <Input id="email" className="w-full" {...field} />
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            <Card className="bg-white shadow-md">
              <CardContent className="p-6">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                        <Label htmlFor="role">Vai trò</Label>
                        <div className="col-span-3 w-full space-y-2">
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn vai trò" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {RoleValues.map((role) => {
                                if (role == Role.Guest) return null;
                                return (
                                  <SelectItem key={role} value={role}>
                                    {role}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            <Card className="bg-white shadow-md">
              <CardContent className="p-6">
                <FormField
                  control={form.control}
                  name="changePassword"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                        <Label htmlFor="email">Đổi mật khẩu</Label>
                        <div className="col-span-3 w-full space-y-2">
                          <Switch
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              field.onChange(checked);
                              // Optional: Clear password fields when switch is turned off
                              if (!checked) {
                                form.setValue("password", undefined);
                                form.setValue("confirmPassword", undefined);
                              }
                            }}
                          />
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            {changePassword && (
              <Card className="bg-white shadow-md">
                <CardContent className="p-6">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                          <Label htmlFor="password">Mật khẩu mới</Label>
                          <div className="col-span-3 w-full space-y-2">
                            <Input
                              id="password"
                              className="w-full"
                              type="password"
                              {...field}
                              value={field.value ?? ""}
                            />
                            <FormMessage />
                          </div>
                        </div>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}
            {changePassword && (
              <Card className="bg-white shadow-md">
                <CardContent className="p-6">
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                          <Label htmlFor="confirmPassword">
                            Xác nhận mật khẩu mới
                          </Label>
                          <div className="col-span-3 w-full space-y-2">
                            <Input
                              id="confirmPassword"
                              className="w-full"
                              type="password"
                              {...field}
                              value={field.value ?? ""}
                            />
                            <FormMessage />
                          </div>
                        </div>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}
            {/* </div> */}
          </form>
        </Form>
        <DialogFooter>
          <Button type="submit" form="edit-employee-form">
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
