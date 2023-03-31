import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

import AuthPage from './pages/Auth';
import EventsPage from './pages/Events';
import BookingsPage from './pages/Bookings';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/events" Component={EventsPage} />
          <Route path="/bookings" Component={BookingsPage} />
          <Route path="/" element={<Navigate replace={true} to="/auth" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
