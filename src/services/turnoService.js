import { TurnoModel } from '../models/turnoModel.js';

class TurnoService {
    static instance = null;

    static getInstance() {
        if (!TurnoService.instance) {
            TurnoService.instance = new TurnoService();
        }
        return TurnoService.instance;
    }

    constructor() {
        if (TurnoService.instance) return TurnoService.instance;
        TurnoService.instance = this;
    }

    async obtenerTodos() {
        try {
            return TurnoModel.obtenerTodos();
        } catch (error) {
            console.error('Error en TurnoService al obtener todos los turnos:', error);
            throw new Error('Error al obtener la lista de turnos');
        }
    }

    async obtenerPorId(id) {
        try {
            if (!id || isNaN(parseInt(id))) throw new Error('ID inválido proporcionado');
            return TurnoModel.obtenerPorId(id);
        } catch (error) {
            console.error('Error en TurnoService al obtener turno por ID:', error);
            throw new Error(`Error al obtener el turno con ID: ${id}`);
        }
    }

    async crear(datosTurno) {
        try {
            const { orden, hora_desde, hora_hasta } = datosTurno;
            if (orden === undefined || isNaN(parseInt(orden)) || parseInt(orden) <= 0) {
                throw new Error('El orden debe ser un número entero mayor a 0');
            }
            if (!hora_desde || !hora_hasta) {
                throw new Error('Debe proveer hora_desde y hora_hasta');
            }

            return TurnoModel.crear({ orden, hora_desde, hora_hasta });
        } catch (error) {
            console.error('Error en TurnoService al crear turno:', error);
            throw error;
        }
    }

    async actualizar(id, datosTurno) {
        try {
            if (!id || isNaN(parseInt(id))) throw new Error('ID inválido proporcionado');

            const existe = await this.existe(id);
            if (!existe) throw new Error(`No se encontró ningún turno con el ID: ${id}`);

            const { orden } = datosTurno;
            if (orden !== undefined && (isNaN(parseInt(orden)) || parseInt(orden) <= 0)) {
                throw new Error('El orden debe ser un número entero mayor a 0');
            }

            return TurnoModel.actualizar(id, datosTurno);
        } catch (error) {
            console.error('Error en TurnoService al actualizar turno:', error);
            throw error;
        }
    }

    async eliminar(id) {
        try {
            if (!id || isNaN(parseInt(id))) throw new Error('ID inválido proporcionado');

            const existe = await this.existe(id);
            if (!existe) throw new Error(`No se encontró ningún turno con el ID: ${id}`);

            return TurnoModel.eliminarLogico(id);
        } catch (error) {
            console.error('Error en TurnoService al eliminar turno:', error);
            throw error;
        }
    }

    async existe(id) {
        try {
            return TurnoModel.existe(id);
        } catch (error) {
            console.error('Error en TurnoService al verificar existencia:', error);
            throw new Error('Error al verificar la existencia del turno');
        }
    }

    async obtenerEstadisticas() {
        try {
            const turnos = await TurnoModel.obtenerTodos();
            return {
                total: turnos.length,
                ordenMin: turnos.length > 0 ? Math.min(...turnos.map(t => t.orden)) : null,
                ordenMax: turnos.length > 0 ? Math.max(...turnos.map(t => t.orden)) : null
            };
        } catch (error) {
            console.error('Error en TurnoService al obtener estadísticas:', error);
            throw new Error('Error al obtener estadísticas de turnos');
        }
    }
}

export default TurnoService;
