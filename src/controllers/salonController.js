import SalonService from '../services/salonService.js';

class SalonController {
    constructor() {
        this.salonService = SalonService.getInstance();
    }

    // Funciones auxiliares para JSON:API
    formatResource(salon, type = 'salones') {
        return {
            type,
            id: salon.salon_id.toString(),
            attributes: {
                salon_id: salon.salon_id,
                titulo: salon.titulo,
                direccion: salon.direccion,
                latitud: salon.latitud,
                longitud: salon.longitud,
                capacidad: salon.capacidad,
                importe: salon.importe
            }
        };
    }

    // TODO: Buscar una mejor forma de manejar esto. Esto es para responder con el formato https://jsonapi.org/
    formatJsonApiResponse(data, meta = {}, links = {}) {
        const response = { data };
        if (Object.keys(meta).length > 0) response.meta = meta;
        if (Object.keys(links).length > 0) response.links = links;
        return response;
    }

    formatJsonApiError(status, title, detail, source = {}) {
        return {
            errors: [{
                status: status.toString(),
                title,
                detail,
                ...(Object.keys(source).length > 0 && { source })
            }]
        };
    }

    async obtenerSalones(req, res) {
        try {
            const salones = await this.salonService.obtenerTodos();
            const formattedSalones = salones.map(salon => this.formatResource(salon));
            
            res.json(this.formatJsonApiResponse(formattedSalones));
        } catch (error) {
            console.error('Error al obtener salones:', error);
            res.status(500).json(this.formatJsonApiError(500, 'Error interno del servidor', error.message));
        }
    }

    async obtenerSalonPorId(req, res) {
        try {
            const { id } = req.params;
            const salon = await this.salonService.obtenerPorId(id);
            
            if (!salon) {
                return res.status(404).json(this.formatJsonApiError(404, 'Salón no encontrado', `No se encontró ningún salón con el ID: ${id}`));
            }

            const links = {
                self: `/api/v1/salones/${id}`
            };

            res.json(this.formatJsonApiResponse(this.formatResource(salon), {}, links));
        } catch (error) {
            console.error('Error al obtener salón:', error);
            res.status(500).json(this.formatJsonApiError(500, 'Error interno del servidor', error.message));
        }
    }

    async crearSalon(req, res) {
        try {
            const { titulo, direccion, latitud, longitud, capacidad, importe } = req.body;
            
            const nuevoSalon = await this.salonService.crear({ titulo, direccion, latitud, longitud, capacidad, importe });

            const links = {
                self: `/api/v1/salones/${nuevoSalon.salon_id}`
            };

            res.status(201).json(this.formatJsonApiResponse(this.formatResource(nuevoSalon), {}, links));
        } catch (error) {
            console.error('Error al crear salón:', error);
            
            // Si es un error de validación de negocio, devolver 400 Bad Request
            if (error.message.includes('Ya existe') || error.message.includes('Faltan datos') || error.message.includes('deben ser mayores')) {
                return res.status(400).json(this.formatJsonApiError(400, 'Error de validación', error.message));
            }
            
            res.status(500).json(this.formatJsonApiError(500, 'Error interno del servidor', error.message));
        }
    }

    async actualizarSalon(req, res) {
        try {
            const { id } = req.params;
            const { titulo, direccion, latitud, longitud, capacidad, importe } = req.body;

            const salonActualizado = await this.salonService.actualizar(id, { titulo, direccion, latitud, longitud, capacidad, importe });

            const links = {
                self: `/api/v1/salones/${id}`
            };

            res.json(this.formatJsonApiResponse(this.formatResource(salonActualizado), {}, links));
        } catch (error) {
            console.error('Error al actualizar salón:', error);
            
            // Si es un error de validación o salón no encontrado, devolver 400 o 404
            if (error.message.includes('No se encontró')) {
                return res.status(404).json(this.formatJsonApiError(404, 'Salón no encontrado', error.message));
            }
            
            if (error.message.includes('Ya existe') || error.message.includes('debe ser mayor') || error.message.includes('ID inválido')) {
                return res.status(400).json(this.formatJsonApiError(400, 'Error de validación', error.message));
            }
            
            res.status(500).json(this.formatJsonApiError(500, 'Error interno del servidor', error.message));
        }
    }

    async eliminarSalon(req, res) {
        try {
            const { id } = req.params;

            const eliminado = await this.salonService.eliminar(id);

            if (eliminado) {
                res.status(204).json(); // JSON:API usa 204 No Content para eliminaciones exitosas
            } else {
                res.status(500).json(this.formatJsonApiError(500, 'Error al eliminar el salón', 'No se pudo completar la solicitud de eliminación'));
            }
        } catch (error) {
            console.error('Error al eliminar salón:', error);
            
            // Si es un error de validación o salón no encontrado
            if (error.message.includes('No se encontró')) {
                return res.status(404).json(this.formatJsonApiError(404, 'Salón no encontrado', error.message));
            }
            
            if (error.message.includes('ID inválido')) {
                return res.status(400).json(this.formatJsonApiError(400, 'Error de validación', error.message));
            }
            
            res.status(500).json(this.formatJsonApiError(500, 'Error interno del servidor', error.message));
        }
    }

    async obtenerEstadisticas(req, res) {
        try {
            const estadisticas = await this.salonService.obtenerEstadisticas();
            
            // Formatear como JSON:API
            const formattedEstadisticas = {
                type: 'estadisticas',
                id: '1',
                attributes: estadisticas
            };

            res.json(this.formatJsonApiResponse(formattedEstadisticas));
        } catch (error) {
            console.error('Error al obtener estadísticas:', error);
            res.status(500).json(this.formatJsonApiError(500, 'Error interno del servidor', error.message));
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
