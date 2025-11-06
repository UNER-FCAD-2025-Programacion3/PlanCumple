import conexion from '../config/database.js';

export class UsuarioModel {
    static async obtenerTodos() {
        try {
            const [rows] = await conexion.execute(
                'SELECT usuario_id, nombre, apellido, nombre_usuario, tipo_usuario, celular, foto FROM usuarios WHERE activo = 1 ORDER BY apellido ASC, nombre ASC'
            );
            return rows;
        } catch (error) {
            throw new Error(`Error al obtener usuarios: ${error.message}`);
        }
    }

    static async obtenerPorId(id) {
        try {
            const [rows] = await conexion.execute(
                'SELECT usuario_id, nombre, apellido, nombre_usuario, tipo_usuario, celular, foto FROM usuarios WHERE usuario_id = ? AND activo = 1', 
                [id]
            );
            return rows[0] || null;
        } catch (error) {
            throw new Error(`Error al obtener usuario por ID: ${error.message}`);
        }
    }

    static async obtenerPorNombreUsuario(nombreUsuario) {
        try {
            const [rows] = await conexion.execute(
                'SELECT usuario_id, nombre, apellido, nombre_usuario, contrasenia, tipo_usuario, celular, foto, activo FROM usuarios WHERE nombre_usuario = ? AND activo = 1', 
                [nombreUsuario]
            );
            return rows[0] || null;
        } catch (error) {
            throw new Error(`Error al obtener usuario por nombre de usuario: ${error.message}`);
        }
    }

    static async crear(usuarioData) {
        try {
            const { nombre, apellido, nombre_usuario, contrasenia, tipo_usuario, celular, foto } = usuarioData;
            const [result] = await conexion.execute(
                'INSERT INTO usuarios (nombre, apellido, nombre_usuario, contrasenia, tipo_usuario, celular, foto) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [nombre, apellido, nombre_usuario, contrasenia, tipo_usuario, celular || null, foto || null]
            );

            return {
                usuario_id: result.insertId,
                nombre,
                apellido,
                nombre_usuario,
                tipo_usuario,
                celular,
                foto
            };
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('El nombre de usuario ya existe');
            }
            throw new Error(`Error al crear usuario: ${error.message}`);
        }
    }

    static async actualizar(id, usuarioData) {
        try {
            const usuarioExistente = await this.obtenerPorId(id);
            if (!usuarioExistente) {
                throw new Error(`No se encontró ningún usuario con el ID: ${id}`);
            }

            const { nombre, apellido, nombre_usuario, tipo_usuario, celular, foto } = usuarioData;
            await conexion.execute(
                'UPDATE usuarios SET nombre = ?, apellido = ?, nombre_usuario = ?, tipo_usuario = ?, celular = ?, foto = ? WHERE usuario_id = ?',
                [nombre, apellido, nombre_usuario, tipo_usuario, celular || null, foto || null, id]
            );

            return {
                usuario_id: parseInt(id),
                nombre,
                apellido,
                nombre_usuario,
                tipo_usuario,
                celular,
                foto
            };
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('El nombre de usuario ya existe');
            }
            throw new Error(`Error al actualizar usuario: ${error.message}`);
        }
    }

    static async actualizarContrasenia(id, nuevaContrasenia) {
        try {
            const [result] = await conexion.execute(
                'UPDATE usuarios SET contrasenia = ? WHERE usuario_id = ?',
                [nuevaContrasenia, id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error(`Error al actualizar contraseña: ${error.message}`);
        }
    }

    static async eliminarLogico(id) {
        try {
            const [result] = await conexion.execute('UPDATE usuarios SET activo = 0 WHERE usuario_id = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error(`Error al eliminar usuario: ${error.message}`);
        }
    }

    static async existe(id) {
        try {
            const [rows] = await conexion.execute('SELECT 1 FROM usuarios WHERE usuario_id = ?', [id]);
            return rows.length > 0;
        } catch (error) {
            throw new Error(`Error al verificar existencia del usuario: ${error.message}`);
        }
    }

    static async existeNombreUsuario(nombreUsuario, excludeId = null) {
        try {
            let query = 'SELECT 1 FROM usuarios WHERE nombre_usuario = ?';
            let params = [nombreUsuario];
            
            if (excludeId) {
                query += ' AND usuario_id != ?';
                params.push(excludeId);
            }
            
            const [rows] = await conexion.execute(query, params);
            return rows.length > 0;
        } catch (error) {
            throw new Error(`Error al verificar existencia del nombre de usuario: ${error.message}`);
        }
    }

    static async obtenerPorTipo(tipoUsuario) {
        try {
            const [rows] = await conexion.execute(
                'SELECT usuario_id, nombre, apellido, nombre_usuario, tipo_usuario, celular, foto, activo, creado, modificado FROM usuarios WHERE tipo_usuario = ? AND activo = 1 ORDER BY apellido ASC, nombre ASC',
                [tipoUsuario]
            );
            return rows;
        } catch (error) {
            throw new Error(`Error al obtener usuarios por tipo: ${error.message}`);
        }
    }
}