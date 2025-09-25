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
            const [rows] = await conexion.execute('SELECT * FROM salones WHERE id = ? and activo = 1', [id]);
            return rows[0] || null;
        } catch (error) {
            throw new Error(`Error al obtener salón por ID: ${error.message}`);
        }
    }

    static async crear(salonData) {
        try {
            const { nombre, capacidad, precio, descripcion } = salonData;
            const [result] = await conexion.execute(
                'INSERT INTO salones (nombre, capacidad, precio, descripcion) VALUES (?, ?, ?, ?)',
                [nombre, capacidad, precio, descripcion || null]
            );
            return {
                id: result.insertId,
                nombre,
                capacidad,
                precio,
                descripcion
            };
        } catch (error) {
            throw new Error(`Error al crear salón: ${error.message}`);
        }
    }

    static async actualizar(id, salonData) {
        try {
            const { nombre, capacidad, precio, descripcion } = salonData;
            const [result] = await conexion.execute(
                'UPDATE salones SET nombre = ?, capacidad = ?, precio = ?, descripcion = ? WHERE id = ?',
                [nombre, capacidad, precio, descripcion || null, id]
            );
            
            if (result.affectedRows === 0) {
                return null;
            }
            
            return {
                id: parseInt(id),
                nombre,
                capacidad,
                precio,
                descripcion
            };
        } catch (error) {
            throw new Error(`Error al actualizar salón: ${error.message}`);
        }
    }

    static async eliminar(id) {
        try {
            const [result] = await conexion.execute('DELETE FROM salones WHERE id = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error(`Error al eliminar salón: ${error.message}`);
        }
    }

    static async existe(id) {
        try {
            const [rows] = await conexion.execute('SELECT 1 FROM salones WHERE id = ?', [id]);
            return rows.length > 0;
        } catch (error) {
            throw new Error(`Error al verificar existencia del salón: ${error.message}`);
        }
    }
}
