import type { UpdateDriverValues } from "@/components/forms/UpdateDriverForm";
import ApiService from "@/services/ApiService";
import { useMutation } from "@tanstack/react-query";

export default function useUpdateCarrier(cb: () => void) {
	const { mutateAsync, isPending, isError } = useMutation({
		onSuccess: () => {
			cb();
		},
		onError: (error) => {},
		mutationFn: async (values: UpdateDriverValues) => {
			const api = new ApiService();
			return api.updateDriver({
				firstName: values.firstName,
				lastName: values.lastName,
				email: values.email,
				mcNumber: values.mcNumber,
				carrier: values.carrier,
				maxWeight: values.weight,
				equipment: values.equipment,
			});
		},
	});

	return { mutateAsync, isPending, isError };
}
