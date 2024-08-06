const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const nodemailer = require('nodemailer');


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

// Level-01/Reset
app.put('/reset/level1/:id', async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({ success: false, message: 'Password is required' });
    }

    connection.query(
        'UPDATE level1 SET password = ? WHERE id = ?',
        [password, id], // Directly using password, no hashing
        (err, result) => {
            if (err) {
                console.error('Error resetting password:', err);
                return res.status(500).json({ success: false, message: 'Server error' });
            }

            if (result.affectedRows > 0) {
                res.status(200).json({ success: true, message: 'Password reset successfully' });
            } else {
                res.status(400).json({ success: false, message: 'ID not found' });
            }
        }
    );
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

// Fetching Colors
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

//Reset
app.post('/level2/reset', (req, res) => {
    const { user_id, buttons, selectedColors } = req.body;
    
    if (!user_id || !Array.isArray(buttons) || buttons.length !== 6) {
        return res.status(400).send('Invalid input data');
    }

    const query = `
        UPDATE level2
        SET button1 = ?, button2 = ?, button3 = ?, button4 = ?, button5 = ?, button6 = ?, selected_colors = ?
        WHERE user_id = ?
    `;
    
    connection.query(query, [...buttons, selectedColors, user_id], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Database error');
        }
        res.send('Reset successful');
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

// Reset
app.post('/level3/reset/:userId', (req, res) => {
    const userId = req.params.userId;
    const { imageGrid, dropGrid } = req.body;

    // Validate input
    if (!userId || !Array.isArray(imageGrid) || !Array.isArray(dropGrid)) {
        return res.status(400).json({ message: 'Invalid input' });
    }

    // SQL query to update image and drop grid data
    const query = `
        UPDATE level3
        SET image_grid = ?, drop_grid = ?
        WHERE user_id = ?;
    `;

    connection.query(query, [JSON.stringify(imageGrid), JSON.stringify(dropGrid), userId], (err, results) => {
        if (err) {
            console.error('Error updating image data:', err);
            return res.status(500).json({ message: 'Error updating image data. Please try again.' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Images reset successful!' });
    });
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

// ------------------------------------------------ FORGOTTEN PASSWORD -----------------------------------------------
// Generate OTP and send email
app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    // Check if the email exists in the level1 table
    connection.query('SELECT email FROM level1 WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error('Error checking email:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }

        // If the email does not exist
        if (results.length === 0) {
            return res.status(400).json({ success: false, message: 'This email is not registered.' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiration = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

        connection.query(
            'INSERT INTO Forgot (email, otp, otp_expiration) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE otp = VALUES(otp), otp_expiration = VALUES(otp_expiration)',
            [email, otp, expiration],
            (err, result) => {
                if (err) {
                    console.error('Error updating OTP:', err);
                    return res.status(500).json({ success: false, message: 'Server error' });
                }

                // Send OTP via email
                const transporter = nodemailer.createTransport({
                    service: 'Gmail',
                    auth: {
                        user: 'skyhookdeveloper@gmail.com',
                        pass: 'jihl kdrk xnie zgzu'
                    }
                });

                const mailOptions = {
                    from: 'your-email@gmail.com',
                    to: email,
                    subject: 'SkyHook Password Reset',
                    html: `
                        <html>
                        <head>
                            <style>
                                body {
                                    font-family: Arial, sans-serif;
                                    background-color: #f4f4f4;
                                    margin: 0;
                                    padding: 0;
                                    overflow-x: hidden;
                                }
                                .container {
                                    width: 100%;
                                    max-width: 600px;
                                    margin: 0 auto;
                                    background: #fff;
                                    padding: 20px;
                                    border-radius: 8px;
                                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                                }
                                .header {
                                    background-color: #a020f0;
                                    color: #fff;
                                    padding: 15px;
                                    text-align: center;
                                    border-radius: 8px 8px 0 0;
                                }
                                .content {
                                    padding: 20px;
                                    border: 2px solid #a020f0;
                                }
                                .otp-code {
                                    font-size: 24px;
                                    font-weight: bold;
                                    color: #a020f0;
                                    display: block;
                                    text-align: center;
                                    margin: 20px 0;
                                }
                                .expiration-note {
                                    font-size: 14px;
                                    color: #555;
                                    text-align: center;
                                }
                                .footer {
                                    text-align: center;
                                    padding: 15px;
                                    font-size: 12px;
                                    color: #777;
                                }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <div class="header">
                                    <h1>SkyHook Password Reset</h1>
                                </div>
                                <div class="content">
                                    <p>We heard that you lost your SkyHook password. Sorry about that!</p>
                                    <p>But don’t worry!</p>
                                    <p>Continue resetting your password for SkyHook by entering the code below:</p>
                                    <span class="otp-code">${otp}</span>
                                    <p class="expiration-note">If you don’t use this code within 3 hours, it will expire.</p>
                                </div>
                                <div class="footer">
                                    <p>You’re receiving this email because a password reset was requested for your account.</p>
                                    <p>&copy; ${new Date().getFullYear()} SkyHook All rights reserved.</p>
                                </div>
                            </div>
                        </body>
                        </html>
                    `
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error('Error sending email:', error);
                        return res.status(500).json({ success: false, message: 'Server error' });
                    }
                    res.status(200).json({ success: true, message: 'OTP sent' });
                });
            }
        );
    });
});



// Verify OTP and allow password reset
app.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ success: false, message: 'Email and OTP are required' });
    }

    connection.query(
        'SELECT otp_expiration FROM Forgot WHERE email = ? AND otp = ?',
        [email, otp],
        (err, result) => {
            if (err) {
                console.error('Error retrieving OTP:', err);
                return res.status(500).json({ success: false, message: 'Server error' });
            }
            if (result.length > 0) {
                const otpExpiration = new Date(result[0].otp_expiration);
                if (new Date() < otpExpiration) {
                    // Step 2: Fetch user ID from the level1 table
                    connection.query(
                        'SELECT id FROM level1 WHERE email = ?',
                        [email],
                        (err, userResult) => {
                            if (err) {
                                console.error('Error retrieving user ID:', err);
                                return res.status(500).json({ success: false, message: 'Server error' });
                            }

                            if (userResult.length > 0) {
                                const userId = userResult[0].id;
                                res.status(200).json({ success: true, message: 'OTP verified successfully', id: userId });
                            } else {
                                res.status(400).json({ success: false, message: 'User not found' });
                            }
                        }
                    );
                } else {
                    res.status(400).json({ success: false, message: 'OTP has expired' });
                }
            } else {
                res.status(400).json({ success: false, message: 'Invalid OTP or email' });
            }
        }
    );
});


// -------------------------------------------- START THE SERVER -------------------------------------------------------
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
