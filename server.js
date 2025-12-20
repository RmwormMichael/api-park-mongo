const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path'); 
dotenv.config();

const connectDB = require('./config/db');
connectDB();


const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const vehicleRoutes = require('./routes/vehicles');
const movimientoRoutes = require('./routes/movimientos');
const notiRoutes = require('./routes/notificaciones');
const reporteRoutes = require('./routes/reportes');

const app = express();
app.use(cors());
app.use(express.json());

// Servir archivos estáticos desde la carpeta uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/movimientos', movimientoRoutes);
app.use('/api/notificaciones', notiRoutes);
app.use('/api/reportes', reporteRoutes);

// health
app.get('/', (req, res) => res.json({ ok: true, service: 'SENA ParkControl API' }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
