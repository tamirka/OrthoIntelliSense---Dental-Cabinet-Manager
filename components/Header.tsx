
import React from 'react';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="bg-surface shadow-sm p-4 border-b border-gray-200 flex justify-between items-center">
      <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      <div className="flex items-center space-x-4">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
        </span>
        <div className="text-right">
            <p className="text-sm font-semibold text-gray-700">Dr. Amelia Thorne</p>
            <p className="text-xs text-subtle">General Dentist</p>
        </div>
        <img
          className="h-10 w-10 rounded-full object-cover"
          src="https://picsum.photos/id/1027/200/200"
          alt="User Avatar"
        />
      </div>
    </header>
  );
};

export default Header;
