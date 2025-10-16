import express from 'express';
import apicache from 'apicache';
import {
    obtenerSalones,
    obtenerSalonPorId,
    crearSalon,
    actualizarSalon,
    eliminarSalon,
    obtenerEstadisticas
} from '../../controllers/salonController.js';
import { validarSalon } from '../../middleware/salonValidation.js';

const router = express.Router();
let cache = apicache.middleware;

const clearCache = (req, res, next) => {
    apicache.clear();
    next();
};

router.get('/salones', cache('5 minutes'), obtenerSalones);
router.get('/salones/:id', cache('3 minutes'), obtenerSalonPorId);
router.get('/salones/estadisticas', cache('10 minutes'), obtenerEstadisticas);
router.post('/salones', validarSalon, clearCache, crearSalon);
router.put('/salones/:id', validarSalon, clearCache, actualizarSalon);
router.delete('/salones/:id', clearCache, eliminarSalon);
// TODO: PATCH 

export default router;
