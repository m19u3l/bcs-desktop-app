import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  LayoutDashboard, CalendarDays, Droplets, Users, ClipboardList,
  FileText, FileBarChart2, BarChart2, Receipt, CreditCard,
  GitMerge, Tag, HardHat, Wrench, Package, Building2,
  Briefcase, Archive, Wind, Hammer, Navigation2,
  TrendingUp, Send, MessageSquare, Settings, Search, PenTool, Layers
} from 'lucide-react';
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
import ResourcesView from './views/ResourcesView';
import RemediationDryoutView from './views/RemediationDryoutView';
import RemediationReconstructionView from './views/RemediationReconstructionView';
import JobTrackingView from './views/JobTrackingView';
import ReportsView from './views/ReportsView';
import MessagingView from './views/MessagingView';
import QuickSMSView from './views/QuickSMSView';
import PaymentsView from './views/PaymentsView';
import SanDiegoEstimatorView from './views/SanDiegoEstimatorView';
import CompetitorPricingView from './views/CompetitorPricingView';
import SketchView from './views/SketchView';
import AssembliesView from './views/AssembliesView';
import Screensaver, { IDLE_TIMEOUT_MS } from './components/Screensaver';
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
  const [showScreensaver, setShowScreensaver] = useState(false);
  const [commandPalette, setCommandPalette] = useState(false);
  const [cmdQuery, setCmdQuery] = useState('');
  const idleTimerRef = useRef(null);
  const mediaRecorderRef = React.useRef(null);
  const audioChunksRef = React.useRef([]);

  const resetIdleTimer = useCallback(() => {
    if (showScreensaver) return;
    clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => setShowScreensaver(true), IDLE_TIMEOUT_MS);
  }, [showScreensaver]);

  useEffect(() => {
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
    events.forEach(e => window.addEventListener(e, resetIdleTimer, { passive: true }));
    resetIdleTimer();
    return () => {
      events.forEach(e => window.removeEventListener(e, resetIdleTimer));
      clearTimeout(idleTimerRef.current);
    };
  }, [resetIdleTimer]);

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
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPalette(p => !p);
        setCmdQuery('');
      }
      if (e.key === 'Escape') {
        setCommandPalette(false);
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

  const navSections = [
    {
      title: 'Operations',
      items: [
        { id: 'dashboard',    label: 'Dashboard',    Icon: LayoutDashboard, help: 'Overview of business metrics, recent activity, invoices, and quick access to all features.' },
        { id: 'calendar',     label: 'Calendar',     Icon: CalendarDays,    help: 'Schedule appointments, job deadlines, and team availability.' },
        { id: 'jobtracking',  label: 'Job Tracker',  Icon: Navigation2,     help: 'Real-time tracking of all active jobs, status updates, and team assignments.' },
        { id: 'clients',      label: 'Clients',      Icon: Users,           help: 'Manage customer information, contact details, and full job history.' },
        { id: 'workorders',   label: 'Work Orders',  Icon: ClipboardList,   help: 'Create and manage job assignments. Assign employees and link to estimates and invoices.' },
      ],
    },
    {
      title: 'Estimating',
      items: [
        { id: 'estimates',    label: 'Homeowner Estimates',  Icon: FileText,      help: 'Create detailed cost estimates for homeowner jobs. Convert to work orders.' },
        { id: 'sdestimator',  label: 'Insurance Estimator',  Icon: FileBarChart2, help: 'Xactimate-mirrored estimator with 2,000+ line items, O&P, and PDF export.' },
        { id: 'sketch',       label: 'Sketch Engine',        Icon: PenTool,       help: 'Draw 2D floorplans and auto-generate Xactimate-style estimates from geometry.' },
        { id: 'assemblies',   label: 'Assemblies',           Icon: Layers,        help: 'Reusable line item packages — add a full Water Damage bundle in one click.' },
        { id: 'changeorders', label: 'Change Orders',        Icon: GitMerge,      help: 'Document scope changes and track additional costs with client approval.' },
      ],
    },
    {
      title: 'Restoration',
      items: [
        { id: 'remdryout',    label: 'Remediation – Dryout',          Icon: Wind,    help: 'Manage water damage drying jobs. Track equipment and moisture progress.' },
        { id: 'remrecon',     label: 'Remediation – Reconstruction',  Icon: Hammer,  help: 'Manage reconstruction projects after water or fire damage.' },
        { id: 'moisturelogs', label: 'Moisture Logs',                 Icon: Droplets,help: 'Record daily moisture readings and generate insurance adjuster reports.' },
      ],
    },
    {
      title: 'Financial',
      items: [
        { id: 'invoices',  label: 'Invoices',  Icon: Receipt,    help: 'Generate and send invoices. Track payment status and record payments.' },
        { id: 'payments',  label: 'Payments',  Icon: CreditCard, help: 'Process payments via Square or Stripe. View payment history.' },
        { id: 'reports',   label: 'Reports',   Icon: TrendingUp, help: 'Revenue, job completion, and performance reports. Export to PDF/Excel.' },
      ],
    },
    {
      title: 'Resources',
      items: [
        { id: 'pricelist',  label: 'Price List',           Icon: Tag,       help: 'Manage standard pricing for services, labor rates, and materials.' },
        { id: 'employees',  label: 'Employees',            Icon: HardHat,   help: 'Manage team members, roles, certifications, and availability.' },
        { id: 'equipment',  label: 'Equipment',            Icon: Wrench,    help: 'Track tools and machinery — deployed vs available.' },
        { id: 'materials',  label: 'Materials',            Icon: Package,   help: 'Manage building materials inventory and usage across jobs.' },
        { id: 'vendors',    label: 'Vendors',              Icon: Building2, help: 'Supplier and subcontractor directory, filtered by trade.' },
        { id: 'services',   label: 'Services',             Icon: Briefcase, help: 'Define service offerings with default pricing and descriptions.' },
        { id: 'resources',  label: 'Equipment Inventory',  Icon: Archive,   help: 'Combined view of equipment, materials, and vendors.' },
      ],
    },
    {
      title: 'Intelligence',
      items: [
        { id: 'competitorpricing', label: 'Competitor Pricing', Icon: BarChart2, help: 'BCS rates vs SERVPRO, Paul Davis, ServiceMaster — San Diego market.' },
      ],
    },
    {
      title: 'Communication',
      items: [
        { id: 'messaging', label: 'Bulk Messaging', Icon: MessageSquare, help: 'Send SMS or email to multiple clients at once with templates.' },
        { id: 'quicksms',  label: 'Quick SMS',      Icon: Send,          help: 'Send an individual text to any client instantly.' },
      ],
    },
    {
      title: 'Admin',
      items: [
        { id: 'companysettings', label: 'Settings', Icon: Settings, help: 'Company info, branding, payment integration, and app preferences.' },
      ],
    },
  ];

  // Flat list for search + renderView + topbar label lookup
  const navigation = navSections.flatMap(s => s.items);

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
            NavIcon: item.Icon,
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
      case 'employees': return <EmployeesView />;
      case 'moisturelogs': return <MoistureLogsView />;
      case 'equipment': return <EquipmentView />;
      case 'materials': return <MaterialsView />;
      case 'vendors': return <VendorsView />;
      case 'services': return <ServicesView />;
      case 'resources': return <ResourcesView />;
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
      case 'sketch':      return <SketchView />;
      case 'assemblies':  return <AssembliesView />;
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
      {showScreensaver && (
        <Screensaver onDismiss={() => {
          setShowScreensaver(false);
          clearTimeout(idleTimerRef.current);
          idleTimerRef.current = setTimeout(() => setShowScreensaver(true), IDLE_TIMEOUT_MS);
        }} />
      )}
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
              <div className="text-center flex justify-center">
                <Hammer size={24} className="text-gray-400" />
              </div>
            )}
          </div>

          {/* Global Search Box */}
          {!sidebarCollapsed && (
            <div className="p-4 relative">
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
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
                      {result.NavIcon
                        ? <result.NavIcon size={18} className="text-gray-400 flex-shrink-0" />
                        : <span className="text-lg">{result.icon || '›'}</span>
                      }
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

          <nav className="flex-1 overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-gray-700">
            {(searchQuery.length >= 2 ? [{ title: 'Results', items: filteredNavigation }] : navSections).map((section) => (
              <div key={section.title} className="mb-2">
                {!sidebarCollapsed && (
                  <h2 className="text-xs uppercase tracking-wider text-zinc-500 px-4 pt-3 pb-1 font-semibold">
                    {section.title}
                  </h2>
                )}
                {section.items.map((item) => (
                  <div key={item.id} className="relative group">
                    <button
                      onClick={() => handleNavigation(item.id)}
                      className={`w-full text-left px-4 py-2 flex items-center gap-3 transition-all duration-150 rounded-lg mx-2 border-l-2 ${
                        currentView === item.id
                          ? `bg-gradient-to-r ${theme.activeMenuBg} shadow-md ${theme.activeMenuShadow} ${theme.activeMenuBorder}`
                          : `border-transparent ${theme.hoverMenuBg}`
                      }`}
                      style={{ width: 'calc(100% - 16px)' }}
                      title={sidebarCollapsed ? item.label : ''}
                    >
                      <item.Icon size={17} className="flex-shrink-0 opacity-75" />
                      {!sidebarCollapsed && (
                        <>
                          <span className="font-medium text-sm leading-relaxed flex-1">{item.label}</span>
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              setHelpTooltip(helpTooltip === item.id ? null : item.id);
                            }}
                            className="text-xs opacity-20 hover:opacity-80 transition-opacity cursor-help w-4 h-4 flex items-center justify-center rounded-full border border-gray-600 hover:border-gray-300"
                          >
                            ?
                          </span>
                        </>
                      )}
                    </button>
                    {helpTooltip === item.id && !sidebarCollapsed && (
                      <div className="absolute left-full top-0 ml-2 w-64 bg-slate-800 border border-slate-600 rounded-lg shadow-xl p-4 z-50">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-sm font-bold text-white">{item.label}</h4>
                          <button onClick={() => setHelpTooltip(null)} className="text-gray-400 hover:text-white text-xs">✕</button>
                        </div>
                        <p className="text-xs text-gray-300 leading-relaxed">{item.help}</p>
                      </div>
                    )}
                  </div>
                ))}
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

          {/* ── Enterprise Top Toolbar ── */}
          <header className="h-14 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-4 flex items-center justify-between shrink-0 shadow-sm">

            {/* LEFT: back + breadcrumb + quick actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleBack}
                disabled={viewHistory.length <= 1}
                title="Go back"
                className={`w-8 h-8 rounded flex items-center justify-center transition-colors text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 ${viewHistory.length <= 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
              >
                <span className="text-base">←</span>
              </button>

              {(() => {
                const nav = navigation.find(n => n.id === currentView);
                return (
                  <div className="flex items-center gap-2">
                    {nav?.Icon && <nav.Icon size={16} className="text-blue-600 flex-shrink-0" />}
                    <span className="font-semibold text-sm text-zinc-800 dark:text-zinc-100">{nav?.label || 'Dashboard'}</span>
                  </div>
                );
              })()}

              <div className="w-px h-5 bg-zinc-200 dark:bg-zinc-700 mx-1" />

              <button
                onClick={() => { setCommandPalette(true); setCmdQuery(''); }}
                className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-700 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors"
                title="Command Palette (Ctrl+K)"
              >
                ⌘ Command
              </button>
              <button
                onClick={() => handleNavigation('workorders')}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors"
              >
                <span>+</span> New Project
              </button>
              <button
                onClick={() => handleNavigation('reports')}
                className="flex items-center gap-1.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 px-3 py-1.5 rounded text-xs font-medium transition-colors"
              >
                Reports
              </button>
              <button
                onClick={() => handleNavigation('sdestimator')}
                className="flex items-center gap-1.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 px-3 py-1.5 rounded text-xs font-medium transition-colors"
              >
                Estimator
              </button>
            </div>

            {/* RIGHT: AI bar + bell + user */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded px-3 py-1.5">
                <input
                  type="text"
                  placeholder="AI command… (Ctrl+Space for mic)"
                  className="bg-transparent border-none focus:ring-0 text-xs text-zinc-700 dark:text-zinc-300 placeholder-zinc-400 w-52 outline-none"
                  onKeyDown={async (e) => {
                    if (e.key === 'Enter' && e.target.value.trim()) {
                      const text = e.target.value;
                      e.target.value = '';
                      setAiStatus(`Processing…`);
                      const result = await window.electronAPI?.runCommand(text);
                      setAiStatus(result?.message || '');
                      setTimeout(() => setAiStatus(''), 4000);
                    }
                  }}
                />
                {aiStatus && <span className="text-xs text-blue-500 truncate max-w-[100px]">{aiStatus}</span>}
                <button
                  onClick={startListening}
                  title="Voice Command (Ctrl+Space)"
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all text-xs ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                >
                  {isListening ? '■' : '🎤'}
                </button>
              </div>

              {/* Notifications bell */}
              <button className="relative w-8 h-8 rounded flex items-center justify-center text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Theme toggle */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="w-8 h-8 rounded flex items-center justify-center text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-sm"
                title="Toggle dark mode"
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>

              {/* User avatar */}
              {currentUser && (
                <div className="flex items-center gap-2 border-l border-zinc-200 dark:border-zinc-700 pl-3">
                  <button
                    onClick={() => handleNavigation('companysettings')}
                    className={`w-8 h-8 rounded-full bg-gradient-to-br ${theme.avatarBg} flex items-center justify-center text-white text-xs font-bold hover:opacity-80 transition-opacity`}
                    title="Settings"
                  >
                    {(currentUser.full_name || currentUser.username || 'U').charAt(0).toUpperCase()}
                  </button>
                  <div className="hidden sm:block">
                    <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-100 leading-none">{currentUser.full_name || currentUser.username}</p>
                    <p className="text-xs text-zinc-400 leading-none mt-0.5">Senior Estimator</p>
                  </div>
                  <button
                    onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); setIsAuthenticated(false); setCurrentUser(null); }}
                    className="text-xs text-zinc-400 hover:text-red-500 transition-colors ml-1"
                    title="Logout"
                  >
                    ⏏
                  </button>
                </div>
              )}
            </div>
          </header>
          {/* ── Workspace Tabs ── */}
          {(() => {
            const workspaceTabs = [
              { label: 'Projects',   id: 'workorders'   },
              { label: 'Estimates',  id: 'estimates'    },
              { label: 'Invoices',   id: 'invoices'     },
              { label: 'Dry-Out',    id: 'remdryout'    },
              { label: 'Sketch',     id: 'sketch'       },
              { label: 'Estimator',  id: 'sdestimator'  },
              { label: 'Reports',    id: 'reports'      },
            ];
            const activeTab = workspaceTabs.find(t => t.id === currentView);
            return (
              <div className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-4 flex items-center gap-0 overflow-x-auto shrink-0">
                {workspaceTabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => handleNavigation(tab.id)}
                    className={`px-4 py-2.5 text-xs border-b-2 whitespace-nowrap transition-colors font-medium ${
                      currentView === tab.id
                        ? 'border-blue-600 text-blue-600 bg-white dark:bg-zinc-800'
                        : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-white dark:hover:bg-zinc-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            );
          })()}

          {/* ── Command Palette ── */}
          {commandPalette && (
            <div
              className="absolute inset-0 bg-black/40 flex items-start justify-center pt-24 z-50"
              onClick={e => e.target === e.currentTarget && setCommandPalette(false)}
            >
              <div className="w-[620px] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
                <div className="p-4 border-b border-zinc-200 dark:border-zinc-700">
                  <input
                    autoFocus
                    value={cmdQuery}
                    onChange={e => setCmdQuery(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Escape') setCommandPalette(false);
                    }}
                    placeholder="Search jobs, estimates, invoices, or type a command…"
                    className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm"
                  />
                </div>
                <div className="max-h-96 overflow-auto">
                  {/* Quick Actions */}
                  {!cmdQuery && (
                    <div className="p-2">
                      <p className="text-xs text-zinc-400 uppercase tracking-wider px-3 py-2 font-semibold">Quick Actions</p>
                      {[
                        { label: '+ New Work Order',      icon: '📋', nav: 'workorders'   },
                        { label: '+ Create Estimate',     icon: '📄', nav: 'estimates'    },
                        { label: '+ New Invoice',         icon: '💰', nav: 'invoices'     },
                        { label: '+ Start Dry-Out Job',   icon: '💧', nav: 'remdryout'    },
                        { label: '+ Open Sketch Engine',  icon: '✏️',  nav: 'sketch'       },
                        { label: '+ Insurance Estimate',  icon: '🏗️',  nav: 'sdestimator'  },
                        { label: '⚙ Company Settings',   icon: '⚙️',  nav: 'companysettings' },
                      ].map(a => (
                        <button
                          key={a.label}
                          onClick={() => { handleNavigation(a.nav); setCommandPalette(false); }}
                          className="w-full text-left px-4 py-2.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm flex items-center gap-3 text-zinc-700 dark:text-zinc-300"
                        >
                          <span className="text-base w-5">{a.icon}</span>
                          {a.label}
                        </button>
                      ))}
                    </div>
                  )}
                  {/* Filtered nav items */}
                  {cmdQuery && (() => {
                    const q = cmdQuery.toLowerCase();
                    const matches = navigation.filter(n => n.label.toLowerCase().includes(q));
                    return matches.length > 0 ? (
                      <div className="p-2">
                        <p className="text-xs text-zinc-400 uppercase tracking-wider px-3 py-2 font-semibold">Navigation</p>
                        {matches.map(n => (
                          <button
                            key={n.id}
                            onClick={() => { handleNavigation(n.id); setCommandPalette(false); setCmdQuery(''); }}
                            className="w-full text-left px-4 py-2.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm flex items-center gap-3 text-zinc-700 dark:text-zinc-300"
                          >
                            <n.Icon size={15} className="text-zinc-400 flex-shrink-0" />
                            {n.label}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-zinc-400 text-center py-8">No results for "{cmdQuery}"</p>
                    );
                  })()}
                </div>
                <div className="border-t border-zinc-200 dark:border-zinc-700 px-4 py-2.5 flex items-center justify-between">
                  <span className="text-xs text-zinc-400">↑↓ navigate · Enter select · Esc close</span>
                  <button onClick={() => setCommandPalette(false)} className="text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 px-3 py-1 border border-zinc-200 dark:border-zinc-700 rounded hover:bg-zinc-50 dark:hover:bg-zinc-800">
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            {renderView()}
          </div>

          {/* Bottom Status Bar */}
          <footer className="h-8 bg-zinc-900 text-zinc-400 flex items-center justify-between px-5 text-xs shrink-0">
            <div className="flex items-center gap-5">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                Connected
              </span>
              <span>Pricing: 2,198 items</span>
              <span>San Diego County</span>
            </div>
            <div className="flex items-center gap-4">
              <span>BCS Desktop v1.0.0</span>
            </div>
          </footer>
        </main>
      </div>
    </AppProvider>
  );
}

export default App;
