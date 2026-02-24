import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { updateUserPreferences } from '../../services/firestoreService';
import './Settings.css';

const SettingsPage: React.FC = () => {
  const { currentUser, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [darkMode, setDarkMode] = useState(currentUser?.preferences?.darkMode || false);
  const [audioCues, setAudioCues] = useState(currentUser?.preferences?.audioCuesEnabled ?? true);
  const [notifications, setNotifications] = useState(currentUser?.preferences?.notificationsEnabled ?? true);
  const [cardioUnit, setCardioUnit] = useState<'mph' | 'km/h'>(currentUser?.preferences?.cardioUnit || 'mph');

  const handleToggle = async (setting: string, value: boolean | string) => {
    if (!currentUser) return;
    setSaving(true);
    try {
      const update: any = {};
      update[setting] = value;
      await updateUserPreferences(currentUser.uid, update);

      if (setting === 'darkMode') {
        setDarkMode(value as boolean);
        document.documentElement.setAttribute('data-theme', value ? 'dark' : 'light');
      } else if (setting === 'audioCuesEnabled') {
        setAudioCues(value as boolean);
      } else if (setting === 'notificationsEnabled') {
        setNotifications(value as boolean);
      } else if (setting === 'cardioUnit') {
        setCardioUnit(value as 'mph' | 'km/h');
      }

      await refreshUser();
    } catch (err) {
      console.error('Failed to save preference:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="screen settings-screen">
      <div className="screen-header">
        <button className="icon-btn" onClick={() => navigate('/')}>←</button>
        <h1 className="header-title">Settings</h1>
        <div style={{ width: 40 }} />
      </div>

      <div className="page-content">
        {/* Profile */}
        <div className="card settings-section">
          <p className="section-label">Account</p>
          <div className="settings-profile">
            <div className="profile-avatar">
              {currentUser?.name?.charAt(0).toUpperCase() || '?'}
            </div>
            <div>
              <p className="profile-name">{currentUser?.name || 'User'}</p>
              <p className="profile-email">{currentUser?.email}</p>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="card settings-section">
          <p className="section-label">Appearance</p>
          <SettingToggle
            label="Dark Mode"
            description="Easier on eyes in low light"
            value={darkMode}
            onChange={val => handleToggle('darkMode', val)}
            disabled={saving}
          />
        </div>

        {/* Workout Preferences */}
        <div className="card settings-section">
          <p className="section-label">Workout</p>
          <SettingToggle
            label="Audio Cues"
            description="Beeps and chimes during workouts"
            value={audioCues}
            onChange={val => handleToggle('audioCuesEnabled', val)}
            disabled={saving}
          />
          <div className="divider" style={{ margin: '0' }} />
          <SettingToggle
            label="Notifications"
            description="Workout reminders"
            value={notifications}
            onChange={val => handleToggle('notificationsEnabled', val)}
            disabled={saving}
          />
          <div className="divider" style={{ margin: '0' }} />
          <div className="setting-row">
            <div className="setting-info">
              <p className="setting-label">Cardio Speed Unit</p>
              <p className="setting-desc">For tracking cardio pace</p>
            </div>
            <div className="unit-toggle">
              <button
                className={`unit-btn ${cardioUnit === 'mph' ? 'active' : ''}`}
                onClick={() => handleToggle('cardioUnit', 'mph')}
                disabled={saving}
              >mph</button>
              <button
                className={`unit-btn ${cardioUnit === 'km/h' ? 'active' : ''}`}
                onClick={() => handleToggle('cardioUnit', 'km/h')}
                disabled={saving}
              >km/h</button>
            </div>
          </div>
        </div>

        {/* Program Info */}
        <div className="card settings-section">
          <p className="section-label">About 5/25</p>
          <div className="info-row">
            <p className="info-label">Program</p>
            <p className="info-value">5/25 Fitness Method</p>
          </div>
          <div className="divider" style={{ margin: '0' }} />
          <div className="info-row">
            <p className="info-label">Block Duration</p>
            <p className="info-value">6 weeks / 36 workouts</p>
          </div>
          <div className="divider" style={{ margin: '0' }} />
          <div className="info-row">
            <p className="info-label">Lifting Format</p>
            <p className="info-value">5 exercises × 5 cycles × 10 reps</p>
          </div>
          <div className="divider" style={{ margin: '0' }} />
          <div className="info-row">
            <p className="info-label">Cardio Format</p>
            <p className="info-value">5 rounds × 5 min (A→B→C)</p>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="card settings-section">
          <p className="section-label">The Rules</p>
          <div className="rule-item">
            <span className="rule-icon">📉</span>
            <div>
              <p className="rule-title">Fail Cycle 2-3</p>
              <p className="rule-desc">Drop weight immediately</p>
            </div>
          </div>
          <div className="divider" style={{ margin: '0' }} />
          <div className="rule-item">
            <span className="rule-icon">✅</span>
            <div>
              <p className="rule-title">Fail Cycle 4-5</p>
              <p className="rule-desc">Keep same weight — it's right</p>
            </div>
          </div>
          <div className="divider" style={{ margin: '0' }} />
          <div className="rule-item">
            <span className="rule-icon">📈</span>
            <div>
              <p className="rule-title">Perfect 5 Cycles</p>
              <p className="rule-desc">Increase if easy, keep if challenging</p>
            </div>
          </div>
          <div className="divider" style={{ margin: '0' }} />
          <div className="rule-item">
            <span className="rule-icon">⏱️</span>
            <div>
              <p className="rule-title">Tempo</p>
              <p className="rule-desc">Strict 2 sec up · 2 sec down</p>
            </div>
          </div>
        </div>

        {/* Logout */}
        <button className="btn-danger" onClick={handleLogout} style={{ marginTop: 8 }}>
          Log Out
        </button>
      </div>

      {/* Bottom Nav */}
      <div className="bottom-nav">
        <button className="nav-btn" onClick={() => navigate('/')}>
          <span className="nav-icon">🏠</span><span className="nav-label">Home</span>
        </button>
        <button className="nav-btn" onClick={() => navigate('/history')}>
          <span className="nav-icon">📋</span><span className="nav-label">History</span>
        </button>
        <button className="nav-btn" onClick={() => navigate('/progress')}>
          <span className="nav-icon">📈</span><span className="nav-label">Progress</span>
        </button>
        <button className="nav-btn active" onClick={() => navigate('/settings')}>
          <span className="nav-icon">⚙️</span><span className="nav-label">Settings</span>
        </button>
      </div>
    </div>
  );
};

interface SettingToggleProps {
  label: string;
  description: string;
  value: boolean;
  onChange: (val: boolean) => void;
  disabled?: boolean;
}

const SettingToggle: React.FC<SettingToggleProps> = ({ label, description, value, onChange, disabled }) => (
  <div className="setting-row">
    <div className="setting-info">
      <p className="setting-label">{label}</p>
      <p className="setting-desc">{description}</p>
    </div>
    <button
      className={`toggle-switch ${value ? 'on' : 'off'}`}
      onClick={() => onChange(!value)}
      disabled={disabled}
      role="switch"
      aria-checked={value}
    >
      <div className="toggle-thumb" />
    </button>
  </div>
);

export default SettingsPage;
