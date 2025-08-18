import { busRoutes } from './routeData';

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

export const handleSearchLogic = async (searchQuery) => {
  if (!isNaN(searchQuery) && !isNaN(parseFloat(searchQuery))) {
      return { message: 'Invalid location. Please search for a place name, not just a number.', routes: [] };
  }

  try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${searchQuery}, Dhaka, Bangladesh&format=json`);
      const data = await response.json();

      if (data && data.length > 0) {
          const userLocation = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
          
          if (
              userLocation[0] < Boundary.minLat ||
              userLocation[0] > Boundary.maxLat ||
              userLocation[1] < Boundary.minLon ||
              userLocation[1] > Boundary.maxLon
          ) {
              return { message: 'Location out of bounds.', routes: [] };
          }

          let nearestStop = null;
          let minDistance = Infinity;

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
              const message = `Found the nearest stop: "${nearestStop.name}", which is approximately ${minDistance.toFixed(2)} km away. Showing all routes that go through it:`;
              return { message, routes: matchingRoutes };
          }
      } else {
          return { message: `Could not find a location for "${searchQuery}". Please try a different location.`, routes: [] };
      }
  } catch (error) {
      console.error("Error fetching location data:", error);
      return { message: "An error occurred while searching. Please try again.", routes: [] };
  }
};