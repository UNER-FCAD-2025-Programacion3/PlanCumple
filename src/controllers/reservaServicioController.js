import ReservaServicioService from '../services/reservaServicioService.js';
import JSendResponse from '../utils/jsendResponse.js';

class ReservaServicioController {
    constructor() {
        this.reservaServicioService = ReservaServicioService.getInstance();
    }

    async obtenerReservasServicios(req, res) {
        try {
            const reservasServicios = await this.reservaServicioService.obtenerTodos();
            res.status(200).json(JSendResponse.success(reservasServicios));
        } catch (error) {
            console.error('Error al obtener reservas de servicios:', error);
            res.status(500).json(JSendResponse.error('Error interno del servidor'));
        }
    }

    async obtenerReservaServicioPorId(req, res) {
        try {
            const { id } = req.params;
            const reservaServicio = await this.reservaServicioService.obtenerPorId(id);
            
            if (!reservaServicio) {
                return res.status(404).json(JSendResponse.fail({ 
                    reserva_servicio_id: `No se encontró ninguna reserva de servicio con el ID: ${id}` 
                }));
            }

            res.status(200).json(JSendResponse.success(reservaServicio));
        } catch (error) {
            console.error('Error al obtener reserva de servicio:', error);
            res.status(500).json(JSendResponse.error('Error interno del servidor'));
        }
    }

    async obtenerServiciosPorReserva(req, res) {
        try {
            const { reservaId } = req.params;
            const servicios = await this.reservaServicioService.obtenerPorReserva(reservaId);
            res.status(200).json(JSendResponse.success(servicios));
        } catch (error) {
            console.error('Error al obtener servicios por reserva:', error);
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

    async obtenerReservasPorServicio(req, res) {
        try {
            const { servicioId } = req.params;
            const reservas = await this.reservaServicioService.obtenerPorServicio(servicioId);
            res.status(200).json(JSendResponse.success(reservas));
        } catch (error) {
            console.error('Error al obtener reservas por servicio:', error);
            if (error.message.includes('No se encontró')) {
                return res.status(404).json(JSendResponse.fail({ 
                    servicio_id: error.message 
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

    async crearReservaServicio(req, res) {
        try {
            const { reserva_id, servicio_id, importe } = req.body;

            const nueva = await this.reservaServicioService.crear({ 
                reserva_id, 
                servicio_id, 
                importe 
            });

            res.status(201).json(JSendResponse.success(nueva));
        } catch (error) {
            console.error('Error al crear reserva de servicio:', error);
            if (error.message.includes('obligatorios') || 
                error.message.includes('No se encontró') ||
                error.message.includes('número entero positivo') ||
                error.message.includes('número positivo') ||
                error.message.includes('ya está asignado') ||
                error.message.includes('exceder')) {
                return res.status(400).json(JSendResponse.fail({ 
                    validation: error.message 
                }));
            }
            res.status(500).json(JSendResponse.error('Error interno del servidor'));
        }
    }

    async actualizarReservaServicio(req, res) {
        try {
            const { id } = req.params;
            const { reserva_id, servicio_id, importe } = req.body;

            const actualizada = await this.reservaServicioService.actualizar(id, { 
                reserva_id, 
                servicio_id, 
                importe 
            });

            res.status(200).json(JSendResponse.success(actualizada));
        } catch (error) {
            console.error('Error al actualizar reserva de servicio:', error);
            if (error.message.includes('No se encontró')) {
                return res.status(404).json(JSendResponse.fail({ 
                    reserva_servicio_id: error.message 
                }));
            }
            if (error.message.includes('ID inválido') ||
                error.message.includes('número entero positivo') ||
                error.message.includes('número positivo') ||
                error.message.includes('ya está asignado') ||
                error.message.includes('exceder')) {
                return res.status(400).json(JSendResponse.fail({ 
                    validation: error.message 
                }));
            }
            res.status(500).json(JSendResponse.error('Error interno del servidor'));
        }
    }

    async eliminarReservaServicio(req, res) {
        try {
            const { id } = req.params;
            const eliminada = await this.reservaServicioService.eliminar(id);
            
            if (eliminada) {
                return res.status(200).json(JSendResponse.success({ 
                    reserva_servicio_id: parseInt(id),
                    message: 'Reserva de servicio eliminada exitosamente' 
                }));
            }
            
            res.status(500).json(JSendResponse.error('No se pudo completar la solicitud de eliminación'));
        } catch (error) {
            console.error('Error al eliminar reserva de servicio:', error);
            if (error.message.includes('No se encontró')) {
                return res.status(404).json(JSendResponse.fail({ 
                    reserva_servicio_id: error.message 
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

    async eliminarServiciosPorReserva(req, res) {
        try {
            const { reservaId } = req.params;
            const eliminados = await this.reservaServicioService.eliminarPorReserva(reservaId);
            
            res.status(200).json(JSendResponse.success({ 
                reserva_id: parseInt(reservaId),
                servicios_eliminados: eliminados,
                message: `${eliminados} servicio(s) eliminado(s) de la reserva exitosamente` 
            }));
        } catch (error) {
            console.error('Error al eliminar servicios por reserva:', error);
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

    async obtenerTotalImportesPorReserva(req, res) {
        try {
            const { reservaId } = req.params;
            const total = await this.reservaServicioService.obtenerTotalImportesPorReserva(reservaId);
            
            res.status(200).json(JSendResponse.success({ 
                reserva_id: parseInt(reservaId),
                total_servicios: total 
            }));
        } catch (error) {
            console.error('Error al obtener total de importes:', error);
            if (error.message.includes('ID inválido')) {
                return res.status(400).json(JSendResponse.fail({ 
                    validation: error.message 
                }));
            }
            res.status(500).json(JSendResponse.error('Error interno del servidor'));
        }
    }

    async obtenerEstadisticas(req, res) {
        try {
            const estadisticas = await this.reservaServicioService.obtenerEstadisticas();
            res.status(200).json(JSendResponse.success(estadisticas));
        } catch (error) {
            console.error('Error al obtener estadísticas:', error);
            res.status(500).json(JSendResponse.error('Error interno del servidor'));
        }
    }

    async crearMultiplesServicios(req, res) {
        try {
            const { reservaId } = req.params;
            const { servicios } = req.body;

            if (!Array.isArray(servicios)) {
                return res.status(400).json(JSendResponse.fail({ 
                    validation: 'El campo servicios debe ser un array' 
                }));
            }

            const nuevos = await this.reservaServicioService.crearMultiples(reservaId, servicios);
            res.status(201).json(JSendResponse.success(nuevos));
        } catch (error) {
            console.error('Error al crear múltiples servicios:', error);
            if (error.message.includes('ID inválido') ||
                error.message.includes('No se encontró') ||
                error.message.includes('al menos un servicio') ||
                error.message.includes('ID válido') ||
                error.message.includes('importe válido') ||
                error.message.includes('exceder') ||
                error.message.includes('duplicados')) {
                return res.status(400).json(JSendResponse.fail({ 
                    validation: error.message 
                }));
            }
            res.status(500).json(JSendResponse.error('Error interno del servidor'));
        }
    }

    async actualizarServiciosDeReserva(req, res) {
        try {
            const { reservaId } = req.params;
            const { servicios } = req.body;

            if (!Array.isArray(servicios)) {
                return res.status(400).json(JSendResponse.fail({ 
                    validation: 'El campo servicios debe ser un array' 
                }));
            }

            const actualizados = await this.reservaServicioService.actualizarServiciosDeReserva(reservaId, servicios);
            res.status(200).json(JSendResponse.success(actualizados));
        } catch (error) {
            console.error('Error al actualizar servicios de reserva:', error);
            if (error.message.includes('ID inválido') ||
                error.message.includes('No se encontró') ||
                error.message.includes('ID válido') ||
                error.message.includes('importe válido') ||
                error.message.includes('exceder') ||
                error.message.includes('duplicados')) {
                return res.status(400).json(JSendResponse.fail({ 
                    validation: error.message 
                }));
            }
            res.status(500).json(JSendResponse.error('Error interno del servidor'));
        }
    }
}

const reservaServicioController = new ReservaServicioController();

export const obtenerReservasServicios = reservaServicioController.obtenerReservasServicios.bind(reservaServicioController);
export const obtenerReservaServicioPorId = reservaServicioController.obtenerReservaServicioPorId.bind(reservaServicioController);
export const obtenerServiciosPorReserva = reservaServicioController.obtenerServiciosPorReserva.bind(reservaServicioController);
export const obtenerReservasPorServicio = reservaServicioController.obtenerReservasPorServicio.bind(reservaServicioController);
export const crearReservaServicio = reservaServicioController.crearReservaServicio.bind(reservaServicioController);
export const actualizarReservaServicio = reservaServicioController.actualizarReservaServicio.bind(reservaServicioController);
export const eliminarReservaServicio = reservaServicioController.eliminarReservaServicio.bind(reservaServicioController);
export const eliminarServiciosPorReserva = reservaServicioController.eliminarServiciosPorReserva.bind(reservaServicioController);
export const obtenerTotalImportesPorReserva = reservaServicioController.obtenerTotalImportesPorReserva.bind(reservaServicioController);
export const obtenerEstadisticas = reservaServicioController.obtenerEstadisticas.bind(reservaServicioController);
export const crearMultiplesServicios = reservaServicioController.crearMultiplesServicios.bind(reservaServicioController);
export const actualizarServiciosDeReserva = reservaServicioController.actualizarServiciosDeReserva.bind(reservaServicioController);

export default ReservaServicioController;