import { useState, useEffect } from 'react';
import PriceChart from '../components/PriceChart';
import DataTable from '../components/DataTable';
import { fetchProducts, fetchPriceHistory, fetchStockHistory } from '../services/productService';
import { ProductData, ChartData } from '../types';
import { Calendar, LineChart, TrendingUp, TrendingDown } from 'lucide-react';

const PriceHistory = () => {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [priceHistory, setPriceHistory] = useState<ChartData[]>([]);
  const [stockHistory, setStockHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [productName, setProductName] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      const data = await fetchProducts();
      setProducts(data);
      
      if (data.length > 0 && !selectedProduct) {
        setSelectedProduct(data[0].id);
        setProductName(data[0].nombre);
      }
      
      setIsLoading(false);
    };

    loadProducts();
  }, []);

  useEffect(() => {
    const loadHistoryData = async () => {
      if (!selectedProduct) return;
      
      setIsLoading(true);
      
      // Get product name
      const product = products.find(p => p.id === selectedProduct);
      if (product) {
        setProductName(product.nombre);
      }
      
      // Load price history
      const priceData = await fetchPriceHistory(selectedProduct);
      setPriceHistory(priceData);
      
      // Load stock history
      const stockData = await fetchStockHistory(selectedProduct);
      setStockHistory(stockData);
      
      setIsLoading(false);
    };

    loadHistoryData();
  }, [selectedProduct]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
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

  const getPriceChange = () => {
    if (priceHistory.length < 2) return { value: 0, percentage: 0, isUp: false };
    
    const firstPrice = priceHistory[0].precio;
    const lastPrice = priceHistory[priceHistory.length - 1].precio;
    const change = lastPrice - firstPrice;
    const percentage = (change / firstPrice) * 100;
    
    return {
      value: Math.abs(change),
      percentage: Math.abs(percentage),
      isUp: change >= 0
    };
  };

  const priceChange = getPriceChange();

  const priceHistoryColumns = [
    {
      header: 'Fecha',
      accessor: 'fecha',
      cell: (value: string) => formatDate(value)
    },
    {
      header: 'Precio',
      accessor: 'precio',
      cell: (value: number) => formatCurrency(value)
    },
    {
      header: 'Marketplace',
      accessor: 'marketplace'
    }
  ];

  const stockHistoryColumns = [
    {
      header: 'Fecha',
      accessor: 'fecha',
      cell: (value: string) => formatDate(value)
    },
    {
      header: 'Stock Disponible',
      accessor: 'stock',
      cell: (value: number) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          value > 10 ? 'bg-green-100 text-green-800' : 
          value > 0 ? 'bg-yellow-100 text-yellow-800' : 
          'bg-red-100 text-red-800'
        }`}>
          {value > 0 ? value : 'Sin stock'}
        </span>
      )
    }
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Historial de Precios</h1>
      
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <label htmlFor="product-select" className="block text-sm font-medium text-gray-700 mb-2">
          Seleccionar Producto:
        </label>
        <select
          id="product-select"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          value={selectedProduct || ''}
          onChange={(e) => setSelectedProduct(Number(e.target.value))}
        >
          <option value="">Seleccionar producto...</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.nombre} - {product.marketplace}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : selectedProduct ? (
        <>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">{productName}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-gray-500 text-sm font-medium">Variación de Precio</h3>
                    <p className="text-2xl font-bold mt-1">{formatCurrency(priceChange.value)}</p>
                  </div>
                  <div className={`p-2 rounded-md ${priceChange.isUp ? 'bg-red-100' : 'bg-green-100'}`}>
                    {priceChange.isUp ? (
                      <TrendingUp className={`h-6 w-6 ${priceChange.isUp ? 'text-red-500' : 'text-green-500'}`} />
                    ) : (
                      <TrendingDown className={`h-6 w-6 ${priceChange.isUp ? 'text-red-500' : 'text-green-500'}`} />
                    )}
                  </div>
                </div>
                <div className="flex items-center mt-4">
                  <span className={`text-sm ${priceChange.isUp ? 'text-red-500' : 'text-green-500'}`}>
                    {priceChange.isUp ? '+' : '-'}{priceChange.percentage.toFixed(2)}%
                  </span>
                  <span className="text-gray-500 text-sm ml-1">desde el primer registro</span>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-gray-500 text-sm font-medium">Datos Históricos</h3>
                    <p className="text-2xl font-bold mt-1">{priceHistory.length}</p>
                  </div>
                  <div className="bg-blue-100 p-2 rounded-md">
                    <Calendar className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
                <div className="flex items-center mt-4">
                  <span className="text-sm text-gray-500">
                    Registros de precios en la base de datos
                  </span>
                </div>
              </div>
            </div>
            
            <PriceChart 
              data={priceHistory} 
              multiSeries={true} 
              title="Historial de Precios"
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <DataTable
                columns={priceHistoryColumns}
                data={priceHistory}
                title="Historial de Precios"
              />
            </div>
            
            <div>
              <DataTable
                columns={stockHistoryColumns}
                data={stockHistory}
                title="Historial de Stock"
              />
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <LineChart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay producto seleccionado</h3>
          <p className="text-gray-500">
            Selecciona un producto para ver su historial de precios y stock.
          </p>
        </div>
      )}
    </div>
  );
};

export default PriceHistory;
