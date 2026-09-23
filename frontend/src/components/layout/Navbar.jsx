import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, 
  Search, 
  Bell, 
  LogOut, 
  Settings, 
  Activity, 
  Cpu, 
  Workflow, 
  Radio, 
  X,
  AlertCircle,
  AlertTriangle,
  Check,
  CheckCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { deviceService } from '../../services/deviceService';
import { pipelineService } from '../../services/pipelineService';
import { alertService } from '../../services/alertService';
import { Badge } from '../common/Badge';

const STORAGE_KEY_NOTIFS = 'nexusflow_navbar_notifications';

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif_01',
    category: 'Critical Alert',
    title: 'High Temperature Threshold Exceeded',
    desc: 'Turbine Sensor #01 reached 86.4°C exceeding safety limit (80.0°C)',
    time: '2m ago',
    type: 'critical',
    isRead: false,
    url: '/alerts'
  },
  {
    id: 'notif_02',
    category: 'Warning Alert',
    title: 'Vibration Amplitude Anomaly',
    desc: 'Turbine Sensor #03 spiked to 6.8 mm/s on bearing #2',
    time: '8m ago',
    type: 'warning',
    isRead: false,
    url: '/alerts'
  },
  {
    id: 'notif_03',
    category: 'Pipeline Event',
    title: 'Rule Pipeline Execution Started',
    desc: 'Turbine Temperature Monitor pipeline active with 4 streaming nodes',
    time: '15m ago',
    type: 'info',
    isRead: false,
    url: '/pipelines'
  },
  {
    id: 'notif_04',
    category: 'Device Status Change',
    title: 'Device Connection Offline',
    desc: 'Integrated Multi-Unit #01 (MMU-001) status changed to Offline',
    time: '25m ago',
    type: 'warning',
    isRead: false,
    url: '/devices'
  }
];

export const Navbar = ({ onMobileToggle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Requirement: Notifications State & Persistence
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_NOTIFS);
    if (saved) {
      try { return JSON.parse(saved); } catch { return INITIAL_NOTIFICATIONS; }
    }
    return INITIAL_NOTIFICATIONS;
  });

  // Global Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  const searchRef = useRef(null);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Sync notifications to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(notifications));
  }, [notifications]);

  // Click outside & Escape key listeners
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchFocused(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsSearchFocused(false);
        setShowNotifications(false);
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Compute Unread Notifications Count
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Notification Handlers
  const handleMarkAsRead = (id, e) => {
    if (e) e.stopPropagation();
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, isRead: true }))
    );
  };

  const handleNotificationClick = (item) => {
    handleMarkAsRead(item.id);
    setShowNotifications(false);
    navigate(item.url);
  };

  // Compute Categorized Search Results
  const getSearchResults = () => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return { devices: [], pipelines: [], alerts: [], telemetry: [], totalCount: 0 };

    const allDevices = deviceService.getDevices() || [];
    const allPipelines = pipelineService.getPipelines() || [];
    const allAlerts = alertService.getAlerts() || [];

    const matchedDevices = allDevices.filter(d => 
      d.name?.toLowerCase().includes(q) ||
      d.id?.toLowerCase().includes(q) ||
      d.location?.toLowerCase().includes(q) ||
      d.type?.toLowerCase().includes(q) ||
      d.status?.toLowerCase().includes(q)
    ).slice(0, 3);

    const matchedPipelines = allPipelines.filter(p => 
      p.name?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      p.id?.toLowerCase().includes(q) ||
      p.status?.toLowerCase().includes(q)
    ).slice(0, 3);

    const matchedAlerts = allAlerts.filter(a => 
      a.title?.toLowerCase().includes(q) ||
      a.device?.toLowerCase().includes(q) ||
      a.message?.toLowerCase().includes(q) ||
      a.severity?.toLowerCase().includes(q)
    ).slice(0, 3);

    const matchedTelemetry = allDevices.filter(d => 
      q.includes('stream') || 
      q.includes('telemetry') || 
      q.includes('temp') || 
      q.includes('press') || 
      q.includes('vib') || 
      q.includes('rpm') ||
      d.name?.toLowerCase().includes(q) ||
      d.id?.toLowerCase().includes(q)
    ).slice(0, 3);

    const totalCount = matchedDevices.length + matchedPipelines.length + matchedAlerts.length + matchedTelemetry.length;

    return {
      devices: matchedDevices,
      pipelines: matchedPipelines,
      alerts: matchedAlerts,
      telemetry: matchedTelemetry,
      totalCount
    };
  };

  const results = getSearchResults();
  const showSearchDropdown = isSearchFocused && searchQuery.trim().length > 0;

  const handleSelectSearchResult = (targetUrl) => {
    setIsSearchFocused(false);
    setSearchQuery('');
    navigate(targetUrl);
  };

  return (
    <header className="h-16 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 sticky top-0 z-20 px-4 md:px-6 flex items-center justify-between shadow-lg">
      {/* Left section: Sidebar toggle & Global Search */}
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onMobileToggle}
          className="md:hidden p-2 rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-slate-900 transition-colors border border-transparent hover:border-cyan-500/30"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Input & Dropdown */}
        <div ref={searchRef} className="relative max-w-md w-full hidden sm:block">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-500/60" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            placeholder="Search devices, pipelines, alerts, telemetry..."
            className="w-full bg-slate-900/90 border border-slate-800 focus:border-cyan-500/60 rounded-xl pl-9 pr-8 py-2 text-xs md:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/40 transition-all font-mono"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Categorized Search Results Dropdown */}
          {showSearchDropdown && (
            <div className="absolute left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl max-h-[28rem] overflow-y-auto divide-y divide-slate-800/80">
              {results.totalCount === 0 ? (
                <div className="p-6 text-center">
                  <Search className="w-6 h-6 text-slate-600 mx-auto mb-2" />
                  <p className="text-xs font-mono font-bold text-slate-300">No results found</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    No devices, pipelines, alerts, or telemetry streams match "{searchQuery}".
                  </p>
                </div>
              ) : (
                <>
                  {results.devices.length > 0 && (
                    <div className="p-2">
                      <div className="px-3 py-1.5 text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center justify-between">
                        <span>Devices ({results.devices.length})</span>
                        <Cpu className="w-3.5 h-3.5 text-cyan-500/60" />
                      </div>
                      <div className="space-y-1 mt-1">
                        {results.devices.map(d => (
                          <div
                            key={d.id}
                            onClick={() => handleSelectSearchResult(`/telemetry?device=${d.id}`)}
                            className="p-2.5 rounded-xl hover:bg-slate-800/60 cursor-pointer transition-colors flex items-center justify-between group"
                          >
                            <div className="min-w-0">
                              <span className="text-xs font-bold text-slate-200 block truncate group-hover:text-cyan-300">
                                {d.name}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                ID: <span className="text-cyan-400 font-bold">{d.id}</span> • {d.location}
                              </span>
                            </div>
                            <Badge status={d.status}>{d.status}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {results.pipelines.length > 0 && (
                    <div className="p-2">
                      <div className="px-3 py-1.5 text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider flex items-center justify-between">
                        <span>Pipelines ({results.pipelines.length})</span>
                        <Workflow className="w-3.5 h-3.5 text-indigo-500/60" />
                      </div>
                      <div className="space-y-1 mt-1">
                        {results.pipelines.map(p => (
                          <div
                            key={p.id}
                            onClick={() => handleSelectSearchResult(`/pipelines/${p.id}`)}
                            className="p-2.5 rounded-xl hover:bg-slate-800/60 cursor-pointer transition-colors flex items-center justify-between group"
                          >
                            <div className="min-w-0">
                              <span className="text-xs font-bold text-slate-200 block truncate group-hover:text-indigo-300">
                                {p.name}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                Rule Pipeline • {p.nodes?.length || 0} Nodes
                              </span>
                            </div>
                            <Badge status={p.status}>{p.status}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {results.alerts.length > 0 && (
                    <div className="p-2">
                      <div className="px-3 py-1.5 text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center justify-between">
                        <span>Alerts ({results.alerts.length})</span>
                        <Bell className="w-3.5 h-3.5 text-amber-500/60" />
                      </div>
                      <div className="space-y-1 mt-1">
                        {results.alerts.map(a => (
                          <div
                            key={a.id}
                            onClick={() => handleSelectSearchResult('/alerts')}
                            className="p-2.5 rounded-xl hover:bg-slate-800/60 cursor-pointer transition-colors flex items-center justify-between group"
                          >
                            <div className="min-w-0">
                              <span className="text-xs font-bold text-slate-200 block truncate group-hover:text-amber-300">
                                {a.title}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono truncate block">
                                {a.device} • {a.message}
                              </span>
                            </div>
                            <Badge status={a.severity}>{a.severity}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {results.telemetry.length > 0 && (
                    <div className="p-2">
                      <div className="px-3 py-1.5 text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center justify-between">
                        <span>Telemetry Streams ({results.telemetry.length})</span>
                        <Radio className="w-3.5 h-3.5 text-emerald-500/60" />
                      </div>
                      <div className="space-y-1 mt-1">
                        {results.telemetry.map(t => (
                          <div
                            key={t.id}
                            onClick={() => handleSelectSearchResult(`/telemetry?device=${t.id}`)}
                            className="p-2.5 rounded-xl hover:bg-slate-800/60 cursor-pointer transition-colors flex items-center justify-between group"
                          >
                            <div className="min-w-0">
                              <span className="text-xs font-bold text-slate-200 block truncate group-hover:text-emerald-300">
                                {t.name} Live Stream
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                Readout: <span className="text-cyan-400 font-bold">{t.temperature}°C</span> • {t.lastSeen}
                              </span>
                            </div>
                            <span className="text-[10px] font-mono font-bold bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded border border-cyan-800">
                              LIVE
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right section: Telemetry Status Ticker, Notifications, Profile */}
      <div className="flex items-center gap-3 md:gap-5">
        {/* Live Telemetry Ticker Badge */}
        <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-cyan-500/30 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-emerald-400 font-bold text-[11px] tracking-wide uppercase">
              SYSTEM ONLINE
            </span>
          </div>
          <span className="w-px h-3.5 bg-slate-800" />
          <div className="flex items-center gap-1.5 text-cyan-400 text-[11px]">
            <Activity className="w-3.5 h-3.5" />
            <span>5,240 MSG/S</span>
          </div>
        </div>

        {/* Requirement: Functional Notification Bell Dropdown */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="relative p-2 rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-slate-900 border border-transparent hover:border-cyan-500/30 transition-all"
            title="System Incident Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow-md font-mono">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 md:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 py-2 overflow-hidden backdrop-blur-xl">
              {/* Dropdown Header */}
              <div className="px-4 py-3 border-b border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                    System Event Stream
                  </span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] bg-rose-950 text-rose-400 px-2 py-0.5 rounded-full border border-rose-800/80 font-bold font-mono">
                      {unreadCount} Unread
                    </span>
                  )}
                </div>

                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 transition-colors"
                  >
                    <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                  </button>
                )}
              </div>

              {/* Dropdown Notification List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-slate-500 text-xs font-mono">
                    No system notifications recorded.
                  </div>
                ) : (
                  notifications.map((n) => {
                    const isCritical = n.type === 'critical';
                    const isWarning = n.type === 'warning';

                    return (
                      <div
                        key={n.id}
                        onClick={() => handleNotificationClick(n)}
                        className={`p-3.5 hover:bg-slate-800/50 cursor-pointer transition-colors flex items-start justify-between gap-3 group relative ${
                          !n.isRead ? 'bg-slate-950/60' : 'opacity-75'
                        }`}
                      >
                        <div className="flex items-start gap-2.5 min-w-0 flex-1">
                          <div className="mt-0.5 shrink-0">
                            {isCritical ? (
                              <AlertCircle className="w-4 h-4 text-rose-400" />
                            ) : isWarning ? (
                              <AlertTriangle className="w-4 h-4 text-amber-400" />
                            ) : n.category?.includes('Pipeline') ? (
                              <Workflow className="w-4 h-4 text-indigo-400" />
                            ) : (
                              <Cpu className="w-4 h-4 text-cyan-400" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className={`text-xs font-bold font-mono truncate ${
                                isCritical ? 'text-rose-400' : isWarning ? 'text-amber-400' : 'text-slate-100'
                              }`}>
                                {n.title}
                              </span>
                              {!n.isRead && (
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                              )}
                            </div>
                            <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                              {n.desc}
                            </p>
                            <div className="flex items-center gap-2 mt-1.5 text-[10px] font-mono text-slate-500">
                              <span className="text-slate-400">{n.category}</span>
                              <span>•</span>
                              <span>{n.time}</span>
                            </div>
                          </div>
                        </div>

                        {!n.isRead && (
                          <button
                            onClick={(e) => handleMarkAsRead(n.id, e)}
                            className="p-1 text-slate-500 hover:text-cyan-400 hover:bg-slate-800 rounded transition-colors shrink-0 opacity-0 group-hover:opacity-100"
                            title="Mark as read"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 p-1 rounded-full border border-cyan-500/40 hover:border-cyan-400 transition-all focus:outline-none shadow-md shadow-cyan-500/10"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 text-slate-950 font-bold flex items-center justify-center text-xs font-mono">
              <div className="w-full h-full bg-slate-950 rounded-full text-cyan-400 flex items-center justify-center font-extrabold">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 py-2 glass-panel-cyan">
              <div className="px-4 py-3 border-b border-slate-800/80">
                <p className="text-sm font-bold text-slate-100">{user?.name || 'Admin Operator'}</p>
                <p className="text-xs text-cyan-400 font-mono truncate">{user?.email || 'admin@nexusflow.com'}</p>
              </div>
              <div className="py-1">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate('/settings');
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-cyan-400 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  Account Settings
                </button>
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-400 hover:bg-slate-800 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
