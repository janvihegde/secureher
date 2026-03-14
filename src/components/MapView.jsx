import { MapContainer, TileLayer, Marker } from "react-leaflet"
import { useEffect, useState } from "react"

function MapView() {
    const [position, setPosition] = useState([13.35, 74.79])

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((pos) => {
            setPosition([pos.coords.latitude, pos.coords.longitude])
        })
    }, [])

    return (
        <div className="bg-white/50 backdrop-blur-md p-4 rounded-3xl border border-white/40 shadow-xl">
            <h2 className="text-lg font-bold mb-3 text-gray-700 flex items-center gap-2">
                📍 Live Location
            </h2>

            {/* Adjusted height and width for a smaller rectangle look */}
            <div className="rounded-xl overflow-hidden border border-gray-200 shadow-inner">
                <MapContainer
                    center={position}
                    zoom={15}
                    style={{ height: "200px", width: "100%" }}
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={position} />
                </MapContainer>
            </div>
        </div>
    )
}

export default MapView