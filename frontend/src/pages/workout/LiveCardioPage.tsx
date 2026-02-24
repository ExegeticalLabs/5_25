import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getBlock, createWorkout, updateWorkout } from '../../services/firestoreService';
import { Block, CardioRound, CardioWorkoutData } from '../../types';
import { formatTime } from '../../utils/schedule';
import './LiveCardio.css';

type Zone = 'A' | 'B' | 'C';
type WorkoutStatus = 'not_started' | 'active' | 'completed' | 'paused';

const ZONE_DURATIONS: { [key in Zone]: number } = {
  A: 120, // 2 minutes
  B: 120, // 2 minutes
  C: 60,  // 1 minute
};

const ZONE_ORDER: Zone[] = ['A', 'B', 'C'];
const TOTAL_ROUNDS = 5;

const ZONE_LABELS: { [key in Zone]: string } = {
  A: 'ZONE A',
  B: 'ZONE B',
  C: 'ZONE C',
};

const ZONE_TALK_TEST: { [key in Zone]: string } = {
  A: 'Normal conversation',
  B: 'Complete sentences, can\'t sing',
  C: 'Hard to say a whole sentence',
};

const LiveCardioPage: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [block, setBlock] = useState<Block | null>(null);
  const [workoutId, setWorkoutId] = useState<string | null>(null);
  const [status, setStatus] = useState<WorkoutStatus>('not_started');
  const [currentRound, setCurrentRound] = useState(1);
  const [currentZoneIndex, setCurrentZoneIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(ZONE_DURATIONS['A']);
  const [rounds] = useState<CardioRound[]>([]);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const [borderOpacity, setBorderOpacity] = useState(1);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef(Date.now());

  const currentZone = ZONE_ORDER[currentZoneIndex];
  const zoneDuration = ZONE_DURATIONS[currentZone];

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
        workoutType: 'cardio',
        status: 'in_progress',
      });
      setWorkoutId(wId);
      setLoading(false);
    };
    loadBlock();
  }, [currentUser]);

  const advanceZone = useCallback(() => {
    const nextZoneIndex = (currentZoneIndex + 1) % 3;
    const completingRound = currentZoneIndex === 2; // just finished Zone C

    if (completingRound) {
      if (currentRound >= TOTAL_ROUNDS) {
        // Workout complete
        finishWorkout();
        return;
      }
      setCurrentRound(prev => prev + 1);
      setCurrentZoneIndex(0);
      setTimeRemaining(ZONE_DURATIONS['A']);
    } else {
      setCurrentZoneIndex(nextZoneIndex);
      setTimeRemaining(ZONE_DURATIONS[ZONE_ORDER[nextZoneIndex]]);
    }
  }, [currentRound, currentZoneIndex]); // eslint-disable-line

  useEffect(() => {
    if (status !== 'active') {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          advanceZone();
          return 0;
        }
        const newTime = prev - 1;
        setBorderOpacity(newTime / zoneDuration);
        return newTime;
      });
    }, 1000);

    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [status, advanceZone, zoneDuration]);

  const handleStart = () => {
    setStatus('active');
    startTimeRef.current = Date.now();
    setBorderOpacity(1);
    setTimeRemaining(ZONE_DURATIONS['A']);
  };

  const handlePause = () => {
    setStatus('paused');
    setShowPauseModal(true);
  };

  const handleResume = () => {
    setStatus('active');
    setShowPauseModal(false);
  };

  const finishWorkout = async () => {
    setStatus('completed');
    setShowCompleteModal(true);
    const duration = Math.round((Date.now() - startTimeRef.current) / 60000);
    if (workoutId) {
      const data: CardioWorkoutData = {
        cardioType: block?.cardio.cardioType || 'running',
        totalDistance: undefined,
        roundsCompleted: rounds,
        notesOverall: notes,
      };
      await updateWorkout(workoutId, {
        status: 'completed',
        totalDurationMinutes: duration,
        workoutData: data as any,
      });
    }
  };

  const handleAbandon = async () => {
    if (workoutId) await updateWorkout(workoutId, { status: 'abandoned' });
    navigate('/');
  };

  const handleSaveAndGoCore = async () => {
    if (workoutId) {
      await updateWorkout(workoutId, { userNotes: notes });
    }
    navigate('/workout/core');
  };

  const handleSaveAndGoHome = async () => {
    if (workoutId) {
      await updateWorkout(workoutId, { userNotes: notes });
    }
    navigate('/');
  };

  const zoneColor = {
    A: 'var(--zone-a)',
    B: 'var(--zone-b)',
    C: 'var(--zone-c)',
  }[currentZone];

  const zoneProgress = 1 - (timeRemaining / zoneDuration);

  if (loading) {
    return (
      <div className="screen cardio-screen">
        <div className="loading-center">
          <div className="spinner" style={{ width: 40, height: 40, borderTopColor: 'var(--accent-primary)', borderColor: 'var(--border-color)' }} />
          <p>Loading workout...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="screen cardio-screen"
      style={{
        '--zone-color': zoneColor,
        borderColor: status === 'active' ? zoneColor : 'transparent',
        borderWidth: 4,
        borderStyle: 'solid',
        borderOpacity: borderOpacity,
      } as React.CSSProperties}
    >
      {/* Zone border fade effect */}
      {status === 'active' && (
        <div
          className="zone-border"
          style={{
            borderColor: zoneColor,
            opacity: 0.3 + (borderOpacity * 0.7),
          }}
        />
      )}

      {/* Header */}
      <div className="cardio-header">
        <button className="icon-btn" onClick={() => {
          if (status === 'active') handlePause();
          else navigate('/');
        }}>←</button>
        <div className="cardio-header-center">
          <p className="cardio-title">
            {block?.cardio.cardioType?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Cardio'}
          </p>
          {status === 'active' && <p className="cardio-round-label">Round {currentRound} of {TOTAL_ROUNDS}</p>}
        </div>
        <div style={{ width: 40 }} />
      </div>

      {/* Zone Bars */}
      {status === 'active' && (
        <div className="zone-bars">
          {ZONE_ORDER.map((zone, i) => {
            const isActive = zone === currentZone;
            const isPast = i < currentZoneIndex;
            const barColor = { A: 'var(--zone-a)', B: 'var(--zone-b)', C: 'var(--zone-c)' }[zone];

            return (
              <div
                key={zone}
                className={`zone-bar ${isActive ? 'active' : ''} ${isPast ? 'past' : ''}`}
                style={{ '--bar-color': barColor } as React.CSSProperties}
              >
                <div className="zone-bar-label">
                  <span className="zone-bar-name">{ZONE_LABELS[zone]}</span>
                  <span className="zone-bar-duration">
                    {zone === 'A' ? '2:00' : zone === 'B' ? '2:00' : '1:00'}
                  </span>
                </div>
                {isActive && (
                  <div
                    className="zone-bar-fill"
                    style={{
                      width: `${zoneProgress * 100}%`,
                      background: barColor,
                    }}
                  />
                )}
                {isPast && (
                  <div className="zone-bar-fill" style={{ width: '100%', background: barColor, opacity: 0.4 }} />
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="cardio-main">
        {status === 'not_started' && (
          <div className="cardio-start">
            <div className="cardio-start-info">
              <h2>5/25 Cardio</h2>
              <p>5 rounds × 5 minutes</p>
            </div>

            <div className="round-structure card">
              <p className="section-label">Each Round (5 min)</p>
              <div className="round-structure-zones">
                <div className="zone-info-row">
                  <div className="zone-dot zone-a-dot" />
                  <div>
                    <p className="zone-info-label">Zone A — 2:00</p>
                    <p className="zone-info-desc">Normal conversation</p>
                  </div>
                </div>
                <div className="zone-info-row">
                  <div className="zone-dot zone-b-dot" />
                  <div>
                    <p className="zone-info-label">Zone B — 2:00</p>
                    <p className="zone-info-desc">Complete sentences, can't sing</p>
                  </div>
                </div>
                <div className="zone-info-row">
                  <div className="zone-dot zone-c-dot" />
                  <div>
                    <p className="zone-info-label">Zone C — 1:00</p>
                    <p className="zone-info-desc">Hard to say a whole sentence</p>
                  </div>
                </div>
              </div>
            </div>

            <button className="btn-primary" onClick={handleStart} style={{ fontSize: 18, padding: 20 }}>
              START CARDIO
            </button>
          </div>
        )}

        {status === 'active' && (
          <div className="cardio-active">
            {/* Current zone display */}
            <div className="active-zone-display" style={{ color: zoneColor }}>
              <p className="active-zone-label">{ZONE_LABELS[currentZone]}</p>
              <p className="active-zone-talk">{ZONE_TALK_TEST[currentZone]}</p>
            </div>

            {/* Timer */}
            <div className="cardio-timer">
              <p className="cardio-timer-value">{formatTime(timeRemaining)}</p>
              <p className="cardio-timer-label">time in zone</p>
            </div>

            {/* Round progress */}
            <div className="round-progress">
              <div className="round-dots">
                {Array.from({ length: TOTAL_ROUNDS }, (_, i) => (
                  <div
                    key={i}
                    className={`round-dot ${i < currentRound - 1 ? 'done' : i === currentRound - 1 ? 'active' : ''}`}
                  />
                ))}
              </div>
              <p className="round-progress-label">Round {currentRound} of {TOTAL_ROUNDS}</p>
            </div>

            {/* Total time */}
            <div className="total-time">
              <p>Total: {formatTime(Math.round((Date.now() - startTimeRef.current) / 1000))} / 25:00</p>
            </div>

            <button className="btn-secondary" onClick={handlePause} style={{ width: 'auto', padding: '10px 24px' }}>
              Pause
            </button>
          </div>
        )}

        {status === 'paused' && (
          <div className="cardio-paused">
            <p className="paused-label">PAUSED</p>
            <p className="paused-info">Round {currentRound} · {ZONE_LABELS[currentZone]}</p>
            <p className="paused-timer">{formatTime(timeRemaining)} remaining in zone</p>
          </div>
        )}
      </div>

      {/* Pause Modal */}
      {showPauseModal && (
        <div className="modal-overlay" onClick={() => setShowPauseModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 className="modal-title">Pause Workout?</h3>
            <p className="modal-body">Round {currentRound} of {TOTAL_ROUNDS} · {ZONE_LABELS[currentZone]}</p>
            <div className="modal-btns">
              <button className="btn-primary" onClick={handleResume}>RESUME</button>
              <button className="btn-secondary" onClick={() => { setShowPauseModal(false); handleSaveAndGoHome(); }}>Save & Exit</button>
              <button className="btn-danger" onClick={() => { setShowPauseModal(false); handleAbandon(); }}>Abandon Workout</button>
            </div>
          </div>
        </div>
      )}

      {/* Complete Modal */}
      {showCompleteModal && (
        <div className="modal-overlay">
          <div className="modal-content complete-modal">
            <div className="complete-icon" style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
            <h3 className="modal-title">Cardio Complete!</h3>
            <p className="modal-body">5 rounds · 25 minutes</p>

            <div className="cardio-complete-stats card" style={{ margin: '16px 0' }}>
              <p className="section-label">Zones Completed</p>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <div className="zone-stat">
                  <div style={{ background: 'var(--zone-a)', height: 4, borderRadius: 2, marginBottom: 4 }} />
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Zone A × 5</p>
                </div>
                <div className="zone-stat">
                  <div style={{ background: 'var(--zone-b)', height: 4, borderRadius: 2, marginBottom: 4 }} />
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Zone B × 5</p>
                </div>
                <div className="zone-stat">
                  <div style={{ background: 'var(--zone-c)', height: 4, borderRadius: 2, marginBottom: 4 }} />
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Zone C × 5</p>
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'left', marginBottom: 16 }}>
              <label className="form-label" style={{ display: 'block', marginBottom: 6 }}>Notes (optional)</label>
              <textarea
                className="text-input"
                placeholder="Paces used, how it felt..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={2}
                style={{ resize: 'none' }}
              />
            </div>

            <div className="modal-btns">
              <button className="btn-primary" onClick={handleSaveAndGoCore}>
                NEXT: Core Finisher 🔥
              </button>
              <button className="btn-secondary" onClick={handleSaveAndGoHome}>
                Skip Core & Return Home
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveCardioPage;
