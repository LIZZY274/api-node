import * as Service from '../models/Service.js';

export const getAll = async (req, res) => {
  try {
    const [rows] = await Service.getAllServices();
    res.json({
      message: 'Servicios obtenidos exitosamente',
      user: req.user.name, // Información del usuario autenticado
      data: rows
    });
  } catch (error) {
    console.error('Error al obtener servicios:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getById = async (req, res) => {
  try {
    const [row] = await Service.getServiceById(req.params.id);
    if (!row.length) {
      return res.status(404).json({ message: 'Servicio no encontrado' });
    }
    res.json({
      message: 'Servicio encontrado',
      user: req.user.name,
      data: row[0]
    });
  } catch (error) {
    console.error('Error al obtener servicio:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const create = async (req, res) => {
  try {
    const { tipo, fecha, costo, taller, descripcion } = req.body;
    
    // Validar campos requeridos
    if (!tipo || !fecha || !costo || !taller) {
      return res.status(400).json({ message: 'Campos requeridos: tipo, fecha, costo, taller' });
    }

    await Service.createService(tipo, fecha, costo, taller, descripcion);
    res.status(201).json({ 
      message: 'Servicio creado exitosamente',
      createdBy: req.user.name
    });
  } catch (error) {
    console.error('Error al crear servicio:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const update = async (req, res) => {
  try {
    const { tipo, fecha, costo, taller, descripcion } = req.body;
    
    // Verificar si el servicio existe
    const [existing] = await Service.getServiceById(req.params.id);
    if (!existing.length) {
      return res.status(404).json({ message: 'Servicio no encontrado' });
    }

    await Service.updateService(req.params.id, tipo, fecha, costo, taller, descripcion);
    res.json({ 
      message: 'Servicio actualizado exitosamente',
      updatedBy: req.user.name
    });
  } catch (error) {
    console.error('Error al actualizar servicio:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const remove = async (req, res) => {
  try {
    // Verificar si el servicio existe
    const [existing] = await Service.getServiceById(req.params.id);
    if (!existing.length) {
      return res.status(404).json({ message: 'Servicio no encontrado' });
    }

    await Service.deleteService(req.params.id);
    res.json({ 
      message: 'Servicio eliminado exitosamente',
      deletedBy: req.user.name
    });
  } catch (error) {
    console.error('Error al eliminar servicio:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};