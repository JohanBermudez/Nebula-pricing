import { useState, useEffect } from 'react';
import KpiCard from '../components/KpiCard';
import PriceChart from '../components/PriceChart';
import DataTable from '../components/DataTable';
import { BarChart2, ShoppingBag, Truck, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { ProductData, ChartData } from '../types';

const Dashboard = () => {
  const [recentProducts, setRecentProducts] = useState<ProductData[]>([]);
  const [priceHistoryData, setPriceHistoryData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [kpis, setKpis] = useState({
    totalProducts: 0,
    averagePrice: 0,
    totalSellers: 0,
    priceVariation: 0
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch KPIs
        const { data: productCount, error: productCountError } = await supabase
          .from('productos')
          .select('id_producto', { count: 'exact' })
          .eq('activo', true);
          
        if (productCountError) throw productCountError;

        const { data: avgPriceData, error: avgPriceError } = await supabase
          .from('productos')
          .select('precio')
          .eq('activo', true);
          
        if (avgPriceError) throw avgPriceError;
        
        const avgPrice = avgPriceData.reduce((sum, item) => sum + item.precio, 0) / (avgPriceData.length || 1);

        const { data: sellerCount, error: sellerCountError } = await supabase
          .from('sellers')
          .select('id_seller', { count: 'exact' })
          .eq('activo', true);
          
        if (sellerCountError) throw sellerCountError;
        
        // Calculate price variation (simplified version)
        const { data: priceHistory, error: priceHistoryError } = await supabase
          .from('historial_precios')
          .select('precio, fecha_registro')
          .order('fecha_registro', { ascending: true })
          .limit(100);
          
        if (priceHistoryError) throw priceHistoryError;
        
        let priceVariation = 0;
        if (priceHistory.length > 1) {
          const firstPrice = priceHistory[0].precio;
          const lastPrice = priceHistory[priceHistory.length - 1].precio;
          priceVariation = ((lastPrice - firstPrice) / firstPrice) * 100;
        }
        
        setKpis({
          totalProducts: productCount?.length || 0,
          averagePrice: Math.round(avgPrice),
          totalSellers: sellerCount?.length || 0,
          priceVariation: Math.round(priceVariation * 100) / 100
        });
        
        // Fetch recent products
        const { data: recentProductsData, error: recentProductsError } = await supabase
          .from('productos')
          .select(`
            id_producto,
            nombre_producto,
            marca,
            precio,
            precio_anterior,
            marketplace,
            stock_disponible,
            imagen_url,
            fecha_extraccion,
            sellers(nombre_seller),
            categorias(nombre_categoria)
          `)
          .eq('activo', true)
          .order('fecha_extraccion', { ascending: false })
          .limit(5);
          
        if (recentProductsError) throw recentProductsError;
        
        if (recentProductsData) {
          setRecentProducts(recentProductsData.map(product => ({
            id: product.id_producto,
            nombre: product.nombre_producto,
            marca: product.marca,
            precio: product.precio,
            precioAnterior: product.precio_anterior,
            marketplace: product.marketplace,
            seller: product.sellers?.nombre_seller,
            stock: product.stock_disponible,
            imagen: product.imagen_url,
            categoria: product.categorias?.nombre_categoria,
            fechaExtraccion: product.fecha_extraccion
          })));
        }
        
        // Fetch price history data for chart
        const { data: chartData, error: chartDataError } = await supabase
          .from('historial_precios')
          .select(`
            precio,
            fecha_registro,
            productos(marketplace)
          `)
          .order('fecha_registro', { ascending: true })
          .limit(100);
          
        if (chartDataError) throw chartDataError;
        
        if (chartData) {
          setPriceHistoryData(chartData.map(item => ({
            fecha: item.fecha_registro,
            precio: item.precio,
            marketplace: item.productos?.marketplace
          })));
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const productColumns = [
    {
      header: 'Producto',
      accessor: 'nombre',
      cell: (value: string, row: ProductData) => (
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
            <div className="text-gray-500 text-xs">{row.marca}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Precio',
      accessor: 'precio',
      cell: (value: number) => (
        <div>
          <div className="font-medium">{formatCurrency(value)}</div>
          {value && value.precioAnterior && (
            <div className="text-xs text-gray-500 line-through">
              {formatCurrency(value.precioAnterior)}
            </div>
          )}
        </div>
      )
    },
    {
      header: 'Marketplace',
      accessor: 'marketplace'
    },
    {
      header: 'Categoría',
      accessor: 'categoria'
    },
    {
      header: 'Stock',
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

  const kpiCards = [
    {
      title: 'Total Productos',
      value: kpis.totalProducts.toLocaleString(),
      change: {
        value: '+5.2% vs último período',
        type: 'increase' as const
      },
      icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>`
    },
    {
      title: 'Precio Promedio',
      value: formatCurrency(kpis.averagePrice),
      change: {
        value: '+2.3% vs último período',
        type: 'increase' as const
      },
      icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>`
    },
    {
      title: 'Total Sellers',
      value: kpis.totalSellers.toLocaleString(),
      change: {
        value: '+15.4% vs último período',
        type: 'increase' as const
      },
      icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>`
    },
    {
      title: 'Variación Precios',
      value: `${kpis.priceVariation.toFixed(2)}%`,
      change: {
        value: `${kpis.priceVariation >= 0 ? '+' : ''}${kpis.priceVariation.toFixed(2)}% vs último período`,
        type: kpis.priceVariation >= 0 ? 'increase' as const : 'decrease' as const
      },
      icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>`
    }
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpiCards.map((card, index) => (
          <KpiCard key={index} data={card} />
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Price History Chart */}
        <div className="lg:col-span-2">
          <PriceChart 
            data={priceHistoryData} 
            multiSeries={true} 
            title="Historial de Precios"
          />
        </div>
        
        {/* Marketplace Distribution */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4">Distribución por Marketplace</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-700">Mercado Libre</span>
                <span className="text-sm font-medium text-gray-700">45%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-700">Falabella</span>
                <span className="text-sm font-medium text-gray-700">25%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-700">Éxito</span>
                <span className="text-sm font-medium text-gray-700">15%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '15%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-700">Alkosto</span>
                <span className="text-sm font-medium text-gray-700">10%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '10%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-700">Otros</span>
                <span className="text-sm font-medium text-gray-700">5%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gray-500 h-2 rounded-full" style={{ width: '5%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Products */}
      <div className="mb-8">
        <DataTable 
          columns={productColumns} 
          data={recentProducts} 
          title="Productos Recientes"
        />
      </div>
    </div>
  );
};

export default Dashboard;
