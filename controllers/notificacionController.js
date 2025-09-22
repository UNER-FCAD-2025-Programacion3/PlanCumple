import EmailService from '../services/emailService.js';

class NotificacionController {
    constructor() {
        this.emailService = EmailService.getInstance();
    }

    async enviarNotificacion(req, res) {
        try {
            const { fecha, salon, turno, correoDestino } = req.body;

            if (!fecha || !salon || !turno || !correoDestino) {
                return res.status(400).json({
                    estado: false, 
                    mensaje: 'Faltan datos requeridos!'
                });
            }

            await this.emailService.enviarEmailReserva({
                fecha,
                salon,
                turno,
                correoDestino
            });

            res.json({ ok: true, mensaje: 'Correo enviado exitosamente' });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                ok: false, 
                mensaje: 'Error al enviar el correo'
            });
        }
    }
}

export default NotificacionController;