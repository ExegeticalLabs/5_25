import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getUserWorkouts, getUserBlocks } from '../../services/firestoreService';
import { Workout, Block, LiftingWorkoutData } from '../../types';
import './Progress.css';

const ProgressPage: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!currentUser) return;
      const [workoutData, blockData] = await Promise.all([
        getUserWorkouts(currentUser.uid),
        getUserBlocks(currentUser.uid),
      ]);
      setWorkouts(workoutData);
      setBlocks(blockData);
      setLoading(false);
    };
    loadData();
  }, [currentUser]);

  const completed = workouts.filter(w => w.status === 'completed');
  const liftingWorkouts = completed.filter(w => w.workoutType === 'lifting_upper' || w.workoutType === 'lifting_lower');
  const cardioWorkouts = completed.filter(w => w.workoutType === 'cardio');
  const coreWorkouts = completed.filter(w => w.workoutType === 'core');

  // Total minutes
  const totalMinutes = completed.reduce((sum, w) => sum + (w.totalDurationMinutes || 0), 0);

  // Current block progress
  const currentBlock = blocks.find(b => b.blockId === currentUser?.currentBlockId);
  const blockWorkouts = currentBlock
    ? completed.filter(w => w.blockId === currentBlock.blockId)
    : [];
  const blockProgress = currentBlock ? Math.round((blockWorkouts.length / 36) * 100) : 0;

  // Exercise weights tracking from lifting workouts
  const exerciseWeights: { [exerciseName: string]: number[] } = {};
  liftingWorkouts.forEach(workout => {
    const data = workout.workoutData as LiftingWorkoutData;
    if (!data?.exercises) return;
    data.exercises.forEach(ex => {
      if (!exerciseWeights[ex.exerciseName]) {
        exerciseWeights[ex.exerciseName] = [];
      }
      if (ex.weightUsed > 0) {
        exerciseWeights[ex.exerciseName].push(ex.weightUsed);
      }
    });
  });

  return (
    <div className="screen progress-screen">
      <div className="screen-header">
        <button className="icon-btn" onClick={() => navigate('/')}>←</button>
        <h1 className="header-title">Progress</h1>
        <div style={{ width: 40 }} />
      </div>

      <div className="page-content">
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>Loading...</div>
        ) : (
          <>
            {/* Overall stats */}
            <div className="card">
              <p className="section-label">All Time</p>
              <div className="progress-stats-grid">
                <div className="progress-stat">
                  <p className="progress-stat-value">{completed.length}</p>
                  <p className="progress-stat-label">Workouts</p>
                </div>
                <div className="progress-stat">
                  <p className="progress-stat-value">{Math.round(totalMinutes / 60)}</p>
                  <p className="progress-stat-label">Hours</p>
                </div>
                <div className="progress-stat">
                  <p className="progress-stat-value">{blocks.length}</p>
                  <p className="progress-stat-label">Blocks</p>
                </div>
                <div className="progress-stat">
                  <p className="progress-stat-value">{liftingWorkouts.length}</p>
                  <p className="progress-stat-label">Lifting</p>
                </div>
              </div>
            </div>

            {/* Current block progress */}
            {currentBlock && (
              <div className="card">
                <p className="section-label">Block {currentBlock.blockNumber} Progress</p>
                <div className="block-progress-header">
                  <p className="block-progress-count">{blockWorkouts.length} / 36 workouts</p>
                  <p className="block-progress-pct">{blockProgress}%</p>
                </div>
                <div className="block-progress-bar">
                  <div className="block-progress-fill" style={{ width: `${blockProgress}%` }} />
                </div>

                <div className="block-type-breakdown">
                  <div className="block-type-item">
                    <span className="block-type-icon">💪</span>
                    <div className="block-type-bar-container">
                      <div className="block-type-bar" style={{ width: `${(blockWorkouts.filter(w => w.workoutType === 'lifting_upper' || w.workoutType === 'lifting_lower').length / 12) * 100}%`, background: 'var(--accent-primary)' }} />
                    </div>
                    <span className="block-type-count">{blockWorkouts.filter(w => w.workoutType === 'lifting_upper' || w.workoutType === 'lifting_lower').length}/12</span>
                  </div>
                  <div className="block-type-item">
                    <span className="block-type-icon">🏃</span>
                    <div className="block-type-bar-container">
                      <div className="block-type-bar" style={{ width: `${(blockWorkouts.filter(w => w.workoutType === 'cardio').length / 18) * 100}%`, background: 'var(--zone-b)' }} />
                    </div>
                    <span className="block-type-count">{blockWorkouts.filter(w => w.workoutType === 'cardio').length}/18</span>
                  </div>
                  <div className="block-type-item">
                    <span className="block-type-icon">🔥</span>
                    <div className="block-type-bar-container">
                      <div className="block-type-bar" style={{ width: `${(blockWorkouts.filter(w => w.workoutType === 'core').length / 18) * 100}%`, background: 'var(--zone-c)' }} />
                    </div>
                    <span className="block-type-count">{blockWorkouts.filter(w => w.workoutType === 'core').length}/18</span>
                  </div>
                </div>
              </div>
            )}

            {/* Exercise weight progression */}
            {Object.keys(exerciseWeights).length > 0 && (
              <div className="card">
                <p className="section-label">Weight Progression</p>
                <p className="progress-note">Showing max weight reached per exercise</p>
                <div className="weight-progress-list">
                  {Object.entries(exerciseWeights).map(([name, weights]) => {
                    const max = Math.max(...weights);
                    const first = weights[0];
                    const increase = max - first;
                    return (
                      <div key={name} className="weight-progress-item">
                        <div className="weight-ex-info">
                          <p className="weight-ex-name">{name}</p>
                          <p className="weight-ex-sessions">{weights.length} sessions</p>
                        </div>
                        <div className="weight-ex-stats">
                          <p className="weight-ex-max">{max} lbs</p>
                          {increase > 0 && (
                            <p className="weight-ex-increase">+{increase} lbs</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Cardio stats */}
            {cardioWorkouts.length > 0 && (
              <div className="card">
                <p className="section-label">Cardio</p>
                <div className="cardio-stats">
                  <div className="cardio-stat">
                    <p className="cardio-stat-value">{cardioWorkouts.length}</p>
                    <p className="cardio-stat-label">Sessions</p>
                  </div>
                  <div className="cardio-stat">
                    <p className="cardio-stat-value">{cardioWorkouts.length * 5}</p>
                    <p className="cardio-stat-label">Total Rounds</p>
                  </div>
                  <div className="cardio-stat">
                    <p className="cardio-stat-value">{cardioWorkouts.length * 25}</p>
                    <p className="cardio-stat-label">Minutes</p>
                  </div>
                </div>
              </div>
            )}

            {/* Core stats */}
            {coreWorkouts.length > 0 && (
              <div className="card">
                <p className="section-label">Core Finisher</p>
                <div className="cardio-stats">
                  <div className="cardio-stat">
                    <p className="cardio-stat-value">{coreWorkouts.length}</p>
                    <p className="cardio-stat-label">Sessions</p>
                  </div>
                  <div className="cardio-stat">
                    <p className="cardio-stat-value">
                      {coreWorkouts.reduce((sum, w) => {
                        const data = w.workoutData as any;
                        return sum + (data?.roundsCompleted || 0);
                      }, 0)}
                    </p>
                    <p className="cardio-stat-label">Total Rounds</p>
                  </div>
                  <div className="cardio-stat">
                    <p className="cardio-stat-value">{coreWorkouts.length * 10}</p>
                    <p className="cardio-stat-label">Minutes</p>
                  </div>
                </div>
              </div>
            )}

            {completed.length === 0 && (
              <div className="empty-state card">
                <p className="empty-icon">📈</p>
                <p className="empty-title">No data yet</p>
                <p className="empty-desc">Complete your first workout to start seeing progress stats.</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Bottom Nav */}
      <div className="bottom-nav">
        <button className="nav-btn" onClick={() => navigate('/')}>
          <span className="nav-icon">🏠</span><span className="nav-label">Home</span>
        </button>
        <button className="nav-btn" onClick={() => navigate('/history')}>
          <span className="nav-icon">📋</span><span className="nav-label">History</span>
        </button>
        <button className="nav-btn active" onClick={() => navigate('/progress')}>
          <span className="nav-icon">📈</span><span className="nav-label">Progress</span>
        </button>
        <button className="nav-btn" onClick={() => navigate('/settings')}>
          <span className="nav-icon">⚙️</span><span className="nav-label">Settings</span>
        </button>
      </div>
    </div>
  );
};

export default ProgressPage;
