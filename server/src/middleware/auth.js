const jwt = require('jsonwebtoken');

const isAuth = async (req, res, next) => {
    try {
        // console.log('=== Auth Middleware Start ===');
        // console.log('Request path:', req.path);
        // console.log('Request method:', req.method);
        
        const token = req.headers.authorization?.split(' ')[1];
        // console.log('Token from header:', token?.substring(0, 20) + '...');
        
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log('Decoded token data:', decoded);
        
        // Explicitly set each property
        req.user = {
            id: decoded.id,
            role: decoded.role,
            iat: decoded.iat,
            exp: decoded.exp
        };
        // console.log('Set user in request:', req.user);
        // console.log('=== Auth Middleware End ===');
        
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({ message: 'Invalid token' });
    }
};

const checkRole = (roles) => {
    return [
        isAuth,
        (req, res, next) => {
            if (!roles.includes(req.user.role)) {
                return res.status(403).json({ message: 'Access denied' });
            }
            next();
        }
    ];
};

module.exports = {
    isAuth,
    isCoordinator: checkRole(['coordinator', 'admin']),
    isAdmin: checkRole(['admin'])
};