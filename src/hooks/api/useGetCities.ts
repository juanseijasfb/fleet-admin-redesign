import ApiService from "@/services/ApiService";
import { useQuery } from "@tanstack/react-query";

export function useGetCities(stateValue: string) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["state", stateValue],
    queryFn: async () => {
      const api = new ApiService();
      return api.getCitiesListByState({ search: stateValue });
    },
    enabled: !!stateValue,
  });

  return { cities: data, isLoadingCities:isLoading, isError };
}