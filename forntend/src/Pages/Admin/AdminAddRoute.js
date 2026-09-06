import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Form as BootstrapForm, Button, Row, Col, Alert, Table } from "react-bootstrap";
import { Formik, Form, FieldArray, getIn } from "formik";
import { initialValues, validationSchema } from "./validatonSchema";
import { addTrainRoutesAction, weekDaysAction } from "./Store/Action";
import Loader from "../../libs/Loader";

const loader = (load) =>{
  return load ? <Loader text={"loading....!"} fullPage={true} size="lg"/> : null;
};

function AdminAddRoute() {
  const dispatch = useDispatch();
  const [errStatus, setErrStatus] = useState("");
  const user = useSelector((s) => s.authReducer.user);
  const [allDays, setAllDays] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleAllDays = () => {
    setLoading(true);
    dispatch(weekDaysAction()).then(res =>{
      if(res?.payload?.data?.status){
        setAllDays(res?.payload?.data?.lookUpData)
      }
      setLoading(false);
    })
  };


  // ===============================
  // useEffect
  // ===============================

  useEffect(() => {
    handleAllDays();
  }, []);


  // ===============================
  // Submit
  // ===============================

  const handleSubmit = (values) => {
          const payload = {
            userNameOrEmail:user.email || user.userName,
            trainNo:values.trainNo,
            trainName:values.trainName,
            source:values.source,
            destination:values.destination,
            departureTime:values.departureTime,
            arrivalTime:values.arrivalTime,
            duration:values.duration,
            runDays:values.runDays,
            classes: values.classes.map((item) => ({
          code: item.code,
          fare: Number(
            item.fare
          ),
          totalSeats: Number(
            item.totalSeats
          ),
        }))}
        setLoading(true);
    dispatch(addTrainRoutesAction(payload))
      .then((res) => {
        console.log(
          "Add Train Response:",
          res
        );

        if (
          res?.payload?.data?.status
        ) {


        } else {

          setErrStatus(
            res?.payload?.data
              ?.message?.[0]
              ?.description
          );
        }
        setLoading(false);
      });
  };


  return (

    <div className="page-container">
        {loader(loading)}
      <h4 className="page-title">
        Add Train Route
      </h4>


      {/* =============================== */}
      {/* Error */}
      {/* =============================== */}

      {errStatus && (

        <Alert
          variant="danger"
          dismissible
          onClose={() =>
            setErrStatus("")
          }
        >
          {errStatus}
        </Alert>

      )}


      <Formik
        initialValues={
          initialValues
        }
        validationSchema={
          validationSchema
        }
        onSubmit={
          handleSubmit
        }
      >

        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          setFieldValue,
          isSubmitting,
        }) => (

          <Form noValidate>

            <Card className="form-card">

              <Card.Body>


                {/* ================================= */}
                {/* Train Information */}
                {/* ================================= */}

                <h6 className="mb-3">
                  Train Information
                </h6>

                <Row>


                  {/* Train Number */}

                  <Col md={3}>

                    <BootstrapForm.Group
                      className="mb-3"
                    >

                      <BootstrapForm.Label>
                        Train Number
                      </BootstrapForm.Label>

                      <BootstrapForm.Control
                        type="text"
                        name="trainNo"
                        placeholder="Enter train number"
                        value={
                          values.trainNo
                        }
                        onChange={
                          handleChange
                        }
                        onBlur={
                          handleBlur
                        }
                        isInvalid={Boolean(
                          getIn(
                            touched,
                            "trainNo"
                          ) &&
                          getIn(
                            errors,
                            "trainNo"
                          )
                        )}
                      />

                      <BootstrapForm.Control.Feedback
                        type="invalid"
                      >
                        {getIn(
                          errors,
                          "trainNo"
                        )}
                      </BootstrapForm.Control.Feedback>

                    </BootstrapForm.Group>

                  </Col>


                  {/* Train Name */}

                  <Col md={5}>

                    <BootstrapForm.Group
                      className="mb-3"
                    >

                      <BootstrapForm.Label>
                        Train Name
                      </BootstrapForm.Label>

                      <BootstrapForm.Control
                        type="text"
                        name="trainName"
                        placeholder="Enter train name"
                        value={
                          values.trainName
                        }
                        onChange={
                          handleChange
                        }
                        onBlur={
                          handleBlur
                        }
                        isInvalid={Boolean(
                          getIn(
                            touched,
                            "trainName"
                          ) &&
                          getIn(
                            errors,
                            "trainName"
                          )
                        )}
                      />

                      <BootstrapForm.Control.Feedback
                        type="invalid"
                      >
                        {getIn(
                          errors,
                          "trainName"
                        )}
                      </BootstrapForm.Control.Feedback>

                    </BootstrapForm.Group>

                  </Col>


                  {/* Departure */}

<Col md={2}>
  <BootstrapForm.Group className="mb-3">
    <BootstrapForm.Label>
      Departure
    </BootstrapForm.Label>

    <BootstrapForm.Control
      type="time"
            lang="en-GB"

      name="departureTime"
      value={values.departureTime}
      onChange={handleChange}
      onBlur={handleBlur}
      step="60"
      className="railway-time"
      isInvalid={Boolean(
        getIn(
          touched,
          "departureTime"
        ) &&
        getIn(
          errors,
          "departureTime"
        )
      )}
    />

    <BootstrapForm.Control.Feedback type="invalid">
      {getIn(errors, "departureTime")}
    </BootstrapForm.Control.Feedback>
  </BootstrapForm.Group>
</Col>


{/* Arrival */}

<Col md={2}>
  <BootstrapForm.Group className="mb-3">
    <BootstrapForm.Label>
      Arrival
    </BootstrapForm.Label>

    <BootstrapForm.Control
      type="time"
            lang="en-GB"

      name="arrivalTime"
      value={values.arrivalTime}
      onChange={handleChange}
      onBlur={handleBlur}
      step="60"
      className="railway-time"
      isInvalid={Boolean(
        getIn(
          touched,
          "arrivalTime"
        ) &&
        getIn(
          errors,
          "arrivalTime"
        )
      )}
    />

    <BootstrapForm.Control.Feedback type="invalid">
      {getIn(errors, "arrivalTime")}
    </BootstrapForm.Control.Feedback>
  </BootstrapForm.Group>
</Col>

                </Row>


                {/* ================================= */}
                {/* Station Information */}
                {/* ================================= */}

                <h6 className="mb-3">
                  Station Information
                </h6>

                <Row>


                  {/* Source */}

                  <Col md={4}>

                    <BootstrapForm.Group
                      className="mb-3"
                    >

                      <BootstrapForm.Label>
                        Source Station
                      </BootstrapForm.Label>

                      <BootstrapForm.Control
                        type="text"
                        name="source"
                        placeholder="Enter source"
                        value={
                          values.source
                        }
                        onChange={
                          handleChange
                        }
                        onBlur={
                          handleBlur
                        }
                        isInvalid={Boolean(
                          getIn(
                            touched,
                            "source"
                          ) &&
                          getIn(
                            errors,
                            "source"
                          )
                        )}
                      />

                      <BootstrapForm.Control.Feedback
                        type="invalid"
                      >
                        {getIn(
                          errors,
                          "source"
                        )}
                      </BootstrapForm.Control.Feedback>

                    </BootstrapForm.Group>

                  </Col>


                  {/* Destination */}

                  <Col md={4}>

                    <BootstrapForm.Group
                      className="mb-3"
                    >

                      <BootstrapForm.Label>
                        Destination Station
                      </BootstrapForm.Label>

                      <BootstrapForm.Control
                        type="text"
                        name="destination"
                        placeholder="Enter destination"
                        value={
                          values.destination
                        }
                        onChange={
                          handleChange
                        }
                        onBlur={
                          handleBlur
                        }
                        isInvalid={Boolean(
                          getIn(
                            touched,
                            "destination"
                          ) &&
                          getIn(
                            errors,
                            "destination"
                          )
                        )}
                      />

                      <BootstrapForm.Control.Feedback
                        type="invalid"
                      >
                        {getIn(
                          errors,
                          "destination"
                        )}
                      </BootstrapForm.Control.Feedback>

                    </BootstrapForm.Group>

                  </Col>


                  {/* Duration */}

                  <Col md={4}>

                    <BootstrapForm.Group
                      className="mb-3"
                    >

                      <BootstrapForm.Label>
                        Duration
                      </BootstrapForm.Label>

                      <BootstrapForm.Control
                        type="text"
                        name="duration"
                        placeholder="05h 30m"
                        value={
                          values.duration
                        }
                        onChange={
                          handleChange
                        }
                        onBlur={
                          handleBlur
                        }
                        isInvalid={Boolean(
                          getIn(
                            touched,
                            "duration"
                          ) &&
                          getIn(
                            errors,
                            "duration"
                          )
                        )}
                      />

                      <BootstrapForm.Control.Feedback
                        type="invalid"
                      >
                        {getIn(
                          errors,
                          "duration"
                        )}
                      </BootstrapForm.Control.Feedback>

                    </BootstrapForm.Group>

                  </Col>

                </Row>


                {/* ================================= */}
                {/* Running Days */}
                {/* ================================= */}

                <BootstrapForm.Group
                  className="mb-3"
                >

                  <BootstrapForm.Label>
                    Running Days
                  </BootstrapForm.Label>

                  <div>

                    {allDays.map((day) => {
                      const selected =values.runDays.includes(day.value);
                        return (
                          <BootstrapForm.Check
                            key={day.id}
                            inline
                            type="checkbox"
                            label={day.value}
                            checked={
                              selected
                            }
                            onChange={() => {
                              const updatedDays = selected ? values.runDays.filter((d) =>d !== day.value)
                                  : [...values.runDays,day.value,];
                              setFieldValue("runDays",updatedDays);
                            }}
                          />
                        );
                      }
                    )}

                  </div>

                  {touched.runDays &&
                    errors.runDays && (

                      <div className="text-danger mt-1">
                        {errors.runDays}
                      </div>

                    )}

                </BootstrapForm.Group>


                {/* ================================= */}
                {/* Classes */}
                {/* ================================= */}

                <BootstrapForm.Label>
                  Classes Offered
                </BootstrapForm.Label>


                <FieldArray
                  name="classes"
                >

                  {({
                    push,
                    remove,
                  }) => (

                    <>

                      <Table
                        bordered
                        responsive
                        size="sm"
                      >

                        <thead>

                          <tr>

                            <th>
                              Class
                            </th>

                            <th>
                              Fare (₹)
                            </th>

                            <th>
                              Total Seats
                            </th>

                            <th>
                              Action
                            </th>

                          </tr>

                        </thead>


                        <tbody>

                          {values.classes.map(
                            (
                              item,
                              index
                            ) => {

                              const codePath =
                                `classes[${index}].code`;

                              const farePath =
                                `classes[${index}].fare`;

                              const seatsPath =
                                `classes[${index}].totalSeats`;


                              const codeError =
                                getIn(
                                  errors,
                                  codePath
                                );

                              const fareError =
                                getIn(
                                  errors,
                                  farePath
                                );

                              const seatsError =
                                getIn(
                                  errors,
                                  seatsPath
                                );


                              const codeTouched =
                                getIn(
                                  touched,
                                  codePath
                                );

                              const fareTouched =
                                getIn(
                                  touched,
                                  farePath
                                );

                              const seatsTouched =
                                getIn(
                                  touched,
                                  seatsPath
                                );


                              return (

                                <tr
                                  key={index}
                                >

                                  {/* Class */}

                                  <td>

                                    <BootstrapForm.Select
                                      name={codePath}
                                      value={
                                        item.code
                                      }
                                      onChange={
                                        handleChange
                                      }
                                      onBlur={
                                        handleBlur
                                      }
                                      isInvalid={Boolean(
                                        codeTouched &&
                                        codeError
                                      )}
                                    >

                                      <option value="SL">
                                        Sleeper (SL)
                                      </option>

                                      <option value="3A">
                                        AC 3 Tier (3A)
                                      </option>

                                      <option value="2A">
                                        AC 2 Tier (2A)
                                      </option>

                                      <option value="1A">
                                        First AC (1A)
                                      </option>

                                      <option value="CC">
                                        Chair Car (CC)
                                      </option>

                                    </BootstrapForm.Select>

                                    {codeTouched &&
                                      codeError && (

                                        <div className="text-danger small">
                                          {
                                            codeError
                                          }
                                        </div>

                                      )}

                                  </td>


                                  {/* Fare */}

                                  <td>

                                    <BootstrapForm.Control
                                      type="number"
                                      name={farePath}
                                      placeholder="Enter fare"
                                      value={
                                        item.fare
                                      }
                                      onChange={
                                        handleChange
                                      }
                                      onBlur={
                                        handleBlur
                                      }
                                      isInvalid={Boolean(
                                        fareTouched &&
                                        fareError
                                      )}
                                    />

                                    {fareTouched &&
                                      fareError && (

                                        <div className="text-danger small">
                                          {
                                            fareError
                                          }
                                        </div>

                                      )}

                                  </td>


                                  {/* Seats */}

                                  <td>

                                    <BootstrapForm.Control
                                      type="number"
                                      name={
                                        seatsPath
                                      }
                                      placeholder="Enter seats"
                                      value={
                                        item.totalSeats
                                      }
                                      onChange={
                                        handleChange
                                      }
                                      onBlur={
                                        handleBlur
                                      }
                                      isInvalid={Boolean(
                                        seatsTouched &&
                                        seatsError
                                      )}
                                    />

                                    {seatsTouched &&
                                      seatsError && (

                                        <div className="text-danger small">
                                          {
                                            seatsError
                                          }
                                        </div>

                                      )}

                                  </td>


                                  {/* Remove */}

                                  <td>

                                    {values
                                      .classes
                                      .length >
                                      1 && (

                                        <Button
                                          type="button"
                                          variant="outline-danger"
                                          size="sm"
                                          onClick={() =>
                                            remove(
                                              index
                                            )
                                          }
                                        >
                                          Remove
                                        </Button>

                                      )}

                                  </td>

                                </tr>

                              );

                            }
                          )}

                        </tbody>

                      </Table>


                      {/* Add Class */}

                      <Button
                        type="button"
                        variant="outline-primary"
                        size="sm"
                        className="mb-3"
                        onClick={() =>
                          push({
                            code: "3A",
                            fare: "",
                            totalSeats: "",
                          })
                        }
                      >
                        + Add Another Class
                      </Button>

                    </>

                  )}

                </FieldArray>


                {/* ================================= */}
                {/* Submit */}
                {/* ================================= */}

                <div className="mt-3">

                  <Button
                    type="submit"
                    disabled={
                      isSubmitting
                    }
                  >
                    {isSubmitting
                      ? "Adding Route..."
                      : "Add Route"}
                  </Button>

                </div>

              </Card.Body>

            </Card>

          </Form>

        )}

      </Formik>

    </div>
  );
}

export default AdminAddRoute;
