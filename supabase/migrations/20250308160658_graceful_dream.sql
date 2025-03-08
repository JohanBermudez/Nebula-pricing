/*
  # Implementación de mapeo de productos

  1. Nuevas Tablas
    - `productos_base` - Almacena información base de productos únicos
      - `id_producto_base` (uuid, primary key)
      - `nombre` (text, not null)
      - `marca` (text)
      - `modelo` (text)
      - `id_categoria` (integer, foreign key)
      - `descripcion` (text)
      - `imagen_url` (text)
      - `activo` (boolean, default true)
      - `fecha_creacion` (timestamp)
      - `fecha_actualizacion` (timestamp)
  
  2. Modificaciones
    - Ajustar la tabla `productos` para referenciar a `productos_base`
    - Crear políticas para las nuevas tablas
    - Añadir índices para mejor rendimiento
*/

-- Crear tabla de productos base
CREATE TABLE IF NOT EXISTS productos_base (
  id_producto_base SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  marca TEXT,
  modelo TEXT,
  sku TEXT,
  id_categoria INTEGER REFERENCES categorias(id_categoria),
  descripcion TEXT,
  imagen_url TEXT,
  activo BOOLEAN DEFAULT TRUE,
  fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  fecha_actualizacion TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_productos_base_categoria ON productos_base(id_categoria);
CREATE INDEX IF NOT EXISTS idx_productos_base_nombre_marca ON productos_base(nombre, marca, modelo);

-- Agregar columna a productos para referenciar al producto base
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'productos' AND column_name = 'id_producto_base'
  ) THEN
    ALTER TABLE productos ADD COLUMN id_producto_base INTEGER REFERENCES productos_base(id_producto_base);
  END IF;
END $$;

-- Crear índice para la relación
CREATE INDEX IF NOT EXISTS idx_productos_producto_base ON productos(id_producto_base);

-- Habilitar RLS
ALTER TABLE productos_base ENABLE ROW LEVEL SECURITY;

-- Crear políticas
CREATE POLICY "Los productos base son visibles para todos"
  ON productos_base
  FOR SELECT
  TO public
  USING (true);
