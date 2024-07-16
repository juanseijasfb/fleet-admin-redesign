import { API_URL } from "@/utils/constants";
import {
	type Carrier,
	type CarrierResponseAPI,
	type DispatcherResponseAPI,
	type Driver,
	type DriverAssignedResponseAPI,
	type DriverUnassignedResponseAPI,
	type DriverResponseAPI,
	DriverStatus,
	type BrokerResponseAPI,
	type GetCitiesResponseAPI,
} from "@/utils/types";

export default class ApiService {
	// request = async (path: string, method: string, body?: RequestInit) => {
	// 	const response = await fetch(`${API_URL}${path}`, {
	// 		method,
	// 		headers: {
	// 			"Content-Type": "application/json",
	// 		},
	// 		...body,
	// 	});
	// 	return response;
	// };

	async request<T>(
		path: string,
		method: string,
		contentType?: string,
		body?: RequestInit,
	) {
		console.log("API_URL", API_URL);
		const response = await fetch(`${API_URL}${path}`, {
			method,
			headers: {
				"Content-Type": contentType || "application/json",
			},
			...body,
		});
		if (!response.ok) {
			throw new Error("Error fetching data");
		}
		const json = await response.json();

		return json as T;
	}

	getDrivers = async ({ search }: { search?: string }) => {
		const params = new URLSearchParams();

		params.append("driver", "");

		const driversResponse = await this.request<DriverResponseAPI[]>(
			`/getDriversList?${params.toString()}`,
			"GET",
		);

		const drivers: Driver[] = driversResponse.map((driver) => ({
			id: driver.driverId,
			firstName: driver.fullName,
			lastName: driver.fullName,
			email: driver.email,
			carrier: driver.Carrier,
			mcNumber: driver.MCNumber,
			equipment: driver.Equipment,
			status: driver.enabled ? DriverStatus.Active : DriverStatus.Inactive,
			weight: driver.maxWeight,
		}));

		return drivers;
	};

	getDispatcher = async ({ search }: { search?: string }) => {
		const params = new URLSearchParams();
		if (search) {
			params.append("dispatcher", search);
		}
		const driversResponse = await this.request<DispatcherResponseAPI[]>(
			`/getDispatcherList?${params.toString()}`,
			"GET",
		);

		const dispatchers = driversResponse.map((dispatcher) => ({
			id: dispatcher.dispatcherId,
			firstName: dispatcher.firstName,
			lastName: dispatcher.lastName,
			email: dispatcher.dispatcher,
			role: dispatcher.role,
			status: dispatcher.enabled ? DriverStatus.Active : DriverStatus.Inactive,
			port: dispatcher.port,
			contractId: dispatcher.contractId,
		}));

		return dispatchers;
	};

	async getCarriers({ search }: { search?: string }): Promise<Carrier[]> {
		const params = new URLSearchParams();

		params.append("carrier", "");

		const carriersResponse = await this.request<CarrierResponseAPI[]>(
			`/getCarriersList?${params.toString()}`,
			"GET",
		);

		const carriers: Carrier[] = carriersResponse.map((carrier) => ({
			carrier: carrier.carrier,
			mcNumber: carrier.MCNumber,
		}));

		console.log("carriers", carriers);

		return carriers;
	}
	async addDriver(addDriverBody: {
		firstName: string;
		lastName: string;
		email: string;
		mcNumber: string;
		carrierName: string;
		maxLoadWeight: string;
		trailerType: string;
	}) {
		const params = new URLSearchParams();
		params.append("firstName", addDriverBody.firstName);
		params.append("lastName", addDriverBody.lastName);
		params.append("email", addDriverBody.email);
		params.append("mcNumber", addDriverBody.mcNumber);
		params.append("carrierName", addDriverBody.carrierName);
		params.append("maxWeight", addDriverBody.maxLoadWeight);
		params.append("trailerType", addDriverBody.trailerType);

		const response = await this.request(
			`/addDriver?${params.toString()}`,
			"POST",
		);
		return response;
	}

	async addDispatch(addDispatcherBody: {
		firstName: string;
		lastName: string;
		dispatcherEmail: string;
		role: string;
		enabled: string;
	}) {
		const params = new URLSearchParams();
		params.append("firstName", addDispatcherBody.firstName);
		params.append("lastName", addDispatcherBody.lastName);
		params.append("dispatcherEmail", addDispatcherBody.dispatcherEmail);
		params.append("role", addDispatcherBody.role);
		params.append("enabled", addDispatcherBody.enabled);
		const response = await this.request(
			`/addDispatcher?${params.toString()}`,
			"POST",
			"application/x-www-form-urlencoded",
		);
	}

	async addDispatchFake(addDispatcherBody: {
		firstName: string;
		lastName: string;
		dispatcherEmail: string;
		role: string;
		enabled: boolean;
	}) {
		const params = new URLSearchParams();
		params.append("firstName", addDispatcherBody.firstName);
		params.append("lastName", addDispatcherBody.lastName);
		params.append("dispatcherEmail", addDispatcherBody.dispatcherEmail);
		params.append("role", addDispatcherBody.role);
		params.append("enabled", addDispatcherBody.enabled.toString());
		try {
			await new Promise((resolve) => setTimeout(resolve, 1000));

			const response = {
				mensaje: "Dispatche creado exitosamente",
				datos: addDispatcherBody,
			};
			console.log(response);

			return response;
		} catch (error) {
			console.error("Error:", error);
		}
	}

	async addCarrier(addCarrierBody: {
		mc: string;
		carrierName: string;
	}) {
		const params = new URLSearchParams();
		params.append("mc", addCarrierBody.mc);
		params.append("carrierName", addCarrierBody.carrierName);
		try {
			await new Promise((resolve) => setTimeout(resolve, 1000));

			const response = {
				mensaje: "Carrier creado exitosamente",
				datos: addCarrierBody,
			};
			console.log(response);

			return response;
		} catch (error) {
			console.error("Error:", error);
		}
	}

	async getAssignedDriver({ search }: { search?: string }) {
		const params = new URLSearchParams();
		if (search) {
			params.append("dispacher", search);
		}

		const driverAssigned = await this.request<DriverAssignedResponseAPI[]>(
			`/getMyDriversList?${params.toString()}`,
			"GET",
		);

		return driverAssigned;
	}

	async getUnassignedDriver({ search }: { search?: string }) {
		const params = new URLSearchParams();
		if (search) {
			params.append("dispatcher", search);
		}

		const driverAssigned = await this.request<DriverUnassignedResponseAPI[]>(
			`/getUnassignedDriversList?${params.toString()}`,
			"GET",
		);

		return driverAssigned;
	}

	async updateDriver(updateDriverBody: {
		firstName: string;
		lastName: string;
		email: string;
		mcNumber: string;
		carrier: string;
		maxWeight: string;
		equipment: string;
	}) {
		const params = new URLSearchParams();
		params.append("firstName", updateDriverBody.firstName);
		params.append("lastName", updateDriverBody.lastName);
		params.append("email", updateDriverBody.email);
		params.append("mcNumber", updateDriverBody.mcNumber);
		params.append("carrier", updateDriverBody.carrier);
		params.append("weight", updateDriverBody.maxWeight);
		params.append("equipment", updateDriverBody.equipment);
		try {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			const response = {
				mensaje: "Driver actualizado exitosamente",
			};
			console.log(response);
			return response;
		} catch (error) {
			console.error("Error:", error);
		}
	}

	async getBrokerList() {
		const brokers = await this.request<BrokerResponseAPI[]>(
			"/getBrokerList?MCNumbers=131,76,138",
			"GET",
		);
		return brokers;
	}
	async getCitiesListByState({ search }: { search?: string }) {
		const params = new URLSearchParams();
		if (search) {
			params.append("state", search);
		}
		const getCities = await this.request<GetCitiesResponseAPI[]>(
			`/getCitiesListByState?${params.toString()}`,
			"GET",
		);

		return getCities;
	}
	async activeDisableDriver(disableDriverBody: {
		driversId: number;
		disable: boolean;
	}) {
		console.log(disableDriverBody.driversId.toString());
		const params = new URLSearchParams();
		params.append("driversId", disableDriverBody.driversId.toString());

		try {
			const response = await this.request<any[]>(
				disableDriverBody.disable ? "/disableDrivers" : "/enableDrivers",
				"POST",
				"application/x-www-form-urlencoded",
				{
					body: params.toString(),
				},
			);
			console.log(response);
		} catch (error) {
			console.error("Error:", error);
		}
	}
}
