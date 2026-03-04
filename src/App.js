import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/navbar';
import Footer from './components/Footer';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>

          <Route path="/" element={<Navigate to="/login" />} />

          <Route path="/login" element={<Login />} />

          <Route
            path="/dashboard"
            element={
              <>
                <Navbar />
                <div className="main-content">
                  <div className="container">
                    <Dashboard />
                  </div>
                </div>
                <Footer />
              </>
            }
          />

        </Routes>
      </div>
    </Router>
  );
}

export default App;