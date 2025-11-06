import { body, validationResult } from 'express-validator';
import JSendResponse from '../utils/jsendResponse.js';

const formatJSendError = (errors) => {
    const validationErrors = {};
    errors.forEach(error => {
        validationErrors[error.path] = error.msg;
    });
    return JSendResponse.fail({ validation: validationErrors });
};

export const validarReservaServicio = [
    body('reserva_id')
        .isInt({ min: 1 })
        .withMessage('El ID de la reserva debe ser un número entero positivo'),

    body('servicio_id')
        .isInt({ min: 1 })
        .withMessage('El ID del servicio debe ser un número entero positivo'),

    body('importe')
        .isDecimal({ decimal_digits: '0,2' })
        .withMessage('El importe debe ser un número decimal válido con máximo 2 decimales')
        .custom((value) => {
            const numero = parseFloat(value);
            if (numero < 0) {
                throw new Error('El importe debe ser un número positivo');
            }
            if (numero > 999999.99) {
                throw new Error('El importe no puede exceder 999,999.99');
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

export const validarActualizacionReservaServicio = [
    body('reserva_id')
        .optional()
        .isInt({ min: 1 })
        .withMessage('El ID de la reserva debe ser un número entero positivo'),

    body('servicio_id')
        .optional()
        .isInt({ min: 1 })
        .withMessage('El ID del servicio debe ser un número entero positivo'),

    body('importe')
        .optional()
        .isDecimal({ decimal_digits: '0,2' })
        .withMessage('El importe debe ser un número decimal válido con máximo 2 decimales')
        .custom((value) => {
            if (value !== undefined && value !== null) {
                const numero = parseFloat(value);
                if (numero < 0) {
                    throw new Error('El importe debe ser un número positivo');
                }
                if (numero > 999999.99) {
                    throw new Error('El importe no puede exceder 999,999.99');
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

export const validarMultiplesServicios = [
    body('servicios')
        .isArray({ min: 1 })
        .withMessage('Debe proporcionar al menos un servicio'),

    body('servicios.*.servicio_id')
        .isInt({ min: 1 })
        .withMessage('Cada servicio debe tener un ID válido'),

    body('servicios.*.importe')
        .isDecimal({ decimal_digits: '0,2' })
        .withMessage('Cada servicio debe tener un importe válido con máximo 2 decimales')
        .custom((value) => {
            const numero = parseFloat(value);
            if (numero < 0) {
                throw new Error('El importe de cada servicio debe ser positivo');
            }
            if (numero > 999999.99) {
                throw new Error('El importe de cada servicio no puede exceder 999,999.99');
            }
            return true;
        }),

    // Validación personalizada para verificar duplicados
    body('servicios')
        .custom((servicios) => {
            const servicioIds = servicios.map(s => s.servicio_id);
            const serviciosUnicos = new Set(servicioIds);
            if (servicioIds.length !== serviciosUnicos.size) {
                throw new Error('No se pueden agregar servicios duplicados');
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

export const validarActualizacionMultiplesServicios = [
    body('servicios')
        .isArray()
        .withMessage('Los servicios deben ser proporcionados como un array'),

    body('servicios.*.servicio_id')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Cada servicio debe tener un ID válido'),

    body('servicios.*.importe')
        .optional()
        .isDecimal({ decimal_digits: '0,2' })
        .withMessage('Cada servicio debe tener un importe válido con máximo 2 decimales')
        .custom((value) => {
            if (value !== undefined && value !== null) {
                const numero = parseFloat(value);
                if (numero < 0) {
                    throw new Error('El importe de cada servicio debe ser positivo');
                }
                if (numero > 999999.99) {
                    throw new Error('El importe de cada servicio no puede exceder 999,999.99');
                }
            }
            return true;
        }),

    // Validación personalizada para verificar duplicados solo si hay servicios
    body('servicios')
        .custom((servicios) => {
            if (servicios.length > 0) {
                const servicioIds = servicios.map(s => s.servicio_id).filter(id => id !== undefined);
                const serviciosUnicos = new Set(servicioIds);
                if (servicioIds.length !== serviciosUnicos.size) {
                    throw new Error('No se pueden agregar servicios duplicados');
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