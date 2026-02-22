import { Request, Response } from 'express';
import { Marks } from '../models/Marks';
import { sendSuccess, sendError } from '../utils/response';
import { requireFields } from '../utils/validators';

const marksRequired = ['studentId', 'subjectId', 'classId', 'marks', 'totalMarks'];

export const getMarks = async (req: Request, res: Response) => {
  try {
    const marks = await Marks.find().populate('studentId subjectId classId');
    return sendSuccess(res, marks);
  } catch (err) {
    console.error('[marks.getMarks]', err);
    return sendError(res, 'Failed to fetch marks');
  }
};

export const getMarksByStudent = async (req: Request, res: Response) => {
  try {
    const marks = await Marks.find({ studentId: req.params.studentId }).populate('subjectId classId');
    return sendSuccess(res, marks);
  } catch (err) {
    console.error('[marks.getMarksByStudent]', err);
    return sendError(res, 'Failed to fetch student marks');
  }
};

export const createMarksRecord = async (req: Request, res: Response) => {
  try {
    const err = requireFields(req.body, marksRequired);
    if (err) return sendError(res, err, 400);

    const { studentId, subjectId, classId, marks, totalMarks, date } = req.body;
    const percentage = (marks / totalMarks) * 100;

    const record = new Marks({
      studentId,
      subjectId,
      classId,
      marks,
      totalMarks,
      percentage,
      date: date ? new Date(date) : new Date(),
    });

    const saved = await record.save();
    const populated = await saved.populate('studentId subjectId classId');
    return sendSuccess(res, populated, 201);
  } catch (err: any) {
    console.error('[marks.createMarksRecord]', err);
    const msg = err.message || 'Failed to create marks record';
    return sendError(res, msg, 400);
  }
};

export const updateMarksRecord = async (req: Request, res: Response) => {
  try {
    const data: any = { ...req.body };
    if (data.marks !== undefined && data.totalMarks !== undefined) {
      data.percentage = (data.marks / data.totalMarks) * 100;
    }

    const updated = await Marks.findByIdAndUpdate(req.params.id, data, {
      new: true,
    }).populate('studentId subjectId classId');

    if (!updated) return sendError(res, 'Marks record not found', 404);
    return sendSuccess(res, updated);
  } catch (err: any) {
    console.error('[marks.updateMarksRecord]', err);
    const msg = err.message || 'Failed to update marks record';
    return sendError(res, msg, 400);
  }
};

export const deleteMarksRecord = async (req: Request, res: Response) => {
  try {
    const deleted = await Marks.findByIdAndDelete(req.params.id);
    if (!deleted) return sendError(res, 'Marks record not found', 404);
    return sendSuccess(res, { message: 'Marks record deleted' });
  } catch (err) {
    console.error('[marks.deleteMarksRecord]', err);
    return sendError(res, 'Failed to delete marks record');
  }
};

export const getAverageScore = async (req: Request, res: Response) => {
  try {
    const records = await Marks.find({ studentId: req.params.studentId });
    const average =
      records.length > 0
        ?
            records.reduce((sum, r) => sum + r.percentage, 0) / records.length
        :
            0;
    return sendSuccess(res, { average: Math.round(average * 10) / 10 });
  } catch (err) {
    console.error('[marks.getAverageScore]', err);
    return sendError(res, 'Failed to calculate average score');
  }
};

export const getClassPerformance = async (req: Request, res: Response) => {
  try {
    const marks = await Marks.find({ classId: req.params.classId }).populate('studentId');

    const studentPerformance: Record<string, { studentName: string; marks: number[]; average: number }> = {};
    marks.forEach((mark) => {
      const studentId = String((mark as any).studentId._id);
      if (!studentPerformance[studentId]) {
        studentPerformance[studentId] = {
          studentName: (mark as any).studentId.name,
          marks: [],
          average: 0,
        };
      }
      studentPerformance[studentId].marks.push(mark.percentage);
    });

    Object.values(studentPerformance).forEach((perf) => {
      const scores = perf.marks;
      perf.average =
        scores.length > 0
          ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
          : 0;
    });

    return sendSuccess(res, Object.values(studentPerformance));
  } catch (err) {
    console.error('[marks.getClassPerformance]', err);
    return sendError(res, 'Failed to fetch class performance');
  }
};
