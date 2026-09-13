import { useNavigate } from "react-router-dom";
import "./PageNotFound.css";

/**
 * Full-page "route not found" screen. Wire this in as the catch-all route
 * (path="*") in your router so any unmatched/mistyped URL lands here
 * instead of a blank page or a raw browser error.
 *
 * Also doubles as a soft prompt to re-authenticate: since a stale or
 * unbookmarked deep link is often hit right after a session has ended
 * (e.g. an old tab, an expired link shared before login), the message and
 * button nudge the user to log in again rather than just saying "not found"
 * and leaving them stuck.
 *
 * Props:
 *  message      - optional override of the body text
 *  onLoginClick - optional custom handler; defaults to navigate("/login")
 */
function PageNotFound({ message, onLoginClick }) {
  const navigate = useNavigate();

  const handleLogin = () => {
    if (onLoginClick) return onLoginClick();
    navigate("/login");
  };

  return (
    <div className="pnf-wrapper">
      <div className="pnf-card">
        <svg className="pnf-illustration" viewBox="0 0 160 160" width="140" height="140">
          <circle cx="80" cy="80" r="78" fill="#eaf1ff" />
          <circle cx="72" cy="72" r="34" fill="none" stroke="#0b3d91" strokeWidth="5" />
          <line x1="96" y1="96" x2="118" y2="118" stroke="#0b3d91" strokeWidth="6" strokeLinecap="round" />
          <path d="M60 72h24M72 60v24" stroke="#ff6f3c" strokeWidth="5" strokeLinecap="round" />
        </svg>

        <div className="pnf-code">404</div>
        <h4 className="pnf-title">Page not found</h4>
        <p className="pnf-message">
          {message ||
            "The page you're looking for doesn't exist or the link may be outdated. Please log in again to continue."}
        </p>

        <button type="button" className="pnf-btn" onClick={handleLogin}>
          Please Login
        </button>
      </div>
    </div>
  );
}

export default PageNotFound;
