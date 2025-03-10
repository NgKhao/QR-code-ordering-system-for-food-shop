import dishApiRequest from "@/apiRequests/dish";
import { wrapServerApi } from "@/lib/utils";
import DishDetail from "./dish-detail";

export default async function DishPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const data = await wrapServerApi(() => dishApiRequest.getDish(Number(id)));
  const dish = data?.payload.data;
  return <DishDetail dish={dish} />;
}
