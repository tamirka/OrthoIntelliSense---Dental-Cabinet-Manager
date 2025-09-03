
export interface Patient {
  id: number;
  name: string;
  avatar: string;
  lastVisit: string;
  nextAppointment: string | null;
  totalSpent: number;
  outstandingBalance: number;
  medicalHistory: string;
  dentalHistory: string;
  notes: string;
  treatmentPlans?: TreatmentPlan[];
}

export interface Appointment {
  id: number;
  patientId: number;
  patientName: string;
  date: string;
  time: string;
  procedure: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
}

export enum View {
  Dashboard = 'Dashboard',
  Patients = 'Patients',
  Appointments = 'Appointments',
  AIAssistant = 'AI Assistant',
}

// New types for Treatment Planning
export enum TreatmentStepStatus {
  Pending = 'Pending',
  InProgress = 'In Progress',
  Completed = 'Completed',
}

export enum TreatmentPlanStatus {
  Proposed = 'Proposed',
  Active = 'Active',
  Completed = 'Completed',
  OnHold = 'On Hold',
}

export interface TreatmentStep {
  id: number;
  description: string;
  status: TreatmentStepStatus;
  cost: number;
}

export interface TreatmentPlan {
  id: number;
  title: string;
  status: TreatmentPlanStatus;
  totalCost: number;
  steps: TreatmentStep[];
}
