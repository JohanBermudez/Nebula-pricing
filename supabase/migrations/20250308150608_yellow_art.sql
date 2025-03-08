/*
  # Inserción de categorías para productos

  1. Categorías
    - Categorías principales y subcategorías para productos de supermercado/retail
    - Estructura jerárquica con categorías padre e hijos
    - Todas marcadas como activas por defecto
*/

-- Categorías principales
INSERT INTO categorias (nombre_categoria, nivel, activa, fecha_creacion, fecha_actualizacion)
VALUES 
  ('Electrónica', 1, true, now(), now()),
  ('Hogar', 1, true, now(), now()),
  ('Alimentos', 1, true, now(), now()),
  ('Bebidas', 1, true, now(), now()),
  ('Cuidado Personal', 1, true, now(), now()),
  ('Limpieza', 1, true, now(), now()),
  ('Mascotas', 1, true, now(), now()),
  ('Deportes', 1, true, now(), now());

-- Subcategorías Electrónica
INSERT INTO categorias (nombre_categoria, categoria_padre_id, nivel, activa, fecha_creacion, fecha_actualizacion)
VALUES 
  ('Televisores', (SELECT id_categoria FROM categorias WHERE nombre_categoria = 'Electrónica' LIMIT 1), 2, true, now(), now()),
  ('Celulares', (SELECT id_categoria FROM categorias WHERE nombre_categoria = 'Electrónica' LIMIT 1), 2, true, now(), now()),
  ('Computadores', (SELECT id_categoria FROM categorias WHERE nombre_categoria = 'Electrónica' LIMIT 1), 2, true, now(), now()),
  ('Electrodomésticos', (SELECT id_categoria FROM categorias WHERE nombre_categoria = 'Electrónica' LIMIT 1), 2, true, now(), now());

-- Subcategorías Hogar
INSERT INTO categorias (nombre_categoria, categoria_padre_id, nivel, activa, fecha_creacion, fecha_actualizacion)
VALUES 
  ('Muebles', (SELECT id_categoria FROM categorias WHERE nombre_categoria = 'Hogar' LIMIT 1), 2, true, now(), now()),
  ('Decoración', (SELECT id_categoria FROM categorias WHERE nombre_categoria = 'Hogar' LIMIT 1), 2, true, now(), now()),
  ('Cocina', (SELECT id_categoria FROM categorias WHERE nombre_categoria = 'Hogar' LIMIT 1), 2, true, now(), now()),
  ('Baño', (SELECT id_categoria FROM categorias WHERE nombre_categoria = 'Hogar' LIMIT 1), 2, true, now(), now());

-- Subcategorías Alimentos
INSERT INTO categorias (nombre_categoria, categoria_padre_id, nivel, activa, fecha_creacion, fecha_actualizacion)
VALUES 
  ('Lácteos', (SELECT id_categoria FROM categorias WHERE nombre_categoria = 'Alimentos' LIMIT 1), 2, true, now(), now()),
  ('Carnes', (SELECT id_categoria FROM categorias WHERE nombre_categoria = 'Alimentos' LIMIT 1), 2, true, now(), now()),
  ('Panadería', (SELECT id_categoria FROM categorias WHERE nombre_categoria = 'Alimentos' LIMIT 1), 2, true, now(), now()),
  ('Despensa', (SELECT id_categoria FROM categorias WHERE nombre_categoria = 'Alimentos' LIMIT 1), 2, true, now(), now());

-- Subcategorías Bebidas
INSERT INTO categorias (nombre_categoria, categoria_padre_id, nivel, activa, fecha_creacion, fecha_actualizacion)
VALUES 
  ('Gaseosas', (SELECT id_categoria FROM categorias WHERE nombre_categoria = 'Bebidas' LIMIT 1), 2, true, now(), now()),
  ('Jugos', (SELECT id_categoria FROM categorias WHERE nombre_categoria = 'Bebidas' LIMIT 1), 2, true, now(), now()),
  ('Aguas', (SELECT id_categoria FROM categorias WHERE nombre_categoria = 'Bebidas' LIMIT 1), 2, true, now(), now()),
  ('Alcohólicas', (SELECT id_categoria FROM categorias WHERE nombre_categoria = 'Bebidas' LIMIT 1), 2, true, now(), now());
