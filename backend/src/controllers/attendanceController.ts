import { Request, Response } from 'express';
import { Attendance } from '../models/Attendance';
import { sendSuccess, sendError } from '../utils/response';
import { requireFields } from '../utils/validators';

const attendanceRequired = ['studentId', 'classId', 'date'];

export const getAttendance = async (req: Request, res: Response) => {
  try {
    const attendance = await Attendance.find().populate('studentId classId');
    return sendSuccess(res, attendance);
  } catch (err) {
    console.error('[attendance.getAttendance]', err);
    return sendError(res, 'Failed to fetch attendance');
  }
};

export const getAttendanceByStudent = async (req: Request, res: Response) => {
  try {
    const attendance = await Attendance.find({ studentId: req.params.studentId }).populate('classId');
    return sendSuccess(res, attendance);
  } catch (err) {
    console.error('[attendance.getAttendanceByStudent]', err);
    return sendError(res, 'Failed to fetch student attendance');
  }
};

export const createAttendanceRecord = async (req: Request, res: Response) => {
  try {
    const err = requireFields(req.body, attendanceRequired);
    if (err) return sendError(res, err, 400);

    const record = new Attendance({
      studentId: req.body.studentId,
      classId: req.body.classId,
      date: new Date(req.body.date),
      present: req.body.present || false,
    });
    const saved = await record.save();
    const populated = await saved.populate('studentId classId');
    return sendSuccess(res, populated, 201);
  } catch (err: any) {
    console.error('[attendance.createAttendanceRecord]', err);
    const msg = err.message || 'Failed to create attendance record';
    return sendError(res, msg, 400);
  }
};

export const updateAttendanceRecord = async (req: Request, res: Response) => {
  try {
    const updated = await Attendance.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate('studentId classId');
    if (!updated) return sendError(res, 'Attendance record not found', 404);
    return sendSuccess(res, updated);
  } catch (err: any) {
    console.error('[attendance.updateAttendanceRecord]', err);
    const msg = err.message || 'Failed to update attendance record';
    return sendError(res, msg, 400);
  }
};

export const deleteAttendanceRecord = async (req: Request, res: Response) => {
  try {
    const deleted = await Attendance.findByIdAndDelete(req.params.id);
    if (!deleted) return sendError(res, 'Attendance record not found', 404);
    return sendSuccess(res, { message: 'Attendance record deleted' });
  } catch (err) {
    console.error('[attendance.deleteAttendanceRecord]', err);
    return sendError(res, 'Failed to delete attendance record');
  }
};

export const getAttendancePercentage = async (req: Request, res: Response) => {
  try {
    const studentId = req.params.studentId;
    const records = await Attendance.find({ studentId });
    const total = records.length;
    const present = records.filter((r) => r.present).length;
    const percentage = total > 0 ? (present / total) * 100 : 0;
    return sendSuccess(res, { total, present, percentage: Math.round(percentage) });
  } catch (err) {
    console.error('[attendance.getAttendancePercentage]', err);
    return sendError(res, 'Failed to calculate attendance percentage');
  }
};
