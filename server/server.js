// server/server.js
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'imaira2003',
    database: 'baitap'
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to database');
});

// Function to generate unique username
function generateUniqueUsername() {
    return 'user_' + Math.random().toString(36).substr(2, 9);
}

// Register new user
app.post('/register', (req, res) => {
    const { username, password, name } = req.body;
    const query = 'INSERT INTO account (username, password) VALUES (?, ?)';
    db.query(query, [username, password], (err, result) => {
        if (err) return res.status(500).send(err);

        const accountId = result.insertId;
        const userQuery = 'INSERT INTO user (account_id, name) VALUES (?, ?)';
        db.query(userQuery, [accountId, name], (err, result) => {
            if (err) return res.status(500).send(err);
            res.status(200).send(`User registered with username: ${name}`);
        });
    });
});

// User login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM account WHERE username = ? AND password = ?';
    db.query(query, [username, password], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        
        if (results.length > 0) {
            const token = 'abcdefghiklmnoupw12345'; 
            res.status(200).json({
                message: 'Login successful',
                token: token, 
                username: results[0].username,
                account_id: results[0].id
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    });
});

app.get('/getUser', (req, res) => {
    const account_id = req.query.account_id;
    const query = "SELECT name FROM user WHERE account_id = ?";
    db.query(query, [account_id], (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length > 0) {
            res.json(results);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    });
});



app.get('/getPosts', (req, res) => {
  const query = 'SELECT * FROM posts LIMIT 10';
  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});


const port = 81;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
