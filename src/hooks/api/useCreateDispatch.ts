import { AddDispatchValues } from "@/components/forms/AddDispatchForm";
import ApiService from "@/services/ApiService";
import { useMutation } from "@tanstack/react-query";

export default function useCreateDispatch(cb: () => void) {
  const { mutate, isPending, isError } = useMutation({
    onSuccess: () => {
      cb();
    },
    onError: (error) => {},
    mutationFn: async (values: AddDispatchValues) => {
      const api = new ApiService();
      return api.addDispatchFake(values);
    },
  });

  return { createDispatch: mutate, isPending, isError };
}
