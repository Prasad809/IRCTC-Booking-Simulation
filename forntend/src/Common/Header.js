import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Container } from "react-bootstrap";
import { logoutAction } from "../Pages/Auth/Store/Action";
import "./common.css";
import { menuAuthsAction } from "../Pages/Admin/Store/Action";
function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((s) => s.authReducer.user);
  const [open, setOpen] = useState(false);
  const [menuAuths, setMenuAuths] = useState([]);
  const menuRef = useRef(null);
  const isAdmin = user?.role?.toUpperCase() === "ADMIN";
  
useEffect(() => {
  const onClickOutside = (e) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(e.target)
    ) {
      setOpen(false);
    }
  };

  document.addEventListener("mousedown", onClickOutside);

  return () => {
    document.removeEventListener("mousedown", onClickOutside);
  };
}, []);

  const onLogout = () => {
    dispatch(logoutAction());
    window.location.href="/";
  };

  useEffect(() => {
    dispatch(menuAuthsAction({ userNameOrEmail: user?.userName,role: user?.role })).then(res =>{
      if(res?.payload?.data?.status){
        const response = res?.payload?.data?.paths || [];
        const newPaths = response.filter((item) =>item.id !== 12);
        setMenuAuths(newPaths);
      }else{
        setMenuAuths([]);
      }
    })
  },[]);

  
  return (
    <Navbar expand="lg" className="custom-navbar">
      <Container className="header">
        <div className="nav-left">
          <Link to={isAdmin ? "/adminDashboard" : "/dashboard"} className="brand-title">
            🚆 IRCTC Booking Simulation
          </Link>
        </div>
        <div className="nav-right" ref={menuRef}>
          {menuAuths.map((auth)=>{
            return(
            <div key={auth.id}>
              <Link className="nav-link-item" to={auth.path}>
                {auth.name}
              </Link>
            </div>
            )
          })}
          <span className="user-menu" onClick={() => setOpen(!open)}>
            <span className="avatar-circle">{user?.userName?.[0]?.toUpperCase()}</span>
          </span>
          {open && (
            <div className="user-dropdown-menu">
              {!isAdmin && (
                <div className="menu-item" onClick={() => { navigate("/userProfile"); setOpen(false); }}>
                  👤 My Profile
                </div>
              )}
              <div className="menu-item logout" onClick={onLogout}>🚪 Logout</div>
            </div>
          )}
        </div>
      </Container>
    </Navbar>
  );
}

export default Header;