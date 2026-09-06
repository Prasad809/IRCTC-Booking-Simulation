import { useDispatch, useSelector } from "react-redux";
import { Card, Table, Badge, Button } from "react-bootstrap";
import { CLASS_LABELS, QUOTA_LABELS } from "../../Common/seedData";
import { formatCurrency } from "../../Common/utils";
import { bookedTicketsAction, cancelBookingAct, cancelBookingAction } from "./Store/Action";
import { useEffect, useState } from "react";
import ConfirmModal from "../../libs/ConfirmModal";
import Loader from "../../libs/Loader";

const loader = (load) =>{
  return load ? <Loader text={"loading....!"} fullPage={true} size="lg"/> : null;
}

function MyBookings() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.authReducer.user);
  const [bookings,setBookings] = useState([]);
  const [allBookings,setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleGetTickets=()=>{
    setLoading(true);
    dispatch(bookedTicketsAction({userNameOrEmail:user.userName})).then(res =>{
      if(res?.payload?.data?.status){
        setBookings(res?.payload?.data?.lookUpData || [])
        setAllBookings(res?.payload?.data?.lookUpData || []);
      }else{

      };
      setLoading(false);
    })
  }

useEffect(()=>{
  handleGetTickets();
},[]);

const [pnr,setPnr] = useState(null);
const [show,setShow] = useState(false);

const handleShow=(pnr)=>{
  setShow(true);
  setPnr(pnr)
}
const onCancel=()=>{
  setShow(false);
}

const handleCancelBooking=()=>{
    const payload={
      userNameOrEmail:user.userName,
      pnr:pnr
    };
    dispatch(cancelBookingAct(payload)).then(res =>{
      if(res?.payload?.data?.status){
        setShow(false);
        handleGetTickets();
      }
    })
}


  return (
    <div className="page-container">
      {loader(loading)}
      <h4 className="page-title">My Bookings</h4>
      <select className="form-select form-select-sm mb-3" style={{ width: "200px" }} onChange={(e) => {
        const selectedStatus = e.target.value;
        if (selectedStatus === "ALL") {
          setBookings(allBookings);
        } else if (selectedStatus === "CONFIRMED") {
          const filteredBookings = allBookings.filter(b => b.status === selectedStatus);
          setBookings(filteredBookings);
        } else if (selectedStatus === "CANCELLED") {
          const filteredBookings = allBookings.filter(b => b.status === selectedStatus);
          setBookings(filteredBookings);
        }
      }}>
        <option value="ALL">All Status</option>
        <option value="CONFIRMED">Confirmed</option>
        <option value="CANCELLED">Cancelled</option>
      </select>
      {bookings.length === 0 ? (
        <p className="text-muted">You haven't booked any tickets yet.</p>
      ) : (
        bookings.map((b) => (
          <Card key={b.pnr} className="mb-3 booking-history-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start flex-wrap">
                <div>
                  <h6 className="mb-1">{b.trainName} ({b.trainNo})</h6>
                  <div className="text-muted small">
                    {b.source} → {b.destination} · {b.date} · {CLASS_LABELS[b.classCode]} / {QUOTA_LABELS[b.quota]}
                  </div>
                  <div className="text-muted small">PNR: <b>{b.pnr}</b></div>
                </div>
                <div className="text-end">
                  <Badge bg={b.status === "CONFIRMED" ? "success" : "danger"} className="mb-2">
                    {b.status}
                  </Badge>
                  <div>{formatCurrency(b.totalFare)}</div>
                </div>
              </div>
              <Table size="sm" bordered className="mt-2 mb-2">
                <thead>
                  <tr><th>Name</th><th>Age</th><th>Gender</th><th>Berth</th></tr>
                </thead>
                <tbody>
                  {(b.passengers || []).map((p) => (
                    <tr key={p.id}>
                      <td>{p.name}</td><td>{p.age}</td><td>{p.gender}</td><td>{p.berthPreference}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              {b.status === "CONFIRMED" && (
                <Button size="sm" variant="outline-danger" onClick={() => handleShow(b.pnr)}>
                  Cancel Booking
                </Button>
              )}
            </Card.Body>
          </Card>
        ))
      )}
      <ConfirmModal show={show} title={"Cancel this booking?"} message={" This action cannot be undone.Your Seat(s) Will be released."} onCancel={onCancel} onConfirm={handleCancelBooking}/>
    </div>
  );
}

export default MyBookings;
