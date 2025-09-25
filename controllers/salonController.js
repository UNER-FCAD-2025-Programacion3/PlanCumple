import { SalonModel } from '../models/salonModel.js';

// Funciones auxiliares para JSON:API
const formatResource = (salon, type = 'salones') => ({
    type,
    salon_id: salon.salon_id.toString(),
    attributes: {
        titulo: salon.titulo
      /*   capacidad: salon.capacidad,
        precio: salon.precio,
        descripcion: salon.descripcion,
        created_at: salon.created_at,
        updated_at: salon.updated_at */
    }
});

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
        const { nombre, capacidad, precio, descripcion } = req.body;
        
        // Validación básica
        if (!nombre || !capacidad || !precio) {
            return res.status(400).json(formatJsonApiError(400, 'Solicitud incorrecta', 'Los campos nombre, capacidad y precio son obligatorios'));
        }

        const nuevoSalon = await SalonModel.crear({ nombre, capacidad, precio, descripcion });

        const links = {
            self: `/api/salones/${nuevoSalon.id}`
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
        const { nombre, capacidad, precio, descripcion } = req.body;

        // Verificar si el salón existe
        const existe = await SalonModel.existe(id);
        if (!existe) {
            return res.status(404).json(formatJsonApiError(404, 'Salón no encontrado', `No se encontró ningún salón con el ID: ${id}`));
        }

        const salonActualizado = await SalonModel.actualizar(id, { nombre, capacidad, precio, descripcion });

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

        const eliminado = await SalonModel.eliminar(id);

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
