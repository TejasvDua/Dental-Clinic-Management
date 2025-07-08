import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStorageData, setStorageData, STORAGE_KEYS, generateId } from '../utils/storage';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [patients, setPatients] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const storedPatients = getStorageData(STORAGE_KEYS.PATIENTS) || [];
    const storedIncidents = getStorageData(STORAGE_KEYS.INCIDENTS) || [];
    
    setPatients(storedPatients);
    setIncidents(storedIncidents);
    setLoading(false);
  };

  // Patient operations
  const addPatient = (patientData) => {
    const newPatient = {
      ...patientData,
      id: generateId('PAT'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const updatedPatients = [...patients, newPatient];
    setPatients(updatedPatients);
    setStorageData(STORAGE_KEYS.PATIENTS, updatedPatients);
    return newPatient;
  };

  const updatePatient = (patientId, patientData) => {
    const updatedPatients = patients.map(patient =>
      patient.id === patientId
        ? { ...patient, ...patientData, updatedAt: new Date().toISOString() }
        : patient
    );
    
    setPatients(updatedPatients);
    setStorageData(STORAGE_KEYS.PATIENTS, updatedPatients);
    return updatedPatients.find(p => p.id === patientId);
  };

  const deletePatient = (patientId) => {
    const updatedPatients = patients.filter(patient => patient.id !== patientId);
    const updatedIncidents = incidents.filter(incident => incident.patientId !== patientId);
    
    setPatients(updatedPatients);
    setIncidents(updatedIncidents);
    setStorageData(STORAGE_KEYS.PATIENTS, updatedPatients);
    setStorageData(STORAGE_KEYS.INCIDENTS, updatedIncidents);
  };

  const getPatient = (patientId) => {
    return patients.find(patient => patient.id === patientId);
  };

  // Incident operations
  const addIncident = (incidentData) => {
    const newIncident = {
      ...incidentData,
      id: generateId('INC'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const updatedIncidents = [...incidents, newIncident];
    setIncidents(updatedIncidents);
    setStorageData(STORAGE_KEYS.INCIDENTS, updatedIncidents);
    return newIncident;
  };

  const updateIncident = (incidentId, incidentData) => {
    const updatedIncidents = incidents.map(incident =>
      incident.id === incidentId
        ? { ...incident, ...incidentData, updatedAt: new Date().toISOString() }
        : incident
    );
    
    setIncidents(updatedIncidents);
    setStorageData(STORAGE_KEYS.INCIDENTS, updatedIncidents);
    return updatedIncidents.find(i => i.id === incidentId);
  };

  const deleteIncident = (incidentId) => {
    const updatedIncidents = incidents.filter(incident => incident.id !== incidentId);
    setIncidents(updatedIncidents);
    setStorageData(STORAGE_KEYS.INCIDENTS, updatedIncidents);
  };

  const getIncident = (incidentId) => {
    return incidents.find(incident => incident.id === incidentId);
  };

  const getPatientIncidents = (patientId) => {
    return incidents.filter(incident => incident.patientId === patientId);
  };

  const getUpcomingAppointments = (limit = 10) => {
    const now = new Date();
    return incidents
      .filter(incident => new Date(incident.appointmentDate) > now)
      .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))
      .slice(0, limit);
  };

  const getPatientsByIncidentCount = (limit = 5) => {
    const patientIncidentCounts = patients.map(patient => ({
      ...patient,
      incidentCount: incidents.filter(incident => incident.patientId === patient.id).length
    }));
    
    return patientIncidentCounts
      .sort((a, b) => b.incidentCount - a.incidentCount)
      .slice(0, limit);
  };

  const getTotalRevenue = () => {
    return incidents
      .filter(incident => incident.status === 'completed' && incident.cost)
      .reduce((total, incident) => total + incident.cost, 0);
  };

  const getTreatmentStats = () => {
    const pending = incidents.filter(incident => incident.status === 'pending').length;
    const completed = incidents.filter(incident => incident.status === 'completed').length;
    return { pending, completed };
  };

  const value = {
    patients,
    incidents,
    loading,
    addPatient,
    updatePatient,
    deletePatient,
    getPatient,
    addIncident,
    updateIncident,
    deleteIncident,
    getIncident,
    getPatientIncidents,
    getUpcomingAppointments,
    getPatientsByIncidentCount,
    getTotalRevenue,
    getTreatmentStats
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};