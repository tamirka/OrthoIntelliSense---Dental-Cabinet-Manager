
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import PatientView from './components/PatientView';
import AppointmentsView from './components/AppointmentsView';
import AIAssistant from './components/AIAssistant';
import Header from './components/Header';
import { View } from './types';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>(View.Dashboard);

  const renderView = () => {
    switch (activeView) {
      case View.Dashboard:
        return <Dashboard />;
      case View.Patients:
        return <PatientView />;
      case View.Appointments:
        return <AppointmentsView />;
      case View.AIAssistant:
        return <AIAssistant />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-background font-sans text-text">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={activeView} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-6 md:p-8">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;
