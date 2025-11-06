import ServicioService from '../services/servicioService.js';
import JSendResponse from '../utils/jsendResponse.js';

class ServicioController {
    constructor() {
        this.servicioService = ServicioService.getInstance();
    }

    async obtenerServicios(req, res) {
        try {
            const servicios = await this.servicioService.obtenerTodos();
            res.status(200).json(JSendResponse.success(servicios));
        } catch (error) {
            console.error('Error al obtener servicios:', error);
            res.status(500).json(JSendResponse.error('Error interno del servidor'));
        }
    }

    async obtenerServicioPorId(req, res) {
        try {
            const { id } = req.params;
            const servicio = await this.servicioService.obtenerPorId(id);
            
            if (!servicio) {
                return res.status(404).json(JSendResponse.fail({ 
                    servicio_id: `No se encontró ningún servicio con el ID: ${id}` 
                }));
            }

            res.status(200).json(JSendResponse.success(servicio));
        } catch (error) {
            console.error('Error al obtener servicio:', error);
            res.status(500).json(JSendResponse.error('Error interno del servidor'));
        }
    }

    async crearServicio(req, res) {
        try {
            const { descripcion, importe } = req.body;
            
            const nuevoServicio = await this.servicioService.crear({ descripcion, importe });

            res.status(201).json(JSendResponse.success(nuevoServicio));
        } catch (error) {
            console.error('Error al crear servicio:', error);
            
            // Si es un error de validación de negocio, devolver fail
            if (error.message.includes('Ya existe') || error.message.includes('requeridos') || error.message.includes('debe ser mayor')) {
                return res.status(400).json(JSendResponse.fail({ 
                    validation: error.message 
                }));
            }
            
            res.status(500).json(JSendResponse.error('Error interno del servidor'));
        }
    }

    async actualizarServicio(req, res) {
        try {
            const { id } = req.params;
            const { descripcion, importe } = req.body;

            const servicioActualizado = await this.servicioService.actualizar(id, { descripcion, importe });

            res.status(200).json(JSendResponse.success(servicioActualizado));
        } catch (error) {
            console.error('Error al actualizar servicio:', error);
            
            // Si es un error de validación o servicio no encontrado, devolver fail
            if (error.message.includes('No se encontró')) {
                return res.status(404).json(JSendResponse.fail({ 
                    servicio_id: error.message 
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

    async eliminarServicio(req, res) {
        try {
            const { id } = req.params;

            const eliminado = await this.servicioService.eliminar(id);

            if (eliminado) {
                res.status(200).json(JSendResponse.success({ 
                    servicio_id: parseInt(id),
                    message: 'Servicio eliminado exitosamente' 
                }));
            } else {
                res.status(500).json(JSendResponse.error('No se pudo completar la solicitud de eliminación'));
            }
        } catch (error) {
            console.error('Error al eliminar servicio:', error);
            
            // Si es un error de validación o servicio no encontrado
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

    async obtenerServiciosPorRangoImporte(req, res) {
        try {
            const { importeMin, importeMax } = req.query;
            
            if (!importeMin || !importeMax) {
                return res.status(400).json(JSendResponse.fail({ 
                    validation: 'Los parámetros importeMin e importeMax son requeridos' 
                }));
            }

            const servicios = await this.servicioService.obtenerPorRangoImporte(
                parseFloat(importeMin), 
                parseFloat(importeMax)
            );

            res.status(200).json(JSendResponse.success(servicios));
        } catch (error) {
            console.error('Error al obtener servicios por rango de importe:', error);
            
            if (error.message.includes('deben ser mayores') || error.message.includes('no puede ser mayor')) {
                return res.status(400).json(JSendResponse.fail({ 
                    validation: error.message 
                }));
            }
            
            res.status(500).json(JSendResponse.error('Error interno del servidor'));
        }
    }

    async obtenerEstadisticas(req, res) {
        try {
            const estadisticas = await this.servicioService.obtenerEstadisticas();
            res.status(200).json(JSendResponse.success(estadisticas));
        } catch (error) {
            console.error('Error al obtener estadísticas:', error);
            res.status(500).json(JSendResponse.error('Error interno del servidor'));
        }
    }
}

// Crear una instancia única del controlador
const servicioController = new ServicioController();

// Exportar los métodos con bind para mantener el contexto de 'this'
export const obtenerServicios = servicioController.obtenerServicios.bind(servicioController);
export const obtenerServicioPorId = servicioController.obtenerServicioPorId.bind(servicioController);
export const crearServicio = servicioController.crearServicio.bind(servicioController);
export const actualizarServicio = servicioController.actualizarServicio.bind(servicioController);
export const eliminarServicio = servicioController.eliminarServicio.bind(servicioController);
export const obtenerServiciosPorRangoImporte = servicioController.obtenerServiciosPorRangoImporte.bind(servicioController);
export const obtenerEstadisticas = servicioController.obtenerEstadisticas.bind(servicioController);

export default ServicioController;