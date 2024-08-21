const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js');

const port = 81;

const app = express();
app.use(cors());
app.use(bodyParser.json());

const supabaseUrl = 'https://qevkizdsncfabvsdkbot.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFldmtpemRzbmNmYWJ2c2RrYm90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQyNDQ4MDEsImV4cCI6MjAzOTgyMDgwMX0.PaLjhI1ovaKMIMwd1bAvObZzjBbAqKqNUisUw46p6uU"
const supabase = createClient(supabaseUrl, supabaseKey)

  if (supabase){
    console.log("Connected to DB");
  } else {
    console.log("Failed to connect DB")
  }

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

        // Update the user's avatar URL in Supabase
        const avatarUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        const { account_id } = req.body;

        const { error } = await supabase
            .from('user')
            .update({ avatar: avatarUrl })
            .eq('account_id', account_id);

        if (error) {
            return res.status(500).json({ message: 'Database update failed', error: error.message });
        }
        res.json({ message: 'Avatar uploaded successfully', avatarUrl });
    });
});

// Register new user
app.post('/register', async (req, res) => {
    const { username, password, name, email, phone } = req.body;

    const { data: accountData, error: accountError } = await supabase
        .from('account')
        .insert([{ username, password, phone, email }])
        .select();

    if (accountError) {
        return res.status(500).send(accountError.message);
    }

    const accountId = accountData[0].id;

    const { error: userError } = await supabase
        .from('user')
        .insert([{ account_id: accountId, name }]);

    if (userError) {
        return res.status(500).send(userError.message);
    }

    res.status(200).send(`User registered with username: ${name}`);
});

// User login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const { data: results, error } = await supabase
        .from('account')
        .select('*')
        .eq('username', username)
        .eq('password', password);

    if (error) {
        return res.status(500).json({ error: error.message });
    }

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

app.get('/getUser', async (req, res) => {
    const { account_id } = req.query;

    const { data: results, error } = await supabase
        .from('user')
        .select('name, avatar, account (email, username, phone)')
        .eq('account_id', account_id);

        if (error) {
            console.error('Supabase Error:', error.message);
            return res.status(500).json({ error: error.message });
        }
        

    if (results.length > 0) {
        res.json(results);
        console.log(results)
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

app.get('/getPosts', async (req, res) => {
    const { data: results, error } = await supabase
        .from('posts')
        .select('*')
        .limit(10);

    if (error) {
        return res.status(500).send(error.message);
    }

    res.json(results);
});

// Static folder to serve uploaded images
app.use('/uploads', express.static('uploads'));


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
