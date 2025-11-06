import { body, validationResult } from 'express-validator';
import JSendResponse from '../utils/jsendResponse.js';

// Función auxiliar para formatear errores según JSend
const formatJSendError = (errors) => {
    const validationErrors = {};
    errors.forEach(error => {
        validationErrors[error.path] = error.msg;
    });
    return JSendResponse.fail({ validation: validationErrors });
};

export const validarSalon = [
    // Validar título: obligatorio y sin espacios
    body('titulo')
        .notEmpty()
        .withMessage('El título es obligatorio')
        .custom(value => {
            if (value.includes(' ')) {
                throw new Error('El título no puede contener espacios');
            }
            return true;
        }),
    
    // Validar capacidad: número mayor a 0
    body('capacidad')
        .isNumeric()
        .withMessage('La capacidad debe ser un número')
        .isFloat({ min: 1 })
        .withMessage('La capacidad debe ser mayor a 0'),
    
    // Validar importe: número mayor a 0
    body('importe')
        .isNumeric()
        .withMessage('El importe debe ser un número')
        .isFloat({ min: 0.01 })
        .withMessage('El importe debe ser mayor a 0'),
    
    // Validar dirección: obligatoria y no vacía
    body('direccion')
        .notEmpty()
        .withMessage('La dirección es obligatoria')
        .trim()
        .isLength({ min: 1 })
        .withMessage('La dirección no puede estar vacía'),
    
    // Validar latitud: opcional, pero si viene debe ser válida
    body('latitud')
        .optional()
        .isFloat({ min: -90, max: 90 })
        .withMessage('La latitud debe estar entre -90 y 90'),
    
    // Validar longitud: opcional, pero si viene debe ser válida
    body('longitud')
        .optional()
        .isFloat({ min: -180, max: 180 })
        .withMessage('La longitud debe estar entre -180 y 180'),
    
    // Middleware para manejar los errores de validación
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(formatJSendError(errors.array()));
        }
        next();
    }
];