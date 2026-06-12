function Modal({ abierto, children }) {
  if (!abierto) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal">{children}</div>
    </div>
  );
}

export default Modal;
