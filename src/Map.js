import React from 'react';
import { TileLayer, MapContainer as LeafletMap, useMap } from "react-leaflet";
import './Map.css';
import { showDataOnMap } from './util';


function ChangeMap({ center, zoom }) {
    const map = useMap();
    map.setView(center, zoom);
    return null;
}

function Map({ countries, caseType, center, zoom }) {
    return (
        <div className="map">
            <LeafletMap>
                <ChangeMap center={center} zoom={zoom} />
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                ></TileLayer>
                {showDataOnMap(countries, caseType)}
            </LeafletMap>
        </div>
    );
}

// eslint-disable-next-line no-lone-blocks
{/*function Map({ countries, caseType, center, zoom }) {
    return (
        <div className='map'>
            <LeafletMap center={center} zoom={zoom}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                {showDataOnMap(countries, caseType)}
            </LeafletMap>
        </div>
    );
}*/}

export default Map;
