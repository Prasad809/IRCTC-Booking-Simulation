import * as Yup from "yup";

export const initialValues = {
  name: "",
  age: "",
  gender: "",
  berthPreference: "No Preference"
};


export const validationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .matches(
      /^[A-Za-z]+(?: [A-Za-z]+)*$/,
      "Name can contain only letters and single spaces"
    )
    .required("Name is required"),

  age: Yup.number()
    .typeError("Age must be a number")
    .integer("Age must be a whole number")
    .min(1, "Age must be at least 1")
    .max(120, "Age cannot be greater than 120")
    .required("Age is required"),

  gender: Yup.string()
    .oneOf(
      ["Male", "Female", "Other"],
      "Invalid gender"
    )
    .required("Gender is required"),

  berthPreference: Yup.string()
    .required("Berth preference is required"),
});