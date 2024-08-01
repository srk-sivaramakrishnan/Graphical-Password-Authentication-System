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

-- Create uploads table
CREATE TABLE uploads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    category VARCHAR(50) NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES level1(id)
);

-- Create image_grids table
CREATE TABLE image_grids (
    id INT AUTO_INCREMENT PRIMARY KEY,
    upload_id INT NOT NULL,
    grid_index INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    FOREIGN KEY (upload_id) REFERENCES uploads(id)
);

-- Create selected_grids table
CREATE TABLE selected_grids (
    id INT AUTO_INCREMENT PRIMARY KEY,
    upload_id INT NOT NULL,
    grid_index INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    FOREIGN KEY (upload_id) REFERENCES uploads(id)
);


drop table level1;
select * from level2;
