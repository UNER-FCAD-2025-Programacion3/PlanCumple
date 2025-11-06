import { body, validationResult } from 'express-validator';
import JSendResponse from '../utils/jsendResponse.js';

const formatJSendError = (errors) => {
    const validationErrors = {};
    errors.forEach(error => {
        validationErrors[error.path] = error.msg;
    });
    return JSendResponse.fail({ validation: validationErrors });
};

export const validarUsuario = [
    body('nombre')
        .isLength({ min: 1, max: 50 })
        .withMessage('El nombre es obligatorio y debe tener máximo 50 caracteres')
        .trim(),

    body('apellido')
        .isLength({ min: 1, max: 50 })
        .withMessage('El apellido es obligatorio y debe tener máximo 50 caracteres')
        .trim(),

    body('nombre_usuario')
        .isEmail()
        .withMessage('El nombre de usuario debe ser un correo electrónico válido')
        .isLength({ max: 50 })
        .withMessage('El correo electrónico debe tener máximo 50 caracteres')
        .normalizeEmail()
        .trim(),

    body('contrasenia')
        .isLength({ min: 6, max: 255 })
        .withMessage('La contraseña debe tener entre 6 y 255 caracteres'),

    body('tipo_usuario')
        .isInt({ min: 0, max: 255 })
        .withMessage('El tipo de usuario debe ser un número entre 0 y 255'),

    body('celular')
        .optional({ nullable: true })
        .isLength({ max: 20 })
        .withMessage('El celular debe tener máximo 20 caracteres')
        .custom((value) => {
            if (value === null || value === '') return true;
            if (!/^\+?[\d\s\-()]{7,20}$/.test(value)) {
                throw new Error('El formato del celular es inválido');
            }
            return true;
        }),

    body('foto')
        .optional({ nullable: true })
        .isLength({ max: 255 })
        .withMessage('La URL de la foto debe tener máximo 255 caracteres'),

    // Middleware para manejar errores
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(formatJSendError(errors.array()));
        }
        next();
    }
];

export const validarActualizacionUsuario = [
    body('nombre')
        .optional()
        .isLength({ min: 1, max: 50 })
        .withMessage('El nombre debe tener máximo 50 caracteres')
        .trim(),

    body('apellido')
        .optional()
        .isLength({ min: 1, max: 50 })
        .withMessage('El apellido debe tener máximo 50 caracteres')
        .trim(),

    body('nombre_usuario')
        .optional()
        .isEmail()
        .withMessage('El nombre de usuario debe ser un correo electrónico válido')
        .isLength({ max: 50 })
        .withMessage('El correo electrónico debe tener máximo 50 caracteres')
        .normalizeEmail()
        .trim(),

    body('tipo_usuario')
        .optional()
        .isInt({ min: 0, max: 255 })
        .withMessage('El tipo de usuario debe ser un número entre 0 y 255'),

    body('celular')
        .optional({ nullable: true })
        .isLength({ max: 20 })
        .withMessage('El celular debe tener máximo 20 caracteres')
        .custom((value) => {
            if (value === null || value === '' || value === undefined) return true;
            if (!/^\+?[\d\s\-()]{7,20}$/.test(value)) {
                throw new Error('El formato del celular es inválido');
            }
            return true;
        }),

    body('foto')
        .optional({ nullable: true })
        .isLength({ max: 255 })
        .withMessage('La URL de la foto debe tener máximo 255 caracteres'),

    // Middleware para manejar errores
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(formatJSendError(errors.array()));
        }
        next();
    }
];

export const validarCambioContrasenia = [
    body('contraseniaActual')
        .isLength({ min: 1 })
        .withMessage('La contraseña actual es obligatoria'),

    body('nuevaContrasenia')
        .isLength({ min: 6, max: 255 })
        .withMessage('La nueva contraseña debe tener entre 6 y 255 caracteres'),

    // Middleware para manejar errores
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(formatJSendError(errors.array()));
        }
        next();
    }
];

export const validarAutenticacion = [
    body('nombre_usuario')
        .isEmail()
        .withMessage('Debe proporcionar un correo electrónico válido')
        .normalizeEmail()
        .trim(),

    body('contrasenia')
        .isLength({ min: 1 })
        .withMessage('La contraseña es obligatoria'),

    // Middleware para manejar errores
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(formatJSendError(errors.array()));
        }
        next();
    }
];