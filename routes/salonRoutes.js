import express from 'express';
import {
    obtenerSalones,
    obtenerSalonPorId,
    crearSalon,
    actualizarSalon,
    eliminarSalon
} from '../controllers/salonController.js';

const router = express.Router();

// GET /api/salones - Obtener todos los salones
router.get('/salones', obtenerSalones);

// GET /api/salones/:id - Obtener un salón por ID
router.get('/salones/:id', obtenerSalonPorId);

// POST /api/salones - Crear un nuevo salón
router.post('/salones', crearSalon);

// PUT /api/salones/:id - Actualizar un salón
router.put('/salones/:id', actualizarSalon);

// DELETE /api/salones/:id - Eliminar un salón
router.delete('/salones/:id', eliminarSalon);

export default router;
