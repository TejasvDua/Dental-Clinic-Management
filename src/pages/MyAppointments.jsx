import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { formatDateTime, isDatePast } from '../utils/dateUtils';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle,
  DollarSign,
  FileText,
  Download,
  AlertCircle
} from 'lucide-react';

const MyAppointments = () => {
  const { currentUser } = useAuth();
  const { patients, getPatientIncidents } = useData();
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'upcoming', 'completed', 'pending'

  // Find the patient record for the current user
  const patientRecord = patients.find(p => p.id === currentUser?.patientId);
  const patientIncidents = patientRecord ? getPatientIncidents(patientRecord.id) : [];

  // Filter appointments based on selected filter
  const filteredAppointments = patientIncidents.filter(appointment => {
    switch (filter) {
      case 'upcoming':
        return !isDatePast(appointment.appointmentDate) && appointment.status === 'pending';
      case 'completed':
        return appointment.status === 'completed';
      case 'pending':
        return appointment.status === 'pending';
      default:
        return true;
    }
  });

  // Sort appointments by date (newest first)
  const sortedAppointments = filteredAppointments.sort((a, b) => 
    new Date(b.appointmentDate) - new Date(a.appointmentDate)
  );

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  const downloadFile = (file) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    link.click();
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      default:
        return <XCircle className="h-5 w-5 text-red-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  if (!patientRecord) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Patient Record Not Found
          </h2>
          <p className="text-gray-600">
            We couldn't find your patient record. Please contact the clinic.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
        <p className="mt-2 text-gray-600">
          View your appointment history and upcoming visits
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: 'all', label: 'All Appointments' },
          { key: 'upcoming', label: 'Upcoming' },
          { key: 'completed', label: 'Completed' },
          { key: 'pending', label: 'Pending' }
        ].map(({ key, label }) => (
          <Button
            key={key}
            variant={filter === key ? 'default' : 'outline'}
            onClick={() => setFilter(key)}
            size="sm"
          >
            {label}
          </Button>
        ))}
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {sortedAppointments.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {filter === 'all' 
                  ? 'No appointments found' 
                  : `No ${filter} appointments found`}
              </p>
            </CardContent>
          </Card>
        ) : (
          sortedAppointments.map(appointment => (
            <Card key={appointment.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(appointment.status)}
                    <div>
                      <CardTitle className="text-lg">{appointment.title}</CardTitle>
                      <p className="text-sm text-gray-600">
                        {formatDateTime(appointment.appointmentDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(appointment)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">
                      {appointment.description}
                    </p>
                    {appointment.comments && (
                      <div className="p-2 bg-gray-50 rounded text-sm">
                        <p className="font-medium text-gray-700">Comments:</p>
                        <p className="text-gray-600">{appointment.comments}</p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    {appointment.status === 'completed' && appointment.cost > 0 && (
                      <div className="flex items-center text-sm text-green-600">
                        <DollarSign className="h-4 w-4 mr-2" />
                        Cost: ${appointment.cost}
                      </div>
                    )}
                    {appointment.nextAppointmentDate && (
                      <div className="flex items-center text-sm text-blue-600">
                        <Clock className="h-4 w-4 mr-2" />
                        Next: {formatDateTime(appointment.nextAppointmentDate)}
                      </div>
                    )}
                    {appointment.files && appointment.files.length > 0 && (
                      <div className="flex items-center text-sm text-gray-600">
                        <FileText className="h-4 w-4 mr-2" />
                        {appointment.files.length} file(s) attached
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Appointment Details Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Appointment Details"
        size="lg"
      >
        {selectedAppointment && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getStatusIcon(selectedAppointment.status)}
                <div>
                  <h3 className="text-xl font-semibold">{selectedAppointment.title}</h3>
                  <p className="text-gray-600">{formatDateTime(selectedAppointment.appointmentDate)}</p>
                </div>
              </div>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedAppointment.status)}`}>
                {selectedAppointment.status}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                <p className="text-gray-600">{selectedAppointment.description}</p>
              </div>

              {selectedAppointment.comments && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Comments</h4>
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-gray-600">{selectedAppointment.comments}</p>
                  </div>
                </div>
              )}

              {selectedAppointment.status === 'completed' && (
                <div className="space-y-4">
                  {selectedAppointment.cost > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Cost</h4>
                      <div className="flex items-center text-green-600">
                        <DollarSign className="h-5 w-5 mr-2" />
                        <span className="text-xl font-semibold">${selectedAppointment.cost}</span>
                      </div>
                    </div>
                  )}

                  {selectedAppointment.treatmentDetails && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Treatment Details</h4>
                      <div className="p-3 bg-green-50 rounded">
                        <p className="text-green-800">{selectedAppointment.treatmentDetails}</p>
                      </div>
                    </div>
                  )}

                  {selectedAppointment.nextAppointmentDate && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Next Appointment</h4>
                      <div className="flex items-center text-blue-600">
                        <Clock className="h-5 w-5 mr-2" />
                        <span>{formatDateTime(selectedAppointment.nextAppointmentDate)}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {selectedAppointment.files && selectedAppointment.files.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Attached Files</h4>
                  <div className="space-y-2">
                    {selectedAppointment.files.map(file => (
                      <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium">{file.name}</p>
                            <p className="text-xs text-gray-500">{file.size} bytes</p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadFile(file)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MyAppointments;