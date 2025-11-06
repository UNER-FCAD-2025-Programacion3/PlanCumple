import express from 'express';
import apicache from 'apicache';
import {
    obtenerReservasServicios,
    obtenerReservaServicioPorId,
    obtenerServiciosPorReserva,
    obtenerReservasPorServicio,
    crearReservaServicio,
    actualizarReservaServicio,
    eliminarReservaServicio,
    eliminarServiciosPorReserva,
    obtenerTotalImportesPorReserva,
    obtenerEstadisticas,
    crearMultiplesServicios,
    actualizarServiciosDeReserva
} from '../../controllers/reservaServicioController.js';
import { 
    validarReservaServicio, 
    validarActualizacionReservaServicio,
    validarMultiplesServicios,
    validarActualizacionMultiplesServicios
} from '../../middleware/reservaServicioValidation.js';

const router = express.Router();
let cache = apicache.middleware;

const clearCache = (req, res, next) => {
    apicache.clear();
    next();
};

// Rutas con caché - consultas
router.get('/reservas-servicios', cache('3 minutes'), obtenerReservasServicios);
router.get('/reservas-servicios/estadisticas', cache('5 minutes'), obtenerEstadisticas);
router.get('/reservas-servicios/:id', cache('2 minutes'), obtenerReservaServicioPorId);
router.get('/reservas-servicios/reserva/:reservaId', cache('2 minutes'), obtenerServiciosPorReserva);
router.get('/reservas-servicios/servicio/:servicioId', cache('2 minutes'), obtenerReservasPorServicio);
router.get('/reservas-servicios/reserva/:reservaId/total', cache('1 minute'), obtenerTotalImportesPorReserva);

// Rutas de modificación individual (limpian caché)
router.post('/reservas-servicios', validarReservaServicio, clearCache, crearReservaServicio);
router.put('/reservas-servicios/:id', validarActualizacionReservaServicio, clearCache, actualizarReservaServicio);
router.delete('/reservas-servicios/:id', clearCache, eliminarReservaServicio);

// Rutas de operaciones múltiples (limpian caché)
router.post('/reservas-servicios/reserva/:reservaId/multiple', validarMultiplesServicios, clearCache, crearMultiplesServicios);
router.put('/reservas-servicios/reserva/:reservaId/servicios', validarActualizacionMultiplesServicios, clearCache, actualizarServiciosDeReserva);
router.delete('/reservas-servicios/reserva/:reservaId/all', clearCache, eliminarServiciosPorReserva);

export default router;