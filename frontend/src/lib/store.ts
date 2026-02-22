import { create } from 'zustand';
import { format } from 'date-fns';

// Mock Data Types
export type UserRole = 'admin' | 'teacher' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  avatar?: string;
  status: 'active' | 'inactive';
}

export interface Student extends User {
  role: 'student';
  rollNumber: string;
  classId: string;
  attendance: number; // percentage
  averageScore: number;
}

export interface Teacher extends User {
  role: 'teacher';
  subjects: string[];
  classes: string[];
  totalQuizzes?: number;
}

export interface Class {
  id: string;
  name: string;
  teacherId: string; // Class teacher
  capacity: number;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  priority: 'low' | 'medium' | 'high';
  audience: 'all' | 'teachers' | 'students';
  author: string;
}

// Store Interface
interface AppState {
  currentUser: User | null;
  isAuthenticated: boolean;
  students: Student[];
  teachers: Teacher[];
  classes: Class[];
  subjects: Subject[];
  notices: Notice[];
  
  login: (email: string, role: UserRole) => void;
  logout: () => void;
  
  addStudent: (student: Omit<Student, 'id' | 'role' | 'attendance' | 'averageScore'>) => void;
  addTeacher: (teacher: Omit<Teacher, 'id' | 'role'>) => void;
  addClass: (cls: Omit<Class, 'id'>) => void;
  addNotice: (notice: Omit<Notice, 'id' | 'date' | 'author'>) => void;
}

// Mock Initial Data
const INITIAL_STUDENTS: Student[] = [
  { id: 's1', name: 'Alice Johnson', email: 'alice@school.com', password: 'password123', role: 'student', status: 'active', rollNumber: 'A001', classId: 'c1', attendance: 92, averageScore: 88 },
  { id: 's2', name: 'Bob Smith', email: 'bob@school.com', password: 'password123', role: 'student', status: 'active', rollNumber: 'A002', classId: 'c1', attendance: 85, averageScore: 76 },
  { id: 's3', name: 'Charlie Davis', email: 'charlie@school.com', password: 'password123', role: 'student', status: 'inactive', rollNumber: 'A003', classId: 'c2', attendance: 40, averageScore: 55 },
  { id: 's4', name: 'Diana Prince', email: 'diana@school.com', password: 'password123', role: 'student', status: 'active', rollNumber: 'B001', classId: 'c2', attendance: 98, averageScore: 95 },
];

const INITIAL_TEACHERS: Teacher[] = [
  { id: 't1', name: 'Sarah Wilson', email: 'sarah@school.com', password: 'password123', role: 'teacher', status: 'active', subjects: ['Mathematics', 'Physics'], classes: ['c1', 'c2'], totalQuizzes: 12 },
  { id: 't2', name: 'Mike Brown', email: 'mike@school.com', password: 'password123', role: 'teacher', status: 'active', subjects: ['English', 'History'], classes: ['c1'], totalQuizzes: 8 },
  { id: 't3', name: 'Emily Clark', email: 'emily@school.com', password: 'password123', role: 'teacher', status: 'active', subjects: ['Biology', 'Chemistry'], classes: ['c2'], totalQuizzes: 15 },
];

const INITIAL_CLASSES: Class[] = [
  { id: 'c1', name: 'Class 10-A', teacherId: 't1', capacity: 30 },
  { id: 'c2', name: 'Class 10-B', teacherId: 't3', capacity: 30 },
  { id: 'c3', name: 'Class 11-A', teacherId: 't2', capacity: 25 },
];

const INITIAL_SUBJECTS: Subject[] = [
  { id: 'sub1', name: 'Mathematics', code: 'MATH101' },
  { id: 'sub2', name: 'Physics', code: 'PHY101' },
  { id: 'sub3', name: 'English', code: 'ENG101' },
  { id: 'sub4', name: 'History', code: 'HIS101' },
];

const INITIAL_NOTICES: Notice[] = [
  { id: 'n1', title: 'Annual Sports Day', content: 'The annual sports day will be held on 25th Jan.', date: '2025-01-20', priority: 'high', audience: 'all', author: 'Admin' },
  { id: 'n2', title: 'Exam Schedule Released', content: 'Final exams start from March 1st.', date: '2025-01-18', priority: 'medium', audience: 'students', author: 'Admin' },
];

export const useStore = create<AppState>((set) => ({
  currentUser: { id: 'admin1', name: 'Admin User', email: 'admin@school.com', role: 'admin', status: 'active' }, // Default logged in for dev convenience
  isAuthenticated: true,
  students: INITIAL_STUDENTS,
  teachers: INITIAL_TEACHERS,
  classes: INITIAL_CLASSES,
  subjects: INITIAL_SUBJECTS,
  notices: INITIAL_NOTICES,

  login: (email, role) => set({ 
    currentUser: { id: 'admin1', name: 'Admin User', email, role, status: 'active' },
    isAuthenticated: true 
  }),
  
  logout: () => set({ currentUser: null, isAuthenticated: false }),

  addStudent: (student) => set((state) => ({
    students: [...state.students, { 
      ...student, 
      id: `s${Date.now()}`, 
      role: 'student', 
      attendance: 0, 
      averageScore: 0 
    }]
  })),

  addTeacher: (teacher) => set((state) => ({
    teachers: [...state.teachers, {
      ...teacher,
      id: `t${Date.now()}`,
      role: 'teacher',
      totalQuizzes: 0
    }]
  })),

  addClass: (cls) => set((state) => ({
    classes: [...state.classes, { ...cls, id: `c${Date.now()}` }]
  })),

  addNotice: (notice) => set((state) => ({
    notices: [{ 
      ...notice, 
      id: `n${Date.now()}`, 
      date: format(new Date(), 'yyyy-MM-dd'),
      author: state.currentUser?.name || 'Admin'
    }, ...state.notices]
  })),
}));
