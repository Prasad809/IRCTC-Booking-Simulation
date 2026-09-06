import * as Yup from "yup";
import { todayISO } from "../../Common/utils";


export const initialValues = {
  source: "",
  destination: "",
  date: todayISO(),
};


export const validationSchema = Yup.object({

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

  date: Yup.string()
    .required("Date of journey is required")
    .test(
      "future-or-today",
      "Journey date cannot be in the past",
      function (value) {
        return value >= todayISO();
      }
    ),
});