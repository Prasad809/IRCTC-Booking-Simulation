import "./Session.css";
import token from "../../Common/token";


function Session({ message }) {

  const handleLogin = () => {
    token.setTokens(null);
    token.setExpryTm(null);
    token.setUserLoginDtls(null);
    window.location.href = "/";
   };
  
  return (
    <div className="se-wrapper">
      <div className="se-card">
        <svg className="se-illustration" viewBox="0 0 160 160" width="140" height="140">
          <circle cx="80" cy="80" r="78" fill="#eaf1ff" />
          <circle cx="80" cy="76" r="40" fill="none" stroke="#0b3d91" strokeWidth="4" />
          <path d="M80 56v22l16 10" fill="none" stroke="#0b3d91" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="58" y="108" width="44" height="30" rx="6" fill="#ff6f3c" />
          <rect x="68" y="98" width="24" height="18" rx="4" fill="none" stroke="#ff6f3c" strokeWidth="5" />
          <circle cx="80" cy="122" r="4" fill="#fff" />
        </svg>

        <h4 className="se-title">Your session has expired</h4>
        <p className="se-message">
          {message || "For your security, we've signed you out. Please log in again to continue."}
        </p>

        <button type="button" className="se-btn" onClick={handleLogin}>
          Please Login
        </button>
      </div>
    </div>
  );
}

export default Session;
