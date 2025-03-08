/*
  # Inserción de alertas y notificaciones

  1. Alertas
    - Configuración de alertas para monitoreo de precios y stock
    - Diferentes tipos de condiciones (mayor que, menor que, etc.)
  
  2. Notificaciones
    - Registros de notificaciones generadas
    - Historial de alertas activadas
*/

-- Insertar alertas de precio
INSERT INTO alertas (
  tipo_alerta,
  id_producto,
  condicion,
  valor_referencia,
  activa,
  fecha_creacion,
  fecha_actualizacion
)
SELECT
  'precio',
  p.id_producto,
  CASE floor(random() * 3)
    WHEN 0 THEN 'menor_que'
    WHEN 1 THEN 'mayor_que'
    ELSE 'igual_a'
  END,
  CASE 
    WHEN random() < 0.5 THEN p.precio * 0.9 -- 10% menos
    ELSE p.precio * 1.1 -- 10% más
  END,
  true,
  now(),
  now()
FROM productos p
WHERE p.marketplace = 'Olímpica' -- Solo alertas para productos de Olimpica
LIMIT 6; -- Creamos 6 alertas de precio

-- Insertar alertas de stock
INSERT INTO alertas (
  tipo_alerta,
  id_producto,
  condicion,
  valor_referencia,
  activa,
  fecha_creacion,
  fecha_actualizacion
)
SELECT
  'stock',
  p.id_producto,
  'menor_que',
  5, -- Alertar cuando el stock sea menor a 5
  true,
  now(),
  now()
FROM productos p
WHERE p.marketplace = 'Olímpica' -- Solo alertas para productos de Olimpica
LIMIT 4; -- Creamos 4 alertas de stock

-- Insertar alertas de comparación
INSERT INTO alertas (
  tipo_alerta,
  id_producto,
  id_producto_comparado,
  condicion,
  valor_referencia,
  porcentaje,
  activa,
  fecha_creacion,
  fecha_actualizacion
)
SELECT
  'precio',
  p1.id_producto,
  p2.id_producto,
  'porcentaje_diferencia',
  0, -- No aplica para porcentaje
  5, -- 5% de diferencia
  true,
  now(),
  now()
FROM 
  productos p1
JOIN 
  productos p2 ON p1.nombre_producto = p2.nombre_producto AND p1.marketplace = 'Olímpica' AND p2.marketplace != 'Olímpica'
LIMIT 5; -- Creamos 5 alertas de comparación

-- Insertar notificaciones de alertas (precio cayó)
INSERT INTO notificaciones_alertas (
  id_alerta,
  mensaje,
  leida,
  fecha_notificacion
)
SELECT
  a.id_alerta,
  CASE a.tipo_alerta
    WHEN 'precio' THEN 'El precio de ' || p.nombre_producto || ' ha bajado a $' || (p.precio * 0.9)::integer || ' COP (antes $' || p.precio || ' COP)'
    ELSE 'El stock de ' || p.nombre_producto || ' es bajo: solo quedan ' || (p.stock_disponible * 0.2)::integer || ' unidades'
  END,
  CASE WHEN random() < 0.7 THEN true ELSE false END, -- 70% leídas
  now() - (random() * INTERVAL '10 days')
FROM alertas a
JOIN productos p ON a.id_producto = p.id_producto
LIMIT 7;

-- Insertar notificaciones de alertas (precio subió)
INSERT INTO notificaciones_alertas (
  id_alerta,
  mensaje,
  leida,
  fecha_notificacion
)
SELECT
  a.id_alerta,
  'El precio de ' || p.nombre_producto || ' en la competencia ha subido a $' || (p.precio * 1.15)::integer || ' COP. Oportunidad de ventaja competitiva.',
  CASE WHEN random() < 0.5 THEN true ELSE false END, -- 50% leídas
  now() - (random() * INTERVAL '5 days')
FROM alertas a
JOIN productos p ON a.id_producto = p.id_producto
WHERE a.condicion = 'porcentaje_diferencia' -- Solo para alertas de comparación
LIMIT 5;

-- Actualizar algunas alertas con última notificación
UPDATE alertas
SET ultima_notificacion = (
  SELECT fecha_notificacion 
  FROM notificaciones_alertas 
  WHERE alertas.id_alerta = notificaciones_alertas.id_alerta 
  ORDER BY fecha_notificacion DESC 
  LIMIT 1
)
WHERE EXISTS (
  SELECT 1 
  FROM notificaciones_alertas 
  WHERE alertas.id_alerta = notificaciones_alertas.id_alerta
);
