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
                salon_id: result.insertId,
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
            // Verificar si el salón existe primero
            const salonExistente = await this.obtenerPorId(id);
            if (!salonExistente) {
                throw new Error(`No se encontró ningún salón con el ID: ${id}`);
            }

            const { titulo, direccion, latitud, longitud, capacidad, importe } = salonData;
            const [result] = await conexion.execute(
                'UPDATE salones SET titulo = ?, direccion = ?, latitud = ?, longitud = ?, capacidad = ?, importe = ? WHERE salon_id = ?',
                [titulo, direccion, latitud || null, longitud || null, capacidad, importe, id]
            );
            
            return {
                salon_id: parseInt(id),
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

    // NOTE: No lo estoy usando
    /* Actualizar parcialmente un salón - Es como un PATCH */
    static async actualizarPorPartes(id, datos) {
        try {
            // Verificar si el salón existe primero
            const salonExistente = await this.obtenerPorId(id);
            if (!salonExistente) {
                throw new Error(`No se encontró ningún salón con el ID: ${id}`);
            }

            // Obtener claves y valores de los datos a modificar
            const camposAActualizar = Object.keys(datos);
            const valoresAActualizar = Object.values(datos);

            // Validar que hay campos para actualizar
            if (camposAActualizar.length === 0) {
                throw new Error('No se proporcionaron campos para actualizar');
            }

            // Campos permitidos para actualizar
            const camposPermitidos = ['titulo', 'direccion', 'latitud', 'longitud', 'capacidad', 'importe'];
            const camposInvalidos = camposAActualizar.filter(campo => !camposPermitidos.includes(campo));
            
            if (camposInvalidos.length > 0) {
                throw new Error(`Campos no válidos para actualizar: ${camposInvalidos.join(', ')}`);
            }

            // Armar la parte SET de la instrucción SQL: "titulo = ?, direccion = ?, ..."
            const setValores = camposAActualizar.map(campo => `${campo} = ?`).join(', ');

            // Array de parámetros
            const parametros = [...valoresAActualizar, id];

            // SQL final
            const sql = `UPDATE salones SET ${setValores} WHERE salon_id = ?`;
            
            const [result] = await conexion.execute(sql, parametros);

            if (result.affectedRows === 0) {
                throw new Error(`No se pudo actualizar el salón con ID: ${id}`);
            }

            // Retornar el salón actualizado
            return await this.obtenerPorId(id);
        } catch (error) {
            throw new Error(`Error al actualizar salón por partes: ${error.message}`);
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
