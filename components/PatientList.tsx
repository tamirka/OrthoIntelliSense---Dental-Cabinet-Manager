
import React, { useState } from 'react';
import type { Patient } from '../types';

interface PatientListProps {
  patients: Patient[];
  selectedPatient: Patient | null;
  onSelectPatient: (patient: Patient) => void;
}

const PatientList: React.FC<PatientListProps> = ({ patients, selectedPatient, onSelectPatient }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-surface rounded-lg shadow-md flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Patient Records</h3>
        <input
          type="text"
          placeholder="Search patients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <ul className="flex-1 overflow-y-auto">
        {filteredPatients.map(patient => (
          <li
            key={patient.id}
            onClick={() => onSelectPatient(patient)}
            className={`flex items-center p-4 cursor-pointer border-l-4 ${
              selectedPatient?.id === patient.id
                ? 'bg-primary-50 border-primary'
                : 'border-transparent hover:bg-gray-50'
            }`}
          >
            <img src={patient.avatar} alt={patient.name} className="w-12 h-12 rounded-full object-cover mr-4" />
            <div>
              <p className="font-semibold text-gray-800">{patient.name}</p>
              <p className="text-sm text-subtle">Last Visit: {patient.lastVisit}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PatientList;
