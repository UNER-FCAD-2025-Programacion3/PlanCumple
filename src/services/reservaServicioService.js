import { ReservaServicioModel } from '../models/reservaServicioModel.js';
import { ReservaModel } from '../models/reservaModel.js';
import { ServicioModel } from '../models/servicioModel.js';

class ReservaServicioService {
    static instance = null;

    static getInstance() {
        if (!ReservaServicioService.instance) {
            ReservaServicioService.instance = new ReservaServicioService();
        }
        return ReservaServicioService.instance;
    }

    constructor() {
        if (ReservaServicioService.instance) return ReservaServicioService.instance;
        ReservaServicioService.instance = this;
    }

    async obtenerTodos() {
        try {
            return await ReservaServicioModel.obtenerTodos();
        } catch (error) {
            console.error('Error en ReservaServicioService al obtener todos:', error);
            throw new Error('Error al obtener la lista de reservas de servicios');
        }
    }

    async obtenerPorId(id) {
        try {
            if (!id || isNaN(parseInt(id))) {
                throw new Error('ID inválido proporcionado');
            }
            return await ReservaServicioModel.obtenerPorId(id);
        } catch (error) {
            console.error('Error en ReservaServicioService al obtener por ID:', error);
            throw new Error(`Error al obtener la reserva de servicio con ID: ${id}`);
        }
    }

    async obtenerPorReserva(reservaId) {
        try {
            if (!reservaId || isNaN(parseInt(reservaId))) {
                throw new Error('ID de reserva inválido proporcionado');
            }

            // Verificar que la reserva existe
            const reservaExiste = await ReservaModel.existe(reservaId);
            if (!reservaExiste) {
                throw new Error(`No se encontró ninguna reserva con el ID: ${reservaId}`);
            }

            return await ReservaServicioModel.obtenerPorReserva(reservaId);
        } catch (error) {
            console.error('Error en ReservaServicioService al obtener por reserva:', error);
            throw error;
        }
    }

    async obtenerPorServicio(servicioId) {
        try {
            if (!servicioId || isNaN(parseInt(servicioId))) {
                throw new Error('ID de servicio inválido proporcionado');
            }

            // Verificar que el servicio existe
            const servicioExiste = await ServicioModel.existe(servicioId);
            if (!servicioExiste) {
                throw new Error(`No se encontró ningún servicio con el ID: ${servicioId}`);
            }

            return await ReservaServicioModel.obtenerPorServicio(servicioId);
        } catch (error) {
            console.error('Error en ReservaServicioService al obtener por servicio:', error);
            throw error;
        }
    }

    async crear(datosReservaServicio) {
        try {
            const { reserva_id, servicio_id, importe } = datosReservaServicio;

            // Validaciones básicas
            if (!reserva_id || !servicio_id || importe === undefined || importe === null) {
                throw new Error('Los campos reserva_id, servicio_id e importe son obligatorios');
            }

            // Validar tipos de datos
            if (isNaN(parseInt(reserva_id)) || parseInt(reserva_id) < 1) {
                throw new Error('El ID de reserva debe ser un número entero positivo');
            }

            if (isNaN(parseInt(servicio_id)) || parseInt(servicio_id) < 1) {
                throw new Error('El ID de servicio debe ser un número entero positivo');
            }

            if (isNaN(parseFloat(importe)) || parseFloat(importe) < 0) {
                throw new Error('El importe debe ser un número positivo');
            }

            if (parseFloat(importe) > 999999.99) {
                throw new Error('El importe no puede exceder 999,999.99');
            }

            // Verificar que la reserva existe
            const reservaExiste = await ReservaModel.existe(reserva_id);
            if (!reservaExiste) {
                throw new Error(`No se encontró ninguna reserva con el ID: ${reserva_id}`);
            }

            // Verificar que el servicio existe
            const servicioExiste = await ServicioModel.existe(servicio_id);
            if (!servicioExiste) {
                throw new Error(`No se encontró ningún servicio con el ID: ${servicio_id}`);
            }

            // Verificar que no existe ya esta asignación
            const existeAsignacion = await ReservaServicioModel.existeAsignacion(reserva_id, servicio_id);
            if (existeAsignacion) {
                throw new Error('Este servicio ya está asignado a la reserva');
            }

            const datosParaCrear = {
                reserva_id: parseInt(reserva_id),
                servicio_id: parseInt(servicio_id),
                importe: parseFloat(importe)
            };

            return await ReservaServicioModel.crear(datosParaCrear);
        } catch (error) {
            console.error('Error en ReservaServicioService al crear:', error);
            throw error;
        }
    }

    async actualizar(id, datosReservaServicio) {
        try {
            if (!id || isNaN(parseInt(id))) {
                throw new Error('ID inválido proporcionado');
            }

            const existe = await this.existe(id);
            if (!existe) {
                throw new Error(`No se encontró ninguna reserva de servicio con el ID: ${id}`);
            }

            const { reserva_id, servicio_id, importe } = datosReservaServicio;

            // Validaciones si se proporcionan los campos
            if (reserva_id !== undefined) {
                if (isNaN(parseInt(reserva_id)) || parseInt(reserva_id) < 1) {
                    throw new Error('El ID de reserva debe ser un número entero positivo');
                }

                const reservaExiste = await ReservaModel.existe(reserva_id);
                if (!reservaExiste) {
                    throw new Error(`No se encontró ninguna reserva con el ID: ${reserva_id}`);
                }
            }

            if (servicio_id !== undefined) {
                if (isNaN(parseInt(servicio_id)) || parseInt(servicio_id) < 1) {
                    throw new Error('El ID de servicio debe ser un número entero positivo');
                }

                const servicioExiste = await ServicioModel.existe(servicio_id);
                if (!servicioExiste) {
                    throw new Error(`No se encontró ningún servicio con el ID: ${servicio_id}`);
                }
            }

            if (importe !== undefined) {
                if (isNaN(parseFloat(importe)) || parseFloat(importe) < 0) {
                    throw new Error('El importe debe ser un número positivo');
                }

                if (parseFloat(importe) > 999999.99) {
                    throw new Error('El importe no puede exceder 999,999.99');
                }
            }

            // Verificar que no existe ya esta asignación (excluyendo el registro actual)
            if (reserva_id !== undefined && servicio_id !== undefined) {
                const existeAsignacion = await ReservaServicioModel.existeAsignacion(reserva_id, servicio_id, id);
                if (existeAsignacion) {
                    throw new Error('Este servicio ya está asignado a la reserva');
                }
            }

            const datosParaActualizar = {
                reserva_id: reserva_id !== undefined ? parseInt(reserva_id) : undefined,
                servicio_id: servicio_id !== undefined ? parseInt(servicio_id) : undefined,
                importe: importe !== undefined ? parseFloat(importe) : undefined
            };

            // Remover campos undefined
            Object.keys(datosParaActualizar).forEach(key => 
                datosParaActualizar[key] === undefined && delete datosParaActualizar[key]
            );

            return await ReservaServicioModel.actualizar(id, datosParaActualizar);
        } catch (error) {
            console.error('Error en ReservaServicioService al actualizar:', error);
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
                throw new Error(`No se encontró ninguna reserva de servicio con el ID: ${id}`);
            }

            return await ReservaServicioModel.eliminar(id);
        } catch (error) {
            console.error('Error en ReservaServicioService al eliminar:', error);
            throw error;
        }
    }

    async eliminarPorReserva(reservaId) {
        try {
            if (!reservaId || isNaN(parseInt(reservaId))) {
                throw new Error('ID de reserva inválido proporcionado');
            }

            // Verificar que la reserva existe
            const reservaExiste = await ReservaModel.existe(reservaId);
            if (!reservaExiste) {
                throw new Error(`No se encontró ninguna reserva con el ID: ${reservaId}`);
            }

            return await ReservaServicioModel.eliminarPorReserva(reservaId);
        } catch (error) {
            console.error('Error en ReservaServicioService al eliminar por reserva:', error);
            throw error;
        }
    }

    async existe(id) {
        try {
            return await ReservaServicioModel.existe(id);
        } catch (error) {
            console.error('Error en ReservaServicioService al verificar existencia:', error);
            throw new Error('Error al verificar la existencia de la reserva de servicio');
        }
    }

    async obtenerTotalImportesPorReserva(reservaId) {
        try {
            if (!reservaId || isNaN(parseInt(reservaId))) {
                throw new Error('ID de reserva inválido proporcionado');
            }

            return await ReservaServicioModel.obtenerTotalImportesPorReserva(reservaId);
        } catch (error) {
            console.error('Error en ReservaServicioService al calcular total:', error);
            throw error;
        }
    }

    async obtenerEstadisticas() {
        try {
            return await ReservaServicioModel.obtenerEstadisticas();
        } catch (error) {
            console.error('Error en ReservaServicioService al obtener estadísticas:', error);
            throw new Error('Error al obtener estadísticas de reservas de servicios');
        }
    }

    async crearMultiples(reservaId, servicios) {
        try {
            if (!reservaId || isNaN(parseInt(reservaId))) {
                throw new Error('ID de reserva inválido proporcionado');
            }

            if (!Array.isArray(servicios) || servicios.length === 0) {
                throw new Error('Debe proporcionar al menos un servicio');
            }

            // Verificar que la reserva existe
            const reservaExiste = await ReservaModel.existe(reservaId);
            if (!reservaExiste) {
                throw new Error(`No se encontró ninguna reserva con el ID: ${reservaId}`);
            }

            // Validar cada servicio
            for (const servicio of servicios) {
                const { servicio_id, importe } = servicio;

                if (!servicio_id || isNaN(parseInt(servicio_id)) || parseInt(servicio_id) < 1) {
                    throw new Error('Todos los servicios deben tener un ID válido');
                }

                if (importe === undefined || importe === null || isNaN(parseFloat(importe)) || parseFloat(importe) < 0) {
                    throw new Error('Todos los servicios deben tener un importe válido');
                }

                if (parseFloat(importe) > 999999.99) {
                    throw new Error('El importe de los servicios no puede exceder 999,999.99');
                }

                // Verificar que el servicio existe
                const servicioExiste = await ServicioModel.existe(servicio_id);
                if (!servicioExiste) {
                    throw new Error(`No se encontró ningún servicio con el ID: ${servicio_id}`);
                }
            }

            // Verificar duplicados en la lista
            const servicioIds = servicios.map(s => s.servicio_id);
            const serviciosUnicos = new Set(servicioIds);
            if (servicioIds.length !== serviciosUnicos.size) {
                throw new Error('No se pueden agregar servicios duplicados');
            }

            // Formatear datos
            const serviciosFormateados = servicios.map(servicio => ({
                servicio_id: parseInt(servicio.servicio_id),
                importe: parseFloat(servicio.importe)
            }));

            return await ReservaServicioModel.crearMultiples(parseInt(reservaId), serviciosFormateados);
        } catch (error) {
            console.error('Error en ReservaServicioService al crear múltiples:', error);
            throw error;
        }
    }

    async actualizarServiciosDeReserva(reservaId, servicios) {
        try {
            if (!reservaId || isNaN(parseInt(reservaId))) {
                throw new Error('ID de reserva inválido proporcionado');
            }

            if (!Array.isArray(servicios)) {
                throw new Error('Los servicios deben ser proporcionados como un array');
            }

            // Verificar que la reserva existe
            const reservaExiste = await ReservaModel.existe(reservaId);
            if (!reservaExiste) {
                throw new Error(`No se encontró ninguna reserva con el ID: ${reservaId}`);
            }

            // Si el array está vacío, solo eliminamos todos los servicios
            if (servicios.length === 0) {
                await ReservaServicioModel.eliminarPorReserva(reservaId);
                return [];
            }

            // Validar cada servicio
            for (const servicio of servicios) {
                const { servicio_id, importe } = servicio;

                if (!servicio_id || isNaN(parseInt(servicio_id)) || parseInt(servicio_id) < 1) {
                    throw new Error('Todos los servicios deben tener un ID válido');
                }

                if (importe === undefined || importe === null || isNaN(parseFloat(importe)) || parseFloat(importe) < 0) {
                    throw new Error('Todos los servicios deben tener un importe válido');
                }

                if (parseFloat(importe) > 999999.99) {
                    throw new Error('El importe de los servicios no puede exceder 999,999.99');
                }

                // Verificar que el servicio existe
                const servicioExiste = await ServicioModel.existe(servicio_id);
                if (!servicioExiste) {
                    throw new Error(`No se encontró ningún servicio con el ID: ${servicio_id}`);
                }
            }

            // Verificar duplicados en la lista
            const servicioIds = servicios.map(s => s.servicio_id);
            const serviciosUnicos = new Set(servicioIds);
            if (servicioIds.length !== serviciosUnicos.size) {
                throw new Error('No se pueden agregar servicios duplicados');
            }

            // Formatear datos
            const serviciosFormateados = servicios.map(servicio => ({
                servicio_id: parseInt(servicio.servicio_id),
                importe: parseFloat(servicio.importe)
            }));

            return await ReservaServicioModel.actualizarServiciosDeReserva(parseInt(reservaId), serviciosFormateados);
        } catch (error) {
            console.error('Error en ReservaServicioService al actualizar servicios de reserva:', error);
            throw error;
        }
    }
}

export default ReservaServicioService;