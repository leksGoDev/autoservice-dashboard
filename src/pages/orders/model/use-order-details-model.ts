import { useParams } from "react-router-dom";

export function useOrderDetailsPageModel() {
  const { orderId } = useParams();

  return {
    orderId,
  };
}
