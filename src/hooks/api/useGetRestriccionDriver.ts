import ApiService from "@/services/ApiService";
import { useQuery } from "@tanstack/react-query";

export function useGetRestriccionDriver(driverName: string) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["state", driverName],
    queryFn: async () => {
      const api = new ApiService();
      return api.getRestriccionDrivers({ search: driverName });
    },
    enabled: !!driverName,
    
  }
);
  const refetchRestriccionsDrivers = () => {
    refetch();
  };
  return { restriccionsDrivers: data, isLoadingRestriccions:isLoading, isError, refetchRestriccionsDrivers };
}