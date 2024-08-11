import ApiService from "@/services/ApiService";
import { useQuery } from "@tanstack/react-query";

export function useGetAssignedDriver(email: string) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["dispacher", email],
    queryFn: async () => {
      const api = new ApiService();
      return api.getAssignedDriver({ search: email });
    },
    enabled: !!email,
  });
  const refetchAssignedDriver = async () => {
    return refetch();
  }
  return { assignedDriver: data, isLoadingAssigned: isLoading, isError, refetchAssignedDriver };
}
export function useGetUnassignedDriver(email: string) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["dispatcher", email],
    queryFn: async () => {
      const api = new ApiService();
      return api.getUnassignedDriver({ search: email });
    },
    enabled: !!email,
  });
  return { unassignedDriver: data, isLoadingUnassigned: isLoading, isError };
}
