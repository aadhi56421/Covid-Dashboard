import React from "react";
import { useLocation } from "react-router-dom";
import Plot from "react-plotly.js";

interface StateData {
  total: number;
  recovered: number;
  deaths: number;
}

interface LocationState {
  selectedState: string;
  stateData: StateData;
}

const PieChart: React.FC = () => {
  const location = useLocation();
  const { selectedState, stateData } = location.state as LocationState;

  if (!stateData) {
    return <p>No data available for {selectedState}</p>;
  }

  const totalCases = stateData.total;
  const recovered = stateData.recovered;
  const deaths = stateData.deaths;

  const remainingActiveCases = totalCases - recovered - deaths + 250000;
  console.log(totalCases, recovered, deaths, remainingActiveCases);

  return (
    <div>
      <div
        style={{ textAlign: "center", marginBottom: "20px", marginTop: "20px" }}
      >
        <h1>COVID-19 Data for {selectedState}</h1>
      </div>

      <Plot
        data={[
          {
            type: "pie",
            values: [recovered, deaths, remainingActiveCases],
            labels: ["Recovered", "Deaths", "Active Cases"],
            textinfo: "label+percent",
            marker: {
              colors: ["#4caf50", "#f44336", "#2196f3"],
            },
          },
        ]}
        layout={{
          width: 800,
          height: 500,
          title: {
            text: "COVID-19 Distribution",
            font: {
              size: 18,
            },
            x: 0.46,
            y: 0.1,
            xanchor: "center",
            yanchor: "top",
          },
        }}
      />
    </div>
  );
};

export default PieChart;
