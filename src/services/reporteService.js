import puppeteer from 'puppeteer';
import handlebars from 'handlebars';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { ReporteModel } from '../models/reporteModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ReporteService {
    static instance = null;

    static getInstance() {
        if (!ReporteService.instance) {
            ReporteService.instance = new ReporteService();
        }
        return ReporteService.instance;
    }

    async generarReporteReservasPDF() {
        try {
            // 1. Obtener datos del SP
            const reservas = await ReporteModel.obtenerReporteReservasBasico();

            // 2. Leer template
            const templatePath = path.join(__dirname, '../utils/handlebars/reporte-reservas.hbs');
            const templateContent = await fs.readFile(templatePath, 'utf-8');

            // 3. Compilar template con datos
            const template = handlebars.compile(templateContent);
            const html = template({
                reservas,
                fechaReporte: new Date().toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                totalReservas: reservas.length
            });

            // 4. Generar PDF con Puppeteer
            const browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });

            const page = await browser.newPage();
            await page.setContent(html, { waitUntil: 'networkidle0' });

            const pdf = await page.pdf({
                format: 'A4',
                printBackground: true,
                margin: {
                    top: '20px',
                    right: '20px',
                    bottom: '20px',
                    left: '20px'
                }
            });

            await browser.close();

            return pdf;

        } catch (error) {
            throw new Error(`Error al generar reporte PDF: ${error.message}`);
        }
    }
}

export default ReporteService;