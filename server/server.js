const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

// Create MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',        
    password: 'shapna0327.',  // Replace with your MySQL password
    database: 'gpas'    
});

connection.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database.');
});

// ================================================= SIGNUP ============================================================

// Level-01 Signup
app.post('/level1/signup', (req, res) => {
    const { name, username, password } = req.body;

    // Insert user into database and get the inserted user ID
    const query = 'INSERT INTO users (name, username, password) VALUES (?, ?, ?)';
    connection.query(query, [name, username, password], (err, result) => {
        if (err) {
            console.error('Error signing up:', err);
            return res.status(500).send('Error signing up');
        }
        const userId = result.insertId; // Assuming insertId is the user ID
        res.status(200).json({ userId }); // Send user ID in the response
    });
});


// Level-02 Signup
app.post('/level2/signup', (req, res) => {
    const { user_id, colorButtons, colorNames } = req.body;

    if (!user_id) {
        return res.status(400).send('User ID is required');
    }

    // Create query to insert data into table
    const query = `
        INSERT INTO level2 (user_id, button1, button2, button3, button4, button5, button6, selected_colors) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    connection.query(query, [user_id, ...colorButtons, colorNames.join(', ')], (err, result) => {
        if (err) {
            console.error('Error inserting data into the database:', err);
            return res.status(500).send('Error saving data');
        }
        res.status(200).send('Data saved successfully');
    });
});


// ================================================= SIGNIN ===========================================================

// Level-01 Sign-In
app.post('/level1/signin', (req, res) => {
    const { username, password } = req.body;

    connection.query('SELECT * FROM level1 WHERE username = ? AND password = ?', [username, password], (err, results) => {
        if (err) {
            console.error('Error querying the database:', err);
            return res.status(500).send('Error querying the database');
        }
        if (results.length === 0) {
            return res.status(401).send('Invalid username or password');
        }
        res.status(200).send('Sign-in successful');
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
