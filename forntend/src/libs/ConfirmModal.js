import "./ConfirmModal.css";


function ConfirmModal({
  show,
  title = "Are you sure?",
  message,
  confirmLabel = "Yes",
  cancelLabel = "No",
  variant = "danger",
  onConfirm,
  onCancel,
}) {
  if (!show) return null;

  return (
    <div className="cm-overlay" onClick={onCancel}>
      <div className="cm-card" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <h5 className="cm-title">{title}</h5>
        {message && <p className="cm-message">{message}</p>}
        <div className="cm-actions">
          <button type="button" className="cm-btn cm-btn-no" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`cm-btn cm-btn-yes ${variant === "danger" ? "cm-btn-danger" : "cm-btn-primary"}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
