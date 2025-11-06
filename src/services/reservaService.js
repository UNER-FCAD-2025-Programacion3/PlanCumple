import { ReservaModel } from '../models/reservaModel.js';
import { UsuarioModel } from '../models/usuarioModel.js';
import { SalonModel } from '../models/salonModel.js';
import { TurnoModel } from '../models/turnoModel.js';
import { ReservaServicioModel } from '../models/reservaServicioModel.js';

class ReservaService {
    static instance = null;

    static getInstance() {
        if (!ReservaService.instance) {
            ReservaService.instance = new ReservaService();
        }
        return ReservaService.instance;
    }

    constructor() {
        if (ReservaService.instance) return ReservaService.instance;
        ReservaService.instance = this;
    }

    async obtenerTodas() {
        try {
            return await ReservaModel.obtenerTodas();
        } catch (error) {
            console.error('Error en ReservaService al obtener todas las reservas:', error);
            throw new Error('Error al obtener la lista de reservas');
        }
    }

    async obtenerPorId(id) {
        try {
            if (!id || isNaN(parseInt(id))) {
                throw new Error('ID inválido proporcionado');
            }
            return await ReservaModel.obtenerPorId(id);
        } catch (error) {
            console.error('Error en ReservaService al obtener reserva por ID:', error);
            throw new Error(`Error al obtener la reserva con ID: ${id}`);
        }
    }

    async obtenerPorUsuario(usuarioId) {
        try {
            if (!usuarioId || isNaN(parseInt(usuarioId))) {
                throw new Error('ID de usuario inválido proporcionado');
            }

            // Verificar que el usuario existe
            const usuarioExiste = await UsuarioModel.existe(usuarioId);
            if (!usuarioExiste) {
                throw new Error(`No se encontró ningún usuario con el ID: ${usuarioId}`);
            }

            return await ReservaModel.obtenerPorUsuario(usuarioId);
        } catch (error) {
            console.error('Error en ReservaService al obtener reservas por usuario:', error);
            throw error;
        }
    }

    async obtenerPorSalon(salonId) {
        try {
            if (!salonId || isNaN(parseInt(salonId))) {
                throw new Error('ID de salón inválido proporcionado');
            }

            // Verificar que el salón existe
            const salonExiste = await SalonModel.existe(salonId);
            if (!salonExiste) {
                throw new Error(`No se encontró ningún salón con el ID: ${salonId}`);
            }

            return await ReservaModel.obtenerPorSalon(salonId);
        } catch (error) {
            console.error('Error en ReservaService al obtener reservas por salón:', error);
            throw error;
        }
    }

    async obtenerPorFecha(fecha) {
        try {
            if (!fecha) {
                throw new Error('Fecha inválida proporcionada');
            }

            // Validar formato de fecha
            const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!fechaRegex.test(fecha)) {
                throw new Error('La fecha debe tener el formato YYYY-MM-DD');
            }

            return await ReservaModel.obtenerPorFecha(fecha);
        } catch (error) {
            console.error('Error en ReservaService al obtener reservas por fecha:', error);
            throw error;
        }
    }

    async obtenerPorRangoFechas(fechaInicio, fechaFin) {
        try {
            if (!fechaInicio || !fechaFin) {
                throw new Error('Fechas de inicio y fin son requeridas');
            }

            // Validar formato de fechas
            const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!fechaRegex.test(fechaInicio) || !fechaRegex.test(fechaFin)) {
                throw new Error('Las fechas deben tener el formato YYYY-MM-DD');
            }

            // Validar que fecha inicio sea anterior a fecha fin
            if (new Date(fechaInicio) > new Date(fechaFin)) {
                throw new Error('La fecha de inicio debe ser anterior a la fecha de fin');
            }

            return await ReservaModel.obtenerPorRangoFechas(fechaInicio, fechaFin);
        } catch (error) {
            console.error('Error en ReservaService al obtener reservas por rango de fechas:', error);
            throw error;
        }
    }

    async crear(datosReserva) {
        try {
            const { 
                fecha_reserva, 
                salon_id, 
                usuario_id, 
                turno_id, 
                foto_cumpleaniero, 
                tematica,
                servicios = [] // Array de servicios opcionales
            } = datosReserva;

            // Validaciones básicas
            if (!fecha_reserva || !salon_id || !usuario_id || !turno_id) {
                throw new Error('Los campos fecha_reserva, salon_id, usuario_id y turno_id son obligatorios');
            }

            // Validar formato de fecha
            const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!fechaRegex.test(fecha_reserva)) {
                throw new Error('La fecha debe tener el formato YYYY-MM-DD');
            }

            // Validar que la fecha no sea en el pasado
            const fechaReserva = new Date(fecha_reserva);
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);
            
            if (fechaReserva < hoy) {
                throw new Error('No se pueden hacer reservas para fechas pasadas');
            }

            // Verificar que el usuario existe
            const usuarioExiste = await UsuarioModel.existe(usuario_id);
            if (!usuarioExiste) {
                throw new Error(`No se encontró ningún usuario con el ID: ${usuario_id}`);
            }

            // Verificar que el salón existe y obtener su importe
            const salon = await SalonModel.obtenerPorId(salon_id);
            if (!salon) {
                throw new Error(`No se encontró ningún salón con el ID: ${salon_id}`);
            }

            // Verificar que el turno existe
            const turnoExiste = await TurnoModel.existe(turno_id);
            if (!turnoExiste) {
                throw new Error(`No se encontró ningún turno con el ID: ${turno_id}`);
            }

            // Verificar disponibilidad
            const disponible = await ReservaModel.verificarDisponibilidad(salon_id, fecha_reserva, turno_id);
            if (!disponible) {
                throw new Error('El salón ya está reservado para esa fecha y turno');
            }

            // Validar longitud de campos de texto
            if (foto_cumpleaniero && foto_cumpleaniero.length > 255) {
                throw new Error('La URL de la foto del cumpleañero debe tener máximo 255 caracteres');
            }

            if (tematica && tematica.length > 255) {
                throw new Error('La temática debe tener máximo 255 caracteres');
            }

            // Calcular el importe total inicial (solo salón, los servicios se añadirán después si los hay)
            const importeSalon = parseFloat(salon.importe);
            const importeTotal = importeSalon; // Inicialmente solo el salón

            const datosParaCrear = {
                fecha_reserva,
                salon_id: parseInt(salon_id),
                usuario_id: parseInt(usuario_id),
                turno_id: parseInt(turno_id),
                foto_cumpleaniero: foto_cumpleaniero && foto_cumpleaniero.trim() !== '' ? foto_cumpleaniero.trim() : null,
                tematica: tematica && tematica.trim() !== '' ? tematica.trim() : null,
                importe_salon: importeSalon,
                importe_total: importeTotal
            };

            // Crear la reserva
            const reservaCreada = await ReservaModel.crear(datosParaCrear);

            // Si se proporcionaron servicios, añadirlos y recalcular el total
            if (servicios && servicios.length > 0) {
                let totalServicios = 0;
                
                // Agregar cada servicio
                for (const servicio of servicios) {
                    if (!servicio.servicio_id || !servicio.importe) {
                        throw new Error('Cada servicio debe tener servicio_id e importe');
                    }
                    
                    await ReservaServicioModel.crear({
                        reserva_id: reservaCreada.reserva_id,
                        servicio_id: servicio.servicio_id,
                        importe: parseFloat(servicio.importe)
                    });
                    
                    totalServicios += parseFloat(servicio.importe);
                }
                
                // Actualizar el importe total
                const nuevoImporteTotal = importeSalon + totalServicios;
                await ReservaModel.actualizarImporteTotal(reservaCreada.reserva_id, importeSalon, totalServicios);
                
                // Actualizar el objeto reserva con el nuevo total
                reservaCreada.importe_total = nuevoImporteTotal;
            }

            return reservaCreada;
        } catch (error) {
            console.error('Error en ReservaService al crear reserva:', error);
            throw error;
        }
    }

    async actualizar(id, datosReserva) {
        try {
            if (!id || isNaN(parseInt(id))) {
                throw new Error('ID inválido proporcionado');
            }

            const existe = await this.existe(id);
            if (!existe) {
                throw new Error(`No se encontró ninguna reserva con el ID: ${id}`);
            }

            const { 
                fecha_reserva, 
                salon_id, 
                usuario_id, 
                turno_id, 
                foto_cumpleaniero, 
                tematica, 
                importe_salon, 
                importe_total 
            } = datosReserva;

            let importeSalonFinal = importe_salon;

            // Si se cambió el salón, obtener su nuevo importe
            if (salon_id) {
                const salon = await SalonModel.obtenerPorId(salon_id);
                if (!salon) {
                    throw new Error(`No se encontró ningún salón con el ID: ${salon_id}`);
                }
                importeSalonFinal = parseFloat(salon.importe);
            }

            // Validaciones si se proporcionan los campos
            if (fecha_reserva) {
                const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
                if (!fechaRegex.test(fecha_reserva)) {
                    throw new Error('La fecha debe tener el formato YYYY-MM-DD');
                }

                // Validar que la fecha no sea en el pasado
                const fechaReserva = new Date(fecha_reserva);
                const hoy = new Date();
                hoy.setHours(0, 0, 0, 0);
                
                if (fechaReserva < hoy) {
                    throw new Error('No se pueden hacer reservas para fechas pasadas');
                }
            }

            if (usuario_id) {
                const usuarioExiste = await UsuarioModel.existe(usuario_id);
                if (!usuarioExiste) {
                    throw new Error(`No se encontró ningún usuario con el ID: ${usuario_id}`);
                }
            }

            if (turno_id) {
                const turnoExiste = await TurnoModel.existe(turno_id);
                if (!turnoExiste) {
                    throw new Error(`No se encontró ningún turno con el ID: ${turno_id}`);
                }
            }

            // Verificar disponibilidad solo si se están cambiando salon_id, fecha_reserva o turno_id
            if (salon_id || fecha_reserva || turno_id) {
                const reservaActual = await ReservaModel.obtenerPorId(id);
                const salonFinal = salon_id || reservaActual.salon_id;
                const fechaFinal = fecha_reserva || reservaActual.fecha_reserva;
                const turnoFinal = turno_id || reservaActual.turno_id;

                const disponible = await ReservaModel.verificarDisponibilidad(salonFinal, fechaFinal, turnoFinal, id);
                if (!disponible) {
                    throw new Error('El salón ya está reservado para esa fecha y turno');
                }
            }

            // Validar importes si se proporcionan manualmente
            if (importe_salon !== undefined && importe_salon !== null) {
                if (isNaN(parseFloat(importe_salon)) || parseFloat(importe_salon) < 0) {
                    throw new Error('El importe del salón debe ser un número positivo');
                }
                importeSalonFinal = parseFloat(importe_salon);
            }

            if (importe_total !== undefined && importe_total !== null) {
                if (isNaN(parseFloat(importe_total)) || parseFloat(importe_total) < 0) {
                    throw new Error('El importe total debe ser un número positivo');
                }
            }

            // Validar longitud de campos de texto
            if (foto_cumpleaniero && foto_cumpleaniero.length > 255) {
                throw new Error('La URL de la foto del cumpleañero debe tener máximo 255 caracteres');
            }

            if (tematica && tematica.length > 255) {
                throw new Error('La temática debe tener máximo 255 caracteres');
            }

            const datosParaActualizar = {
                fecha_reserva,
                salon_id: salon_id ? parseInt(salon_id) : undefined,
                usuario_id: usuario_id ? parseInt(usuario_id) : undefined,
                turno_id: turno_id ? parseInt(turno_id) : undefined,
                foto_cumpleaniero: foto_cumpleaniero !== undefined ? 
                    (foto_cumpleaniero && foto_cumpleaniero.trim() !== '' ? foto_cumpleaniero.trim() : null) : undefined,
                tematica: tematica !== undefined ? 
                    (tematica && tematica.trim() !== '' ? tematica.trim() : null) : undefined,
                importe_salon: importeSalonFinal !== undefined ? importeSalonFinal : undefined,
                importe_total: importe_total !== undefined ? 
                    (importe_total !== null ? parseFloat(importe_total) : null) : undefined
            };

            // Remover campos undefined
            Object.keys(datosParaActualizar).forEach(key => 
                datosParaActualizar[key] === undefined && delete datosParaActualizar[key]
            );

            const reservaActualizada = await ReservaModel.actualizar(id, datosParaActualizar);

            // Si se cambió el salón o se quiere recalcular automáticamente, actualizar el importe total
            if (salon_id && !importe_total) {
                await this.recalcularImporteTotal(id);
                // Obtener la reserva actualizada con el nuevo total
                return await ReservaModel.obtenerPorId(id);
            }

            return reservaActualizada;
        } catch (error) {
            console.error('Error en ReservaService al actualizar reserva:', error);
            throw error;
        }
    }

    async eliminar(id) {
        try {
            if (!id || isNaN(parseInt(id))) {
                throw new Error('ID inválido proporcionado');
            }

            const existe = await this.existe(id);
            if (!existe) {
                throw new Error(`No se encontró ninguna reserva con el ID: ${id}`);
            }

            return await ReservaModel.eliminarLogico(id);
        } catch (error) {
            console.error('Error en ReservaService al eliminar reserva:', error);
            throw error;
        }
    }

    async existe(id) {
        try {
            return await ReservaModel.existe(id);
        } catch (error) {
            console.error('Error en ReservaService al verificar existencia:', error);
            throw new Error('Error al verificar la existencia de la reserva');
        }
    }

    async verificarDisponibilidad(salonId, fechaReserva, turnoId, excludeReservaId = null) {
        try {
            if (!salonId || !fechaReserva || !turnoId) {
                throw new Error('Salón ID, fecha de reserva y turno ID son requeridos para verificar disponibilidad');
            }

            // Validar formato de fecha
            const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!fechaRegex.test(fechaReserva)) {
                throw new Error('La fecha debe tener el formato YYYY-MM-DD');
            }

            return await ReservaModel.verificarDisponibilidad(salonId, fechaReserva, turnoId, excludeReservaId);
        } catch (error) {
            console.error('Error en ReservaService al verificar disponibilidad:', error);
            throw error;
        }
    }

    async obtenerEstadisticas() {
        try {
            return await ReservaModel.obtenerEstadisticas();
        } catch (error) {
            console.error('Error en ReservaService al obtener estadísticas:', error);
            throw new Error('Error al obtener estadísticas de reservas');
        }
    }

    async obtenerReservasProximas(diasAdelante = 7) {
        try {
            if (isNaN(parseInt(diasAdelante)) || parseInt(diasAdelante) < 1) {
                throw new Error('El número de días debe ser un entero positivo');
            }

            return await ReservaModel.obtenerReservasProximas(parseInt(diasAdelante));
        } catch (error) {
            console.error('Error en ReservaService al obtener reservas próximas:', error);
            throw error;
        }
    }

    async recalcularImporteTotal(reservaId) {
        try {
            // Obtener la reserva actual
            const reserva = await ReservaModel.obtenerPorId(reservaId);
            if (!reserva) {
                throw new Error(`No se encontró ninguna reserva con el ID: ${reservaId}`);
            }

            // Calcular el total de servicios
            const totalServicios = await ReservaModel.obtenerTotalServiciosPorReserva(reservaId);
            
            // Actualizar el importe total
            const nuevoImporteTotal = await ReservaModel.actualizarImporteTotal(
                reservaId, 
                reserva.importe_salon, 
                totalServicios
            );

            return {
                reserva_id: reservaId,
                importe_salon: parseFloat(reserva.importe_salon),
                total_servicios: totalServicios,
                importe_total: nuevoImporteTotal
            };
        } catch (error) {
            console.error('Error en ReservaService al recalcular importe total:', error);
            throw error;
        }
    }
}

export default ReservaService;