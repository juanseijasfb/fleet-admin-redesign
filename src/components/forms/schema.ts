import * as Yup from "yup";

export const driverSchema = Yup.object().shape({
	firstName: Yup.string().required("First name is required"),
	lastName: Yup.string().required("Last name is required"),
	email: Yup.string().email("Invalid email").required("Email is required"),
	mcNumber: Yup.number().required("MC Number is required"),
	carrierName: Yup.string().required("Carrier Name is required"),
	trailerType: Yup.string().required("Trailer Type is required"),
	maxLoadWeight: Yup.number().required("Max Load Weight is required"),
});
