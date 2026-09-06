import * as Yup from "yup";


export const initialValues = {
  trainNo: "",
  trainName: "",
  source: "",
  destination: "",
  departureTime: "",
  arrivalTime: "",
  duration: "",
  runDays: [],

  classes: [
    {
      code: "SL",
      fare: "",
      totalSeats: "",
    },
  ],
};


export const validationSchema = Yup.object({
  trainNo: Yup.string()
    .trim()
    .required("Train number is required"),

  trainName: Yup.string()
    .trim()
    .required("Train name is required"),

  source: Yup.string()
    .required("Source station is required"),

  destination: Yup.string()
    .required("Destination station is required")
    .test(
      "different-station",
      "Source and destination cannot be the same",
      function (value) {
        return value !== this.parent.source;
      }
    ),
departureTime: Yup.string()
  .matches(
    /^([01]\d|2[0-3]):([0-5]\d)$/,
    "Enter time in 24-hour format (HH:MM)"
  )
  .required("Departure time is required"),

arrivalTime: Yup.string()
  .matches(
    /^([01]\d|2[0-3]):([0-5]\d)$/,
    "Enter time in 24-hour format (HH:MM)"
  )
  .required("Arrival time is required"),

  duration: Yup.string()
    .required("Duration is required"),

  runDays: Yup.array()
    .min(
      1,
      "Select at least one running day"
    )
    .required(
      "Select at least one running day"
    ),

  classes: Yup.array()
    .of(
      Yup.object({
        code: Yup.string()
          .required("Class is required"),

        fare: Yup.number()
          .typeError("Fare must be a number")
          .positive(
            "Fare must be greater than 0"
          )
          .required("Fare is required"),

        totalSeats: Yup.number()
          .typeError(
            "Seats must be a number"
          )
          .integer(
            "Seats must be a whole number"
          )
          .positive(
            "Seats must be greater than 0"
          )
          .required(
            "Total seats are required"
          ),
      })
    )
    .min(
      1,
      "Add at least one class"
    ),
});