import { useQuery } from "@tanstack/react-query";
import ApiService from "@/services/ApiService";

export default function useGetCarriers(search: string) {
	const { data, isLoading, isError } = useQuery({
		queryKey: ["carriers"],
		queryFn: async () => {
			const api = new ApiService();
			return api.getCarriers({ search });
		},
	});

	return { carriers: data, isLoading, isError };
}
