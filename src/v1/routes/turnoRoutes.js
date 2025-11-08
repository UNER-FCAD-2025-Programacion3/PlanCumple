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

/**
 * @swagger
 * /api/v1/turnos:
 *   get:
 *     summary: Obtener todos los turnos activos
 *     tags: [Turnos]
 *     responses:
 *       200:
 *         description: Lista de turnos
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/JSendSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Turno'
 */
router.get('/turnos', cache('5 minutes'), obtenerTurnos);

/**
 * @swagger
 * /api/v1/turnos/{id}:
 *   get:
 *     summary: Obtener un turno por ID
 *     tags: [Turnos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del turno
 *     responses:
 *       200:
 *         description: Turno encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JSendSuccess'
 *       404:
 *         description: Turno no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JSendFail'
 */
router.get('/turnos/:id', cache('3 minutes'), obtenerTurnoPorId);

/**
 * @swagger
 * /api/v1/turnos/estadisticas:
 *   get:
 *     summary: Obtener estadísticas de turnos
 *     tags: [Turnos]
 *     responses:
 *       200:
 *         description: Estadísticas de turnos
 */
router.get('/turnos/estadisticas', cache('10 minutes'), obtenerEstadisticas);

/**
 * @swagger
 * /api/v1/turnos:
 *   post:
 *     summary: Crear un nuevo turno
 *     tags: [Turnos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - hora_inicio
 *               - hora_fin
 *             properties:
 *               hora_inicio:
 *                 type: string
 *                 format: time
 *                 example: "14:00"
 *               hora_fin:
 *                 type: string
 *                 format: time
 *                 example: "18:00"
 *     responses:
 *       201:
 *         description: Turno creado exitosamente
 *       400:
 *         description: Error de validación
 */
router.post('/turnos', validarTurno, clearCache, crearTurno);

/**
 * @swagger
 * /api/v1/turnos/{id}:
 *   put:
 *     summary: Actualizar un turno existente
 *     tags: [Turnos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               hora_inicio:
 *                 type: string
 *                 format: time
 *               hora_fin:
 *                 type: string
 *                 format: time
 *     responses:
 *       200:
 *         description: Turno actualizado exitosamente
 *       404:
 *         description: Turno no encontrado
 */
router.put('/turnos/:id', validarTurno, clearCache, actualizarTurno);

/**
 * @swagger
 * /api/v1/turnos/{id}:
 *   delete:
 *     summary: Eliminar un turno (soft delete)
 *     tags: [Turnos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Turno eliminado exitosamente
 *       404:
 *         description: Turno no encontrado
 */
router.delete('/turnos/:id', clearCache, eliminarTurno);

export default router;
