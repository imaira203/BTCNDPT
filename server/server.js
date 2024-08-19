// server/server.js
const express = require('express');
const mysql = require('mysql');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
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

  const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });

  const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, // Limit file size to 1MB
    fileFilter: (req, file, cb) => {
      // Check file type (allow only images)
      const filetypes = /jpeg|jpg|png|gif/;
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = filetypes.test(file.mimetype);
  
      if (mimetype && extname) {
        return cb(null, true);
      } else {
        cb('Error: Images Only!');
      }
    }
  }).single('avatar');

  app.post('/upload-avatar', (req, res) => {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err });
      }
  
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
  
      // Here you can update the user's avatar URL in the database
      const avatarUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      const account_id = req.body.account_id;
  
      const query = "UPDATE user SET avatar = ? WHERE account_id = ?";
      db.query(query, [avatarUrl, account_id], (err, result) => {
        if (err) {
          return res.status(500).json({ message: 'Database update failed', error: err });
        }
        res.json({ message: 'Avatar uploaded successfully', avatarUrl });
      });
    });
  });
  
    // Register new user
    app.post('/register', (req, res) => {
        const { username, password, name, email, phone} = req.body;
        const query = 'INSERT INTO account (username, password, phone, email) VALUES (?, ?, ?, ?)';
        db.query(query, [username, password, phone, email], (err, result) => {
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
        const query = `SELECT user.name, user.avatar, account.email, account.username, account.phone
            FROM user
            JOIN account ON user.account_id = account.id
            WHERE user.account_id = ?`
        ;
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

    // Static folder to serve uploaded images
    app.use('/uploads', express.static('uploads'));
    const port = 81;
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
