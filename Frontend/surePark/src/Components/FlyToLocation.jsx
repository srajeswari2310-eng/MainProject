// FlyToLocation.js
import { useEffect } from "react";
import { useMap } from "react-leaflet";

export default function FlyToLocation({ coordinates }) {
  const map = useMap();

  useEffect(() => {
    if (coordinates && Array.isArray(coordinates)) {
      map.flyTo(coordinates, 13, {
        animate: true,
        duration: 2, // seconds
      });
    }
  }, [coordinates, map]);

  return null;
}
