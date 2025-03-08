import React, { useState } from 'react';
import { ShoppingBag, Save, Edit, Trash } from 'lucide-react';
import { ComparisonProduct } from '../types';
import SaveReportModal from './SaveReportModal';

interface ComparisonTableProps {
  products: ComparisonProduct[];
  marketplaces: string[];
  reportId?: string;
  reportName?: string;
  onDeleteReport?: () => void;
  onSaveReport?: (name: string) => void;
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({ 
  products, 
  marketplaces, 
  reportId,
  reportName,
  onDeleteReport,
  onSaveReport 
}) => {
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  // Función para formatear el precio
  const formatCurrency = (value: number | null) => {
    if (value === null) return 'No disponible';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Características comunes para mostrar
  const commonCharacteristics = [
    'Tamaño de pantalla', 'Resolución', 'Procesador', 'Memoria RAM', 
    'Almacenamiento', 'Capacidad', 'Material del vaso', 'Potencia',
    'Piezas incluidas', 'Material', 'Peso neto', 'Tipo de arroz',
    'Contenido', 'Tipo de leche', 'Tipo de bebida', 'Tipo', 'Añejamiento',
    'Dispensador', 'Color', 'Cámaras', 'Sistema operativo', 'HDMI', 'Smart TV'
  ];

  if (products.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-sm text-center">
        <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay productos seleccionados para comparar</h3>
        <p className="text-gray-500">
          Selecciona al menos un producto para iniciar la comparación.
        </p>
      </div>
    );
  }

  const handleSaveModalOpen = () => {
    console.log('Abriendo modal para guardar informe');
    setIsSaveModalOpen(true);
  };

  const handleSaveReport = (name: string) => {
    console.log('ComparisonTable - Guardando informe con nombre:', name);
    if (onSaveReport) {
      onSaveReport(name);
    }
    setIsSaveModalOpen(false);
  };

  return (
    <div>
      {/* Botones para guardar/editar/eliminar informe */}
      <div className="flex justify-between items-center mb-4">
        <div>
          {reportId ? (
            <h2 className="text-xl font-semibold">
              Informe: {reportName}
            </h2>
          ) : (
            <h2 className="text-xl font-semibold">
              Comparación de productos
            </h2>
          )}
        </div>
        <div className="flex gap-2">
          {reportId ? (
            <>
              <button
                onClick={handleSaveModalOpen}
                className="flex items-center text-blue-600 px-3 py-1 rounded-md border border-blue-600 hover:bg-blue-50"
              >
                <Edit className="h-4 w-4 mr-1" />
                Renombrar
              </button>
              {onDeleteReport && (
                <button
                  onClick={onDeleteReport}
                  className="flex items-center text-red-600 px-3 py-1 rounded-md border border-red-600 hover:bg-red-50"
                >
                  <Trash className="h-4 w-4 mr-1" />
                  Eliminar
                </button>
              )}
            </>
          ) : (
            <button
              onClick={handleSaveModalOpen}
              className="flex items-center bg-indigo-600 text-white px-3 py-1 rounded-md hover:bg-indigo-700"
            >
              <Save className="h-4 w-4 mr-1" />
              Guardar informe
            </button>
          )}
        </div>
      </div>

      {/* Tabla de comparación */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse bg-white rounded-lg shadow-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-r">
                Detalles del producto
              </th>
              {marketplaces.map((marketplace, index) => (
                <th 
                  key={index} 
                  className={`py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b ${
                    marketplace === 'Olímpica' ? 'bg-indigo-50' : ''
                  }`}
                >
                  {marketplace}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((product, productIndex) => (
              <React.Fragment key={productIndex}>
                {/* Fila del nombre del producto */}
                <tr className="bg-gray-100">
                  <td colSpan={marketplaces.length + 1} className="py-3 px-6 text-left font-medium border-b">
                    {product.nombre} {product.marca && `- ${product.marca}`}
                  </td>
                </tr>

                {/* Fila de imagen */}
                <tr>
                  <td className="py-3 px-6 text-left text-sm text-gray-700 border-b border-r font-medium">
                    Imagen
                  </td>
                  {marketplaces.map((marketplace, marketplaceIndex) => {
                    const variant = product.variantes.find(v => v.marketplace === marketplace);
                    return (
                      <td key={marketplaceIndex} className={`py-3 px-6 text-left text-sm border-b ${
                        marketplace === 'Olímpica' ? 'bg-indigo-50' : ''
                      }`}>
                        {variant?.imagen ? (
                          <img 
                            src={variant.imagen} 
                            alt={product.nombre} 
                            className="w-20 h-20 object-cover rounded"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-gray-200 flex items-center justify-center rounded">
                            <ShoppingBag className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>

                {/* Fila de precio */}
                <tr>
                  <td className="py-3 px-6 text-left text-sm text-gray-700 border-b border-r font-medium">
                    Precio
                  </td>
                  {marketplaces.map((marketplace, marketplaceIndex) => {
                    const variant = product.variantes.find(v => v.marketplace === marketplace);
                    return (
                      <td key={marketplaceIndex} className={`py-3 px-6 text-left text-sm border-b ${
                        marketplace === 'Olímpica' ? 'bg-indigo-50' : ''
                      }`}>
                        <div>
                          <div className="font-medium">{variant ? formatCurrency(variant.precio) : 'No disponible'}</div>
                          {variant?.precioAnterior && (
                            <div className="text-xs text-gray-500 line-through">
                              {formatCurrency(variant.precioAnterior)}
                            </div>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>

                {/* Fila de descuento */}
                <tr>
                  <td className="py-3 px-6 text-left text-sm text-gray-700 border-b border-r font-medium">
                    Descuento
                  </td>
                  {marketplaces.map((marketplace, marketplaceIndex) => {
                    const variant = product.variantes.find(v => v.marketplace === marketplace);
                    const discount = variant?.precio && variant?.precioAnterior 
                      ? Math.round(((variant.precioAnterior - variant.precio) / variant.precioAnterior) * 100) 
                      : null;
                    
                    return (
                      <td key={marketplaceIndex} className={`py-3 px-6 text-left text-sm border-b ${
                        marketplace === 'Olímpica' ? 'bg-indigo-50' : ''
                      }`}>
                        {discount ? (
                          <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                            {discount}%
                          </span>
                        ) : 'Sin descuento'}
                      </td>
                    );
                  })}
                </tr>

                {/* Fila de stock */}
                <tr>
                  <td className="py-3 px-6 text-left text-sm text-gray-700 border-b border-r font-medium">
                    Stock
                  </td>
                  {marketplaces.map((marketplace, marketplaceIndex) => {
                    const variant = product.variantes.find(v => v.marketplace === marketplace);
                    return (
                      <td key={marketplaceIndex} className={`py-3 px-6 text-left text-sm border-b ${
                        marketplace === 'Olímpica' ? 'bg-indigo-50' : ''
                      }`}>
                        {variant ? (
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            variant.stock > 10 ? 'bg-green-100 text-green-800' : 
                            variant.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'
                          }`}>
                            {variant.stock > 0 ? variant.stock : 'Sin stock'}
                          </span>
                        ) : 'No disponible'}
                      </td>
                    );
                  })}
                </tr>

                {/* Fila de seller */}
                <tr>
                  <td className="py-3 px-6 text-left text-sm text-gray-700 border-b border-r font-medium">
                    Seller
                  </td>
                  {marketplaces.map((marketplace, marketplaceIndex) => {
                    const variant = product.variantes.find(v => v.marketplace === marketplace);
                    return (
                      <td key={marketplaceIndex} className={`py-3 px-6 text-left text-sm border-b ${
                        marketplace === 'Olímpica' ? 'bg-indigo-50' : ''
                      }`}>
                        {variant?.seller || 'No disponible'}
                      </td>
                    );
                  })}
                </tr>

                {/* Filas de características */}
                {product.caracteristicas && commonCharacteristics.map((characteristic) => {
                  const hasCharacteristic = product.caracteristicas.some(c => c.nombre === characteristic);
                  
                  if (!hasCharacteristic) return null;
                  
                  return (
                    <tr key={characteristic}>
                      <td className="py-3 px-6 text-left text-sm text-gray-700 border-b border-r font-medium">
                        {characteristic}
                      </td>
                      {marketplaces.map((marketplace, marketplaceIndex) => {
                        const variant = product.variantes.find(v => v.marketplace === marketplace);
                        const value = variant 
                          ? product.caracteristicas.find(c => c.nombre === characteristic)?.valor
                          : null;
                        
                        return (
                          <td key={marketplaceIndex} className={`py-3 px-6 text-left text-sm border-b ${
                            marketplace === 'Olímpica' ? 'bg-indigo-50' : ''
                          }`}>
                            {value || 'No disponible'}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}

                {/* Fila de URL */}
                <tr>
                  <td className="py-3 px-6 text-left text-sm text-gray-700 border-b border-r font-medium">
                    URL
                  </td>
                  {marketplaces.map((marketplace, marketplaceIndex) => {
                    const variant = product.variantes.find(v => v.marketplace === marketplace);
                    return (
                      <td key={marketplaceIndex} className={`py-3 px-6 text-left text-sm border-b ${
                        marketplace === 'Olímpica' ? 'bg-indigo-50' : ''
                      }`}>
                        {variant?.url ? (
                          <a 
                            href={variant.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-indigo-600 hover:text-indigo-800"
                          >
                            Ver producto
                          </a>
                        ) : 'No disponible'}
                      </td>
                    );
                  })}
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para guardar/editar informe */}
      <SaveReportModal 
        isOpen={isSaveModalOpen} 
        onClose={() => setIsSaveModalOpen(false)}
        onSave={handleSaveReport}
        initialName={reportName}
        isEdit={!!reportId}
      />
    </div>
  );
};

export default ComparisonTable;
