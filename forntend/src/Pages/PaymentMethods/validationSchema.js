import * as Yup from "yup";

export const initialValues = {
  type: "DEBIT",
  nickName: "",
  holderName: "",
  cardNumber: "",
  expiry: "",
  upiId: "",
};

export const validationSchema = Yup.object({
  type: Yup.string()
    .oneOf(["DEBIT", "CREDIT", "UPI"])
    .required("Payment type is required"),

  nickName: Yup.string()
    .trim()
    .max(50, "Nickname cannot exceed 50 characters"),

  holderName: Yup.string().when("type", {
    is: (type) => type !== "UPI",

    then: (schema) =>
      schema
        .trim()
        .matches(
          /^[A-Za-z]+(?: [A-Za-z]+)*$/,
          "Enter a valid cardholder name"
        )
        .required("Cardholder name is required"),

    otherwise: (schema) => schema.notRequired(),
  }),

  cardNumber: Yup.string().when("type", {
    is: (type) => type !== "UPI",

    then: (schema) =>
      schema
        .matches(
          /^\d{16}$/,
          "Card number must contain exactly 16 digits"
        )
        .required("Card number is required"),

    otherwise: (schema) => schema.notRequired(),
  }),

  expiry: Yup.string().when("type", {
    is: (type) => type !== "UPI",

    then: (schema) =>
      schema
        .matches(
          /^(0[1-9]|1[0-2])\/\d{2}$/,
          "Expiry must be in MM/YY format"
        )
        .required("Expiry is required"),

    otherwise: (schema) => schema.notRequired(),
  }),

  upiId: Yup.string().when("type", {
    is: "UPI",

    then: (schema) =>
      schema
        .trim()
        .matches(
          /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/,
          "Enter a valid UPI ID"
        )
        .required("UPI ID is required"),

    otherwise: (schema) => schema.notRequired(),
  }),
});