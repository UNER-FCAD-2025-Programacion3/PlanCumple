import express from 'express';
import apicache from 'apicache';
import {
    obtenerUsuarios,
    obtenerUsuarioPorId,
    obtenerUsuarioPorNombreUsuario,
    crearUsuario,
    actualizarUsuario,
    actualizarContrasenia,
    eliminarUsuario,
    obtenerUsuariosPorTipo,
    autenticarUsuario,
    obtenerEstadisticas
} from '../../controllers/usuarioController.js';
import { 
    validarUsuario, 
    validarActualizacionUsuario, 
    validarCambioContrasenia,
    validarAutenticacion 
} from '../../middleware/usuarioValidation.js';

const router = express.Router();
let cache = apicache.middleware;

const clearCache = (req, res, next) => {
    apicache.clear();
    next();
};

// Rutas públicas (sin caché por seguridad)
router.post('/usuarios/auth', validarAutenticacion, autenticarUsuario);

// Rutas con caché
router.get('/usuarios', cache('5 minutes'), obtenerUsuarios);
router.get('/usuarios/estadisticas', cache('10 minutes'), obtenerEstadisticas);
router.get('/usuarios/tipo/:tipo', cache('5 minutes'), obtenerUsuariosPorTipo);
router.get('/usuarios/:id', cache('3 minutes'), obtenerUsuarioPorId);
router.get('/usuarios/nombre/:nombreUsuario', cache('3 minutes'), obtenerUsuarioPorNombreUsuario);

// Rutas de modificación (limpian caché)
router.post('/usuarios', validarUsuario, clearCache, crearUsuario);
router.put('/usuarios/:id', validarActualizacionUsuario, clearCache, actualizarUsuario);
router.patch('/usuarios/:id/contrasenia', validarCambioContrasenia, clearCache, actualizarContrasenia);
router.delete('/usuarios/:id', clearCache, eliminarUsuario);

export default router;