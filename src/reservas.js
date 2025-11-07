import express from 'express';
import cors from 'cors';
import passport from './config/passport.js';
import JSendResponse from './utils/jsendResponse.js';
import authRoutes from './v1/routes/authRoutes.js';
import notificacionRoutes from './v1/routes/notificacionRoutes.js';
import reservaRoutes from './v1/routes/reservaRoutes.js';
import reservaServicioRoutes from './v1/routes/reservaServicioRoutes.js';
import salonRoutes from './v1/routes/salonRoutes.js';
import servicioRoutes from './v1/routes/servicioRoutes.js';
import turnoRoutes from './v1/routes/turnoRoutes.js';
import usuarioRoutes from './v1/routes/usuarioRoutes.js';

const app = express();

// Configuración CORS
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'], // Puertos comunes para frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    origin: true
}));

app.use(express.json());

// Inicializar Passport
app.use(passport.initialize());

app.get('/estado', (req, res) => {
    res.status(200).json(JSendResponse.success({ estado: 'todo bien!' }));
});

// Rutas de autenticación
app.use('/api/v1', authRoutes);

// Otras rutas
app.use('/api/v1', notificacionRoutes);
app.use('/api/v1', reservaRoutes);
app.use('/api/v1', reservaServicioRoutes);
app.use('/api/v1', salonRoutes);
app.use('/api/v1', servicioRoutes);
app.use('/api/v1', turnoRoutes);
app.use('/api/v1', usuarioRoutes);

export default app;