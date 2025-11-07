import AuthService from '../services/authService.js';
import JSendResponse from '../utils/jsendResponse.js';

class AuthController {
    constructor() {
        this.authService = AuthService.getInstance();
    }

    // POST /api/v1/auth/login
    login = async (req, res) => {
        try {
            const { nombre_usuario, contrasenia } = req.body;

            const resultado = await this.authService.login(nombre_usuario, contrasenia);

            res.status(200).json(JSendResponse.success({
                mensaje: 'Login exitoso',
                ...resultado
            }));

        } catch (error) {
            if (error.message.includes('Credenciales inválidas')) {
                return res.status(401).json(JSendResponse.fail({ 
                    auth: error.message 
                }));
            }
            
            res.status(500).json(JSendResponse.error('Error interno del servidor'));
        }
    };

    // GET /api/v1/auth/perfil - Obtener perfil del usuario autenticado
    perfil = async (req, res) => {
        try {
            // El usuario viene de passport después de verificar el token
            res.status(200).json(JSendResponse.success({
                usuario: req.user
            }));
        } catch (error) {
            res.status(500).json(JSendResponse.error('Error interno del servidor'));
        }
    };
}

export default AuthController;