import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getUserWorkouts } from '../../services/firestoreService';
import { Workout, WorkoutType } from '../../types';
import './History.css';

const WorkoutTypeIcon: React.FC<{ type: WorkoutType }> = ({ type }) => {
  const icons = { lifting_upper: '💪', lifting_lower: '🦵', cardio: '🏃', core: '🔥', rest: '😴' };
  return <span>{icons[type]}</span>;
};

const getWorkoutLabel = (type: WorkoutType): string => {
  const labels: { [key in WorkoutType]: string } = {
    lifting_upper: 'Upper Body Lifting',
    lifting_lower: 'Lower Body Lifting',
    cardio: 'Cardio',
    core: 'Core Finisher',
    rest: 'Rest',
  };
  return labels[type];
};

const formatDate = (dateStr: string): string => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
};

const HistoryPage: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<WorkoutType | 'all'>('all');

  useEffect(() => {
    const loadWorkouts = async () => {
      if (!currentUser) return;
      const data = await getUserWorkouts(currentUser.uid);
      setWorkouts(data);
      setLoading(false);
    };
    loadWorkouts();
  }, [currentUser]);

  const filtered = filter === 'all' ? workouts : workouts.filter(w => w.workoutType === filter);
  const completed = workouts.filter(w => w.status === 'completed');

  return (
    <div className="screen history-screen">
      <div className="screen-header">
        <button className="icon-btn" onClick={() => navigate('/')}>←</button>
        <h1 className="header-title">Workout History</h1>
        <div style={{ width: 40 }} />
      </div>

      <div className="page-content">
        {/* Quick stats */}
        <div className="card history-stats">
          <div className="history-stat">
            <p className="history-stat-value">{completed.length}</p>
            <p className="history-stat-label">Total Workouts</p>
          </div>
          <div className="history-stat">
            <p className="history-stat-value">{completed.filter(w => w.workoutType === 'lifting_upper' || w.workoutType === 'lifting_lower').length}</p>
            <p className="history-stat-label">Lifting</p>
          </div>
          <div className="history-stat">
            <p className="history-stat-value">{completed.filter(w => w.workoutType === 'cardio').length}</p>
            <p className="history-stat-label">Cardio</p>
          </div>
          <div className="history-stat">
            <p className="history-stat-value">{completed.filter(w => w.workoutType === 'core').length}</p>
            <p className="history-stat-label">Core</p>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="history-filters">
          {(['all', 'lifting_upper', 'lifting_lower', 'cardio', 'core'] as const).map(f => (
            <button
              key={f}
              className={`filter-tab ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'All' :
               f === 'lifting_upper' ? 'Upper' :
               f === 'lifting_lower' ? 'Lower' :
               f === 'cardio' ? 'Cardio' : 'Core'}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state card">
            <p className="empty-icon">📋</p>
            <p className="empty-title">No workouts yet</p>
            <p className="empty-desc">Complete your first workout to see your history here.</p>
          </div>
        ) : (
          <div className="workout-list">
            {filtered.map(workout => (
              <div key={workout.workoutId} className="workout-history-item card">
                <div className="workout-history-icon">
                  <WorkoutTypeIcon type={workout.workoutType} />
                </div>
                <div className="workout-history-info">
                  <p className="workout-history-name">{getWorkoutLabel(workout.workoutType)}</p>
                  <p className="workout-history-date">{formatDate(workout.workoutDate)}</p>
                  {workout.totalDurationMinutes && (
                    <p className="workout-history-duration">{workout.totalDurationMinutes} min</p>
                  )}
                  {workout.userNotes && (
                    <p className="workout-history-notes">"{workout.userNotes}"</p>
                  )}
                </div>
                <div className={`workout-status-badge ${workout.status}`}>
                  {workout.status === 'completed' ? '✓' : workout.status === 'in_progress' ? '…' : '✗'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div className="bottom-nav">
        <button className="nav-btn" onClick={() => navigate('/')}>
          <span className="nav-icon">🏠</span><span className="nav-label">Home</span>
        </button>
        <button className="nav-btn active" onClick={() => navigate('/history')}>
          <span className="nav-icon">📋</span><span className="nav-label">History</span>
        </button>
        <button className="nav-btn" onClick={() => navigate('/progress')}>
          <span className="nav-icon">📈</span><span className="nav-label">Progress</span>
        </button>
        <button className="nav-btn" onClick={() => navigate('/settings')}>
          <span className="nav-icon">⚙️</span><span className="nav-label">Settings</span>
        </button>
      </div>
    </div>
  );
};

export default HistoryPage;
