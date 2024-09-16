import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import ApiService from "@/services/ApiService";

export default function useGetDispatchers({ search }: { search?: string }) {
	const {
		data: dispatchersAll,
		isLoading: isLoadingAll,
		isError: isErrorAll,
	} = useQuery({
		queryKey: ["dispatcherTotal"],
		queryFn: async () => {
			const api = new ApiService();
			return await api.getDispatcher({ search: "" });
		},
	});

	const { data, isLoading, isError, fetchNextPage, hasNextPage, refetch } =
		useInfiniteQuery({
			queryKey: ["dispatchers", search],
			queryFn: async ({ pageParam = 0 }) => {
				const api = new ApiService();
				const allDisptacher = await api.getDispatcher({ search });
				const pageSize = 15;
				const start = pageParam * pageSize;
				const end = start + pageSize;
				const pageData = allDisptacher.slice(start, end);
				return {
					data: pageData,
					nextPage: end < allDisptacher.length ? pageParam + 1 : undefined,
				};
			},
			getNextPageParam: (lastPage) => lastPage.nextPage,
			initialPageParam: 0,
		});
	const refetchDispatchers = () => {
		refetch();
	};
	return {
		dispatchersInfinite: data,
		dispatchersAll,
		isLoading,
		isError,
		fetchNextPage,
		hasNextPage,
		refetchDispatchers,
	};
}
