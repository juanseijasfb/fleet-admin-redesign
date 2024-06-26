import { useQuery } from "@tanstack/react-query";
import ApiService from "@/services/ApiService";

export default function useGetDispatchers() {
	const { data, isLoading, isError } = useQuery({
		queryKey: ["dispatchers"],
		queryFn: async () => {
			const api = new ApiService();
			return api.getDispatcher({});
		},
	});

	return { dispatchers: data, isLoading, isError };
}
