import { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
} from 'recharts';

async function retrieveForecast(cityId) {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?id=${cityId}&appid=${process.env.REACT_APP_OPENWEATHERMAP_API_KEY}&units=metric`);
  if (!response.ok) throw new Error(`Error retrieving forecast: ${response.statusText}`);
  return response.json();
}

const CityChart = () => {
  const { cityId } = useParams();
  const history = useHistory();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [cityName, setCityName] = useState('');
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError('');
        const forecastData = await retrieveForecast(cityId);
        setCityName(forecastData.city.name);
        setChartData(forecastData.list.map((weather) => ({
          dateTimeText: weather.dt_txt,
          dateTime: weather.dt,
          temperature: weather.main.temp,
        })));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [cityId]);
  return (
    <div>
      {error && <p>{error}</p>}
      {loading && <p>Loading weather data...</p>}
      {!error && !loading && cityName && (
        <>
          <h2>{`5 day forecast for ${cityName}`}</h2>
          {/*
          On the city page there will be a chart (made with recharts)
          that displays the correct data for 5-day forecast
          */}
          <AreaChart
            className="weather-chart"
            width={800}
            height={400}
            data={chartData}
            margin={{
              top: 5, right: 20, left: 10, bottom: 5,
            }}
          >
            <XAxis dataKey="dateTimeText" />
            <YAxis />
            <Tooltip labelStyle={{ color: 'black' }} />
            <Area type="monotone" dataKey="temperature" />
          </AreaChart>
        </>
      )}
      {/*
        Add a "Back" button to go back to /, on the city page
      */}
      <button
        className="back-button"
        type="button"
        onClick={() => history.goBack()}
      >
        Back
      </button>
    </div>
  );
};

export default CityChart;
