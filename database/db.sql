CREATE DATABASE gpas;
USE gpas;

CREATE TABLE level1 (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE level2 (
    id INT AUTO_INCREMENT PRIMARY KEY,
    button1 VARCHAR(20),
    button2 VARCHAR(20),
    button3 VARCHAR(20),
    button4 VARCHAR(20),
    button5 VARCHAR(20),
    button6 VARCHAR(20),
    selected_colors TEXT
);
