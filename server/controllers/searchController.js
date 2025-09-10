const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const Route = require('../models/Route');

const haversineDistance = (coords1, coords2) => {
  const toRad = x => (x * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(coords2[0] - coords1[0]);
  const dLon = toRad(coords2[1] - coords1[1]);
  const lat1 = toRad(coords1[0]);
  const lat2 = toRad(coords2[0]);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const Boundary = {
  minLat: 23.68,
  maxLat: 24.0,
  minLon: 90.3,
  maxLon: 90.58
};

exports.searchRoutes = async (req, res) => {
  const { query } = req.body;
  if (!query || (!isNaN(query) && !isNaN(parseFloat(query)))) {
    return res.json({ message: 'Invalid location. Please search for a place name, not just a number.', routes: [] });
  }
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}, Dhaka, Bangladesh&format=json`);
    const data = await response.json();
    if (data && data.length > 0) {
      const userLocation = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      if (
        userLocation[0] < Boundary.minLat ||
        userLocation[0] > Boundary.maxLat ||
        userLocation[1] < Boundary.minLon ||
        userLocation[1] > Boundary.maxLon
      ) {
        return res.json({ message: 'Location out of bounds.', routes: [] });
      }
      let nearestStop = null;
      let minDistance = Infinity;
      const busRoutes = await Route.find();
      busRoutes.forEach(route => {
        route.stops.forEach(stop => {
          if (stop.coordinates) {
            const distance = haversineDistance(userLocation, stop.coordinates);
            if (distance < minDistance) {
              minDistance = distance;
              nearestStop = stop;
            }
          }
        });
      });
      if (nearestStop) {
        const matchingRoutes = busRoutes.filter(route =>
          route.stops.some(stop => stop.name === nearestStop.name)
        );
        const message = `Found the nearest stop: \"${nearestStop.name}\", which is approximately ${minDistance.toFixed(2)} km away. Showing all routes that go through it:`;
        return res.json({ message, routes: matchingRoutes });
      }
    } else {
      return res.json({ message: `Could not find a location for \"${query}\". Please try a different location.`, routes: [] });
    }
  } catch (error) {
    console.error("SEARCH ERROR:", error);
    if (error.response) {
      error.response.text().then(text => console.error("Response body:", text));
    }
    return res.json({ message: `An error occurred while searching. Details: ${error.message}`, routes: [] });
  }
};
