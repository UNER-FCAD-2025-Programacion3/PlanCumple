import UsuarioService from '../services/usuarioService.js';
import JSendResponse from '../utils/jsendResponse.js';

class UsuarioController {
    constructor() {
        this.usuarioService = UsuarioService.getInstance();
    }

    async obtenerUsuarios(req, res) {
        try {
            const usuarios = await this.usuarioService.obtenerTodos();
            res.status(200).json(JSendResponse.success(usuarios));
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            res.status(500).json(JSendResponse.error('Error interno del servidor'));
        }
    }

    async obtenerUsuarioPorId(req, res) {
        try {
            const { id } = req.params;
            const usuario = await this.usuarioService.obtenerPorId(id);
            
            if (!usuario) {
                return res.status(404).json(JSendResponse.fail({ 
                    usuario_id: `No se encontró ningún usuario con el ID: ${id}` 
                }));
            }

            res.status(200).json(JSendResponse.success(usuario));
        } catch (error) {
            console.error('Error al obtener usuario:', error);
            res.status(500).json(JSendResponse.error('Error interno del servidor'));
        }
    }

    async obtenerUsuarioPorNombreUsuario(req, res) {
        try {
            const { nombreUsuario } = req.params;
            const usuario = await this.usuarioService.obtenerPorNombreUsuario(nombreUsuario);
            
            if (!usuario) {
                return res.status(404).json(JSendResponse.fail({ 
                    nombre_usuario: `No se encontró ningún usuario con el nombre: ${nombreUsuario}` 
                }));
            }

            res.status(200).json(JSendResponse.success(usuario));
        } catch (error) {
            console.error('Error al obtener usuario por nombre:', error);
            res.status(500).json(JSendResponse.error('Error interno del servidor'));
        }
    }

    async crearUsuario(req, res) {
        try {
            const { nombre, apellido, nombre_usuario, contrasenia, tipo_usuario, celular, foto } = req.body;
            const nuevo = await this.usuarioService.crear({ 
                nombre, apellido, nombre_usuario, contrasenia, tipo_usuario, celular, foto 
            });
            res.status(201).json(JSendResponse.success(nuevo));
        } catch (error) {
            console.error('Error al crear usuario:', error);
            if (error.message.includes('obligatorios') || 
                error.message.includes('ya existe') ||
                error.message.includes('tipo_usuario') ||
                error.message.includes('celular')) {
                return res.status(400).json(JSendResponse.fail({ 
                    validation: error.message 
                }));
            }
            res.status(500).json(JSendResponse.error('Error interno del servidor'));
        }
    }

    async actualizarUsuario(req, res) {
        try {
            const { id } = req.params;
            const { nombre, apellido, nombre_usuario, tipo_usuario, celular, foto } = req.body;
            const actualizado = await this.usuarioService.actualizar(id, { 
                nombre, apellido, nombre_usuario, tipo_usuario, celular, foto 
            });
            res.status(200).json(JSendResponse.success(actualizado));
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            if (error.message.includes('No se encontró')) {
                return res.status(404).json(JSendResponse.fail({ 
                    usuario_id: error.message 
                }));
            }
            if (error.message.includes('ya existe') ||
                error.message.includes('tipo_usuario') ||
                error.message.includes('celular') ||
                error.message.includes('ID inválido')) {
                return res.status(400).json(JSendResponse.fail({ 
                    validation: error.message 
                }));
            }
            res.status(500).json(JSendResponse.error('Error interno del servidor'));
        }
    }

    async actualizarContrasenia(req, res) {
        try {
            const { id } = req.params;
            const { contraseniaActual, nuevaContrasenia } = req.body;
            const actualizado = await this.usuarioService.actualizarContrasenia(id, contraseniaActual, nuevaContrasenia);
            
            if (actualizado) {
                return res.status(200).json(JSendResponse.success({ 
                    usuario_id: parseInt(id),
                    message: 'Contraseña actualizada exitosamente' 
                }));
            }
            
            res.status(500).json(JSendResponse.error('No se pudo actualizar la contraseña'));
        } catch (error) {
            console.error('Error al actualizar contraseña:', error);
            if (error.message.includes('No se encontró')) {
                return res.status(404).json(JSendResponse.fail({ 
                    usuario_id: error.message 
                }));
            }
            if (error.message.includes('obligatorias') ||
                error.message.includes('incorrecta') ||
                error.message.includes('ID inválido')) {
                return res.status(400).json(JSendResponse.fail({ 
                    validation: error.message 
                }));
            }
            res.status(500).json(JSendResponse.error('Error interno del servidor'));
        }
    }

    async eliminarUsuario(req, res) {
        try {
            const { id } = req.params;
            const eliminado = await this.usuarioService.eliminar(id);
            
            if (eliminado) {
                return res.status(200).json(JSendResponse.success({ 
                    usuario_id: parseInt(id),
                    message: 'Usuario eliminado exitosamente' 
                }));
            }
            
            res.status(500).json(JSendResponse.error('No se pudo completar la solicitud de eliminación'));
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            if (error.message.includes('No se encontró')) {
                return res.status(404).json(JSendResponse.fail({ 
                    usuario_id: error.message 
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

    async obtenerUsuariosPorTipo(req, res) {
        try {
            const { tipo } = req.params;
            const tipoUsuario = parseInt(tipo);
            
            if (isNaN(tipoUsuario)) {
                return res.status(400).json(JSendResponse.fail({ 
                    tipo_usuario: 'El tipo de usuario debe ser un número válido' 
                }));
            }

            const usuarios = await this.usuarioService.obtenerPorTipo(tipoUsuario);
            res.status(200).json(JSendResponse.success(usuarios));
        } catch (error) {
            console.error('Error al obtener usuarios por tipo:', error);
            if (error.message.includes('tipo_usuario')) {
                return res.status(400).json(JSendResponse.fail({ 
                    validation: error.message 
                }));
            }
            res.status(500).json(JSendResponse.error('Error interno del servidor'));
        }
    }

    async autenticarUsuario(req, res) {
        try {
            const { nombre_usuario, contrasenia } = req.body;
            const usuario = await this.usuarioService.autenticar(nombre_usuario, contrasenia);
            res.status(200).json(JSendResponse.success(usuario));
        } catch (error) {
            console.error('Error al autenticar usuario:', error);
            if (error.message.includes('obligatorios') || error.message.includes('inválidas')) {
                return res.status(401).json(JSendResponse.fail({ 
                    authentication: error.message 
                }));
            }
            res.status(500).json(JSendResponse.error('Error interno del servidor'));
        }
    }

    async obtenerEstadisticas(req, res) {
        try {
            const estadisticas = await this.usuarioService.obtenerEstadisticas();
            res.status(200).json(JSendResponse.success(estadisticas));
        } catch (error) {
            console.error('Error al obtener estadísticas:', error);
            res.status(500).json(JSendResponse.error('Error interno del servidor'));
        }
    }
}

const usuarioController = new UsuarioController();

export const obtenerUsuarios = usuarioController.obtenerUsuarios.bind(usuarioController);
export const obtenerUsuarioPorId = usuarioController.obtenerUsuarioPorId.bind(usuarioController);
export const obtenerUsuarioPorNombreUsuario = usuarioController.obtenerUsuarioPorNombreUsuario.bind(usuarioController);
export const crearUsuario = usuarioController.crearUsuario.bind(usuarioController);
export const actualizarUsuario = usuarioController.actualizarUsuario.bind(usuarioController);
export const actualizarContrasenia = usuarioController.actualizarContrasenia.bind(usuarioController);
export const eliminarUsuario = usuarioController.eliminarUsuario.bind(usuarioController);
export const obtenerUsuariosPorTipo = usuarioController.obtenerUsuariosPorTipo.bind(usuarioController);
export const autenticarUsuario = usuarioController.autenticarUsuario.bind(usuarioController);
export const obtenerEstadisticas = usuarioController.obtenerEstadisticas.bind(usuarioController);

export default UsuarioController;