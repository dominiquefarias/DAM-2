-- ===== Paso 1: base de datos y tabla =====
CREATE DATABASE biblioteca;
USE biblioteca;

CREATE TABLE libros (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    titulo     VARCHAR(100),
    autor      VARCHAR(100),
    ejemplares INT
);

INSERT INTO libros (titulo, autor, ejemplares) VALUES
    ('Don Quijote de la Mancha', 'Miguel de Cervantes',   3),
    ('Novelas ejemplares',       'Miguel de Cervantes',   1),
    ('La casa de Bernarda Alba', 'Federico García Lorca', 2),
    ('Romancero gitano',         'Federico García Lorca', 0);

SELECT * FROM libros;

-- ===== Paso 2: usuario del programa =====
CREATE USER 'app_biblioteca'@'localhost' IDENTIFIED BY 'Biblio_2026';
GRANT EXECUTE ON biblioteca.* TO 'app_biblioteca'@'localhost';

-- ===== Paso 3: listar todos los libros =====
USE biblioteca;

DELIMITER //
CREATE PROCEDURE listar_libros()
BEGIN
    SELECT id, titulo, autor, ejemplares
    FROM libros
    ORDER BY id;
END //
DELIMITER ;

CALL listar_libros();

-- ===== Paso 5: parámetro de entrada =====
DELIMITER //
CREATE PROCEDURE buscar_por_autor(IN p_autor VARCHAR(100))
BEGIN
    SELECT titulo, ejemplares
    FROM libros
    WHERE autor = p_autor;
END //
DELIMITER ;

CALL buscar_por_autor('Federico García Lorca');

-- ===== Paso 6: parámetro de salida =====
DELIMITER //
CREATE PROCEDURE contar_libros(OUT p_total INT)
BEGIN
    SELECT COUNT(*) INTO p_total FROM libros;
END //
DELIMITER ;

CALL contar_libros(@total);
SELECT @total;

-- ===== Paso 7: procedimiento que modifica datos =====
DELIMITER //
CREATE PROCEDURE prestar_libro(IN p_id INT)
BEGIN
    IF (SELECT ejemplares FROM libros WHERE id = p_id) = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No quedan ejemplares';
    END IF;

    UPDATE libros SET ejemplares = ejemplares - 1 WHERE id = p_id;
END //
DELIMITER ;

-- Prueba: debe dar el error "No quedan ejemplares"
CALL prestar_libro(4);