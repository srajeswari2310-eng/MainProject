import React from 'react'
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import FlyToLocation from './FlyToLOcation';
import 'leaflet/dist/leaflet.css';
import { Popup } from 'leaflet';
import '../style.css'

const MapComponent = ({coordinates}) => {
  return (

    //  <div className="hidden sm:block md:w-1/2 w-full p-4 bg-gray-100 h-full">
    //   {coordinates}
    //       </div>
   
    <MapContainer
      center={coordinates}
      zoom={13}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={coordinates}/>       
      
      
       <FlyToLocation coordinates={coordinates} />
     
    </MapContainer>
  );
}

export default MapComponent