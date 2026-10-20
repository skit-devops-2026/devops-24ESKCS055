const StanceModal = ({ isOpen, stance, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  const stanceLabel =
    stance === "for" ? "For" : stance === "against" ? "Against" : "Neutral";

  const stanceColor =
    stance === "for"
      ? "var(--color-for)"
      : stance === "against"
      ? "var(--color-against)"
      : "var(--color-primary)";

  return (
    <div className="modal-backdrop" onClick={onCancel} role="dialog" aria-modal="true">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">Confirm Your Stance</h3>
        <p className="modal-msg">
          You're choosing{" "}
          <strong style={{ color: stanceColor, textTransform: "capitalize" }}>
            {stanceLabel}
          </strong>
          . This can't be changed for this debate.
        </p>

        <div className="modal-actions">
          <button type="button" className="modal-btn modal-btn--cancel" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="modal-btn modal-btn--confirm" onClick={onConfirm}>
            Confirm Stance
          </button>
        </div>
      </div>

      <style>{`
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }
        .modal-card {
          background: var(--color-surface, #FFFFFF);
          border: 1.5px solid var(--color-border, #E2DDD3);
          border-radius: 14px;
          padding: 24px;
          max-width: 440px;
          width: 100%;
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
          animation: modalPop 0.2s ease-out;
        }
        @keyframes modalPop {
          from { opacity: 0; transform: scale(0.96); }
          to   { opacity: 1; transform: scale(1); }
        }
        .modal-title {
          font-family: 'Fraunces', serif;
          font-size: 20px;
          font-weight: 700;
          color: var(--color-primary-dark, #0F2C59);
          margin-bottom: 10px;
        }
        .modal-msg {
          font-size: 14px;
          line-height: 1.55;
          color: var(--color-text, #1A1D20);
          margin-bottom: 22px;
        }
        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }
        .modal-btn {
          padding: 8px 18px;
          border-radius: 8px;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.15s ease;
        }
        .modal-btn--cancel {
          background: transparent;
          border: 1.5px solid var(--color-border, #E2DDD3);
          color: var(--color-muted, #5A606A);
        }
        .modal-btn--cancel:hover {
          background: rgba(0, 0, 0, 0.04);
          color: var(--color-text, #1A1D20);
        }
        .modal-btn--confirm {
          background: var(--color-primary, #0F2C59);
          color: #fff;
          border: 1.5px solid var(--color-primary, #0F2C59);
        }
        .modal-btn--confirm:hover {
          opacity: 0.92;
        }
      `}</style>
    </div>
  );
};

export default StanceModal;
