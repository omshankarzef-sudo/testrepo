import { Request, Response } from 'express';
// temporary disable type checking for this module until @types added
// @ts-ignore
import jwt from 'jsonwebtoken';
import { Teacher } from '../models/Teacher';
import { Student } from '../models/Student';
import { sendSuccess, sendError } from '../utils/response';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return sendError(res, 'Email and password are required', 400);
    }

    let user: any = await Teacher.findOne({ email }).lean();
    let role = 'teacher';

    if (!user) {
      user = await Student.findOne({ email }).lean();
      role = 'student';
    }

    if (!user || user.password !== password) {
      // note: replace plaintext check with bcrypt in future
      return sendError(res, 'Invalid credentials', 401);
    }

    const payload = {
      sub: String(user._id || user.id),
      email: user.email,
      role,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    return sendSuccess(res, { token, user: { id: payload.sub, email: user.email, role } });
  } catch (err: any) {
    console.error('[auth.login] Error:', err);
    return sendError(res, 'Login failed');
  }
};

export default { login };
