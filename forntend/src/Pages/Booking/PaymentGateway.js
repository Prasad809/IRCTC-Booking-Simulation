import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Card, Form as BootstrapForm, Button, Row, Col, Alert, Spinner } from "react-bootstrap";
import { Formik, Form, getIn } from "formik";
import { formatCurrency } from "../../Common/utils";
import { bookingTicketsAction } from "./Store/Action";
import { getPaymentMthdsAction } from "../PaymentMethods/Store/Action";
import token from "../../Common/token";
import { paymentInitialValues  as initialValues, paymentValidationSchema as validationSchema} from "./validationSchema";




function PaymentGateway() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const draft = token.getDraftBookingDtls();

  const user = useSelector(
    (s) => s.authReducer.user
  );

  const [savedMethods, setSavedMethods] = useState([]);
  const [mode, setMode] = useState("NEW");
  const [selectedMethodId, setSelectedMethodId] = useState("");
  const [paymentMtdObj, setPaymentMtObj] = useState({});
  const [payError, setPayError] = useState("");
  const maskCardNumber = (cardNumber) => {
    if (!cardNumber) {
      return "";
    }

    return (
      "**** **** **** " +
      cardNumber.slice(-4)
    );
  };


  const handleGetPaymentMethods = () => {
    dispatch(
      getPaymentMthdsAction({
        userNameOrEmail: user?.userName
      })
    ).then((res) => {
      if (res?.payload?.data?.status) {
        const methods = res?.payload?.data?.listOfMethods || [];
        setSavedMethods(methods);
        if (methods.length > 0) {
          setMode("SAVED");
          setSelectedMethodId(methods[0]?.id || "");
        } else {
          setMode("NEW");
          setSelectedMethodId("");
        }
      }
    });
  };


  useEffect(() => {
    if (user?.userName) {
      handleGetPaymentMethods();
    }
  }, [user?.userName]);


  if (!draft?.train) {
    navigate("/searchTrains");
    return null;
  }
  const totalFare = Number(draft.fare || 0) * Number(draft.passengers?.length || 0);

  const onPay = (values) => {    
    setPayError("");
      const selectedMethod = savedMethods.find(
        (method) =>
          String(method.id) === String(selectedMethodId)
      );
      if (mode === "SAVED" && !selectedMethod) {
        setPayError("Please select a payment method");
        return;
      }
      
      const bookingPayload = {
        userNameOrEmail: user?.userName || user?.email,
        trainName: draft.train.trainName,
        trainNo: draft.train.trainNo,
        source: draft.train.source,
        destination: draft.train.destination,
        date: draft.date,
        classCode: draft.classCode,
        quota: draft.quota,
        passengers: draft.passengers,
        fare: draft.fare,
        totalFare: totalFare,
        paymentMethodType:mode === "SAVED" ? selectedMethod.type : values.type,
        cardNumber:mode === "SAVED" ? selectedMethod?.cardNumber : values?.cardNumber,
        expiry: mode === "SAVED" ? selectedMethod?.expiry : values.expiry,
        upiId:mode === "SAVED" ? selectedMethod?.upiId : values.upiId,
      };
      dispatch(
        bookingTicketsAction(bookingPayload)
      ).then((res) => {
        if (res?.payload?.data?.status) {
          token.setBookingDtls(res?.payload?.data?.lookUpData);
          navigate("/bookingConfirmation");
        } else {
          setPayError(
            res?.payload?.data?.message?.[0]?.descrption ||
            "Booking failed. Please try again."
          );
        }
      });
  };


  return (

    <div className="page-container">

      <h4 className="page-title">
        Payment
      </h4>


      {/* BOOKING SUMMARY */}

      <Card className="mb-3 summary-card">

        <Card.Body>

          <Row>

            <Col md={6}>

              <b>
                {draft.train.trainName}
              </b>{" "}

              ({draft.train.trainNo})

              <br />

              {draft.train.source}
              {" → "}
              {draft.train.destination}

              {" · "}

              {draft.date}

            </Col>


            <Col md={3}>

              {draft.classCode}
              {" · "}
              {draft.quota}

            </Col>


            <Col md={3}>

              {draft.passengers?.length || 0}
              {" passenger(s)"}

            </Col>

          </Row>

        </Card.Body>

      </Card>


      {/* ERROR */}

      {payError && (

        <Alert
          variant="danger"
          dismissible
          onClose={() =>
            setPayError("")
          }
        >

          {payError}

        </Alert>

      )}


      <Card className="form-card mb-3">

        <Card.Body>

          <Formik
            initialValues={initialValues}
            validationSchema={mode == "NEW" ? validationSchema : undefined}
            onSubmit={(data)=>onPay(data)}
          >

            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur
            }) => (

              <Form>
                {/* PAYMENT MODE */}

                <div className="mb-3">
                  {savedMethods.length > 0 && (

                    <BootstrapForm.Check

                      inline

                      type="radio"

                      label="Use saved payment method"

                      name="paymentMode"

                      checked={
                        mode === "SAVED"
                      }

                      onChange={() =>
                        setMode("SAVED")
                      }

                    />

                  )}
                  <BootstrapForm.Check
                    inline
                    type="radio"
                    label="Pay with new card / UPI"
                    name="paymentMode"
                    checked={
                      mode === "NEW"
                    }
                    onChange={() =>
                      setMode("NEW")
                    }
                  />

                </div>


                {/* SAVED METHODS */}

                {mode === "SAVED" ? (

                  <BootstrapForm.Group
                    className="mb-3"
                  >

                    <BootstrapForm.Label>
                      Choose payment method
                    </BootstrapForm.Label>


                    <BootstrapForm.Select

                      value={
                        selectedMethodId
                      }

                      onChange={(e) =>
                        setSelectedMethodId(
                          e.target.value
                        )
                      }

                    >

                      <option value="">
                        Select payment method
                      </option>


                      {savedMethods.map(
                        (method) => (

                          <option
                            key={method.id}
                            value={method.id}
                          >

                            {method.type === "UPI"

                              ? `UPI - ${method.upiId}`

                              : `${method.nickName} - ${maskCardNumber(
                                method.cardNumber
                              )}`}

                          </option>

                        )
                      )}

                    </BootstrapForm.Select>

                  </BootstrapForm.Group>

                ) : (

                  <>

                    {/* PAYMENT TYPE */}

                    <Row>

                      <Col md={4}>

                        <BootstrapForm.Group
                          className="mb-3"
                        >

                          <BootstrapForm.Label>
                            Payment Type
                          </BootstrapForm.Label>


                          <BootstrapForm.Select

                            name="type"

                            value={
                              values.type
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
                                  "type"
                                ) &&
                                getIn(
                                  errors,
                                  "type"
                                )
                              )
                            }

                          >

                            <option value="DEBIT">
                              Debit Card
                            </option>

                            <option value="CREDIT">
                              Credit Card
                            </option>

                            <option value="UPI">
                              UPI
                            </option>

                          </BootstrapForm.Select>


                          <BootstrapForm.Control.Feedback
                            type="invalid"
                          >

                            {getIn(
                              errors,
                              "type"
                            )}

                          </BootstrapForm.Control.Feedback>

                        </BootstrapForm.Group>

                      </Col>

                    </Row>


                    {/* CARD */}

                    {values.type !== "UPI" ? (

                      <Row>

                        {/* CARDHOLDER */}

                        <Col md={4}>

                          <BootstrapForm.Group
                            className="mb-3"
                          >

                            <BootstrapForm.Label>
                              Cardholder Name
                            </BootstrapForm.Label>


                            <BootstrapForm.Control

                              type="text"

                              name="holderName"

                              value={
                                values.holderName
                              }

                              onChange={
                                handleChange
                              }

                              onBlur={
                                handleBlur
                              }

                              placeholder="Enter cardholder name"

                              isInvalid={
                                Boolean(
                                  getIn(
                                    touched,
                                    "holderName"
                                  ) &&
                                  getIn(
                                    errors,
                                    "holderName"
                                  )
                                )
                              }

                            />


                            <BootstrapForm.Control.Feedback
                              type="invalid"
                            >

                              {getIn(
                                errors,
                                "holderName"
                              )}

                            </BootstrapForm.Control.Feedback>

                          </BootstrapForm.Group>

                        </Col>


                        {/* CARD NUMBER */}

                        <Col md={3}>

                          <BootstrapForm.Group
                            className="mb-3"
                          >

                            <BootstrapForm.Label>
                              Card Number
                            </BootstrapForm.Label>


                            <BootstrapForm.Control

                              type="text"

                              name="cardNumber"

                              inputMode="numeric"

                              maxLength={16}

                              value={
                                values.cardNumber
                              }

                              onChange={(e) => {

                                const value =
                                  e.target.value.replace(
                                    /\D/g,
                                    ""
                                  );

                                handleChange({
                                  target: {
                                    name:
                                      "cardNumber",
                                    value
                                  }
                                });

                              }}

                              onBlur={
                                handleBlur
                              }

                              placeholder="16 digit card number"

                              isInvalid={
                                Boolean(
                                  getIn(
                                    touched,
                                    "cardNumber"
                                  ) &&
                                  getIn(
                                    errors,
                                    "cardNumber"
                                  )
                                )
                              }

                            />


                            <BootstrapForm.Control.Feedback
                              type="invalid"
                            >

                              {getIn(
                                errors,
                                "cardNumber"
                              )}

                            </BootstrapForm.Control.Feedback>

                          </BootstrapForm.Group>

                        </Col>


                        {/* EXPIRY */}

                        <Col md={2}>

                          <BootstrapForm.Group
                            className="mb-3"
                          >

                            <BootstrapForm.Label>
                              Expiry
                            </BootstrapForm.Label>


                            <BootstrapForm.Control

                              type="text"

                              name="expiry"

                              placeholder="MM/YY"

                              maxLength={5}

                              value={
                                values.expiry
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
                                    "expiry"
                                  ) &&
                                  getIn(
                                    errors,
                                    "expiry"
                                  )
                                )
                              }

                            />


                            <BootstrapForm.Control.Feedback
                              type="invalid"
                            >

                              {getIn(
                                errors,
                                "expiry"
                              )}

                            </BootstrapForm.Control.Feedback>

                          </BootstrapForm.Group>

                        </Col>


                        {/* CVV */}

                        <Col md={2}>

                          <BootstrapForm.Group
                            className="mb-3"
                          >

                            <BootstrapForm.Label>
                              CVV
                            </BootstrapForm.Label>


                            <BootstrapForm.Control

                              type="password"

                              name="cvv"

                              inputMode="numeric"

                              maxLength={3}

                              value={
                                values.cvv
                              }

                              onChange={(e) => {

                                const value =
                                  e.target.value.replace(
                                    /\D/g,
                                    ""
                                  );

                                handleChange({
                                  target: {
                                    name:
                                      "cvv",
                                    value
                                  }
                                });

                              }}

                              onBlur={
                                handleBlur
                              }

                              placeholder="CVV"

                              isInvalid={
                                Boolean(
                                  getIn(
                                    touched,
                                    "cvv"
                                  ) &&
                                  getIn(
                                    errors,
                                    "cvv"
                                  )
                                )
                              }

                            />


                            <BootstrapForm.Control.Feedback
                              type="invalid"
                            >

                              {getIn(
                                errors,
                                "cvv"
                              )}

                            </BootstrapForm.Control.Feedback>

                          </BootstrapForm.Group>

                        </Col>

                      </Row>

                    ) : (

                      /* UPI */

                      <Row>

                        <Col md={5}>

                          <BootstrapForm.Group
                            className="mb-3"
                          >

                            <BootstrapForm.Label>
                              UPI ID
                            </BootstrapForm.Label>


                            <BootstrapForm.Control

                              type="text"

                              name="upiId"

                              placeholder="yourname@upi"

                              value={
                                values.upiId
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
                                    "upiId"
                                  ) &&
                                  getIn(
                                    errors,
                                    "upiId"
                                  )
                                )
                              }

                            />


                            <BootstrapForm.Control.Feedback
                              type="invalid"
                            >

                              {getIn(
                                errors,
                                "upiId"
                              )}

                            </BootstrapForm.Control.Feedback>

                          </BootstrapForm.Group>

                        </Col>

                      </Row>

                    )}


                    <p className="text-muted small">

                      Tip: use a card number ending
                      in <b>0000</b> to see the
                      simulated payment-failure flow.

                    </p>

                  </>

                )}


                {/* PAYMENT FOOTER */}

                <div className="d-flex justify-content-between align-items-center mt-3">

                  <h5 className="mb-0">

                    Amount Payable:{" "}

                    {formatCurrency(
                      totalFare
                    )}

                  </h5>


                  <Button
                    type="submit"
                    size="lg"
                  >
                    Pay Now

                  </Button>

                </div>

              </Form>

            )}

          </Formik>

        </Card.Body>

      </Card>

    </div>
  );
}


export default PaymentGateway;