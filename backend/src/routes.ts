import { Router, Express } from 'express';
import { createServer, Server } from 'http';
import * as studentController from './controllers/studentController';
import * as teacherController from './controllers/teacherController';
import * as classController from './controllers/classController';
import * as subjectController from './controllers/subjectController';
import * as noticeController from './controllers/noticeController';
import * as timetableController from './controllers/timetableController';
import * as attendanceController from './controllers/attendanceController';
import * as marksController from './controllers/marksController';
import * as analyticsController from './controllers/analyticsController';
import * as authController from './controllers/authController';

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  const router = Router();

  // === students ===
  router
    .route('/students')
    .get(studentController.getStudents)
    .post(studentController.createStudent);
  router
    .route('/students/:id')
    .get(studentController.getStudentById)
    .put(studentController.updateStudent)
    .delete(studentController.deleteStudent);
  router.get('/students/class/:classId', studentController.getStudentsByClass);

  // === teachers ===
  router
    .route('/teachers')
    .get(teacherController.getTeachers)
    .post(teacherController.createTeacher);
  router
    .route('/teachers/:id')
    .get(teacherController.getTeacherById)
    .put(teacherController.updateTeacher)
    .delete(teacherController.deleteTeacher);
  router.post('/teachers/:id/assign-subject', teacherController.assignSubjectToTeacher);
  router.post('/teachers/:id/assign-class', teacherController.assignClassToTeacher);

  // === classes ===
  router
    .route('/classes')
    .get(classController.getClasses)
    .post(classController.createClass);
  router
    .route('/classes/:id')
    .get(classController.getClassById)
    .put(classController.updateClass)
    .delete(classController.deleteClass);
  router.get('/classes/:id/with-students', classController.getClassWithStudents);

  // === subjects ===
  router
    .route('/subjects')
    .get(subjectController.getSubjects)
    .post(subjectController.createSubject);
  router
    .route('/subjects/:id')
    .get(subjectController.getSubjectById)
    .put(subjectController.updateSubject)
    .delete(subjectController.deleteSubject);

  // === notices ===
  router
    .route('/notices')
    .get(noticeController.getNotices)
    .post(noticeController.createNotice);
  router
    .route('/notices/:id')
    .get(noticeController.getNoticeById)
    .put(noticeController.updateNotice)
    .delete(noticeController.deleteNotice);
  router.get('/notices/recent', noticeController.getRecentNotices);

  // === timetable ===
  router
    .route('/timetable')
    .get(timetableController.getTimetableSlots)
    .post(timetableController.createTimetableSlot);
  router
    .route('/timetable/:id')
    .put(timetableController.updateTimetableSlot)
    .delete(timetableController.deleteTimetableSlot);
  router.get('/timetable/class/:classId', timetableController.getTimetableByClass);

  // === attendance ===
  router
    .route('/attendance')
    .get(attendanceController.getAttendance)
    .post(attendanceController.createAttendanceRecord);
  router
    .route('/attendance/:id')
    .put(attendanceController.updateAttendanceRecord)
    .delete(attendanceController.deleteAttendanceRecord);
  router.get('/attendance/student/:studentId', attendanceController.getAttendanceByStudent);
  router.get(
    '/attendance/student/:studentId/percentage',
    attendanceController.getAttendancePercentage
  );

  // === marks ===
  router
    .route('/marks')
    .get(marksController.getMarks)
    .post(marksController.createMarksRecord);
  router
    .route('/marks/:id')
    .put(marksController.updateMarksRecord)
    .delete(marksController.deleteMarksRecord);
  router.get('/marks/student/:studentId', marksController.getMarksByStudent);
  router.get('/marks/student/:studentId/average', marksController.getAverageScore);
  router.get('/marks/class/:classId/performance', marksController.getClassPerformance);

  // === analytics & dashboard ===
  router.get('/dashboard/summary', analyticsController.getDashboardSummary);
  router.get('/dashboard/performance', analyticsController.getPerformanceByClass);
  router.get('/analytics', analyticsController.getAnalytics);

  // === auth ===
  router.post('/auth/login', authController.login);

  app.use('/api', router);
  return httpServer;
}