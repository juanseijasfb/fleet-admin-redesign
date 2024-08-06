import ApiService from "@/services/ApiService";
import { useMutation } from "@tanstack/react-query";

export function useDisableDispatch(dispatcherId: number) {
  const { mutate, isPending, isError } = useMutation({
    onError: (error) => {
      console.error(error);
    },
    mutationFn: async () => {
      const api = new ApiService();
      dispatcherId !== 0 && api.activeDisableDispatch({ dispatcherId, disable:true}); 
    },
  });

  return { disableDispatch: mutate, isPending, isError };
}
export function useEnableDispatch(dispatcherId: number) {
  const { mutate, isPending, isError } = useMutation({
    onError: (error) => {
      console.error(error);
    },
    mutationFn: async () => {
      const api = new ApiService();
      dispatcherId !== 0 && api.activeDisableDispatch({ dispatcherId , disable:false}); 
    },
  });

  return { enableDispatch: mutate, isPending, isError };
}
