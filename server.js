require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Adicionado CORS
const connectDB = require('./config/db');

const app = express();
app.use(cors()); // Habilita CORS para todas as rotas
app.use(express.json());

connectDB();

app.use('/passengers', require('./routes/passengerRoutes'));
app.use('/flights', require('./routes/flightRoutes'));
app.use('/gates', require('./routes/gateRoutes'));
app.use('/report', require('./routes/reportRoutes'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));