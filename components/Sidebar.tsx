
import React from 'react';
import { View } from '../types';

interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

const ToothIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary-300" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16.5,7c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S17.6,7,16.5,7z M12,2C8.1,2,5,5.1,5,9c0,2.4,1.2,4.5,3,5.7V17 c0,1.1,0.9,2,2,2h4c1.1,0,2-0.9,2-2v-2.3c1.8-1.2,3-3.4,3-5.7C19,5.1,15.9,2,12,2z M12,14c-2.8,0-5-2.2-5-5s2.2-5,5-5s5,2.2,5,5 S14.8,14,12,14z M12,20c-1.7,0-3,1.3-3,3h6C15,21.3,13.7,20,12,20z"/>
    </svg>
);

const NavItem: React.FC<{
  view: View;
  label: string;
  icon: JSX.Element;
  activeView: View;
  onClick: (view: View) => void;
}> = ({ view, label, icon, activeView, onClick }) => (
  <li
    onClick={() => onClick(view)}
    className={`flex items-center p-3 my-1 rounded-lg cursor-pointer transition-all duration-200 ${
      activeView === view
        ? 'bg-primary-700 text-white shadow-md'
        : 'text-gray-300 hover:bg-primary-600 hover:text-white'
    }`}
  >
    {icon}
    <span className="ml-4 font-medium">{label}</span>
  </li>
);


const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const navItems = [
    { view: View.Dashboard, label: 'Dashboard', icon: <DashboardIcon /> },
    { view: View.Patients, label: 'Patients', icon: <PatientsIcon /> },
    { view: View.Appointments, label: 'Appointments', icon: <AppointmentsIcon /> },
    { view: View.AIAssistant, label: 'AI Assistant', icon: <AIAssistantIcon /> },
  ];

  return (
    <div className="w-64 bg-primary-800 text-white flex flex-col shadow-lg">
      <div className="flex items-center justify-center p-6 border-b border-primary-700">
        <ToothIcon />
        <h1 className="text-xl font-bold ml-2">OrthoIntelliSense</h1>
      </div>
      <nav className="flex-1 p-4">
        <ul>
          {navItems.map(item => (
            <NavItem
              key={item.view}
              view={item.view}
              label={item.label}
              icon={item.icon}
              activeView={activeView}
              onClick={setActiveView}
            />
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-primary-700">
        <p className="text-xs text-gray-400">&copy; 2024 OrthoIntelliSense. <br/> Helping dentists thrive.</p>
      </div>
    </div>
  );
};

// SVG Icons
const DashboardIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
);
const PatientsIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
);
const AppointmentsIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
);
const AIAssistantIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
);

export default Sidebar;
