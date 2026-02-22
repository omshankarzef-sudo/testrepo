import mongoose, { Schema, Document } from 'mongoose';

export interface IMarks extends Document {
  studentId: mongoose.Types.ObjectId;
  subjectId: mongoose.Types.ObjectId;
  classId: mongoose.Types.ObjectId;
  marks: number;
  totalMarks: number;
  percentage: number;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MarksSchema = new Schema<IMarks>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    subjectId: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
    classId: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
    marks: { type: Number, required: true, min: 0 },
    totalMarks: { type: Number, required: true, min: 0 },
    percentage: { type: Number, required: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Index for efficient queries
MarksSchema.index({ studentId: 1, subjectId: 1 });
MarksSchema.index({ classId: 1 });

export const Marks = mongoose.model<IMarks>('Marks', MarksSchema);
