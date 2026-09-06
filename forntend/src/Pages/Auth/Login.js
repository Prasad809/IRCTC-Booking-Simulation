import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Button,Alert,Card,Form as BootstrapForm } from "react-bootstrap";
import { Formik, getIn, Form } from "formik";
import { authAction } from "./Store/Action";
import { useState } from "react";
import token from "../../Common/token";
import { loginInitialVals as  initialValues,loginValidationSchema as validationSchema } from "./validationSchema";

function Login({ setNxt }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errStatus, setErrStatus] = useState("");

  // DO NOT CHANGE
  const handleSubmit = (values) => {
    const payload = {
      password: values?.password,
      userNameOrEmail: values?.userNameOrEmail
    };

    dispatch(authAction(payload)).then(res => {
      if (res?.payload?.data?.status) {
        token.setUserLoginDtls(res?.payload?.data);
        if (res?.payload?.data?.role === "ADMIN") {
          navigate("/adminDashboard");
        } else {
          navigate("/dashboard");
        }
        setNxt("1");
      } else {
        setErrStatus(res?.payload?.data?.message?.[0]?.description);
      }
    });
  };

  return (
    <div className="auth-page">
      <Card className="auth-card">
        <Card.Body>
          <h3 className="auth-title">
            IRCTC Booking Simulation
          </h3>
          <p className="auth-subtitle">
            Log in to search trains and manage bookings
          </p>

          {errStatus && (
            <Alert
              variant="danger"
              dismissible
              onClose={() => setErrStatus("")}
            >
              {errStatus}
            </Alert>
          )}

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              isSubmitting,
            }) => (
              <Form noValidate>

                {/* Username / Email */}
                <BootstrapForm.Group className="mb-3">
                  <BootstrapForm.Label>
                    Username or Email
                  </BootstrapForm.Label>

                  <BootstrapForm.Control
                    type="text"
                    name="userNameOrEmail"
                    value={values.userNameOrEmail}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={Boolean(
                      getIn(touched, "userNameOrEmail") &&
                      getIn(errors, "userNameOrEmail")
                    )}
                  />

                  <BootstrapForm.Control.Feedback type="invalid">
                    {getIn(errors, "userNameOrEmail")}
                  </BootstrapForm.Control.Feedback>
                </BootstrapForm.Group>

                {/* Password */}
                <BootstrapForm.Group className="mb-3">
                  <BootstrapForm.Label>
                    Password
                  </BootstrapForm.Label>

                  <BootstrapForm.Control
                    type="password"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={Boolean(
                      getIn(touched, "password") &&
                      getIn(errors, "password")
                    )}
                  />

                  <BootstrapForm.Control.Feedback type="invalid">
                    {getIn(errors, "password")}
                  </BootstrapForm.Control.Feedback>
                </BootstrapForm.Group>

                {/* Submit */}
                <Button
                  type="submit"
                  className="w-100"
                >Login
                </Button>

              </Form>
            )}
          </Formik>

          <div className="auth-footer">
            New user?{" "}
            <Link to="/signUp">
              Create an account
            </Link>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Login;