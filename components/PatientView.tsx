
import React, { useState } from 'react';
import { Patient, TreatmentPlanStatus, TreatmentStepStatus } from '../types';
import PatientList from './PatientList';
import PatientDetail from './PatientDetail';

const mockPatients: Patient[] = [
  { 
    id: 1, 
    name: 'John Doe', 
    avatar: 'https://picsum.photos/id/1005/200/200', 
    lastVisit: '2024-05-15', 
    nextAppointment: '2024-08-01', 
    totalSpent: 2500, 
    outstandingBalance: 150, 
    medicalHistory: 'Hypertension, controlled with medication.', 
    dentalHistory: 'History of periodontitis, multiple fillings.', 
    notes: 'Patient reports sensitivity in upper right quadrant. Possible need for crown on #3.',
    treatmentPlans: [
      {
        id: 1,
        title: 'Crown for Tooth #3',
        status: TreatmentPlanStatus.Active,
        totalCost: 1800,
        steps: [
          { id: 1, description: 'Initial consultation and X-ray', status: TreatmentStepStatus.Completed, cost: 150 },
          { id: 2, description: 'Tooth preparation and temporary crown', status: TreatmentStepStatus.Completed, cost: 550 },
          { id: 3, description: 'Permanent crown fitting and placement', status: TreatmentStepStatus.Pending, cost: 1100 },
        ],
      },
      {
        id: 2,
        title: 'Periodontal Maintenance',
        status: TreatmentPlanStatus.Proposed,
        totalCost: 450,
        steps: [
          { id: 1, description: 'Deep cleaning - Quadrant 1', status: TreatmentStepStatus.Pending, cost: 225 },
          { id: 2, description: 'Deep cleaning - Quadrant 2', status: TreatmentStepStatus.Pending, cost: 225 },
        ],
      },
    ]
  },
  { id: 2, name: 'Jane Smith', avatar: 'https://picsum.photos/id/1011/200/200', lastVisit: '2024-06-01', nextAppointment: null, totalSpent: 1200, outstandingBalance: 0, medicalHistory: 'No known allergies.', dentalHistory: 'Regular cleanings, one root canal in 2020.', notes: 'Completed whitening treatment. Advised on maintenance.' },
  { id: 3, name: 'Robert Johnson', avatar: 'https://picsum.photos/id/1025/200/200', lastVisit: '2024-04-20', nextAppointment: '2024-07-25', totalSpent: 850, outstandingBalance: 50, medicalHistory: 'Type 2 Diabetes, well-managed.', dentalHistory: 'Partial dentures, prone to plaque buildup.', notes: 'Needs adjustment on lower partial. Scheduled for follow-up.' },
  { id: 4, name: 'Emily Williams', avatar: 'https://picsum.photos/id/1028/200/200', lastVisit: '2024-06-10', nextAppointment: '2024-12-10', totalSpent: 5200, outstandingBalance: 1200, medicalHistory: 'Penicillin allergy.', dentalHistory: 'Invisalign treatment in progress.', notes: 'Check progress on aligners. Patient compliant and tracking well.' },
];

const PatientView: React.FC = () => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(mockPatients[0]);

  return (
    <div className="flex h-full gap-6">
      <div className="w-1/3 h-full">
        <PatientList 
          patients={mockPatients} 
          selectedPatient={selectedPatient}
          onSelectPatient={setSelectedPatient} 
        />
      </div>
      <div className="w-2/3 h-full">
        {selectedPatient ? (
          <PatientDetail patient={selectedPatient} />
        ) : (
          <div className="flex items-center justify-center h-full bg-surface rounded-lg shadow-md">
            <p className="text-subtle">Select a patient to view details</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientView;
