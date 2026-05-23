import React, { useState, useEffect } from 'react';
import { AppProvider } from './contexts/AppContext';
import { getTheme } from './theme';
import './dark-mode.css';
import LoginView from './views/LoginView';
import ImprovedDashboardView from './views/ImprovedDashboardView';
import ModernDashboardView from './views/ModernDashboardView';
import CalendarView from './views/CalendarView';
import ClientsView from './views/ClientsView';
import WorkOrdersView from './views/WorkOrdersView';
import InvoicesView from './views/InvoicesView';
import EstimatesView from './views/EstimatesView';
import EnhancedEstimatesView from './views/EnhancedEstimatesView';
import EmployeesView from './views/EmployeesView';
import EquipmentView from './views/EquipmentView';
import MaterialsView from './views/MaterialsView';
import MoistureLogsView from './views/MoistureLogsView';
import VendorsView from './views/VendorsView';
import PriceListView from './views/PriceListView';
import ChangeOrdersView from './views/ChangeOrdersView';
import EnhancedQuoteGeneratorView from './views/EnhancedQuoteGeneratorView';
import CompanySettingsView from './views/CompanySettingsView';
import ServicesView from './views/ServicesView';
import PricingView from './views/PricingView';
import ResourcesView from './views/ResourcesView';
import LineItemsView from './views/LineItemsView';
import XactimateView from './views/XactimateView';
import RemediationDryoutView from './views/RemediationDryoutView';
import RemediationReconstructionView from './views/RemediationReconstructionView';
import JobTrackingView from './views/JobTrackingView';
import ReportsView from './views/ReportsView';
import MessagingView from './views/MessagingView';
import QuickSMSView from './views/QuickSMSView';
import PaymentsView from './views/PaymentsView';
import SanDiegoEstimatorView from './views/SanDiegoEstimatorView';
import CompetitorPricingView from './views/CompetitorPricingView';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [viewHistory, setViewHistory] = useState(['dashboard']);
  const [selectedClient, setSelectedClient] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const [isResizing, setIsResizing] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('default');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [globalSearchResults, setGlobalSearchResults] = useState([]);
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);
  const [helpTooltip, setHelpTooltip] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [aiStatus, setAiStatus] = useState('');
  const mediaRecorderRef = React.useRef(null);
  const audioChunksRef = React.useRef([]);

  // Local Whisper-powered Voice Recognition
  const startListening = async () => {
    if (isListening) {
      stopListening();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        setAiStatus('Transcribing (Whisper)...');
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const arrayBuffer = await audioBlob.arrayBuffer();
        
        // Save and transcribe via Electron
        const tempPath = await window.electronAPI.saveAudio(arrayBuffer);
        const result = await window.electronAPI.transcribeAudio(tempPath);
        
        if (result.text) {
          setAiStatus(`Processing: "${result.text}"`);
          const aiResult = await window.electronAPI.runCommand(result.text);
          setAiStatus(aiResult.message);
          setTimeout(() => setAiStatus(''), 5000);
        } else {
          setAiStatus(result.error || 'Failed to transcribe');
        }
      };

      mediaRecorder.start();
      setIsListening(true);
      setAiStatus('Listening (Whisper)...');
    } catch (err) {
      console.error('Recording error:', err);
      setAiStatus('Mic error: ' + err.message);
    }
  };

  const stopListening = () => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop();
      setIsListening(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  // Keyboard shortcut: Ctrl+Space
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && e.ctrlKey) {
        startListening();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      setIsAuthenticated(true);
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  const theme = getTheme(currentTheme, isDarkMode);

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', help: 'Overview of your business metrics, recent activity, invoices, and quick access to all features. Start here to see the big picture.' },
    { id: 'calendar', label: 'Calendar', icon: '📅', help: 'Schedule and view appointments, job deadlines, and team availability. Drag and drop to reschedule events.' },
    { id: 'moisturelogs', label: 'Moisture Logs', icon: '💧', help: 'Record and track moisture readings for dry-out jobs. Monitor progress with daily logs and generate reports for insurance.' },
    { id: 'clients', label: 'Clients', icon: '👥', help: 'Manage customer information, contact details, and job history. Add new clients and view their complete service record.' },
    { id: 'workorders', label: 'Work Orders', icon: '📋', help: 'Create and manage job assignments. Track status, assign employees, and link to estimates and invoices.' },
    { id: 'estimates', label: 'Estimates', icon: '📄', help: 'Create detailed cost estimates for jobs. Include labor, materials, and equipment. Convert approved estimates to work orders.' },
    { id: 'sdestimator', label: 'SD Xactimate Estimator', icon: '📐', help: 'Full Xactimate-mirrored estimator for San Diego. Browse 150+ line items across all trades, apply O&P, and export professional PDFs.' },
    { id: 'competitorpricing', label: 'Competitor Pricing', icon: '📊', help: 'Compare BCS rates vs SERVPRO, Paul Davis, and ServiceMaster for the San Diego market. Know your competitive position on every trade.' },
    { id: 'invoices', label: 'Invoices', icon: '💰', help: 'Generate and send invoices to clients. Track payment status, send reminders, and record payments received.' },
    { id: 'payments', label: 'Payments', icon: '💳', help: 'Process payments via Square or Stripe. View payment history and reconcile with invoices.' },
    { id: 'changeorders', label: 'Change Orders', icon: '🔄', help: 'Document scope changes during a job. Track additional costs and get client approval for modifications.' },
    { id: 'pricelist', label: 'Price List', icon: '💲', help: 'Manage your standard pricing for services, labor rates, and materials. Import/export price lists.' },
    { id: 'pricing', label: 'Pricing', icon: '💵', help: 'Configure pricing rules, markups, and discounts. Set up pricing tiers for different client types.' },
    { id: 'lineitems', label: 'Line Items', icon: '🧾', help: 'Manage individual billable items used in estimates and invoices. Define descriptions, units, and default prices.' },
    { id: 'employees', label: 'Employees', icon: '👷', help: 'Manage your team members, their roles, certifications, and availability. Track hours and assign to jobs.' },
    { id: 'equipment', label: 'Equipment', icon: '🔧', help: 'Track tools and machinery inventory. Monitor which equipment is deployed on job sites vs available.' },
    { id: 'materials', label: 'Materials', icon: '📦', help: 'Manage building materials inventory. Track stock levels, costs, and usage across jobs.' },
    { id: 'vendors', label: 'Vendors', icon: '🏢', help: 'Manage supplier information and purchase history. Track vendor pricing and contact details.' },
    { id: 'services', label: 'Services', icon: '🛠️', help: 'Define the types of services your company offers. Set default pricing and descriptions for each service.' },
    { id: 'resources', label: 'BCS Equipment Inventory', icon: '📚', help: 'Combined view of equipment, materials, and vendors. Manage all your company assets in one place.' },
    { id: 'quotegenerator', label: 'Quote Generator', icon: '🧮', help: 'Quickly generate professional quotes using templates. Auto-calculate totals and generate PDFs.' },
    { id: 'xactimate', label: 'Xactimate', icon: '📐', help: 'Import and manage Xactimate estimates for insurance claims. Map Xactimate codes to your pricing.' },
    { id: 'remdryout', label: 'Remediation – Dryout', icon: '💧', help: 'Manage water damage drying jobs. Track equipment placement, moisture readings, and drying progress.' },
    { id: 'remrecon', label: 'Remediation – Reconstruction', icon: '🏗️', help: 'Manage reconstruction projects after water/fire damage. Track phases, materials, and completion.' },
    { id: 'jobtracking', label: 'Job Tracking', icon: '🚧', help: 'Real-time tracking of all active jobs. View status updates, timelines, and team assignments.' },
    { id: 'reports', label: 'Reports', icon: '📈', help: 'Generate business reports: revenue, job completion, employee performance, and more. Export to PDF/Excel.' },
    { id: 'messaging', label: 'Bulk Messaging', icon: '💬', help: 'Send SMS or email to multiple clients at once. Create templates for common notifications.' },
    { id: 'quicksms', label: 'Quick SMS', icon: '💬', help: 'Send individual text messages to clients. Quick communication without opening full messaging.' },
    { id: 'companysettings', label: 'Settings', icon: '⚙️', help: 'Configure company info, branding, payment integration, legal disclaimers, and app preferences.' },
  ];

  const handleNavigation = (viewId, clientContext = null) => {
    setCurrentView(viewId);
    setViewHistory(prev => [...prev, viewId]);
    setSelectedClient(clientContext || null);
  };

  const handleBack = () => {
    if (viewHistory.length > 1) {
      const newHistory = [...viewHistory];
      newHistory.pop();
      const previousView = newHistory[newHistory.length - 1];
      setViewHistory(newHistory);
      setCurrentView(previousView);
    }
  };

  // Sidebar resize handlers
  const handleMouseDown = (e) => {
    setIsResizing(true);
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;
      const newWidth = Math.min(Math.max(200, e.clientX), 500);
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  // Global search function
  const handleGlobalSearch = async (query) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setGlobalSearchResults([]);
      setShowGlobalSearch(false);
      return;
    }

    try {
      // Search across multiple endpoints
      const searchLower = query.toLowerCase();
      const results = [];

      // Add navigation items that match
      navigation.forEach(item => {
        if (item.label.toLowerCase().includes(searchLower)) {
          results.push({
            type: 'menu',
            label: item.label,
            icon: item.icon,
            action: () => handleNavigation(item.id)
          });
        }
      });

      // Fetch and search data (clients, work orders, invoices)
      const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

      const [clients, workOrders, invoices] = await Promise.all([
        fetch(`${API_BASE}/clients`).then(r => r.json()).catch(() => []),
        fetch(`${API_BASE}/work-orders`).then(r => r.json()).catch(() => []),
        fetch(`${API_BASE}/invoices`).then(r => r.json()).catch(() => [])
      ]);

      // Search clients
      (clients || []).forEach(client => {
        if (
          client.name?.toLowerCase().includes(searchLower) ||
          client.email?.toLowerCase().includes(searchLower) ||
          client.phone?.includes(query) ||
          client.address?.toLowerCase().includes(searchLower)
        ) {
          results.push({
            type: 'client',
            label: client.name,
            sublabel: client.email || client.phone,
            icon: '👤',
            action: () => handleNavigation('clients')
          });
        }
      });

      // Search work orders
      (workOrders || []).forEach(wo => {
        if (
          wo.work_order_number?.toLowerCase().includes(searchLower) ||
          wo.client_name?.toLowerCase().includes(searchLower) ||
          wo.description?.toLowerCase().includes(searchLower) ||
          wo.address?.toLowerCase().includes(searchLower)
        ) {
          results.push({
            type: 'workorder',
            label: wo.work_order_number,
            sublabel: wo.client_name,
            icon: '📋',
            action: () => handleNavigation('workorders')
          });
        }
      });

      // Search invoices
      (invoices || []).forEach(inv => {
        if (
          inv.invoice_number?.toLowerCase().includes(searchLower) ||
          inv.client_name?.toLowerCase().includes(searchLower)
        ) {
          results.push({
            type: 'invoice',
            label: inv.invoice_number,
            sublabel: inv.client_name,
            icon: '💰',
            action: () => handleNavigation('invoices')
          });
        }
      });

      setGlobalSearchResults(results.slice(0, 15));
      setShowGlobalSearch(results.length > 0);
    } catch (err) {
      console.error('Global search error:', err);
    }
  };

  const filteredNavigation = navigation.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <ImprovedDashboardView onNavigate={handleNavigation} />;
      case 'calendar': return <CalendarView />;
      case 'clients': return <ClientsView />;
      case 'workorders': return <WorkOrdersView initialClient={selectedClient} />;
      case 'invoices': return <InvoicesView initialClient={selectedClient} />;
      case 'payments': return <PaymentsView />;
      case 'estimates': return <EnhancedEstimatesView initialClient={selectedClient} />;
      case 'changeorders': return <ChangeOrdersView />;
      case 'pricelist': return <PriceListView />;
      case 'pricing': return <PricingView />;
      case 'employees': return <EmployeesView />;
      case 'moisturelogs': return <MoistureLogsView />;
      case 'equipment': return <EquipmentView />;
      case 'materials': return <MaterialsView />;
      case 'vendors': return <VendorsView />;
      case 'services': return <ServicesView />;
      case 'resources': return <ResourcesView />;
      case 'lineitems': return <LineItemsView />;
      case 'xactimate': return <XactimateView />;
      case 'remdryout': return <RemediationDryoutView />;
      case 'remrecon': return <RemediationReconstructionView />;
      case 'jobtracking': return <JobTrackingView />;
      case 'reports': return <ReportsView />;
      case 'quotegenerator': return <EnhancedQuoteGeneratorView />;
      case 'messaging': return <MessagingView />;
      case 'quicksms': return <QuickSMSView />;
      case 'companysettings': return <CompanySettingsView />;
      case 'sdestimator': return <SanDiegoEstimatorView />;
      case 'competitorpricing': return <CompetitorPricingView />;
      default: return <ImprovedDashboardView />;
    }
  };

  const handleLogin = (user) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
  };

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <AppProvider>
      <div className={`flex h-screen ${theme.mainBg}`} data-theme={isDarkMode ? 'dark' : 'light'}>
        <aside
          className={`bg-gradient-to-b ${theme.sidebarBg} ${theme.sidebarText} flex flex-col shadow-2xl relative ${sidebarCollapsed ? 'w-20' : ''}`}
          style={{ width: sidebarCollapsed ? 80 : sidebarWidth }}
        >

          <div className={`p-6 border-b ${theme.sidebarBorder}`}>
            {!sidebarCollapsed && (
              <div>
                <h1 className={`text-lg font-semibold text-gray-300 uppercase tracking-wider`}>
                  Navigation
                </h1>
              </div>
            )}
            {sidebarCollapsed && (
              <div className="text-center">
                <span className="text-2xl">🏗️</span>
              </div>
            )}
          </div>

          {/* Global Search Box */}
          {!sidebarCollapsed && (
            <div className="p-4 relative">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                <input
                  type="text"
                  placeholder="Search everything..."
                  value={searchQuery}
                  onChange={(e) => handleGlobalSearch(e.target.value)}
                  onFocus={() => searchQuery.length >= 2 && setShowGlobalSearch(true)}
                  className="w-full pl-10 pr-10 py-2 rounded-lg bg-slate-800 text-gray-100 border border-slate-600 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setGlobalSearchResults([]);
                      setShowGlobalSearch(false);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Global Search Results Dropdown */}
              {showGlobalSearch && globalSearchResults.length > 0 && (
                <div className="absolute left-4 right-4 top-full mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto">
                  {globalSearchResults.map((result, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        result.action();
                        setShowGlobalSearch(false);
                        setSearchQuery('');
                        setGlobalSearchResults([]);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-slate-700 border-b border-slate-700 last:border-0 flex items-center gap-3"
                    >
                      <span className="text-lg">{result.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-100 truncate">{result.label}</p>
                        {result.sublabel && (
                          <p className="text-xs text-gray-400 truncate">{result.sublabel}</p>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 capitalize">{result.type}</span>
                    </button>
                  ))}
                </div>
              )}

              {searchQuery && filteredNavigation.length === 0 && globalSearchResults.length === 0 && (
                <p className="text-xs text-gray-400 mt-2 text-center">No results found</p>
              )}
            </div>
          )}

          <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-gray-700">
            {filteredNavigation.map((item) => (
              <div key={item.id} className="relative group">
                <button
                  onClick={() => handleNavigation(item.id)}
                  className={`w-full text-left px-8 py-4 flex items-center gap-4 transition-all duration-200 border-l-4 ${
                    currentView === item.id
                      ? `bg-gradient-to-r ${theme.activeMenuBg} shadow-lg ${theme.activeMenuShadow} ${theme.activeMenuBorder}`
                      : `border-transparent ${theme.hoverMenuBg}`
                  }`}
                  title={sidebarCollapsed ? item.label : ''}
                >
                  <span className="text-2xl flex-shrink-0">{item.icon}</span>
                  {!sidebarCollapsed && (
                    <>
                      <span className="font-medium text-sm leading-relaxed flex-1">{item.label}</span>
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          setHelpTooltip(helpTooltip === item.id ? null : item.id);
                        }}
                        className="text-xs opacity-30 hover:opacity-100 transition-opacity cursor-help w-5 h-5 flex items-center justify-center rounded-full border border-gray-500 hover:border-gray-300"
                      >
                        ?
                      </span>
                    </>
                  )}
                </button>
                {/* Help Tooltip */}
                {helpTooltip === item.id && !sidebarCollapsed && (
                  <div className="absolute left-full top-0 ml-2 w-64 bg-slate-800 border border-slate-600 rounded-lg shadow-xl p-4 z-50">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-sm font-bold text-white">{item.label}</h4>
                      <button
                        onClick={() => setHelpTooltip(null)}
                        className="text-gray-400 hover:text-white text-xs"
                      >
                        ✕
                      </button>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">{item.help}</p>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {!sidebarCollapsed && (
            <div className={`p-4 border-t ${theme.sidebarBorder} space-y-3`}>
              <div>
                <label className="block text-xs text-gray-400 mb-2">Color Theme</label>
                <select
                  value={currentTheme}
                  onChange={(e) => setCurrentTheme(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 text-gray-100 border border-slate-600 hover:bg-slate-700 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="default">🔵 Default Blue</option>
                  <option value="emerald">🟢 Emerald Green</option>
                  <option value="purple">🟣 Purple</option>
                  <option value="orange">🟠 Orange</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-xs text-gray-400">Dark Mode</label>
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    isDarkMode ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block w-4 h-4 transform transition-transform bg-white rounded-full ${
                      isDarkMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {!sidebarCollapsed && currentUser && (
            <div className={`p-6 border-t ${theme.companyInfoBorder} bg-opacity-30 ${theme.companyInfoBg}`}>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleNavigation('companysettings')}
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${theme.avatarBg} flex items-center justify-center text-white font-bold text-xs hover:opacity-80 transition-opacity`}
                  title="Settings"
                >
                  bcs
                </button>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{currentUser.full_name || currentUser.username}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('user');
                  setIsAuthenticated(false);
                  setCurrentUser(null);
                }}
                className="mt-3 w-full px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          )}

          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={`p-4 border-t ${theme.sidebarBorder} ${theme.hoverMenuBg} transition-colors`}
          >
            <span className="text-xl">{sidebarCollapsed ? '→' : '←'}</span>
          </button>

          {/* Resize Handle */}
          {!sidebarCollapsed && (
            <div
              onMouseDown={handleMouseDown}
              className="absolute top-0 right-0 w-1 h-full cursor-ew-resize hover:bg-blue-500 transition-colors"
              style={{ backgroundColor: isResizing ? '#3b82f6' : 'transparent' }}
            />
          )}

        </aside>

        <main className={`flex-1 flex flex-col overflow-hidden ${theme.mainBg}`}>
{/* Top Navigation Bar with Back Button */}
<div className={`${theme.topBarBg} border-b ${theme.topBarBorder} px-6 py-4 flex items-center gap-4`}>
  <button
    onClick={handleBack}
    disabled={viewHistory.length <= 1}
    className={`flex items-center justify-center w-10 h-10 rounded-lg transition-colors ${
      viewHistory.length > 1
        ? 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600'
        : 'bg-gray-50 dark:bg-gray-800 opacity-50 cursor-not-allowed'
    }`}
    title="Go back"
  >
    <span className="text-xl">←</span>
  </button>
  
  <div className="flex-1">
    <h1 className={`text-3xl font-bold ${theme.topBarText} flex items-center gap-3`}>
      <span className="text-4xl">{navigation.find(n => n.id === currentView)?.icon}</span>
      <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
        {navigation.find(n => n.id === currentView)?.label || 'Dashboard'}
      </span>
    </h1>
  </div>

  {/* Claude AI Voice & Text Control */}
  <div className="flex items-center gap-4 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 max-w-xl flex-1">
    <input
      type="text"
      placeholder="Type a command or use the mic..."
      className="flex-1 bg-transparent border-none focus:ring-0 text-sm dark:text-gray-200"
      onKeyDown={async (e) => {
        if (e.key === 'Enter' && e.target.value.trim()) {
          const text = e.target.value;
          e.target.value = '';
          setAiStatus(`Processing: "${text}"`);
          const result = await window.electronAPI.runCommand(text);
          setAiStatus(result.message);
          setTimeout(() => setAiStatus(''), 5000);
        }
      }}
    />
    {aiStatus && (
      <span className="text-xs font-medium text-blue-600 dark:text-blue-400 truncate max-w-[150px]">
        {aiStatus}
      </span>
    )}
    <button
      onClick={startListening}
      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${
        isListening 
          ? 'bg-red-500 text-white animate-pulse' 
          : 'bg-blue-600 text-white hover:bg-blue-700'
      }`}
      title="Voice Command (Ctrl+Space)"
    >
      <span className="text-lg">{isListening ? '🛑' : '🎤'}</span>
    </button>
  </div>

  <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">
    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
  </div>
</div>
          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            {renderView()}
          </div>
        </main>
      </div>
    </AppProvider>
  );
}

export default App;
