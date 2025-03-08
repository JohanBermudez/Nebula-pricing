import { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import { 
  fetchAlerts, 
  fetchAlertNotifications, 
  updateAlertStatus,
  markNotificationAsRead
} from '../services/alertService';
import { AlertData } from '../types';
import { 
  AlertTriangle, 
  BarChart2, 
  Bell, 
  CheckCircle, 
  Clock,
  XCircle
} from 'lucide-react';

const Alerts = () => {
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'alerts' | 'notifications'>('alerts');

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      const alertsData = await fetchAlerts();
      setAlerts(alertsData);
      
      const notificationsData = await fetchAlertNotifications();
      setNotifications(notificationsData);
      
      setIsLoading(false);
    };

    loadData();
  }, []);

  const handleToggleAlertStatus = async (alertId: number, currentStatus: boolean) => {
    const success = await updateAlertStatus(alertId, !currentStatus);
    
    if (success) {
      setAlerts(alerts.map(alert => 
        alert.id === alertId 
          ? { ...alert, activa: !currentStatus } 
          : alert
      ));
    }
  };

  const handleMarkAsRead = async (notificationId: number) => {
    const success = await markNotificationAsRead(notificationId);
    
    if (success) {
      setNotifications(notifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, leida: true } 
          : notification
      ));
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Nunca';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-CO', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const alertColumns = [
    {
      header: 'Producto',
      accessor: 'producto'
    },
    {
      header: 'Tipo',
      accessor: 'tipo',
      cell: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          value === 'precio' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
        }`}>
          {value === 'precio' ? 'Precio' : 'Stock'}
        </span>
      )
    },
    {
      header: 'Condición',
      accessor: 'condicion',
      cell: (value: string, row: AlertData) => (
        <div className="flex items-center">
          {(() => {
            switch (value) {
              case 'menor_que':
                return <span>Menor que ${row.valor.toLocaleString()}</span>;
              case 'mayor_que':
                return <span>Mayor que ${row.valor.toLocaleString()}</span>;
              case 'igual_a':
                return <span>Igual a ${row.valor.toLocaleString()}</span>;
              case 'porcentaje_diferencia':
                return <span>±{row.valor}% de diferencia</span>;
              default:
                return <span>{value}</span>;
            }
          })()}
        </div>
      )
    },
    {
      header: 'Última Notificación',
      accessor: 'ultimaNotificacion',
      cell: (value: string | null) => formatDate(value)
    },
    {
      header: 'Estado',
      accessor: 'activa',
      cell: (value: boolean, row: AlertData) => (
        <div className="flex items-center">
          <button
            onClick={() => handleToggleAlertStatus(row.id, value)}
            className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none ${
              value ? 'bg-indigo-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                value ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
          <span className="ml-2 text-sm text-gray-500">
            {value ? 'Activa' : 'Inactiva'}
          </span>
        </div>
      )
    }
  ];

  const notificationColumns = [
    {
      header: 'Producto',
      accessor: 'producto'
    },
    {
      header: 'Tipo',
      accessor: 'tipo',
      cell: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          value === 'precio' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
        }`}>
          {value === 'precio' ? 'Precio' : 'Stock'}
        </span>
      )
    },
    {
      header: 'Mensaje',
      accessor: 'mensaje'
    },
    {
      header: 'Fecha',
      accessor: 'fecha',
      cell: (value: string) => formatDate(value)
    },
    {
      header: 'Estado',
      accessor: 'leida',
      cell: (value: boolean, row: any) => (
        <div className="flex items-center">
          {value ? (
            <span className="flex items-center text-green-600">
              <CheckCircle className="h-4 w-4 mr-1" />
              Leída
            </span>
          ) : (
            <button
              onClick={() => handleMarkAsRead(row.id)}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <Clock className="h-4 w-4 mr-1" />
              Marcar como leída
            </button>
          )}
        </div>
      )
    }
  ];

  const notificationCount = notifications.filter(n => !n.leida).length;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Alertas y Notificaciones</h1>
      
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('alerts')}
              className={`${
                activeTab === 'alerts'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm mr-8`}
            >
              <AlertTriangle className="inline-block h-5 w-5 mr-2" />
              Alertas Configuradas
            </button>
            
            <button
              onClick={() => setActiveTab('notifications')}
              className={`${
                activeTab === 'notifications'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <Bell className="inline-block h-5 w-5 mr-2" />
              Notificaciones
              {notificationCount > 0 && (
                <span className="ml-2 bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  {notificationCount}
                </span>
              )}
            </button>
          </nav>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : activeTab === 'alerts' ? (
        alerts.length > 0 ? (
          <DataTable 
            columns={alertColumns} 
            data={alerts} 
            title="Alertas Configuradas"
          />
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-sm text-center">
            <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay alertas configuradas</h3>
            <p className="text-gray-500">
              Configura alertas para recibir notificaciones sobre cambios de precios o stock.
            </p>
          </div>
        )
      ) : (
        notifications.length > 0 ? (
          <DataTable 
            columns={notificationColumns} 
            data={notifications} 
            title="Notificaciones Recientes"
          />
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-sm text-center">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay notificaciones</h3>
            <p className="text-gray-500">
              Las notificaciones aparecerán aquí cuando tus alertas se activen.
            </p>
          </div>
        )
      )}
    </div>
  );
};

export default Alerts;
