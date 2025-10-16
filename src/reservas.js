import express from 'express';
import notificacionRoutes from './v1/routes/notificacionRoutes.js';
import salonRoutes from './v1/routes/salonRoutes.js';


const app = express();
app.use(express.json());

app.get('/estado', (req, res) => {
    res.json({ estado: 'todo bien!' });
});

app.use('/api/v1', notificacionRoutes);
app.use('/api/v1', salonRoutes);

export default app;