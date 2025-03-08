/*
  # Inserción de sellers (vendedores)

  1. Sellers
    - Principales sellers/marketplaces colombianos para comparación
    - Olimpica como seller principal
    - Datos de calificación y número de ventas aproximados
*/

-- Insertar sellers principales
INSERT INTO sellers (nombre_seller, marketplace, calificacion, numero_ventas, url_seller, activo, fecha_creacion, fecha_actualizacion)
VALUES 
  ('Olimpica Oficial', 'Olímpica', 4.7, 15000, 'https://www.olimpica.com/', true, now(), now()),
  ('Olimpica Electro', 'Olímpica', 4.6, 8500, 'https://www.olimpica.com/tecnologia', true, now(), now()),
  ('Olimpica Hogar', 'Olímpica', 4.5, 7200, 'https://www.olimpica.com/hogar', true, now(), now()),
  ('MercadoLibre Oficial', 'Mercado Libre', 4.8, 42000, 'https://www.mercadolibre.com.co/tiendas-oficiales', true, now(), now()),
  ('Falabella CO', 'Falabella', 4.4, 31000, 'https://www.falabella.com.co', true, now(), now()),
  ('Éxito.com', 'Éxito', 4.6, 28000, 'https://www.exito.com', true, now(), now()),
  ('Alkosto Oficial', 'Alkosto', 4.5, 25000, 'https://www.alkosto.com', true, now(), now()),
  ('Jumbo Colombia', 'Jumbo', 4.3, 18000, 'https://www.tiendasjumbo.co', true, now(), now()),
  ('Amazon Colombia', 'Amazon', 4.7, 36000, 'https://www.amazon.com', true, now(), now()),
  ('Homecenter', 'Homecenter', 4.5, 22000, 'https://www.homecenter.com.co', true, now(), now()),
  ('Corner Shop', 'Corner Shop', 4.2, 9500, 'https://www.cornershopapp.com', true, now(), now()),
  ('Linio Colombia', 'Linio', 4.0, 15000, 'https://www.linio.com.co', true, now(), now());
