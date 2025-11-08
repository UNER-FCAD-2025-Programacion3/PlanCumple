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

/**
 * @swagger
 * /api/v1/salones:
 *   get:
 *     summary: Obtener todos los salones activos
 *     tags: [Salones]
 *     responses:
 *       200:
 *         description: Lista de salones
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
 *                         $ref: '#/components/schemas/Salon'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JSendError'
 */
router.get('/salones', cache('5 minutes'), obtenerSalones);

/**
 * @swagger
 * /api/v1/salones/{id}:
 *   get:
 *     summary: Obtener un salón por ID
 *     tags: [Salones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del salón
 *     responses:
 *       200:
 *         description: Salón encontrado
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/JSendSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Salon'
 *       404:
 *         description: Salón no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JSendFail'
 */
router.get('/salones/:id', cache('3 minutes'), obtenerSalonPorId);

/**
 * @swagger
 * /api/v1/salones/estadisticas:
 *   get:
 *     summary: Obtener estadísticas de salones
 *     tags: [Salones]
 *     responses:
 *       200:
 *         description: Estadísticas de salones
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JSendSuccess'
 */
router.get('/salones/estadisticas', cache('10 minutes'), obtenerEstadisticas);

/**
 * @swagger
 * /api/v1/salones:
 *   post:
 *     summary: Crear un nuevo salón
 *     tags: [Salones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - direccion
 *               - capacidad
 *               - importe
 *             properties:
 *               titulo:
 *                 type: string
 *                 example: "Salón Infantil"
 *               direccion:
 *                 type: string
 *                 example: "Av. Siempre Viva 123"
 *               capacidad:
 *                 type: integer
 *                 minimum: 1
 *                 example: 50
 *               importe:
 *                 type: number
 *                 minimum: 0
 *                 example: 15000.00
 *               latitud:
 *                 type: number
 *                 minimum: -90
 *                 maximum: 90
 *                 example: -31.4135
 *               longitud:
 *                 type: number
 *                 minimum: -180
 *                 maximum: 180
 *                 example: -64.1811
 *     responses:
 *       201:
 *         description: Salón creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JSendSuccess'
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JSendFail'
 */
router.post('/salones', validarSalon, clearCache, crearSalon);

/**
 * @swagger
 * /api/v1/salones/{id}:
 *   put:
 *     summary: Actualizar un salón existente
 *     tags: [Salones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del salón
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               direccion:
 *                 type: string
 *               capacidad:
 *                 type: integer
 *               importe:
 *                 type: number
 *               latitud:
 *                 type: number
 *               longitud:
 *                 type: number
 *     responses:
 *       200:
 *         description: Salón actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JSendSuccess'
 *       404:
 *         description: Salón no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JSendFail'
 */
router.put('/salones/:id', validarSalon, clearCache, actualizarSalon);

/**
 * @swagger
 * /api/v1/salones/{id}:
 *   delete:
 *     summary: Eliminar un salón (soft delete)
 *     tags: [Salones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del salón
 *     responses:
 *       200:
 *         description: Salón eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JSendSuccess'
 *       404:
 *         description: Salón no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JSendFail'
 */
router.delete('/salones/:id', clearCache, eliminarSalon);
// TODO: PATCH 

export default router;
