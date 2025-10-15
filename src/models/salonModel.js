import { conexion } from '../config/database.js';

export class SalonModel {
    static async obtenerTodos() {
        try {
            const [rows] = await conexion.execute('SELECT * FROM salones WHERE activo = 1');
            return rows;
        } catch (error) {
            throw new Error(`Error al obtener salones: ${error.message}`);
        }
    }

    static async obtenerPorId(id) {
        try {
            const [rows] = await conexion.execute('SELECT * FROM salones WHERE salon_id = ? and activo = 1', [id]);
            return rows[0] || null;
        } catch (error) {
            throw new Error(`Error al obtener salón por ID: ${error.message}`);
        }
    }

    static async crear(salonData) {
        try {
            const { titulo, direccion, latitud, longitud, capacidad, importe } = salonData;
            const [result] = await conexion.execute(
                'INSERT INTO salones (titulo, direccion, latitud, longitud, capacidad, importe) VALUES (?, ?, ?, ?, ?, ?)',
                [titulo, direccion, latitud || null, longitud || null, capacidad, importe]
            );
            return {
                id: result.insertId,
                titulo,
                direccion,
                latitud,
                longitud,
                capacidad,
                importe
            };
        } catch (error) {
            throw new Error(`Error al crear salón: ${error.message}`);
        }
    }

    static async actualizar(id, salonData) {
        try {
            const { titulo, direccion, latitud, longitud, capacidad, importe } = salonData;
            const [result] = await conexion.execute(
                'UPDATE salones SET titulo = ?, direccion = ?, latitud = ?, longitud = ?, capacidad = ?, importe = ? WHERE salon_id = ?',
                [titulo, direccion, latitud || null, longitud || null, capacidad, importe, id]
            );
            
            if (result.affectedRows === 0) {
                return null;
            }
            
            return {
                id: parseInt(id),
                titulo,
                direccion,
                latitud,
                longitud,
                capacidad,
                importe
            };
        } catch (error) {
            throw new Error(`Error al actualizar salón: ${error.message}`);
        }
    }

    /* static async eliminar(id) {
        try {
            const [result] = await conexion.execute('DELETE FROM salones WHERE salon_id = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error(`Error al eliminar salón: ${error.message}`);
        }
    } */

    static async eliminarLogico(id) {
        try {
            const [result] = await conexion.execute('UPDATE salones SET activo = 0 WHERE salon_id = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error(`Error al eliminar salón: ${error.message}`);
        }
    }

    static async existe(id) {
        try {
            const [rows] = await conexion.execute('SELECT 1 FROM salones WHERE salon_id = ?', [id]);
            return rows.length > 0;
        } catch (error) {
            throw new Error(`Error al verificar existencia del salón: ${error.message}`);
        }
    }
}
