import { Request, Response, NextFunction } from 'express';
import { escape } from 'validator';

// Deep object sanitizer helper using string escape
const sanitizeDeep = (obj: any, skipKeys: string[] = []): any => {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === 'string') {
    return escape(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeDeep(item, skipKeys));
  }

  if (typeof obj === 'object') {
    const sanitizedObj: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (skipKeys.includes(key)) {
        sanitizedObj[key] = value; // Skip sanitizing rich content or specific keys
      } else {
        sanitizedObj[key] = sanitizeDeep(value, skipKeys);
      }
    }
    return sanitizedObj;
  }

  return obj;
};

export const sanitizeMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Fields to bypass simple string escape (e.g., content containing Markdown/JSON blocks)
    // Zod validation in controllers + Frontend DOM sanitizers handle these securely.
    const bypassKeys = ['content'];

    if (req.body) req.body = sanitizeDeep(req.body, bypassKeys);
    if (req.query) req.query = sanitizeDeep(req.query, bypassKeys);
    if (req.params) req.params = sanitizeDeep(req.params, bypassKeys);
    
    next();
  } catch (err) {
    console.error('Sanitization Error:', err);
    res.status(400).json({ error: 'Invalid input format' });
  }
};
