import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { createBlock, updateBlock } from '../../services/firestoreService';
import {
  EXERCISE_LIBRARY,
  UPPER_CATEGORIES,
  LOWER_CATEGORIES,
  CATEGORY_DISPLAY_NAMES,
  CORE_COMBO_NAMES,
  CORE_COMBOS,
  CARDIO_TYPES,
  getExercisesByCategory,
} from '../../utils/exerciseLibrary';
import { ExerciseCategory, CardioType } from '../../types';
import './Setup.css';

type SetupStep = 'upper' | 'lower' | 'cardio' | 'core';
const STEPS: SetupStep[] = ['upper', 'lower', 'cardio', 'core'];

const SetupPage: React.FC = () => {
  const { currentUser, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<SetupStep>('upper');
  const [upperSelections, setUpperSelections] = useState<{ [cat: string]: string }>({});
  const [lowerSelections, setLowerSelections] = useState<{ [cat: string]: string }>({});
  // For lower day we have 2 quad picks - track separately
  const [lowerQuad2, setLowerQuad2] = useState<string>('');
  const [cardioType, setCardioType] = useState<CardioType | ''>('');
  const [coreCombo, setCoreCombo] = useState<1 | 2 | 3 | 4 | 0>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const stepIndex = STEPS.indexOf(step);
  const progress = ((stepIndex + 1) / STEPS.length) * 100;

  // Upper selections check
  const upperComplete = UPPER_CATEGORIES.every(cat => upperSelections[cat]);
  // Lower: need quads, hamstrings, glutes, calves, plus second quads
  const lowerBaseComplete = LOWER_CATEGORIES.every(cat => lowerSelections[cat]);
  const lowerComplete = lowerBaseComplete && !!lowerQuad2 && lowerQuad2 !== lowerSelections['quads'];

  const handleUpperSelect = (category: string, exerciseId: string) => {
    setUpperSelections(prev => ({ ...prev, [category]: exerciseId }));
  };

  const handleLowerSelect = (category: string, exerciseId: string) => {
    if (category === 'quads2') {
      setLowerQuad2(exerciseId);
    } else {
      setLowerSelections(prev => ({ ...prev, [category]: exerciseId }));
    }
  };

  const handleNext = () => {
    const currentIndex = STEPS.indexOf(step);
    if (currentIndex < STEPS.length - 1) {
      setStep(STEPS[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const currentIndex = STEPS.indexOf(step);
    if (currentIndex > 0) {
      setStep(STEPS[currentIndex - 1]);
    }
  };

  const handleFinish = async () => {
    if (!currentUser) return;
    setLoading(true);
    setError('');
    try {
      // Get block number (existing blocks + 1)
      const blockId = await createBlock(currentUser.uid, 1, new Date());
      const upperExercises = UPPER_CATEGORIES.map(cat => upperSelections[cat]);
      const lowerExercises = [
        lowerSelections['quads'],
        lowerSelections['hamstrings'],
        lowerSelections['glutes'],
        lowerSelections['calves'],
        lowerQuad2,
      ];
      const comboExercises = CORE_COMBOS[coreCombo];

      await updateBlock(blockId, {
        liftingExercises: { upper: upperExercises, lower: lowerExercises },
        cardio: { cardioType: cardioType as CardioType },
        core: { comboNumber: coreCombo as 1 | 2 | 3 | 4, exercises: comboExercises },
      });

      await refreshUser();
      navigate('/');
    } catch (err: any) {
      setError('Failed to save setup. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderUpperStep = () => (
    <div className="setup-step">
      <h2 className="step-title">Upper Day Exercises</h2>
      <p className="step-desc">Pick 1 exercise from each category. You'll use these for all 6 weeks.</p>
      {UPPER_CATEGORIES.map(cat => (
        <CategoryPicker
          key={cat}
          category={cat}
          selectedId={upperSelections[cat]}
          onSelect={(id) => handleUpperSelect(cat, id)}
        />
      ))}
      <div className="setup-footer">
        <div className="selection-count">
          <span className={upperComplete ? 'count-done' : 'count-pending'}>
            {Object.keys(upperSelections).length} of 5 Selected
            {upperComplete && ' ✓'}
          </span>
        </div>
        <button
          className="btn-primary"
          onClick={handleNext}
          disabled={!upperComplete}
        >
          Continue to Lower Body →
        </button>
      </div>
    </div>
  );

  const renderLowerStep = () => (
    <div className="setup-step">
      <h2 className="step-title">Lower Day Exercises</h2>
      <p className="step-desc">Pick 1 exercise from each category. Pick 2 different quad exercises.</p>
      {LOWER_CATEGORIES.map(cat => (
        <CategoryPicker
          key={cat}
          category={cat}
          selectedId={lowerSelections[cat]}
          onSelect={(id) => handleLowerSelect(cat, id)}
        />
      ))}
      <CategoryPicker
        key="quads2"
        category="quads"
        label="Quads (2nd Pick — different from above)"
        selectedId={lowerQuad2}
        excludeId={lowerSelections['quads']}
        onSelect={(id) => handleLowerSelect('quads2', id)}
      />
      <div className="setup-footer">
        <div className="selection-count">
          <span className={lowerComplete ? 'count-done' : 'count-pending'}>
            {(Object.keys(lowerSelections).length) + (lowerQuad2 ? 1 : 0)} of 5 Selected
            {lowerComplete && ' ✓'}
          </span>
        </div>
        <div className="setup-btn-row">
          <button className="btn-secondary" onClick={handleBack} style={{ width: '40%' }}>← Back</button>
          <button
            className="btn-primary"
            onClick={handleNext}
            disabled={!lowerComplete}
            style={{ width: '58%' }}
          >
            Continue to Cardio →
          </button>
        </div>
      </div>
    </div>
  );

  const renderCardioStep = () => (
    <div className="setup-step">
      <h2 className="step-title">Cardio Type</h2>
      <p className="step-desc">Choose your primary cardio activity for this 6-week block.</p>
      <div className="option-list">
        {CARDIO_TYPES.map(ct => (
          <button
            key={ct.id}
            className={`option-item ${cardioType === ct.id ? 'selected' : ''}`}
            onClick={() => setCardioType(ct.id as CardioType)}
          >
            <span className="option-label">{ct.label}</span>
            {cardioType === ct.id && <span className="option-check">✓</span>}
          </button>
        ))}
      </div>
      <div className="setup-footer">
        <div className="setup-btn-row">
          <button className="btn-secondary" onClick={handleBack} style={{ width: '40%' }}>← Back</button>
          <button
            className="btn-primary"
            onClick={handleNext}
            disabled={!cardioType}
            style={{ width: '58%' }}
          >
            Continue to Core →
          </button>
        </div>
      </div>
    </div>
  );

  const renderCoreStep = () => (
    <div className="setup-step">
      <h2 className="step-title">Core Finisher</h2>
      <p className="step-desc">Choose your core combo for this block. You'll do this after every cardio day.</p>
      <div className="option-list">
        {([1, 2, 3, 4] as const).map(num => (
          <button
            key={num}
            className={`option-item core-option ${coreCombo === num ? 'selected' : ''}`}
            onClick={() => setCoreCombo(num)}
          >
            <div className="option-combo-header">
              <span className="option-label">{CORE_COMBO_NAMES[num]}</span>
              {coreCombo === num && <span className="option-check">✓</span>}
            </div>
            <div className="combo-exercises">
              {CORE_COMBOS[num].map(exId => {
                const ex = EXERCISE_LIBRARY.find(e => e.exerciseId === exId);
                return ex ? <span key={exId} className="combo-exercise-tag">{ex.exerciseName}</span> : null;
              })}
            </div>
          </button>
        ))}
      </div>
      {error && <p className="error-text">{error}</p>}
      <div className="setup-footer">
        <div className="setup-btn-row">
          <button className="btn-secondary" onClick={handleBack} style={{ width: '40%' }}>← Back</button>
          <button
            className="btn-primary"
            onClick={handleFinish}
            disabled={!coreCombo || loading}
            style={{ width: '58%' }}
          >
            {loading && <span className="spinner" />}
            {loading ? 'Saving...' : 'Start Training! 🎯'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="screen setup-screen">
      <div className="setup-header">
        <div className="step-progress">
          <div className="step-progress-bar" style={{ width: `${progress}%` }} />
        </div>
        <div className="step-indicators">
          {STEPS.map((s, i) => (
            <div key={s} className={`step-dot ${i <= stepIndex ? 'active' : ''}`} />
          ))}
        </div>
        <p className="step-label">
          Step {stepIndex + 1} of {STEPS.length}: {
            step === 'upper' ? 'Upper Exercises' :
            step === 'lower' ? 'Lower Exercises' :
            step === 'cardio' ? 'Cardio Type' : 'Core Combo'
          }
        </p>
      </div>

      <div className="page-content setup-content">
        {step === 'upper' && renderUpperStep()}
        {step === 'lower' && renderLowerStep()}
        {step === 'cardio' && renderCardioStep()}
        {step === 'core' && renderCoreStep()}
      </div>
    </div>
  );
};

interface CategoryPickerProps {
  category: ExerciseCategory;
  label?: string;
  selectedId: string;
  excludeId?: string;
  onSelect: (id: string) => void;
}

const CategoryPicker: React.FC<CategoryPickerProps> = ({ category, label, selectedId, excludeId, onSelect }) => {
  const [expanded, setExpanded] = useState(false);
  const exercises = getExercisesByCategory(category).filter(ex => ex.exerciseId !== excludeId);
  const selected = exercises.find(ex => ex.exerciseId === selectedId);

  return (
    <div className="category-picker">
      <div className="category-header" onClick={() => setExpanded(!expanded)}>
        <div>
          <p className="category-name">{label || CATEGORY_DISPLAY_NAMES[category]}</p>
          {selected && <p className="category-selected">{selected.exerciseName}</p>}
          {!selected && <p className="category-placeholder">Tap to select →</p>}
        </div>
        <div className="category-right">
          {selected && <span className="cat-check">✓</span>}
          <span className="cat-arrow">{expanded ? '▲' : '▼'}</span>
        </div>
      </div>
      {expanded && (
        <div className="exercise-options">
          {exercises.map(ex => (
            <button
              key={ex.exerciseId}
              className={`exercise-option ${selectedId === ex.exerciseId ? 'selected' : ''}`}
              onClick={() => { onSelect(ex.exerciseId); setExpanded(false); }}
            >
              <span>{ex.exerciseName}</span>
              <span className={`difficulty-badge difficulty-${ex.difficultyLevel}`}>
                {ex.difficultyLevel}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SetupPage;
