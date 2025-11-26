// backend/middleware/auth.js

import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
  let token;

  // 1. Check if token exists in header (Authorization: Bearer <token>)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header (split "Bearer <token>" and take the token part)
      token = req.headers.authorization.split(' ')[1];

      // 2. Verify token using your JWT_SECRET
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Attach user ID to the request object (req.user)
      req.userId = decoded.id; 

      next(); // Move to the next function (the controller)
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};