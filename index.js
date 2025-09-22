process.loadEnvFile();
import express from 'express';
import notificacionRoutes from './routes/notificacionRoutes.js';


const app = express();
app.use(express.json());

app.get('/estado', (req, res) => {
    res.json({ estado: 'todo bien perro' });
});

// Usar las rutas
app.use('/api', notificacionRoutes);

app.listen(process.env.NODE_PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${process.env.NODE_PORT}`);
});