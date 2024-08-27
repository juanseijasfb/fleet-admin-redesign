import ApiService from "@/services/ApiService";
import { useMutation } from "@tanstack/react-query";

export function useDisableDispatch(cb: () => void) {
  const { mutate, isPending, isError } = useMutation({
    onSuccess: () => {
      cb();
    },
    onError: () => {},
    mutationFn: async (dispatcherId: string) => {
      const api = new ApiService();
      api.activeDisableDispatch({ dispatcherId, disable:true}); 
    },
  });

  return { disableDispatch: mutate, isPending, isError };
}
export function useEnableDispatch(cb: () => void) {
  const { mutate, isPending, isError } = useMutation({
    onSuccess: () => {
      cb();
    },
    onError: () => {},
    mutationFn: async (dispatcherId: string) => {
      const api = new ApiService();
      api.activeDisableDispatch({ dispatcherId , disable:false}); 
    },
  });

  return { enableDispatch: mutate, isPending, isError };
}
