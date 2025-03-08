/*
  # Agregar tablas para informes comparativos personalizados

  1. Nuevas Tablas
    - `comparison_reports`
      - `id` (uuid, clave primaria)
      - `nombre` (text, nombre personalizado del informe)
      - `user_id` (uuid, referencia a la tabla de autenticación)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `comparison_report_products`
      - `id` (uuid, clave primaria)
      - `report_id` (uuid, referencia a comparison_reports)
      - `producto_base_id` (integer, referencia a productos_base)
      - `created_at` (timestamp)
  
  2. Seguridad
    - Habilitar RLS en ambas tablas
    - Agregar políticas para que los usuarios solo puedan acceder a sus propios informes
*/

-- Crear tabla para los informes comparativos
CREATE TABLE IF NOT EXISTS comparison_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar RLS para comparison_reports
ALTER TABLE comparison_reports ENABLE ROW LEVEL SECURITY;

-- Crear políticas para comparison_reports
CREATE POLICY "Los usuarios pueden ver sus propios informes"
  ON comparison_reports
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden crear sus propios informes"
  ON comparison_reports
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden actualizar sus propios informes"
  ON comparison_reports
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden eliminar sus propios informes"
  ON comparison_reports
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Crear tabla para los productos en informes comparativos
CREATE TABLE IF NOT EXISTS comparison_report_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id uuid NOT NULL REFERENCES comparison_reports(id) ON DELETE CASCADE,
  producto_base_id integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Habilitar RLS para comparison_report_products
ALTER TABLE comparison_report_products ENABLE ROW LEVEL SECURITY;

-- Crear políticas para comparison_report_products
CREATE POLICY "Los usuarios pueden ver los productos de sus propios informes"
  ON comparison_report_products
  FOR SELECT
  TO authenticated
  USING (report_id IN (
    SELECT id 
    FROM comparison_reports 
    WHERE user_id = auth.uid()
  ));

CREATE POLICY "Los usuarios pueden agregar productos a sus propios informes"
  ON comparison_report_products
  FOR INSERT
  TO authenticated
  WITH CHECK (report_id IN (
    SELECT id 
    FROM comparison_reports 
    WHERE user_id = auth.uid()
  ));

CREATE POLICY "Los usuarios pueden eliminar productos de sus propios informes"
  ON comparison_report_products
  FOR DELETE
  TO authenticated
  USING (report_id IN (
    SELECT id 
    FROM comparison_reports 
    WHERE user_id = auth.uid()
  ));

-- Crear índices para mejorar el rendimiento
CREATE INDEX ON comparison_report_products (report_id);
CREATE INDEX ON comparison_reports (user_id);
