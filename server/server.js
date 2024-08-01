const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const multer = require('multer');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true })); // Change to urlencoded for form data
app.use(express.json());

// ---------------------------------------------Database connection setup-----------------------------------------------
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Sivaram0327.', // Replace Your Password
    database: 'gpas'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        process.exit(1);
    }
    console.log('Connected to the database');
});

// ------------------------------------------ENDPOINTS FOR SIGNUP---------------------------------------------

// Level-01
app.post('/level1/signup', (req, res) => {
    const { name, username, password } = req.body;

    if (!name || !username || !password) {
        return res.status(400).send('Name, username, and password are required');
    }

    const insertLevel1Query = `
      INSERT INTO level1 (name, username, password) 
      VALUES (?, ?, ?)
    `;

    connection.query(insertLevel1Query, [name, username, password], (err, results) => {
        if (err) {
            console.error('Error inserting level1 data:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.status(201).send(`User ID: ${results.insertId}`); // Return user ID
    });
});

// POST endpoint for level2/signup
app.post('/level2/signup', (req, res) => {
    const { user_id, buttons, selectedColors } = req.body;

    if (!user_id || !buttons || !selectedColors) {
        return res.status(400).send('Missing required fields');
    }

    const query = `
        INSERT INTO level2 (user_id, button1, button2, button3, button4, button5, button6, selected_colors)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    connection.query(query, [user_id, ...buttons, selectedColors], (err, results) => {
        if (err) {
            console.error('Error inserting level2 data:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.status(201).send('Data saved successfully');
    });
});

// Server code: Make sure this is in your Express server file
app.get('/level2/data/:id', (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).send('User ID is required');
    }

    const selectLevel2Query = `
        SELECT * FROM level2
        WHERE user_id = ?
    `;

    connection.query(selectLevel2Query, [id], (err, results) => {
        if (err) {
            console.error('Error fetching level2 data:', err);
            return res.status(500).send('Internal Server Error');
        }
        if (results.length === 0) {
            return res.status(404).send('User data not found');
        }
        res.status(200).send(results[0]);
    });
});

// ------------------------------------------ENDPOINTS FOR SIGNIN---------------------------------------------

// Level-01
app.post('/level1/signin', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }

    const selectLevel1Query = `
      SELECT id FROM level1 
      WHERE username = ? AND password = ?
    `;

    connection.query(selectLevel1Query, [username, password], (err, results) => {
        if (err) {
            console.error('Error fetching level1 data:', err);
            return res.status(500).send('Internal Server Error');
        }
        if (results.length === 0) {
            return res.status(401).send('Invalid username or password');
        }

        const userId = results[0].id;
        res.status(200).send(`User ID: ${userId}`); 
    });
});

//Level-02 
app.post('/level2/signin', (req, res) => {
    const { user_id } = req.body;

    if (!user_id) {
        return res.status(400).send('User ID is required');
    }

    const selectLevel2Query = `
      SELECT * FROM level2 
      WHERE user_id = ?
    `;

    connection.query(selectLevel2Query, [user_id], (err, results) => {
        if (err) {
            console.error('Error fetching level2 data:', err);
            return res.status(500).send('Internal Server Error');
        }
        if (results.length === 0) {
            return res.status(404).send('User data not found');
        }
        res.status(200).send(results);
    });
});

// POST endpoint for level2/verify
app.post('/level2/verify', (req, res) => {
    const { user_id, selectedColors } = req.body;

    if (!user_id || !selectedColors) {
        return res.status(400).send('Missing required fields');
    }

    const selectLevel2Query = `
      SELECT selected_colors FROM level2 
      WHERE user_id = ?
    `;

    connection.query(selectLevel2Query, [user_id], (err, results) => {
        if (err) {
            console.error('Error verifying level2 data:', err);
            return res.status(500).send('Internal Server Error');
        }
        if (results.length === 0 || results[0].selected_colors !== selectedColors) {
            return res.status(401).send('Verification failed');
        }
        res.status(200).send('Verification successful');
    });
});

// --------------------------------------------- DISPLAYING THE USERNAME -----------------------------------------------

app.post('/level1/getUserName', (req, res) => {
    const { user_id } = req.body;

    if (!user_id) {
        return res.status(400).send('User ID is required');
    }

    const selectUserQuery = `
      SELECT name FROM level1 
      WHERE id = ?
    `;

    connection.query(selectUserQuery, [user_id], (err, results) => {
        if (err) {
            console.error('Error fetching user data:', err);
            return res.status(500).send('Internal Server Error');
        }
        if (results.length === 0) {
            return res.status(404).send('User not found');
        }
        res.status(200).send(`Name: ${results[0].name}`);
    });
});

// Start the server
app.listen(3001, () => {
    console.log('Server running on port 3001');
});
