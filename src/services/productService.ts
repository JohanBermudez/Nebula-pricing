import { supabase } from '../lib/supabase';
import { ProductFilterOptions, ProductData, ComparisonProduct, ProductBase } from '../types';

export const fetchUniqueProducts = async (filters: ProductFilterOptions = {}): Promise<ProductBase[]> => {
  try {
    // Consulta base para obtener productos base
    let query = supabase
      .from('productos_base')
      .select(`
        id_producto_base,
        nombre,
        marca,
        modelo,
        sku,
        descripcion,
        imagen_url,
        categorias (
          id_categoria,
          nombre_categoria
        )
      `)
      .eq('activo', true);

    // Aplicar filtros de categoría
    if (filters.categoria && filters.categoria.length > 0) {
      query = query.in('id_categoria', filters.categoria);
    }

    const { data: productosBase, error: productosBaseError } = await query;

    if (productosBaseError) throw productosBaseError;
    if (!productosBase || productosBase.length === 0) return [];

    // Array para almacenar los productos base con sus variantes
    const productosCompletos: ProductBase[] = [];

    // Para cada producto base, obtenemos sus variantes (productos en marketplaces)
    for (const productoBase of productosBase) {
      // Filtros para variantes
      let variantesQuery = supabase
        .from('productos')
        .select(`
          id_producto,
          precio,
          precio_anterior,
          marketplace,
          stock_disponible,
          url_producto,
          imagen_url,
          sellers (nombre_seller)
        `)
        .eq('id_producto_base', productoBase.id_producto_base)
        .eq('activo', true);

      // Aplicar filtros específicos para variantes
      if (filters.marketplace && filters.marketplace.length > 0) {
        variantesQuery = variantesQuery.in('marketplace', filters.marketplace);
      }

      if (filters.seller && filters.seller.length > 0) {
        variantesQuery = variantesQuery.in('id_seller', filters.seller);
      }

      if (filters.precioMin !== undefined) {
        variantesQuery = variantesQuery.gte('precio', filters.precioMin);
      }

      if (filters.precioMax !== undefined) {
        variantesQuery = variantesQuery.lte('precio', filters.precioMax);
      }

      if (filters.stock) {
        variantesQuery = variantesQuery.gt('stock_disponible', 0);
      }

      if (filters.fechaDesde) {
        variantesQuery = variantesQuery.gte('fecha_extraccion', filters.fechaDesde);
      }

      if (filters.fechaHasta) {
        variantesQuery = variantesQuery.lte('fecha_extraccion', filters.fechaHasta);
      }

      // Ejecutar consulta de variantes
      const { data: variantes, error: variantesError } = await variantesQuery;

      if (variantesError) {
        console.error('Error al obtener variantes:', variantesError);
        continue;
      }
      
      // Solo incluimos productos que tienen variantes que cumplen con los filtros
      if (variantes && variantes.length > 0) {
        // Obtenemos características del producto
        const { data: caracteristicas, error: caracteristicasError } = await supabase
          .from('caracteristicas')
          .select(`
            nombre_caracteristica,
            valor_caracteristica
          `)
          .eq('id_producto', variantes[0].id_producto);

        if (caracteristicasError) {
          console.error('Error al obtener características:', caracteristicasError);
        }

        // Construir producto completo
        productosCompletos.push({
          id: productoBase.id_producto_base,
          nombre: productoBase.nombre,
          marca: productoBase.marca || '',
          modelo: productoBase.modelo || '',
          sku: productoBase.sku || '',
          categoria: productoBase.categorias?.nombre_categoria || '',
          descripcion: productoBase.descripcion || '',
          imagen: productoBase.imagen_url,
          variantes: variantes.map(v => ({
            id: v.id_producto,
            marketplace: v.marketplace,
            precio: v.precio,
            precioAnterior: v.precio_anterior,
            stock: v.stock_disponible,
            seller: v.sellers?.nombre_seller
          })),
          caracteristicas: caracteristicas ? caracteristicas.map(c => ({
            nombre: c.nombre_caracteristica,
            valor: c.valor_caracteristica
          })) : []
        });
      }
    }

    return productosCompletos;
  } catch (error) {
    console.error('Error fetching unique products:', error);
    return [];
  }
};

export const fetchProducts = async (filters: ProductFilterOptions = {}): Promise<ProductData[]> => {
  try {
    let query = supabase
      .from('productos')
      .select(`
        id_producto,
        nombre_producto,
        marca,
        modelo,
        sku,
        precio,
        precio_anterior,
        marketplace,
        stock_disponible,
        imagen_url,
        fecha_extraccion,
        id_producto_base,
        sellers(nombre_seller),
        categorias(nombre_categoria)
      `)
      .eq('activo', true);

    // Apply filters
    if (filters.marketplace && filters.marketplace.length > 0) {
      query = query.in('marketplace', filters.marketplace);
    }

    if (filters.categoria && filters.categoria.length > 0) {
      query = query.in('id_categoria', filters.categoria);
    }

    if (filters.seller && filters.seller.length > 0) {
      query = query.in('id_seller', filters.seller);
    }

    if (filters.precioMin !== undefined) {
      query = query.gte('precio', filters.precioMin);
    }

    if (filters.precioMax !== undefined) {
      query = query.lte('precio', filters.precioMax);
    }

    if (filters.stock) {
      query = query.gt('stock_disponible', 0);
    }

    if (filters.fechaDesde) {
      query = query.gte('fecha_extraccion', filters.fechaDesde);
    }

    if (filters.fechaHasta) {
      query = query.lte('fecha_extraccion', filters.fechaHasta);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return data.map(product => ({
      id: product.id_producto,
      nombre: product.nombre_producto,
      marca: product.marca,
      modelo: product.modelo,
      sku: product.sku,
      precio: product.precio,
      precioAnterior: product.precio_anterior,
      marketplace: product.marketplace,
      seller: product.sellers?.nombre_seller,
      stock: product.stock_disponible,
      imagen: product.imagen_url,
      categoria: product.categorias?.nombre_categoria,
      fechaExtraccion: product.fecha_extraccion,
      productoBaseId: product.id_producto_base
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const fetchPriceHistory = async (productId: number): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('historial_precios')
      .select(`
        precio,
        moneda,
        fecha_registro,
        productos(marketplace)
      `)
      .eq('id_producto', productId)
      .order('fecha_registro', { ascending: true });

    if (error) {
      throw error;
    }

    return data.map(item => ({
      fecha: item.fecha_registro,
      precio: item.precio,
      marketplace: item.productos?.marketplace
    }));
  } catch (error) {
    console.error('Error fetching price history:', error);
    return [];
  }
};

export const fetchStockHistory = async (productId: number): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('historial_stock')
      .select(`
        stock_disponible,
        fecha_registro
      `)
      .eq('id_producto', productId)
      .order('fecha_registro', { ascending: true });

    if (error) {
      throw error;
    }

    return data.map(item => ({
      fecha: item.fecha_registro,
      stock: item.stock_disponible
    }));
  } catch (error) {
    console.error('Error fetching stock history:', error);
    return [];
  }
};

export const fetchProductDetails = async (productId: number): Promise<any> => {
  try {
    const { data, error } = await supabase
      .from('productos')
      .select(`
        id_producto,
        nombre_producto,
        marca,
        modelo,
        sku,
        precio,
        precio_anterior,
        moneda,
        stock_disponible,
        url_producto,
        imagen_url,
        descripcion,
        fecha_extraccion,
        marketplace,
        sellers(nombre_seller, calificacion, url_seller),
        categorias(nombre_categoria),
        caracteristicas(nombre_caracteristica, valor_caracteristica)
      `)
      .eq('id_producto', productId)
      .single();

    if (error) {
      throw error;
    }

    return {
      id: data.id_producto,
      nombre: data.nombre_producto,
      marca: data.marca,
      modelo: data.modelo,
      sku: data.sku,
      precio: data.precio,
      precioAnterior: data.precio_anterior,
      moneda: data.moneda,
      stock: data.stock_disponible,
      url: data.url_producto,
      imagen: data.imagen_url,
      descripcion: data.descripcion,
      fecha: data.fecha_extraccion,
      marketplace: data.marketplace,
      seller: {
        nombre: data.sellers?.nombre_seller,
        calificacion: data.sellers?.calificacion,
        url: data.sellers?.url_seller
      },
      categoria: data.categorias?.nombre_categoria,
      caracteristicas: data.caracteristicas
    };
  } catch (error) {
    console.error('Error fetching product details:', error);
    return null;
  }
};

export const fetchComparisonProducts = async (productIds: number[]): Promise<ComparisonProduct[]> => {
  try {
    console.log('Productos a comparar IDs:', productIds);
    
    // 1. Obtenemos los productos base seleccionados para comparar
    const { data: selectedProductsBases, error: selectedProductsError } = await supabase
      .from('productos_base')
      .select(`
        id_producto_base,
        nombre,
        marca,
        modelo,
        sku
      `)
      .in('id_producto_base', productIds);

    if (selectedProductsError) {
      console.error('Error obteniendo productos base:', selectedProductsError);
      throw selectedProductsError;
    }
    
    console.log('Productos base encontrados:', selectedProductsBases?.length || 0);
    
    if (!selectedProductsBases || selectedProductsBases.length === 0) return [];

    // 2. Para cada producto base, buscamos sus variantes en diferentes marketplaces
    const comparisonProducts: ComparisonProduct[] = [];

    for (const productoBase of selectedProductsBases) {
      // Buscar todas las variantes del producto
      const { data: variants, error: variantsError } = await supabase
        .from('productos')
        .select(`
          id_producto,
          precio,
          precio_anterior,
          marketplace,
          stock_disponible,
          url_producto,
          imagen_url,
          sellers(nombre_seller)
        `)
        .eq('id_producto_base', productoBase.id_producto_base)
        .eq('activo', true);

      if (variantsError) {
        console.error('Error obteniendo variantes:', variantsError);
        continue;
      }
      
      console.log(`Variantes para producto base ${productoBase.id_producto_base}:`, variants?.length || 0);

      if (!variants || variants.length === 0) {
        continue;
      }

      // Obtener características del producto
      const { data: characteristics, error: characteristicsError } = await supabase
        .from('caracteristicas')
        .select(`
          nombre_caracteristica,
          valor_caracteristica
        `)
        .eq('id_producto', variants[0]?.id_producto);

      if (characteristicsError) {
        console.error('Error obteniendo características:', characteristicsError);
      }

      // Crear el objeto de comparación
      comparisonProducts.push({
        id: productoBase.id_producto_base,
        nombre: productoBase.nombre,
        marca: productoBase.marca || '',
        modelo: productoBase.modelo || '',
        sku: productoBase.sku || '',
        variantes: variants ? variants.map(variant => ({
          id: variant.id_producto,
          marketplace: variant.marketplace,
          precio: variant.precio,
          precioAnterior: variant.precio_anterior,
          stock: variant.stock_disponible,
          url: variant.url_producto,
          imagen: variant.imagen_url,
          seller: variant.sellers?.nombre_seller
        })) : [],
        caracteristicas: characteristics ? characteristics.map(char => ({
          nombre: char.nombre_caracteristica,
          valor: char.valor_caracteristica
        })) : []
      });
    }

    console.log('Productos para comparar:', comparisonProducts);
    return comparisonProducts;
  } catch (error) {
    console.error('Error fetching comparison products:', error);
    return [];
  }
};

export const fetchCategoryCharacteristics = async (categoryId: number): Promise<any[]> => {
  try {
    // En un sistema real, aquí consultaríamos las características por categoría
    // Simulamos una consulta para el MVP
    return [
      { id: 1, nombre: 'Tamaño de pantalla', opciones: ['32"', '43"', '50"', '55"', '65"', '75"'], requerido: true },
      { id: 2, nombre: 'Resolución', opciones: ['HD', 'Full HD', 'UHD 4K', '8K'], requerido: true },
      { id: 3, nombre: 'Smart TV', opciones: ['Sí', 'No'], requerido: false },
      { id: 4, nombre: 'Sistema operativo', opciones: ['Tizen', 'WebOS', 'Android TV', 'Roku'], requerido: false },
      { id: 5, nombre: 'HDMI', opciones: ['1', '2', '3', '4'], requerido: false },
    ];
  } catch (error) {
    console.error('Error fetching category characteristics:', error);
    return [];
  }
};
