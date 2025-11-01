import TurnoService from '../services/turnoService.js';

class TurnoController {
    constructor() {
        this.turnoService = TurnoService.getInstance();
    }

    formatResource(turno, type = 'turnos') {
        return {
            type,
            id: turno.turno_id.toString(),
            attributes: {
                turno_id: turno.turno_id,
                orden: turno.orden,
                hora_desde: turno.hora_desde,
                hora_hasta: turno.hora_hasta
            }
        };
    }

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

    async obtenerTurnos(req, res) {
        try {
            const turnos = await this.turnoService.obtenerTodos();
            const formatted = turnos.map(t => this.formatResource(t));
            res.json(this.formatJsonApiResponse(formatted));
        } catch (error) {
            console.error('Error al obtener turnos:', error);
            res.status(500).json(this.formatJsonApiError(500, 'Error interno del servidor', error.message));
        }
    }

    async obtenerTurnoPorId(req, res) {
        try {
            const { id } = req.params;
            const turno = await this.turnoService.obtenerPorId(id);
            if (!turno) return res.status(404).json(this.formatJsonApiError(404, 'Turno no encontrado', `No se encontró ningún turno con el ID: ${id}`));

            const links = { self: `/api/v1/turnos/${id}` };
            res.json(this.formatJsonApiResponse(this.formatResource(turno), {}, links));
        } catch (error) {
            console.error('Error al obtener turno:', error);
            res.status(500).json(this.formatJsonApiError(500, 'Error interno del servidor', error.message));
        }
    }

    async crearTurno(req, res) {
        try {
            const { orden, hora_desde, hora_hasta } = req.body;
            const nuevo = await this.turnoService.crear({ orden, hora_desde, hora_hasta });
            const links = { self: `/api/v1/turnos/${nuevo.turno_id}` };
            res.status(201).json(this.formatJsonApiResponse(this.formatResource(nuevo), {}, links));
        } catch (error) {
            console.error('Error al crear turno:', error);
            if (error.message.includes('Faltan') || error.message.includes('orden') || error.message.includes('hora')) {
                return res.status(400).json(this.formatJsonApiError(400, 'Error de validación', error.message));
            }
            res.status(500).json(this.formatJsonApiError(500, 'Error interno del servidor', error.message));
        }
    }

    async actualizarTurno(req, res) {
        try {
            const { id } = req.params;
            const { orden, hora_desde, hora_hasta } = req.body;
            const actualizado = await this.turnoService.actualizar(id, { orden, hora_desde, hora_hasta });
            const links = { self: `/api/v1/turnos/${id}` };
            res.json(this.formatJsonApiResponse(this.formatResource(actualizado), {}, links));
        } catch (error) {
            console.error('Error al actualizar turno:', error);
            if (error.message.includes('No se encontró')) return res.status(404).json(this.formatJsonApiError(404, 'Turno no encontrado', error.message));
            if (error.message.includes('orden') || error.message.includes('ID inválido')) return res.status(400).json(this.formatJsonApiError(400, 'Error de validación', error.message));
            res.status(500).json(this.formatJsonApiError(500, 'Error interno del servidor', error.message));
        }
    }

    async eliminarTurno(req, res) {
        try {
            const { id } = req.params;
            const eliminado = await this.turnoService.eliminar(id);
            if (eliminado) return res.status(204).json();
            res.status(500).json(this.formatJsonApiError(500, 'Error al eliminar el turno', 'No se pudo completar la solicitud de eliminación'));
        } catch (error) {
            console.error('Error al eliminar turno:', error);
            if (error.message.includes('No se encontró')) return res.status(404).json(this.formatJsonApiError(404, 'Turno no encontrado', error.message));
            if (error.message.includes('ID inválido')) return res.status(400).json(this.formatJsonApiError(400, 'Error de validación', error.message));
            res.status(500).json(this.formatJsonApiError(500, 'Error interno del servidor', error.message));
        }
    }

    async obtenerEstadisticas(req, res) {
        try {
            const estadisticas = await this.turnoService.obtenerEstadisticas();
            const formatted = { type: 'estadisticas', id: '1', attributes: estadisticas };
            res.json(this.formatJsonApiResponse(formatted));
        } catch (error) {
            console.error('Error al obtener estadísticas:', error);
            res.status(500).json(this.formatJsonApiError(500, 'Error interno del servidor', error.message));
        }
    }
}

const turnoController = new TurnoController();

export const obtenerTurnos = turnoController.obtenerTurnos.bind(turnoController);
export const obtenerTurnoPorId = turnoController.obtenerTurnoPorId.bind(turnoController);
export const crearTurno = turnoController.crearTurno.bind(turnoController);
export const actualizarTurno = turnoController.actualizarTurno.bind(turnoController);
export const eliminarTurno = turnoController.eliminarTurno.bind(turnoController);
export const obtenerEstadisticas = turnoController.obtenerEstadisticas.bind(turnoController);

export default TurnoController;
