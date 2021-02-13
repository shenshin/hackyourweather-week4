import { useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import './App.css';
import CityCard from './components/CityCard';
import SearchForm from './components/SearchForm';
import CityChart from './components/CityChart';

function App() {
  const [cityName, setCityName] = useState('');
  const [searchList, setSearchList] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const searchCity = async () => {
    try {
      setError(null);
      setLoading(true);
      if (cityName.length < 1) throw new Error('City name should be at least 1 character long!');
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${process.env.REACT_APP_OPENWEATHERMAP_API_KEY}&units=metric`);
      if (!response.ok) throw new Error(response.statusText);
      const weatherData = await response.json();
      weatherData.uniqueId = uuid();
      setSearchList((oldValue) => ([weatherData, ...oldValue]));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const removeCard = (uniqueId) => setSearchList(searchList.filter(
    (city) => city.uniqueId !== uniqueId,
  ));

  return (
    <div className="App">
      <h1>Weather</h1>
      {/*
        Divide your page into 2 different routes (/ and /:cityId), using react-router-dom
      */}
      <Router>
        <Switch>
          <Route path="/" exact>
            <SearchForm
              city={cityName}
              setCity={setCityName}
              searchCity={searchCity}
            />
            {error && <p>{error}</p>}
            {loading && !error && (
            <p>
              Loading weather data...
            </p>
            )}
            {searchList.length > 0
              ? searchList.map((cityWeather) => (
                <CityCard
                  key={cityWeather.uniqueId}
                  id={cityWeather.id}
                  cityWeather={cityWeather}
                  removeCard={removeCard}
                />
              ))
              : !loading && <p>Enter city name</p>}
          </Route>
          <Route path="/:cityId">
            <CityChart />
          </Route>
        </Switch>
      </Router>
    </div>

  );
}

export default App;
