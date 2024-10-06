import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface RegionalData {
  loc: string;
  totalConfirmed: number;
  discharged: number;
  deaths: number;
}

interface SummaryData {
  total: number;
  discharged: number;
  deaths: number;
}

interface CovidApiResponse {
  data: {
    summary: SummaryData;
    regional: RegionalData[];
  };
}

interface CovidState {
  totalCases: number;
  recovered: number;
  deaths: number;
  statewise: StatewiseData[];
  status: "idle" | "loading" | "succeeded" | "failed";
}

interface StatewiseData {
  state: string;
  total: number;
  recovered: number;
  deaths: number;
  latitude: number;
  longitude: number;
}

export const fetchCovidData = createAsyncThunk<CovidApiResponse>(
  "covid/fetchData",
  async () => {
    const response = await fetch(
      "https://api.rootnet.in/covid19-in/stats/latest"
    );
    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }
    const data: CovidApiResponse = await response.json();
    return data;
  }
);

function removeSpecialCharacters(str: string): string {
  return str.replace(/[^a-zA-Z0-9]/g, "");
}

const covidSlice = createSlice({
  name: "covid",
  initialState: {
    totalCases: 0,
    recovered: 0,
    deaths: 0,
    statewise: [] as StatewiseData[],
    status: "idle",
  } as CovidState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCovidData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCovidData.fulfilled, (state, action) => {
        const summary = action.payload.data.summary;
        const regional = action.payload.data.regional;

        state.totalCases = summary.total;
        state.recovered = summary.discharged;
        state.deaths = summary.deaths;

        state.statewise = regional.map((region) => ({
          state: region.loc,
          total: region.totalConfirmed,
          recovered: region.discharged,
          deaths: region.deaths,

          latitude: getLatitude(
            removeSpecialCharacters(region.loc.split(" ").join(""))
          ),
          longitude: getLongitude(
            removeSpecialCharacters(region.loc.split(" ").join(""))
          ),
        }));

        state.status = "succeeded";
      })
      .addCase(fetchCovidData.rejected, (state, action) => {
        console.error("Error fetching data:", action.error.message);
        state.status = "failed";
      });
  },
});

const getLatitude = (stateName: string): number => {
  const stateCoordinates: { [key: string]: number } = {
    AndhraPradesh: 15.9129,
    ArunachalPradesh: 28.218,
    Assam: 26.2006,
    Bihar: 25.0961,
    Chhattisgarh: 21.2787,
    Goa: 15.2993,
    Gujarat: 22.2587,
    Haryana: 29.0588,
    HimachalPradesh: 31.1048,
    Jharkhand: 23.6102,
    Karnataka: 15.3173,
    Kerala: 10.8505,
    MadhyaPradesh: 22.9734,
    Maharashtra: 19.3012,
    Manipur: 24.6637,
    Meghalaya: 25.467,
    Mizoram: 23.1645,
    Nagaland: 26.1584,
    Odisha: 20.9517,
    Punjab: 30.9009,
    Rajasthan: 27.0238,
    Sikkim: 27.533,
    TamilNadu: 11.1271,
    Telangana: 17.0738,
    Tripura: 23.94,
    UttarPradesh: 26.8467,
    Uttarakhand: 30.0668,
    WestBengal: 22.9868,
  };
  const latitude = stateCoordinates[stateName];
  return latitude || 0;
};

const getLongitude = (stateName: string): number => {
  const stateCoordinates: { [key: string]: number } = {
    AndhraPradesh: 79.9867,
    ArunachalPradesh: 93.615,
    Assam: 92.9376,
    Bihar: 85.3162,
    Chhattisgarh: 82.402,
    Goa: 74.124,
    Gujarat: 72.5714,
    Haryana: 76.0855,
    HimachalPradesh: 77.1709,
    Jharkhand: 85.579,
    Karnataka: 75.7139,
    Kerala: 76.2711,
    MadhyaPradesh: 78.6569,
    Maharashtra: 75.3433,
    Manipur: 93.9952,
    Meghalaya: 91.5822,
    Mizoram: 92.9376,
    Nagaland: 94.5624,
    Odisha: 85.8314,
    Punjab: 75.8423,
    Rajasthan: 73.8478,
    Sikkim: 88.6158,
    TamilNadu: 78.6569,
    Telangana: 79.0193,
    Tripura: 91.3882,
    UttarPradesh: 80.9462,
    Uttarakhand: 78.6569,
    WestBengal: 88.3639,
  };
  return stateCoordinates[stateName] || 0;
};

export default covidSlice.reducer;
