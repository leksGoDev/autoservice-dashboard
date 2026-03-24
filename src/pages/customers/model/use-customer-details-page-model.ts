import { useParams } from "react-router-dom";

export function useCustomerDetailsPageModel() {
  const { customerId } = useParams();

  return {
    customerId,
  };
}
