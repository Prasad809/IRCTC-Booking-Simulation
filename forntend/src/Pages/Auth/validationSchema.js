import * as Yup from "yup";

export const loginInitialVals = {
  userNameOrEmail: "",
  password: "",
};

export const loginValidationSchema = Yup.object({
  userNameOrEmail: Yup.string()
    .trim()
    .required("Username or Email is required"),

  password: Yup.string()
    .required("Password is required"),
});


export const signUpInitialVals = {
  userName: "",
  email: "",
  mobile: "",
  password: "",
  confirmPassword: "",
};

export const signUpValidationSchema = Yup.object({
  userName: Yup.string()
    .trim()
    .required("Username is required"),

  email: Yup.string()
    .trim()
    .email("Invalid email format")
    .required("Email is required"),

  mobile: Yup.string()
    .matches(
      /^[0-9]{10}$/,
      "Mobile number must be exactly 10 digits"
    )
    .required("Mobile number is required"),

  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),

  confirmPassword: Yup.string()
    .oneOf(
      [Yup.ref("password")],
      "Passwords do not match"
    )
    .required("Confirm password is required"),
});