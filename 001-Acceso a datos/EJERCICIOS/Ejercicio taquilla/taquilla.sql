DROP DATABASE IF EXISTS taquilla;
CREATE DATABASE taquilla;
USE taquilla;

CREATE TABLE clientes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(50),
  saldo INT
) ENGINE = InnoDB;

CREATE TABLE entradas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  cliente_id INT,
  evento VARCHAR(50)
) ENGINE = InnoDB;

INSERT INTO clientes (nombre, saldo) VALUES ('Laura', 50), ('Marcos', 15);