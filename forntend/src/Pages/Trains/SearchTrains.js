import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Form as BootstrapForm, Button, Row, Col, Alert } from "react-bootstrap";
import { Formik, Form, getIn } from "formik";
import { getTrainsListAct, getTrainsSearchAct } from "./Store/Action";
import { todayISO } from "../../Common/utils";
import TrainResults from "./TrainResults";
import { initialValues, validationSchema } from "./validationSchema";



function SearchTrains() {
  const dispatch = useDispatch();
  const [searched, setSearched] = useState(false);
  const [searching, setSearching] = useState(false);
  const [search, setSearch] = useState({});
  const [stations, setStations] = useState([]);
  const [searchTrain, setSearchTrain] = useState([]);

  const handleTrainList = () => {
    dispatch(getTrainsListAct()).then(res => {
      if (res?.payload?.data?.status) {
        setStations(res?.payload?.data?.lookUpData || []);
      }
    });
  };
  useEffect(() => {
    handleTrainList();
  }, []);

  const handleSubmit = async (values) => {
    const payload = {
      source: values?.source,
      destination: values?.destination,
      journeyDate: values?.date
    };
    dispatch(getTrainsSearchAct(payload)).then(res => {
      if(res?.payload?.data?.status) {
        setSearchTrain(res?.payload?.data?.lookUpData || []);
        setSearching(true);
        setSearch(values);
        setSearching(false);
        setSearched(true);
      }else {
        alert(res?.payload?.data?.message || "Something went wrong");
      }
    });
  };


  return (

    <div className="page-container">

      <h4 className="page-title">
        Search Trains
      </h4>


      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize
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

            <Card className="form-card mb-3">

              <Card.Body>

                <Row className="align-items-end">


                  {/* ================================= */}
                  {/* From */}
                  {/* ================================= */}

                  <Col md={4}>

                    <BootstrapForm.Group
                      className="mb-3"
                    >

                      <BootstrapForm.Label>
                        From
                      </BootstrapForm.Label>

                      <BootstrapForm.Select
                        name="source"
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
                      >

                        <option value="">
                          Select source station
                        </option>

                        {stations.map(
                          (station) => (

                            <option
                              key={station.key}
                              value={station.value}
                            >
                              {station.value}
                            </option>

                          )
                        )}

                      </BootstrapForm.Select>

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


                  {/* ================================= */}
                  {/* To */}
                  {/* ================================= */}

                  <Col md={4}>

                    <BootstrapForm.Group
                      className="mb-3"
                    >

                      <BootstrapForm.Label>
                        To
                      </BootstrapForm.Label>

                      <BootstrapForm.Select
                        name="destination"
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
                      >

                        <option value="">
                          Select destination station
                        </option>

                        {stations.map(
                          (station) => (

                            <option
                              key={station.key}
                              value={station.value}
                            >
                              {station.value}
                            </option>

                          )
                        )}

                      </BootstrapForm.Select>

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


                  {/* ================================= */}
                  {/* Date */}
                  {/* ================================= */}

                  <Col md={3}>

                    <BootstrapForm.Group
                      className="mb-3"
                    >

                      <BootstrapForm.Label>
                        Date of Journey
                      </BootstrapForm.Label>

                      <BootstrapForm.Control
                        type="date"
                        name="date"
                        min={todayISO()}
                        value={
                          values.date
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
                            "date"
                          ) &&
                          getIn(
                            errors,
                            "date"
                          )
                        )}
                      />

                      <BootstrapForm.Control.Feedback
                        type="invalid"
                      >
                        {getIn(
                          errors,
                          "date"
                        )}
                      </BootstrapForm.Control.Feedback>

                    </BootstrapForm.Group>

                  </Col>


                  {/* ================================= */}
                  {/* Search */}
                  {/* ================================= */}

                  <Col md={1}>

                    <Button
                      type="submit"
                      className="mb-3 w-100"
                      disabled={
                        searching ||
                        isSubmitting
                      }
                    >
                      {searching
                        ? "..."
                        : "Search"}
                    </Button>

                  </Col>

                </Row>


                {/* ================================= */}
                {/* Same Station */}
                {/* ================================= */}

                {values.source &&
                  values.source ===
                  values.destination && (

                    <Alert
                      variant="warning"
                      className="py-2"
                    >
                      Source and destination
                      cannot be the same
                    </Alert>

                  )}

              </Card.Body>

            </Card>

          </Form>

        )}
      </Formik>
      {searched && (

        <TrainResults
          trains={searchTrain || []}
          date={search.date || todayISO()}
        />

      )}

    </div>
  );
}

export default SearchTrains;
