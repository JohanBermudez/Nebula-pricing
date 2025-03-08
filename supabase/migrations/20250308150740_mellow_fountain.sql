/*
  # Inserción de características de productos

  1. Características de Productos
    - Detalles específicos para cada producto
    - Características como tamaño, color, especificaciones técnicas, etc.
*/

-- Características Smart TV Samsung
INSERT INTO caracteristicas (id_producto, nombre_caracteristica, valor_caracteristica, fecha_creacion, fecha_actualizacion)
SELECT 
  id_producto,
  caracteristica,
  valor,
  now(),
  now()
FROM (
  SELECT 
    p.id_producto,
    unnest(ARRAY['Tamaño de pantalla', 'Resolución', 'Tecnología', 'Sistema operativo', 'Conectividad', 'Puertos HDMI', 'Puertos USB', 'Potencia de sonido']) AS caracteristica,
    unnest(ARRAY['50 pulgadas', 'UHD 4K (3840 x 2160)', 'LED', 'Tizen', 'Wi-Fi, Bluetooth, AirPlay 2', '3', '2', '20W']) AS valor
  FROM productos p
  WHERE p.nombre_producto = 'Smart TV Samsung 50 Pulgadas UHD 4K'
  LIMIT 1
) t;

-- Características Smartphone Samsung
INSERT INTO caracteristicas (id_producto, nombre_caracteristica, valor_caracteristica, fecha_creacion, fecha_actualizacion)
SELECT 
  id_producto,
  caracteristica,
  valor,
  now(),
  now()
FROM (
  SELECT 
    p.id_producto,
    unnest(ARRAY['Pantalla', 'Procesador', 'Memoria RAM', 'Almacenamiento', 'Cámara principal', 'Cámara frontal', 'Batería', 'Sistema operativo']) AS caracteristica,
    unnest(ARRAY['Super AMOLED 6.4"', 'Exynos 1380 Octa-core', '8GB', '128GB', '50MP + 12MP + 5MP', '32MP', '5000mAh', 'Android 13']) AS valor
  FROM productos p
  WHERE p.nombre_producto = 'Smartphone Samsung Galaxy A54'
  LIMIT 1
) t;

-- Características Laptop HP
INSERT INTO caracteristicas (id_producto, nombre_caracteristica, valor_caracteristica, fecha_creacion, fecha_actualizacion)
SELECT 
  id_producto,
  caracteristica,
  valor,
  now(),
  now()
FROM (
  SELECT 
    p.id_producto,
    unnest(ARRAY['Pantalla', 'Procesador', 'Memoria RAM', 'Almacenamiento', 'Tarjeta gráfica', 'Sistema operativo', 'Batería', 'Peso']) AS caracteristica,
    unnest(ARRAY['15.6" FHD IPS', 'AMD Ryzen 5 5500U', '8GB DDR4', '512GB SSD', 'AMD Radeon Graphics', 'Windows 11 Home', '41Wh hasta 8 horas', '1.7 kg']) AS valor
  FROM productos p
  WHERE p.nombre_producto = 'Laptop HP Pavilion 15.6"'
  LIMIT 1
) t;

-- Características Licuadora Oster
INSERT INTO caracteristicas (id_producto, nombre_caracteristica, valor_caracteristica, fecha_creacion, fecha_actualizacion)
SELECT 
  id_producto,
  caracteristica,
  valor,
  now(),
  now()
FROM (
  SELECT 
    p.id_producto,
    unnest(ARRAY['Capacidad', 'Material del vaso', 'Potencia', 'Velocidades', 'Función pulso', 'Cuchillas', 'Voltaje', 'Garantía']) AS caracteristica,
    unnest(ARRAY['1.5 litros', 'Vidrio', '600W', '3 velocidades', 'Sí', 'Acero inoxidable', '110V', '1 año']) AS valor
  FROM productos p
  WHERE p.nombre_producto = 'Licuadora Oster Clásica'
  LIMIT 1
) t;

-- Características Juego de Ollas
INSERT INTO caracteristicas (id_producto, nombre_caracteristica, valor_caracteristica, fecha_creacion, fecha_actualizacion)
SELECT 
  id_producto,
  caracteristica,
  valor,
  now(),
  now()
FROM (
  SELECT 
    p.id_producto,
    unnest(ARRAY['Piezas incluidas', 'Material', 'Antiadherente', 'Apto para', 'Color', 'Lavado', 'Incluye', 'Garantía']) AS caracteristica,
    unnest(ARRAY['7 piezas', 'Aluminio', 'Sí', 'Todo tipo de cocinas', 'Negro', 'Lavavajillas', '3 ollas con tapa, 1 sartén', '1 año']) AS valor
  FROM productos p
  WHERE p.nombre_producto = 'Juego de Ollas Imusa'
  LIMIT 1
) t;

-- Características Arroz Diana
INSERT INTO caracteristicas (id_producto, nombre_caracteristica, valor_caracteristica, fecha_creacion, fecha_actualizacion)
SELECT 
  id_producto,
  caracteristica,
  valor,
  now(),
  now()
FROM (
  SELECT 
    p.id_producto,
    unnest(ARRAY['Peso neto', 'Tipo de arroz', 'Origen', 'Fortificado', 'Tiempo de cocción', 'Rendimiento', 'Conservación', 'Vida útil']) AS caracteristica,
    unnest(ARRAY['5 kg', 'Blanco tradicional', 'Colombia', 'Con vitaminas y minerales', '25 minutos', 'Aproximadamente 30 porciones', 'Lugar fresco y seco', '12 meses']) AS valor
  FROM productos p
  WHERE p.nombre_producto = 'Arroz Diana Tradicional 5kg'
  LIMIT 1
) t;

-- Características Leche Alpina
INSERT INTO caracteristicas (id_producto, nombre_caracteristica, valor_caracteristica, fecha_creacion, fecha_actualizacion)
SELECT 
  id_producto,
  caracteristica,
  valor,
  now(),
  now()
FROM (
  SELECT 
    p.id_producto,
    unnest(ARRAY['Contenido', 'Tipo de leche', 'Presentación', 'Proceso', 'Fortificada', 'Contenido graso', 'Conservación', 'Vida útil']) AS caracteristica,
    unnest(ARRAY['6 bolsas x 1.1L', 'Entera', 'Bolsa', 'Pasteurizada y homogeneizada', 'Con vitaminas A y D', '3%', 'Refrigeración', '15 días cerrada']) AS valor
  FROM productos p
  WHERE p.nombre_producto = 'Leche Alpina Entera 6x1.1L'
  LIMIT 1
) t;

-- Características Coca-Cola
INSERT INTO caracteristicas (id_producto, nombre_caracteristica, valor_caracteristica, fecha_creacion, fecha_actualizacion)
SELECT 
  id_producto,
  caracteristica,
  valor,
  now(),
  now()
FROM (
  SELECT 
    p.id_producto,
    unnest(ARRAY['Contenido', 'Tipo de bebida', 'Sabor', 'Presentación', 'Calorías', 'Azúcar', 'Refrigeración', 'Vida útil']) AS caracteristica,
    unnest(ARRAY['4 botellas x 2.5L', 'Gaseosa', 'Original', 'Botella plástica', '420 kcal por litro', '106g por litro', 'Recomendada', '6 meses cerrada']) AS valor
  FROM productos p
  WHERE p.nombre_producto = 'Coca-Cola Original 2.5L x 4'
  LIMIT 1
) t;

-- Características Whisky Old Parr
INSERT INTO caracteristicas (id_producto, nombre_caracteristica, valor_caracteristica, fecha_creacion, fecha_actualizacion)
SELECT 
  id_producto,
  caracteristica,
  valor,
  now(),
  now()
FROM (
  SELECT 
    p.id_producto,
    unnest(ARRAY['Contenido', 'Tipo', 'Añejamiento', 'Origen', 'Graduación alcohólica', 'Sabor', 'Aroma', 'Servido']) AS caracteristica,
    unnest(ARRAY['750 ml', 'Whisky Escocés Blend', '12 años', 'Escocia', '40%', 'Frutas secas, miel y roble', 'Vainilla, nueces y especias', 'Solo o con hielo']) AS valor
  FROM productos p
  WHERE p.nombre_producto = 'Whisky Old Parr 12 años 750ml'
  LIMIT 1
) t;
