import { useState, useEffect } from 'react';
import PollutionMap from './components/Map/PollutionMap';
import FloatingSearch from './components/Layout/FloatingSearch';
import FloatingDetails from './components/Dashboard/FloatingDetails';
import { getPollutionData, getCityName } from './services/api';
import type { PollutionData } from './types';

function App() {
  const [pollutionData, setPollutionData] = useState<PollutionData | null>(null);
  const [currentLocation, setCurrentLocation] = useState({ lat: 51.5074, lon: -0.1278 }); // Default London
  const [locationName, setLocationName] = useState("London");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [data, name] = await Promise.all([
          getPollutionData(currentLocation.lat, currentLocation.lon),
          getCityName(currentLocation.lat, currentLocation.lon)
        ]);
        setPollutionData(data);
        setLocationName(name);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentLocation]);

  const handleLocationSelect = (lat: number, lon: number) => {
    setCurrentLocation({ lat, lon });
  };

  return (
    <div className="flex h-screen w-screen bg-background text-foreground overflow-hidden relative">
      <FloatingSearch onLocationSelect={handleLocationSelect} />

      <div className="flex-1 relative h-full w-full">
        <PollutionMap
          data={pollutionData}
          lat={currentLocation.lat}
          lon={currentLocation.lon}
          onLocationSelect={handleLocationSelect}
        />
      </div>

      <FloatingDetails data={pollutionData} loading={loading} locationName={locationName} />
    </div>
  );
}

export default App;
