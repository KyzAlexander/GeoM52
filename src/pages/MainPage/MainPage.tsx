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
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(history));
    }
  }, [history, isLoaded]);

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);

    if (stored) {
      try {
        const parsed: RectangleCoords[] = JSON.parse(stored);
        setHistory(parsed);
      } catch {
        console.warn('Ошибка парсинга localStorage');
      }
    }
    setIsLoaded(true)
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

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} coords={coords} />

      {history.length > 0 && (
        <div className="history-section">
          <div className="last-coords">
            <h3>Последние координаты</h3>
            <p>
              <strong>Северо-восток:</strong> {history[0].northEast.join(', ')}<br />
              <strong>Юго-запад:</strong> {history[0].southWest.join(', ')}
            </p>
          </div>

          <div className="history-list">
            <h3>История координат</h3>
            <ol>
              {history.slice(1).map((item, index) => (
                <li key={index}>
                  С-В: {item.northEast.join(', ')} | Ю-З: {item.southWest.join(', ')}
                </li>
              ))}
            </ol>
            <button className="clear-btn" onClick={handleClearHistory}>
              Очистить историю
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default MainPage;