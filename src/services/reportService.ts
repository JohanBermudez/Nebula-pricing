import { supabase } from '../lib/supabase';
import { ComparisonReport, ComparisonProduct } from '../types';
import { fetchComparisonProducts } from './productService';

// ID de usuario invitado para uso cuando no hay autenticación
const GUEST_USER_ID = 'c4d7a458-82e7-4a9b-b35d-b54a09c8e51e';

/**
 * Obtiene todos los informes comparativos del usuario actual o del usuario invitado
 */
export const fetchUserReports = async (): Promise<ComparisonReport[]> => {
  try {
    // Intentar obtener el usuario actual
    const { data: authData } = await supabase.auth.getUser();
    const userId = authData.user?.id || GUEST_USER_ID;
    
    console.log('Consultando informes para el usuario:', userId);

    const { data: reports, error } = await supabase
      .from('comparison_reports')
      .select(`
        id,
        nombre,
        user_id,
        created_at,
        updated_at,
        comparison_report_products(producto_base_id)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error al consultar informes:', error);
      throw error;
    }

    console.log('Informes encontrados:', reports?.length || 0);
    
    return reports?.map(report => ({
      id: report.id,
      nombre: report.nombre,
      userId: report.user_id,
      createdAt: report.created_at,
      updatedAt: report.updated_at,
      productIds: report.comparison_report_products?.map(p => p.producto_base_id) || []
    })) || [];
  } catch (error) {
    console.error('Error fetching user reports:', error);
    return [];
  }
};

/**
 * Obtiene un informe comparativo específico con todos sus productos
 */
export const fetchReportWithProducts = async (reportId: string): Promise<ComparisonReport | null> => {
  try {
    // Obtener el informe
    const { data: report, error } = await supabase
      .from('comparison_reports')
      .select(`
        id,
        nombre,
        user_id,
        created_at,
        updated_at,
        comparison_report_products(producto_base_id)
      `)
      .eq('id', reportId)
      .single();

    if (error) throw error;
    if (!report) return null;

    // Extraer IDs de productos
    const productIds = report.comparison_report_products?.map(p => p.producto_base_id) || [];
    
    if (productIds.length === 0) {
      return {
        id: report.id,
        nombre: report.nombre,
        userId: report.user_id,
        createdAt: report.created_at,
        updatedAt: report.updated_at,
        productIds: [],
        products: []
      };
    }

    // Obtener datos completos de los productos para comparación
    const products = await fetchComparisonProducts(productIds);

    return {
      id: report.id,
      nombre: report.nombre,
      userId: report.user_id,
      createdAt: report.created_at,
      updatedAt: report.updated_at,
      productIds,
      products
    };
  } catch (error) {
    console.error('Error fetching report with products:', error);
    return null;
  }
};

/**
 * Crea un nuevo informe comparativo
 */
export const createComparisonReport = async (nombre: string, productIds: number[]): Promise<string | null> => {
  try {
    // Primero obtenemos el usuario actual
    const { data: authData } = await supabase.auth.getUser();
    const userId = authData.user?.id || GUEST_USER_ID;
    
    console.log('Creando informe para usuario:', userId);
    console.log('Productos a guardar:', productIds);

    // 1. Insertar el informe con el ID de usuario
    const { data: report, error: reportError } = await supabase
      .from('comparison_reports')
      .insert({
        nombre,
        user_id: userId
      })
      .select('id')
      .single();

    if (reportError) {
      console.error('Error al crear el informe:', reportError);
      throw reportError;
    }
    
    if (!report) {
      console.error('No se recibió respuesta al crear el informe');
      throw new Error('No se pudo crear el informe');
    }
    
    console.log('Informe creado con ID:', report.id);

    // 2. Insertar los productos del informe
    if (productIds.length > 0) {
      const productsToInsert = productIds.map(productId => ({
        report_id: report.id,
        producto_base_id: productId
      }));

      console.log('Insertando productos asociados:', productsToInsert);

      const { data: productsData, error: productsError } = await supabase
        .from('comparison_report_products')
        .insert(productsToInsert)
        .select();

      if (productsError) {
        console.error('Error al guardar productos del informe:', productsError);
        throw productsError;
      }
      
      console.log('Productos guardados para el informe:', productsData);
    }

    return report.id;
  } catch (error) {
    console.error('Error creating comparison report:', error);
    return null;
  }
};

/**
 * Actualiza el nombre de un informe comparativo
 */
export const updateReportName = async (reportId: string, newName: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('comparison_reports')
      .update({ 
        nombre: newName,
        updated_at: new Date().toISOString()
      })
      .eq('id', reportId);

    if (error) {
      console.error('Error al actualizar nombre del informe:', error);
      throw error;
    }
    
    console.log('Nombre de informe actualizado con éxito');
    return true;
  } catch (error) {
    console.error('Error updating report name:', error);
    return false;
  }
};

/**
 * Elimina un informe comparativo
 */
export const deleteReport = async (reportId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('comparison_reports')
      .delete()
      .eq('id', reportId);

    if (error) {
      console.error('Error al eliminar informe:', error);
      throw error;
    }
    
    console.log('Informe eliminado con éxito');
    return true;
  } catch (error) {
    console.error('Error deleting report:', error);
    return false;
  }
};
