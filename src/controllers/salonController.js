import SalonService from '../services/salonService.js';
import JSendResponse from '../utils/jsendResponse.js';

class SalonController {
    constructor() {
        this.salonService = SalonService.getInstance();
    }

    async obtenerSalones(req, res) {
        try {
            const salones = await this.salonService.obtenerTodos();
            res.status(200).json(JSendResponse.success(salones));
        } catch (error) {
            console.error('Error al obtener salones:', error);
            res.status(500).json(JSendResponse.error('Error interno del servidor'));
        }
    }

    async obtenerSalonPorId(req, res) {
        try {
            const { id } = req.params;
            const salon = await this.salonService.obtenerPorId(id);
            
            if (!salon) {
                return res.status(404).json(JSendResponse.fail({ 
                    salon_id: `No se encontró ningún salón con el ID: ${id}` 
                }));
            }

            res.status(200).json(JSendResponse.success(salon));
        } catch (error) {
            console.error('Error al obtener salón:', error);
            res.status(500).json(JSendResponse.error('Error interno del servidor'));
        }
    }

    async crearSalon(req, res) {
        try {
            const { titulo, direccion, latitud, longitud, capacidad, importe } = req.body;
            
            const nuevoSalon = await this.salonService.crear({ titulo, direccion, latitud, longitud, capacidad, importe });

            res.status(201).json(JSendResponse.success(nuevoSalon));
        } catch (error) {
            console.error('Error al crear salón:', error);
            
            // Si es un error de validación de negocio, devolver fail
            if (error.message.includes('Ya existe') || error.message.includes('Faltan datos') || error.message.includes('deben ser mayores')) {
                return res.status(400).json(JSendResponse.fail({ 
                    validation: error.message 
                }));
            }
            
            res.status(500).json(JSendResponse.error('Error interno del servidor'));
        }
    }

    async actualizarSalon(req, res) {
        try {
            const { id } = req.params;
            const { titulo, direccion, latitud, longitud, capacidad, importe } = req.body;

            const salonActualizado = await this.salonService.actualizar(id, { titulo, direccion, latitud, longitud, capacidad, importe });

            res.status(200).json(JSendResponse.success(salonActualizado));
        } catch (error) {
            console.error('Error al actualizar salón:', error);
            
            // Si es un error de validación o salón no encontrado, devolver fail
            if (error.message.includes('No se encontró')) {
                return res.status(404).json(JSendResponse.fail({ 
                    salon_id: error.message 
                }));
            }
            
            if (error.message.includes('Ya existe') || error.message.includes('debe ser mayor') || error.message.includes('ID inválido')) {
                return res.status(400).json(JSendResponse.fail({ 
                    validation: error.message 
                }));
            }
            
            res.status(500).json(JSendResponse.error('Error interno del servidor'));
        }
    }

    async eliminarSalon(req, res) {
        try {
            const { id } = req.params;

            const eliminado = await this.salonService.eliminar(id);

            if (eliminado) {
                res.status(200).json(JSendResponse.success({ 
                    salon_id: parseInt(id),
                    message: 'Salón eliminado exitosamente' 
                }));
            } else {
                res.status(500).json(JSendResponse.error('No se pudo completar la solicitud de eliminación'));
            }
        } catch (error) {
            console.error('Error al eliminar salón:', error);
            
            // Si es un error de validación o salón no encontrado
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

    async obtenerEstadisticas(req, res) {
        try {
            const estadisticas = await this.salonService.obtenerEstadisticas();
            res.status(200).json(JSendResponse.success(estadisticas));
        } catch (error) {
            console.error('Error al obtener estadísticas:', error);
            res.status(500).json(JSendResponse.error('Error interno del servidor'));
        }
    }
}

// Crear una instancia única del controlador
const salonController = new SalonController();

// Exportar los métodos con bind para mantener el contexto de 'this'
export const obtenerSalones = salonController.obtenerSalones.bind(salonController);
export const obtenerSalonPorId = salonController.obtenerSalonPorId.bind(salonController);
export const crearSalon = salonController.crearSalon.bind(salonController);
export const actualizarSalon = salonController.actualizarSalon.bind(salonController);
export const eliminarSalon = salonController.eliminarSalon.bind(salonController);
export const obtenerEstadisticas = salonController.obtenerEstadisticas.bind(salonController);

export default SalonController;
