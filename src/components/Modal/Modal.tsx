import { RectangleCoords } from "../../types/types";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  coords?: RectangleCoords | null;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, coords }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-window" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>
        <h2>Координаты выделенной области</h2>
        {coords && (
          <div>
            <p><strong>С-В:</strong> {coords.northEast.join(', ')}</p>
            <p><strong>Ю-З:</strong> {coords.southWest.join(', ')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;