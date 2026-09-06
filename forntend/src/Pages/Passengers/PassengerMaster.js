import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Form as BootstrapForm, Button, Row, Col, Table } from "react-bootstrap";
import { Formik, Form, getIn } from "formik";
import { addPasngerAction, removePasngerAction, getPasngerAction, getGendersAction, getTrainBerthsAction } from "./Store/Action";
import Loader from "../../libs/Loader";
import { initialValues, validationSchema } from "./validationSchema";

const loader = (load) =>{
  return load ? <Loader text={"loading....!"} fullPage={true} size="lg"/> : null;
};

function PassengerMaster() {
  const dispatch = useDispatch();
  const [passengers, setPassengers] = useState([]);
  const user = useSelector((s) => s.authReducer.user);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [genders, setGenders] = useState([]);
  const [trainBerths, setTrainBerths] = useState([]);
  const formikRef = useRef(null);

  const handleSubmit = (values) => {
    const payload = {
      userNameOrEmail: user.userName,
      passengerName: values.name,
      age: Number(values.age),
      gender: values.gender,
      berthPreference: values.berthPreference,
    }
    setLoading(true);
    dispatch(addPasngerAction(payload)).then(res => {
      if (res?.payload?.data?.status) {
        formikRef.current.resetForm();
        setShowForm(false);
        handleGetPassengers();
      }
      setLoading(false);
    });
  };

  const handleGetPassengers = () => {
    setLoading(true);
    dispatch(getPasngerAction({ userNameOrEmail: user.userName })).then(res => {
      if (res?.payload?.data?.status) {
        setPassengers(res?.payload?.data?.data || []);
      }
      setLoading(false);
    });
  };

  const handleGetGenders = () => {
    setLoading(true);
    dispatch(getGendersAction()).then(res => {
      if (res?.payload?.data?.status) {
        setGenders(res?.payload?.data?.lookUpData || []);
      }
      setLoading(false);
    });
  };

  const handleGetTrainBerths = () => {
    setLoading(true);
    dispatch(getTrainBerthsAction()).then(res => {
      if (res?.payload?.data?.status) {
        setTrainBerths(res?.payload?.data?.lookUpData || []);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    handleGetPassengers();
    handleGetGenders();
    handleGetTrainBerths();
  }, []);

  const removePassenger = (id) => {
    const payload = {
      userNameOrEmail: user.userName,
      passengerId: id
    }
    dispatch(removePasngerAction(payload)).then(res => {
      if (res?.payload?.data?.status) {
        handleGetPassengers();
      }
    });
  }
  return (
    <div className="page-container">
      {loader(loading)}
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center">
        <h4 className="page-title">
          Saved Passengers
        </h4>
        <Button
          type="button"
          onClick={() =>
            setShowForm((prev) => !prev)
          }
        >
          {showForm
            ? "Close"
            : "+ Add Passenger"}
        </Button>

      </div>

      {/* Add Passenger Form */}

      {showForm && (
        <Card className="mb-3 form-card">
          <Card.Body>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              innerRef={formikRef}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur
              }) => (
                <Form>
                  <Row>

                    {/* Name */}
                    <Col md={4}>
                      <BootstrapForm.Group className="mb-3">

                        <BootstrapForm.Label>
                          Name
                        </BootstrapForm.Label>

                        <BootstrapForm.Control
                          name="name"
                          value={values.name}
                          placeholder="full Name"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={Boolean(
                            getIn(touched, "name") &&
                            getIn(errors, "name")
                          )}
                        />

                        <BootstrapForm.Control.Feedback type="invalid">
                          {getIn(errors, "name")}
                        </BootstrapForm.Control.Feedback>

                      </BootstrapForm.Group>
                    </Col>

                    {/* Age */}
                    <Col md={2}>
                      <BootstrapForm.Group className="mb-3">

                        <BootstrapForm.Label>
                          Age
                        </BootstrapForm.Label>

                        <BootstrapForm.Control
                          type="number"
                          name="age"
                          placeholder="passenger age"
                          min={1}
                          max={120}
                          value={values.age}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={Boolean(
                            getIn(touched, "age") &&
                            getIn(errors, "age")
                          )}
                        />

                        <BootstrapForm.Control.Feedback type="invalid">
                          {getIn(errors, "age")}
                        </BootstrapForm.Control.Feedback>

                      </BootstrapForm.Group>
                    </Col>

                    {/* Gender */}
                    <Col md={3}>
                      <BootstrapForm.Group className="mb-3">

                        <BootstrapForm.Label>
                          Gender
                        </BootstrapForm.Label>

                        <BootstrapForm.Select
                          name="gender"
                          value={values.gender}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={Boolean(
                            getIn(touched, "gender") &&
                            getIn(errors, "gender")
                          )}
                        >
                          <option value="">Select Gender</option>
                          {genders.map((gender) => (
                            <option
                              key={gender.id}
                              value={gender.key}
                            >
                              {gender.value}
                            </option>
                          ))}

                        </BootstrapForm.Select>

                        <BootstrapForm.Control.Feedback type="invalid">
                          {getIn(errors, "gender")}
                        </BootstrapForm.Control.Feedback>

                      </BootstrapForm.Group>
                    </Col>

                    {/* Berth Preference */}
                    <Col md={3}>
                      <BootstrapForm.Group className="mb-3">

                        <BootstrapForm.Label>
                          Berth Preference
                        </BootstrapForm.Label>

                        <BootstrapForm.Select
                          name="berthPreference"
                          value={values.berthPreference}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={Boolean(
                            getIn(touched, "berthPreference") &&
                            getIn(errors, "berthPreference")
                          )}
                        >

                          {trainBerths.map((berth) => (
                            <option
                              key={berth.id}
                              value={berth.value}
                            >
                              {berth.value}
                            </option>
                          ))}

                        </BootstrapForm.Select>

                        <BootstrapForm.Control.Feedback type="invalid">
                          {getIn(errors, "berthPreference")}
                        </BootstrapForm.Control.Feedback>

                      </BootstrapForm.Group>
                    </Col>

                  </Row>

                  <Button
                    type="submit"
                  >
                    Save Passenger
                  </Button>

                </Form>
              )}
            </Formik>

          </Card.Body>
        </Card>
      )}

      {/* Passenger List */}

      {passengers.length === 0 ? (

        <p className="text-muted">
          No saved passengers yet. Add one to
          speed up bookings.
        </p>

      ) : (

        <Table
          bordered
          hover
          responsive
          className="mt-2"
        >

          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Berth Preference</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {passengers.map((passenger) => (

              <tr key={passenger.id}>

                <td>
                  {passenger.name}
                </td>

                <td>
                  {passenger.age}
                </td>

                <td>
                  {passenger.gender}
                </td>

                <td>
                  {passenger.berthPreference}
                </td>

                <td>

                  <Button
                    type="button"
                    variant="outline-danger"
                    size="sm"
                    onClick={() =>
                      removePassenger(passenger.id)
                    }
                  >
                    Remove
                  </Button>

                </td>

              </tr>

            ))}

          </tbody>

        </Table>
      )}

    </div>
  );
}

export default PassengerMaster;