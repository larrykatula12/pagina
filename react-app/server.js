const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const RESPUESTAS_FILE = path.join(__dirname, 'respuestas.json');

app.use(express.json());

app.post('/api/respuestas', async (req, res) => {
  try {
    const nuevasRespuestas = req.body;
    const archivoExistente = await fs.readFile(RESPUESTAS_FILE, 'utf8').catch(() => '[]');
    const respuestasGuardadas = JSON.parse(archivoExistente || '[]');

    respuestasGuardadas.push({
      id: Date.now(),
      fecha: new Date().toISOString(),
      respuestas: nuevasRespuestas,
    });

    await fs.writeFile(RESPUESTAS_FILE, JSON.stringify(respuestasGuardadas, null, 2), 'utf8');
    res.status(201).json({ message: 'Respuestas guardadas en el servidor' });
  } catch (error) {
    console.error('Error al guardar respuestas:', error);
    res.status(500).json({ message: 'No se pudo guardar las respuestas en el servidor' });
  }
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Servidor de respuestas escuchando en http://localhost:${PORT}`);
});
