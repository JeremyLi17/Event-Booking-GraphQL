import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

import './App.css';
import AuthPage from './pages/Auth';
import EventsPage from './pages/Events';
import BookingsPage from './pages/Bookings';
import MainNavigation from './components/Navigation/MainNavigation';

import AuthContext from './context/auth-context';
import { useState } from 'react';

function App() {
  const [user, setUser] = useState({
    token: null,
    userId: null,
  });

  const login = (token, userId, tokenExpiration) => {
    setUser({
      token: token,
      userId: userId,
    });
  };

  const logout = () => {
    setUser({
      token: null,
      userId: null,
    });
  };

  return (
    <div className="App">
      <BrowserRouter>
        <AuthContext.Provider
          value={{
            token: user.token,
            userId: user.userId,
            login: login,
            logout: logout,
          }}
        >
          <MainNavigation />
          <main className="main-content">
            <Routes>
              {!user.token && <Route path="/auth" element={<AuthPage />} />}
              <Route path="/events" Component={EventsPage} />
              {user.token && (
                <Route path="/bookings" Component={BookingsPage} />
              )}
              {!user.token && (
                <Route
                  path="/"
                  element={<Navigate replace={true} to="/auth" />}
                />
              )}
              {!user.token && (
                <Route
                  path="/bookings"
                  element={<Navigate replace={true} to="/auth" />}
                />
              )}
              {user.token && (
                <Route
                  path="/"
                  element={<Navigate replace={true} to="/events" />}
                />
              )}
              {user.token && (
                <Route
                  path="/auth"
                  element={<Navigate replace={true} to="/events" />}
                />
              )}
            </Routes>
          </main>
        </AuthContext.Provider>
      </BrowserRouter>
    </div>
  );
}

export default App;
