import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { to: '/app/dashboard',  icon: '📊', label: 'Dashboard'          },
  { to: '/app/estimator',  icon: '📐', label: 'SD Estimator'        },
  { to: '/app/rsmeans',    icon: '📋', label: 'RSMeans Database'    },
  { to: '/app/competitor', icon: '📈', label: 'Competitor Pricing'  },
];

export default function AppShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  const tierBadge = { free:'badge-free', pro:'badge-pro', team:'badge-team', enterprise:'badge-enterprise' };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={`${collapsed ? 'w-16' : 'w-56'} flex flex-col bg-gray-900 text-white transition-all duration-200 shrink-0`}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-800">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0">B</div>
          {!collapsed && <div>
            <p className="font-bold text-sm leading-tight">BCS Estimator</p>
            <p className="text-gray-400 text-xs">San Diego, CA</p>
          </div>}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 space-y-1 px-2">
          {NAV.map(({ to, icon, label }) => (
            <NavLink key={to} to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`
              }>
              <span className="text-lg shrink-0">{icon}</span>
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="border-t border-gray-800 p-3">
          {!collapsed && (
            <div className="mb-2 px-1">
              <p className="text-sm font-medium text-white truncate">{user?.full_name || user?.username}</p>
              <span className={`text-xs ${tierBadge[user?.subscription_tier || 'free'] || 'badge-free'}`}>
                {(user?.subscription_tier || 'free').toUpperCase()}
              </span>
            </div>
          )}
          <div className="flex gap-2">
            <button onClick={() => setCollapsed(!collapsed)}
              className="flex-1 py-1.5 text-gray-400 hover:text-white text-xs rounded hover:bg-gray-800 transition-colors text-center">
              {collapsed ? '→' : '←'}
            </button>
            {!collapsed && (
              <button onClick={handleLogout}
                className="flex-1 py-1.5 text-gray-400 hover:text-red-400 text-xs rounded hover:bg-gray-800 transition-colors">
                Sign out
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}
