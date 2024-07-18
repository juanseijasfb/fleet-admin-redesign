import { useQuery } from "@tanstack/react-query";
import ApiService from "@/services/ApiService";
export default function useGetDrivers(search: string) {
	const { data, isLoading, isError, refetch } = useQuery({
		queryKey: ["drivers", search],
		queryFn: async () => {
			const api = new ApiService();
			return api.getDrivers({ search });
		},
	});
	const refetchDrivers = () => {
		refetch();
	};
	return { drivers: data, isLoading, isError, refetchDrivers };
}
