import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Card, Form as BootstrapForm, Button, Row, Col, Table, Alert } from "react-bootstrap";
import { Formik, Form, getIn } from "formik";
import { CLASS_LABELS, QUOTA_LABELS } from "../../Common/seedData";
import { formatCurrency } from "../../Common/utils";
import { addPasngerAction, getPasngerAction, getTrainBerthsAction } from "../Passengers/Store/Action";
import token from "../../Common/token";
import { bookPassengerInitialValues as initialValues, bookPassengerValidationSchema as validationSchema } from "./validationSchema";
import Loader from "../../libs/Loader";
import { getClassesAct, getQuotasAct } from "./Store/Action";
const MAX_PASSENGERS = 6;


const loader = (load) =>{
  return load ? <Loader text={"loading....!"} fullPage={true} size="lg"/> : null;
};

function BookPassengers() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [passengers, setPassengers] = useState([]);
  const user = useSelector((s) => s.authReducer.user);
  const [showForm, setShowForm] = useState(false);
  const [trainBerths, setTrainBerths] = useState([]);
  const [trainQuotas, setTrainQuotas] = useState([]);
  const [trainClasses, setTrainClasses] = useState([]);
  
  const [loading, setLoading] = useState(true);

  const handleGetPassengers = () => {
    setLoading(true);
    dispatch(getPasngerAction({ userNameOrEmail: user.userName })).then(res => {
      if (res?.payload?.data?.status) {
        setPassengers(res?.payload?.data?.data || []);
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

  const handleGetTrainQuotas = () => {
    setLoading(true);
    dispatch(getQuotasAct()).then(res => {
      if (res?.payload?.data?.status) {
        setTrainQuotas(res?.payload?.data?.lookUpData || []);
      }
      setLoading(false);
    });
  };
  
  const handleGetTrainClasses = () => {
    setLoading(true);
    dispatch(getClassesAct()).then(res => {
      if (res?.payload?.data?.status) {
        setTrainClasses(res?.payload?.data?.lookUpData || []);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    handleGetPassengers();
    handleGetTrainBerths();
    handleGetTrainQuotas();
    handleGetTrainClasses();
  }, []);

  const draft = token.getDraftBookingDtls();
  const [selected, setSelected] = useState([]);
  const [saveToMaster, setSaveToMaster] = useState(true);
  const [err, setErr] = useState("");
  if (!draft.train) {
    navigate("/searchTrains");
    return null;
  }
  const toggleSaved = (passenger) => {
    const exists = selected.find(
      (item) => item.id === passenger.id
    );

    if (exists) {
      setSelected(
        selected.filter(
          (item) => item.id !== passenger.id
        )
      );
      setErr("");
      return;
    }


    if (selected.length >= MAX_PASSENGERS) {

      setErr(
        `Maximum ${MAX_PASSENGERS} passengers allowed per booking`
      );

      return;
    }


    setSelected([
      ...selected,
      passenger
    ]);

    setErr("");
  };

  const onAddInline = (values,resetForm) => {
    if (selected.length >= MAX_PASSENGERS) {
      setErr(`Maximum ${MAX_PASSENGERS} passengers allowed per booking`);
      return;
    }

    const isDuplicate = selected.some((passenger) => passenger.name?.trim().toLowerCase() === values.name?.trim().toLowerCase() 
    && Number(passenger.age) === Number(values.age) && passenger.gender?.toLowerCase() === values.gender?.toLowerCase()
    );
    if (isDuplicate) {
      setErr( "This passenger is already added to the booking.");
      return;
    }
    const newPassenger = {
      userNameOrEmail: user.userName,
      passengerName: values.name,
      age: Number(values.age),
      gender: values.gender,
      berthPreference: values.berthPreference
    };

    if (saveToMaster && user?.userName) {
      dispatch(addPasngerAction(newPassenger));
    }
    setSelected((prev) => [...prev,{...newPassenger,name:newPassenger.passengerName}]);
    resetForm({values: initialValues});
    setErr("");
  };

  const onProceed = () => {
    if (selected.length === 0) {
      setErr("Add at least one passenger to proceed");
      return;
    }

    token.setDraftBookingDtls({
      ...draft,
      passengers: selected
    });
    navigate("/paymentGateway");
  };
  const totalFare = Number(draft.fare || 0) * selected.length;
  return (

    <div className="page-container">
      {loader(loading)}
      <h4 className="page-title">
        Add Passenger Details
      </h4>
      <Card className="mb-3 summary-card">
        <Card.Body>
          <Row>
            <Col md={4}>
              <b>
                {draft.train.trainName}
              </b>{" "}
              ({draft.train.trainNo})
            </Col>

            <Col md={3}>
              {draft.train.source}
              {" → "}
              {draft.train.destination}
            </Col>

            <Col md={2}>
              {draft.date}
            </Col>
            <Col md={2}>{CLASS_LABELS[draft.classCode]}</Col>
            <Col md={1}>{QUOTA_LABELS[draft.quota]}</Col>
          </Row>
        </Card.Body>
      </Card>

      {err && (
        <Alert
          variant="warning"
          dismissible
          onClose={() => setErr("")}
        >
          {err}
        </Alert>
      )}
      {passengers.length > 0 && (
        <>
          <h6>
            Select from saved passengers
          </h6>
          <Table
            bordered
            hover
            responsive
            size="sm"
            className="mb-3"
          >

            <thead>
              <tr>
                <th></th>
                <th>
                  Name
                </th>
                <th>
                  Age
                </th>
                <th>
                  Gender
                </th>
                <th>
                  Berth Preference
                </th>
              </tr>
            </thead>
            <tbody>
              {passengers.map(
                (passenger) => {

                  const isSelected =
                    selected.some(
                      (item) =>
                        item.id ===
                        passenger.id
                    );


                  return (

                    <tr
                      key={passenger.id}
                      onClick={() =>
                        toggleSaved(
                          passenger
                        )
                      }
                      style={{
                        cursor:
                          "pointer"
                      }}
                    >

                      <td>

                        <BootstrapForm.Check
                          type="checkbox"
                          checked={
                            isSelected
                          }
                          onChange={() =>
                            toggleSaved(
                              passenger
                            )
                          }
                          onClick={(e) =>
                            e.stopPropagation()
                          }
                        />

                      </td>
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
                        {
                          passenger.berthPreference
                        }
                      </td>

                    </tr>

                  );
                }
              )}

            </tbody>

          </Table>

        </>

      )}


      <h6>
        Add a new passenger
      </h6>


      <Card className="form-card mb-3">

        <Card.Body>

          <Formik
            initialValues={initialValues}
            validationSchema={
              validationSchema
            }
            onSubmit={(
              values,
              { resetForm }
            ) =>
              onAddInline(
                values,
                resetForm
              )
            }
          >

            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit
            }) => (

              <Form
                onSubmit={handleSubmit}
              >

                <Row>

                  {/* =================
                      NAME
                  ================== */}

                  <Col md={4}>

                    <BootstrapForm.Group
                      className="mb-3"
                    >

                      <BootstrapForm.Label>
                        Name
                      </BootstrapForm.Label>


                      <BootstrapForm.Control
                        type="text"
                        name="name"
                        value={
                          values.name
                        }
                        onChange={
                          handleChange
                        }
                        onBlur={
                          handleBlur
                        }
                        placeholder="Enter passenger name"
                        isInvalid={
                          Boolean(
                            getIn(
                              touched,
                              "name"
                            ) &&
                            getIn(
                              errors,
                              "name"
                            )
                          )
                        }
                      />


                      <BootstrapForm.Control.Feedback
                        type="invalid"
                      >
                        {
                          getIn(
                            errors,
                            "name"
                          )
                        }
                      </BootstrapForm.Control.Feedback>

                    </BootstrapForm.Group>

                  </Col>


                  {/* =================
                      AGE
                  ================== */}

                  <Col md={2}>

                    <BootstrapForm.Group
                      className="mb-3"
                    >

                      <BootstrapForm.Label>
                        Age
                      </BootstrapForm.Label>
                      <BootstrapForm.Control
                        type="number"
                        name="age"
                        min={1}
                        max={120}
                        value={
                          values.age
                        }
                        onChange={
                          handleChange
                        }
                        onBlur={
                          handleBlur
                        }
                        placeholder="Age"
                        isInvalid={
                          Boolean(
                            getIn(
                              touched,
                              "age"
                            ) &&
                            getIn(
                              errors,
                              "age"
                            )
                          )
                        }
                      />


                      <BootstrapForm.Control.Feedback
                        type="invalid"
                      >
                        {
                          getIn(
                            errors,
                            "age"
                          )
                        }
                      </BootstrapForm.Control.Feedback>

                    </BootstrapForm.Group>

                  </Col>


                  {/* =================
                      GENDER
                  ================== */}

                  <Col md={3}>

                    <BootstrapForm.Group
                      className="mb-3"
                    >

                      <BootstrapForm.Label>
                        Gender
                      </BootstrapForm.Label>


                      <BootstrapForm.Select
                        name="gender"
                        value={
                          values.gender
                        }
                        onChange={
                          handleChange
                        }
                        onBlur={
                          handleBlur
                        }
                        isInvalid={
                          Boolean(
                            getIn(
                              touched,
                              "gender"
                            ) &&
                            getIn(
                              errors,
                              "gender"
                            )
                          )
                        }
                      >

                        <option value="">
                          Select Gender
                        </option>

                        <option value="Male">
                          Male
                        </option>

                        <option value="Female">
                          Female
                        </option>

                        <option value="Other">
                          Other
                        </option>

                      </BootstrapForm.Select>


                      <BootstrapForm.Control.Feedback
                        type="invalid"
                      >
                        {
                          getIn(
                            errors,
                            "gender"
                          )
                        }
                      </BootstrapForm.Control.Feedback>

                    </BootstrapForm.Group>

                  </Col>


                  {/* =================
                      BERTH
                  ================== */}

                  <Col md={3}>

                    <BootstrapForm.Group
                      className="mb-3"
                    >

                      <BootstrapForm.Label>
                        Berth Preference
                      </BootstrapForm.Label>


                      <BootstrapForm.Select
                        name="berthPreference"
                        value={
                          values.berthPreference
                        }
                        onChange={
                          handleChange
                        }
                        onBlur={
                          handleBlur
                        }
                        isInvalid={
                          Boolean(
                            getIn(
                              touched,
                              "berthPreference"
                            ) &&
                            getIn(
                              errors,
                              "berthPreference"
                            )
                          )
                        }
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
                      <BootstrapForm.Control.Feedback
                        type="invalid"
                      >
                        {
                          getIn(
                            errors,
                            "berthPreference"
                          )
                        }
                      </BootstrapForm.Control.Feedback>

                    </BootstrapForm.Group>

                  </Col>

                </Row>


                {/* =================
                    SAVE TO MASTER
                ================== */}

                <BootstrapForm.Check
                  className="mb-3"
                  type="checkbox"
                  label="Save to my passenger list for future bookings"
                  checked={
                    saveToMaster
                  }
                  onChange={(e) =>
                    setSaveToMaster(
                      e.target.checked
                    )
                  }
                />


                {/* =================
                    ADD PASSENGER
                ================== */}

                <Button
                  type="submit"
                  variant="outline-primary"
                  disabled={
                    selected.length >=
                    MAX_PASSENGERS
                  }
                >
                  + Add Passenger
                </Button>

              </Form>

            )}

          </Formik>

        </Card.Body>

      </Card>


      {/* =========================
          SELECTED PASSENGERS
      ========================== */}

      {selected.length > 0 && (

        <Card className="mb-3">

          <Card.Body>

            <h6>
              Passengers in this booking ({selected.length})
            </h6>
            <ul className="mb-0">
              {selected.map(
                (passenger) => (

                  <li
                    key={
                      passenger.id
                    }
                  >
                    {passenger.name},{" "}
                    {passenger.age},{" "}
                    {passenger.gender}
                    {" — "}
                    {
                      passenger.berthPreference
                    }
                  </li>

                )
              )}

            </ul>

          </Card.Body>

        </Card>

      )}


      {/* =========================
          FOOTER
      ========================== */}

      <div className="d-flex justify-content-between align-items-center">

        <h5>
          Total Fare:{" "}
          {formatCurrency(
            totalFare
          )}
        </h5>


        <Button
          size="lg"
          onClick={onProceed}
          disabled={
            selected.length === 0
          }
        >
          Proceed to Payment
        </Button>

      </div>

    </div>
  );
}


export default BookPassengers;