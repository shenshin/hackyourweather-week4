import React from 'react';

const SearchForm = ({ city, setCity, searchCity }) => (
  <div className="search-form">
    <input
      type="text"
      value={city}
      onChange={(e) => setCity(e.target.value)}
      onKeyPress={(e) => { if (e.key === 'Enter') searchCity(); }}
      placeholder="city name"
    />
    <button
      type="submit"
      onClick={searchCity}
    >
      Search
    </button>
  </div>
);

export default SearchForm;
