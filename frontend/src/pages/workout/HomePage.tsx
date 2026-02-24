import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getBlock, getBlockWorkouts } from '../../services/firestoreService';
import { Block, Workout, WorkoutType } from '../../types';
import { getTodaysWorkoutType, getWorkoutTypeLabel, WEEK_SCHEDULES } from '../../utils/schedule';
import './Home.css';

const WorkoutTypeIcon: React.FC<{ type: WorkoutType }> = ({ type }) => {
  const icons = {
    lifting_upper: '💪',
    lifting_lower: '🦵',
    cardio: '🏃',
    core: '🔥',
    rest: '😴',
  };
  return <span>{icons[type]}</span>;
};

const formatDate = (dateStr: string): string => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};

const getWeekNumber = (blockStartDate: Date, today: Date = new Date()): number => {
  const msPerDay = 24 * 60 * 60 * 1000;
  const daysSinceStart = Math.floor((today.getTime() - blockStartDate.getTime()) / msPerDay);
  return Math.min(Math.floor(daysSinceStart / 7) + 1, 6);
};

const HomePage: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [block, setBlock] = useState<Block | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [todayWorkoutType, setTodayWorkoutType] = useState<WorkoutType>('rest');
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!currentUser?.currentBlockId) return;
    try {
      const [blockData, workoutData] = await Promise.all([
        getBlock(currentUser.currentBlockId),
        getBlockWorkouts(currentUser.uid, currentUser.currentBlockId),
      ]);
      setBlock(blockData);
      setWorkouts(workoutData);
      if (blockData) {
        const startDate = new Date(blockData.startDate);
        setTodayWorkoutType(getTodaysWorkoutType(startDate));
      }
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser && !currentUser.currentBlockId) {
      navigate('/setup');
      return;
    }
    loadData();
  }, [currentUser, loadData, navigate]);

  const handleStartWorkout = () => {
    if (todayWorkoutType === 'rest') return;
    if (todayWorkoutType === 'lifting_upper') navigate('/workout/lifting/upper');
    else if (todayWorkoutType === 'lifting_lower') navigate('/workout/lifting/lower');
    else if (todayWorkoutType === 'cardio') navigate('/workout/cardio');
    else if (todayWorkoutType === 'core') navigate('/workout/core');
  };

  const today = new Date();
  const weekNumber = block ? getWeekNumber(new Date(block.startDate)) : 1;
  const weekType = block ? (weekNumber % 2 === 1 ? 'week_a' : 'week_b') : 'week_a';
  const schedule = WEEK_SCHEDULES[weekType];

  const completedToday = workouts.some(w => {
    const wDate = new Date(w.workoutDate);
    return wDate.toDateString() === today.toDateString() && w.status === 'completed';
  });

  const totalCompleted = workouts.filter(w => w.status === 'completed').length;
  const totalLifting = workouts.filter(w => w.status === 'completed' && (w.workoutType === 'lifting_upper' || w.workoutType === 'lifting_lower')).length;
  const totalCardio = workouts.filter(w => w.status === 'completed' && w.workoutType === 'cardio').length;

  if (loading) {
    return (
      <div className="screen home-screen">
        <div className="home-loading">
          <div className="spinner" style={{ borderTopColor: 'var(--accent-primary)', borderColor: 'var(--border-color)' }} />
          <p>Loading your workouts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="screen home-screen">
      {/* Header */}
      <div className="home-header">
        <div>
          <p className="home-greeting">Good {getTimeOfDay()}, {currentUser?.name?.split(' ')[0]}</p>
          <p className="home-date">{today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
        <button className="icon-btn settings-btn" onClick={() => navigate('/settings')}>⚙️</button>
      </div>

      <div className="page-content home-content">
        {/* Hero Start Workout Card */}
        <div className="hero-card card">
          <div className="hero-card-top">
            <div>
              <p className="section-label">Today's Workout</p>
              <h2 className="hero-workout-title">{getWorkoutTypeLabel(todayWorkoutType)}</h2>
              {block && <p className="hero-block-info">Block {block.blockNumber} · Week {weekNumber} of 6</p>}
            </div>
            <div className="hero-icon">
              <WorkoutTypeIcon type={todayWorkoutType} />
            </div>
          </div>

          {todayWorkoutType === 'rest' ? (
            <div className="rest-day-msg">
              <p>Today is your rest day. Recovery is part of the program. Come back tomorrow!</p>
            </div>
          ) : completedToday ? (
            <div className="completed-msg">
              <span className="completed-check">✅</span>
              <p>Workout complete! Great work today.</p>
            </div>
          ) : (
            <button className="btn-primary hero-btn" onClick={handleStartWorkout}>
              START WORKOUT
            </button>
          )}
        </div>

        {/* Weekly Calendar */}
        <div className="card">
          <p className="section-label">This Week — Week {weekNumber} ({weekType === 'week_a' ? 'A' : 'B'})</p>
          <div className="week-calendar">
            {schedule.days.map((day) => {
              const dayDate = getDayDate(today, day.dayNumber);
              const isToday = dayDate.toDateString() === today.toDateString();
              const isPast = dayDate < today && !isToday;
              const workoutOnDay = workouts.find(w => {
                const wDate = new Date(w.workoutDate);
                return wDate.toDateString() === dayDate.toDateString();
              });
              const isCompleted = workoutOnDay?.status === 'completed';
              const isMissed = isPast && !isCompleted && day.workoutType !== 'rest';

              return (
                <div key={day.dayNumber} className={`cal-day ${isToday ? 'today' : ''}`}>
                  <p className="cal-day-name">{day.dayName.slice(0, 3)}</p>
                  <div className={`cal-day-circle ${isCompleted ? 'done' : isMissed ? 'missed' : isToday ? 'current' : ''}`}>
                    {day.workoutType === 'rest' ? '—' :
                      isCompleted ? '✓' :
                      isMissed ? '✗' :
                      <WorkoutTypeIcon type={day.workoutType} />
                    }
                  </div>
                  <p className="cal-day-type">{getShortWorkoutLabel(day.workoutType)}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats Card */}
        <div className="card stats-card">
          <p className="section-label">Block {block?.blockNumber || 1} Progress</p>
          <div className="stats-row">
            <div className="stat-item">
              <p className="stat-value">{totalCompleted}</p>
              <p className="stat-label">Workouts</p>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <p className="stat-value">{totalLifting}</p>
              <p className="stat-label">Lifting</p>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <p className="stat-value">{totalCardio}</p>
              <p className="stat-label">Cardio</p>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <p className="stat-value">{weekNumber}</p>
              <p className="stat-label">Week</p>
            </div>
          </div>
        </div>

        {/* Recent Workouts */}
        {workouts.length > 0 && (
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p className="section-label">Recent Workouts</p>
              <button
                onClick={() => navigate('/history')}
                style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontSize: '13px', fontWeight: 600 }}
              >
                View All →
              </button>
            </div>
            {workouts.slice(0, 3).map(workout => (
              <div key={workout.workoutId} className="recent-workout-item">
                <div className="recent-workout-icon">
                  <WorkoutTypeIcon type={workout.workoutType} />
                </div>
                <div className="recent-workout-info">
                  <p className="recent-workout-name">{getWorkoutTypeLabel(workout.workoutType)}</p>
                  <p className="recent-workout-date">{formatDate(workout.workoutDate)}</p>
                </div>
                <div className={`recent-workout-status ${workout.status}`}>
                  {workout.status === 'completed' ? '✓' : workout.status === 'in_progress' ? '...' : '✗'}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Block info */}
        {block && (
          <div className="card block-info-card">
            <p className="section-label">Your Exercises</p>
            <div className="block-exercises">
              <p className="block-exercise-type">Upper Day</p>
              <p className="block-exercise-note">Chest · Back · Shoulders · Biceps · Triceps</p>
            </div>
            <div className="divider" />
            <div className="block-exercises">
              <p className="block-exercise-type">Lower Day</p>
              <p className="block-exercise-note">Quads × 2 · Hamstrings · Glutes · Calves</p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div className="bottom-nav">
        <button className="nav-btn active" onClick={() => navigate('/')}>
          <span className="nav-icon">🏠</span>
          <span className="nav-label">Home</span>
        </button>
        <button className="nav-btn" onClick={() => navigate('/history')}>
          <span className="nav-icon">📋</span>
          <span className="nav-label">History</span>
        </button>
        <button className="nav-btn" onClick={() => navigate('/progress')}>
          <span className="nav-icon">📈</span>
          <span className="nav-label">Progress</span>
        </button>
        <button className="nav-btn" onClick={() => navigate('/settings')}>
          <span className="nav-icon">⚙️</span>
          <span className="nav-label">Settings</span>
        </button>
      </div>
    </div>
  );
};

const getTimeOfDay = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
};

const getDayDate = (today: Date, dayNumber: number): Date => {
  // dayNumber: 1=Monday, 7=Sunday
  const todayDay = today.getDay() === 0 ? 7 : today.getDay(); // 1-7
  const diff = dayNumber - todayDay;
  const date = new Date(today);
  date.setDate(today.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
};

const getShortWorkoutLabel = (type: WorkoutType): string => {
  const labels: { [key in WorkoutType]: string } = {
    lifting_upper: 'Upper',
    lifting_lower: 'Lower',
    cardio: 'Cardio',
    core: 'Core',
    rest: 'Rest',
  };
  return labels[type];
};

export default HomePage;
