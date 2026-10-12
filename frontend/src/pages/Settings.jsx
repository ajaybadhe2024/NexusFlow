import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Save, 
  Key, 
  CheckCircle2, 
  Clock, 
  Edit2, 
  Check, 
  Smartphone, 
  Mail, 
  Globe 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { Toast } from '../components/common/Toast';

export const Settings = () => {
  const { user, updateProfile } = useAuth();

  // Requirement 1 & 2: User Profile State
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    company: '',
    role: ''
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Requirement 3: Notification Channels with Functional Toggles
  const [notifications, setNotifications] = useState({
    sms: true,
    email: true,
    browser: true
  });

  // Requirement 4: Security State (Change Password & Session Info)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [sessionInfo] = useState({
    status: 'Active Session',
    protocol: '256-bit TLS 1.3 Encrypted',
    lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC'
  });

  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  useEffect(() => {
    // Load initial user data or defaults
    setProfileData({
      name: user?.name || 'Admin Operator',
      email: user?.email || 'admin@nexusflow.com',
      company: user?.company || 'NexusFlow Operations Ltd.',
      role: user?.role || 'System Administrator'
    });

    // Load saved notification preferences from localStorage if available
    const savedNotifs = localStorage.getItem('nexusflow_notification_settings');
    if (savedNotifs) {
      try {
        setNotifications(JSON.parse(savedNotifs));
      } catch {
        // use default
      }
    }
  }, [user]);

  // Requirement 5: Save Changes Handler
  const handleSaveAll = (e) => {
    e.preventDefault();

    // Validate password if user typed anything into password fields
    if (passwordData.newPassword || passwordData.confirmPassword) {
      if (!passwordData.currentPassword) {
        setToastType('error');
        setToastMessage('Please enter your current password to change password.');
        return;
      }
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setToastType('error');
        setToastMessage('New password and confirm password do not match.');
        return;
      }
      if (passwordData.newPassword.length < 6) {
        setToastType('error');
        setToastMessage('New password must be at least 6 characters long.');
        return;
      }
    }

    // Update Profile via AuthContext & localStorage
    if (updateProfile) {
      updateProfile({
        name: profileData.name,
        email: profileData.email,
        company: profileData.company
      });
    }

    // Save Notification Preferences
    localStorage.setItem('nexusflow_notification_settings', JSON.stringify(notifications));

    // Reset password form fields after save
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });

    setIsEditingProfile(false);
    setToastType('success');
    setToastMessage('Platform settings and preferences updated successfully.');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-8">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50">
          <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2.5">
            <SettingsIcon className="w-7 h-7 text-cyan-400" /> Platform Settings
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage user profile, notification channels, security policies, and session preferences.
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          size="md"
          icon={Save}
          onClick={handleSaveAll}
        >
          Save Changes
        </Button>
      </div>

      <form onSubmit={handleSaveAll} className="space-y-6">
        {/* Requirement 1 & 2: User Profile Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
              <User className="w-5 h-5 text-cyan-400" /> User Profile
            </h2>
            <button
              type="button"
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 bg-cyan-950/60 px-3 py-1 rounded-lg border border-cyan-800/60 transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
              {isEditingProfile ? 'Done Editing' : 'Edit Profile'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                disabled={!isEditingProfile}
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className={`w-full bg-slate-950 border rounded-lg px-3 py-2 text-slate-200 transition-all focus:outline-none ${
                  isEditingProfile 
                    ? 'border-cyan-500/80 focus:border-cyan-400' 
                    : 'border-slate-800 text-slate-300'
                }`}
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                disabled={!isEditingProfile}
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                className={`w-full bg-slate-950 border rounded-lg px-3 py-2 text-slate-200 transition-all focus:outline-none ${
                  isEditingProfile 
                    ? 'border-cyan-500/80 focus:border-cyan-400' 
                    : 'border-slate-800 text-slate-300'
                }`}
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Company / Organization</label>
              <input
                type="text"
                disabled={!isEditingProfile}
                value={profileData.company}
                onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                className={`w-full bg-slate-950 border rounded-lg px-3 py-2 text-slate-200 transition-all focus:outline-none ${
                  isEditingProfile 
                    ? 'border-cyan-500/80 focus:border-cyan-400' 
                    : 'border-slate-800 text-slate-300'
                }`}
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Assigned Role</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  disabled
                  value={profileData.role}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-2 text-cyan-400 font-mono font-bold"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Requirement 3: Notification Channels */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 backdrop-blur-md">
          <h2 className="text-base font-extrabold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
            <Bell className="w-5 h-5 text-amber-400" /> Notification Channels
          </h2>

          <div className="space-y-3 text-xs">
            {/* SMS Alerts Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/90 hover:border-slate-700 transition-all">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-950/60 border border-amber-800/60 text-amber-400 shrink-0">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-200 block text-sm">SMS Alerts</span>
                  <span className="text-xs text-slate-400">Send direct SMS notifications to engineer phones on critical threshold events</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setNotifications({ ...notifications, sms: !notifications.sms })}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  notifications.sms ? 'bg-cyan-500' : 'bg-slate-800'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-slate-950 shadow-lg ring-0 transition duration-200 ease-in-out ${
                    notifications.sms ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Email Alerts Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/90 hover:border-slate-700 transition-all">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-200 block text-sm">Email Alerts</span>
                  <span className="text-xs text-slate-400">Dispatch daily telemetry digests, incident reports, and rule trigger logs</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setNotifications({ ...notifications, email: !notifications.email })}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  notifications.email ? 'bg-cyan-500' : 'bg-slate-800'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-slate-950 shadow-lg ring-0 transition duration-200 ease-in-out ${
                    notifications.email ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Web/App Push Notifications Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/90 hover:border-slate-700 transition-all">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 shrink-0">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-200 block text-sm">Web / App Notifications</span>
                  <span className="text-xs text-slate-400">Show real-time desktop push banner notifications inside NexusFlow workspace</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setNotifications({ ...notifications, browser: !notifications.browser })}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  notifications.browser ? 'bg-cyan-500' : 'bg-slate-800'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-slate-950 shadow-lg ring-0 transition duration-200 ease-in-out ${
                    notifications.browser ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Requirement 4: Security Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5 backdrop-blur-md">
          <h2 className="text-base font-extrabold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
            <Shield className="w-5 h-5 text-emerald-400" /> Security & Authentication
          </h2>

          {/* Session Status & Last Login Metadata Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/90 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-800/80 text-emerald-400 shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Session Status</span>
                <span className="font-bold text-slate-200 font-mono text-xs">{sessionInfo.status}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">{sessionInfo.protocol}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/90 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-800/80 text-cyan-400 shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Last Login Timestamp</span>
                <span className="font-bold text-cyan-400 font-mono text-xs">{sessionInfo.lastLogin}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Authenticated via Operator Portal</span>
              </div>
            </div>
          </div>

          {/* Change Password Form */}
          <div className="pt-3 border-t border-slate-800/80 space-y-3">
            <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2 uppercase tracking-wider font-mono">
              <Key className="w-4 h-4 text-amber-400" /> Change Password
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Current Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg px-3 py-2 text-slate-200 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">New Password</label>
                <input
                  type="password"
                  placeholder="Min 6 characters"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg px-3 py-2 text-slate-200 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="Re-enter new password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg px-3 py-2 text-slate-200 focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save Footer */}
        <div className="flex justify-end pt-2">
          <Button type="submit" variant="primary" size="lg" icon={Save}>
            Save Preferences
          </Button>
        </div>
      </form>
    </div>
  );
};
