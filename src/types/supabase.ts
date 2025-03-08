export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      alertas: {
        Row: {
          id_alerta: number
          tipo_alerta: string
          id_producto: number
          id_producto_comparado: number | null
          condicion: string
          valor_referencia: number
          porcentaje: number | null
          activa: boolean
          ultima_notificacion: string | null
          fecha_creacion: string
          fecha_actualizacion: string
        }
        Insert: {
          id_alerta?: number
          tipo_alerta: string
          id_producto: number
          id_producto_comparado?: number | null
          condicion: string
          valor_referencia: number
          porcentaje?: number | null
          activa?: boolean
          ultima_notificacion?: string | null
          fecha_creacion?: string
          fecha_actualizacion?: string
        }
        Update: {
          id_alerta?: number
          tipo_alerta?: string
          id_producto?: number
          id_producto_comparado?: number | null
          condicion?: string
          valor_referencia?: number
          porcentaje?: number | null
          activa?: boolean
          ultima_notificacion?: string | null
          fecha_creacion?: string
          fecha_actualizacion?: string
        }
      }
      article_categories: {
        Row: {
          id: string
          article_id: string | null
          category_id: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          article_id?: string | null
          category_id?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          article_id?: string | null
          category_id?: string | null
          created_at?: string | null
        }
      }
      articles: {
        Row: {
          id: string
          page_id: string | null
          source_id: string | null
          titulo: string
          subtitulo: string | null
          contenido: Json
          imagen_principal: string | null
          slug: string
          seo: Json | null
          estado_publicacion: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          page_id?: string | null
          source_id?: string | null
          titulo: string
          subtitulo?: string | null
          contenido: Json
          imagen_principal?: string | null
          slug: string
          seo?: Json | null
          estado_publicacion?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          page_id?: string | null
          source_id?: string | null
          titulo?: string
          subtitulo?: string | null
          contenido?: Json
          imagen_principal?: string | null
          slug?: string
          seo?: Json | null
          estado_publicacion?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      caracteristicas: {
        Row: {
          id_caracteristica: number
          id_producto: number
          nombre_caracteristica: string
          valor_caracteristica: string
          fecha_creacion: string
          fecha_actualizacion: string
        }
        Insert: {
          id_caracteristica?: number
          id_producto: number
          nombre_caracteristica: string
          valor_caracteristica: string
          fecha_creacion?: string
          fecha_actualizacion?: string
        }
        Update: {
          id_caracteristica?: number
          id_producto?: number
          nombre_caracteristica?: string
          valor_caracteristica?: string
          fecha_creacion?: string
          fecha_actualizacion?: string
        }
      }
      categories: {
        Row: {
          id: string
          nombre: string
          slug: string
          descripcion: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          nombre: string
          slug: string
          descripcion?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          nombre?: string
          slug?: string
          descripcion?: string | null
          created_at?: string | null
        }
      }
      categorias: {
        Row: {
          id_categoria: number
          nombre_categoria: string
          categoria_padre_id: number | null
          nivel: number
          activa: boolean
          fecha_creacion: string
          fecha_actualizacion: string
        }
        Insert: {
          id_categoria?: number
          nombre_categoria: string
          categoria_padre_id?: number | null
          nivel?: number
          activa?: boolean
          fecha_creacion?: string
          fecha_actualizacion?: string
        }
        Update: {
          id_categoria?: number
          nombre_categoria?: string
          categoria_padre_id?: number | null
          nivel?: number
          activa?: boolean
          fecha_creacion?: string
          fecha_actualizacion?: string
        }
      }
      historial_precios: {
        Row: {
          id_historial: number
          id_producto: number
          precio: number
          moneda: string | null
          fecha_registro: string
        }
        Insert: {
          id_historial?: number
          id_producto: number
          precio: number
          moneda?: string | null
          fecha_registro?: string
        }
        Update: {
          id_historial?: number
          id_producto?: number
          precio?: number
          moneda?: string | null
          fecha_registro?: string
        }
      }
      historial_stock: {
        Row: {
          id_historial: number
          id_producto: number
          stock_disponible: number
          fecha_registro: string
        }
        Insert: {
          id_historial?: number
          id_producto: number
          stock_disponible: number
          fecha_registro?: string
        }
        Update: {
          id_historial?: number
          id_producto?: number
          stock_disponible?: number
          fecha_registro?: string
        }
      }
      notificaciones_alertas: {
        Row: {
          id_notificacion: number
          id_alerta: number
          mensaje: string
          leida: boolean
          fecha_notificacion: string
        }
        Insert: {
          id_notificacion?: number
          id_alerta: number
          mensaje: string
          leida?: boolean
          fecha_notificacion?: string
        }
        Update: {
          id_notificacion?: number
          id_alerta?: number
          mensaje?: string
          leida?: boolean
          fecha_notificacion?: string
        }
      }
      pages: {
        Row: {
          id: string
          nombre: string
          estado: boolean | null
          config_publicacion: Json | null
          created_at: string | null
        }
        Insert: {
          id?: string
          nombre: string
          estado?: boolean | null
          config_publicacion?: Json | null
          created_at?: string | null
        }
        Update: {
          id?: string
          nombre?: string
          estado?: boolean | null
          config_publicacion?: Json | null
          created_at?: string | null
        }
      }
      productos: {
        Row: {
          id_producto: number
          nombre_producto: string
          marca: string | null
          modelo: string | null
          sku: string | null
          id_categoria: number
          marketplace: string
          id_seller: number
          precio: number
          precio_anterior: number | null
          moneda: string | null
          stock_disponible: number | null
          url_producto: string
          imagen_url: string | null
          descripcion: string | null
          fecha_extraccion: string
          activo: boolean
          fecha_creacion: string
          fecha_actualizacion: string
        }
        Insert: {
          id_producto?: number
          nombre_producto: string
          marca?: string | null
          modelo?: string | null
          sku?: string | null
          id_categoria: number
          marketplace: string
          id_seller: number
          precio: number
          precio_anterior?: number | null
          moneda?: string | null
          stock_disponible?: number | null
          url_producto: string
          imagen_url?: string | null
          descripcion?: string | null
          fecha_extraccion?: string
          activo?: boolean
          fecha_creacion?: string
          fecha_actualizacion?: string
        }
        Update: {
          id_producto?: number
          nombre_producto?: string
          marca?: string | null
          modelo?: string | null
          sku?: string | null
          id_categoria?: number
          marketplace?: string
          id_seller?: number
          precio?: number
          precio_anterior?: number | null
          moneda?: string | null
          stock_disponible?: number | null
          url_producto?: string
          imagen_url?: string | null
          descripcion?: string | null
          fecha_extraccion?: string
          activo?: boolean
          fecha_creacion?: string
          fecha_actualizacion?: string
        }
      }
      productos_mapeados: {
        Row: {
          id_mapeo: number
          id_producto: number
          producto_base: boolean | null
          fecha_mapeo: string
        }
        Insert: {
          id_mapeo?: number
          id_producto: number
          producto_base?: boolean | null
          fecha_mapeo?: string
        }
        Update: {
          id_mapeo?: number
          id_producto?: number
          producto_base?: boolean | null
          fecha_mapeo?: string
        }
      }
      sellers: {
        Row: {
          id_seller: number
          nombre_seller: string
          marketplace: string
          calificacion: number | null
          numero_ventas: number | null
          url_seller: string | null
          activo: boolean
          fecha_creacion: string
          fecha_actualizacion: string
        }
        Insert: {
          id_seller?: number
          nombre_seller: string
          marketplace: string
          calificacion?: number | null
          numero_ventas?: number | null
          url_seller?: string | null
          activo?: boolean
          fecha_creacion?: string
          fecha_actualizacion?: string
        }
        Update: {
          id_seller?: number
          nombre_seller?: string
          marketplace?: string
          calificacion?: number | null
          numero_ventas?: number | null
          url_seller?: string | null
          activo?: boolean
          fecha_creacion?: string
          fecha_actualizacion?: string
        }
      }
      sources: {
        Row: {
          id: string
          page_id: string | null
          nombre: string
          url_origen: string | null
          config_publicacion: Json | null
          created_at: string | null
        }
        Insert: {
          id?: string
          page_id?: string | null
          nombre: string
          url_origen?: string | null
          config_publicacion?: Json | null
          created_at?: string | null
        }
        Update: {
          id?: string
          page_id?: string | null
          nombre?: string
          url_origen?: string | null
          config_publicacion?: Json | null
          created_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
