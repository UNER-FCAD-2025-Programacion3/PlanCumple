import express from 'express';
import apicache from 'apicache';
import {
    obtenerServicios,
    obtenerServicioPorId,
    crearServicio,
    actualizarServicio,
    eliminarServicio,
    obtenerServiciosPorRangoImporte,
    obtenerEstadisticas
} from '../../controllers/servicioController.js';
import { validarServicio, validarActualizacionServicio } from '../../middleware/servicioValidation.js';

const router = express.Router();
let cache = apicache.middleware;

const clearCache = (req, res, next) => {
    apicache.clear();
    next();
};

router.get('/servicios', cache('5 minutes'), obtenerServicios);
router.get('/servicios/estadisticas', cache('10 minutes'), obtenerEstadisticas);
router.get('/servicios/rango', cache('3 minutes'), obtenerServiciosPorRangoImporte);
router.get('/servicios/:id', cache('3 minutes'), obtenerServicioPorId);
router.post('/servicios', validarServicio, clearCache, crearServicio);
router.put('/servicios/:id', validarActualizacionServicio, clearCache, actualizarServicio);
router.delete('/servicios/:id', clearCache, eliminarServicio);

export default router;