
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [form, setForm] = useState({
    name: '',
    gsuite: '',
    bracuId: '',
    password: ''
  });


  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const [error, setError] = useState('');


  const isValidBracuId = (id) => {

    return /^[A-Za-z0-9]{11}$/.test(id) && !id.startsWith('0') && !id.includes('-');
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isSignUp) {

      if (!form.name.trim()) {
        setError('Name is required.');
        return;
      }
      if (!form.gsuite.match(/^[\w.-]+@g\.bracu\.ac\.bd$/)) {
        setError('Gsuite email must be a valid @g.bracu.ac.bd address.');
        return;
      }
      if (!isValidBracuId(form.bracuId)) {
        setError('BRACU ID must be 11 alphanumeric characters, no leading zero, no hyphen.');
        return;
      }
      if (!form.password) {
        setError('Password is required.');
        return;
      }

      let isAdmin = false, isClient = false, isStaff = false;
      if (form.bracuId === '11010101010' && form.password === '1234') {
        isAdmin = true;
      } else if (/^[0-9]{11}$/.test(form.bracuId)) {
        isClient = true;
      } else if (/^[A-Za-z0-9]{11}$/.test(form.bracuId)) {
        isStaff = true;
      }

      try {
        const res = await fetch('http://localhost:471/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: form.name,
            email: form.gsuite,
            password: form.password,
            ID: form.bracuId,
            isAdmin,
            isClient,
            isStaff
          })
        });
        let data = {};
        try {
          data = await res.json();
        } catch (jsonErr) {
          setError('Invalid server response');
          return;
        }
        if (!res.ok) {
          setError(data.error ? `Sign up failed: ${data.error}` : `Sign up failed (status ${res.status})`);
          console.error('Sign up error:', data);
          return;
        }
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.user._id);
        localStorage.setItem('userName', data.user.name);

        if (data.user.isAdmin) {
          navigate('/AdminDash');
        } else if (data.user.isStaff) {
          navigate('/StaffDash');
        } else if (data.user.isClient) {
          navigate('/ClientDash');
        } else {
          navigate('/');
        }
      } catch (err) {
        setError('Network error');
        console.error('Network error:', err);
      }
    } else {
      if (!isValidBracuId(form.bracuId)) {
        setError('Invalid ID');
        return;
      }
      if (!form.password) {
        setError('Password is required.');
        return;
      }

      try {
        const res = await fetch('http://localhost:471/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bracuId: form.bracuId, password: form.password })
        });
        let data = {};
        try {
          data = await res.json();
        } catch (jsonErr) {
          setError('Invalid server response');
          return;
        }
        if (!res.ok) {

          setError(data.error ? `Login failed: ${data.error}` : `Login failed (status ${res.status})`);

          console.error('Login error:', data);
          return;
        }
  localStorage.setItem('token', data.token);
  localStorage.setItem('userId', data.user._id);
  localStorage.setItem('userName', data.user.name);

        if (data.user.isAdmin) {
          navigate('/AdminDash');
        } else if (data.user.isStaff) {
          navigate('/StaffDash');
        } else if (data.user.isClient) {
          navigate('/ClientDash');
        } else {
          navigate('/');
        }
      } catch (err) {
        setError('Network error');
        console.error('Network error:', err);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </h2>
        {error && (
          <div className="text-red-500 text-center mb-2 font-semibold">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp ? (
            <>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
              <input
                type="email"
                name="gsuite"
                placeholder="Gsuite Email"
                value={form.gsuite}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
              <input
                type="text"
                name="bracuId"
                placeholder="BRACU ID"
                value={form.bracuId}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
            </>
          ) : (
            <>
              <input
                type="text"
                name="bracuId"
                placeholder="BRACU ID"
                value={form.bracuId}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
            </>
          )}
          <button
            type="submit"
            className="w-full bg-gray-900 text-yellow-400 font-bold py-2 rounded hover:bg-yellow-400 hover:text-gray-900 transition"
          >
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <button
            className="text-gray-900 hover:text-yellow-400"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
