import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UsuarioModel } from '../models/usuarioModel.js';

process.loadEnvFile();

class AuthService {
    static instance = null;

    static getInstance() {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    // Generar token JWT
    generarToken(usuario) {
        const payload = {
            id: usuario.usuario_id,
            nombre_usuario: usuario.nombre_usuario,
            tipo_usuario: usuario.tipo_usuario
        };

        return jwt.sign(
            payload, 
            process.env.JWT_SECRET || 'clave_secreta',
            { expiresIn: '24h' }
        );
    }

    // Login con usuario y contraseña
    async login(nombre_usuario, contrasenia) {
        try {
            // Buscar usuario por nombre de usuario
            const usuario = await UsuarioModel.obtenerPorNombreUsuario(nombre_usuario);
            
            if (!usuario) {
                throw new Error('Credenciales inválidas');
            }

            // Verificar contraseña
            const contraseniaValida = await bcrypt.compare(contrasenia, usuario.contrasenia);
            
            if (!contraseniaValida) {
                throw new Error('Credenciales inválidas');
            }

            // Generar token
            const token = this.generarToken(usuario);

            // Retornar usuario sin contraseña y token
            const { contrasenia: _, ...usuarioSinContrasenia } = usuario;
            
            return {
                usuario: usuarioSinContrasenia,
                token
            };

        } catch (error) {
            throw new Error(`Error en login: ${error.message}`);
        }
    }

    // Verificar token
    verificarToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET || 'clave_secreta');
        } catch (error) {
            throw new Error('Token inválido');
        }
    }
}

export default AuthService;