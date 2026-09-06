import { useNavigate, Link } from "react-router-dom";
import { Card, Table, Badge, Button } from "react-bootstrap";
import { CLASS_LABELS, QUOTA_LABELS } from "../../Common/seedData";
import { formatCurrency } from "../../Common/utils";
import token from "../../Common/token";

function BookingConfirmation() {
  const navigate = useNavigate();
  const booking = token.getBookingDtls();

  if (!booking) {
    return (
      <div className="page-container">
        <p>Booking not found.</p>
        <Button onClick={() => navigate("/searchTrains")}>Search Trains</Button>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Card className="ticket-card">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-0">
              Booking {booking.status === "CONFIRMED" ? "Confirmed" : "Cancelled"}
            </h4>
            <Badge bg={booking.status === "CONFIRMED" ? "success" : "danger"}>
              {booking.status}
            </Badge>
          </div>
          <h2 className="pnr-text">PNR: {booking.pnr}</h2>

          <Table borderless className="mb-3">
            <tbody>
              <tr><td><b>Train</b></td><td>{booking.trainName} ({booking.trainNo})</td></tr>
              <tr><td><b>Route</b></td><td>{booking.source} → {booking.destination}</td></tr>
              <tr><td><b>Date of Journey</b></td><td>{booking.date}</td></tr>
              <tr><td><b>Class / Quota</b></td><td>{CLASS_LABELS[booking.classCode]} / {QUOTA_LABELS[booking.quota]}</td></tr>
              <tr><td><b>Payment Method</b></td><td>{booking.paymentMethodLabel}</td></tr>
              <tr><td><b>Transaction ID</b></td><td>{booking.transactionId}</td></tr>
              <tr><td><b>Total Fare</b></td><td>{formatCurrency(booking.totalFare)}</td></tr>
            </tbody>
          </Table>

          <h6>Passengers</h6>
          <Table bordered size="sm">
            <thead>
              <tr><th>#</th><th>Name</th><th>Age</th><th>Gender</th><th>Berth Preference</th></tr>
            </thead>
            <tbody>
              {(booking.passengers || []).map((p, idx) => (
                <tr key={p.id}>
                  <td>{idx + 1}</td>
                  <td>{p.name}</td>
                  <td>{p.age}</td>
                  <td>{p.gender}</td>
                  <td>{p.berthPreference}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div className="mt-3">
            <Link to="/myBookings"><Button variant="outline-primary" className="me-2">View My Bookings</Button></Link>
            <Link to="/searchTrains"><Button variant="primary">Book Another Ticket</Button></Link>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default BookingConfirmation;
