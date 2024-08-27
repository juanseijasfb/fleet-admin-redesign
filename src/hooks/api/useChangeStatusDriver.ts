import ApiService from "@/services/ApiService";
import { useMutation } from "@tanstack/react-query";

export function useDisableDriver(cb: () => void) {
  const { mutate, isPending, isError } = useMutation({
    onSuccess: () => {
      cb();
    },
    onError: () => {},
    mutationFn: async (driversId:string) => {
      const api = new ApiService();
      api.activeDisableDriver({ driversId, disable:true}); 
    },
  });

  return { disableDriver: mutate, isPending, isError };
}
export function useEnableDriver(cb: () => void) {
  const { mutate, isPending, isError } = useMutation({
    onSuccess: () => {
      cb();
    },
    onError: () => {},
    mutationFn: async (driversId:string) => {
      const api = new ApiService();
      api.activeDisableDriver({ driversId , disable:false}); 
    },
  });

  return { enableDriver: mutate, isPending, isError };
}
