import { Response } from 'express';

/**
 * Standardized success response helper.
 * @param res Express response object
 * @param data Payload to send back
 * @param status HTTP status code (defaults to 200)
 */
export function sendSuccess(res: Response, data: any, status = 200) {
  return res.status(status).json({ success: true, data });
}

/**
 * Standardized error response helper.
 * @param res Express response object
 * @param message Error message
 * @param status HTTP status code (defaults to 500)
 */
export function sendError(res: Response, message: string, status = 500) {
  return res.status(status).json({ success: false, message });
}
