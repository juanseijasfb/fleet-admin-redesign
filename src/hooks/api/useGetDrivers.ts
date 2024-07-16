import { useQuery } from "@tanstack/react-query";
import ApiService from "@/services/ApiService";
export default function useGetDrivers() {
	const { data, isLoading, isError, refetch } = useQuery({
		queryKey: ["drivers"],
		queryFn: async () => {
			const api = new ApiService();
			return api.getDrivers({});
		},
	});
	const refetchDrivers = () => {
		refetch();
	  };
	return { drivers: data, isLoading, isError, refetchDrivers };
}
