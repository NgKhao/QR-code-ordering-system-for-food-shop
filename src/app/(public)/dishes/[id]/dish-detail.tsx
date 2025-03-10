import { formatCurrency } from "@/lib/utils";
import { DishResType } from "@/schemaValidations/dish.schema";
import Image from "next/image";

export default async function DishDetail({
  dish,
}: {
  dish: DishResType["data"] | undefined;
}) {
  if (!dish) {
    return (
      <div>
        <h1 className="text-2xl lg:text-3xl font-semibold">
          Không tìm thấy món ăn
        </h1>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <h1 className="text-2xl lg:text-3xl font-semibold">{dish.name}</h1>
      <div className="font-semibold">Giá: {formatCurrency(dish.price)}</div>
      <Image
        src={dish.image}
        width={700}
        height={700}
        quality={100}
        alt={dish.name}
        className=" hover:scale-105 transition-transform duration-300 w-full h-full object-cover max-w-[1080px] max-h-[1080px] rounded-md"
      />
      <p className="text-lg">{dish.description}</p>
    </div>
  );
}
