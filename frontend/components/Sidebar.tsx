import React from 'react';
import { LayoutDashboard, BookOpen, MessageSquare, User, Trophy, Zap } from 'lucide-react';

// Define what props this component accepts
interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

const Sidebar = ({ activePage, onNavigate }: SidebarProps) => {
  
  // Helper to keep code clean
  const NavItem = ({ page, icon, label }: { page: string, icon: any, label: string }) => {
    const isActive = activePage === page;
    return (
      <div 
        onClick={() => onNavigate(page)}
        className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl cursor-pointer transition-all duration-200 group
          ${isActive 
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
            : 'text-gray-500 hover:bg-gray-50 hover:text-indigo-600'
          }
        `}
      >
        <span className={`${isActive ? '' : 'group-hover:scale-110'} transition-transform`}>
          {icon}
        </span>
        <span className={`font-medium ${isActive ? 'font-semibold' : ''}`}>{label}</span>
      </div>
    );
  };

  return (
    <aside className="w-72 h-screen fixed left-0 top-0 bg-white border-r border-gray-100 flex flex-col p-6 shadow-sm z-50">
      
      {/* 1. Logo */}
      <div className="mb-12 flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
          <Zap size={24} fill="white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">EduMate</h1>
          <p className="text-xs text-gray-500 font-medium">Pro Learning OS</p>
        </div>
      </div>

      {/* 2. Navigation */}
      <nav className="space-y-2 flex-1">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-4">Menu</p>
        
        <NavItem page="dashboard" icon={<LayoutDashboard size={22} />} label="Dashboard" />
        <NavItem page="topics" icon={<BookOpen size={22} />} label="My Topics" />
        <NavItem page="tutor" icon={<MessageSquare size={22} />} label="AI Tutor" />
        <NavItem page="leaderboard" icon={<Trophy size={22} />} label="Leaderboard" />
        
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-8 mb-4 px-4">Account</p>
        <NavItem page="profile" icon={<User size={22} />} label="Profile Settings" />
      </nav>

      {/* 3. User Card */}
      <div className="mt-auto bg-gray-50 p-4 rounded-2xl flex items-center gap-3 border border-gray-100">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white font-bold shadow-md">
          N
        </div>
        <div className="overflow-hidden">
          <p className="font-bold text-sm text-gray-800 truncate">Naga Siddhartha</p>
          <p className="text-xs text-green-600 font-medium flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500"></span> Online
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;