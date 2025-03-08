/*
  # Migración para insertar datos de productos base y mapear con productos existentes

  1. Cambios en la estructura:
    - Insertar datos de muestra en la tabla productos_base
    - Actualizar los productos existentes para referenciar a sus productos base correspondientes
    - Crear relaciones entre productos para habilitar el mapeo de productos entre marketplaces

  2. Datos:
    - Se crean productos base para las principales categorías
    - Se establecen las relaciones con los productos existentes por marketplace
*/

-- Insertar productos base
INSERT INTO productos_base (nombre, marca, modelo, sku, id_categoria, descripcion, imagen_url)
VALUES
  ('Smart TV Samsung 50 Pulgadas UHD 4K', 'Samsung', 'Crystal UHD TU7000', 'SAMTV50TU7000', 1, 'Smart TV Samsung 50 pulgadas con resolución UHD 4K, tecnología Crystal Display y sistema operativo Tizen', 'https://images.samsung.com/is/image/samsung/p6pim/ar/un50au7000gczb/gallery/ar-uhd-au7000-un50au7000gczb-thumb-530921119'),
  ('Nevera Samsung Side by Side', 'Samsung', 'RS27T5200S9', 'SAMNEV27T5200', 2, 'Nevera Samsung Side by Side con dispensador de agua y hielo, 27 pies cúbicos', 'https://images.samsung.com/is/image/samsung/p6pim/co/rs27t5200s9-co/gallery/co-side-by-side-rs27t5200s9-co-thumb-367712427'),
  ('iPhone 13 Pro Max', 'Apple', '13 Pro Max', 'APLIPH13PROMAX', 3, 'iPhone 13 Pro Max con 256GB, pantalla Super Retina XDR de 6.7 pulgadas', 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-13-pro-max-gold-select?wid=940&hei=1112&fmt=png-alpha&.v=1645552346280'),
  ('Lavadora Whirlpool Carga Frontal', 'Whirlpool', 'WFW5620HW', 'WHIRL5620HW', 2, 'Lavadora de carga frontal Whirlpool con capacidad de 20 kg y tecnología de lavado inteligente', 'https://www.whirlpool.com.co/medias/?context=bWFzdGVyfGltYWdlc3wxMDY3NjV8aW1hZ2UvanBlZ3xhR1JoTDJnMVlTOW9OVGt6TDJneFlTOW9PVFl6THpFeU9EWTFNVFV3TURNNE5qWXpNQzV5WkhBfGNmMDQzOTE1MDdiNzlkMTJmMDc1MmNjY2I2NjRhODBlYjYzNDAzY2EzNmU2N2M5OThkODdjNzUzZWJmODVjOGY'),
  ('MacBook Pro 16 pulgadas', 'Apple', 'MacBook Pro 16', 'APLMBP16M1', 3, 'MacBook Pro con pantalla de 16 pulgadas, chip M1 Pro, 16GB RAM, 512GB SSD', 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp16-spacegray-select-202110?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1632788574000'),
  ('Licuadora Oster Reversible', 'Oster', 'BLSTMG-R', 'OSTBLSTMGR', 2, 'Licuadora Oster con tecnología reversible, vaso de vidrio y 8 velocidades', 'https://falabella.scene7.com/is/image/FalabellaCO/3180571_1?wid=800&hei=800&qlt=70'),
  ('PlayStation 5', 'Sony', 'PS5 Digital Edition', 'SONYPS5DIG', 4, 'Consola PlayStation 5 Digital Edition, sin unidad de disco, control DualSense', 'https://gmedia.playstation.com/is/image/SIEPDC/ps5-product-thumbnail-01-en-14sep21?$facebook$'),
  ('Olla Arrocera Oster', 'Oster', 'CKSTRC61K', 'OSTCKSTRC61K', 2, 'Olla arrocera de 1.8 litros, función de mantener caliente', 'https://falabella.scene7.com/is/image/FalabellaCO/2705357_1?wid=800&hei=800&qlt=70'),
  ('AirPods Pro', 'Apple', 'MWP22AM/A', 'APLAIRPODSPRO', 3, 'Audífonos inalámbricos con cancelación activa de ruido y resistencia al agua', 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MWP22?wid=2000&hei=2000&fmt=jpeg&qlt=95&.v=1591634795000'),
  ('Cafetera Nespresso Essenza Mini', 'Nespresso', 'Essenza Mini', 'NESPMINI', 2, 'Cafetera de cápsulas compacta con sistema de presión de 19 bares', 'https://www.nespresso.com/ecom/medias/sys_master/public/12408244461598/M115-ESSENZA-MINI-C30-LIMOUSINE-BLACK-Vertuo-Next-Deluxe-Dark-Chrome-2000x2000.png')
ON CONFLICT DO NOTHING;

-- Actualizar productos existentes para referenciar sus productos base
-- Asumiendo que tenemos productos en diferentes marketplaces para los productos base creados
-- Esta es una simulación pues no tenemos IDs exactos - en producción usaríamos IDs reales

-- Supongamos que tenemos productos existentes y los vinculamos a sus productos base
-- Cuando se implementa en producción, estos IDs deben ser reales
WITH producto_base_mapping AS (
  SELECT 
    id_producto_base,
    nombre
  FROM productos_base
)
UPDATE productos p
SET id_producto_base = pbm.id_producto_base
FROM producto_base_mapping pbm
WHERE p.nombre_producto LIKE '%' || pbm.nombre || '%';

-- Insertar datos de ejemplo directamente relacionando productos y productos_base
-- Estos son ejemplos de productos para marketplace Olímpica
INSERT INTO productos (
  nombre_producto, 
  marca, 
  modelo, 
  sku, 
  id_categoria, 
  marketplace, 
  id_seller, 
  precio, 
  precio_anterior, 
  stock_disponible, 
  url_producto, 
  imagen_url, 
  id_producto_base
)
SELECT 
  pb.nombre, 
  pb.marca, 
  pb.modelo, 
  pb.sku || '-OLI', 
  pb.id_categoria, 
  'Olímpica', 
  (SELECT id_seller FROM sellers WHERE nombre_seller = 'Olímpica Electro' LIMIT 1),
  CASE 
    WHEN pb.nombre LIKE '%TV%' THEN 1799900
    WHEN pb.nombre LIKE '%Nevera%' THEN 3999900
    WHEN pb.nombre LIKE '%iPhone%' THEN 4999900
    WHEN pb.nombre LIKE '%Lavadora%' THEN 2199900
    WHEN pb.nombre LIKE '%MacBook%' THEN 8999900
    WHEN pb.nombre LIKE '%Licuadora%' THEN 329900
    WHEN pb.nombre LIKE '%PlayStation%' THEN 2499900
    WHEN pb.nombre LIKE '%Olla%' THEN 129900
    WHEN pb.nombre LIKE '%AirPods%' THEN 899900
    WHEN pb.nombre LIKE '%Cafetera%' THEN 649900
    ELSE 999900
  END,
  CASE 
    WHEN pb.nombre LIKE '%TV%' THEN 1999900
    WHEN pb.nombre LIKE '%Nevera%' THEN 4199900
    WHEN pb.nombre LIKE '%iPhone%' THEN 5499900
    WHEN pb.nombre LIKE '%Lavadora%' THEN 2399900
    WHEN pb.nombre LIKE '%MacBook%' THEN 9499900
    WHEN pb.nombre LIKE '%Licuadora%' THEN 379900
    WHEN pb.nombre LIKE '%PlayStation%' THEN 2699900
    WHEN pb.nombre LIKE '%Olla%' THEN 149900
    WHEN pb.nombre LIKE '%AirPods%' THEN 999900
    WHEN pb.nombre LIKE '%Cafetera%' THEN 699900
    ELSE 1099900
  END,
  FLOOR(RANDOM() * 30) + 1,
  'https://www.olimpica.com/producto/' || LOWER(REPLACE(pb.nombre, ' ', '-')),
  pb.imagen_url,
  pb.id_producto_base
FROM productos_base pb
WHERE NOT EXISTS (
  SELECT 1 FROM productos 
  WHERE id_producto_base = pb.id_producto_base 
  AND marketplace = 'Olímpica'
);

-- Insertar productos para marketplace Mercado Libre
INSERT INTO productos (
  nombre_producto, 
  marca, 
  modelo, 
  sku, 
  id_categoria, 
  marketplace, 
  id_seller, 
  precio, 
  precio_anterior, 
  stock_disponible, 
  url_producto, 
  imagen_url, 
  id_producto_base
)
SELECT 
  pb.nombre, 
  pb.marca, 
  pb.modelo, 
  pb.sku || '-ML', 
  pb.id_categoria, 
  'Mercado Libre', 
  (SELECT id_seller FROM sellers WHERE nombre_seller = 'MercadoLibre Oficial' LIMIT 1),
  CASE 
    WHEN pb.nombre LIKE '%TV%' THEN 1849900
    WHEN pb.nombre LIKE '%Nevera%' THEN 4099900
    WHEN pb.nombre LIKE '%iPhone%' THEN 4899900
    WHEN pb.nombre LIKE '%Lavadora%' THEN 2099900
    WHEN pb.nombre LIKE '%MacBook%' THEN 8799900
    WHEN pb.nombre LIKE '%Licuadora%' THEN 319900
    WHEN pb.nombre LIKE '%PlayStation%' THEN 2399900
    WHEN pb.nombre LIKE '%Olla%' THEN 119900
    WHEN pb.nombre LIKE '%AirPods%' THEN 879900
    WHEN pb.nombre LIKE '%Cafetera%' THEN 629900
    ELSE 979900
  END,
  CASE 
    WHEN pb.nombre LIKE '%TV%' THEN 1999900
    WHEN pb.nombre LIKE '%Nevera%' THEN 4299900
    WHEN pb.nombre LIKE '%iPhone%' THEN 5299900
    WHEN pb.nombre LIKE '%Lavadora%' THEN 2299900
    WHEN pb.nombre LIKE '%MacBook%' THEN 9299900
    WHEN pb.nombre LIKE '%Licuadora%' THEN 369900
    WHEN pb.nombre LIKE '%PlayStation%' THEN 2599900
    WHEN pb.nombre LIKE '%Olla%' THEN 139900
    WHEN pb.nombre LIKE '%AirPods%' THEN 979900
    WHEN pb.nombre LIKE '%Cafetera%' THEN 679900
    ELSE 1059900
  END,
  FLOOR(RANDOM() * 30) + 1,
  'https://www.mercadolibre.com.co/producto/' || LOWER(REPLACE(pb.nombre, ' ', '-')),
  pb.imagen_url,
  pb.id_producto_base
FROM productos_base pb
WHERE NOT EXISTS (
  SELECT 1 FROM productos 
  WHERE id_producto_base = pb.id_producto_base 
  AND marketplace = 'Mercado Libre'
);

-- Insertar productos para marketplace Alkosto
INSERT INTO productos (
  nombre_producto, 
  marca, 
  modelo, 
  sku, 
  id_categoria, 
  marketplace, 
  id_seller, 
  precio, 
  precio_anterior, 
  stock_disponible, 
  url_producto, 
  imagen_url, 
  id_producto_base
)
SELECT 
  pb.nombre, 
  pb.marca, 
  pb.modelo, 
  pb.sku || '-ALK', 
  pb.id_categoria, 
  'Alkosto', 
  (SELECT id_seller FROM sellers WHERE nombre_seller = 'Alkosto Oficial' LIMIT 1),
  CASE 
    WHEN pb.nombre LIKE '%TV%' THEN 1899900
    WHEN pb.nombre LIKE '%Nevera%' THEN 4199900
    WHEN pb.nombre LIKE '%iPhone%' THEN 5199900
    WHEN pb.nombre LIKE '%Lavadora%' THEN 2299900
    WHEN pb.nombre LIKE '%MacBook%' THEN 9299900
    WHEN pb.nombre LIKE '%Licuadora%' THEN 349900
    WHEN pb.nombre LIKE '%PlayStation%' THEN 2599900
    WHEN pb.nombre LIKE '%Olla%' THEN 134900
    WHEN pb.nombre LIKE '%AirPods%' THEN 919900
    WHEN pb.nombre LIKE '%Cafetera%' THEN 679900
    ELSE 1019900
  END,
  CASE 
    WHEN pb.nombre LIKE '%TV%' THEN 2099900
    WHEN pb.nombre LIKE '%Nevera%' THEN 4399900
    WHEN pb.nombre LIKE '%iPhone%' THEN 5599900
    WHEN pb.nombre LIKE '%Lavadora%' THEN 2499900
    WHEN pb.nombre LIKE '%MacBook%' THEN 9799900
    WHEN pb.nombre LIKE '%Licuadora%' THEN 399900
    WHEN pb.nombre LIKE '%PlayStation%' THEN 2799900
    WHEN pb.nombre LIKE '%Olla%' THEN 154900
    WHEN pb.nombre LIKE '%AirPods%' THEN 1019900
    WHEN pb.nombre LIKE '%Cafetera%' THEN 719900
    ELSE 1119900
  END,
  FLOOR(RANDOM() * 30) + 1,
  'https://www.alkosto.com/producto/' || LOWER(REPLACE(pb.nombre, ' ', '-')),
  pb.imagen_url,
  pb.id_producto_base
FROM productos_base pb
WHERE NOT EXISTS (
  SELECT 1 FROM productos 
  WHERE id_producto_base = pb.id_producto_base 
  AND marketplace = 'Alkosto'
);

-- Añadir características a los productos
-- Usamos el primer producto de cada producto base para agregar características
DO $$
DECLARE
    v_product_id INTEGER;
BEGIN
    -- Smart TV Samsung
    SELECT id_producto INTO v_product_id FROM productos WHERE nombre_producto LIKE '%Smart TV Samsung%' LIMIT 1;
    IF v_product_id IS NOT NULL THEN
        INSERT INTO caracteristicas (id_producto, nombre_caracteristica, valor_caracteristica)
        VALUES 
            (v_product_id, 'Tamaño de pantalla', '50"'),
            (v_product_id, 'Resolución', 'UHD 4K'),
            (v_product_id, 'Smart TV', 'Sí'),
            (v_product_id, 'Sistema operativo', 'Tizen'),
            (v_product_id, 'HDMI', '3');
    END IF;

    -- Nevera Samsung
    SELECT id_producto INTO v_product_id FROM productos WHERE nombre_producto LIKE '%Nevera Samsung%' LIMIT 1;
    IF v_product_id IS NOT NULL THEN
        INSERT INTO caracteristicas (id_producto, nombre_caracteristica, valor_caracteristica)
        VALUES 
            (v_product_id, 'Capacidad', '27 pies cúbicos'),
            (v_product_id, 'Dispensador', 'Agua y hielo'),
            (v_product_id, 'Tipo', 'Side by Side'),
            (v_product_id, 'Color', 'Acero inoxidable');
    END IF;

    -- iPhone
    SELECT id_producto INTO v_product_id FROM productos WHERE nombre_producto LIKE '%iPhone%' LIMIT 1;
    IF v_product_id IS NOT NULL THEN
        INSERT INTO caracteristicas (id_producto, nombre_caracteristica, valor_caracteristica)
        VALUES 
            (v_product_id, 'Memoria RAM', '6GB'),
            (v_product_id, 'Almacenamiento', '256GB'),
            (v_product_id, 'Tamaño de pantalla', '6.7"'),
            (v_product_id, 'Cámaras', 'Triple 12MP');
    END IF;

    -- Otros productos...
END $$;
