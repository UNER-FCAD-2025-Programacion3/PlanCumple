import TurnoService from '../services/turnoService.js';
import JSendResponse from '../utils/jsendResponse.js';

class TurnoController {
    constructor() {
        this.turnoService = TurnoService.getInstance();
    }

    async obtenerTurnos(req, res) {
        try {
            const turnos = await this.turnoService.obtenerTodos();
            res.status(200).json(JSendResponse.success(turnos));
        } catch (error) {
            console.error('Error al obtener turnos:', error);
            res.status(500).json(JSendResponse.error('Error interno del servidor'));
        }
    }

    async obtenerTurnoPorId(req, res) {
        try {
            const { id } = req.params;
            const turno = await this.turnoService.obtenerPorId(id);
            
            if (!turno) {
                return res.status(404).json(JSendResponse.fail({ 
                    turno_id: `No se encontró ningún turno con el ID: ${id}` 
                }));
            }

            res.status(200).json(JSendResponse.success(turno));
        } catch (error) {
            console.error('Error al obtener turno:', error);
            res.status(500).json(JSendResponse.error('Error interno del servidor'));
        }
    }

    async crearTurno(req, res) {
        try {
            const { orden, hora_desde, hora_hasta } = req.body;
            const nuevo = await this.turnoService.crear({ orden, hora_desde, hora_hasta });
            res.status(201).json(JSendResponse.success(nuevo));
        } catch (error) {
            console.error('Error al crear turno:', error);
            if (error.message.includes('Faltan') || error.message.includes('orden') || error.message.includes('hora')) {
                return res.status(400).json(JSendResponse.fail({ 
                    validation: error.message 
                }));
            }
            res.status(500).json(JSendResponse.error('Error interno del servidor'));
        }
    }

    async actualizarTurno(req, res) {
        try {
            const { id } = req.params;
            const { orden, hora_desde, hora_hasta } = req.body;
            const actualizado = await this.turnoService.actualizar(id, { orden, hora_desde, hora_hasta });
            res.status(200).json(JSendResponse.success(actualizado));
        } catch (error) {
            console.error('Error al actualizar turno:', error);
            if (error.message.includes('No se encontró')) {
                return res.status(404).json(JSendResponse.fail({ 
                    turno_id: error.message 
                }));
            }
            if (error.message.includes('orden') || error.message.includes('ID inválido')) {
                return res.status(400).json(JSendResponse.fail({ 
                    validation: error.message 
                }));
            }
            res.status(500).json(JSendResponse.error('Error interno del servidor'));
        }
    }

    async eliminarTurno(req, res) {
        try {
            const { id } = req.params;
            const eliminado = await this.turnoService.eliminar(id);
            
            if (eliminado) {
                return res.status(200).json(JSendResponse.success({ 
                    turno_id: parseInt(id),
                    message: 'Turno eliminado exitosamente' 
                }));
            }
            
            res.status(500).json(JSendResponse.error('No se pudo completar la solicitud de eliminación'));
        } catch (error) {
            console.error('Error al eliminar turno:', error);
            if (error.message.includes('No se encontró')) {
                return res.status(404).json(JSendResponse.fail({ 
                    turno_id: error.message 
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
            const estadisticas = await this.turnoService.obtenerEstadisticas();
            res.status(200).json(JSendResponse.success(estadisticas));
        } catch (error) {
            console.error('Error al obtener estadísticas:', error);
            res.status(500).json(JSendResponse.error('Error interno del servidor'));
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
