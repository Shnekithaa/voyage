import admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID || 'voyage-bf065',
  });
}

/**
 * Require a valid Firebase ID token.
 */
export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    console.warn('🔒 verifyToken: No Bearer token in request to', req.originalUrl);
    return res.status(401).json({ success: false, error: 'Authentication required' });
  }

  try {
    const token = authHeader.split('Bearer ')[1];
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    console.log('🔓 verifyToken OK:', decoded.uid, decoded.email, '→', req.originalUrl);
    next();
  } catch (error) {
    console.error('🔒 verifyToken FAILED:', error.code || error.message, '→', req.originalUrl);
    return res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
};

/**
 * Optionally decode token — req.user will be set if valid, undefined otherwise.
 */
export const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    console.log('🔓 optionalAuth: No token →', req.originalUrl);
    return next();
  }

  try {
    const token = authHeader.split('Bearer ')[1];
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    console.log('🔓 optionalAuth OK:', decoded.uid, decoded.email, '→', req.originalUrl);
  } catch (err) {
    console.warn('⚠️  optionalAuth token invalid:', err.code || err.message, '→', req.originalUrl);
  }
  next();
};
