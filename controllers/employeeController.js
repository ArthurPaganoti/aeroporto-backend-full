const Employee = require('../models/Employee');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

class EmployeeController {
  // Cadastro de funcionário
  static async register(req, res) {
    try {
      const { nome, email, senha, cargo } = req.body;

      // Verifica se o email já está em uso
      const existingEmployee = await Employee.findOne({ email });
      if (existingEmployee) {
        return res.status(400).json({ error: 'Email já está em uso.' });
      }

      // Verifica se o cargo é válido
      if (!['admin', 'user'].includes(cargo)) {
        return res.status(400).json({ error: 'Cargo inválido. Use "admin" ou "user".' });
      }

      // Cria o funcionário
      const employee = new Employee({ nome, email, senha, cargo });
      await employee.save();

      res.status(201).json({ message: 'Funcionário cadastrado com sucesso.' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  // Login de funcionário
  static async login(req, res) {
    try {
      const { email, senha } = req.body;

      // Verifica se o funcionário existe
      const employee = await Employee.findOne({ email });
      if (!employee) {
        return res.status(404).json({ error: 'Credenciais inválidas.' });
      }

      // Verifica a senha
      const isMatch = await bcrypt.compare(senha, employee.senha);
      if (!isMatch) {
        return res.status(401).json({ error: 'Credenciais inválidas.' });
      }

      // Gera o token JWT
      const token = jwt.sign(
        { id: employee._id, nome: employee.nome, cargo: employee.cargo },
        'secreta', // Substitua por uma variável de ambiente em produção
        { expiresIn: '2m' }
      );

      res.json({ token });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}

module.exports = EmployeeController;