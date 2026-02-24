import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getBlock, createWorkout, updateWorkout } from '../../services/firestoreService';
import { getExerciseById } from '../../utils/exerciseLibrary';
import { Block, LiftingExerciseData } from '../../types';
import { formatTime } from '../../utils/schedule';
import './LiveLifting.css';

const TOTAL_CYCLES = 5;
const TOTAL_REPS = 10;
const REST_SECONDS = 120;

type WorkoutStatus = 'not_started' | 'active' | 'resting' | 'completed' | 'paused';

interface FailureDialog {
  show: boolean;
  exerciseIndex: number;
  cycleIndex: number;
  failedOnRep: number;
  currentWeight: number;
}

const LiveLiftingPage: React.FC = () => {
  const { type } = useParams<{ type: 'upper' | 'lower' }>();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [, setBlock] = useState<Block | null>(null);
  const [exercises, setExercises] = useState<LiftingExerciseData[]>([]);
  const [workoutId, setWorkoutId] = useState<string | null>(null);
  const [status, setStatus] = useState<WorkoutStatus>('not_started');
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentCycleIndex, setCurrentCycleIndex] = useState(0);
  const [currentRep, setCurrentRep] = useState(0);
  const [restTimeRemaining, setRestTimeRemaining] = useState(REST_SECONDS);
  const [startTime] = useState(Date.now());
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [weightInput, setWeightInput] = useState('');
  const [weightEditIndex, setWeightEditIndex] = useState(0);
  const [failureDialog, setFailureDialog] = useState<FailureDialog>({ show: false, exerciseIndex: 0, cycleIndex: 0, failedOnRep: 0, currentWeight: 0 });
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');

  const restTimerRef = useRef<NodeJS.Timeout | null>(null);
  const saveIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load block and exercises
  useEffect(() => {
    const loadBlock = async () => {
      if (!currentUser?.currentBlockId) return;
      const blockData = await getBlock(currentUser.currentBlockId);
      if (!blockData) return;
      setBlock(blockData);

      const exerciseIds = type === 'upper'
        ? blockData.liftingExercises.upper
        : blockData.liftingExercises.lower;

      const exerciseData: LiftingExerciseData[] = exerciseIds.map(id => {
        const ex = getExerciseById(id);
        return {
          exerciseId: id,
          exerciseName: ex?.exerciseName || 'Exercise',
          weightUsed: 0,
          cycles: Array.from({ length: TOTAL_CYCLES }, (_, i) => ({
            cycleNumber: i + 1,
            repsCompleted: 0,
            failedOnRep: undefined,
          })),
        };
      });

      setExercises(exerciseData);

      // Create workout record
      const wId = await createWorkout({
        userId: currentUser.uid,
        blockId: currentUser.currentBlockId,
        workoutDate: new Date().toISOString(),
        workoutType: type === 'upper' ? 'lifting_upper' : 'lifting_lower',
        status: 'in_progress',
        workoutData: {
          exercises: exerciseData,
          restSecondsBetweenCycles: REST_SECONDS,
        } as any,
      });
      setWorkoutId(wId);
      setLoading(false);
    };

    loadBlock();
  }, [currentUser, type]);

  // Auto-save periodically
  const saveProgress = useCallback(async () => {
    if (!workoutId || exercises.length === 0) return;
    try {
      await updateWorkout(workoutId, {
        workoutData: { exercises, restSecondsBetweenCycles: REST_SECONDS } as any,
      });
    } catch (e) {}
  }, [workoutId, exercises]);

  useEffect(() => {
    if (status === 'active' || status === 'resting') {
      saveIntervalRef.current = setInterval(saveProgress, 15000);
      return () => { if (saveIntervalRef.current) clearInterval(saveIntervalRef.current); };
    }
  }, [status, saveProgress]);

  // Rest timer
  useEffect(() => {
    if (status === 'resting') {
      restTimerRef.current = setInterval(() => {
        setRestTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(restTimerRef.current!);
            handleRestEnd();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (restTimerRef.current) clearInterval(restTimerRef.current);
    }
    return () => { if (restTimerRef.current) clearInterval(restTimerRef.current); };
  }, [status]); // eslint-disable-line

  const handleRestEnd = useCallback(() => {
    setStatus('active');
    setCurrentExerciseIndex(0);
    setCurrentRep(0);
    setRestTimeRemaining(REST_SECONDS);
  }, []);

  // When weight for an exercise is 0, show weight entry modal
  const currentExercise = exercises[currentExerciseIndex];

  const handleStartWorkout = () => {
    if (exercises[0]?.weightUsed === 0) {
      setWeightEditIndex(0);
      setWeightInput('');
      setShowWeightModal(true);
    } else {
      setStatus('active');
    }
  };

  const handleSetWeight = () => {
    const w = parseFloat(weightInput);
    if (isNaN(w) || w <= 0 || w > 500) return;

    setExercises(prev => {
      const updated = [...prev];
      updated[weightEditIndex] = { ...updated[weightEditIndex], weightUsed: w };
      return updated;
    });
    setShowWeightModal(false);

    // Check if next exercises need weights
    const nextUnentered = exercises.findIndex((ex, i) => i > weightEditIndex && ex.weightUsed === 0);
    if (nextUnentered !== -1) {
      setWeightEditIndex(nextUnentered);
      setWeightInput('');
      setShowWeightModal(true);
    } else {
      setStatus('active');
    }
  };

  const handleEditWeight = (exIndex: number) => {
    setWeightEditIndex(exIndex);
    setWeightInput(exercises[exIndex].weightUsed > 0 ? exercises[exIndex].weightUsed.toString() : '');
    setShowWeightModal(true);
  };

  const handleRepComplete = () => {
    if (status !== 'active') return;
    const newRep = currentRep + 1;

    // Update rep count in exercise data
    setExercises(prev => {
      const updated = [...prev];
      const exData = { ...updated[currentExerciseIndex] };
      const cycles = [...exData.cycles];
      cycles[currentCycleIndex] = {
        ...cycles[currentCycleIndex],
        repsCompleted: newRep,
      };
      exData.cycles = cycles;
      updated[currentExerciseIndex] = exData;
      return updated;
    });

    if (newRep >= TOTAL_REPS) {
      // Completed all reps for this exercise in this cycle
      if (currentExerciseIndex < exercises.length - 1) {
        setCurrentExerciseIndex(prev => prev + 1);
        setCurrentRep(0);
      } else {
        // Completed all exercises in cycle
        completeCycle();
      }
    } else {
      setCurrentRep(newRep);
    }
  };

  const completeCycle = () => {
    if (currentCycleIndex >= TOTAL_CYCLES - 1) {
      // Workout complete!
      finishWorkout();
    } else {
      // Start rest period
      setStatus('resting');
      setRestTimeRemaining(REST_SECONDS);
      setCurrentCycleIndex(prev => prev + 1);
    }
  };

  const handleFailure = () => {
    setFailureDialog({
      show: true,
      exerciseIndex: currentExerciseIndex,
      cycleIndex: currentCycleIndex,
      failedOnRep: currentRep,
      currentWeight: exercises[currentExerciseIndex].weightUsed,
    });
  };

  const handleDropWeight = (newWeight: number) => {
    if (newWeight <= 0 || newWeight > 500) return;

    const { exerciseIndex, cycleIndex, failedOnRep } = failureDialog;
    setExercises(prev => {
      const updated = [...prev];
      const exData = { ...updated[exerciseIndex] };
      const cycles = [...exData.cycles];
      cycles[cycleIndex] = {
        ...cycles[cycleIndex],
        repsCompleted: failedOnRep,
        failedOnRep,
      };
      exData.cycles = cycles;
      exData.weightUsed = newWeight;
      updated[exerciseIndex] = exData;
      return updated;
    });

    setFailureDialog(prev => ({ ...prev, show: false }));
    // Continue to next exercise or cycle
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setCurrentRep(0);
    } else {
      completeCycle();
    }
  };

  const handleKeepWeight = () => {
    const { exerciseIndex, cycleIndex, failedOnRep } = failureDialog;
    setExercises(prev => {
      const updated = [...prev];
      const exData = { ...updated[exerciseIndex] };
      const cycles = [...exData.cycles];
      cycles[cycleIndex] = {
        ...cycles[cycleIndex],
        repsCompleted: failedOnRep,
        failedOnRep,
      };
      exData.cycles = cycles;
      updated[exerciseIndex] = exData;
      return updated;
    });
    setFailureDialog(prev => ({ ...prev, show: false }));
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setCurrentRep(0);
    } else {
      completeCycle();
    }
  };

  const finishWorkout = async () => {
    setStatus('completed');
    setShowCompleteModal(true);
    const duration = Math.round((Date.now() - startTime) / 60000);
    if (workoutId) {
      await updateWorkout(workoutId, {
        status: 'completed',
        totalDurationMinutes: duration,
        workoutData: { exercises, restSecondsBetweenCycles: REST_SECONDS } as any,
      });
    }
  };

  const handleSaveAndExit = async () => {
    const duration = Math.round((Date.now() - startTime) / 60000);
    if (workoutId) {
      await updateWorkout(workoutId, {
        status: 'completed',
        totalDurationMinutes: duration,
        userNotes: notes,
        workoutData: { exercises, restSecondsBetweenCycles: REST_SECONDS } as any,
      });
    }
    navigate('/');
  };

  const handleAbandon = async () => {
    if (workoutId) {
      await updateWorkout(workoutId, { status: 'abandoned' });
    }
    navigate('/');
  };

  if (loading) {
    return (
      <div className="screen lifting-screen">
        <div className="loading-center">
          <div className="spinner" style={{ width: 40, height: 40, borderTopColor: 'var(--accent-primary)', borderColor: 'var(--border-color)' }} />
          <p>Loading workout...</p>
        </div>
      </div>
    );
  }

  const workoutTypeLabel = type === 'upper' ? 'Upper Body' : 'Lower Body';

  return (
    <div className="screen lifting-screen">
      {/* Header */}
      <div className="lifting-header">
        <button className="icon-btn" onClick={() => setShowPauseModal(true)}>←</button>
        <div className="lifting-header-center">
          <p className="lifting-title">{workoutTypeLabel} Lifting</p>
          <p className="lifting-subtitle">Cycle {currentCycleIndex + 1} of {TOTAL_CYCLES}</p>
        </div>
        <div style={{ width: 40 }} />
      </div>

      {/* Main content based on status */}
      {status === 'not_started' && (
        <div className="lifting-start">
          <div className="start-header">
            <h2>Ready to lift?</h2>
            <p>Set your weights for each exercise, then start.</p>
          </div>
          <div className="exercises-list">
            {exercises.map((ex, i) => (
              <div key={ex.exerciseId} className="exercise-setup-item">
                <div className="exercise-number">{i + 1}</div>
                <div className="exercise-setup-info">
                  <p className="exercise-setup-name">{ex.exerciseName}</p>
                  <p className="exercise-setup-cat">{getExerciseById(ex.exerciseId)?.category || ''}</p>
                </div>
                <button
                  className="weight-set-btn"
                  onClick={() => handleEditWeight(i)}
                >
                  {ex.weightUsed > 0 ? `${ex.weightUsed} lbs` : 'Set weight'}
                </button>
              </div>
            ))}
          </div>
          <div className="start-footer">
            <button className="btn-primary" onClick={handleStartWorkout}>
              START WORKOUT
            </button>
          </div>
        </div>
      )}

      {status === 'active' && currentExercise && (
        <div className="lifting-active">
          {/* Exercise progress indicator */}
          <div className="exercise-progress-bar">
            {exercises.map((_, i) => (
              <div
                key={i}
                className={`ex-progress-dot ${i < currentExerciseIndex ? 'done' : i === currentExerciseIndex ? 'current' : ''}`}
              />
            ))}
          </div>

          {/* Current exercise */}
          <div className="current-exercise-area">
            <p className="current-exercise-num">Exercise {currentExerciseIndex + 1} of {exercises.length}</p>
            <h2 className="current-exercise-name">{currentExercise.exerciseName}</h2>

            {/* Weight circle */}
            <div className="weight-circle" onClick={() => handleEditWeight(currentExerciseIndex)}>
              <p className="weight-display">{currentExercise.weightUsed || '—'}</p>
              <p className="weight-unit">lbs</p>
              <p className="weight-edit-hint">tap to edit</p>
            </div>

            {/* Rep counter */}
            <div className="rep-counter">
              <p className="rep-label">REPS</p>
              <p className="rep-display">{currentRep} <span className="rep-total">/ {TOTAL_REPS}</span></p>
              <p className="tempo-hint">2 sec up · 2 sec down</p>
            </div>
          </div>

          {/* Cycle dots */}
          <div className="cycle-dots">
            {Array.from({ length: TOTAL_CYCLES }, (_, i) => (
              <div key={i} className={`cycle-dot ${i < currentCycleIndex ? 'done' : i === currentCycleIndex ? 'active' : ''}`} />
            ))}
          </div>

          {/* Buttons */}
          <div className="lifting-btns">
            <button className="btn-danger fail-btn" onClick={handleFailure}>
              Can't complete rep
            </button>
            <button
              className="btn-primary rep-btn"
              onClick={handleRepComplete}
              disabled={currentRep >= TOTAL_REPS}
            >
              {currentRep >= TOTAL_REPS ? 'CYCLE DONE →' : 'REP COMPLETE'}
            </button>
          </div>

          {/* When all 10 reps done, show "CYCLE DONE" separately */}
          {currentRep >= TOTAL_REPS && currentExerciseIndex >= exercises.length - 1 && (
            <button className="btn-primary rep-btn mt-2" onClick={completeCycle}>
              COMPLETE CYCLE {currentCycleIndex + 1} →
            </button>
          )}
        </div>
      )}

      {status === 'resting' && (
        <div className="rest-screen">
          <p className="rest-label">REST</p>
          <p className="rest-title">Cycle {currentCycleIndex} Complete!</p>
          <p className="rest-next">Next: Cycle {currentCycleIndex + 1} of {TOTAL_CYCLES}</p>

          <div className="rest-timer-circle">
            <p className="rest-timer">{formatTime(restTimeRemaining)}</p>
            <p className="rest-timer-label">remaining</p>
          </div>

          <button className="btn-secondary skip-rest-btn" onClick={handleRestEnd}>
            Skip Rest →
          </button>

          {/* Exercise list reminder */}
          <div className="rest-exercise-list card">
            <p className="section-label">Up Next — Same exercises</p>
            {exercises.map((ex, i) => (
              <div key={ex.exerciseId} className="rest-exercise-item">
                <span className="rest-ex-num">{i + 1}</span>
                <span className="rest-ex-name">{ex.exerciseName}</span>
                <span className="rest-ex-weight">{ex.weightUsed} lbs</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pause Modal */}
      {showPauseModal && (
        <div className="modal-overlay" onClick={() => setShowPauseModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 className="modal-title">Pause Workout?</h3>
            <p className="modal-body">What would you like to do?</p>
            <div className="modal-btns">
              <button className="btn-primary" onClick={() => setShowPauseModal(false)}>RESUME</button>
              <button className="btn-secondary" onClick={async () => { setShowPauseModal(false); await handleSaveAndExit(); }}>Save & Exit</button>
              <button className="btn-danger" onClick={async () => { setShowPauseModal(false); await handleAbandon(); }}>Abandon Workout</button>
            </div>
          </div>
        </div>
      )}

      {/* Weight Modal */}
      {showWeightModal && (
        <div className="modal-overlay" onClick={() => setShowWeightModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 className="modal-title">Set Weight</h3>
            <p className="modal-body">{exercises[weightEditIndex]?.exerciseName}</p>
            <div className="weight-input-area">
              <input
                type="number"
                className="text-input weight-input-field"
                placeholder="e.g. 30"
                value={weightInput}
                onChange={e => setWeightInput(e.target.value)}
                autoFocus
                min="0.5"
                max="500"
                step="0.5"
              />
              <span className="weight-input-unit">lbs</span>
            </div>
            <div className="modal-btns">
              <button
                className="btn-primary"
                onClick={handleSetWeight}
                disabled={!weightInput || parseFloat(weightInput) <= 0}
              >
                CONFIRM
              </button>
              <button className="btn-secondary" onClick={() => setShowWeightModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Failure Dialog */}
      {failureDialog.show && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">Rep Not Completed</h3>
            <p className="modal-body">
              Failed on rep {failureDialog.failedOnRep + 1} of {exercises[failureDialog.exerciseIndex]?.exerciseName}.
            </p>
            {failureDialog.cycleIndex < 2 ? (
              <p className="failure-advice">Failing early (Cycle {failureDialog.cycleIndex + 1}) — weight is too heavy. Drop it.</p>
            ) : (
              <p className="failure-advice">Failing late (Cycle {failureDialog.cycleIndex + 1}) — weight is right. Keep it next session.</p>
            )}

            <div className="drop-weight-area">
              <p className="section-label">Drop weight to:</p>
              <div className="weight-input-area">
                <input
                  type="number"
                  className="text-input weight-input-field"
                  placeholder={`< ${failureDialog.currentWeight} lbs`}
                  id="dropWeightInput"
                  min="0.5"
                  max="500"
                  step="0.5"
                />
                <span className="weight-input-unit">lbs</span>
              </div>
            </div>

            <div className="modal-btns">
              <button
                className="btn-danger"
                onClick={() => {
                  const input = document.getElementById('dropWeightInput') as HTMLInputElement;
                  const w = parseFloat(input?.value || '0');
                  if (w > 0) handleDropWeight(w);
                }}
              >
                Drop Weight
              </button>
              <button className="btn-secondary" onClick={handleKeepWeight}>
                Keep Same Weight
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Complete Modal */}
      {showCompleteModal && (
        <div className="modal-overlay">
          <div className="modal-content complete-modal">
            <div className="complete-icon">🎉</div>
            <h3 className="modal-title">Workout Complete!</h3>
            <p className="modal-body">{workoutTypeLabel} — 5 cycles done</p>

            <div className="complete-summary">
              {exercises.map(ex => (
                <div key={ex.exerciseId} className="complete-exercise-row">
                  <span>{ex.exerciseName}</span>
                  <span className="complete-weight">{ex.weightUsed} lbs</span>
                </div>
              ))}
            </div>

            <div className="notes-area">
              <label className="form-label" style={{ display: 'block', marginBottom: 6 }}>Notes (optional)</label>
              <textarea
                className="text-input"
                placeholder="How did it feel? Any adjustments?"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={3}
                style={{ resize: 'none' }}
              />
            </div>

            <div className="modal-btns">
              <button className="btn-primary" onClick={handleSaveAndExit}>
                SAVE & RETURN HOME
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveLiftingPage;
