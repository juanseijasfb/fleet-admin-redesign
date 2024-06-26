import { useQuery } from "@tanstack/react-query";
import ApiService from "@/services/ApiService";
export default function useGetDrivers() {
	const { data, isLoading, isError } = useQuery({
		queryKey: ["drivers"],
		queryFn: async () => {
			const api = new ApiService();
			return api.getDrivers({});
		},
	});

	return { drivers: data, isLoading, isError };
}
