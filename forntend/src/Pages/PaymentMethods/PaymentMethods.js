import { useDispatch, useSelector } from "react-redux";
import { Card, Form as BootstrapForm, Button, Row, Col, Badge, } from "react-bootstrap";
import { Formik, Form, getIn } from "formik";
import { addPaymentMthdsAction, removePaymentMthdsAction, getPaymentMthdsAction } from "./Store/Action";
import { useRef, useState } from "react";
import Loader from "../../libs/Loader";
import { initialValues, validationSchema } from "./validationSchema";


function maskCardNumber(cardNumber) {
    return cardNumber ? "**** **** **** " + cardNumber?.slice(-4):null;
}

const loader = (load) =>{
  return load ? <Loader text={"loading....!"} fullPage={true} size="lg"/> : null;
}

function PaymentMethods() {
  const dispatch = useDispatch();
  const [methods, setMethods] = useState([]);
  const user = useSelector((s) => s.authReducer.user);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const formikRef = useRef(null);

  const handleGetPaymentMethods = () => {
    setLoading(true);
    dispatch(
      getPaymentMthdsAction({
        userNameOrEmail: user?.userName || user?.email,
      })
    ).then((res) => {
      if (res?.payload?.data?.status) {
        setMethods(
          res?.payload?.data?.listOfMethods || []
        );
      }
      setLoading(false);
    });
  };

  const onSubmit = (values) => {
    const payload = {
      userNameOrEmail: user?.userName || user?.email,
      paymentType: values.type,
      nickname: values.nickName,
      cardHolderName: values.holderName,
      cardNumber: values.cardNumber,
      expiry: values.expiry,
      upiId: values.upiId,
    };
    setLoading(true);
    dispatch(addPaymentMthdsAction(payload)).then((res) => {
      if (res?.payload?.data?.status) {
        formikRef.current.resetForm();
        setShowForm(false);
        handleGetPaymentMethods();
      }
      setLoading(false);
    });
  };

  const handleRemovePaymentMethod = (id) => {    
    dispatch(removePaymentMthdsAction({userNameOrEmail: user?.userName || user?.email,paymentMethodId: id})).then((res) => {
      if (res?.payload?.data?.status) {
        handleGetPaymentMethods();
      }
    });
  };

useState(() => {
    handleGetPaymentMethods();
  }, []);

  return (
    <div className="page-container">
      {loader(loading)}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        innerRef={formikRef}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          resetForm
        }) => (
          <>
            {/* Header */}

            <div className="d-flex justify-content-between align-items-center">

              <h4 className="page-title">
                Saved Payment Methods
              </h4>

              <Button
                type="button"
                onClick={() =>
                  setShowForm((prev) => !prev)
                }
              >
                {showForm
            ? "Close" : "+ Add Payment Method "}
              </Button>

            </div>
              

            {showForm && (<Card className="mb-3 form-card">
              <Card.Body>

                {/* Formik Form */}

                <Form>

                  <Row>

                    {/* Payment Type */}

                    <Col md={4}>
                      <BootstrapForm.Group className="mb-3">

                        <BootstrapForm.Label>
                          Type
                        </BootstrapForm.Label>

                        <BootstrapForm.Select
                          name="type"
                          value={values.type}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={Boolean(
                            getIn(touched, "type") &&
                            getIn(errors, "type")
                          )}
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
                          {getIn(errors, "type")}
                        </BootstrapForm.Control.Feedback>

                      </BootstrapForm.Group>
                    </Col>

                    {/* Nickname */}

                    <Col md={8}>
                      <BootstrapForm.Group className="mb-3">

                        <BootstrapForm.Label>
                          Nickname (optional)
                        </BootstrapForm.Label>

                        <BootstrapForm.Control
                          name="nickName"
                          value={values.nickName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="e.g. My HDFC card"
                          isInvalid={Boolean(
                            getIn(touched, "nickName") &&
                            getIn(errors, "nickName")
                          )}
                        />

                        <BootstrapForm.Control.Feedback
                          type="invalid"
                        >
                          {getIn(errors, "nickName")}
                        </BootstrapForm.Control.Feedback>

                      </BootstrapForm.Group>
                    </Col>

                  </Row>

                  {/* CARD FIELDS */}

                  {values.type !== "UPI" && (
                    <Row>

                      {/* Cardholder */}

                      <Col md={5}>
                        <BootstrapForm.Group className="mb-3">

                          <BootstrapForm.Label>
                            Cardholder Name
                          </BootstrapForm.Label>

                          <BootstrapForm.Control
                            name="holderName"
                            value={values.holderName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Enter cardholder name"
                            isInvalid={Boolean(
                              getIn(touched, "holderName") &&
                              getIn(errors, "holderName")
                            )}
                          />

                          <BootstrapForm.Control.Feedback
                            type="invalid"
                          >
                            {getIn(errors, "holderName")}
                          </BootstrapForm.Control.Feedback>

                        </BootstrapForm.Group>
                      </Col>

                      {/* Card Number */}

                      <Col md={4}>
                        <BootstrapForm.Group className="mb-3">

                          <BootstrapForm.Label>
                            Card Number
                          </BootstrapForm.Label>

                          <BootstrapForm.Control
                            name="cardNumber"
                            value={values.cardNumber}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            maxLength={16}
                            inputMode="numeric"
                            placeholder="16 digit card number"
                            isInvalid={Boolean(
                              getIn(touched, "cardNumber") &&
                              getIn(errors, "cardNumber")
                            )}
                          />

                          <BootstrapForm.Control.Feedback
                            type="invalid"
                          >
                            {getIn(errors, "cardNumber")}
                          </BootstrapForm.Control.Feedback>

                        </BootstrapForm.Group>
                      </Col>

                      {/* Expiry */}

                      <Col md={3}>
                        <BootstrapForm.Group className="mb-3">

                          <BootstrapForm.Label>
                            Expiry (MM/YY)
                          </BootstrapForm.Label>

                          <BootstrapForm.Control
                            name="expiry"
                            value={values.expiry}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            maxLength={5}
                            placeholder="MM/YY"
                            isInvalid={Boolean(
                              getIn(touched, "expiry") &&
                              getIn(errors, "expiry")
                            )}
                          />

                          <BootstrapForm.Control.Feedback
                            type="invalid"
                          >
                            {getIn(errors, "expiry")}
                          </BootstrapForm.Control.Feedback>

                        </BootstrapForm.Group>
                      </Col>

                    </Row>
                  )}

                  {/* UPI */}

                  {values.type === "UPI" && (
                    <Row>

                      <Col md={6}>
                        <BootstrapForm.Group className="mb-3">

                          <BootstrapForm.Label>
                            UPI ID
                          </BootstrapForm.Label>

                          <BootstrapForm.Control
                            name="upiId"
                            value={values.upiId}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="yourname@upi"
                            isInvalid={Boolean(
                              getIn(touched, "upiId") &&
                              getIn(errors, "upiId")
                            )}
                          />

                          <BootstrapForm.Control.Feedback
                            type="invalid"
                          >
                            {getIn(errors, "upiId")}
                          </BootstrapForm.Control.Feedback>

                        </BootstrapForm.Group>
                      </Col>

                    </Row>
                  )}

                  <Button
                    type="submit"
                  >
                   Save Payment Method
                  </Button>

                </Form>

              </Card.Body>
            </Card>)}
          </>
        )}
      </Formik>

      {/* Saved Payment Methods */}

      {methods.length === 0 ? (
        <p className="text-muted">
          No payment methods saved yet.
        </p>

      ) : (

        <Row>

          {methods.map((method) => (

            <Col
              md={6}
              lg={4}
              key={method.id}
              className="mb-3"
            >

              <Card className="payment-method-card">

                <Card.Body>

                  <Badge
                    bg={
                      method.type === "UPI"
                        ? "info"
                        : method.type === "CREDIT"
                        ? "warning"
                        : "primary"
                    }
                  >
                    {method.type}
                  </Badge>

                  <h6 className="mt-2 mb-1">
                    {method.label ||
                      `${method.type} Card`}
                  </h6>
                  {method.type === "UPI" ? (
                    <div className="text-muted">
                      {method.upiId}
                    </div>

                  ) : (

                    <>
                      <div className="text-muted">
                        {maskCardNumber(method.cardNumber)}
                      </div>

                      <div className="text-muted small">
                        {method.holderName} · Exp{" "}
                        {method.expiry}
                      </div>
                    </>

                  )}

                  <Button
                    type="button"
                    variant="outline-danger"
                    size="sm"
                    className="mt-2"
                    onClick={() =>
                      handleRemovePaymentMethod(method.id)
                    }
                  >
                    Remove
                  </Button>

                </Card.Body>

              </Card>

            </Col>

          ))}

        </Row>

      )}

    </div>
  );
}

export default PaymentMethods;