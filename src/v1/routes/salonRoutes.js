import express from 'express';
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

router.get('/salones', obtenerSalones);
router.get('/salones/:id', obtenerSalonPorId);
router.get('/salones/estadisticas', obtenerEstadisticas);
router.post('/salones', validarSalon, crearSalon);
router.put('/salones/:id', validarSalon, actualizarSalon);
router.delete('/salones/:id', eliminarSalon);
// TODO: Ver si se puede hacer un PATCH 

export default router;
