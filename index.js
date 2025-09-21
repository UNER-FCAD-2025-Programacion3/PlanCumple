import express from 'express';

const app = express();
app.use(express.json());

process.loadEnvFile();

app.get('/estado', (req, res) => {
  res.json({ estado: 'todo bien perro' });
});

app.listen(process.env.PUERTO, () => {
  console.log(`Server arriba en http://localhost:${process.env.PUERTO}`);
});