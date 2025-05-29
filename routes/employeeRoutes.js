const express = require('express');
const router = express.Router();
const EmployeeController = require('../controllers/employeeController');

// Rota de cadastro
router.post('/register', EmployeeController.register);

// Rota de login
router.post('/login', EmployeeController.login);

module.exports = router;