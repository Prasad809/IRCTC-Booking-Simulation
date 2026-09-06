import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Button, Alert, Row, Col, Form as BootstrapForm } from "react-bootstrap";
import { Formik, Form as FormikForm } from "formik";
import { getUserDtlsAct, UpdateUserAct } from "./Store/Action";
import InfoModal from "../../libs/InfoModal";
import Loader from "../../libs/Loader";
import { initialValues, validationSchema } from "./validationSchema";

const loader = (load) => {
  return load ? <Loader text={"loading....!"} fullPage={true} size="lg" /> : null;
}

function UserProfile() {
  const dispatch = useDispatch();
  const userDtls = useSelector((s) => s.authReducer.user);
  const [user, setUser] = useState({});
  const [errMsg, setErrMsg] = useState("");
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleLoginAgain = () => {
    setShowLoginModal(false);
    window.location.href = "/";
  };
  const handleGetUser = () => {
    setLoading(true);
    dispatch(getUserDtlsAct({ userNameOrEmail: userDtls.email || userDtls.userName })).then(res => {
      if (res?.payload?.data?.status) {
        setUser(res?.payload?.data?.user);
      } else {
        setErrMsg(res?.payload?.data?.message?.[0]?.description);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    handleGetUser();
  }, []);



  const handleSubmit = async (values) => {
    const payload = {
      userNameOrEmail: userDtls.email || userDtls.userName,
      userName: values.userName,
      email: values.email,
      mobile: values.mobile
    };

    dispatch(UpdateUserAct(payload)).then(res => {
      if (res?.payload?.data?.status) {
        setErrMsg(res?.payload?.data?.message?.[0]?.description);
        setEditing(false);
        setSaved(true);
        setShowLoginModal(true);
      } else {
        setErrMsg(res?.payload?.data?.message?.[0]?.description);
      }
    });
  };

  return (
    <div className="page-container">
      {loader(loading)}
      <h4 className="page-title">My Profile</h4>

      {saved && (
        <Alert variant="warning" onClose={() => setSaved(false)} dismissible>
          {errMsg || "Profile updated successfully!"}
        </Alert>
      )}

      <Card className="profile-card">
        <Card.Body>

          <div className="profile-avatar">
            {user?.userName?.[0]?.toUpperCase()}
          </div>

          {!editing ? (
            <>
              <Row className="profile-row">
                <Col sm={4} className="profile-label">
                  Username
                </Col>
                <Col sm={8}>{user?.userName}</Col>
              </Row>

              <Row className="profile-row">
                <Col sm={4} className="profile-label">
                  Email
                </Col>
                <Col sm={8}>{user?.email}</Col>
              </Row>

              <Row className="profile-row">
                <Col sm={4} className="profile-label">
                  Mobile
                </Col>
                <Col sm={8}>{user?.mobile}</Col>
              </Row>

              <Row className="profile-row">
                <Col sm={4} className="profile-label">
                  Role
                </Col>
                <Col sm={8}>{user?.role}</Col>
              </Row>

              <Button
                className="mt-3"
                onClick={() => setEditing(true)}
              >
                Edit Profile
              </Button>
            </>
          ) : (
            <Formik
              initialValues={user}
              validationSchema={validationSchema}
              enableReinitialize={true}
              onSubmit={handleSubmit}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                isSubmitting
              }) => (
                <FormikForm>

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
                      isInvalid={
                        touched.userName && !!errors.userName
                      }
                    />

                    <BootstrapForm.Control.Feedback type="invalid">
                      {errors.userName}
                    </BootstrapForm.Control.Feedback>
                  </BootstrapForm.Group>

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
                      isInvalid={
                        touched.email && !!errors.email
                      }
                    />

                    <BootstrapForm.Control.Feedback type="invalid">
                      {errors.email}
                    </BootstrapForm.Control.Feedback>
                  </BootstrapForm.Group>

                  <BootstrapForm.Group className="mb-3">
                    <BootstrapForm.Label>
                      Mobile
                    </BootstrapForm.Label>

                    <BootstrapForm.Control
                      type="text"
                      name="mobile"
                      value={values.mobile}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      maxLength={10}
                      isInvalid={
                        touched.mobile && !!errors.mobile
                      }
                    />

                    <BootstrapForm.Control.Feedback type="invalid">
                      {errors.mobile}
                    </BootstrapForm.Control.Feedback>
                  </BootstrapForm.Group>

                  <Button
                    type="submit"
                    variant="primary"
                    className="me-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Save"}
                  </Button>

                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setEditing(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>

                </FormikForm>
              )}
            </Formik>
          )}

        </Card.Body>
      </Card>
      <InfoModal 
      show={showLoginModal} 
      title={"Profile Updated"} 
      message={"Profile updated successfully!.Please login again for the changes to take effect."} 
      buttonLabel={"Login Again"}
      onAction={handleLoginAgain}
      />
    </div>
  );
}

export default UserProfile;