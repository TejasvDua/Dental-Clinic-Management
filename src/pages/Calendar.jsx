import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { formatDate, formatTime, getCalendarDays, isSameDate, isDateToday, isDatePast } from '../utils/dateUtils';
import { format, addMonths, subMonths, startOfMonth, getDay } from 'date-fns';
import { ChevronLeft, ChevronRight, Clock, User } from 'lucide-react';

const Calendar = () => {
  const { incidents, getPatient } = useData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState('month'); // 'month' or 'week'

  const calendarDays = getCalendarDays(currentDate);
  const firstDayOfMonth = startOfMonth(currentDate);
  const startingDayIndex = getDay(firstDayOfMonth);

  // Get appointments for a specific date
  const getAppointmentsForDate = (date) => {
    return incidents.filter(incident => 
      isSameDate(incident.appointmentDate, date)
    );
  };

  // Get appointments for selected date
  const selectedDateAppointments = getAppointmentsForDate(selectedDate);

  const navigateMonth = (direction) => {
    setCurrentDate(prev => 
      direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1)
    );
  };

  const getDayClasses = (date) => {
    const baseClasses = "p-2 h-20 border border-gray-200 cursor-pointer transition-colors";
    const appointments = getAppointmentsForDate(date);
    
    let classes = baseClasses;
    
    if (isDateToday(date)) {
      classes += " bg-blue-50 border-blue-200";
    } else if (isSameDate(date, selectedDate)) {
      classes += " bg-blue-100 border-blue-300";
    } else if (isDatePast(date)) {
      classes += " bg-gray-50 text-gray-400";
    } else {
      classes += " hover:bg-gray-50";
    }
    
    if (appointments.length > 0) {
      classes += " border-l-4 border-l-green-500";
    }
    
    return classes;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
          <p className="mt-2 text-gray-600">
            View and manage appointments
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={view === 'month' ? 'default' : 'outline'}
            onClick={() => setView('month')}
          >
            Month
          </Button>
          <Button
            variant={view === 'week' ? 'default' : 'outline'}
            onClick={() => setView('week')}
          >
            Week
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {format(currentDate, 'MMMM yyyy')}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth('prev')}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentDate(new Date())}
                  >
                    Today
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth('next')}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
                {/* Day headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="bg-gray-50 p-2 text-center text-sm font-medium text-gray-600">
                    {day}
                  </div>
                ))}
                
                {/* Empty cells for days before the first day of the month */}
                {Array.from({ length: startingDayIndex }).map((_, index) => (
                  <div key={`empty-${index}`} className="bg-white h-20 border border-gray-200" />
                ))}
                
                {/* Calendar days */}
                {calendarDays.map(date => {
                  const appointments = getAppointmentsForDate(date);
                  return (
                    <div
                      key={date.toISOString()}
                      className={getDayClasses(date)}
                      onClick={() => setSelectedDate(date)}
                    >
                      <div className="text-sm font-medium text-gray-900 mb-1">
                        {format(date, 'd')}
                      </div>
                      {appointments.length > 0 && (
                        <div className="space-y-1">
                          {appointments.slice(0, 2).map(appointment => (
                            <div
                              key={appointment.id}
                              className="text-xs bg-green-100 text-green-800 p-1 rounded truncate"
                            >
                              {appointment.title}
                            </div>
                          ))}
                          {appointments.length > 2 && (
                            <div className="text-xs text-gray-500">
                              +{appointments.length - 2} more
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Selected Date Appointments */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                {formatDate(selectedDate)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDateAppointments.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No appointments for this date
                </p>
              ) : (
                <div className="space-y-4">
                  {selectedDateAppointments.map(appointment => {
                    const patient = getPatient(appointment.patientId);
                    return (
                      <div
                        key={appointment.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {appointment.title}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {formatTime(appointment.appointmentDate)}
                            </p>
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            appointment.status === 'completed' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {appointment.status}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <User className="h-4 w-4 mr-1" />
                          {patient?.fullName || 'Unknown Patient'}
                        </div>
                        <p className="text-sm text-gray-600">
                          {appointment.description}
                        </p>
                        {appointment.status === 'completed' && appointment.cost > 0 && (
                          <div className="mt-2 text-sm text-green-600 font-medium">
                            Cost: ${appointment.cost}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Calendar;