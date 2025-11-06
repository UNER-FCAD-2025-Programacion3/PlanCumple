import express from 'express';
import apicache from 'apicache';
import {
    obtenerReservas,
    obtenerReservaPorId,
    obtenerReservasPorUsuario,
    obtenerReservasPorSalon,
    obtenerReservasPorFecha,
    obtenerReservasPorRangoFechas,
    crearReserva,
    actualizarReserva,
    eliminarReserva,
    verificarDisponibilidad,
    obtenerEstadisticas,
    obtenerReservasProximas
} from '../../controllers/reservaController.js';
import { 
    validarReserva, 
    validarActualizacionReserva,
    validarDisponibilidad,
    validarRangoFechas,
    validarReservasProximas
} from '../../middleware/reservaValidation.js';

const router = express.Router();
let cache = apicache.middleware;

const clearCache = (req, res, next) => {
    apicache.clear();
    next();
};

// Rutas con caché - consultas
router.get('/reservas', cache('3 minutes'), obtenerReservas);
router.get('/reservas/estadisticas', cache('5 minutes'), obtenerEstadisticas);
router.get('/reservas/proximas', validarReservasProximas, cache('2 minutes'), obtenerReservasProximas);
router.get('/reservas/disponibilidad', validarDisponibilidad, cache('1 minute'), verificarDisponibilidad);
router.get('/reservas/rango', validarRangoFechas, cache('3 minutes'), obtenerReservasPorRangoFechas);
router.get('/reservas/:id', cache('2 minutes'), obtenerReservaPorId);
router.get('/reservas/usuario/:usuarioId', cache('2 minutes'), obtenerReservasPorUsuario);
router.get('/reservas/salon/:salonId', cache('2 minutes'), obtenerReservasPorSalon);
router.get('/reservas/fecha/:fecha', cache('2 minutes'), obtenerReservasPorFecha);

// Rutas de modificación (limpian caché)
router.post('/reservas', validarReserva, clearCache, crearReserva);
router.put('/reservas/:id', validarActualizacionReserva, clearCache, actualizarReserva);
router.delete('/reservas/:id', clearCache, eliminarReserva);

export default router;