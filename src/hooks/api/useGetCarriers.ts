import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import ApiService from "@/services/ApiService";

export default function useGetCarriers(search: string) {
    const { data: carrierAll, isLoading: isLoadingAll, isError: isErrorAll } = useQuery({
        queryKey: ["carrierTotal", search],
        queryFn: async () => {
          const api = new ApiService();
          return await api.getCarriers({ search });
        }
    });

	const { data, isLoading, isError, fetchNextPage, hasNextPage, refetch } = useInfiniteQuery({
		queryKey: ["carriers", search],
		queryFn: async ({pageParam = 0}) => {
			const api = new ApiService();
			const allCarriers = await api.getCarriers({ search });
			const pageSize = 15;
            const start = pageParam * pageSize;
            const end = start + pageSize;
            const pageData = allCarriers.slice(start, end);
            return {
                data: pageData,
                nextPage: end < allCarriers.length ? pageParam + 1 : undefined
            };
        },
        getNextPageParam: (lastPage) => lastPage.nextPage,
        initialPageParam: 0,
    });
    return { carriersInfinite: data, carrierAll, isLoading, isError, fetchNextPage, hasNextPage };
}