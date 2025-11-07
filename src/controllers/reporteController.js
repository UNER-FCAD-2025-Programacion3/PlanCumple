import ReporteService from '../services/reporteService.js';
import JSendResponse from '../utils/jsendResponse.js';

class ReporteController {
    constructor() {
        this.reporteService = ReporteService.getInstance();
    }

    // GET /api/v1/reportes/reservas/pdf
    generarReporteReservasPDF = async (req, res) => {
        try {
            const pdf = await this.reporteService.generarReporteReservasPDF();

            // Configurar headers para descarga de PDF
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="reporte-reservas-${new Date().toISOString().split('T')[0]}.pdf"`);
            res.setHeader('Content-Length', pdf.length);

            res.send(pdf);

        } catch (error) {
            console.error('Error al generar reporte PDF:', error);
            res.status(500).json(JSendResponse.error('Error al generar reporte PDF'));
        }
    };
}

export default ReporteController;