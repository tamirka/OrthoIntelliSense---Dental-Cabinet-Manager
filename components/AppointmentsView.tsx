
import React, { useState } from 'react';
import type { Appointment } from '../types';
import { generateAppointmentReminder } from '../services/geminiService';

const mockAppointments: Appointment[] = [
  { id: 1, patientId: 1, patientName: 'John Doe', date: '2024-08-01', time: '10:00 AM', procedure: 'Crown Fitting', status: 'Confirmed' },
  { id: 2, patientId: 3, patientName: 'Robert Johnson', date: '2024-07-25', time: '02:00 PM', procedure: 'Denture Adjustment', status: 'Confirmed' },
  { id: 3, patientId: 2, patientName: 'Jane Smith', date: '2024-08-05', time: '11:00 AM', procedure: 'Annual Check-up & Cleaning', status: 'Pending' },
  { id: 4, patientId: 4, patientName: 'Emily Williams', date: '2024-12-10', time: '09:00 AM', procedure: 'Invisalign Check', status: 'Confirmed' },
  { id: 5, patientId: 1, patientName: 'John Doe', date: '2024-07-28', time: '04:00 PM', procedure: 'Emergency Filling', status: 'Cancelled' },
];

const getStatusColor = (status: Appointment['status']) => {
  switch (status) {
    case 'Confirmed': return 'bg-green-100 text-green-800';
    case 'Pending': return 'bg-yellow-100 text-yellow-800';
    case 'Cancelled': return 'bg-red-100 text-red-800';
  }
};

const AppointmentsView: React.FC = () => {
    const [appointments, setAppointments] = useState(mockAppointments);
    const [showReminderModal, setShowReminderModal] = useState(false);
    const [reminderContent, setReminderContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

    const handleGenerateReminder = async (appointment: Appointment) => {
        setSelectedAppointment(appointment);
        setIsLoading(true);
        setShowReminderModal(true);
        setReminderContent('Generating reminder text...');
        const reminder = await generateAppointmentReminder(appointment.patientName, appointment.date, appointment.time);
        setReminderContent(reminder);
        setIsLoading(false);
    }
  
  return (
    <>
      <div className="bg-surface p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Appointments</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-subtle uppercase tracking-wider">Patient</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-subtle uppercase tracking-wider">Date & Time</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-subtle uppercase tracking-wider">Procedure</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-subtle uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-subtle uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appointments.map((appt) => (
                <tr key={appt.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{appt.patientName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-subtle">{appt.date} at {appt.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-subtle">{appt.procedure}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(appt.status)}`}>
                      {appt.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => handleGenerateReminder(appt)}
                        className="text-primary hover:text-primary-800 disabled:text-gray-400"
                        disabled={appt.status === 'Cancelled'}
                      >
                          Send Reminder
                      </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
       {showReminderModal && selectedAppointment && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                    <h3 className="text-lg font-semibold text-gray-800">AI-Generated Reminder for {selectedAppointment.patientName}</h3>
                    <p className="text-sm text-subtle mt-1">Review and send this SMS message.</p>
                    <div className="mt-4 p-4 bg-gray-100 rounded min-h-[100px] text-gray-700 whitespace-pre-wrap">
                        {isLoading ? 'Generating...' : reminderContent}
                    </div>
                    <div className="mt-6 flex justify-end space-x-3">
                        <button onClick={() => setShowReminderModal(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                            Cancel
                        </button>
                        <button onClick={() => setShowReminderModal(false)} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-600">
                            Send SMS
                        </button>
                    </div>
                </div>
            </div>
        )}
    </>
  );
};

export default AppointmentsView;
