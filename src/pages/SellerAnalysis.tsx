import { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import { fetchSellers, fetchSellerProducts, compareSellersByCategory } from '../services/sellerService';
import { supabase } from '../lib/supabase';
import { SellerData } from '../types';
import { Users, Star, ShoppingBag, BarChart2 } from 'lucide-react';

const SellerAnalysis = () => {
  const [sellers, setSellers] = useState<SellerData[]>([]);
  const [selectedSellers, setSelectedSellers] = useState<number[]>([]);
  const [comparisonData, setComparisonData] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [comparisonLoading, setComparisonLoading] = useState(false);
  const [activeMarketplace, setActiveMarketplace] = useState<string | null>(null);
  const [marketplaces, setMarketplaces] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      // Load sellers
      const sellersData = await fetchSellers();
      setSellers(sellersData);
      
      // Extract unique marketplaces
      const uniqueMarketplaces = [...new Set(sellersData.map(seller => seller.marketplace))];
      setMarketplaces(uniqueMarketplaces);
      
      if (uniqueMarketplaces.length > 0) {
        setActiveMarketplace(uniqueMarketplaces[0]);
      }
      
      // Load categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categorias')
        .select('id_categoria, nombre_categoria')
        .eq('activa', true)
        .eq('nivel', 1);
        
      if (categoriesError) {
        console.error('Error loading categories:', categoriesError);
      } else if (categoriesData) {
        setCategories(categoriesData);
        
        if (categoriesData.length > 0) {
          setSelectedCategory(categoriesData[0].id_categoria);
        }
      }
      
      setIsLoading(false);
    };

    loadData();
  }, []);

  useEffect(() => {
    if (selectedSellers.length >= 2 && selectedCategory) {
      performComparison();
    } else {
      setComparisonData([]);
    }
  }, [selectedSellers, selectedCategory]);

  const toggleSellerSelection = (sellerId: number) => {
    setSelectedSellers(prev => 
      prev.includes(sellerId)
        ? prev.filter(id => id !== sellerId)
        : [...prev, sellerId]
    );
  };

  const performComparison = async () => {
    if (selectedSellers.length < 2 || !selectedCategory) return;
    
    setComparisonLoading(true);
    
    const data = await compareSellersByCategory(selectedSellers, selectedCategory);
    setComparisonData(data);
    
    setComparisonLoading(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const sellerColumns = [
    {
      header: 'Seller',
      accessor: 'nombre',
      cell: (value: string, row: SellerData) => (
        <div className="flex items-center">
          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
            <Users className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{value}</div>
            <div className="text-gray-500 text-xs">{row.marketplace}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Calificación',
      accessor: 'calificacion',
      cell: (value: number) => (
        <div className="flex items-center">
          <Star className="h-4 w-4 text-yellow-400 mr-1" />
          <span>{value ? value.toFixed(1) : 'N/A'}</span>
        </div>
      )
    },
    {
      header: 'Ventas',
      accessor: 'ventas',
      cell: (value: number) => (
        <span>{value ? value.toLocaleString() : 'N/A'}</span>
      )
    },
    {
      header: 'Comparar',
      accessor: 'id',
      cell: (value: number) => (
        <button
          onClick={() => toggleSellerSelection(value)}
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            selectedSellers.includes(value)
              ? 'bg-indigo-100 text-indigo-800'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          {selectedSellers.includes(value) ? 'Seleccionado' : 'Seleccionar'}
        </button>
      )
    }
  ];

  const comparisonColumns = [
    {
      header: 'Seller',
      accessor: 'name',
      cell: (value: string, row: any) => (
        <div className="flex items-center">
          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-2">
            <Users className="h-4 w-4 text-indigo-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{value}</div>
            <div className="text-gray-500 text-xs">{row.marketplace}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Precio Promedio',
      accessor: 'avgPrice',
      cell: (value: number) => formatCurrency(value)
    },
    {
      header: 'Cant. Productos',
      accessor: 'productCount',
      cell: (value: number) => (
        <div className="flex items-center">
          <ShoppingBag className="h-4 w-4 text-gray-500 mr-1" />
          <span>{value}</span>
        </div>
      )
    }
  ];

  const filteredSellers = activeMarketplace
    ? sellers.filter(seller => seller.marketplace === activeMarketplace)
    : sellers;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Análisis de Sellers</h1>
      
      {/* Marketplace filter tabs */}
      {marketplaces.length > 0 && (
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {marketplaces.map(marketplace => (
                <button
                  key={marketplace}
                  onClick={() => setActiveMarketplace(marketplace)}
                  className={`${
                    activeMarketplace === marketplace
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  {marketplace}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}
      
      {/* Selected sellers display */}
      {selectedSellers.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">Sellers seleccionados para comparar</h3>
            <button
              onClick={() => setSelectedSellers([])}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Limpiar selección
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {selectedSellers.map(id => {
              const seller = sellers.find(s => s.id === id);
              return seller ? (
                <div
                  key={id}
                  className="flex items-center bg-indigo-100 text-indigo-800 px-3 py-1 rounded-md text-sm"
                >
                  <span>{seller.nombre}</span>
                  <button
                    onClick={() => toggleSellerSelection(id)}
                    className="ml-2 text-indigo-600 hover:text-indigo-800"
                  >
                    ×
                  </button>
                </div>
              ) : null;
            })}
          </div>
          
          {/* Category selector for comparison */}
          {selectedSellers.length >= 2 && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Seleccionar categoría para comparar:
              </label>
              <div className="flex items-center">
                <select
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={selectedCategory || ''}
                  onChange={(e) => setSelectedCategory(Number(e.target.value))}
                >
                  {categories.map((category) => (
                    <option key={category.id_categoria} value={category.id_categoria}>
                      {category.nombre_categoria}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Seller comparison results */}
      {comparisonData.length > 0 && (
        <div className="mb-6">
          <DataTable
            columns={comparisonColumns}
            data={comparisonData}
            title="Comparación de Sellers"
          />
        </div>
      )}
      
      {/* Sellers table */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <DataTable 
          columns={sellerColumns} 
          data={filteredSellers} 
          title={`Sellers ${activeMarketplace ? `- ${activeMarketplace}` : ''}`}
        />
      )}
    </div>
  );
};

export default SellerAnalysis;
