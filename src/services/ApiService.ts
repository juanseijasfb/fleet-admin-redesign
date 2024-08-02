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
	GetRestriccionResponseAPI,
} from "@/utils/types";
import axios from "axios";
import path from "path";

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

	async request<T>({
		path,
		method,
		headers,
		body,
	}: {
		path: string;
		method: string;
		headers?: Record<string, string>;
		body?: BodyInit;
	}) {
		const response = await axios.request({
			url: `${API_URL}${path}`,
			method,
			headers,
			data: body,
		});

		return response.data as T;
	}

	getDrivers = async ({ search }: { search?: string }) => {
		const params = new URLSearchParams();
		if (search) {
			params.append("driver", search);
		}

		const driversResponse = await this.request<DriverResponseAPI[]>({
			path: `/getDriversList?${params.toString()}`,
			method: "GET",
		});

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
		const driversResponse = await this.request<DispatcherResponseAPI[]>({
			path: `/getDispatcherList?${params.toString()}`,
			method: "GET",
		});

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
		if (search && search.length > 0) {
			params.append("carrier", `${search}%`);
		}

		const carriersResponse = await this.request<CarrierResponseAPI[]>({
			path: `/getCarriersList?${params.toString()}`,
			method: "GET",
		});

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

		const response = await this.request({
			path: "/addDriver",
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: params,
		});
		return response;
	}

	async addDispatch(addDispatcherBody: {
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
		params.append("port", "5001");
		const response = await this.request({
			path: "/addDispatcher",
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: params,
		});

		return response;
	}

	// async addDispatch(addDispatcherBody: {
	// 	firstName: string;
	// 	lastName: string;
	// 	dispatcherEmail: string;
	// 	role: string;
	// 	enabled: boolean;
	// }) {
	// 	const params = new URLSearchParams();
	// 	params.append("firstName", addDispatcherBody.firstName);
	// 	params.append("lastName", addDispatcherBody.lastName);
	// 	params.append("dispatcherEmail", addDispatcherBody.dispatcherEmail);
	// 	params.append("role", addDispatcherBody.role);
	// 	params.append("enabled", addDispatcherBody.enabled.toString());
	// 	try {
	// 		await new Promise((resolve) => setTimeout(resolve, 1000));

	// 		const response = {
	// 			mensaje: "Dispatche creado exitosamente",
	// 			datos: addDispatcherBody,
	// 		};
	// 		console.log(response);

	// 		return response;
	// 	} catch (error) {
	// 		console.error("Error:", error);
	// 	}
	// }

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

		const driverAssigned = await this.request<DriverAssignedResponseAPI[]>({
			path: `/getMyDriversList?${params.toString()}`,
			method: "GET",
		});

		return driverAssigned;
	}

	async getUnassignedDriver({ search }: { search?: string }) {
		const params = new URLSearchParams();
		if (search) {
			params.append("dispatcher", search);
		}

		const driverAssigned = await this.request<DriverUnassignedResponseAPI[]>({
			path: `/getUnassignedDriversList?${params.toString()}`,
			method: "GET",
		});

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
		const brokers = await this.request<BrokerResponseAPI[]>({
			path: "/getBrokerList?MCNumbers=131,76,138",
			method: "GET",
		});
		return brokers;
	}
	async getCitiesListByState({ search }: { search?: string }) {
		const params = new URLSearchParams();
		if (search) {
			params.append("state", search);
		}
		const getCities = await this.request<GetCitiesResponseAPI[]>({
			path: `/getCitiesListByState?${params.toString()}`,
			method: "GET",
		});

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
			const url = disableDriverBody.disable
				? "/disableDrivers"
				: "/enableDrivers";
			const response = await this.request<any[]>({
				path: `${url}`,
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: params,
			});
		} catch (error) {
			console.error("Error:", error);
		}
	}

	async addRestriccionDriver(addRestriccionBody: {
		subject:string,
		state?:string,
        type:string,
        subjectValue:string,
        typeValue:string,
        validUntil?:string
	}){
		
		const bodyCustom = {
			subject: addRestriccionBody.subject,
			type: addRestriccionBody.type,
			subjectValue: addRestriccionBody.subjectValue,
			typeValue: addRestriccionBody.typeValue + addRestriccionBody.state,
			validUntil: addRestriccionBody.validUntil
		}
		
		try {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			const response = await this.request<any[]>({
				path: "/addRestrictions",
				method: "POST",
				body: JSON.stringify([bodyCustom]),
				headers: {
					'Content-Type': 'application/json'
				}
			})
			console.log({mensaje: "Restriccion agregada exitosamente"});
			return response;
		} catch (error) {
			console.error("Error:", error);
		}
	}

	async getRestriccionDrivers({search} : {search?: string}){ {
		const params = new URLSearchParams();
		if (search) {
			params.append("driver", search);
		}

		const getRestriccion = await this.request<GetRestriccionResponseAPI[]>({
			path: `/getRestrictions?${params.toString()}`,
			method: "GET",
		});
		return getRestriccion;
		}	
	}

	async removeRestriccionDriver(addRestriccionBody: {
		subject:string,
        type:string,
        subjectValue:string,
        typeValue:string,
	}){
		try{
			const params = new URLSearchParams({
				subject:addRestriccionBody.subject,
				type:addRestriccionBody.type,
				subjectValue:addRestriccionBody.subjectValue,
				typeValue:addRestriccionBody.typeValue,
			});
	
			const removeRestriction = await this.request<any[]>({
				path: `/removeRestriction?${params.toString()}`,
				method: "GET",
				body: params,
			})
			const response = {mensaje: "Restriccion eliminada exitosamente", response: removeRestriction}
			console.log(response)
	
		} catch (error) {
			console.error("Error al eliminar la restricción:", error);
    		throw new Error("No se pudo eliminar la restricción");
		}
	}
}
