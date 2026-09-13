import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Card, Table, Button, Badge, Row, Col } from "react-bootstrap";
import { CLASS_LABELS } from "../../Common/seedData";
import { formatCurrency } from "../../Common/utils";
import { getTrainRoutesAction, removeTrainRoutesAction } from "./Store/Action";
import { useEffect, useState } from "react";
import { bookedTicketsAction } from "../Booking/Store/Action";
import Loader from "../../libs/Loader";
import { runJobAction } from "../Auth/Store/Action";
import "./AdminUsersList.css"

const loader = (load) =>{
  return load ? <Loader  fullPage={true} size="lg"/> : null;
}

function AdminDashboard() {
  const dispatch = useDispatch();
  const [trains, setTrains] = useState([]);
  const user = useSelector((s) => s.authReducer.user);

  const [bookings,setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState({ bool: false, msg: "" })

  const handleRunJob=()=>{
    setLoading(true);
    dispatch(runJobAction()).then(res =>{
      if(res.payload.data.status){
        setSuccess({ bool: true, msg: res.payload.data.message[0].description })
      }else{
        setSuccess({ bool: true, msg: res.payload.data.message[0].description })
      }
      setLoading(false);
    })
  }

    const handleGetTickets=()=>{
      setLoading(true);
      dispatch(bookedTicketsAction({userNameOrEmail:user.userName})).then(res =>{
        if(res?.payload?.data?.status){
          setBookings(res?.payload?.data?.lookUpData || [])
        }else{
          
        }
        setLoading(false);
      })
    }  

  const hadleGetTrainRoutes = () => {
    setLoading(true);
    dispatch(getTrainRoutesAction({userNameOrEmail:user.email || user.userName})).then(res =>{
      setTrains(res?.payload?.data?.lookUpData || []);
      setLoading(false);
    });
  };

  const handleRemoveTrainRoutes = (id) => {
    dispatch(removeTrainRoutesAction({userNameOrEmail:user.email || user.userName,trainId:id})).then(res =>{
      hadleGetTrainRoutes();
    })
  };
  
  useEffect(() => {
    hadleGetTrainRoutes();
    handleGetTickets();
  }, []);


  return (
    <div className="page-container">
      {loader(loading)}
      <div className="d-flex justify-content-between align-items-center">
        <h4 className="page-title">Admin Dashboard</h4>
        <Button onClick={handleRunJob}>Run Seat Inventory</Button>
      </div>

      <Row className="mb-3">
        <Col md={4}>
          <Card className="stat-card"><Card.Body>
            <div className="stat-value">{trains?.length}</div>
            <div className="stat-label">Total Routes</div>
          </Card.Body></Card>
        </Col>
        <Col md={4}>
          <Card className="stat-card"><Card.Body>
            <div className="stat-value">{bookings.filter((b) => b.status === "CONFIRMED").length}</div>
            <div className="stat-label">Confirmed Bookings</div>
          </Card.Body></Card>
        </Col>
        <Col md={4}>
          <Card className="stat-card"><Card.Body>
            <div className="stat-value">{bookings.filter((b) => b.status === "CANCELLED").length}</div>
            <div className="stat-label">Cancelled Bookings</div>
          </Card.Body></Card>
        </Col>
      </Row>

      <h6>Train Routes</h6>
      <Table bordered hover responsive className="mb-4">
        <thead>
          <tr>
            <th>Train No</th><th>Name</th><th>Route</th><th>Timing</th><th>Classes</th><th>Run Days</th><th></th>
          </tr>
        </thead>
        <tbody>
          {trains?.map((t) => (
            <tr key={t.id}>
              <td>{t.trainNo}</td>
              <td>{t.trainName}</td>
              <td>{t.source} → {t.destination}</td>
              <td>{t.departureTime} - {t.arrivalTime}</td>
              <td>{t.classes.map((c) => `${c.code} (${formatCurrency(c.fare)})`).join(", ")}</td>
              <td>{t.runDays ? t.runDays.join(", ") : "N/A"}</td>
              <td>
                <Button variant="outline-danger" size="sm" onClick={() => handleRemoveTrainRoutes(t.id)}>
                  Remove
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h6>All Bookings</h6>
      {bookings.length === 0 ? (
        <p className="text-muted">No bookings yet.</p>
      ) : (
        <Table bordered hover responsive>
          <thead>
            <tr><th>PNR</th><th>Train</th><th>Date</th><th>Class</th><th>Passengers</th><th>Fare</th><th>Status</th></tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.pnr}>
                <td>{b.pnr}</td>
                <td>{b.trainName} ({b.trainNo})</td>
                <td>{b.date}</td>
                <td>{CLASS_LABELS[b.classCode]}</td>
                <td>{b.passengers.length}</td>
                <td>{formatCurrency(b.totalFare)}</td>
                <td>
                  <Badge bg={b.status === "CONFIRMED" ? "success" : "danger"}>{b.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      {success.bool && (
        <div className="aul-confirm-overlay" onClick={() => setSuccess({bool:false,msg:""})}>
          <div className="aul-confirm-card" onClick={(e) => e.stopPropagation()}>
            <h5 className="aul-confirm-title">
              Completed Seat Inventory
            </h5>
            <p className="aul-confirm-message">{success.msg}</p>
          <div className="aul-confirm-actions">
              <button type="button" className="aul-confirm-btn aul-confirm-yes" onClick={()=>setSuccess({bool:false,msg:""})}>
                Okay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
