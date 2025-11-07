import { Router } from 'express';
import passport from '../../config/passport.js';
import AuthController from '../../controllers/authController.js';
import { loginValidation } from '../../middleware/authValidation.js';
import { handleValidationErrors } from '../../middleware/validationHandler.js';

const router = Router();
const authController = new AuthController();

// POST /api/v1/auth/login - Iniciar sesión
router.post('/auth/login', 
    loginValidation,
    handleValidationErrors,
    authController.login
);

// GET /api/v1/auth/perfil - Obtener perfil (requiere autenticación)
router.get('/auth/perfil',
    passport.authenticate('jwt', { session: false }),
    authController.perfil
);

export default router;