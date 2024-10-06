import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCovidData } from "../features/covidSlice";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  Box,
} from "@mui/material";
import { RootState, AppDispatch } from "../app/store";
import "./Home.css";

const Home: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { totalCases, recovered, deaths, status, statewise } = useSelector(
    (state: RootState) => state.covid
  );

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedState, setSelectedState] = useState("");

  useEffect(() => {
    dispatch(fetchCovidData());
  }, [dispatch]);

  const toggleDialog = () => {
    setIsDialogOpen(!isDialogOpen);
  };

  const handleSubmit = () => {
    if (selectedState) {
      const stateData = statewise.find(
        (state) => state.state === selectedState
      );
      navigate("/piechart", { state: { selectedState, stateData } });
    }
    toggleDialog();
  };

  const handleViewMap = () => {
    navigate("/viewmap");
  };

  return (
    <div>
      <div>
        <h1>COVID-19 DASHBOARD INDIA</h1>
      </div>
      {status === "loading" && <p>Loading data...</p>}
      {status === "succeeded" && (
        <div className="container">
          <h1>Total Cases:</h1>
          <h2 className="cases">{totalCases}</h2>
          <div className="stats">
            <p>Recovered:</p> <h3 className="recovered">{recovered}</h3>
            <p>Deaths:</p>
            <h3 className="deaths">{deaths}</h3>
          </div>
          <Box
            display="flex"
            gap={2}
            justifyContent="center"
            alignItems="center"
          >
            <Button variant="contained" color="primary" onClick={handleViewMap}>
              VIEW MAP
            </Button>
            <Button variant="contained" color="primary" onClick={toggleDialog}>
              STATE WISE DATA
            </Button>
          </Box>
        </div>
      )}
      {status === "failed" && (
        <p>Failed to load data. Please try again later.</p>
      )}

      <Dialog
        open={isDialogOpen}
        onClose={toggleDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Select a State</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="State"
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            fullWidth
            variant="outlined"
            margin="normal"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {statewise.map((state, idx) => (
              <MenuItem key={idx} value={state.state}>
                {state.state}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleSubmit}
            color="primary"
            disabled={!selectedState}
          >
            Submit
          </Button>
          <Button onClick={toggleDialog} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Home;
