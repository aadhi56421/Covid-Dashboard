import React from "react";
import { Provider } from "react-redux";
import { store } from "./app/store";
import Home from "./components/Home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MapView from "./components/MapView";
import PieChart from "./components/PieChart";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/viewmap" element={<MapView />} />
          <Route path="/piechart" element={<PieChart />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
