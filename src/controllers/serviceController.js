import * as Service from '../models/Service.js';

const formatDateToReadable = (dateString) => {
  if (!dateString) return null;
  
  try {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error('Error formateando fecha:', error);
    return dateString; 
  }
};

const formatDateForDatabase = (dateString) => {
  if (!dateString) return null;
  
  try {

    if (dateString.includes('/')) {
      const [day, month, year] = dateString.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    
   
    return dateString;
  } catch (error) {
    console.error('Error convirtiendo fecha para BD:', error);
    return dateString;
  }
};

export const getAll = async (req, res) => {
  try {
    const [rows] = await Service.getAllServices();
    
 
    const servicesWithFormattedData = rows.map(service => ({
      ...service,
      fecha: formatDateToReadable(service.fecha), 
      imagenUrl: service.imagenUrl || null
    }));
    
    res.json({
      message: 'Servicios obtenidos exitosamente',
      user: req.user.name,
      data: servicesWithFormattedData
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
      data: {
        ...row[0],
        fecha: formatDateToReadable(row[0].fecha), 
        imagenUrl: row[0].imagenUrl || null
      }
    });
  } catch (error) {
    console.error('Error al obtener servicio:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const create = async (req, res) => {
  try {
    const { tipo, fecha, costo, taller, descripcion, imagenUrl } = req.body;
    
  
    if (!tipo || !fecha || !costo || !taller) {
      return res.status(400).json({ 
        message: 'Campos requeridos: tipo, fecha, costo, taller' 
      });
    }

    
    const fechaParaBD = formatDateForDatabase(fecha);

    console.log('📸 Datos recibidos:', {
      tipo,
      fecha: `${fecha} → ${fechaParaBD}`, 
      costo,
      taller,
      descripcion,
      imagenUrl: imagenUrl ? 'SÍ tiene imagen' : 'NO tiene imagen'
    });

    await Service.createService(tipo, fechaParaBD, costo, taller, descripcion, imagenUrl);
    
    res.status(201).json({
      message: 'Servicio creado exitosamente',
      createdBy: req.user.name,
      hasImage: !!imagenUrl
    });
  } catch (error) {
    console.error('Error al crear servicio:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const update = async (req, res) => {
  try {
    const { tipo, fecha, costo, taller, descripcion, imagenUrl } = req.body;
    
  
    const [existing] = await Service.getServiceById(req.params.id);
    if (!existing.length) {
      return res.status(404).json({ message: 'Servicio no encontrado' });
    }

  
    const fechaParaBD = fecha ? formatDateForDatabase(fecha) : existing[0].fecha;
    
   
    const finalImagenUrl = imagenUrl !== undefined ? imagenUrl : existing[0].imagenUrl;

    console.log('🔄 Actualizando servicio:', {
      id: req.params.id,
      fecha: fecha ? `${fecha} → ${fechaParaBD}` : 'Sin cambios',
      hasImage: !!finalImagenUrl
    });

    await Service.updateService(
      req.params.id, 
      tipo, 
      fechaParaBD, 
      costo, 
      taller, 
      descripcion, 
      finalImagenUrl
    );
    
    res.json({
      message: 'Servicio actualizado exitosamente',
      updatedBy: req.user.name,
      hasImage: !!finalImagenUrl
    });
  } catch (error) {
    console.error('Error al actualizar servicio:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const remove = async (req, res) => {
  try {
   
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