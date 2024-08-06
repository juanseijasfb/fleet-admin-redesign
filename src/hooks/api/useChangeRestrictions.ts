import { AddRestrictionDriverValues } from "@/components/forms/AddRestrictionDriverForm";
import ApiService from "@/services/ApiService";
import { useMutation } from "@tanstack/react-query";

export function useAddRestriccion(cb: () => void, by:string) {
  const { mutate, isPending, isError } = useMutation({
    onSuccess: () => {
      cb();
    },
    onError: (error) => {},
    mutationFn: async (values: AddRestrictionDriverValues) => {
      console.log(by)
      const api = new ApiService();
      switch (by) {
        case "carrier": 
        return api.addRestriccionCarrier(values);
        case "driver":
          return api.addRestriccionDriver(values);
        default:
          break;
      }
      return api.addRestriccionDriver(values);
    },
  });
  return { addRestriccion: mutate, addRPending:isPending, isError };
}
export function useRemoveRestriccion(cb: () => void) {
  const { mutate, isPending, isError } = useMutation({
    onSuccess: () => {
      cb();
    },
    onError: (error) => {},
    mutationFn: async (values: AddRestrictionDriverValues) => {
      const api = new ApiService();
      return api.removeRestriccionDriver(values);
    },
  });
  return { removeRestriccion: mutate, isPendingRemove:isPending, isError };
}