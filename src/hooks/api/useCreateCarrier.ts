import { AddCarrierValues } from "@/components/forms/AddCarrierForm";
import ApiService from "@/services/ApiService";
import { useMutation } from "@tanstack/react-query";

export default function useCreateCarrier(cb: () => void) {
  const { mutate, isPending, isError } = useMutation({
    onSuccess: () => {
      cb();
    },
    onError: (error) => {},
    mutationFn: async (values: AddCarrierValues) => {
      const api = new ApiService();
      return api.addCarrier(values);
    },
  });

  return { createCarrier: mutate, isPending, isError };
}
