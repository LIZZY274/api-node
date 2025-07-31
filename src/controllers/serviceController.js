import * as Service from '../models/Service.js';
import * as FCMToken from '../models/FCMtoken.js';
import * as NotificationSettings from '../models/NotificationSettings.js';

const convertDateFormat = (dateString) => {
  if (!dateString) return null;
  
  if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return dateString;
  }
  
  if (dateString.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
  }
  
  console.log('Formato de fecha no reconocido:', dateString);
  return dateString;
};

const sendServiceNotification = async (userId, serviceType, action = 'created') => {
  try {
    const [settings] = await NotificationSettings.getNotificationSettings(userId);
    const [tokens] = await FCMToken.getFCMTokensByUserId(userId);

    if (tokens.length === 0) return;

    if (!settings.length || !settings[0].service_reminders) return;

    const title = action === 'created' ? 'Servicio Agregado' : 'Servicio Actualizado';
    const body = `El servicio '${serviceType}' se ha ${action === 'created' ? 'guardado' : 'actualizado'} exitosamente`;

    console.log(`Enviando notificación de servicio ${action}: ${serviceType} a ${tokens.length} dispositivos`);

  } catch (error) {
    console.error('Error enviando notificación de servicio:', error);
  }
};

const sendSyncNotification = async (userId, syncedCount, errorCount) => {
  try {
    const [settings] = await NotificationSettings.getNotificationSettings(userId);
    const [tokens] = await FCMToken.getFCMTokensByUserId(userId);

    if (tokens.length === 0) return;

    if (!settings.length || !settings[0].sync_notifications) return;

    const title = 'Sincronización Completada';
    const body = `${syncedCount} servicios sincronizados${errorCount > 0 ? `, ${errorCount} con errores` : ''}`;

    console.log(`Enviando notificación de sync: ${syncedCount} sincronizados, ${errorCount} errores`);

  } catch (error) {
    console.error('Error enviando notificación de sync:', error);
  }
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

export const createService = async (req, res) => {
  try {
    const { tipo, fecha, costo, taller, descripcion, imagenUrl } = req.body;
    const userId = req.user.id;
    
    if (!tipo || !fecha || !costo || !taller) {
      return res.status(400).json({
        success: false,
        message: 'Los campos tipo, fecha, costo y taller son requeridos'
      });
    }
    
    const fechaConvertida = convertDateFormat(fecha);
    
    console.log('Creando servicio para usuario:', userId);
    console.log('Fecha original:', fecha);
    console.log('Fecha convertida:', fechaConvertida);
    console.log('Tiene imagen?', !!imagenUrl);
    
    const [result] = await Service.createService(
      tipo, fechaConvertida, costo, taller, descripcion, imagenUrl, userId
    );
    
    const [newService] = await Service.getServiceById(result.insertId, userId);
    
    await sendServiceNotification(userId, tipo, 'created');
    
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

export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { tipo, fecha, costo, taller, descripcion, imagenUrl } = req.body;
    const userId = req.user.id;
    
    const [existingService] = await Service.getServiceById(id, userId);
    if (!existingService.length) {
      return res.status(404).json({
        success: false,
        message: 'Servicio no encontrado'
      });
    }
    
    const fechaConvertida = convertDateFormat(fecha);
    
    console.log('Actualizando servicio:', id);
    console.log('Fecha original:', fecha);
    console.log('Fecha convertida:', fechaConvertida);
    
    await Service.updateService(id, tipo, fechaConvertida, costo, taller, descripcion, imagenUrl, userId);
    
    const [updatedService] = await Service.getServiceById(id, userId);
    
    await sendServiceNotification(userId, tipo, 'updated');
    
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

    console.log(`Sincronización masiva: ${services.length} servicios para usuario ${userId}`);

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

        console.log(`Servicio sincronizado: ${tipo} (Cliente: ${clientId}, Servidor: ${result.insertId})`);

      } catch (error) {
        console.error(`Error sincronizando servicio:`, error);
        results.errors.push({
          clientId: serviceData.clientId || 'unknown',
          error: error.message
        });
      }
    }

    if (results.created.length > 0) {
      await sendSyncNotification(userId, results.created.length, results.errors.length);
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
    console.error('Error en sincronización masiva:', error);
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
    console.error('Error obteniendo estado de sincronización:', error);
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

    console.log(`Confirmación de sincronización de ${syncedIds?.length || 0} servicios`);

    res.json({
      success: true,
      message: 'Sincronización confirmada',
      timestamp: Date.now()
    });

  } catch (error) {
    console.error('Error confirmando sincronización:', error);
    res.status(500).json({
      success: false,
      message: 'Error confirmando sincronización'
    });
  }
};