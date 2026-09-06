import "./Loader.css";

/**
 * Reusable loading indicator. Two modes:
 *  - inline (default): a small spinner meant to sit inside a button or
 *    next to text, e.g. a "Processing..." payment button.
 *  - fullPage: a fixed, full-screen dimmed overlay with a centered spinner
 *    and optional message - for page transitions or data fetches.
 *
 * Props:
 *  fullPage - boolean, default false. Renders as a full-screen overlay.
 *  size     - "sm" | "md" | "lg", default "md". Spinner diameter.
 *  text     - optional string shown below (fullPage) or beside (inline) the spinner.
 *  show     - boolean, default true. Lets the caller conditionally render
 *             without an extra `{loading && <Loader/>}` wrapper if preferred.
 */
function Loader({ fullPage = false, size = "md", text, show = true }) {
  if (!show) return null;

  const spinner = <span className={`ldr-spinner ldr-${size}`} aria-label="Loading" role="status" />;

  if (fullPage) {
    return (
      <div className="ldr-overlay">
        <div className="ldr-fullpage-box">
          {spinner}
          {text && <p className="ldr-text-fullpage">{text}</p>}
        </div>
      </div>
    );
  }

  return (
    <span className="ldr-inline">
      {spinner}
      {text && <span className="ldr-text-inline">{text}</span>}
    </span>
  );
}

export default Loader;
