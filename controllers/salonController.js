import { SalonModel } from '../models/salonModel.js';

// Funciones auxiliares para JSON:API
const formatResource = (salon, type = 'salones') => ({
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
});

// TODO: Buscar una mejor forma de manejar esto. Esto es para responder con el formato https://jsonapi.org/
const formatJsonApiResponse = (data, meta = {}, links = {}) => {
    const response = { data };
    if (Object.keys(meta).length > 0) response.meta = meta;
    if (Object.keys(links).length > 0) response.links = links;
    return response;
};

const formatJsonApiError = (status, title, detail, source = {}) => ({
    errors: [{
        status: status.toString(),
        title,
        detail,
        ...(Object.keys(source).length > 0 && { source })
    }]
});

export const obtenerSalones = async (req, res) => {
    try {
        const salones = await SalonModel.obtenerTodos();
        const formattedSalones = salones.map(salon => formatResource(salon));
        
        res.json(formatJsonApiResponse(formattedSalones));
    } catch (error) {
        console.error('Error al obtener salones:', error);
        res.status(500).json(formatJsonApiError(500, 'Error interno del servidor', error.message));
    }
};

export const obtenerSalonPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const salon = await SalonModel.obtenerPorId(id);
        
        if (!salon) {
            return res.status(404).json(formatJsonApiError(404, 'Salón no encontrado', `No se encontró ningún salón con el ID: ${id}`));
        }

        const links = {
            self: `/api/salones/${id}`
        };

        res.json(formatJsonApiResponse(formatResource(salon), {}, links));
    } catch (error) {
        console.error('Error al obtener salón:', error);
        res.status(500).json(formatJsonApiError(500, 'Error interno del servidor', error.message));
    }
};

export const crearSalon = async (req, res) => {
    try {
        const { titulo, direccion, latitud, longitud, capacidad, importe } = req.body;
        
        const nuevoSalon = await SalonModel.crear({ titulo, direccion, latitud, longitud, capacidad, importe });

        const links = {
            self: `/api/salones/${nuevoSalon.salon_id}`
        };

        res.status(201).json(formatJsonApiResponse(formatResource(nuevoSalon), {}, links));
    } catch (error) {
        console.error('Error al crear salón:', error);
        res.status(500).json(formatJsonApiError(500, 'Error interno del servidor', error.message));
    }
};

export const actualizarSalon = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, direccion, latitud, longitud, capacidad, importe } = req.body;

        // Verificar si el salón existe
        const existe = await SalonModel.existe(id);
        if (!existe) {
            return res.status(404).json(formatJsonApiError(404, 'Salón no encontrado', `No se encontró ningún salón con el ID: ${id}`));
        }

        const salonActualizado = await SalonModel.actualizar(id, { titulo, direccion, latitud, longitud, capacidad, importe });

        const links = {
            self: `/api/salones/${id}`
        };

        res.json(formatJsonApiResponse(formatResource(salonActualizado), {}, links));
    } catch (error) {
        console.error('Error al actualizar salón:', error);
        res.status(500).json(formatJsonApiError(500, 'Error interno del servidor', error.message));
    }
};

export const eliminarSalon = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar si el salón existe
        const existe = await SalonModel.existe(id);
        if (!existe) {
            return res.status(404).json(formatJsonApiError(404, 'Salón no encontrado', `No se encontró ningún salón con el ID: ${id}`));
        }

        const eliminado = await SalonModel.eliminarLogico(id);

        if (eliminado) {
            res.status(204).json(); // JSON:API usa 204 No Content para eliminaciones exitosas
        } else {
            res.status(500).json(formatJsonApiError(500, 'Error al eliminar el salón', 'No se pudo completar la solicitud de eliminación'));
        }
    } catch (error) {
        console.error('Error al eliminar salón:', error);
        res.status(500).json(formatJsonApiError(500, 'Error interno del servidor', error.message));
    }
};
