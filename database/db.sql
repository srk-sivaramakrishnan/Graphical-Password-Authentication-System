CREATE DATABASE gpas;
USE gpas;

CREATE TABLE level1 (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE level2 (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    button1 VARCHAR(20) NOT NULL,
    button2 VARCHAR(20) NOT NULL,
    button3 VARCHAR(20) NOT NULL,
    button4 VARCHAR(20) NOT NULL,
    button5 VARCHAR(20) NOT NULL,
    button6 VARCHAR(20) NOT NULL,
    selected_colors VARCHAR(100) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES level1(id) 
);

CREATE TABLE image_grids (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    image_grid JSON NOT NULL,
    drop_grid JSON NOT NULL,
    FOREIGN KEY (user_id) REFERENCES level1(id)
);

drop table level1;
drop table image_grids;
select * from level2;
select * from image_grids;
