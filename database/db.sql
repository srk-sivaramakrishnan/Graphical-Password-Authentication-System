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


CREATE TABLE level3 (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    image_grid JSON NOT NULL,
    drop_grid JSON NOT NULL,
    FOREIGN KEY (user_id) REFERENCES level1(id)
);





truncate table level1;
truncate table level2;
truncate table level3;
drop table level3;
select * from level1;
select * from level2;
select * from level3;
select * from image_grids;

