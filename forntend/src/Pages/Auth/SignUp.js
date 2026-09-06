import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Button,Alert,Card,Form as BootstrapForm } from "react-bootstrap";
import { Formik, Form, getIn } from "formik";
import { registerAction } from "./Store/Action";
import {signUpInitialVals as initialValues, signUpValidationSchema as validationSchema} from "./validationSchema";


function SignUp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [errStatus, setErrStatus] = useState("");

  const handleSubmit = (values) => {
    const payload = {
      userName: values.userName.trim(),
      email: values.email.trim(),
      mobile: values.mobile,
      password: values.password,
    };
    dispatch(registerAction(payload)).then(res =>{
      if (res?.payload?.data?.status) {
        navigate("/");
      } else {
        const message =
          res?.payload?.data?.message?.[0]?.description ||
          "Registration failed. Please try again.";
        setErrStatus(message);
      }
    })
  };

  return (
    <div className="auth-page">
      <Card className="auth-card">
        <Card.Body>
          <h3 className="auth-title">
            Create your account
          </h3>

          <p className="auth-subtitle">
            Sign up to start booking train tickets
          </p>

          {/* API Error */}
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
              handleChange,
              handleBlur,
              isSubmitting,
              touched,
              errors,
            }) => (
              <Form noValidate>

                {/* Username */}
                <BootstrapForm.Group className="mb-3">
                  <BootstrapForm.Label>
                    Username
                  </BootstrapForm.Label>

                  <BootstrapForm.Control
                    type="text"
                    name="userName"
                    value={values.userName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={Boolean(
                      getIn(touched, "userName") &&
                        getIn(errors, "userName")
                    )}
                  />

                  <BootstrapForm.Control.Feedback type="invalid">
                    {getIn(errors, "userName")}
                  </BootstrapForm.Control.Feedback>
                </BootstrapForm.Group>

                {/* Email */}
                <BootstrapForm.Group className="mb-3">
                  <BootstrapForm.Label>
                    Email
                  </BootstrapForm.Label>

                  <BootstrapForm.Control
                    type="email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={Boolean(
                      getIn(touched, "email") &&
                        getIn(errors, "email")
                    )}
                  />

                  <BootstrapForm.Control.Feedback type="invalid">
                    {getIn(errors, "email")}
                  </BootstrapForm.Control.Feedback>
                </BootstrapForm.Group>

                {/* Mobile */}
                <BootstrapForm.Group className="mb-3">
                  <BootstrapForm.Label>
                    Mobile Number
                  </BootstrapForm.Label>

                  <BootstrapForm.Control
                    type="text"
                    name="mobile"
                    value={values.mobile}
                    maxLength={10}
                    inputMode="numeric"
                    onChange={(e) => {
                      const value =
                        e.target.value.replace(/\D/g, "");

                      handleChange({
                        target: {
                          name: "mobile",
                          value: value,
                        },
                      });
                    }}
                    onBlur={handleBlur}
                    isInvalid={Boolean(
                      getIn(touched, "mobile") &&
                        getIn(errors, "mobile")
                    )}
                  />

                  <BootstrapForm.Control.Feedback type="invalid">
                    {getIn(errors, "mobile")}
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

                {/* Confirm Password */}
                <BootstrapForm.Group className="mb-3">
                  <BootstrapForm.Label>
                    Confirm Password
                  </BootstrapForm.Label>

                  <BootstrapForm.Control
                    type="password"
                    name="confirmPassword"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={Boolean(
                      getIn(touched, "confirmPassword") &&
                        getIn(errors, "confirmPassword")
                    )}
                  />

                  <BootstrapForm.Control.Feedback type="invalid">
                    {getIn(errors, "confirmPassword")}
                  </BootstrapForm.Control.Feedback>
                </BootstrapForm.Group>

                {/* Submit */}
                <Button
                  type="submit"
                  className="w-100"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Creating account..."
                    : "Sign Up"}
                </Button>
              </Form>
            )}
          </Formik>

          {/* Login Link */}
          <div className="auth-footer">
            Already have an account?{" "}
            <Link to="/">
              Login
            </Link>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default SignUp;