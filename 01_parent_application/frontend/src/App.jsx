import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage';
import AdminDashboardPage from './components/AdminDashboardPage';

function App() {
  const [session, setSession] = useState(null);

  const handleLoginSuccess = (data) => {
    setSession(data);
  };

  const handleLogout = () => {
    setSession(null);
  };

  return (
    <div className="App">
      {!session ? (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      ) : session.role === 'ADMIN' ? (
        <AdminDashboardPage adminData={session} onLogout={handleLogout} />
      ) : (
        <DashboardPage parentData={session} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
