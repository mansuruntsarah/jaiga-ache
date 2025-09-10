import React, { useState } from 'react';


const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

    // Directly call the backend API for search
    try {
      const response = await fetch('http://localhost:471/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery })
      });
      const result = await response.json();
      setFilteredRoutes(result.routes);
      setMessage(result.message);
    } catch (error) {
      setMessage('An error occurred while searching. Please try again.');
      setFilteredRoutes([]);
    }

  setLoading(false);
    };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Find a Bus Route</h2>
      <form onSubmit={handleSearch} className="flex mb-4">
        <input
          type="text"
          placeholder="Search for a location or landmark..."
          className="flex-grow p-2 border border-gray-300 rounded-md mr-2"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-yellow-400 px-4 py-2 rounded-md font-bold shadow hover:bg-gray-900 transition-colors disabled:opacity-50"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {message && <p className="mb-4 text-gray-700">{message}</p>}
      
      {filteredRoutes.length > 0 ? (
        filteredRoutes.map((route, index) => (
          <div key={index} className="bg-white shadow-lg rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-blue-700 mb-4">{route.routeName}</h3>
            <p className="text-gray-600 mb-2">Departure: {route.startTime} | Arrival: {route.arrivalTime}</p>
            <h4 className="text-lg font-medium text-gray-800 mb-2">Stops:</h4>
            <ul className="list-disc list-inside space-y-1">
              {route.stops.map((stop, stopIndex) => (
                <li key={stopIndex}>{stop.name}</li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        !loading && <p className="text-center text-gray-500">Search for a location to find matching bus routes.</p>
      )}
    </div>
  );
};

export default Search;