import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { formatDate } from '../utils/dateUtils';
import { 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  Heart,
  AlertCircle
} from 'lucide-react';

const MyProfile = () => {
  const { currentUser } = useAuth();
  const { patients, getPatientIncidents } = useData();
  
  // Find the patient record for the current user
  const patientRecord = patients.find(p => p.id === currentUser?.patientId);
  const patientIncidents = patientRecord ? getPatientIncidents(patientRecord.id) : [];

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
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="mt-2 text-gray-600">
          View your personal information and health records
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <img
                  src={currentUser?.avatar || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400'}
                  alt={patientRecord.fullName}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {patientRecord.fullName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Patient ID: {patientRecord.id}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-3 text-gray-400" />
                  <span className="font-medium text-gray-700 w-24">Birth Date:</span>
                  <span className="text-gray-600">{formatDate(patientRecord.dateOfBirth)}</span>
                </div>
                
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 mr-3 text-gray-400" />
                  <span className="font-medium text-gray-700 w-24">Phone:</span>
                  <span className="text-gray-600">{patientRecord.contactNumber}</span>
                </div>
                
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 mr-3 text-gray-400" />
                  <span className="font-medium text-gray-700 w-24">Email:</span>
                  <span className="text-gray-600">{patientRecord.email}</span>
                </div>
              </div>

              {patientRecord.emergencyContact && (
                <div className="pt-4 border-t">
                  <h4 className="font-medium text-gray-900 mb-2">Emergency Contact</h4>
                  <p className="text-sm text-gray-600">{patientRecord.emergencyContact}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Health Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="h-5 w-5 mr-2" />
              Health Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            {patientRecord.healthInfo ? (
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-900">
                  {patientRecord.healthInfo}
                </p>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                No health information on file
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Treatment Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Treatment Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-blue-600">
                {patientIncidents.length}
              </p>
              <p className="text-sm text-blue-800">Total Visits</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-green-600">
                {patientIncidents.filter(i => i.status === 'completed').length}
              </p>
              <p className="text-sm text-green-800">Completed Treatments</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {patientIncidents.filter(i => i.status === 'pending').length}
              </p>
              <p className="text-sm text-yellow-800">Pending Appointments</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyProfile;