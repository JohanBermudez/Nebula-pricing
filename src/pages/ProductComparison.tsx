import { useState, useEffect } from 'react';
import FilterPanel from '../components/FilterPanel';
import DataTable from '../components/DataTable';
import ComparisonTable from '../components/ComparisonTable';
import SavedReportsDrawer from '../components/SavedReportsDrawer';
import { fetchUniqueProducts, fetchComparisonProducts } from '../services/productService';
import { createComparisonReport, fetchReportWithProducts, updateReportName, deleteReport } from '../services/reportService';
import { ProductFilterOptions, ProductBase, ComparisonProduct } from '../types';
import { ShoppingBag, Download, Copy, List, FileClock, Clock } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const ProductComparison = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [products, setProducts] = useState<ProductBase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<ProductFilterOptions>({});
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'comparison'>('list');
  const [comparisonProducts, setComparisonProducts] = useState<ComparisonProduct[]>([]);
  const [marketplaces, setMarketplaces] = useState<string[]>(['Olímpica', 'Mercado Libre', 'Éxito', 'Falabella', 'Alkosto', 'Jumbo']);
  const [comparisonLoading, setComparisonLoading] = useState(false);
  const [isReportsDrawerOpen, setIsReportsDrawerOpen] = useState(false);
  const [currentReportId, setCurrentReportId] = useState<string | null>(null);
  const [currentReportName, setCurrentReportName] = useState<string>('');

  // Verificar si hay un reportId en la URL
  useEffect(() => {
    const reportId = searchParams.get('reportId');
    if (reportId) {
      loadReportById(reportId);
    }
  }, [searchParams]);

  const loadReportById = async (reportId: string) => {
    setIsLoading(true);
    try {
      const report = await fetchReportWithProducts(reportId);
      if (report && report.products) {
        setComparisonProducts(report.products);
        setViewMode('comparison');
        setCurrentReportId(report.id);
        setCurrentReportName(report.nombre);
      }
    } catch (error) {
      console.error('Error loading report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadProducts = async () => {
      if (viewMode === 'comparison' && currentReportId) return;
      
      setIsLoading(true);
      const data = await fetchUniqueProducts(filters);
      setProducts(data);
      setIsLoading(false);
    };

    loadProducts();
  }, [filters, viewMode, currentReportId]);

  const handleFilterChange = (newFilters: ProductFilterOptions) => {
    setFilters(newFilters);
    // Al cambiar los filtros, volvemos a la vista de lista y limpiamos el reporte actual
    setViewMode('list');
    setSelectedProductIds([]);
    setCurrentReportId(null);
    setCurrentReportName('');
    navigate('/productos');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const handleExportCSV = () => {
    if (products.length === 0) return;

    const headers = [
      'ID',
      'Nombre',
      'Marca',
      'Modelo',
      'SKU',
      'Categoría',
      'Características'
    ];

    const csvData = products.map(product => [
      product.id,
      product.nombre,
      product.marca || '',
      product.modelo || '',
      product.sku || '',
      product.categoria || '',
      product.caracteristicas.map(c => `${c.nombre}: ${c.valor}`).join('; ')
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'productos_unicos.csv');
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleProductSelection = (productId: number) => {
    setSelectedProductIds(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleStartComparison = async () => {
    if (selectedProductIds.length === 0) return;
    
    setComparisonLoading(true);
    try {
      console.log('Iniciando comparación de productos IDs:', selectedProductIds);
      const data = await fetchComparisonProducts(selectedProductIds);
      console.log('Datos de comparación recibidos:', data);
      setComparisonProducts(data);
      setViewMode('comparison');
      setCurrentReportId(null);
      setCurrentReportName('');
      navigate('/productos');
    } catch (error) {
      console.error('Error fetching comparison data:', error);
    } finally {
      setComparisonLoading(false);
    }
  };

  const handleSaveReport = async (name: string) => {
    try {
      console.log('ProductComparison - Guardando informe:', name);
      console.log('currentReportId:', currentReportId);
      console.log('selectedProductIds:', selectedProductIds);
      
      if (currentReportId) {
        // Actualizar el nombre del informe existente
        console.log('Actualizando nombre del informe:', currentReportId, name);
        const success = await updateReportName(currentReportId, name);
        if (success) {
          console.log('Nombre actualizado con éxito');
          setCurrentReportName(name);
        } else {
          console.error('Error al actualizar el nombre del informe');
        }
      } else {
        // Crear un nuevo informe
        // En vista de comparación, usar los IDs de productos en el estado selectedProductIds
        const productIdsToSave = viewMode === 'comparison' 
          ? comparisonProducts.map(p => p.id)
          : selectedProductIds;
        
        console.log('Creando nuevo informe con productos:', productIdsToSave);
        
        const reportId = await createComparisonReport(name, productIdsToSave);
        
        if (reportId) {
          console.log('Informe creado con ID:', reportId);
          setCurrentReportId(reportId);
          setCurrentReportName(name);
          navigate(`/productos?reportId=${reportId}`);
        } else {
          console.error('Error al crear el informe, no se recibió ID');
        }
      }
    } catch (error) {
      console.error('Error guardando informe:', error);
    }
  };

  const handleDeleteReport = async () => {
    if (!currentReportId) return;
    
    if (window.confirm('¿Estás seguro de eliminar este informe?')) {
      const success = await deleteReport(currentReportId);
      if (success) {
        setViewMode('list');
        setCurrentReportId(null);
        setCurrentReportName('');
        navigate('/productos');
      }
    }
  };

  const handleSelectReport = (reportId: string) => {
    navigate(`/productos?reportId=${reportId}`);
    setIsReportsDrawerOpen(false);
  };

  // Columnas para la tabla de productos únicos
  const productColumns = [
    {
      header: 'Producto',
      accessor: 'nombre',
      cell: (value: string, row: ProductBase) => (
        <div className="flex items-center">
          {row.imagen ? (
            <img 
              src={row.imagen} 
              alt={value} 
              className="w-10 h-10 object-cover rounded mr-3"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-200 rounded mr-3 flex items-center justify-center">
              <ShoppingBag className="h-6 w-6 text-gray-400" />
            </div>
          )}
          <div>
            <div className="font-medium text-gray-900">{value}</div>
            <div className="text-gray-500 text-xs">
              {row.marca} {row.modelo && `- ${row.modelo}`}
            </div>
          </div>
        </div>
      )
    },
    {
      header: 'Precio más bajo',
      accessor: 'variantes',
      cell: (variantes: any) => {
        if (!variantes || variantes.length === 0) return 'No disponible';
        
        // Encontrar el precio más bajo entre todas las variantes
        const precioMasBajo = Math.min(...variantes.map((v: any) => v.precio));
        
        return (
          <div className="font-medium">
            {formatCurrency(precioMasBajo)}
          </div>
        );
      }
    },
    {
      header: 'Categoría',
      accessor: 'categoria'
    },
    {
      header: 'Marketplaces disponibles',
      accessor: 'variantes',
      cell: (variantes: any) => {
        if (!variantes || variantes.length === 0) return 'Ninguno';
        
        const marketplaces = [...new Set(variantes.map((v: any) => v.marketplace))];
        
        return (
          <div className="flex flex-wrap gap-1">
            {marketplaces.map((mp: string, idx: number) => (
              <span 
                key={idx}
                className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800"
              >
                {mp}
              </span>
            ))}
          </div>
        );
      }
    },
    {
      header: 'Características',
      accessor: 'caracteristicas',
      cell: (caracteristicas: any) => {
        if (!caracteristicas || caracteristicas.length === 0) return 'No disponible';
        
        // Mostrar solo las primeras 2 características para no sobrecargar la UI
        const caracteristicasMostradas = caracteristicas.slice(0, 2);
        
        return (
          <div className="text-sm">
            {caracteristicasMostradas.map((c: any, idx: number) => (
              <div key={idx}>
                <span className="font-medium">{c.nombre}:</span> {c.valor}
              </div>
            ))}
            {caracteristicas.length > 2 && (
              <span className="text-xs text-gray-500">+ {caracteristicas.length - 2} más</span>
            )}
          </div>
        );
      }
    },
    {
      header: 'Comparar',
      accessor: 'id',
      cell: (value: number) => (
        <button
          onClick={() => toggleProductSelection(value)}
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            selectedProductIds.includes(value)
              ? 'bg-indigo-100 text-indigo-800'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          {selectedProductIds.includes(value) ? 'Seleccionado' : 'Seleccionar'}
        </button>
      )
    }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Comparación de Productos</h1>
        <div className="flex space-x-3">
          <button
            onClick={() => setIsReportsDrawerOpen(true)}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FileClock className="h-4 w-4 mr-2" />
            Mis informes
          </button>
          
          {viewMode === 'list' && (
            <>
              <button
                onClick={handleExportCSV}
                className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                disabled={products.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar a CSV
              </button>
              
              <button
                onClick={handleStartComparison}
                className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                disabled={selectedProductIds.length === 0}
              >
                <Copy className="h-4 w-4 mr-2" />
                Comparar Seleccionados ({selectedProductIds.length})
              </button>
            </>
          )}
          
          {viewMode === 'comparison' && (
            <button
              onClick={() => {
                setViewMode('list');
                setCurrentReportId(null);
                setCurrentReportName('');
                navigate('/productos');
              }}
              className="flex items-center bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <List className="h-4 w-4 mr-2" />
              Volver a la Lista
            </button>
          )}
        </div>
      </div>

      <FilterPanel onFilterChange={handleFilterChange} initialFilters={filters} />

      {/* Selección de marketplaces para comparar (solo en vista de comparación) */}
      {viewMode === 'comparison' && (
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <h3 className="font-medium mb-3">Marketplaces a comparar</h3>
          <div className="flex flex-wrap gap-2">
            {['Olímpica', 'Mercado Libre', 'Éxito', 'Falabella', 'Alkosto', 'Jumbo'].map((mp) => (
              <label key={mp} className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-indigo-600"
                  checked={marketplaces.includes(mp)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setMarketplaces([...marketplaces, mp]);
                    } else {
                      setMarketplaces(marketplaces.filter(m => m !== mp));
                    }
                  }}
                  disabled={mp === 'Olímpica'} // No permitir desmarcar Olimpica
                />
                <span className="ml-2 text-sm text-gray-700">{mp}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {isLoading || comparisonLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : viewMode === 'list' ? (
        <>
          {selectedProductIds.length > 0 && (
            <div className="bg-indigo-50 p-4 rounded-lg mb-6 flex justify-between items-center">
              <div>
                <span className="font-medium">{selectedProductIds.length} productos seleccionados para comparar</span>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setSelectedProductIds([])}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Limpiar selección
                </button>
                <button
                  onClick={handleStartComparison}
                  className="flex items-center bg-indigo-600 text-white px-3 py-1 rounded-md hover:bg-indigo-700 transition-colors text-sm"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Comparar
                </button>
              </div>
            </div>
          )}
          <DataTable 
            columns={productColumns} 
            data={products} 
            title={`Productos (${products.length})`}
          />
        </>
      ) : (
        <ComparisonTable 
          products={comparisonProducts} 
          marketplaces={marketplaces}
          reportId={currentReportId || undefined}
          reportName={currentReportName}
          onDeleteReport={currentReportId ? handleDeleteReport : undefined}
          onSaveReport={handleSaveReport}
        />
      )}

      {/* Drawer para informes guardados */}
      <SavedReportsDrawer
        isOpen={isReportsDrawerOpen}
        onClose={() => setIsReportsDrawerOpen(false)}
        onSelectReport={handleSelectReport}
      />
    </div>
  );
};

export default ProductComparison;
