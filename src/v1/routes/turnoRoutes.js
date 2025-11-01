import express from 'express';
import apicache from 'apicache';
import {
    obtenerTurnos,
    obtenerTurnoPorId,
    crearTurno,
    actualizarTurno,
    eliminarTurno,
    obtenerEstadisticas
} from '../../controllers/turnoController.js';
import { validarTurno } from '../../middleware/turnoValidation.js';

const router = express.Router();
let cache = apicache.middleware;

const clearCache = (req, res, next) => {
    apicache.clear();
    next();
};

router.get('/turnos', cache('5 minutes'), obtenerTurnos);
router.get('/turnos/:id', cache('3 minutes'), obtenerTurnoPorId);
router.get('/turnos/estadisticas', cache('10 minutes'), obtenerEstadisticas);
router.post('/turnos', validarTurno, clearCache, crearTurno);
router.put('/turnos/:id', validarTurno, clearCache, actualizarTurno);
router.delete('/turnos/:id', clearCache, eliminarTurno);

export default router;
