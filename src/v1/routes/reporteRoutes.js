import { Router } from 'express';
import ReporteController from '../../controllers/reporteController.js';

const router = Router();
const reporteController = new ReporteController();

// GET /api/v1/reportes/reservas/pdf - Generar reporte de reservas en PDF
router.get('/reportes/reservas/pdf', reporteController.generarReporteReservasPDF);

export default router;