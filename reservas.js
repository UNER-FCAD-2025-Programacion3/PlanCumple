// Cargar variables de entorno al inicio de la aplicación
process.loadEnvFile();

import express from 'express';
import notificacionRoutes from './routes/notificacionRoutes.js';
import salonRoutes from './routes/salonRoutes.js';


const app = express();
app.use(express.json());

app.get('/estado', (req, res) => {
    res.json({ estado: 'todo bien!' });
});

// Usar las rutas
app.use('/api', notificacionRoutes);
app.use('/api', salonRoutes);

app.listen(process.env.NODE_PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${process.env.NODE_PORT}`);
});