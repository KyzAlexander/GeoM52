import { useEffect, useRef, useState } from "react";
import { RectangleCoords } from "../../types/types";
import { LOCAL_STORAGE_KEY } from "../../constants/variables";
import MapView from "../../components/MapView/MapView";
import Modal from "../../components/Modal/Modal";

const MainPage: React.FC = () => {
  const [coords, setCoords] = useState<RectangleCoords | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const drawnItemsRef = useRef<L.FeatureGroup | null>(null);
  const [history, setHistory] = useState<RectangleCoords[]>([]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    console.log(stored);

    if (stored) {
      try {
        const parsed: RectangleCoords[] = JSON.parse(stored);
        setHistory(parsed);
      } catch {
        console.warn('Ошибка парсинга localStorage');
      }
    }
  }, []);

  const handleSelectRectangle = (newCoords: RectangleCoords) => {
    setCoords(newCoords);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCoords(null);

    if (coords) {
      setHistory((prev) => [coords, ...prev]);
    }

    // Сброс прямоугольника
    if (drawnItemsRef.current) {
      drawnItemsRef.current.clearLayers();
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };
  return (
    <>
      <MapView onSelectRectangle={handleSelectRectangle} onDrawnItemsRefReady={(ref) => (drawnItemsRef.current = ref)} />
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <h2>Координаты выделенной области</h2>
        {coords && (
          <div>
            <p><strong>NorthEast:</strong> {coords.northEast.join(', ')}</p>
            <p><strong>SouthWest:</strong> {coords.southWest.join(', ')}</p>
          </div>
        )}
      </Modal>

      {history.length > 0 && (
        <>
          <div style={{ marginTop: '20px' }}>
            <h3>Последние координаты</h3>
            <p>
              <strong>NorthEast:</strong> {history[0].northEast.join(', ')}<br />
              <strong>SouthWest:</strong> {history[0].southWest.join(', ')}
            </p>
          </div>

          <div style={{ marginTop: '20px' }}>
            <h3>История координат</h3>
            <ol>
              {history.slice(1).map((item, index) => (
                <li key={index}>
                  NE: {item.northEast.join(', ')} | SW: {item.southWest.join(', ')}
                </li>
              ))}
            </ol>
            <button onClick={handleClearHistory} style={{ marginTop: '10px' }}>
              Очистить историю
            </button>
          </div>
        </>
      )}
    </>
  )
}

export default MainPage;