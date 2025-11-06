import { UsuarioModel } from '../models/usuarioModel.js';
import bcrypt from 'bcrypt';

class UsuarioService {
    static instance = null;

    static getInstance() {
        if (!UsuarioService.instance) {
            UsuarioService.instance = new UsuarioService();
        }
        return UsuarioService.instance;
    }

    constructor() {
        if (UsuarioService.instance) return UsuarioService.instance;
        UsuarioService.instance = this;
    }

    async obtenerTodos() {
        try {
            return UsuarioModel.obtenerTodos();
        } catch (error) {
            console.error('Error en UsuarioService al obtener todos los usuarios:', error);
            throw new Error('Error al obtener la lista de usuarios');
        }
    }

    async obtenerPorId(id) {
        try {
            if (!id || isNaN(parseInt(id))) throw new Error('ID inválido proporcionado');
            return UsuarioModel.obtenerPorId(id);
        } catch (error) {
            console.error('Error en UsuarioService al obtener usuario por ID:', error);
            throw new Error(`Error al obtener el usuario con ID: ${id}`);
        }
    }

    async obtenerPorNombreUsuario(nombreUsuario) {
        try {
            if (!nombreUsuario || typeof nombreUsuario !== 'string') {
                throw new Error('Nombre de usuario inválido proporcionado');
            }
            return UsuarioModel.obtenerPorNombreUsuario(nombreUsuario);
        } catch (error) {
            console.error('Error en UsuarioService al obtener usuario por nombre de usuario:', error);
            throw new Error(`Error al obtener el usuario: ${nombreUsuario}`);
        }
    }

    async crear(datosUsuario) {
        try {
            const { nombre, apellido, nombre_usuario, contrasenia, tipo_usuario, celular, foto } = datosUsuario;
            
            // Validaciones
            if (!nombre || !apellido || !nombre_usuario || !contrasenia) {
                throw new Error('Los campos nombre, apellido, nombre_usuario y contrasenia son obligatorios');
            }

            if (typeof tipo_usuario !== 'number' || tipo_usuario < 0 || tipo_usuario > 255) {
                throw new Error('El tipo_usuario debe ser un número entre 0 y 255');
            }

            // Verificar si el nombre de usuario ya existe
            const existeNombreUsuario = await UsuarioModel.existeNombreUsuario(nombre_usuario);
            if (existeNombreUsuario) {
                throw new Error('El nombre de usuario ya existe');
            }

            // Validar formato de celular si se proporciona
            if (celular && celular !== null && !/^\+?[\d\s\-()]{7,20}$/.test(celular)) {
                throw new Error('El formato del celular es inválido');
            }

            // Encriptar contraseña
            const contraseniaEncriptada = await bcrypt.hash(contrasenia, 10);

            const datosParaCrear = {
                nombre: nombre.trim(),
                apellido: apellido.trim(),
                nombre_usuario: nombre_usuario.trim(),
                contrasenia: contraseniaEncriptada,
                tipo_usuario,
                celular: celular && celular !== null ? celular.trim() : null,
                foto: foto && foto !== null ? foto.trim() : null
            };

            return UsuarioModel.crear(datosParaCrear);
        } catch (error) {
            console.error('Error en UsuarioService al crear usuario:', error);
            throw error;
        }
    }

    async actualizar(id, datosUsuario) {
        try {
            if (!id || isNaN(parseInt(id))) throw new Error('ID inválido proporcionado');

            const existe = await this.existe(id);
            if (!existe) throw new Error(`No se encontró ningún usuario con el ID: ${id}`);

            const { nombre, apellido, nombre_usuario, tipo_usuario, celular, foto } = datosUsuario;

            // Validaciones
            if (nombre && typeof nombre !== 'string') {
                throw new Error('El nombre debe ser una cadena de texto');
            }
            if (apellido && typeof apellido !== 'string') {
                throw new Error('El apellido debe ser una cadena de texto');
            }
            if (nombre_usuario && typeof nombre_usuario !== 'string') {
                throw new Error('El nombre de usuario debe ser una cadena de texto');
            }
            if (tipo_usuario !== undefined && (typeof tipo_usuario !== 'number' || tipo_usuario < 0 || tipo_usuario > 255)) {
                throw new Error('El tipo_usuario debe ser un número entre 0 y 255');
            }

            // Verificar si el nuevo nombre de usuario ya existe (excluyendo el usuario actual)
            if (nombre_usuario) {
                const existeNombreUsuario = await UsuarioModel.existeNombreUsuario(nombre_usuario, id);
                if (existeNombreUsuario) {
                    throw new Error('El nombre de usuario ya existe');
                }
            }

            // Validar formato de celular si se proporciona
            if (celular && celular !== null && !/^\+?[\d\s\-()]{7,20}$/.test(celular)) {
                throw new Error('El formato del celular es inválido');
            }

            const datosParaActualizar = {
                nombre: nombre ? nombre.trim() : undefined,
                apellido: apellido ? apellido.trim() : undefined,
                nombre_usuario: nombre_usuario ? nombre_usuario.trim() : undefined,
                tipo_usuario,
                celular: celular !== undefined ? (celular && celular !== null ? celular.trim() : null) : undefined,
                foto: foto !== undefined ? (foto && foto !== null ? foto.trim() : null) : undefined
            };

            // Remover campos undefined
            Object.keys(datosParaActualizar).forEach(key => 
                datosParaActualizar[key] === undefined && delete datosParaActualizar[key]
            );

            return UsuarioModel.actualizar(id, datosParaActualizar);
        } catch (error) {
            console.error('Error en UsuarioService al actualizar usuario:', error);
            throw error;
        }
    }

    async actualizarContrasenia(id, contraseniaActual, nuevaContrasenia) {
        try {
            if (!id || isNaN(parseInt(id))) throw new Error('ID inválido proporcionado');
            if (!contraseniaActual || !nuevaContrasenia) {
                throw new Error('La contraseña actual y la nueva contraseña son obligatorias');
            }

            // Obtener usuario con contraseña
            const usuario = await UsuarioModel.obtenerPorNombreUsuario(
                (await UsuarioModel.obtenerPorId(id))?.nombre_usuario
            );
            
            if (!usuario) {
                throw new Error(`No se encontró ningún usuario con el ID: ${id}`);
            }

            // Verificar contraseña actual
            const contraseniaValida = await bcrypt.compare(contraseniaActual, usuario.contrasenia);
            if (!contraseniaValida) {
                throw new Error('La contraseña actual es incorrecta');
            }

            // Encriptar nueva contraseña
            const nuevaContraseniaEncriptada = await bcrypt.hash(nuevaContrasenia, 10);

            return UsuarioModel.actualizarContrasenia(id, nuevaContraseniaEncriptada);
        } catch (error) {
            console.error('Error en UsuarioService al actualizar contraseña:', error);
            throw error;
        }
    }

    async eliminar(id) {
        try {
            if (!id || isNaN(parseInt(id))) throw new Error('ID inválido proporcionado');

            const existe = await this.existe(id);
            if (!existe) throw new Error(`No se encontró ningún usuario con el ID: ${id}`);

            return UsuarioModel.eliminarLogico(id);
        } catch (error) {
            console.error('Error en UsuarioService al eliminar usuario:', error);
            throw error;
        }
    }

    async existe(id) {
        try {
            return UsuarioModel.existe(id);
        } catch (error) {
            console.error('Error en UsuarioService al verificar existencia:', error);
            throw new Error('Error al verificar la existencia del usuario');
        }
    }

    async obtenerPorTipo(tipoUsuario) {
        try {
            if (typeof tipoUsuario !== 'number' || tipoUsuario < 0 || tipoUsuario > 255) {
                throw new Error('El tipo_usuario debe ser un número entre 0 y 255');
            }
            return UsuarioModel.obtenerPorTipo(tipoUsuario);
        } catch (error) {
            console.error('Error en UsuarioService al obtener usuarios por tipo:', error);
            throw new Error(`Error al obtener usuarios del tipo: ${tipoUsuario}`);
        }
    }

    async autenticar(nombreUsuario, contrasenia) {
        try {
            if (!nombreUsuario || !contrasenia) {
                throw new Error('Nombre de usuario y contraseña son obligatorios');
            }

            const usuario = await UsuarioModel.obtenerPorNombreUsuario(nombreUsuario);
            if (!usuario) {
                throw new Error('Credenciales inválidas');
            }

            const contraseniaValida = await bcrypt.compare(contrasenia, usuario.contrasenia);
            if (!contraseniaValida) {
                throw new Error('Credenciales inválidas');
            }

            // Retornar usuario sin contraseña
            const { contrasenia: _, ...usuarioSinContrasenia } = usuario;
            return usuarioSinContrasenia;
        } catch (error) {
            console.error('Error en UsuarioService al autenticar usuario:', error);
            throw error;
        }
    }

    async obtenerEstadisticas() {
        try {
            const usuarios = await UsuarioModel.obtenerTodos();
            const estadisticasPorTipo = usuarios.reduce((acc, usuario) => {
                acc[usuario.tipo_usuario] = (acc[usuario.tipo_usuario] || 0) + 1;
                return acc;
            }, {});

            return {
                total: usuarios.length,
                porTipo: estadisticasPorTipo,
                fechaUltimoRegistro: usuarios.length > 0 ? 
                    Math.max(...usuarios.map(u => new Date(u.creado).getTime())) : null
            };
        } catch (error) {
            console.error('Error en UsuarioService al obtener estadísticas:', error);
            throw new Error('Error al obtener estadísticas de usuarios');
        }
    }
}

export default UsuarioService;