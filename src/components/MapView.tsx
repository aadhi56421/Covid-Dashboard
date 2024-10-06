import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCovidData } from "../features/covidSlice";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Box, Typography, CircularProgress } from "@mui/material";
import "./MapView.css";
import { AppDispatch } from "../app/store";

interface StateData {
  state: string;
  total: number;
  recovered: number;
  deaths: number;
  latitude: number;
  longitude: number;
}

interface RootState {
  covid: {
    statewise: StateData[];
    status: "idle" | "loading" | "succeeded" | "failed";
  };
}

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

function SetMapView({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

const MapView: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { statewise, status } = useSelector((state: RootState) => state.covid);

  useEffect(() => {
    dispatch(fetchCovidData());
  }, [dispatch]);

  const indiaCenter: [number, number] = [20.5937, 78.9629]; // Center of India

  return (
    <Box sx={{ height: "100vh", width: "100vw", position: "relative" }}>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{
          position: "absolute",
          top: "10px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
          color: "#fff",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          padding: "8px 16px",
          borderRadius: "4px",
        }}
      >
        COVID-19 Map of India
      </Typography>

      {status === "loading" && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          <CircularProgress />
        </Box>
      )}

      {status === "succeeded" && (
        <MapContainer style={{ height: "100%", width: "100%" }}>
          <SetMapView center={indiaCenter} zoom={5} />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {statewise.map((state, idx) => (
            <Marker key={idx} position={[state.latitude, state.longitude]}>
              <Popup>
                <div>
                  <Typography variant="h6">{state.state}</Typography>
                  <Typography variant="body2">
                    Total Cases: {state.total}
                  </Typography>
                  <Typography variant="body2">
                    Recovered: {state.recovered}
                  </Typography>
                  <Typography variant="body2">
                    Deaths: {state.deaths}
                  </Typography>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}

      {status === "failed" && (
        <Typography variant="h6" align="center" color="error">
          Failed to load map data. Please try again later.
        </Typography>
      )}
    </Box>
  );
};

export default MapView;
