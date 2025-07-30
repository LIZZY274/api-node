import * as Service from '../models/Service.js';

// ✅ NUEVA: Función para convertir fecha DD/MM/YYYY a YYYY-MM-DD
const convertDateFormat = (dateString) => {
  if (!dateString) return null;
  
  // Si ya está en formato YYYY-MM-DD, no hacer nada
  if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return dateString;
  }
  
  // Convertir DD/MM/YYYY a YYYY-MM-DD
  if (dateString.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
  }
  
  // Si no coincide con ningún formato, devolver como está
  console.log('⚠️ Formato de fecha no reconocido:', dateString);
  return dateString;
};

export const getServices = async (req, res) => {
  try {
    const userId = req.user.id; 
    const [services] = await Service.getServicesByUser(userId);
    
    res.json({
      success: true,
      data: services,
      message: `${services.length} servicios encontrados`
    });
  } catch (error) {
    console.error('Error al obtener servicios:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const getService = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const [service] = await Service.getServiceById(id, userId);
    
    if (!service.length) {
      return res.status(404).json({
        success: false,
        message: 'Servicio no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: service[0]
    });
  } catch (error) {
    console.error('Error al obtener servicio:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// ✅ ACTUALIZADO: Crear servicio con conversión de fecha
export const createService = async (req, res) => {
  try {
    const { tipo, fecha, costo, taller, descripcion, imagenUrl } = req.body;
    const userId = req.user.id;
    
    // Validaciones
    if (!tipo || !fecha || !costo || !taller) {
      return res.status(400).json({
        success: false,
        message: 'Los campos tipo, fecha, costo y taller son requeridos'
      });
    }
    
    // ✅ NUEVO: Convertir formato de fecha
    const fechaConvertida = convertDateFormat(fecha);
    
    console.log('📝 Creando servicio para usuario:', userId);
    console.log('📅 Fecha original:', fecha);
    console.log('📅 Fecha convertida:', fechaConvertida);
    console.log('📸 ¿Tiene imagen?', !!imagenUrl);
    
    const [result] = await Service.createService(
      tipo, fechaConvertida, costo, taller, descripcion, imagenUrl, userId
    );
    
    // Obtener el servicio creado
    const [newService] = await Service.getServiceById(result.insertId, userId);
    
    res.status(201).json({
      success: true,
      data: newService[0],
      message: 'Servicio creado exitosamente'
    });
  } catch (error) {
    console.error('Error al crear servicio:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// ✅ ACTUALIZADO: Actualizar servicio con conversión de fecha
export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { tipo, fecha, costo, taller, descripcion, imagenUrl } = req.body;
    const userId = req.user.id;
    
    // Verificar que el servicio existe y pertenece al usuario
    const [existingService] = await Service.getServiceById(id, userId);
    if (!existingService.length) {
      return res.status(404).json({
        success: false,
        message: 'Servicio no encontrado'
      });
    }
    
    // ✅ NUEVO: Convertir formato de fecha
    const fechaConvertida = convertDateFormat(fecha);
    
    console.log('📝 Actualizando servicio:', id);
    console.log('📅 Fecha original:', fecha);
    console.log('📅 Fecha convertida:', fechaConvertida);
    
    await Service.updateService(id, tipo, fechaConvertida, costo, taller, descripcion, imagenUrl, userId);
    
    // Obtener el servicio actualizado
    const [updatedService] = await Service.getServiceById(id, userId);
    
    res.json({
      success: true,
      data: updatedService[0],
      message: 'Servicio actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error al actualizar servicio:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Verificar que el servicio existe y pertenece al usuario
    const [existingService] = await Service.getServiceById(id, userId);
    if (!existingService.length) {
      return res.status(404).json({
        success: false,
        message: 'Servicio no encontrado'
      });
    }
    
    await Service.deleteService(id, userId);
    
    res.json({
      success: true,
      message: 'Servicio eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar servicio:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const syncServices = async (req, res) => {
  try {
    const userId = req.user.id;
    const { lastSync } = req.query;
    
    let services;
    if (lastSync) {
      [services] = await Service.getServicesModifiedAfter(userId, new Date(parseInt(lastSync)));
    } else {
      [services] = await Service.getServicesByUser(userId);
    }
    
    res.json({
      success: true,
      data: services,
      syncTimestamp: Date.now(),
      message: `${services.length} servicios sincronizados`
    });
  } catch (error) {
    console.error('Error en sincronización:', error);
    res.status(500).json({
      success: false,
      message: 'Error en sincronización'
    });
  }
};

// ✅ ACTUALIZADO: Sincronización masiva con conversión de fecha
export const syncServicesBatch = async (req, res) => {
  try {
    const userId = req.user.id;
    const { services } = req.body;

    if (!Array.isArray(services) || services.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere un array de servicios válido'
      });
    }

    console.log(`📦 Sincronización masiva: ${services.length} servicios para usuario ${userId}`);

    const results = {
      created: [],
      errors: []
    };

    for (const serviceData of services) {
      try {
        const { tipo, fecha, costo, taller, descripcion, imagenUrl, clientId } = serviceData;

        if (!tipo || !fecha || !costo || !taller) {
          results.errors.push({
            clientId: clientId || 'unknown',
            error: 'Campos requeridos faltantes'
          });
          continue;
        }

        // ✅ NUEVO: Convertir formato de fecha
        const fechaConvertida = convertDateFormat(fecha);

        const [result] = await Service.createService(
          tipo, fechaConvertida, costo, taller, descripcion, imagenUrl, userId
        );

        const [newService] = await Service.getServiceById(result.insertId, userId);

        results.created.push({
          clientId: clientId || 'unknown',
          serverId: result.insertId,
          service: newService[0]
        });

        console.log(`✅ Servicio sincronizado: ${tipo} (Cliente: ${clientId}, Servidor: ${result.insertId})`);

      } catch (error) {
        console.error(`❌ Error sincronizando servicio:`, error);
        results.errors.push({
          clientId: serviceData.clientId || 'unknown',
          error: error.message
        });
      }
    }

    res.json({
      success: true,
      data: results,
      message: `Sincronización completada: ${results.created.length} creados, ${results.errors.length} errores`,
      summary: {
        totalReceived: services.length,
        created: results.created.length,
        errors: results.errors.length
      }
    });

  } catch (error) {
    console.error('❌ Error en sincronización masiva:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor en sincronización'
    });
  }
};

export const getSyncStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { lastSync } = req.query;

    let modifiedServices = [];
    let totalServices = 0;

    const [allServices] = await Service.getServicesByUser(userId);
    totalServices = allServices.length;

    if (lastSync) {
      const lastSyncDate = new Date(parseInt(lastSync));
      [modifiedServices] = await Service.getServicesModifiedAfter(userId, lastSyncDate);
    }

    res.json({
      success: true,
      data: {
        totalServices,
        modifiedCount: modifiedServices.length,
        modifiedServices: modifiedServices,
        serverTimestamp: Date.now()
      },
      message: `Estado de sincronización para usuario ${userId}`
    });

  } catch (error) {
    console.error('❌ Error obteniendo estado de sincronización:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo estado de sincronización'
    });
  }
};

export const confirmSync = async (req, res) => {
  try {
    const userId = req.user.id;
    const { syncedIds } = req.body;

    console.log(`✅ Confirmación de sincronización de ${syncedIds?.length || 0} servicios`);

    res.json({
      success: true,
      message: 'Sincronización confirmada',
      timestamp: Date.now()
    });

  } catch (error) {
    console.error('❌ Error confirmando sincronización:', error);
    res.status(500).json({
      success: false,
      message: 'Error confirmando sincronización'
    });
  }
};