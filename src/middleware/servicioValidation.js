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

export const validarServicio = [
    // Validar descripcion: obligatoria y no vacía
    body('descripcion')
        .notEmpty()
        .withMessage('La descripción es obligatoria')
        .trim()
        .isLength({ min: 3, max: 255 })
        .withMessage('La descripción debe tener entre 3 y 255 caracteres'),
    
    // Validar importe: número mayor a 0
    body('importe')
        .isNumeric()
        .withMessage('El importe debe ser un número')
        .isFloat({ min: 0.01 })
        .withMessage('El importe debe ser mayor a 0'),
    
    // Middleware para manejar los errores de validación
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(formatJSendError(errors.array()));
        }
        next();
    }
];

export const validarActualizacionServicio = [
    // Validar descripcion: opcional, pero si viene debe ser válida
    body('descripcion')
        .optional()
        .trim()
        .isLength({ min: 3, max: 255 })
        .withMessage('La descripción debe tener entre 3 y 255 caracteres'),
    
    // Validar importe: opcional, pero si viene debe ser válido
    body('importe')
        .optional()
        .isNumeric()
        .withMessage('El importe debe ser un número')
        .isFloat({ min: 0.01 })
        .withMessage('El importe debe ser mayor a 0'),
    
    // Middleware para manejar los errores de validación
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(formatJSendError(errors.array()));
        }
        next();
    }
];