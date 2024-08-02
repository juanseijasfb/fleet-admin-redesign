import { AddDriverValues } from "@/components/forms/AddDriverForm";
import ApiService from "@/services/ApiService";
import { useMutation } from "@tanstack/react-query";

export default function useCreateDriver(cb: () => void) {
	const { mutate, isPending, isError } = useMutation({
		onSuccess: () => {
			cb();
		},
		onError: (error) => {},
		mutationFn: async (values: AddDriverValues) => {
			const api = new ApiService();
			return api.addDriver(values);
		},
	});

	return { createDriver: mutate, isPending, isError };
}
