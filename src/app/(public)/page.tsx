import dishApiRequest from "@/apiRequests/dish";
import { formatCurrency } from "@/lib/utils";
import { DishListResType } from "@/schemaValidations/dish.schema";
import Image from "next/image";

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
        <div className="text-center p-8 bg-red-50 rounded-lg border border-red-200">
          <h2 className="text-2xl font-bold text-red-700">Đã xảy ra lỗi</h2>
          <p className="mt-2 text-red-600">
            Không thể tải danh sách món ăn. Vui lòng thử lại sau.
          </p>
        </div>
      </div>
    );
  }
  // console.log(dishList);
  return (
    <div className="w-full bg-stone-50 min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-96 md:h-screen max-h-[800px]">
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-40 z-10"></div>
        <Image
          src="/banner.png"
          width={1920}
          height={1080}
          quality={100}
          alt="Banner"
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
        <div className="z-20 relative flex flex-col items-center justify-center h-full px-4 sm:px-10 md:px-20">
          <h1 className="text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-lg">
            Nhà hàng Big Boy
          </h1>
          <p className="text-center text-base sm:text-lg mt-4 text-white font-medium italic drop-shadow-md max-w-xl">
            Vị ngon, trọn khoảnh khắc - Nơi hương vị truyền thống gặp gỡ đẳng
            cấp hiện đại
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button className="bg-stone-800 hover:bg-stone-900 text-white font-semibold py-3 px-6 rounded-lg transition shadow-lg">
              Đặt bàn ngay
            </button>
            <button className="bg-white/80 backdrop-blur hover:bg-white text-stone-800 font-semibold py-3 px-6 rounded-lg transition shadow-lg">
              Xem thực đơn
            </button>
          </div>
        </div>
      </div>

      {/* About Section */}
      <section id="about" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-10 items-center">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-stone-800 mb-6">
                Về Nhà hàng Big Boy
              </h2>
              <p className="text-stone-600 mb-4">
                Được thành lập từ năm 2010, Nhà hàng Big Boy tự hào mang đến
                trải nghiệm ẩm thực đẳng cấp với những món ăn đặc sắc kết hợp
                giữa hương vị truyền thống và phong cách hiện đại.
              </p>
              <p className="text-stone-600 mb-4">
                Không gian nhà hàng được thiết kế tinh tế, sang trọng nhưng
                không kém phần ấm cúng, là nơi lý tưởng cho những bữa ăn gia
                đình, gặp gỡ bạn bè hay các buổi tiệc quan trọng.
              </p>
              <p className="text-stone-600">
                Đội ngũ đầu bếp giàu kinh nghiệm của chúng tôi luôn tâm huyết
                với từng món ăn, cam kết mang đến cho quý khách những trải
                nghiệm ẩm thực khó quên.
              </p>
            </div>
            <div className="md:w-1/2">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg overflow-hidden">
                  <Image
                    src="/banner.png"
                    width={400}
                    height={300}
                    quality={90}
                    alt="Không gian nhà hàng"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="rounded-lg overflow-hidden">
                  <Image
                    src="/banner.png"
                    width={400}
                    height={300}
                    quality={90}
                    alt="Món ăn đặc sắc"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="rounded-lg overflow-hidden col-span-2">
                  <Image
                    src="/banner.png"
                    width={800}
                    height={300}
                    quality={90}
                    alt="Không gian nhà hàng"
                    className="w-full h-64 object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Menu Section */}
      <section id="menu" className="py-16 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-stone-800">
              Đa dạng các món ăn
            </h2>
            <div className="w-24 h-1 bg-stone-800 mx-auto mt-4"></div>
            <p className="mt-4 text-stone-600 max-w-2xl mx-auto">
              Thực đơn của chúng tôi được chọn lọc từ những nguyên liệu tươi
              ngon nhất, được chế biến bởi đội ngũ đầu bếp tài năng
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {dishList.slice(0, 6).map((dish) => (
              <div
                key={dish.id}
                className="bg-white rounded-xl overflow-hidden shadow hover:shadow-md transition-shadow border border-stone-100 flex"
              >
                <div className="flex-shrink-0">
                  <Image
                    src={dish.image}
                    width={180}
                    height={180}
                    quality={90}
                    alt={dish.name}
                    className="object-cover w-36 h-36 sm:w-44 sm:h-44"
                  />
                </div>
                <div className="p-4 flex-1">
                  <h3 className="text-xl font-semibold text-stone-800">
                    {dish.name}
                  </h3>
                  <p className="text-stone-600 mt-2 line-clamp-2">
                    {dish.description}
                  </p>
                  <p className="font-bold text-stone-800 mt-3">
                    {formatCurrency(dish.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button className="bg-stone-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-stone-900 transition">
              Xem toàn bộ thực đơn
            </button>
          </div>
        </div>
      </section>

      {/* QR Experience Section */}
      <section className="py-16 bg-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="md:w-1/2">
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="w-64 h-64 mx-auto bg-stone-200 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-20 h-20 text-stone-400"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 4.875C3 3.839 3.84 3 4.875 3h4.5c1.036 0 1.875.84 1.875 1.875v4.5c0 1.036-.84 1.875-1.875 1.875h-4.5A1.875 1.875 0 013 9.375v-4.5zM4.875 4.5a.375.375 0 00-.375.375v4.5c0 .207.168.375.375.375h4.5a.375.375 0 00.375-.375v-4.5a.375.375 0 00-.375-.375h-4.5zm7.875.375c0-1.036.84-1.875 1.875-1.875h4.5C20.16 3 21 3.84 21 4.875v4.5c0 1.036-.84 1.875-1.875 1.875h-4.5a1.875 1.875 0 01-1.875-1.875v-4.5zm1.875-.375a.375.375 0 00-.375.375v4.5c0 .207.168.375.375.375h4.5a.375.375 0 00.375-.375v-4.5a.375.375 0 00-.375-.375h-4.5zM6 6.75A.75.75 0 016.75 6h.75a.75.75 0 01.75.75v.75a.75.75 0 01-.75.75h-.75A.75.75 0 016 7.5v-.75zm9.75 0A.75.75 0 0116.5 6h.75a.75.75 0 01.75.75v.75a.75.75 0 01-.75.75h-.75a.75.75 0 01-.75-.75v-.75zM3 14.625c0-1.036.84-1.875 1.875-1.875h4.5c1.036 0 1.875.84 1.875 1.875v4.5c0 1.036-.84 1.875-1.875 1.875h-4.5A1.875 1.875 0 013 19.125v-4.5zm1.875-.375a.375.375 0 00-.375.375v4.5c0 .207.168.375.375.375h4.5a.375.375 0 00.375-.375v-4.5a.375.375 0 00-.375-.375h-4.5zm7.875-.75a.75.75 0 01.75-.75h.75a.75.75 0 01.75.75v.75a.75.75 0 01-.75.75h-.75a.75.75 0 01-.75-.75v-.75zM6 16.5a.75.75 0 01.75-.75h.75a.75.75 0 01.75.75v.75a.75.75 0 01-.75.75h-.75a.75.75 0 01-.75-.75v-.75zM17.25 12.75a.75.75 0 00-.75.75v4.5c0 .414.336.75.75.75h.75a.75.75 0 00.75-.75v-4.5a.75.75 0 00-.75-.75h-.75z"
                      clipRule="evenodd"
                    />
                    <path d="M13.5 6a.75.75 0 00-.75.75v.75a.75.75 0 001.5 0v-.75A.75.75 0 0013.5 6z" />
                  </svg>
                </div>
                <p className="text-center text-stone-600 font-medium mt-4">
                  Quét mã QR tại bàn
                </p>
              </div>
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-stone-800 mb-6">
                Trải nghiệm đặt món thông minh
              </h2>
              <p className="text-stone-600 mb-4">
                Tại Nhà hàng Big Boy, chúng tôi tự hào giới thiệu hệ thống đặt
                món thông minh thông qua mã QR tại mỗi bàn ăn, mang đến trải
                nghiệm ẩm thực hiện đại và tiện lợi.
              </p>
              <p className="text-stone-600 mb-4">
                Với một thao tác đơn giản, bạn có thể:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-green-500 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-stone-600">
                    Xem thực đơn đầy đủ với hình ảnh chi tiết
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-green-500 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-stone-600">
                    Đặt món trực tiếp không cần chờ phục vụ
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-green-500 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-stone-600">
                    Theo dõi trạng thái đơn hàng theo thời gian thực
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-green-500 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-stone-600">
                    Thanh toán nhanh chóng và tiện lợi
                  </span>
                </li>
              </ul>
              <button className="mt-6 bg-stone-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-stone-900 transition">
                Tìm hiểu thêm
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-stone-800">
              Khách hàng nói gì về chúng tôi
            </h2>
            <div className="w-24 h-1 bg-stone-800 mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-stone-50 p-6 rounded-xl shadow-sm border border-stone-100">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-stone-600 italic">
                Thực sự ấn tượng với hệ thống đặt món qua QR code, rất tiện lợi
                và nhanh chóng. Đồ ăn ngon, không gian đẹp, chắc chắn sẽ quay
                lại!
              </p>
              <div className="mt-4 pt-4 border-t border-stone-200">
                <p className="font-medium text-stone-800">Nguyễn Văn A</p>
                <p className="text-sm text-stone-500">
                  Khách hàng thường xuyên
                </p>
              </div>
            </div>

            <div className="bg-stone-50 p-6 rounded-xl shadow-sm border border-stone-100">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-stone-600 italic">
                Món ăn ngon tuyệt vời, đặc biệt là các món đặc sản. Dịch vụ chu
                đáo, nhân viên thân thiện. Tôi đã tổ chức sinh nhật ở đây và mọi
                người đều rất hài lòng!
              </p>
              <div className="mt-4 pt-4 border-t border-stone-200">
                <p className="font-medium text-stone-800">Trần Thị B</p>
                <p className="text-sm text-stone-500">Khách hàng VIP</p>
              </div>
            </div>

            <div className="bg-stone-50 p-6 rounded-xl shadow-sm border border-stone-100">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-stone-600 italic">
                Không gian sang trọng, phù hợp cả cho gia đình và các buổi gặp
                mặt công việc. Hệ thống đặt món qua QR rất tiện lợi. Nhất định
                sẽ giới thiệu cho bạn bè!
              </p>
              <div className="mt-4 pt-4 border-t border-stone-200">
                <p className="font-medium text-stone-800">Lê Văn C</p>
                <p className="text-sm text-stone-500">Doanh nhân</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section id="location" className="py-16 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-stone-800">
              Địa điểm của chúng tôi
            </h2>
            <div className="w-24 h-1 bg-stone-800 mx-auto mt-4"></div>
          </div>

          <div className="bg-stone-200 h-96 rounded-xl overflow-hidden">
            {/* Map placeholder - in a real app, replace with an actual map component */}
            <div className="w-full h-full bg-stone-300 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-20 w-20 text-stone-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-stone-600 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <h3 className="font-semibold text-lg text-stone-800">
                  Địa chỉ
                </h3>
              </div>
              <p className="text-stone-600">
                123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-stone-600 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="font-semibold text-lg text-stone-800">
                  Giờ mở cửa
                </h3>
              </div>
              <p className="text-stone-600">Thứ 2 - Thứ 6: 10:00 - 22:00</p>
              <p className="text-stone-600">Thứ 7 - Chủ nhật: 8:00 - 23:00</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-stone-600 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <h3 className="font-semibold text-lg text-stone-800">
                  Liên hệ
                </h3>
              </div>
              <p className="text-stone-600">Hotline: 0123 456 789</p>
              <p className="text-stone-600">Email: info@bigboy.com</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section id="contact" className="py-16 bg-stone-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold">Đăng ký nhận thông tin</h2>
            <p className="mt-4 text-stone-300 max-w-2xl mx-auto">
              Để không bỏ lỡ các chương trình khuyến mãi, sự kiện đặc biệt và
              món ăn mới, hãy đăng ký nhận thông tin từ chúng tôi
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <form className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Email của bạn"
                className="px-4 py-3 rounded-lg flex-1 text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-500"
              />
              <button className="bg-stone-600 hover:bg-stone-700 px-6 py-3 rounded-lg font-medium transition">
                Đăng ký
              </button>
            </form>
            <p className="text-sm text-stone-400 mt-3 text-center">
              Chúng tôi tôn trọng quyền riêng tư của bạn và không bao giờ chia
              sẻ thông tin cá nhân
            </p>
          </div>

          <div className="mt-16 flex justify-center space-x-6">
            <a href="#" className="text-stone-300 hover:text-white">
              <span className="sr-only">Facebook</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
            <a href="#" className="text-stone-300 hover:text-white">
              <span className="sr-only">Instagram</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
            <a href="#" className="text-stone-300 hover:text-white">
              <span className="sr-only">Twitter</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0
                31 006.29 1.84"
                />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-bold text-white mb-4">
                Nhà hàng Big Boy
              </h4>
              <p className="text-sm">
                Vị ngon, trọn khoảnh khắc - Nơi hương vị truyền thống gặp gỡ
                đẳng cấp hiện đại
              </p>
            </div>
            <div>
              <h4 className="text-lg font-bold text-white mb-4">Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white">
                    Trang chủ
                  </a>
                </li>
                <li>
                  <a href="#about" className="hover:text-white">
                    Giới thiệu
                  </a>
                </li>
                <li>
                  <a href="#menu" className="hover:text-white">
                    Thực đơn
                  </a>
                </li>
                <li>
                  <a href="#location" className="hover:text-white">
                    Địa điểm
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-white">
                    Liên hệ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold text-white mb-4">Liên hệ</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-stone-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh</span>
                </li>
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-stone-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span>0123 456 789</span>
                </li>
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-stone-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span>info@bigboy.com</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold text-white mb-4">Giờ mở cửa</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  Thứ 2 - Thứ 6:{" "}
                  <span className="text-white">10:00 - 22:00</span>
                </li>
                <li>
                  Thứ 7 - Chủ nhật:{" "}
                  <span className="text-white">8:00 - 23:00</span>
                </li>
                <li>
                  Các ngày lễ: <span className="text-white">9:00 - 22:00</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-stone-800 mt-8 pt-6 text-sm text-center">
            <p>© 2025 Nhà hàng Big Boy. All rights reserved.</p>
            <div className="mt-4 md:mt-0">
              <a
                href="#"
                className="hover:text-white mr-4 transition duration-150 ease-in-out"
              >
                Điều khoản sử dụng
              </a>
              <a
                href="#"
                className="hover:text-white mr-4 transition duration-150 ease-in-out"
              >
                Chính sách bảo mật
              </a>
              <a
                href="#"
                className="hover:text-white transition duration-150 ease-in-out"
              >
                Sitemap
              </a>
            </div>
          </div>
          <p className="text-xs text-stone-500 text-center mt-4">
            Thiết kế và phát triển bởi BigBoy Tech Team - Phiên bản 2.5.0
          </p>
        </div>
      </footer>
    </div>
  );
}
