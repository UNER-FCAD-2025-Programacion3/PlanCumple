import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';

class EmailService {
    static instance = null;
    
    static getInstance() {
        if (!EmailService.instance) {
            EmailService.instance = new EmailService();
        }
        return EmailService.instance;
    }
    
    constructor() {
        // Si ya existe una instancia, devuélvela
        if (EmailService.instance) {
            return EmailService.instance;
        }
        
        // Si no, crea una nueva instancia (este será el constructor real)
        this.transporter = null;
        // Guardar la referencia
        EmailService.instance = this;
    }

    // Método que implementa lazy loading para el transporter
    getTransporter() {
        // Solo crea el transporter si aún no existe (lazy loading)
        if (!this.transporter) {
            if (!process.env.NODEMAILER_USER_EMAIL || !process.env.NODEMAILER_PASSAPP_EMAIL) {
                throw new Error('Faltan las credenciales de correo en las variables de entorno');
            }
    
            this.transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.NODEMAILER_USER_EMAIL,
                    pass: process.env.NODEMAILER_PASSAPP_EMAIL,
                },
            });
        }
        
        return this.transporter;
    }

    async enviarEmailReserva({ fecha, salon, turno, correoDestino }) {
        if (!fecha || !salon || !turno || !correoDestino) {
            throw new Error('Todos los parámetros son requeridos: fecha, salon, turno, correoDestino');
        }

        // Obtener el transporter (será creado solo la primera vez)
        const transporter = this.getTransporter();

        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const plantilla = path.join(__dirname, '..', 'utils', 'handlebars', 'plantilla.hbs');

        const archivoHbs = await readFile(plantilla, 'utf-8');
        const template = handlebars.compile(archivoHbs);

        const html = template({ fecha, salon, turno });

        const opciones = {
            from: process.env.NODEMAILER_USER_EMAIL,
            to: correoDestino,
            subject: 'Nueva Reserva - Casa de Cumpleaños',
            html: html
        };

        try {
            const info = await transporter.sendMail(opciones);
            return info;
        } catch (error) {
            console.error('Error enviando email:', error);
            throw new Error(`Error al enviar email: ${error.message}`);
        }
    }
}

export default EmailService;