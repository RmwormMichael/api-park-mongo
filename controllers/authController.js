const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
require('dotenv').config();
const ROLES = require('../constants/roles');

const authController = {
  async register(req, res) {
  try {
    const { idRol, nombreCompleto, documento, correo, telefono, contrasena } = req.body;

    // 🔒 Roles permitidos desde frontend
    const allowedRoles = [2, 3, 4];
    if (!allowedRoles.includes(idRol)) {
      return res.status(403).json({ message: 'Rol no permitido' });
    }

    const exists = await User.findOne({ Correo: correo });
    if (exists) {
      return res.status(400).json({ message: 'Correo ya registrado' });
    }

    const hashed = await bcrypt.hash(contrasena, 10);

    const user = await User.create({
      IdRol: idRol,
      NombreRol: ROLES[idRol], // 🔥 AQUÍ se corrige el problema
      NombreCompleto: nombreCompleto,
      Documento: documento,
      Correo: correo,
      Telefono: telefono,
      Contrasena: hashed
    });

    res.status(201).json({ message: 'Usuario creado', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error en registro' });
  }
},

  async login(req, res) {
    try {
      const { correo, contrasena } = req.body;

      const user = await User.findOne({ Correo: correo });
      if (!user) return res.status(400).json({ message: 'Credenciales inválidas' });

      const ok = await bcrypt.compare(contrasena, user.Contrasena);
      if (!ok) return res.status(400).json({ message: 'Credenciales inválidas' });

      const payload = {
        id: user._id,
        idRol: user.IdRol,
        correo: user.Correo,
        nombre: user.NombreCompleto,
        idRolName: user.NombreRol
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });
      res.json({ token, user: payload });
    } catch (err) {
      res.status(500).json({ message: 'Error en login' });
    }
  }
};

module.exports = authController;
