import { supabase } from '../lib/supabase';
import { AlertData } from '../types';

export const fetchAlerts = async (): Promise<AlertData[]> => {
  try {
    const { data, error } = await supabase
      .from('alertas')
      .select(`
        id_alerta,
        tipo_alerta,
        condicion,
        valor_referencia,
        activa,
        ultima_notificacion,
        productos(nombre_producto)
      `)
      .order('fecha_creacion', { ascending: false });

    if (error) {
      throw error;
    }

    return data.map(alert => ({
      id: alert.id_alerta,
      tipo: alert.tipo_alerta,
      producto: alert.productos?.nombre_producto || 'Unknown',
      condicion: alert.condicion,
      valor: alert.valor_referencia,
      activa: alert.activa,
      ultimaNotificacion: alert.ultima_notificacion
    }));
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return [];
  }
};

export const fetchAlertNotifications = async (): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('notificaciones_alertas')
      .select(`
        id_notificacion,
        mensaje,
        leida,
        fecha_notificacion,
        alertas(tipo_alerta, productos(nombre_producto))
      `)
      .order('fecha_notificacion', { ascending: false })
      .limit(10);

    if (error) {
      throw error;
    }

    return data.map(notification => ({
      id: notification.id_notificacion,
      mensaje: notification.mensaje,
      leida: notification.leida,
      fecha: notification.fecha_notificacion,
      tipo: notification.alertas?.tipo_alerta,
      producto: notification.alertas?.productos?.nombre_producto || 'Unknown'
    }));
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
};

export const updateAlertStatus = async (alertId: number, active: boolean): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('alertas')
      .update({ activa: active, fecha_actualizacion: new Date().toISOString() })
      .eq('id_alerta', alertId);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error updating alert status:', error);
    return false;
  }
};

export const markNotificationAsRead = async (notificationId: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('notificaciones_alertas')
      .update({ leida: true })
      .eq('id_notificacion', notificationId);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return false;
  }
};
