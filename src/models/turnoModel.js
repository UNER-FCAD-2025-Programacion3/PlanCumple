import conexion from '../config/database.js';

export class TurnoModel {
    static async obtenerTodos() {
        try {
            const [rows] = await conexion.execute('SELECT * FROM turnos WHERE activo = 1 ORDER BY orden ASC');
            return rows;
        } catch (error) {
            throw new Error(`Error al obtener turnos: ${error.message}`);
        }
    }

    static async obtenerPorId(id) {
        try {
            const [rows] = await conexion.execute('SELECT * FROM turnos WHERE turno_id = ? AND activo = 1', [id]);
            return rows[0] || null;
        } catch (error) {
            throw new Error(`Error al obtener turno por ID: ${error.message}`);
        }
    }

    static async crear(turnoData) {
        try {
            const { orden, hora_desde, hora_hasta } = turnoData;
            const [result] = await conexion.execute(
                'INSERT INTO turnos (orden, hora_desde, hora_hasta) VALUES (?, ?, ?)',
                [orden, hora_desde, hora_hasta]
            );

            return {
                turno_id: result.insertId,
                orden,
                hora_desde,
                hora_hasta
            };
        } catch (error) {
            throw new Error(`Error al crear turno: ${error.message}`);
        }
    }

    static async actualizar(id, turnoData) {
        try {
            const turnoExistente = await this.obtenerPorId(id);
            if (!turnoExistente) {
                throw new Error(`No se encontró ningún turno con el ID: ${id}`);
            }

            const { orden, hora_desde, hora_hasta } = turnoData;
            await conexion.execute(
                'UPDATE turnos SET orden = ?, hora_desde = ?, hora_hasta = ? WHERE turno_id = ?',
                [orden, hora_desde, hora_hasta, id]
            );

            return {
                turno_id: parseInt(id),
                orden,
                hora_desde,
                hora_hasta
            };
        } catch (error) {
            throw new Error(`Error al actualizar turno: ${error.message}`);
        }
    }

    static async eliminarLogico(id) {
        try {
            const [result] = await conexion.execute('UPDATE turnos SET activo = 0 WHERE turno_id = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error(`Error al eliminar turno: ${error.message}`);
        }
    }

    static async existe(id) {
        try {
            const [rows] = await conexion.execute('SELECT 1 FROM turnos WHERE turno_id = ?', [id]);
            return rows.length > 0;
        } catch (error) {
            throw new Error(`Error al verificar existencia del turno: ${error.message}`);
        }
    }
}
