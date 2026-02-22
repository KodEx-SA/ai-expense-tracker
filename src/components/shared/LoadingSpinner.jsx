export default function LoadingSpinner({ size = 20, text = null }) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--text-secondary)" }}>
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ animation: "spin 0.8s linear infinite" }}
        >
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
        {text && <span style={{ fontSize: 14 }}>{text}</span>}
      </div>
    );
  }