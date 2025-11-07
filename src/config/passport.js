import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { UsuarioModel } from '../models/usuarioModel.js';

process.loadEnvFile();

// Configuración JWT Strategy
passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET || 'clave_secreta',
}, async (payload, done) => {
    try {
        const usuario = await UsuarioModel.obtenerPorId(payload.id);
        if (usuario) {
            return done(null, usuario);
        } else {
            return done(null, false);
        }
    } catch (error) {
        return done(error, false);
    }
}));

export default passport;