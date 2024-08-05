const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' })); // Adjust the limit as needed
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true })); // Adjust the limit as needed


// -------------------------------------------- MYSQL DATABASE CONNECTION -------------------------------------------------------
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Sivaram0327.', // Replace with your actual password
  database: 'gpas'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    process.exit(1);
  }
  console.log('Connected to the database');
});

// -------------------------------------------- LEVEL - 01 -------------------------------------------------------

// Level-01/Signup
app.post('/level1/signup', (req, res) => {
    const { name, username, email, phone, password } = req.body;

    if (!name || !username || !email || !phone || !password) {
        return res.status(400).send('All fields are required');
    }

    const insertLevel1Query = `
      INSERT INTO level1 (name, username, email, phone, password) 
      VALUES (?, ?, ?, ?, ?)
    `;

    connection.query(insertLevel1Query, [name, username, email, phone, password], (err, results) => {
        if (err) {
            console.error('Error inserting level1 data:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.status(201).send({ userId: results.insertId });
    });
});

// Level-01/Signin
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
        res.status(200).json({ userId }); // Send userId as JSON
    });
});

// -------------------------------------------- LEVEL - 02 -------------------------------------------------------


// Level-02/Signup
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


// Level-02/Signin
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


// -------------------------------------------- LEVEL - 03 -------------------------------------------------------

// Level-03/Signup
app.post('/level3/signup', (req, res) => {
    const { imageGrid, dropGrid } = req.body;

    connection.query('SELECT COALESCE(MAX(user_id), 0) + 1 AS nextUserId FROM level3', (err, results) => {
        if (err) {
            console.error('Error fetching next user ID:', err);
            return res.status(500).json({ message: 'Error during signup. Please try again.' });
        }
        const nextUserId = results[0].nextUserId;

        const query = 'INSERT INTO level3 (user_id, image_grid, drop_grid) VALUES (?, ?, ?)';
        connection.query(query, [nextUserId, JSON.stringify(imageGrid), JSON.stringify(dropGrid)], (err, results) => {
            if (err) {
                console.error('Error inserting data:', err);
                return res.status(500).json({ message: 'Error during signup. Please try again.' });
            }
            res.status(200).json({ message: 'Signup successful!' });
        });
    });
});

// Level-03/Signin
app.post('/level3/signin', (req, res) => {
    const { user_id } = req.body;
    const query = 'SELECT image_grid FROM level3 WHERE user_id = ?';

    connection.query(query, [user_id], (error, results) => {
        if (error) {
            console.error('Error fetching image grid:', error);
            return res.status(500).json({ error: 'Database query failed' });
        }

        const imageGrid = results[0].image_grid;

        // Check if imageGrid is an object and send it as an array
        if (typeof imageGrid === 'object') {
            res.json(Object.values(imageGrid)); // Converts object to array of values
        } else {
            res.status(500).json({ error: 'Unexpected data format for image grid' });
        }
    });
});

// Verify drop grid
app.post('/level3/verifyDropGrid', async (req, res) => {
    const { user_id, drop_grid } = req.body;

    if (!user_id || !drop_grid) {
        return res.status(400).json({ message: 'User ID and Drop Grid are required' });
    }

    try {
        const [rows] = await connection.promise().query('SELECT drop_grid FROM level3 WHERE user_id = ?', [user_id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const storedDropGrid = rows[0].drop_grid;
        const isMatch = JSON.stringify(drop_grid) === JSON.stringify(storedDropGrid);

        if (isMatch) {
            res.json({ success: true });
        } else {
            res.json({ success: false });
        }
    } catch (error) {
        console.error('Error verifying drop grid:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


// -------------------------------------------- DISPLAYING USERNAME -------------------------------------------------------

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
        res.status(200).send(results[0].name); // Send just the name string
    });
});

// -------------------------------------------- START THE SERVER -------------------------------------------------------
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
