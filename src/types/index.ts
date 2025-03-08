export interface KpiCard {
  title: string;
  value: string | number;
  change: {
    value: string;
    type: 'increase' | 'decrease' | 'neutral';
  };
  icon: string;
}

export interface ProductData {
  id: number;
  nombre: string;
  marca: string;
  precio: number;
  precioAnterior: number | null;
  marketplace: string;
  seller: string;
  stock: number;
  imagen: string | null;
  categoria: string;
  fechaExtraccion: string;
  modelo?: string;
  sku?: string;
  caracteristicas?: ProductCharacteristic[];
  productoBaseId?: number;
}

export interface ChartData {
  fecha: string;
  precio: number;
  marketplace?: string;
}

export interface SellerData {
  id: number;
  nombre: string;
  marketplace: string;
  calificacion: number;
  ventas: number;
  url: string | null;
}

export interface AlertData {
  id: number;
  tipo: string;
  producto: string;
  condicion: string;
  valor: number;
  activa: boolean;
  ultimaNotificacion: string | null;
}

export interface CategoryData {
  id: number;
  nombre: string;
  nivel: number;
  categoriaPadre: number | null;
}

export interface ProductFilterOptions {
  marketplace?: string[];
  categoria?: number[];
  seller?: number[];
  precioMin?: number;
  precioMax?: number;
  stock?: boolean;
  fechaDesde?: string;
  fechaHasta?: string;
  caracteristicas?: Record<string, string[]>;
}

export interface ProductVariant {
  id: number;
  marketplace: string;
  precio: number;
  precioAnterior: number | null;
  stock: number;
  url: string;
  imagen: string | null;
  seller: string | null;
}

export interface ProductCharacteristic {
  nombre: string;
  valor: string;
}

export interface ComparisonProduct {
  id: number;
  nombre: string;
  marca: string;
  modelo: string;
  sku: string;
  variantes: ProductVariant[];
  caracteristicas: ProductCharacteristic[];
}

export interface ProductBase {
  id: number;
  nombre: string;
  marca: string;
  modelo: string;
  sku: string;
  categoria: string;
  descripcion: string;
  imagen: string | null;
  variantes: {
    id: number;
    marketplace: string;
    precio: number;
    precioAnterior: number | null;
    stock: number;
    seller: string | null;
  }[];
  caracteristicas: ProductCharacteristic[];
}

export interface CategoryCharacteristic {
  id: number;
  nombre: string;
  opciones: string[];
  requerido: boolean;
}

export interface ComparisonReport {
  id: string;
  nombre: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  products?: ProductBase[];
  productIds?: number[];
}
