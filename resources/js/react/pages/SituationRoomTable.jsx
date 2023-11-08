import React, { useEffect, useState } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../../../css/MarkerStyles.css";

function SituationRoomTable() {
    const [persons, setPersons] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [mapCenter, setMapCenter] = useState([48.2715, 16.403]);

    useEffect(() => {
        fetch("/api/persons")
            .then((response) => response.json())
            .then((data) => {
                setPersons(data);
                updateMapCenter(data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching persons:", error);
                setIsLoading(false);
            });
    }, []);

    const updateMapCenter = (persons) => {
        if (persons.length === 0) return;
        let personsWithKoordinates = 0;
        let latSum = 0,
            lonSum = 0;
        for (let person of persons) {
            if (person.latitude != null && person.longitude != null) {
                latSum += parseFloat(person.latitude);
                lonSum += parseFloat(person.longitude);
                personsWithKoordinates++;
            }
        }

        setMapCenter([
            latSum / personsWithKoordinates,
            lonSum / personsWithKoordinates,
        ]);
    };
    const getBackgroundColor = (triageColor) => {
        if (triageColor != undefined) {
            switch (triageColor.toLowerCase()) {
                case "gelb":
                    return "yellow";
                case "rot":
                    return "red";
                case "grün":
                    return "green";
                case "blau":
                    return "blue";
                case "schwarz":
                    return "black";
                default:
                    return "white";
            }
        }
    };

    const createMarkerIcon = (color) => {
        return L.divIcon({
            className: "custom-div-icon",
            html: `<div style='background-color:${color};' class='marker-pin'></div>`,
            iconSize: [30, 42],
            iconAnchor: [15, 42],
        });
    };

    const renderMarkers = () => {
        return persons.map((person) => {
            if (person.latitude != null && person.longitude != null) {
                return (
                    <Marker
                        key={person.idpatient}
                        position={[person.latitude, person.longitude]}
                        icon={createMarkerIcon(
                            getBackgroundColor(person.Triagefarbe)
                        )}
                    >
                        <Popup>
                            Nummer: {person.idpatient}
                            <br />
                            Kontaminiert: {person.kontaminiert ? "Ja" : "Nein"}
                            <br />
                        </Popup>
                    </Marker>
                );
            }
            return null; // Rückgabe von null für Personen ohne geografische Position
        });
    };

    if (isLoading) {
        return <p>Lädt...</p>;
    }

    if (persons.length === 0) {
        return <p>Keine Personen gefunden.</p>;
    }

    return (
        <div
            style={{
                position: "absolute",
                top: "13%",
                left: "0",
                width: "100%",
                textAlign: "center",
                justifyContent: "center",
                alignItems: "center",
                padding: "0",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <h2>Alle Personen:</h2>
            <table border="1">
                <thead>
                    <tr>
                        <th>Nummer</th>
                        <th>Atmung</th>
                        <th>Blutung</th>
                        <th>Radialispuls</th>
                        <th>Triagefarbe</th>
                        <th>Transport</th>
                        <th>Dringend</th>
                        <th>Kontaminiert</th>
                        <th>Name</th>
                        <th>Position (Longitude)</th>
                        <th>Position (Latitude)</th>
                        <th>Erfasst</th>
                        <th>Letztes Update</th>
                    </tr>
                </thead>
                <tbody>
                    {persons.map((person) => (
                        <tr key={person.idpatient}>
                            <td>{person.idpatient}</td>
                            <td>{person.atmung ? "Ja" : "Nein"}</td>
                            <td>{person.blutung ? "Ja" : "Nein"}</td>
                            <td>{person.radialispuls}</td>
                            <td>
                                <div
                                    style={{
                                        backgroundColor: getBackgroundColor(
                                            person.triagefarbe
                                        ),
                                    }}
                                >
                                    {person.triagefarbe}
                                </div>
                            </td>
                            <td>{person.transport ? "Ja" : "Nein"}</td>
                            <td>{person.dringend ? "Ja" : "Nein"}</td>
                            <td>{person.kontaminiert ? "Ja" : "Nein"}</td>
                            <td>{person.name || "N/A"}</td>
                            <td>{person.longitude || "N/A"}</td>
                            <td>{person.latitude || "N/A"}</td>
                            <td>{person.created_at}</td>
                            <td>{person.updated_at}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div style={{ height: "400px", width: "100%" }}>
                <h2>Karte:</h2>
                <MapContainer
                    center={mapCenter}
                    zoom={13}
                    style={{ flex: 1, height: "400px", width: "100%" }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {renderMarkers()}
                </MapContainer>
            </div>
        </div>
    );
}

export default SituationRoomTable;
