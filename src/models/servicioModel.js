import conexion from '../config/database.js';

export class ServicioModel {
    static async obtenerTodos() {
        try {
            const [rows] = await conexion.execute(
                'SELECT servicio_id, descripcion, importe FROM servicios WHERE activo = 1 ORDER BY descripcion ASC'
            );
            return rows;
        } catch (error) {
            throw new Error(`Error al obtener servicios: ${error.message}`);
        }
    }

    static async obtenerPorId(id) {
        try {
            const [rows] = await conexion.execute(
                'SELECT servicio_id, descripcion, importe FROM servicios WHERE servicio_id = ? AND activo = 1', 
                [id]
            );
            return rows[0] || null;
        } catch (error) {
            throw new Error(`Error al obtener servicio por ID: ${error.message}`);
        }
    }

    static async crear(servicioData) {
        try {
            const { descripcion, importe } = servicioData;
            const [result] = await conexion.execute(
                'INSERT INTO servicios (descripcion, importe) VALUES (?, ?)',
                [descripcion, importe]
            );

            return {
                servicio_id: result.insertId,
                descripcion,
                importe
            };
        } catch (error) {
            throw new Error(`Error al crear servicio: ${error.message}`);
        }
    }

    static async actualizar(id, servicioData) {
        try {
            // Verificar si el servicio existe primero
            const servicioExistente = await this.obtenerPorId(id);
            if (!servicioExistente) {
                throw new Error(`No se encontró ningún servicio con el ID: ${id}`);
            }

            const { descripcion, importe } = servicioData;
            const [result] = await conexion.execute(
                'UPDATE servicios SET descripcion = ?, importe = ? WHERE servicio_id = ?',
                [descripcion, importe, id]
            );
            
            return {
                servicio_id: parseInt(id),
                descripcion,
                importe
            };
        } catch (error) {
            throw new Error(`Error al actualizar servicio: ${error.message}`);
        }
    }

    static async eliminarLogico(id) {
        try {
            const [result] = await conexion.execute('UPDATE servicios SET activo = 0 WHERE servicio_id = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error(`Error al eliminar servicio: ${error.message}`);
        }
    }

    static async existe(id) {
        try {
            const [rows] = await conexion.execute('SELECT 1 FROM servicios WHERE servicio_id = ?', [id]);
            return rows.length > 0;
        } catch (error) {
            throw new Error(`Error al verificar existencia del servicio: ${error.message}`);
        }
    }

    static async existeDescripcion(descripcion, excludeId = null) {
        try {
            let query = 'SELECT 1 FROM servicios WHERE descripcion = ? AND activo = 1';
            let params = [descripcion];
            
            if (excludeId) {
                query += ' AND servicio_id != ?';
                params.push(excludeId);
            }
            
            const [rows] = await conexion.execute(query, params);
            return rows.length > 0;
        } catch (error) {
            throw new Error(`Error al verificar existencia de la descripción del servicio: ${error.message}`);
        }
    }

    static async obtenerPorRangoImporte(importeMin, importeMax) {
        try {
            const [rows] = await conexion.execute(
                'SELECT servicio_id, descripcion, importe FROM servicios WHERE importe BETWEEN ? AND ? AND activo = 1 ORDER BY importe ASC',
                [importeMin, importeMax]
            );
            return rows;
        } catch (error) {
            throw new Error(`Error al obtener servicios por rango de importe: ${error.message}`);
        }
    }
}