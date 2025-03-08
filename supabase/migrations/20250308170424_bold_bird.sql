/*
  # Creación de tablas para informes comparativos

  1. New Tables
    - `comparison_reports`
      - `id` (uuid, primary key)
      - `nombre` (text, required)
      - `user_id` (uuid, FK to auth.users)
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)
    
    - `comparison_report_products`
      - `id` (uuid, primary key)
      - `report_id` (uuid, FK to comparison_reports)
      - `producto_base_id` (integer, FK to productos_base)
      - `created_at` (timestamp with time zone)
  
  2. Security
    - Habilitar RLS en ambas tablas
    - Políticas para usuarios autenticados
*/

-- Verificar si la tabla comparison_reports existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_tables
        WHERE schemaname = 'public'
        AND tablename = 'comparison_reports'
    ) THEN
        -- Crear tabla de informes comparativos
        CREATE TABLE comparison_reports (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            nombre TEXT NOT NULL,
            user_id UUID NOT NULL,
            created_at TIMESTAMPTZ DEFAULT now(),
            updated_at TIMESTAMPTZ DEFAULT now()
        );

        -- Crear índice en user_id para mejorar rendimiento de consultas
        CREATE INDEX comparison_reports_user_id_idx ON comparison_reports(user_id);

        -- Habilitar RLS
        ALTER TABLE comparison_reports ENABLE ROW LEVEL SECURITY;

        -- Políticas para usuarios autenticados
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
    END IF;

    IF NOT EXISTS (
        SELECT FROM pg_tables
        WHERE schemaname = 'public'
        AND tablename = 'comparison_report_products'
    ) THEN
        -- Crear tabla de productos en informes
        CREATE TABLE comparison_report_products (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            report_id UUID NOT NULL,
            producto_base_id INTEGER NOT NULL,
            created_at TIMESTAMPTZ DEFAULT now(),
            FOREIGN KEY (report_id) REFERENCES comparison_reports(id) ON DELETE CASCADE
        );

        -- Crear índice en report_id para mejorar rendimiento
        CREATE INDEX comparison_report_products_report_id_idx ON comparison_report_products(report_id);

        -- Habilitar RLS
        ALTER TABLE comparison_report_products ENABLE ROW LEVEL SECURITY;

        -- Políticas para usuarios autenticados
        CREATE POLICY "Los usuarios pueden ver los productos de sus propios informes"
            ON comparison_report_products
            FOR SELECT
            TO authenticated
            USING (report_id IN (
                SELECT id FROM comparison_reports
                WHERE user_id = auth.uid()
            ));

        CREATE POLICY "Los usuarios pueden agregar productos a sus propios informes"
            ON comparison_report_products
            FOR INSERT
            TO authenticated
            WITH CHECK (report_id IN (
                SELECT id FROM comparison_reports
                WHERE user_id = auth.uid()
            ));

        CREATE POLICY "Los usuarios pueden eliminar productos de sus propios informes"
            ON comparison_report_products
            FOR DELETE
            TO authenticated
            USING (report_id IN (
                SELECT id FROM comparison_reports
                WHERE user_id = auth.uid()
            ));
    END IF;
END $$;
