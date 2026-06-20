import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-routing-machine";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

function Routing({ userLocation, mallLocation }) {
  const map = useMap();

  useEffect(() => {
    if (!userLocation || !mallLocation) return;

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(userLocation[0], userLocation[1]),
        L.latLng(mallLocation[0], mallLocation[1]),
      ],
      routeWhileDragging: true,
      showAlternatives: true,
      lineOptions: { styles: [{ color: "blue", weight: 5 }] },
    }).addTo(map);

    return () => map.removeControl(routingControl);
  }, [map, userLocation, mallLocation]);

  return null;
}

const GetDirection = () => {
  const location = useLocation();
  const { locationId } = location.state || {};
  const [userLocation, setUserLocation] = useState(null);
  const [mallLocation, setMallLocation] = useState(null);
  const { parkings } = useSelector((state) => state.parking);

  useEffect(() => {
    // Get user’s current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation([pos.coords.latitude, pos.coords.longitude]);
        },
        (err) => {
          console.error("Geolocation error:", err);
        }
      );
    }

    // Get mall coordinates from Redux state
    if (locationId) {
      const result = parkings.find((x) => x.locationId === locationId);
      if (result) setMallLocation(result.coordinates);
    }
  }, [locationId, parkings]);

  return (
    <div className=" relative w-full h-screen p-4 bg-orange-100">
      {userLocation && mallLocation ? (
        <>
        <MapContainer
          center={userLocation}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          className="rounded-lg shadow-lg"
        >
         {/* Light/white background tiles */}
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
            />
            <Routing userLocation={userLocation} mallLocation={mallLocation} />
        </MapContainer>

         {/* Floating Info Panel */}
          <div className="z-100 absolute top-4 left-4 bg-white shadow-lg rounded-lg p-4 max-w-xs">
            <h3 className="text-lg font-semibold text-gray-800">Route Info</h3>
            <p className="text-sm text-gray-600 mt-2">
              From: Your current location
            </p>
            <p className="text-sm text-gray-600">
              To: Mall (Location ID {locationId})
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Drag the route to adjust waypoints.
            </p>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500 text-lg">Fetching directions...</p>
        </div>
      )}
    </div>
  );
};
export default GetDirection