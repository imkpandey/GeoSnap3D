import React, { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import Cuboid3D from "./components/Cuboid3D";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const App = () => {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [location, setLocation] = useState({
    longitude: 77.19,
    latitude: 28.61,
  });
  const [zoom, setZoom] = useState(10);
  const [capturedImage, setCapturedImage] = useState(null);

  useEffect(() => {
    mapboxgl.accessToken = MAPBOX_TOKEN;

    const initializeMap = ({ setMap, mapContainer }) => {
      const mapInstance = new mapboxgl.Map({
        container: mapContainer,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [location.longitude, location.latitude],
        zoom: zoom,
      });

      mapInstance.addControl(
        new MapboxGeocoder({
          accessToken: mapboxgl.accessToken,
          mapboxgl: mapboxgl,
        })
      );

      mapInstance.on("move", () => {
        const { lng, lat } = mapInstance.getCenter();
        setLocation({ longitude: lng, latitude: lat });
        setZoom(mapInstance.getZoom());
      });

      setMap(mapInstance);
    };

    if (!map) {
      initializeMap({ setMap, mapContainer: mapContainerRef.current });
    }
  }, [location, zoom, map]);

  const captureMap = async () => {
    const longitude = location.longitude
    const latitude = location.latitude
    const response = await fetch(
      `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${longitude},${latitude},${zoom}/800x800?access_token=${MAPBOX_TOKEN}`
    );
    setCapturedImage(response.url);
    return response.url;
  };

  return (
    <div className="flex h-screen">
      <div ref={mapContainerRef} className="flex-1 h-screen"></div>
      <div className="w-1/2 flex flex-col items-center justify-center bg-gray-200">
        <div className="p-4 flex gap-2">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            onClick={captureMap}
          >
            Capture Map
          </button>
        </div>
        {capturedImage && (
          <div className="flex p-4 h-full">
            <Cuboid3D capturedImage={capturedImage} />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
