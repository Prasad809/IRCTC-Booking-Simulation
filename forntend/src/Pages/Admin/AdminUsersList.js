import { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux"
import "./AdminUsersList.css";
import { actDeActiveUserAction, getAllUsersAction, resetPasswordAction } from "./Store/Action";
import { useEffect } from "react";

function AdminUsersList() {
  const dispatch = useDispatch();
  const user = useSelector(state =>state.authReducer.user)
  const [users,setUsers] = useState([]);
  const [onToggleStatus,setOnToggleStatus] = useState(null);
  const [loading,setLoading] = useState(false);
  const [filter, setFilter] = useState("ALL");
  const [query, setQuery] = useState("");
  const [pendingToggle, setPendingToggle] = useState(null);

  const handleGetAllUsers = () =>{
    const userNameOrEmail = user.userName;
    dispatch(getAllUsersAction({userNameOrEmail})).then(res =>{
      if(res?.payload.data.status){
        setUsers(res?.payload.data?.users || [])
      }
    })
  };
  useEffect(()=>{
    handleGetAllUsers();
  },[]);

  const isActive = (u) => (u.status || "Y") === "Y";

  const visibleUsers = useMemo(() => {
    return users
      .filter((u) => (u.role || "USER") !== "ADMIN") // admins aren't listed/toggle-able here
      .filter((u) => (filter === "ALL" ? true : (u.status || "Y") === filter))
      .filter((u) => {
        if (!query.trim()) return true;
        const q = query.trim().toLowerCase();
        return (
          u.userName?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q) ||
          u.mobile?.includes(q)
        );
      });
  }, [users, filter, query]);

  const activeCount = users.filter((u) => isActive(u) && u.role !== "ADMIN").length;
  const inactiveCount = users.filter((u) => u.status === "N" && u.role !== "ADMIN").length;

  const requestToggle = (user) => setPendingToggle(user);

  const confirmToggle = () => {
    if (!pendingToggle) return;
    const payload = {
      userNameOrEmail : user.userName,
      userId:pendingToggle.userId
    }
    dispatch(actDeActiveUserAction(payload)).then(res =>{
      if(res?.payload?.data?.status){
        handleGetAllUsers();
      }
    });
    setPendingToggle(null);
  };
  const [success,setSuccess] = useState(false);
  const confirmResetPass =(id) =>{
    const payload = {
      userNameOrEmail : user.userName,
      userId:id
    }
    dispatch(resetPasswordAction(payload)).then(res =>{
      if(res?.payload?.data?.status){
        handleGetAllUsers();
        setSuccess(true);
      }
    });
  };

  return (
    <div className="aul-wrapper">
      <div className="aul-header-row">
        <h4 className="aul-title">Users</h4>
        <div className="aul-stats">
          <span className="aul-stat aul-stat-active">{activeCount} Active</span>
          <span className="aul-stat aul-stat-inactive">{inactiveCount} Inactive</span>
        </div>
      </div>

      <div className="aul-toolbar">
        <input
          type="text"
          className="aul-search"
          placeholder="Search by name, email, or mobile"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="aul-filter-tabs">
          {["ALL", "Y", "N"].map((f) => (
            <button
              key={f}
              type="button"
              className={`aul-filter-tab ${filter === f ? "aul-filter-tab-active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f === "ALL" ? "All" : f === "Y" ? "Active" : "Inactive"}
            </button>
          ))}
        </div>
      </div>

      <div className="aul-table-container">
        <table className="aul-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="aul-empty">Loading users...</td>
              </tr>
            )}

            {!loading && visibleUsers.length === 0 && (
              <tr>
                <td colSpan={5} className="aul-empty">No users match this filter.</td>
              </tr>
            )}

            {!loading &&
              visibleUsers.map((u) => {
                const active = isActive(u);
                return (
                  <tr key={u.id}>
                    <td className="aul-cell-user">
                      <div className="aul-user-cell">
                        <span className="aul-avatar">{u.userName?.[0]?.toUpperCase() || "?"}</span>
                        <span>{u.userName}</span>
                      </div>
                    </td>
                    <td data-label="Email">{u.email}</td>
                    <td data-label="Mobile">{u.mobile}</td>
                    <td data-label="Status">
                      <span className={`aul-badge ${active ? "aul-badge-active" : "aul-badge-inactive"}`}>
                        {active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="aul-actions-cell">
                      <button
                        type="button"
                        className={`aul-toggle-btn ${active ? "aul-toggle-deactivate" : "aul-toggle-activate"}`}
                        onClick={() => requestToggle(u)}
                      >
                        {active ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                    <td className="aul-actions-cell">
                      <button
                        type="button"
                        className={`aul-toggle-btn aul-toggle-deactivate`}
                        onClick={()=>confirmResetPass(u.userId)}
                      >
                        {"Reset Password"}
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {pendingToggle && (
        <div className="aul-confirm-overlay" onClick={() => setPendingToggle(null)}>
          <div className="aul-confirm-card" onClick={(e) => e.stopPropagation()}>
            <h5 className="aul-confirm-title">
              {isActive(pendingToggle) ? "Deactivate this user?" : "Activate this user?"}
            </h5>
            <p className="aul-confirm-message">
              {isActive(pendingToggle)
                ? `${pendingToggle.userName} will no longer be able to log in until reactivated.`
                : `${pendingToggle.userName} will be able to log in again.`}
            </p>
            <div className="aul-confirm-actions">
              <button type="button" className="aul-confirm-btn aul-confirm-no" onClick={() => setPendingToggle(null)}>
                No
              </button>
              <button type="button" className="aul-confirm-btn aul-confirm-yes" onClick={confirmToggle}>
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="aul-confirm-overlay" onClick={() => setSuccess(false)}>
          <div className="aul-confirm-card" onClick={(e) => e.stopPropagation()}>
            <h5 className="aul-confirm-title">
              Reset Password
            </h5>
            <p className="aul-confirm-message">password reset successfully will be able to log with new default password</p>
          <div className="aul-confirm-actions">
              <button type="button" className="aul-confirm-btn aul-confirm-yes" onClick={()=>setSuccess(false)}>
                Okay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsersList;
