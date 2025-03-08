import { useState, useEffect } from 'react';
import { Filter, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { ProductFilterOptions, CategoryData } from '../types';
import { fetchCategoryCharacteristics } from '../services/productService';

interface FilterPanelProps {
  onFilterChange: (filters: ProductFilterOptions) => void;
  initialFilters?: ProductFilterOptions;
}

const FilterPanel = ({ onFilterChange, initialFilters }: FilterPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<ProductFilterOptions>(initialFilters || {});
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [marketplaces, setMarketplaces] = useState<string[]>([]);
  const [sellers, setSellers] = useState<{ id: number; nombre: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [categoryCharacteristics, setCategoryCharacteristics] = useState<any[]>([]);
  const [characteristicsFilters, setCharacteristicsFilters] = useState<Record<string, string[]>>({});

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categorias')
          .select('id_categoria, nombre_categoria, nivel, categoria_padre_id')
          .eq('activa', true);

        if (categoriesError) throw categoriesError;
        
        if (categoriesData) {
          setCategories(
            categoriesData.map(cat => ({
              id: cat.id_categoria,
              nombre: cat.nombre_categoria,
              nivel: cat.nivel,
              categoriaPadre: cat.categoria_padre_id
            }))
          );
        }

        // Fetch unique marketplaces
        const { data: marketplacesData, error: marketplacesError } = await supabase
          .from('productos')
          .select('marketplace')
          .eq('activo', true);

        if (marketplacesError) throw marketplacesError;
        
        if (marketplacesData) {
          const uniqueMarketplaces = [...new Set(marketplacesData.map(item => item.marketplace))];
          setMarketplaces(uniqueMarketplaces);
        }

        // Fetch sellers
        const { data: sellersData, error: sellersError } = await supabase
          .from('sellers')
          .select('id_seller, nombre_seller')
          .eq('activo', true);

        if (sellersError) throw sellersError;
        
        if (sellersData) {
          setSellers(
            sellersData.map(seller => ({
              id: seller.id_seller,
              nombre: seller.nombre_seller
            }))
          );
        }
      } catch (error) {
        console.error('Error fetching filter options:', error);
      }
    };

    fetchFilterOptions();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      loadCategoryCharacteristics(selectedCategory);
    } else {
      setCategoryCharacteristics([]);
    }
  }, [selectedCategory]);

  const loadCategoryCharacteristics = async (categoryId: number) => {
    try {
      const characteristics = await fetchCategoryCharacteristics(categoryId);
      setCategoryCharacteristics(characteristics);
    } catch (error) {
      console.error('Error loading category characteristics:', error);
    }
  };

  const handleFilterChange = (key: keyof ProductFilterOptions, value: any) => {
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value };
      
      // Si cambiamos la categoría, reseteamos los filtros de características
      if (key === 'categoria') {
        setSelectedCategory(value && value.length > 0 ? value[0] : null);
        newFilters.caracteristicas = {};
        setCharacteristicsFilters({});
      }
      
      onFilterChange(newFilters);
      return newFilters;
    });
  };

  const handleCharacteristicFilterChange = (name: string, value: string, checked: boolean) => {
    setCharacteristicsFilters(prev => {
      const current = prev[name] || [];
      const newValues = checked 
        ? [...current, value]
        : current.filter(v => v !== value);
      
      const newCharacteristicsFilters = {
        ...prev,
        [name]: newValues
      };
      
      // Eliminar la característica si no tiene valores seleccionados
      if (newValues.length === 0) {
        delete newCharacteristicsFilters[name];
      }
      
      // Actualizar los filtros generales
      const newFilters = { 
        ...filters, 
        caracteristicas: newCharacteristicsFilters 
      };
      
      onFilterChange(newFilters);
      return newCharacteristicsFilters;
    });
  };

  const clearFilters = () => {
    setFilters({});
    setCharacteristicsFilters({});
    setSelectedCategory(null);
    onFilterChange({});
  };

  return (
    <div className="bg-white rounded-lg shadow-sm mb-6">
      <div 
        className="p-4 border-b border-gray-200 flex justify-between items-center cursor-pointer" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <Filter className="h-5 w-5 text-indigo-500 mr-2" />
          <h3 className="font-medium">Filtros</h3>
        </div>
        <div className="flex items-center space-x-4">
          {Object.keys(filters).length > 0 && (
            <button 
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
              onClick={(e) => {
                e.stopPropagation();
                clearFilters();
              }}
            >
              <X className="h-4 w-4 mr-1" />
              Limpiar filtros
            </button>
          )}
          <span className="text-gray-400">
            {isOpen ? '▲' : '▼'}
          </span>
        </div>
      </div>

      {isOpen && (
        <div className="p-4">
          {/* Filtros principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Marketplace filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Marketplace
              </label>
              <select
                className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={filters.marketplace ? filters.marketplace[0] : ''}
                onChange={(e) => 
                  handleFilterChange('marketplace', e.target.value ? [e.target.value] : undefined)
                }
              >
                <option value="">Todos</option>
                {marketplaces.map((mp) => (
                  <option key={mp} value={mp}>
                    {mp}
                  </option>
                ))}
              </select>
            </div>

            {/* Category filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría
              </label>
              <select
                className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={filters.categoria ? filters.categoria[0] : ''}
                onChange={(e) => 
                  handleFilterChange('categoria', e.target.value ? [parseInt(e.target.value)] : undefined)
                }
              >
                <option value="">Todas</option>
                {categories
                  .filter(cat => cat.nivel === 1)
                  .map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nombre}
                    </option>
                ))}
              </select>
            </div>

            {/* Price range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio mínimo (COP)
              </label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={filters.precioMin || ''}
                onChange={(e) => 
                  handleFilterChange('precioMin', e.target.value ? parseInt(e.target.value) : undefined)
                }
                placeholder="Min"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio máximo (COP)
              </label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={filters.precioMax || ''}
                onChange={(e) => 
                  handleFilterChange('precioMax', e.target.value ? parseInt(e.target.value) : undefined)
                }
                placeholder="Max"
              />
            </div>

            {/* Stock filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock
              </label>
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  checked={filters.stock || false}
                  onChange={(e) => handleFilterChange('stock', e.target.checked)}
                />
                <span className="ml-2 text-sm text-gray-700">Solo productos con stock</span>
              </div>
            </div>

            {/* Date range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha desde
              </label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={filters.fechaDesde || ''}
                onChange={(e) => handleFilterChange('fechaDesde', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha hasta
              </label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={filters.fechaHasta || ''}
                onChange={(e) => handleFilterChange('fechaHasta', e.target.value)}
              />
            </div>

            {/* Seller filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Seller
              </label>
              <select
                className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={filters.seller ? filters.seller[0] : ''}
                onChange={(e) => 
                  handleFilterChange('seller', e.target.value ? [parseInt(e.target.value)] : undefined)
                }
              >
                <option value="">Todos</option>
                {sellers.map((seller) => (
                  <option key={seller.id} value={seller.id}>
                    {seller.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Filtros de características específicas de la categoría */}
          {categoryCharacteristics.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-700 mb-3 border-b pb-2">Características de la categoría</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryCharacteristics.map((characteristic) => (
                  <div key={characteristic.id}>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">{characteristic.nombre}</h5>
                    <div className="space-y-2">
                      {characteristic.opciones.map((opcion: string, idx: number) => (
                        <label key={idx} className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            checked={(characteristicsFilters[characteristic.nombre] || []).includes(opcion)}
                            onChange={(e) => handleCharacteristicFilterChange(characteristic.nombre, opcion, e.target.checked)}
                          />
                          <span className="ml-2 text-sm text-gray-700">{opcion}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
