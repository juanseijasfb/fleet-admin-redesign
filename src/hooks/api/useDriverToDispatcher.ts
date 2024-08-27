import ApiService from "@/services/ApiService";
import { useMutation } from "@tanstack/react-query";

export function useAddDriverToDispatcher(cb: () => void) {
  const { mutate, isPending, isError } = useMutation({
    onSuccess: () => {
      cb();
    },
    onError: () => {},
    mutationFn: async ({dispatcherEmail, driversList}:{dispatcherEmail:string, driversList:string}) => {
      const api = new ApiService();
      api.addDriverToDispatcher({dispatcherEmail, driversList});
    },
  });

  return { addDriverToDispatcher: mutate, isPendingAssignedDriver:isPending, isError };
}
export function useRemoveDriverToDispatcher(cb: () => void) {
  const { mutate, isPending, isError } = useMutation({
    onSuccess: () => {
      cb();
    },
    onError: () => {},
    mutationFn: async ({dispatcherEmail, driversList}:{dispatcherEmail:string, driversList:string}) => {
      const api = new ApiService();
      api.removeDriverToDispatcher({dispatcherEmail, driversList});
    },
  });

  return { removeDriverToDispatcher: mutate, isPendingRemoveDriver:isPending, isError };
}