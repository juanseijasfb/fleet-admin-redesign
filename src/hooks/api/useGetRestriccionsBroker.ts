import ApiService from "@/services/ApiService";
import { useQuery } from "@tanstack/react-query";

export function useGetRestricctionBroker(mcNumber: number | undefined) {
	const { data, isLoading, isError, refetch } = useQuery({
		queryKey: ["state", mcNumber],
		queryFn: async () => {
			const api = new ApiService();
			return api.getRestriccionDrivers({ search: mcNumber });
		},
		enabled: !!mcNumber,
	});
	const refetchRestriccionsCarrier = () => {
		refetch();
	};
	return {
		restriccionesCarrier: data,
		isLoadingRestriccions: isLoading,
		isError,
		refetchRestriccionsCarrier,
	};
}
