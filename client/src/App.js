import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import BusRoutes from './pages/Routes';
import Search from './pages/Search';
import SignInSignUp from './pages/Login';
import ClientDash from './pages/ClientDash';
import AdminDash from './pages/AdminDash';
import StaffDash from './pages/StaffDash';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-yellow-100 via-white to-yellow-300">

        <nav className="bg-gray-900 text-white p-4">
          <div className="max-w-6xl mx-auto flex justify-between">
            <Link to="/" className="text-xl font-bold hover:text-yellow-400">Jaiga Ache 🚍</Link>
            <div className="space-x-4">
              <Link to="/routes" className="hover:text-yellow-400">Routes</Link>
              <Link to="/search" className="hover:text-yellow-400">Search</Link>
              <Link to="/login" className="hover:text-yellow-400">Login</Link>
            </div>
          </div>
        </nav>
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/routes" element={<BusRoutes />} />
            <Route path="/search" element={<Search />} />
            <Route path="/login" element={<SignInSignUp />} />
            <Route path="/ClientDash" element={<ClientDash />} />
            <Route path="/AdminDash" element={<AdminDash />} />
            <Route path="/StaffDash" element={<StaffDash />} />
          </Routes>
        </div>

        <footer className="bg-gray-900 text-white text-center p-2">
          CSE470 Project by Mansurun
        </footer>
      </div>
    </Router>
  );
}

export default App;