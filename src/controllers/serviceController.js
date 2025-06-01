import Service from '../models/serviceModel.js';

export const createService = (req, res) => {
  const { tipo, fecha, costo, taller, descripcion } = req.body;
  const userId = req.user.id;

  Service.create(userId, tipo, fecha, costo, taller, descripcion, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Servicio registrado", id: result.insertId });
  });
};

export const getUserServices = (req, res) => {
  const userId = req.user.id;

  Service.getByUserId(userId, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ services: results });
  });
};

export const updateService = (req, res) => {
  const { id } = req.params;
  const { tipo, fecha, costo, taller, descripcion } = req.body;
  const userId = req.user.id;

  Service.update(id, userId, tipo, fecha, costo, taller, descripcion, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Servicio no encontrado o no autorizado" });
    res.status(200).json({ message: "Servicio actualizado" });
  });
};

export const deleteService = (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  Service.delete(id, userId, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Servicio no encontrado o no autorizado" });
    res.status(200).json({ message: "Servicio eliminado" });
  });
};
