import { useQuery } from "@tanstack/react-query";
import ApiService from "@/services/ApiService";

export default function useGetDispatchers({ search }: { search?: string }) {
	const { data, isLoading, isError } = useQuery({
		queryKey: ["dispatchers", search],
		queryFn: async () => {
			const api = new ApiService();
			return api.getDispatcher({
				search,
			});
		},
	});

	return { dispatchers: data, isLoading, isError };
}
