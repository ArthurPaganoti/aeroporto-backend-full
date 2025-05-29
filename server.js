require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
app.use(cors()); // Habilita CORS para todas as rotas
app.use(express.json());

connectDB();

// Rotas
app.use('/employees', require('./routes/employeeRoutes')); // Rotas de funcionários
app.use('/passengers', require('./routes/passengerRoutes')); // Rotas de passageiros
app.use('/flights', require('./routes/flightRoutes')); // Rotas de voos
app.use('/gates', require('./routes/gateRoutes')); // Rotas de portões
app.use('/reports', require('./routes/reportRoutes')); // Rotas de relatórios

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));