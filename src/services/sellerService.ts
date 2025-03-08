import { supabase } from '../lib/supabase';
import { SellerData } from '../types';

export const fetchSellers = async (marketplace?: string): Promise<SellerData[]> => {
  try {
    let query = supabase
      .from('sellers')
      .select(`
        id_seller,
        nombre_seller,
        marketplace,
        calificacion,
        numero_ventas,
        url_seller
      `)
      .eq('activo', true);

    if (marketplace) {
      query = query.eq('marketplace', marketplace);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return data.map(seller => ({
      id: seller.id_seller,
      nombre: seller.nombre_seller,
      marketplace: seller.marketplace,
      calificacion: seller.calificacion || 0,
      ventas: seller.numero_ventas || 0,
      url: seller.url_seller
    }));
  } catch (error) {
    console.error('Error fetching sellers:', error);
    return [];
  }
};

export const fetchSellerProducts = async (sellerId: number): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('productos')
      .select(`
        id_producto,
        nombre_producto,
        precio,
        precio_anterior,
        stock_disponible,
        marketplace,
        categorias(nombre_categoria)
      `)
      .eq('id_seller', sellerId)
      .eq('activo', true);

    if (error) {
      throw error;
    }

    return data.map(product => ({
      id: product.id_producto,
      nombre: product.nombre_producto,
      precio: product.precio,
      precioAnterior: product.precio_anterior,
      stock: product.stock_disponible,
      marketplace: product.marketplace,
      categoria: product.categorias?.nombre_categoria
    }));
  } catch (error) {
    console.error('Error fetching seller products:', error);
    return [];
  }
};

export const compareSellersByCategory = async (sellerIds: number[], categoryId?: number): Promise<any> => {
  try {
    let query = supabase
      .from('productos')
      .select(`
        id_producto,
        id_seller,
        precio,
        id_categoria,
        sellers(nombre_seller, marketplace)
      `)
      .in('id_seller', sellerIds)
      .eq('activo', true);

    if (categoryId) {
      query = query.eq('id_categoria', categoryId);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    const sellerData: Record<string, { name: string, marketplace: string, avgPrice: number, productCount: number }> = {};
    
    // Process data
    data.forEach(product => {
      const sellerId = product.id_seller.toString();
      
      if (!sellerData[sellerId]) {
        sellerData[sellerId] = {
          name: product.sellers?.nombre_seller || 'Unknown',
          marketplace: product.sellers?.marketplace || 'Unknown',
          avgPrice: 0,
          productCount: 0
        };
      }
      
      sellerData[sellerId].avgPrice += product.precio;
      sellerData[sellerId].productCount += 1;
    });
    
    // Calculate averages
    Object.keys(sellerData).forEach(sellerId => {
      if (sellerData[sellerId].productCount > 0) {
        sellerData[sellerId].avgPrice = sellerData[sellerId].avgPrice / sellerData[sellerId].productCount;
      }
    });
    
    return Object.keys(sellerData).map(sellerId => ({
      id: sellerId,
      ...sellerData[sellerId]
    }));
  } catch (error) {
    console.error('Error comparing sellers:', error);
    return [];
  }
};
