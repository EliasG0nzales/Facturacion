import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* Al hacer npm run dev, siempre nos manda al login */}
          <Route path="/" element={<Navigate to="/login" />} />
          
          {/* Ruta del Login: Sin Navbar, fondo limpio */}
          <Route path="/login" element={<Login />} />

          {/* Ruta del Dashboard: Aquí si cargamos Navbar y Container */}
          <Route 
            path="/dashboard" 
            element={
              <>
                <Navbar />
                <main className="main-content">
                  <div className="container">
                    <Dashboard />
                  </div>
                </main>
              </>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;