import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { initializeStorage } from './utils/storage';
import mockData from './data/mockData.json';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Incidents from './pages/Incidents';
import Calendar from './pages/Calendar';
import MyProfile from './pages/MyProfile';
import MyAppointments from './pages/MyAppointments';
import Unauthorized from './pages/Unauthorized';

function App() {
  useEffect(() => {
    // Initialize localStorage with mock data if not already present
    initializeStorage(mockData);
  }, []);

  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <div className="App">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                {/* Admin Routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/patients" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Patients />
                  </ProtectedRoute>
                } />
                <Route path="/incidents" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Incidents />
                  </ProtectedRoute>
                } />
                <Route path="/calendar" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Calendar />
                  </ProtectedRoute>
                } />
                
                {/* Patient Routes */}
                <Route path="/my-profile" element={
                  <ProtectedRoute allowedRoles={['patient']}>
                    <MyProfile />
                  </ProtectedRoute>
                } />
                <Route path="/my-appointments" element={
                  <ProtectedRoute allowedRoles={['patient']}>
                    <MyAppointments />
                  </ProtectedRoute>
                } />
                
                {/* Default redirect */}
                <Route index element={<Navigate to="/dashboard" replace />} />
              </Route>
            </Routes>
          </div>
        </DataProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;