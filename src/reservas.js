import express from 'express';
import JSendResponse from './utils/jsendResponse.js';
import notificacionRoutes from './v1/routes/notificacionRoutes.js';
import salonRoutes from './v1/routes/salonRoutes.js';
import turnoRoutes from './v1/routes/turnoRoutes.js';

const app = express();
app.use(express.json());

app.get('/estado', (req, res) => {
    res.status(200).json(JSendResponse.success({ estado: 'todo bien!' }));
});

app.use('/api/v1', notificacionRoutes);
app.use('/api/v1', salonRoutes);
app.use('/api/v1', turnoRoutes);

export default app;