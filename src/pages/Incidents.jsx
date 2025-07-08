import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Toast } from '../components/ui/Toast';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { FileUploader } from '../components/ui/FileUploader';
import { validateIncidentForm } from '../utils/validation';
import { formatDateTime, formatInputDateTime } from '../utils/dateUtils';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Clock,
  CheckCircle,
  DollarSign,
  FileText,
  User
} from 'lucide-react';

const Incidents = () => {
  const { 
    incidents, 
    patients, 
    addIncident, 
    updateIncident, 
    deleteIncident,
    getPatient 
  } = useData();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingIncident, setEditingIncident] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
  const [formData, setFormData] = useState({
    patientId: '',
    title: '',
    description: '',
    comments: '',
    appointmentDate: '',
    status: 'pending',
    cost: '',
    treatmentDetails: '',
    nextAppointmentDate: '',
    files: []
  });
  const [formErrors, setFormErrors] = useState({});

  const filteredIncidents = incidents.filter(incident => {
    const patient = getPatient(incident.patientId);
    const matchesSearch = patient?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || incident.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const resetForm = () => {
    setFormData({
      patientId: '',
      title: '',
      description: '',
      comments: '',
      appointmentDate: '',
      status: 'pending',
      cost: '',
      treatmentDetails: '',
      nextAppointmentDate: '',
      files: []
    });
    setFormErrors({});
    setEditingIncident(null);
  };

  const handleOpenModal = (incident = null) => {
    if (incident) {
      setEditingIncident(incident);
      setFormData({
        patientId: incident.patientId || '',
        title: incident.title || '',
        description: incident.description || '',
        comments: incident.comments || '',
        appointmentDate: formatInputDateTime(incident.appointmentDate) || '',
        status: incident.status || 'pending',
        cost: incident.cost || '',
        treatmentDetails: incident.treatmentDetails || '',
        nextAppointmentDate: formatInputDateTime(incident.nextAppointmentDate) || '',
        files: incident.files || []
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFilesChange = (files) => {
    setFormData(prev => ({
      ...prev,
      files
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validation = validateIncidentForm(formData);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    try {
      const incidentData = {
        ...formData,
        cost: formData.cost ? parseFloat(formData.cost) : 0,
        appointmentDate: new Date(formData.appointmentDate).toISOString(),
        nextAppointmentDate: formData.nextAppointmentDate ? new Date(formData.nextAppointmentDate).toISOString() : null
      };

      if (editingIncident) {
        updateIncident(editingIncident.id, incidentData);
        setToast({
          show: true,
          message: 'Incident updated successfully!',
          type: 'success'
        });
      } else {
        addIncident(incidentData);
        setToast({
          show: true,
          message: 'Incident added successfully!',
          type: 'success'
        });
      }
      handleCloseModal();
    } catch (error) {
      setToast({
        show: true,
        message: 'Error saving incident data',
        type: 'error'
      });
    }
  };

  const handleDelete = (incident) => {
    if (window.confirm(`Are you sure you want to delete this incident: "${incident.title}"?`)) {
      try {
        deleteIncident(incident.id);
        setToast({
          show: true,
          message: 'Incident deleted successfully!',
          type: 'success'
        });
      } catch (error) {
        setToast({
          show: true,
          message: 'Error deleting incident',
          type: 'error'
        });
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Incidents & Appointments</h1>
          <p className="mt-2 text-gray-600">
            Manage patient treatments and appointments
          </p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Incident
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search incidents or patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
        <div className="text-sm text-gray-500 self-center">
          {filteredIncidents.length} of {incidents.length} incidents
        </div>
      </div>

      {/* Incidents Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredIncidents.map((incident) => {
          const patient = getPatient(incident.patientId);
          return (
            <Card key={incident.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{incident.title}</CardTitle>
                    <p className="text-sm text-gray-500">
                      {patient?.fullName || 'Unknown Patient'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(incident.status)}`}>
                      {incident.status}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenModal(incident)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(incident)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">{incident.description}</p>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    {formatDateTime(incident.appointmentDate)}
                  </div>
                  
                  {incident.status === 'completed' && incident.cost > 0 && (
                    <div className="flex items-center text-sm text-green-600">
                      <DollarSign className="h-4 w-4 mr-2" />
                      ${incident.cost}
                    </div>
                  )}
                  
                  {incident.nextAppointmentDate && (
                    <div className="flex items-center text-sm text-blue-600">
                      <Clock className="h-4 w-4 mr-2" />
                      Next: {formatDateTime(incident.nextAppointmentDate)}
                    </div>
                  )}
                  
                  {incident.files && incident.files.length > 0 && (
                    <div className="flex items-center text-sm text-gray-600">
                      <FileText className="h-4 w-4 mr-2" />
                      {incident.files.length} file(s) attached
                    </div>
                  )}
                  
                  {incident.comments && (
                    <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
                      <p className="font-medium text-gray-700">Comments:</p>
                      <p className="text-gray-600">{incident.comments}</p>
                    </div>
                  )}
                  
                  {incident.treatmentDetails && (
                    <div className="mt-3 p-2 bg-green-50 rounded text-sm">
                      <p className="font-medium text-green-700">Treatment Details:</p>
                      <p className="text-green-600">{incident.treatmentDetails}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredIncidents.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">
            {searchTerm || statusFilter !== 'all' ? 'No incidents found matching your criteria.' : 'No incidents added yet.'}
          </p>
        </div>
      )}

      {/* Add/Edit Incident Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingIncident ? 'Edit Incident' : 'Add New Incident'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Patient *
              </label>
              <select
                name="patientId"
                value={formData.patientId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select a patient</option>
                {patients.map(patient => (
                  <option key={patient.id} value={patient.id}>
                    {patient.fullName} ({patient.id})
                  </option>
                ))}
              </select>
              {formErrors.patientId && (
                <p className="text-sm text-red-600">{formErrors.patientId}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          
          <Input
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            error={formErrors.title}
            required
          />
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            {formErrors.description && (
              <p className="text-sm text-red-600">{formErrors.description}</p>
            )}
          </div>
          
          <Input
            label="Appointment Date & Time"
            name="appointmentDate"
            type="datetime-local"
            value={formData.appointmentDate}
            onChange={handleInputChange}
            error={formErrors.appointmentDate}
            required
          />
          
          {formData.status === 'completed' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Cost"
                  name="cost"
                  type="number"
                  step="0.01"
                  value={formData.cost}
                  onChange={handleInputChange}
                  error={formErrors.cost}
                  required
                />
                
                <Input
                  label="Next Appointment Date & Time"
                  name="nextAppointmentDate"
                  type="datetime-local"
                  value={formData.nextAppointmentDate}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Treatment Details *
                </label>
                <textarea
                  name="treatmentDetails"
                  value={formData.treatmentDetails}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                {formErrors.treatmentDetails && (
                  <p className="text-sm text-red-600">{formErrors.treatmentDetails}</p>
                )}
              </div>
            </>
          )}
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Comments
            </label>
            <textarea
              name="comments"
              value={formData.comments}
              onChange={handleInputChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Additional notes or comments..."
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Files
            </label>
            <FileUploader
              files={formData.files}
              onFilesChange={handleFilesChange}
              accept="image/*,.pdf,.doc,.docx"
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseModal}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingIncident ? 'Update Incident' : 'Add Incident'}
            </Button>
          </div>
        </form>
      </Modal>

      <Toast
        isVisible={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
};

export default Incidents;