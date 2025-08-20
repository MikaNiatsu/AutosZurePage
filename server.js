const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 80;

// Configurar CORS
app.use(cors({
  origin: ['https://linares-saenz.website', 'http://linares-saenz.website', 'http://localhost:3000'],
  credentials: true
}));

// Servir archivos estáticos desde el directorio 'dist'
app.use(express.static(path.join(__dirname, 'dist')));

// Manejar rutas de React (SPA routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor corriendo en puerto ${port}`);
  console.log(`Sitio disponible en: http://linares-saenz.website`);
});