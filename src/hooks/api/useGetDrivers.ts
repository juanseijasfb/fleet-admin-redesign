import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import ApiService from "@/services/ApiService";
export default function useGetDrivers(search: string) {
    const { data: driversAll, isLoading: isLoadingAll, isError: isErrorAll } = useQuery({
        queryKey: ["driversTotal", search],
        queryFn: async () => {
          const api = new ApiService();
          return await api.getDrivers({ search });
        }
    });
    const { data, isLoading, isError, fetchNextPage, hasNextPage, refetch } = useInfiniteQuery({
        queryKey: ["drivers", search],
        queryFn: async ({ pageParam = 0 }) => {
            const api = new ApiService();
            const allDrivers = await api.getDrivers({search});
            const pageSize = 15;
            const start = pageParam * pageSize;
            const end = start + pageSize;
            const pageData = allDrivers.slice(start, end);
            return {
                data: pageData,
                nextPage: end < allDrivers.length ? pageParam + 1 : undefined
            };
        },
        getNextPageParam: (lastPage) => lastPage.nextPage,
        initialPageParam: 0,
    });
    const refetchDrivers = () => {
		refetch();
	};
    return { driversInfinite: data, driversAll, isLoading, isError, fetchNextPage, hasNextPage, refetchDrivers };
}