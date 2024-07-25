import { AddRestrictionDriverValues } from "@/components/forms/AddRestrictionDriverForm";
import ApiService from "@/services/ApiService";
import { useMutation } from "@tanstack/react-query";

export function useAddRestriccion(cb: () => void) {
  const { mutate, isPending, isError } = useMutation({
    onSuccess: () => {
      cb();
    },
    onError: (error) => {},
    mutationFn: async (values: AddRestrictionDriverValues) => {
      const api = new ApiService();
      return api.addRestriccionDriver(values);
    },
  });
  return { addRestriccion: mutate, isPending, isError };
}
