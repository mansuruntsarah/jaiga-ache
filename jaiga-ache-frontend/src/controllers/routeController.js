import { busRoutes } from "../models/routeData";

export const getAllRoutes = () => {
  return busRoutes;
};

export const findRoutesByStop = (stopName) => {
  return busRoutes.filter((route) =>
    // Correct: Access the stop's name property before converting to lowercase.
    route.stops.some((stop) =>
      stop.name.toLowerCase().includes(stopName.toLowerCase())
    )
  );
};