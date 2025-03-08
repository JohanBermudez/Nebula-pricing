/*
  # Inserción de historial de precios y stock

  1. Historial de Precios
    - Registro histórico de precios por producto
    - Para análisis de tendencias y comparativas
  
  2. Historial de Stock
    - Registro histórico de disponibilidad
    - Para análisis de tendencias de inventario
*/

-- Función para generar datos históricos de precios
DO $$
DECLARE
  product_record RECORD;
  current_date DATE := CURRENT_DATE - INTERVAL '90 days';
  end_date DATE := CURRENT_DATE;
  current_price NUMERIC;
  price_variation NUMERIC;
  record_date TIMESTAMP;
BEGIN
  -- Para cada producto
  FOR product_record IN SELECT id_producto, precio FROM productos
  LOOP
    current_price := product_record.precio * 0.9; -- Comenzamos con un precio 10% menor
    
    -- Generar datos para los últimos 90 días
    WHILE current_date <= end_date LOOP
      -- Calcular variación aleatoria de precio (entre -2% y +3%)
      price_variation := current_price * (random() * 0.05 - 0.02);
      current_price := current_price + price_variation;
      
      -- Asegurarnos de que el precio no es negativo
      IF current_price < 0 THEN
        current_price := product_record.precio * 0.5; -- Mínimo 50% del precio actual
      END IF;
      
      -- Generar fecha-hora aleatoria para ese día
      record_date := current_date + (random() * INTERVAL '24 hours');
      
      -- Insertar datos de precio
      INSERT INTO historial_precios (
        id_producto, 
        precio, 
        moneda, 
        fecha_registro
      ) VALUES (
        product_record.id_producto,
        ROUND(current_price::numeric, 0),
        'COP',
        record_date
      );
      
      -- Avanzar a la siguiente fecha (cada 3-7 días)
      current_date := current_date + (3 + floor(random() * 5))::integer * INTERVAL '1 day';
    END LOOP;
    
    -- Reiniciar para el siguiente producto
    current_date := CURRENT_DATE - INTERVAL '90 days';
  END LOOP;
END $$;

-- Función para generar datos históricos de stock
DO $$
DECLARE
  product_record RECORD;
  current_date DATE := CURRENT_DATE - INTERVAL '90 days';
  end_date DATE := CURRENT_DATE;
  current_stock INTEGER;
  stock_variation INTEGER;
  record_date TIMESTAMP;
BEGIN
  -- Para cada producto
  FOR product_record IN SELECT id_producto, stock_disponible FROM productos
  LOOP
    current_stock := product_record.stock_disponible * 1.2; -- Comenzamos con un 20% más de stock
    
    -- Generar datos para los últimos 90 días
    WHILE current_date <= end_date LOOP
      -- Calcular variación aleatoria de stock (entre -10% y +5%)
      stock_variation := floor(current_stock * (random() * 0.15 - 0.1));
      current_stock := current_stock + stock_variation;
      
      -- Asegurarnos de que el stock no es negativo
      IF current_stock < 0 THEN
        current_stock := 0;
      END IF;
      
      -- Generar fecha-hora aleatoria para ese día
      record_date := current_date + (random() * INTERVAL '24 hours');
      
      -- Insertar datos de stock
      INSERT INTO historial_stock (
        id_producto, 
        stock_disponible, 
        fecha_registro
      ) VALUES (
        product_record.id_producto,
        current_stock,
        record_date
      );
      
      -- Avanzar a la siguiente fecha (cada 5-10 días)
      current_date := current_date + (5 + floor(random() * 6))::integer * INTERVAL '1 day';
    END LOOP;
    
    -- Reiniciar para el siguiente producto
    current_date := CURRENT_DATE - INTERVAL '90 days';
  END LOOP;
END $$;
