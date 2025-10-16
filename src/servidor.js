import app from './reservas.js';

process.loadEnvFile();

app.listen(process.env.NODE_PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${process.env.NODE_PORT}`);
});