import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getBlock, createWorkout, updateWorkout } from '../../services/firestoreService';
import { getExerciseById } from '../../utils/exerciseLibrary';
import { Block, CoreWorkoutData } from '../../types';
import { formatTime } from '../../utils/schedule';
import './LiveCore.css';

const AMRAP_DURATION = 600; // 10 minutes in seconds
type WorkoutStatus = 'not_started' | 'active' | 'completed' | 'paused';

const CORE_EXERCISE_DETAILS: { [key: string]: { reps?: string; duration?: string } } = {
  'ex_core_01': { reps: '10 reps per side (20 total)' },
  'ex_core_02': { duration: '30 seconds' },
  'ex_core_03': { reps: '10 reps per side (20 total)' },
  'ex_core_04': { duration: '20 seconds per side (40 sec total)' },
  'ex_core_05': { reps: '15 reps' },
  'ex_core_06': { duration: '30 seconds' },
  'ex_core_07': { duration: '30 seconds' },
  'ex_core_08': { reps: '10 taps per side (20 total)' },
  'ex_core_09': { reps: '12 reps (controlled)' },
  'ex_core_10': { duration: '30 seconds' },
  'ex_core_11': { reps: '10 reps' },
  'ex_core_12': { reps: '10 reps per side' },
};

const LiveCorePage: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [block, setBlock] = useState<Block | null>(null);
  const [workoutId, setWorkoutId] = useState<string | null>(null);
  const [status, setStatus] = useState<WorkoutStatus>('not_started');
  const [roundsCompleted, setRoundsCompleted] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(AMRAP_DURATION);
  const [loading, setLoading] = useState(true);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [notes, setNotes] = useState('');
  const [lastTap, setLastTap] = useState<number>(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    const loadBlock = async () => {
      if (!currentUser?.currentBlockId) return;
      const blockData = await getBlock(currentUser.currentBlockId);
      if (!blockData) return;
      setBlock(blockData);

      const wId = await createWorkout({
        userId: currentUser.uid,
        blockId: currentUser.currentBlockId,
        workoutDate: new Date().toISOString(),
        workoutType: 'core',
        status: 'in_progress',
      });
      setWorkoutId(wId);
      setLoading(false);
    };
    loadBlock();
  }, [currentUser]);

  useEffect(() => {
    if (status !== 'active') {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleTimerEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [status]); // eslint-disable-line

  const handleTimerEnd = () => {
    setStatus('completed');
    setShowCompleteModal(true);
    saveWorkout();
  };

  const saveWorkout = async () => {
    if (!workoutId || !block) return;
    const data: CoreWorkoutData = {
      coreComboNumber: block.core.comboNumber,
      exercises: block.core.exercises,
      roundsCompleted,
      notes,
    };
    await updateWorkout(workoutId, {
      status: 'completed',
      totalDurationMinutes: 10,
      workoutData: data as any,
    });
  };

  const handleStart = () => {
    setStatus('active');
    startTimeRef.current = Date.now();
  };

  const handleLogRound = () => {
    // Debounce: max 1 tap per 2 seconds
    const now = Date.now();
    if (now - lastTap < 2000) return;
    setLastTap(now);

    if (status === 'active') {
      setRoundsCompleted(prev => prev + 1);
    }
  };

  const handlePause = () => {
    setStatus('paused');
    setShowPauseModal(true);
  };

  const handleResume = () => {
    setStatus('active');
    setShowPauseModal(false);
  };

  const handleAbandon = async () => {
    if (workoutId) await updateWorkout(workoutId, { status: 'abandoned' });
    navigate('/');
  };

  const handleSaveAndReturn = async () => {
    await saveWorkout();
    navigate('/');
  };

  const borderOpacity = timeRemaining / AMRAP_DURATION;
  const coreExercises = block?.core.exercises || [];
  const comboNumber = block?.core.comboNumber || 1;

  if (loading) {
    return (
      <div className="screen core-screen">
        <div className="loading-center">
          <div className="spinner" style={{ width: 40, height: 40, borderTopColor: 'var(--accent-primary)', borderColor: 'var(--border-color)' }} />
          <p>Loading core workout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="screen core-screen">
      {/* Border fade */}
      {status === 'active' && (
        <div
          className="core-border"
          style={{ opacity: 0.2 + borderOpacity * 0.6 }}
        />
      )}

      {/* Header */}
      <div className="core-header">
        <button className="icon-btn" onClick={() => {
          if (status === 'active') handlePause();
          else navigate('/');
        }}>←</button>
        <div className="core-header-center">
          <p className="core-title">Core Finisher</p>
          <p className="core-subtitle">10-Minute AMRAP</p>
        </div>
        {status === 'active' && (
          <p className="core-timer-small">{formatTime(timeRemaining)}</p>
        )}
        {status !== 'active' && <div style={{ width: 50 }} />}
      </div>

      {/* Exercise list (always visible) */}
      <div className="core-exercise-list">
        <p className="section-label" style={{ padding: '0 var(--space-4)' }}>Combo {comboNumber} — One Round</p>
        {coreExercises.map((exId, i) => {
          const ex = getExerciseById(exId);
          const details = CORE_EXERCISE_DETAILS[exId];
          return (
            <div key={exId} className="core-exercise-item">
              <div className="core-ex-num">{i + 1}</div>
              <div className="core-ex-info">
                <p className="core-ex-name">{ex?.exerciseName || 'Exercise'}</p>
                {details && (
                  <p className="core-ex-detail">{details.reps || details.duration}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="divider" style={{ margin: '0 var(--space-4)' }} />

      {/* Main interaction area */}
      <div className="core-main">
        {status === 'not_started' && (
          <div className="core-start">
            <p className="core-start-instruction">
              Complete as many quality rounds as possible in 10 minutes. Quality over speed.
            </p>
            <button className="btn-primary core-start-btn" onClick={handleStart}>
              START CORE FINISHER
            </button>
          </div>
        )}

        {(status === 'active' || status === 'paused') && (
          <div className="core-active">
            {/* Big round button */}
            <div className="round-btn-area">
              <button
                className={`round-log-btn ${status === 'paused' ? 'paused' : ''}`}
                onClick={handleLogRound}
                disabled={status !== 'active'}
              >
                <span className="round-count">{roundsCompleted}</span>
                <span className="round-btn-label">
                  {roundsCompleted === 0 ? 'TAP AFTER\nEACH ROUND' : 'ROUNDS\nCOMPLETED'}
                </span>
              </button>
            </div>

            {/* Timer */}
            <div className="core-timer-display">
              <p className="core-timer-value">{formatTime(timeRemaining)}</p>
              <p className="core-timer-label">remaining</p>
            </div>

            {/* Timer bar */}
            <div className="core-timer-bar">
              <div
                className="core-timer-bar-fill"
                style={{ width: `${(timeRemaining / AMRAP_DURATION) * 100}%` }}
              />
            </div>

            <button className="btn-secondary" onClick={handlePause} style={{ width: 'auto', padding: '10px 24px', alignSelf: 'center' }}>
              Pause
            </button>
          </div>
        )}
      </div>

      {/* Pause Modal */}
      {showPauseModal && (
        <div className="modal-overlay" onClick={() => setShowPauseModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 className="modal-title">Pause Core Finisher?</h3>
            <p className="modal-body">Rounds completed so far: {roundsCompleted}</p>
            <div className="modal-btns">
              <button className="btn-primary" onClick={handleResume}>RESUME</button>
              <button className="btn-secondary" onClick={() => { setShowPauseModal(false); handleSaveAndReturn(); }}>Save & Return Home</button>
              <button className="btn-danger" onClick={() => { setShowPauseModal(false); handleAbandon(); }}>Abandon</button>
            </div>
          </div>
        </div>
      )}

      {/* Complete Modal */}
      {showCompleteModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🔥</div>
            <h3 className="modal-title">Core Finisher Done!</h3>
            <p className="modal-body">10 minutes complete</p>

            <div className="core-complete-stat card" style={{ margin: '16px 0' }}>
              <p style={{ fontSize: 64, fontWeight: 700, color: 'var(--accent-primary)', lineHeight: 1 }}>
                {roundsCompleted}
              </p>
              <p style={{ fontSize: 16, color: 'var(--text-secondary)', marginTop: 4 }}>rounds completed</p>
            </div>

            <div style={{ textAlign: 'left', marginBottom: 16 }}>
              <label className="form-label" style={{ display: 'block', marginBottom: 6 }}>Notes (optional)</label>
              <textarea
                className="text-input"
                placeholder="How did it feel? Form notes..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={2}
                style={{ resize: 'none' }}
              />
            </div>

            <div className="modal-btns">
              <button className="btn-primary" onClick={handleSaveAndReturn}>RETURN HOME</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveCorePage;
