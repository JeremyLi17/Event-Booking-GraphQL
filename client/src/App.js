import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

import './App.css';
import AuthPage from './pages/Auth';
import EventsPage from './pages/Events';
import BookingsPage from './pages/Bookings';
import MainNavigation from './components/Navigation/MainNavigation';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <MainNavigation />
        <main className="main-content">
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/events" Component={EventsPage} />
            <Route path="/bookings" Component={BookingsPage} />
            <Route path="/" element={<Navigate replace={true} to="/auth" />} />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;
