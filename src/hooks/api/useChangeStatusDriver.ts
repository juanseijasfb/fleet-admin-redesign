import ApiService from "@/services/ApiService";
import { useMutation } from "@tanstack/react-query";

export function useDisableDriver(driversId: number) {
  const { mutate, isPending, isError } = useMutation({
    onError: (error) => {
      console.error(error);
    },
    mutationFn: async () => {
      const api = new ApiService();
      driversId !== 0 && api.activeDisableDriver({ driversId, disable:true}); 
    },
  });

  return { disableDriver: mutate, isPending, isError };
}
export function useEnableDriver(driversId: number) {
  const { mutate, isPending, isError } = useMutation({
    onError: (error) => {
      console.error(error);
    },
    mutationFn: async () => {
      const api = new ApiService();
      driversId !== 0 && api.activeDisableDriver({ driversId , disable:false}); 
    },
  });

  return { enableDriver: mutate, isPending, isError };
}
