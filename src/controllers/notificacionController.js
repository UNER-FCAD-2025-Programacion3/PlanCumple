import EmailService from '../services/emailService.js';
import JSendResponse from '../utils/jsendResponse.js';

class NotificacionController {
    constructor() {
        this.emailService = EmailService.getInstance();
    }

    async enviarNotificacion(req, res) {
        try {
            const { fecha, salon, turno, correoDestino } = req.body;

            if (!fecha || !salon || !turno || !correoDestino) {
                return res.status(400).json(JSendResponse.fail({
                    validation: 'Faltan datos requeridos: fecha, salon, turno y correoDestino son obligatorios'
                }));
            }

            await this.emailService.enviarEmailReserva({
                fecha,
                salon,
                turno,
                correoDestino
            });

            res.status(200).json(JSendResponse.success({
                message: 'Correo enviado exitosamente',
                correoDestino,
                fecha
            }));
        } catch (error) {
            console.error(error);
            res.status(500).json(JSendResponse.error('Error al enviar el correo'));
        }
    }
}

export default NotificacionController;