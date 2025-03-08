/*
  # Inserción de productos mapeados

  1. Mapear productos idénticos
    - Relacionar el mismo producto en diferentes marketplaces
    - Definir productos base para comparaciones
*/

-- Mapear los mismos productos entre marketplaces
WITH product_groups AS (
  SELECT 
    nombre_producto, 
    marca, 
    modelo,
    MIN(id_producto) AS base_product_id
  FROM productos
  GROUP BY nombre_producto, marca, modelo
  HAVING COUNT(*) > 1
)
INSERT INTO productos_mapeados (
  id_producto,
  producto_base,
  fecha_mapeo
)
SELECT 
  p.id_producto,
  CASE 
    WHEN p.id_producto = pg.base_product_id THEN true
    ELSE false
  END,
  now()
FROM 
  productos p
JOIN 
  product_groups pg ON p.nombre_producto = pg.nombre_producto AND p.marca = pg.marca AND p.modelo = pg.modelo;
