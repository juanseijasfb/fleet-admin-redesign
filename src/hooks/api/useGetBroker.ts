import ApiService from "@/services/ApiService";
import { useQuery } from "@tanstack/react-query";
export function useGetBrokerList() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["MCNumbers"],
    queryFn: async () => {
      const api = new ApiService();
      return api.getBrokerList();
    },
  });

  return { listBroker: data, isLoadingBroker: isLoading, isError };
}
