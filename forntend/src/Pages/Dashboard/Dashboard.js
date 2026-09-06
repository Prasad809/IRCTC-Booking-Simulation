import { Link } from "react-router-dom";
import { Card, Row, Col } from "react-bootstrap";
import { useSelector,useDispatch } from "react-redux";
import { menuAuthsAction } from "../Admin/Store/Action";
import { useState,useEffect } from "react";
import Loader from "../../libs/Loader";

const tiles = [
  { to: "/searchTrains", title: "Search Trains", desc: "Find trains by source, destination and date", icon: "🚆" },
  { to: "/myBookings", title: "My Bookings", desc: "View, download or cancel your tickets", icon: "🎫" },
  { to: "/passengerMaster", title: "Saved Passengers", desc: "Manage your passenger master list", icon: "🧑‍🤝‍🧑" },
  { to: "/paymentMethods", title: "Payment Methods", desc: "Manage saved cards and UPI IDs", icon: "💳" },
  { to: "/userProfile", title: "My Profile", desc: "View and edit your account details", icon: "👤" },
];

const loader = (load) =>{
  return load ? <Loader text={"loading....!"} fullPage={true} size="lg"/> : null;
}

function Dashboard() {
  const user = useSelector((s) => s.authReducer.user);
  const dispatch = useDispatch();
  const [tiles, setTiles] = useState([]);
  const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      setLoading(true);
      dispatch(menuAuthsAction({ userNameOrEmail: user?.userName,role: user?.role })).then(res =>{
        setLoading(false);
        if(res?.payload?.data?.status){
          const response = res?.payload?.data?.paths || [];
          setTiles(response);
        }else{
          setTiles([]);
        }
      })
    },[]);
  return (
    <div className="page-container">
      {loader(loading)}
      <h4 className="page-title">Welcome, {user?.userName} ({user?.role})</h4>
      <p className="text-muted">What would you like to do today?</p>
      <Row>
        {tiles.map((t) => (
          <Col md={4} key={t.id} className="mb-3">
            <Link to={t.path} className="tile-link">
              <Card className="dashboard-tile">
                <Card.Body>
                  <div className="tile-icon">{t.icon}</div>
                  <h6>{t.title}</h6>
                  <p className="text-muted small mb-0">{t.desc}</p>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default Dashboard;
