export enum DriverStatus {
	Active = "Active",
	Inactive = "Inactive",
}
export type DriverResponseAPI = {
	driverId: number;
	MCNumber: number;
	Equipment: "R" | "V" | "F";
	Carrier: string;
	maxWeight: number;
	email: string;
	enabled: 0 | 1;
	homeBaseState: string;
	allowPickupHomeBase: 0 | 1;
	fullName: string;
};
export type DispatcherResponseAPI = {
	dispatcherId: number;
	dispatcher: string;
	role: "A" | "D";
	enabled: 0 | 1;
	port: 5001;
	firstName: string;
	lastName: string;
	contractId: number;
};
export type CarrierResponseAPI = {
	MCNumber: number;
	carrier: string;
	contractId: number;
	dataSourceSet: number;
};
export type Driver = {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	status: DriverStatus;
	equipment: "R" | "V" | "F";
	weight: number;
	mcNumber: number;
	carrier: string;
};

export type Dispatcher = {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	status: DriverStatus;
	role: "A" | "D";
	port: number;
	contractId: number;
};

export type Carrier = {
	mcNumber: number;
	carrier: string;
};

export type DriverAssignedResponseAPI = {
	dispacherId: string;
	driverId: number;
	FirstName: string;
	LastName: string;
	Equipment: string;
	Carrier: string;
	MCNumber: number;
	maxWeight: number;
	email: string;
	enabled: number;
	fullName: string;
};

export type DriverUnassignedResponseAPI = {
	driverId: number;
	fullName: string;
};

export type BrokerResponseAPI = {
	MCNumber: number;
	CompanyName: string;
};
export type GetCitiesResponseAPI = {
	city: string;
	state_id: string;
};
export type GetRestriccionResponseAPI = {
	Subject: string;
	Type: string;
	SubjectValue: string;
	TypeValue: string;
	ValidUntil: string;
}
export type OptionSelect = {
  label: string;
  value: string;
}