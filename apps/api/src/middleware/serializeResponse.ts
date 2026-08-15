import { Request, Response, NextFunction } from 'express';

// Minimal parser for PostGIS EWKB Point with SRID 4326
function parseWKBPoint(buffer: Buffer): { lat: number; lng: number } | null {
  try {
    // Length for EWKB Point with SRID is exactly 25 bytes
    // 1 (endian) + 4 (type) + 4 (srid) + 8 (x) + 8 (y)
    if (buffer.length === 25 && buffer[0] === 1) {
       const type = buffer.readUInt32LE(1);
       if (type === 0x20000001) { // Point with SRID flag
         const lng = buffer.readDoubleLE(9);
         const lat = buffer.readDoubleLE(17);
         return { lat, lng };
       }
    }
    return null;
  } catch (e) {
    return null;
  }
}

export const cleanData = (obj: any): any => {
  if (obj === null || obj === undefined) return obj;
  
  if (Buffer.isBuffer(obj)) {
    const point = parseWKBPoint(obj);
    return point ? point : obj.toString('hex');
  }
  
  if (Array.isArray(obj)) {
    return obj.map(cleanData);
  }
  
  // Specifically don't touch already primitive types
  if (typeof obj !== 'object') {
    return obj;
  }
  
  // Date handles itself cleanly in JSON, but if we wanted custom formats we would do it here
  if (obj instanceof Date) return obj.toISOString();
  
  const cleaned: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cleaned[key] = cleanData(obj[key]);
    }
  }
  return cleaned;
};

// Middleware that hooks into Express res.json to automatically serialize specific structures (like PostGIS buffers)
export const serializeResponseMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const originalJson = res.json;
  res.json = function (body: any) {
    const cleanedBody = cleanData(body);
    return originalJson.call(this, cleanedBody);
  };
  next();
};
