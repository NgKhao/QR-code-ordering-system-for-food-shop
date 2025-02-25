import { useMutation, useQuery } from "@tanstack/react-query";
import { UpdateOrderBodyType } from "@/schemaValidations/order.schema";
import orderApiRequest from "@/apiRequests/order";

export const useUpdateOrderMutaion = () => {
  return useMutation({
    mutationFn: ({
      orderId,
      ...body
    }: UpdateOrderBodyType & {
      orderId: number;
    }) => orderApiRequest.updateOrder(orderId, body),
  });
};

export const useGetOrderListQuery = () => {
  return useQuery({
    queryFn: orderApiRequest.getOrderList,
    queryKey: ["orders"],
  });
};
