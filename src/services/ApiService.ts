import { API_URL } from "@/utils/constants";
import {
	Carrier,
	CarrierResponseAPI,
	DispatcherResponseAPI,
	Driver,
	DriverResponseAPI,
	DriverStatus,
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

	async request<T>(path: string, method: string, body?: RequestInit) {
		console.log("API_URL", API_URL);
		const response = await fetch(`${API_URL}${path}`, {
			method,
			headers: {
				"Content-Type": "application/json",
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
			{
				headers: {
					// x-www-form-urlencoded
					"Content-Type": "application/x-www-form-urlencoded",
				},
			},
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
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
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
}
