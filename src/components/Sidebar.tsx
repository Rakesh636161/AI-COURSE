import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Compass, LogOut, PlusCircle, X, Sparkles, BookOpen } from 'lucide-react';
import { Logo } from './Logo';
import { Course, User } from '../types';

interface SidebarProps {
  courses: Course[];
  user: User;
  onLogout?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  courses,
  user,
  onLogout,
  isOpen = false,
  onClose,
}) => {
  const navigate = useNavigate();
  const createdCount = courses.length;

  // No upgrade link - unlimited courses for everyone!
  const navItems = [
    { name: 'Home', path: '/dashboard', icon: Home },
    { name: 'Explore Courses', path: '/dashboard/explore', icon: Compass },
  ];

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      navigate('/auth');
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 bg-white border-r border-slate-200 transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand / Logo */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-slate-100">
          <Logo size="md" linkTo="/dashboard" />
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-600 md:hidden"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <div className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/dashboard'}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'text-white shadow-sm font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`
                }
                style={({ isActive }) =>
                  isActive
                    ? { backgroundColor: '#8150E8' }
                    : {}
                }
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}

          <button
            onClick={handleLogout}
            className="flex items-center w-full gap-3.5 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50/60 transition-colors text-left"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>

        {/* Active Courses Option Only */}
        <div className="p-4 m-4 bg-slate-50/80 rounded-2xl border border-slate-200/90">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-700">
              <BookOpen className="w-4 h-4 text-[#8150E8]" />
              <span className="text-xs font-bold">Active Courses</span>
            </div>
            <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-purple-100 text-[#8150E8]">
              {createdCount}
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
