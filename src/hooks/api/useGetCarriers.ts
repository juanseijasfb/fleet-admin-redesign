import { useInfiniteQuery } from "@tanstack/react-query";
import ApiService from "@/services/ApiService";

export default function useGetCarriers(search: string) {
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
    return { carriersInfinite: data, isLoading, isError, fetchNextPage, hasNextPage };
}