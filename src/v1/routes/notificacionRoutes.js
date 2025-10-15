import express from 'express';
import NotificacionController from '../../controllers/notificacionController.js';

const router = express.Router();
const notificacionController = new NotificacionController();

router.post('/notificacion', notificacionController.enviarNotificacion.bind(notificacionController));

export default router;