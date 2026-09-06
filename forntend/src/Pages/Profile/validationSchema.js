import * as Yup from "yup";

export const initialValues = {
    userName:"",
    email:"",
    mobile:"",
};

export const validationSchema = Yup.object({
    userName: Yup.string()
        .required("Username is required")
        .min(3, "Username must be at least 3 characters")
        .max(50, "Username must not exceed 50 characters"),

    email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),

    mobile: Yup.string()
        .required("Mobile number is required")
        .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits"),
});