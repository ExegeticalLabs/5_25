import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  addDoc,
  Timestamp,
  deleteDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import { User, Block, Workout, UserPreferences } from '../types';

// User operations
export const createUserProfile = async (uid: string, email: string, name: string): Promise<void> => {
  const userRef = doc(db, 'users', uid);
  const userData: Omit<User, 'uid'> = {
    email,
    name,
    createdDate: new Date().toISOString(),
    currentBlockId: null,
    preferences: {
      darkMode: false,
      notificationsEnabled: true,
      audioCuesEnabled: true,
      cardioUnit: 'mph',
    },
  };
  await setDoc(userRef, userData);
};

export const getUserProfile = async (uid: string): Promise<User | null> => {
  const userRef = doc(db, 'users', uid);
  const snapshot = await getDoc(userRef);
  if (snapshot.exists()) {
    return { uid, ...snapshot.data() } as User;
  }
  return null;
};

export const updateUserProfile = async (uid: string, updates: Partial<User>): Promise<void> => {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, updates as any);
};

export const updateUserPreferences = async (uid: string, preferences: Partial<UserPreferences>): Promise<void> => {
  const userRef = doc(db, 'users', uid);
  const updates: any = {};
  Object.entries(preferences).forEach(([key, value]) => {
    updates[`preferences.${key}`] = value;
  });
  await updateDoc(userRef, updates);
};

// Block operations
export const createBlock = async (userId: string, blockNumber: number, startDate: Date): Promise<string> => {
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 41); // 6 weeks = 42 days

  const blockData: Omit<Block, 'blockId'> = {
    userId,
    blockNumber,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    status: 'active',
    liftingExercises: {
      upper: [],
      lower: [],
    },
    cardio: {
      cardioType: 'running',
    },
    core: {
      comboNumber: ((blockNumber - 1) % 4 + 1) as 1 | 2 | 3 | 4,
      exercises: [],
    },
  };

  const blocksRef = collection(db, 'blocks');
  const docRef = await addDoc(blocksRef, blockData);

  // Update user's currentBlockId
  await updateUserProfile(userId, { currentBlockId: docRef.id });

  return docRef.id;
};

export const getBlock = async (blockId: string): Promise<Block | null> => {
  const blockRef = doc(db, 'blocks', blockId);
  const snapshot = await getDoc(blockRef);
  if (snapshot.exists()) {
    return { blockId, ...snapshot.data() } as Block;
  }
  return null;
};

export const updateBlock = async (blockId: string, updates: Partial<Block>): Promise<void> => {
  const blockRef = doc(db, 'blocks', blockId);
  await updateDoc(blockRef, updates as any);
};

export const getUserBlocks = async (userId: string): Promise<Block[]> => {
  const blocksRef = collection(db, 'blocks');
  const q = query(blocksRef, where('userId', '==', userId), orderBy('blockNumber', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ blockId: doc.id, ...doc.data() } as Block));
};

// Workout operations
export const createWorkout = async (workout: Omit<Workout, 'workoutId'>): Promise<string> => {
  const workoutsRef = collection(db, 'workouts');
  const docRef = await addDoc(workoutsRef, {
    ...workout,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
};

export const getWorkout = async (workoutId: string): Promise<Workout | null> => {
  const workoutRef = doc(db, 'workouts', workoutId);
  const snapshot = await getDoc(workoutRef);
  if (snapshot.exists()) {
    return { workoutId, ...snapshot.data() } as Workout;
  }
  return null;
};

export const updateWorkout = async (workoutId: string, updates: Partial<Workout>): Promise<void> => {
  const workoutRef = doc(db, 'workouts', workoutId);
  await updateDoc(workoutRef, updates as any);
};

export const deleteWorkout = async (workoutId: string): Promise<void> => {
  const workoutRef = doc(db, 'workouts', workoutId);
  await deleteDoc(workoutRef);
};

export const getBlockWorkouts = async (userId: string, blockId: string): Promise<Workout[]> => {
  const workoutsRef = collection(db, 'workouts');
  const q = query(
    workoutsRef,
    where('userId', '==', userId),
    where('blockId', '==', blockId),
    orderBy('workoutDate', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ workoutId: doc.id, ...doc.data() } as Workout));
};

export const getUserWorkouts = async (userId: string, limit?: number): Promise<Workout[]> => {
  const workoutsRef = collection(db, 'workouts');
  const q = query(
    workoutsRef,
    where('userId', '==', userId),
    orderBy('workoutDate', 'desc')
  );
  const snapshot = await getDocs(q);
  const workouts = snapshot.docs.map(doc => ({ workoutId: doc.id, ...doc.data() } as Workout));
  return limit ? workouts.slice(0, limit) : workouts;
};
