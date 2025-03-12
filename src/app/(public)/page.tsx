import dishApiRequest from "@/apiRequests/dish";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { DishListResType } from "@/schemaValidations/dish.schema";
import { ChefHat, Phone, UtensilsCrossed } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  let dishList: DishListResType["data"] = [];
  try {
    const result = await dishApiRequest.list();
    const {
      payload: { data },
    } = result;
    dishList = data;
  } catch (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="w-full max-w-md p-6">
          <CardHeader>
            <CardTitle className="text-xl text-center text-red-600">
              Oops!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center">
              Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="outline" onClick={() => window.location.reload()}>
              Tải lại trang
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  // console.log(dishList);
  return (
    <div className="w-full space-y-8">
      {/* Hero Section with overlay and improved layout */}
      <div className="relative h-[400px] md:h-[500px] rounded-b-lg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/40 z-10"></div>
        <Image
          src="/banner.png"
          fill
          priority
          quality={100}
          alt="Nhà hàng Big Boy"
          className="object-cover"
        />
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 space-y-6">
          <div className="flex items-center justify-center space-x-2 text-amber-400">
            <UtensilsCrossed size={28} />
            <ChefHat size={28} />
          </div>
          <h1 className="text-center text-3xl md:text-5xl lg:text-6xl font-bold text-white">
            Nhà hàng Big Boy
          </h1>
          <p className="text-center text-lg md:text-xl text-white/90 italic">
            Vị ngon, trọn khoảnh khắc
          </p>
          <Button className="mt-6 bg-amber-500 hover:bg-amber-600 text-black font-semibold">
            Đặt bàn ngay
          </Button>
        </div>
      </div>

      {/* Menu Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Đa dạng các món ăn</h2>
          <p className="mt-2 text-gray-500">
            Thực đơn đặc biệt với các món ăn tuyệt hảo
          </p>
          <Separator className="w-24 h-1 bg-amber-500 mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dishList.map((dish) => (
            <Link
              href={`/dishes/${dish.id}`}
              key={dish.id}
              className="block h-full"
            >
              <Card className="h-full overflow-hidden transition-all hover:shadow-lg hover:border-amber-300">
                <div className="aspect-video relative overflow-hidden">
                  <Image
                    src={dish.image}
                    fill
                    alt={dish.name}
                    className="object-cover transition-transform hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{dish.name}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {dish.description}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-between items-center pt-0">
                  <span className="font-bold text-amber-600 text-lg">
                    {formatCurrency(dish.price)}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white"
                  >
                    Xem chi tiết
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Additional sections */}
      <section className="bg-amber-50 py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold">Tại sao chọn Big Boy?</h2>
            <Separator className="w-24 h-1 bg-amber-500 mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-all">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Nguyên liệu tươi ngon</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Chúng tôi chỉ sử dụng nguyên liệu tươi ngon nhất từ các nhà
                  cung cấp địa phương.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-all">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Đầu bếp chuyên nghiệp</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Đội ngũ đầu bếp nhiều năm kinh nghiệm, đam mê với ẩm thực.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-all">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Không gian thoải mái</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Không gian hiện đại, ấm cúng phù hợp cho mọi dịp từ gặp gỡ bạn
                  bè đến tiệc gia đình.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact info */}
      <section className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold mb-4">Nhà hàng Big Boy</h3>
              <p className="text-gray-300">
                Địa chỉ: 123 Đường ABC, Quận XYZ, TP.HCM
              </p>
              <p className="text-gray-300 mt-2">
                <Phone className="inline-block mr-2 h-4 w-4" />
                <span>+84 123 456 789</span>
              </p>
            </div>

            <div className="text-center">
              <h3 className="text-xl font-bold mb-4">Giờ mở cửa</h3>
              <p className="text-gray-300">Thứ 2 - Thứ 6: 10:00 - 22:00</p>
              <p className="text-gray-300">Thứ 7 - Chủ nhật: 09:00 - 23:00</p>
            </div>

            <div className="text-center md:text-right">
              <h3 className="text-xl font-bold mb-4">Kết nối với chúng tôi</h3>
              <div className="flex justify-center md:justify-end space-x-4">
                <a href="#" className="text-gray-300 hover:text-white">
                  Facebook
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  Instagram
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  TikTok
                </a>
              </div>
            </div>
          </div>

          <Separator className="my-6 bg-gray-700" />

          <p className="text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} Nhà hàng Big Boy. Đã đăng ký bản quyền.
          </p>
        </div>
      </section>
    </div>
  );
}
