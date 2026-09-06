import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Card, Table, Form, Button, Badge } from "react-bootstrap";
import { CLASS_LABELS, QUOTA_LABELS } from "../../Common/seedData";
import { formatCurrency } from "../../Common/utils";
import token from "../../Common/token";
import { getClassesAct, getQuotasAct } from "../Booking/Store/Action";
import Loader from "../../libs/Loader";


const loader = (load) =>{
  return load ? <Loader text={"loading....!"} fullPage={true} size="lg"/> : null;
};

function TrainResults({ trains, date }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [quotaByTrainClass, setQuotaByTrainClass] = useState({});
  const [trainClasses, setTrainClasses] = useState([]);
  const [trainQuotas, setTrainQuotas] = useState([]);
  const [loading, setLoading] = useState(false);

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

  console.log(trainClasses,trainQuotas)

  useEffect(()=>{
    // handleGetTrainClasses();
    // handleGetTrainQuotas();
  },[]);

  if (!trains || trains.length === 0) {
    return <p className="text-muted">No trains found for this route on the selected date.</p>;
  }
  const getQuota = (trainId, classCode) =>
    quotaByTrainClass[`${trainId}_${classCode}`] || "GENERAL";

  const setQuota = (trainId, classCode, quota) =>
    setQuotaByTrainClass({ ...quotaByTrainClass, [`${trainId}_${classCode}`]: quota });

  const onBook = (train, classCode, quota, availability) => {
    token.setDraftBookingDtls({
      train,
      date,
      classCode,
      quota,
      fare: availability.fare,
      quotaSeats: availability.quotaSeats,
    });
    navigate("/bookPassengers");
  };

  return (
    <>
      {loader(loading)}
      {trains.map((train) => (
        <Card key={train.id} className="train-card mb-3">
          <Card.Body>
            <div className="d-flex justify-content-between flex-wrap">
              <div>
                <h5 className="mb-0">{train.trainName}</h5>
                <div className="text-muted small">Train No: {train.trainNo}</div>
              </div>
              <div className="train-timing">
                <span>{train.departureTime}</span> → <span>{train.arrivalTime}</span>
                <div className="text-muted small text-center">{train.duration}</div>
              </div>
            </div>
            <Table borderless size="sm" className="mt-3 mb-0">
              <thead>
                <tr>
                  <th>Class</th>
                  <th>Quota</th>
                  <th>Fare</th>
                  <th>Availability</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {(train?.classes || []).map((cls) => {
                  const quotaData =cls.quotas?.find((item) => item.quota === getQuota(train.id, cls.code));
                  const quota =quotaData?.quota || getQuota(train.id, cls.code);
                  const availableSeats = Number(quotaData?.availableSeats || 0);

                  const availability = {
                    fare: Number(cls.fare || 0),
                    available: availableSeats,
                    status: availableSeats > 0 ? "AVAILABLE" : "NOT_AVAILABLE"
                  };

                  return (
                    <tr key={cls.code}>
                      <td>
                        {CLASS_LABELS[cls.code]} ({cls.code})
                      </td>
                      <td style={{ minWidth: 160 }}>
                        <Form.Select
                          size="sm"
                          value={quota}
                          onChange={(e) =>
                            setQuota( train.id,cls.code,e.target.value)
                          }
                        >
                          {(cls.quotas || []).map((q) => (
                            <option
                              key={q.quota}
                              value={q.quota}
                            >
                              {QUOTA_LABELS[q.quota] || q.quota}
                            </option>
                          ))}
                        </Form.Select>
                      </td>

                      {/* Fare */}
                      <td>
                        {formatCurrency(cls.fare)}
                      </td>

                      {/* Availability */}
                      <td>
                        {availability.status === "AVAILABLE" && (
                          <Badge bg="success">
                            AVL {availability.available}
                          </Badge>
                        )}

                        {availability.status === "NOT_AVAILABLE" && (
                          <Badge bg="secondary">
                            Not Available
                          </Badge>
                        )}
                      </td>

                      {/* Booking */}
                      <td>
                        <Button
                          size="sm"
                          disabled={
                            availability.status === "NOT_AVAILABLE"
                          }
                          onClick={() =>
                            onBook(
                              train,
                              cls.code,
                              quota,
                              availability
                            )
                          }
                        >
                          Book Now
                        </Button>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      ))}
    </>
  );
}

export default TrainResults;
