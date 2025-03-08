import React, { useState, useEffect } from 'react';
import { ChevronRight, FileClock, Clock, X, Search } from 'lucide-react';
import { ComparisonReport } from '../types';
import { fetchUserReports } from '../services/reportService';

interface SavedReportsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectReport: (reportId: string) => void;
}

const SavedReportsDrawer: React.FC<SavedReportsDrawerProps> = ({
  isOpen,
  onClose,
  onSelectReport
}) => {
  const [reports, setReports] = useState<ComparisonReport[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadReports();
    }
  }, [isOpen]);

  const loadReports = async () => {
    setIsLoading(true);
    try {
      const userReports = await fetchUserReports();
      setReports(userReports);
    } catch (error) {
      console.error('Error loading user reports:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const filteredReports = reports.filter(report => 
    report.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`fixed inset-y-0 right-0 w-80 bg-white shadow-lg transform transition-transform duration-300 z-40 ${
      isOpen ? 'translate-x-0' : 'translate-x-full'
    }`}>
      <div className="flex flex-col h-full">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Informes guardados</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-3 border-b">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="pl-10 w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2"
              placeholder="Buscar informes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : filteredReports.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {filteredReports.map(report => (
                <li key={report.id} className="hover:bg-gray-50">
                  <button
                    onClick={() => onSelectReport(report.id)}
                    className="w-full text-left p-4 flex items-center justify-between"
                  >
                    <div className="flex items-start space-x-3">
                      <FileClock className="h-5 w-5 text-indigo-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{report.nombre}</p>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{formatDate(report.createdAt)}</span>
                        </div>
                        {report.productIds && (
                          <p className="text-xs text-gray-500 mt-1">
                            {report.productIds.length} productos
                          </p>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-4 text-center">
              <FileClock className="h-12 w-12 text-gray-300 mb-2" />
              <p className="text-gray-500 mb-1">No hay informes guardados</p>
              <p className="text-sm text-gray-400">
                Guarda tus comparaciones para acceder a ellas fácilmente
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedReportsDrawer;
