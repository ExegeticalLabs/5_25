import { WeekSchedule, WorkoutType, WeekType } from '../types';

export const WEEK_SCHEDULES: { [key in WeekType]: WeekSchedule } = {
  week_a: {
    weekType: 'week_a',
    days: [
      { dayNumber: 1, dayName: 'Monday', workoutType: 'lifting_upper' },
      { dayNumber: 2, dayName: 'Tuesday', workoutType: 'cardio' },
      { dayNumber: 3, dayName: 'Wednesday', workoutType: 'lifting_lower' },
      { dayNumber: 4, dayName: 'Thursday', workoutType: 'cardio' },
      { dayNumber: 5, dayName: 'Friday', workoutType: 'lifting_upper' },
      { dayNumber: 6, dayName: 'Saturday', workoutType: 'cardio' },
      { dayNumber: 7, dayName: 'Sunday', workoutType: 'rest' },
    ],
  },
  week_b: {
    weekType: 'week_b',
    days: [
      { dayNumber: 1, dayName: 'Monday', workoutType: 'lifting_lower' },
      { dayNumber: 2, dayName: 'Tuesday', workoutType: 'cardio' },
      { dayNumber: 3, dayName: 'Wednesday', workoutType: 'lifting_upper' },
      { dayNumber: 4, dayName: 'Thursday', workoutType: 'cardio' },
      { dayNumber: 5, dayName: 'Friday', workoutType: 'lifting_lower' },
      { dayNumber: 6, dayName: 'Saturday', workoutType: 'cardio' },
      { dayNumber: 7, dayName: 'Sunday', workoutType: 'rest' },
    ],
  },
};

// Block week order: A, B, A, B, A, B
export const BLOCK_WEEK_ORDER: WeekType[] = ['week_a', 'week_b', 'week_a', 'week_b', 'week_a', 'week_b'];

export const getWeekTypeForBlockWeek = (weekNumber: number): WeekType => {
  const index = (weekNumber - 1) % BLOCK_WEEK_ORDER.length;
  return BLOCK_WEEK_ORDER[index];
};

export const getTodaysWorkoutType = (blockStartDate: Date, today: Date = new Date()): WorkoutType => {
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.

  const msPerDay = 24 * 60 * 60 * 1000;
  const daysSinceStart = Math.floor((today.getTime() - blockStartDate.getTime()) / msPerDay);
  const currentWeekNumber = Math.floor(daysSinceStart / 7) + 1;

  const weekType = getWeekTypeForBlockWeek(currentWeekNumber);
  const schedule = WEEK_SCHEDULES[weekType];

  // Convert Sunday=0 to dayNumber 7, Mon=1 to dayNumber 1, etc.
  const dayNumber = dayOfWeek === 0 ? 7 : dayOfWeek;

  const daySchedule = schedule.days.find(d => d.dayNumber === dayNumber);
  return daySchedule?.workoutType || 'rest';
};

export const getWorkoutTypeLabel = (type: WorkoutType): string => {
  const labels: { [key in WorkoutType]: string } = {
    lifting_upper: 'Upper Body Lifting',
    lifting_lower: 'Lower Body Lifting',
    cardio: 'Cardio + Core',
    core: 'Core Finisher',
    rest: 'Rest Day',
  };
  return labels[type];
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};
