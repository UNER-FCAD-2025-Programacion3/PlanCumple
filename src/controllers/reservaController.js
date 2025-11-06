import ReservaService from '../services/reservaService.js';
import JSendResponse from '../utils/jsendResponse.js';

class ReservaController {
    constructor() {
        this.reservaService = ReservaService.getInstance();
    }

    async obtenerReservas(req, res) {
        try {
            const reservas = await this.reservaService.obtenerTodas();
            res.status(200).json(JSendResponse.success(reservas));
        } catch (error) {
            console.error('Error al obtener reservas:', error);
            res.status(500).json(JSendResponse.error('Error interno del servidor'));
        }
    }

    async obtenerReservaPorId(req, res) {
        try {
            const { id } = req.params;
            const reserva = await this.reservaService.obtenerPorId(id);
            
            if (!reserva) {
                return res.status(404).json(JSendResponse.fail({ 
                    reserva_id: `No se encontró ninguna reserva con el ID: ${id}` 
                }));
            }

            res.status(200).json(JSendResponse.success(reserva));
        } catch (error) {
            console.error('Error al obtener reserva:', error);
            res.status(500).json(JSendResponse.error('Error interno del servidor'));
        }
    }

    async obtenerReservasPorUsuario(req, res) {
        try {
            const { usuarioId } = req.params;
            const reservas = await this.reservaService.obtenerPorUsuario(usuarioId);
            res.status(200).json(JSendResponse.success(reservas));
        } catch (error) {
            console.error('Error al obtener reservas por usuario:', error);
            if (error.message.includes('No se encontró')) {
                return res.status(404).json(JSendResponse.fail({ 
                    usuario_id: error.message 
                }));
            }
            if (error.message.includes('ID inválido')) {
                return res.status(400).json(JSendResponse.fail({ 
                    validation: error.message 
                }));
            }
            res.status(500).json(JSendResponse.error('Error interno del servidor'));
        }
    }

    async obtenerReservasPorSalon(req, res) {
        try {
            const { salonId } = req.params;
            const reservas = await this.reservaService.obtenerPorSalon(salonId);
            res.status(200).json(JSendResponse.success(reservas));
        } catch (error) {
            console.error('Error al obtener reservas por salón:', error);
            if (error.message.includes('No se encontró')) {
                return res.status(404).json(JSendResponse.fail({ 
                    salon_id: error.message 
                }));
            }
            if (error.message.includes('ID inválido')) {
                return res.status(400).json(JSendResponse.fail({ 
                    validation: error.message 
                }));
            }
            res.status(500).json(JSendResponse.error('Error interno del servidor'));
        }
    }

    async obtenerReservasPorFecha(req, res) {
        try {
            const { fecha } = req.params;
            const reservas = await this.reservaService.obtenerPorFecha(fecha);
            res.status(200).json(JSendResponse.success(reservas));
        } catch (error) {
            console.error('Error al obtener reservas por fecha:', error);
            if (error.message.includes('formato')) {
                return res.status(400).json(JSendResponse.fail({ 
                    validation: error.message 
                }));
            }
            res.status(500).json(JSendResponse.error('Error interno del servidor'));
        }
    }

    async obtenerReservasPorRangoFechas(req, res) {
        try {
            const { fechaInicio, fechaFin } = req.query;
            
            if (!fechaInicio || !fechaFin) {
                return res.status(400).json(JSendResponse.fail({ 
                    validation: 'Los parámetros fechaInicio y fechaFin son requeridos' 
                }));
            }

            const reservas = await this.reservaService.obtenerPorRangoFechas(fechaInicio, fechaFin);
            res.status(200).json(JSendResponse.success(reservas));
        } catch (error) {
            console.error('Error al obtener reservas por rango de fechas:', error);
            if (error.message.includes('formato') || error.message.includes('anterior')) {
                return res.status(400).json(JSendResponse.fail({ 
                    validation: error.message 
                }));
            }
            res.status(500).json(JSendResponse.error('Error interno del servidor'));
        }
    }

    async crearReserva(req, res) {
        try {
            const { 
                fecha_reserva, 
                salon_id, 
                usuario_id, 
                turno_id, 
                foto_cumpleaniero, 
                tematica,
                servicios // Array opcional de servicios: [{ servicio_id, importe }]
            } = req.body;

            const nueva = await this.reservaService.crear({ 
                fecha_reserva, 
                salon_id, 
                usuario_id, 
                turno_id, 
                foto_cumpleaniero, 
                tematica,
                servicios
            });

            res.status(201).json(JSendResponse.success(nueva));
        } catch (error) {
            console.error('Error al crear reserva:', error);
            if (error.message.includes('obligatorios') || 
                error.message.includes('formato') ||
                error.message.includes('pasadas') ||
                error.message.includes('No se encontró') ||
                error.message.includes('ya está reservado') ||
                error.message.includes('importe') ||
                error.message.includes('máximo') ||
                error.message.includes('positivo') ||
                error.message.includes('servicio_id') ||
                error.message.includes('Cada servicio')) {
                return res.status(400).json(JSendResponse.fail({ 
                    validation: error.message 
                }));
            }
            res.status(500).json(JSendResponse.error('Error interno del servidor'));
        }
    }

    async actualizarReserva(req, res) {
        try {
            const { id } = req.params;
            const { 
                fecha_reserva, 
                salon_id, 
                usuario_id, 
                turno_id, 
                foto_cumpleaniero, 
                tematica, 
                importe_salon, 
                importe_total 
            } = req.body;

            const actualizada = await this.reservaService.actualizar(id, { 
                fecha_reserva, 
                salon_id, 
                usuario_id, 
                turno_id, 
                foto_cumpleaniero, 
                tematica, 
                importe_salon, 
                importe_total 
            });

            res.status(200).json(JSendResponse.success(actualizada));
        } catch (error) {
            console.error('Error al actualizar reserva:', error);
            if (error.message.includes('No se encontró')) {
                return res.status(404).json(JSendResponse.fail({ 
                    reserva_id: error.message 
                }));
            }
            if (error.message.includes('ID inválido') ||
                error.message.includes('formato') ||
                error.message.includes('pasadas') ||
                error.message.includes('ya está reservado') ||
                error.message.includes('importe') ||
                error.message.includes('máximo') ||
                error.message.includes('positivo')) {
                return res.status(400).json(JSendResponse.fail({ 
                    validation: error.message 
                }));
            }
            res.status(500).json(JSendResponse.error('Error interno del servidor'));
        }
    }

    async eliminarReserva(req, res) {
        try {
            const { id } = req.params;
            const eliminada = await this.reservaService.eliminar(id);
            
            if (eliminada) {
                return res.status(200).json(JSendResponse.success({ 
                    reserva_id: parseInt(id),
                    message: 'Reserva eliminada exitosamente' 
                }));
            }
            
            res.status(500).json(JSendResponse.error('No se pudo completar la solicitud de eliminación'));
        } catch (error) {
            console.error('Error al eliminar reserva:', error);
            if (error.message.includes('No se encontró')) {
                return res.status(404).json(JSendResponse.fail({ 
                    reserva_id: error.message 
                }));
            }
            if (error.message.includes('ID inválido')) {
                return res.status(400).json(JSendResponse.fail({ 
                    validation: error.message 
                }));
            }
            res.status(500).json(JSendResponse.error('Error interno del servidor'));
        }
    }

    async verificarDisponibilidad(req, res) {
        try {
            const { salonId, fechaReserva, turnoId } = req.query;
            const { excludeReservaId } = req.query;
            
            if (!salonId || !fechaReserva || !turnoId) {
                return res.status(400).json(JSendResponse.fail({ 
                    validation: 'Los parámetros salonId, fechaReserva y turnoId son requeridos' 
                }));
            }

            const disponible = await this.reservaService.verificarDisponibilidad(
                salonId, 
                fechaReserva, 
                turnoId, 
                excludeReservaId || null
            );

            res.status(200).json(JSendResponse.success({ 
                disponible,
                salon_id: parseInt(salonId),
                fecha_reserva: fechaReserva,
                turno_id: parseInt(turnoId)
            }));
        } catch (error) {
            console.error('Error al verificar disponibilidad:', error);
            if (error.message.includes('requeridos') || error.message.includes('formato')) {
                return res.status(400).json(JSendResponse.fail({ 
                    validation: error.message 
                }));
            }
            res.status(500).json(JSendResponse.error('Error interno del servidor'));
        }
    }

    async obtenerEstadisticas(req, res) {
        try {
            const estadisticas = await this.reservaService.obtenerEstadisticas();
            res.status(200).json(JSendResponse.success(estadisticas));
        } catch (error) {
            console.error('Error al obtener estadísticas:', error);
            res.status(500).json(JSendResponse.error('Error interno del servidor'));
        }
    }

    async obtenerReservasProximas(req, res) {
        try {
            const { dias } = req.query;
            const diasAdelante = dias ? parseInt(dias) : 7;
            
            const reservas = await this.reservaService.obtenerReservasProximas(diasAdelante);
            res.status(200).json(JSendResponse.success(reservas));
        } catch (error) {
            console.error('Error al obtener reservas próximas:', error);
            if (error.message.includes('entero positivo')) {
                return res.status(400).json(JSendResponse.fail({ 
                    validation: error.message 
                }));
            }
            res.status(500).json(JSendResponse.error('Error interno del servidor'));
        }
    }

    async recalcularImporteTotal(req, res) {
        try {
            const { id } = req.params;
            
            const resultado = await this.reservaService.recalcularImporteTotal(id);
            res.status(200).json(JSendResponse.success(resultado));
        } catch (error) {
            console.error('Error al recalcular importe total:', error);
            if (error.message.includes('No se encontró')) {
                return res.status(404).json(JSendResponse.fail({ 
                    reserva_id: error.message 
                }));
            }
            if (error.message.includes('ID inválido')) {
                return res.status(400).json(JSendResponse.fail({ 
                    validation: error.message 
                }));
            }
            res.status(500).json(JSendResponse.error('Error interno del servidor'));
        }
    }
}

const reservaController = new ReservaController();

export const obtenerReservas = reservaController.obtenerReservas.bind(reservaController);
export const obtenerReservaPorId = reservaController.obtenerReservaPorId.bind(reservaController);
export const obtenerReservasPorUsuario = reservaController.obtenerReservasPorUsuario.bind(reservaController);
export const obtenerReservasPorSalon = reservaController.obtenerReservasPorSalon.bind(reservaController);
export const obtenerReservasPorFecha = reservaController.obtenerReservasPorFecha.bind(reservaController);
export const obtenerReservasPorRangoFechas = reservaController.obtenerReservasPorRangoFechas.bind(reservaController);
export const crearReserva = reservaController.crearReserva.bind(reservaController);
export const actualizarReserva = reservaController.actualizarReserva.bind(reservaController);
export const eliminarReserva = reservaController.eliminarReserva.bind(reservaController);
export const verificarDisponibilidad = reservaController.verificarDisponibilidad.bind(reservaController);
export const obtenerEstadisticas = reservaController.obtenerEstadisticas.bind(reservaController);
export const obtenerReservasProximas = reservaController.obtenerReservasProximas.bind(reservaController);
export const recalcularImporteTotal = reservaController.recalcularImporteTotal.bind(reservaController);

export default ReservaController;