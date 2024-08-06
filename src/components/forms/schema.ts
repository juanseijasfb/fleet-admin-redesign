import * as Yup from "yup";

export const driverSchema = Yup.object().shape({
	firstName: Yup.string().required("First name is required"),
	lastName: Yup.string().required("Last name is required"),
	email: Yup.string().email("Invalid email").required("Email is required"),
	mcNumber: Yup.number().required("MC Number is required"),
	carrierName: Yup.string().required("Carrier Name is required"),
	trailerType: Yup.string().required("Trailer Type is required"),
	maxLoadWeight: Yup.number().min(0, 'Max Load Weight must be greater than or equal to 0').max(99999, 'Max Load Weight must be less than or equal to 99999').required("Max Load Weight is required"),
});
export const driverUpdateSchema = Yup.object().shape({
	firstName: Yup.string().required("First name is required"),
	lastName: Yup.string().required("Last name is required"),
	email: Yup.string().email("Invalid email").required("Email is required"),
	mcNumber: Yup.number().required("MC Number is required"),
	carrier: Yup.string().required("Carrier Name is required"),
	equipment: Yup.string().required("Trailer Type is required"),
	weight: Yup.number().min(0, 'Max Load Weight must be greater than or equal to 0').max(99999, 'Max Load Weight must be less than or equal to 99999').required("Max Load Weight is required"),
});
export const dispatcherSchema = Yup.object().shape({
	firstName: Yup.string().required("First name is required"),
	lastName: Yup.string().required("Last name is required"),
	dispatcherEmail: Yup.string()
		.email("Invalid email")
		.required("Email is required"),
	role: Yup.string().required("Role is required"),
});
export const carrierSchema = Yup.object().shape({
	mc: Yup.string().required("MC is required"),
	carrierName: Yup.string().required("Carrier Name is required"),
});
export const restrictionDriveSchema = Yup.object().shape({
	subjectValue: Yup.string().required("Driver is required"),
	state: Yup.string().required("State is required"),
});
export const addRestrictionBrokerSchema = Yup.object().shape({
	mcNumber: Yup.string().required("Broker is required"),
});
