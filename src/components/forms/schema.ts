import * as Yup from "yup";

export const driverSchema = (driverEmail:string[]) => Yup.object().shape({
	firstName: Yup.string().required("First name is required"),
	lastName: Yup.string().required("Last name is required"),
	email: Yup.string()
		.email("Invalid email")
		.required("Email is required")
		.test('unique-email', 'Email already exists', (value:string) => {
			return !driverEmail.includes(value);
		}),
	mcNumber: Yup.number().required("MC Number is required"),
	carrierName: Yup.string().required("Carrier Name is required"),
	trailerType: Yup.string().required("Trailer Type is required"),
	maxLoadWeight: Yup.number().min(0, 'Max Load Weight must be greater than or equal to 0').max(99999, 'Max Load Weight must be less than or equal to 99999').required("Max Load Weight is required"),
});
export const driverUpdateSchema = (driverEmail:string[], emailCurrent:string) => Yup.object().shape({
	firstName: Yup.string().required("First name is required"),
	lastName: Yup.string().required("Last name is required"),
	email: Yup.string()
		.email("Invalid email")
		.required("Email is required")
		.test('unique-email', 'Email already exists', (value:string) => {
			return !driverEmail.includes(value) || value === emailCurrent;
		}),
	mcNumber: Yup.number().required("MC Number is required"),
	carrier: Yup.string().required("Carrier Name is required"),
	equipment: Yup.string().required("Trailer Type is required"),
	weight: Yup.number().min(0, 'Max Load Weight must be greater than or equal to 0').max(99999, 'Max Load Weight must be less than or equal to 99999').required("Max Load Weight is required"),
});
export const dispatcherSchema = (dispatchersEmail: string[]) => Yup.object().shape({
	firstName: Yup.string().required("First name is required"),
	lastName: Yup.string().required("Last name is required"),
	dispatcherEmail: Yup.string()
		.email("Invalid email")
		.required("Email is required")
		.test('unique-email', 'Email already exists', (value:string) => {
			return !dispatchersEmail.includes(value);
		}),
	role: Yup.string().required("Role is required"),
});
export const carrierSchema = (carrierMC: string[]) => Yup.object().shape({
	mc: Yup.string()
		.required("MC is required")
		.test('unique-mc', 'MC already exists', (value:string) => {
			return !carrierMC.includes(value);
		}),
	carrierName: Yup.string().required("Carrier Name is required"),
});
export const restrictionDriveSchema = Yup.object().shape({
	subjectValue: Yup.array().min(1, 'Driver is required'),
	state: Yup.string().required("State is required"),
});
export const addRestrictionBrokerSchema = Yup.object().shape({
	typeValue: Yup.string().required("Broker is required"),
});
