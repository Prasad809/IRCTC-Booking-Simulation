
import * as Yup from "yup";


export const paymentInitialValues = {
  type: "DEBIT",
  holderName: "",
  cardNumber: "",
  expiry: "",
  cvv: "",
  upiId: ""
};

export const paymentValidationSchema = Yup.object({

  type: Yup.string()
    .oneOf(
      ["DEBIT", "CREDIT", "UPI"],
      "Invalid payment type"
    )
    .required("Payment type is required"),

  holderName: Yup.string()
    .trim()
    .matches(
      /^[A-Za-z]+(?: [A-Za-z]+)*$/,
      "Name can contain only letters and single spaces"
    )
    .when("type", {
      is: (type) =>
        type === "DEBIT" ||
        type === "CREDIT",
      then: (schema) =>
        schema.required(
          "Cardholder name is required"
        ),
      otherwise: (schema) =>
        schema.notRequired()
    }),

  cardNumber: Yup.string()
    .matches(
      /^[0-9]{16}$/,
      "Card number must contain exactly 16 digits"
    )
    .when("type", {
      is: (type) =>
        type === "DEBIT" ||
        type === "CREDIT",
      then: (schema) =>
        schema.required(
          "Card number is required"
        ),
      otherwise: (schema) =>
        schema.notRequired()
    }),

  expiry: Yup.string()
    .matches(
      /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
      "Expiry must be in MM/YY format"
    )
    .when("type", {
      is: (type) =>
        type === "DEBIT" ||
        type === "CREDIT",
      then: (schema) =>
        schema.required(
          "Expiry is required"
        ),
      otherwise: (schema) =>
        schema.notRequired()
    }),

  cvv: Yup.string()
    .matches(
      /^[0-9]{3}$/,
      "CVV must contain exactly 3 digits"
    )
    .when("type", {
      is: (type) =>
        type === "DEBIT" ||
        type === "CREDIT",
      then: (schema) =>
        schema.required(
          "CVV is required"
        ),
      otherwise: (schema) =>
        schema.notRequired()
    }),

  upiId: Yup.string()
    .trim()
    .matches(
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/,
      "Enter a valid UPI ID"
    )
    .when("type", {
      is: "UPI",
      then: (schema) =>
        schema.required(
          "UPI ID is required"
        ),
      otherwise: (schema) =>
        schema.notRequired()
    })

});

export const bookPassengerInitialValues = {
  name: "",
  age: "",
  gender: "Male",
  berthPreference: "No Preference"
};


export const bookPassengerValidationSchema = Yup.object({
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
    .required("Berth preference is required")
});
