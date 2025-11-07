import passport from '../config/passport.js';
import JSendResponse from '../utils/jsendResponse.js';

// Middleware para rutas que requieren autenticación
export const requireAuth = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            return res.status(500).json(JSendResponse.error('Error de autenticación'));
        }
        
        if (!user) {
            return res.status(401).json(JSendResponse.fail({ 
                auth: 'Token requerido o inválido' 
            }));
        }
        
        req.user = user;
        next();
    })(req, res, next);
};

// Middleware para verificar roles específicos
export const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json(JSendResponse.fail({ 
                auth: 'Usuario no autenticado' 
            }));
        }

        if (!roles.includes(req.user.tipo_usuario)) {
            return res.status(403).json(JSendResponse.fail({ 
                auth: 'No tienes permisos para acceder a este recurso' 
            }));
        }

        next();
    };
};