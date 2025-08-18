import React, { useState } from 'react';
import { getAllRoutes } from '../controllers/routeController';

const BusRoutes = () => {
  const [busRoutes, setBusRoutes] = useState(getAllRoutes());
  const [expandedRoute, setExpandedRoute] = useState(null);

  const toggleRoute = (routeId) => {
    setExpandedRoute(expandedRoute === routeId ? null : routeId);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      
      <div className="space-y-3">
        {busRoutes.map((route) => (
          <div key={route.id} className="border border-gray-300 rounded-lg overflow-hidden">
            <div 
              className="bg-white p-4 cursor-pointer hover:bg-yellow-400 flex justify-between items-left"
              onClick={() => toggleRoute(route.id)}
            >
              <div>
                <h3 className="font-semibold text-gray-800">{route.routeName}</h3>
                <p className="text-sm text-gray-600">
                  Departure: {route.startTime} | Arrival: {route.arrivalTime}
                </p>
              </div>
              <div className="text-gray-400">
                {expandedRoute === route.id ? '▲' : '▼'}
              </div>
            </div>

            {expandedRoute === route.id && (
              <div className="bg-gray-50 border-t border-gray-300">
                <div className="p-4">
                  <h4 className="font-semibold text-gray-700 mb-3">Stops:</h4>
                  <ul className="space-y-2">
                    {route.stops.map((stop, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        {stop.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusRoutes;
