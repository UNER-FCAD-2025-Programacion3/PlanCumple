import { body, query, validationResult } from 'express-validator';
import JSendResponse from '../utils/jsendResponse.js';

const formatJSendError = (errors) => {
    const validationErrors = {};
    errors.forEach(error => {
        validationErrors[error.path] = error.msg;
    });
    return JSendResponse.fail({ validation: validationErrors });
};

export const validarReserva = [
    body('fecha_reserva')
        .isDate()
        .withMessage('La fecha de reserva debe ser una fecha válida en formato YYYY-MM-DD')
        .custom((value) => {
            const fechaReserva = new Date(value);
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);
            
            if (fechaReserva < hoy) {
                throw new Error('No se pueden hacer reservas para fechas pasadas');
            }
            return true;
        }),

    body('salon_id')
        .isInt({ min: 1 })
        .withMessage('El ID del salón debe ser un número entero positivo'),

    body('usuario_id')
        .isInt({ min: 1 })
        .withMessage('El ID del usuario debe ser un número entero positivo'),

    body('turno_id')
        .isInt({ min: 1 })
        .withMessage('El ID del turno debe ser un número entero positivo'),

    body('foto_cumpleaniero')
        .optional({ nullable: true })
        .isLength({ max: 255 })
        .withMessage('La URL de la foto del cumpleañero debe tener máximo 255 caracteres')
        .custom((value) => {
            if (value === null || value === '' || value === undefined) return true;
            // Validación básica de URL
            try {
                new URL(value);
                return true;
            } catch {
                throw new Error('La foto del cumpleañero debe ser una URL válida');
            }
        }),

    body('tematica')
        .optional({ nullable: true })
        .isLength({ max: 255 })
        .withMessage('La temática debe tener máximo 255 caracteres')
        .trim(),

    body('importe_salon')
        .optional({ nullable: true })
        .isDecimal({ decimal_digits: '0,2' })
        .withMessage('El importe del salón debe ser un número decimal válido con máximo 2 decimales')
        .custom((value) => {
            if (value === null || value === undefined) return true;
            const numero = parseFloat(value);
            if (numero < 0) {
                throw new Error('El importe del salón debe ser un número positivo');
            }
            if (numero > 999999.99) {
                throw new Error('El importe del salón no puede exceder 999,999.99');
            }
            return true;
        }),

    body('importe_total')
        .optional({ nullable: true })
        .isDecimal({ decimal_digits: '0,2' })
        .withMessage('El importe total debe ser un número decimal válido con máximo 2 decimales')
        .custom((value) => {
            if (value === null || value === undefined) return true;
            const numero = parseFloat(value);
            if (numero < 0) {
                throw new Error('El importe total debe ser un número positivo');
            }
            if (numero > 999999.99) {
                throw new Error('El importe total no puede exceder 999,999.99');
            }
            return true;
        }),

    // Middleware para manejar errores
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(formatJSendError(errors.array()));
        }
        next();
    }
];

export const validarActualizacionReserva = [
    body('fecha_reserva')
        .optional()
        .isDate()
        .withMessage('La fecha de reserva debe ser una fecha válida en formato YYYY-MM-DD')
        .custom((value) => {
            if (!value) return true;
            const fechaReserva = new Date(value);
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);
            
            if (fechaReserva < hoy) {
                throw new Error('No se pueden hacer reservas para fechas pasadas');
            }
            return true;
        }),

    body('salon_id')
        .optional()
        .isInt({ min: 1 })
        .withMessage('El ID del salón debe ser un número entero positivo'),

    body('usuario_id')
        .optional()
        .isInt({ min: 1 })
        .withMessage('El ID del usuario debe ser un número entero positivo'),

    body('turno_id')
        .optional()
        .isInt({ min: 1 })
        .withMessage('El ID del turno debe ser un número entero positivo'),

    body('foto_cumpleaniero')
        .optional({ nullable: true })
        .isLength({ max: 255 })
        .withMessage('La URL de la foto del cumpleañero debe tener máximo 255 caracteres')
        .custom((value) => {
            if (value === null || value === '' || value === undefined) return true;
            // Validación básica de URL
            try {
                new URL(value);
                return true;
            } catch {
                throw new Error('La foto del cumpleañero debe ser una URL válida');
            }
        }),

    body('tematica')
        .optional({ nullable: true })
        .isLength({ max: 255 })
        .withMessage('La temática debe tener máximo 255 caracteres')
        .trim(),

    body('importe_salon')
        .optional({ nullable: true })
        .isDecimal({ decimal_digits: '0,2' })
        .withMessage('El importe del salón debe ser un número decimal válido con máximo 2 decimales')
        .custom((value) => {
            if (value === null || value === undefined) return true;
            const numero = parseFloat(value);
            if (numero < 0) {
                throw new Error('El importe del salón debe ser un número positivo');
            }
            if (numero > 999999.99) {
                throw new Error('El importe del salón no puede exceder 999,999.99');
            }
            return true;
        }),

    body('importe_total')
        .optional({ nullable: true })
        .isDecimal({ decimal_digits: '0,2' })
        .withMessage('El importe total debe ser un número decimal válido con máximo 2 decimales')
        .custom((value) => {
            if (value === null || value === undefined) return true;
            const numero = parseFloat(value);
            if (numero < 0) {
                throw new Error('El importe total debe ser un número positivo');
            }
            if (numero > 999999.99) {
                throw new Error('El importe total no puede exceder 999,999.99');
            }
            return true;
        }),

    // Middleware para manejar errores
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(formatJSendError(errors.array()));
        }
        next();
    }
];

export const validarDisponibilidad = [
    query('salonId')
        .isInt({ min: 1 })
        .withMessage('El ID del salón debe ser un número entero positivo'),

    query('fechaReserva')
        .isDate()
        .withMessage('La fecha de reserva debe ser una fecha válida en formato YYYY-MM-DD'),

    query('turnoId')
        .isInt({ min: 1 })
        .withMessage('El ID del turno debe ser un número entero positivo'),

    query('excludeReservaId')
        .optional()
        .isInt({ min: 1 })
        .withMessage('El ID de reserva a excluir debe ser un número entero positivo'),

    // Middleware para manejar errores
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(formatJSendError(errors.array()));
        }
        next();
    }
];

export const validarRangoFechas = [
    query('fechaInicio')
        .isDate()
        .withMessage('La fecha de inicio debe ser una fecha válida en formato YYYY-MM-DD'),

    query('fechaFin')
        .isDate()
        .withMessage('La fecha de fin debe ser una fecha válida en formato YYYY-MM-DD')
        .custom((value, { req }) => {
            if (value && req.query.fechaInicio) {
                const fechaInicio = new Date(req.query.fechaInicio);
                const fechaFin = new Date(value);
                
                if (fechaInicio > fechaFin) {
                    throw new Error('La fecha de inicio debe ser anterior a la fecha de fin');
                }
            }
            return true;
        }),

    // Middleware para manejar errores
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(formatJSendError(errors.array()));
        }
        next();
    }
];

export const validarReservasProximas = [
    query('dias')
        .optional()
        .isInt({ min: 1, max: 365 })
        .withMessage('El número de días debe ser un entero entre 1 y 365'),

    // Middleware para manejar errores
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(formatJSendError(errors.array()));
        }
        next();
    }
];