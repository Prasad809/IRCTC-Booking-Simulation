import "./InfoModal.css";

function InfoModal({ show, title = "Success", message, buttonLabel = "OK", icon = "success", onAction }) {
  if (!show) return null;

  return (
    <div className="im-overlay">
      <div className="im-card" role="dialog" aria-modal="true">
        <div className={`im-icon im-icon-${icon}`}>
          {icon === "success" ? (
            <svg viewBox="0 0 52 52" width="30" height="30">
              <circle cx="26" cy="26" r="25" fill="none" stroke="currentColor" strokeWidth="3" />
              <path fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" d="M14 27l7 7 17-17" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor">
              <circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <rect x="11" y="10" width="2" height="7" rx="1" />
              <rect x="11" y="6.5" width="2" height="2" rx="1" />
            </svg>
          )}
        </div>
        <h5 className="im-title">{title}</h5>
        {message && <p className="im-message">{message}</p>}
        <button type="button" className="im-btn" onClick={onAction}>
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}

export default InfoModal;
