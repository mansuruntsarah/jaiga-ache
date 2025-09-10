
const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-100 via-white to-yellow-300">
      <div className="flex flex-col items-center gap-4 p-8 rounded-xl shadow-lg bg-white/80 max-w-xl w-full">
  <div className="text-6xl mb-2" aria-label="bus logo" role="img">🚍</div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Jaiga Ache</h1>
        <h2 className="text-lg text-yellow-700 font-semibold mb-4">BRACU’s Transport System Manager</h2>
        <p className="text-gray-700 text-base mb-4">
          Jaiga Ache is a comprehensive platform designed to streamline and manage BRAC University’s bus transport system. Whether you’re a student, staff, or admin, you can book seats, view routes, track attendance, manage fuel and maintenance logs, and much more—all in one place.
        </p>
        <ul className="text-left text-gray-600 mb-6 list-disc pl-6">
          <li>Book and manage bus seats easily</li>
          <li>Staff duty, attendance, and reporting panels</li>
          <li>Admin dashboard for cash, staff, fuel, and maintenance logs</li>
          <li>Real-time updates and interactive tables</li>
        </ul>
  <a href="/login" className="bg-black text-yellow-400 font-bold py-2 px-6 rounded shadow hover:bg-gray-900 transition">Get Started</a>
      </div>
      <div className="mt-8 text-gray-500 text-sm">&copy; {new Date().getFullYear()} Jaiga Ache | BRAC University</div>
    </div>
  );
};

export default Home;
