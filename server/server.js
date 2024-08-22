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

// Supabase configuration
const supabaseUrl = 'https://qevkizdsncfabvsdkbot.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFldmtpemRzbmNmYWJ2c2RrYm90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQyNDQ4MDEsImV4cCI6MjAzOTgyMDgwMX0.PaLjhI1ovaKMIMwd1bAvObZzjBbAqKqNUisUw46p6uU';
const supabase = createClient(supabaseUrl, supabaseKey);

if (supabase) {
    console.log("Connected to DB");
} else {
    console.log("Failed to connect DB");
}

// Multer configuration for file upload
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

// Rate a product
app.post('/rate-product', async (req, res) => {
    const { productId, rating, user_id } = req.body;

    if (!productId || rating == null) {
        return res.status(400).json({ message: 'Product ID and rating are required' });
    }

    try {
        const { data, error } = await supabase
            .from('ratings')
            .upsert({ product_id: productId, rating, user_id })
            .select();

        if (error) {
            throw new Error(error.message);
        }

        res.json({ message: 'Rating submitted successfully', data });
    } catch (err) {
        console.error('Error submitting rating:', err.message);
        res.status(500).json({ message: 'Failed to submit rating', error: err.message });
    }
});

// Server-side (API endpoint)
app.get('/get-products', async (req, res) => {
    const { category } = req.query;
  
    if (!category) {
      return res.status(400).json({ message: 'Category is required' });
    }
  
    try {
      const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category);
  
      if (error) {
        console.error('Error fetching products:', error.message);
        throw new Error(error.message);
      }
  
      if (!products || products.length === 0) {
        console.log(`No products found for category: ${category}`);
        return res.status(404).json({ message: 'No products found' });
      }
        res.json({ products });
    } catch (err) {
      console.error('Error fetching products:', err.message);
      res.status(500).json({ message: 'Failed to fetch products', error: err.message });
    }
  });

// Get average rating for a product
app.get('/get-rating', async (req, res) => {
    const { product_id } = req.query;

    const { data: ratings, error } = await supabase
        .from('ratings')
        .select('rating')
        .eq('product_id', product_id);

    if (error) {
        return res.status(500).json({ message: 'Failed to fetch ratings', error: error.message });
    }

    if (ratings.length === 0) {
        return res.status(404).json({ message: 'No ratings found for this product' });
    }

    const totalRating = ratings.reduce((acc, rating) => acc + rating.rating, 0);
    const averageRating = totalRating / ratings.length;

    res.json({ averageRating, totalRatings: ratings.length });
});

// Upload user avatar
app.post('/upload-avatar', (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

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

    try {
        const { data: accountData, error: accountError } = await supabase
            .from('account')
            .insert([{ username, password, phone, email }])
            .select();

        if (accountError) {
            throw new Error(`Account Error: ${accountError.message}`);
        }

        const accountId = accountData[0].id;

        const { error: userError } = await supabase
            .from('user')
            .insert([{ account_id: accountId, name }]);

        if (userError) {
            throw new Error(`User Error: ${userError.message}`);
        }

        res.status(200).send(`User registered with username: ${name}`);
    } catch (err) {
        console.error('Registration Error:', err.message);
        res.status(500).send(`Server Error: ${err.message}`);
    }
});


app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Fetch account details
    const { data: accountResults, error: accountError } = await supabase
        .from('account')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .single(); // Fetch a single account

    if (accountError) {
        return res.status(500).json({ error: accountError.message });
    }

    if (accountResults) {
        const { data: userResults, error: userError } = await supabase
            .from('user')
            .select('*')
            .eq('account_id', accountResults.id);
        if (userError) {
            return res.status(500).json({ error: userError.message });
        }

        const token = 'abcdefghiklmnoupw12345'; // Generate a real token in production
        res.status(200).json({
            message: 'Login successful',
            token: token,
            username: accountResults.username,
            account_id: accountResults.id,
            user: userResults // Include user data
        });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

app.post('/add-cart', async (req, res) => {
    const { product_id, user_id } = req.body;

    if (!user_id || !product_id) {
        return res.status(400).json({ message: 'User ID and Product ID are required' });
    }

    try {
        // Check if the item already exists in the cart
        const { data: existingItem, error: fetchError } = await supabase
            .from('cart')
            .select('*')
            .eq('user_id', user_id)
            .eq('product_id', product_id)
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') { // Handle errors other than 'No Rows Found'
            throw new Error(fetchError.message);
        }

        if (existingItem) {
            // If item exists, update the quantity
            const newQuantity = existingItem.quantity + 1;
            const { error: updateError } = await supabase
                .from('cart')
                .update({ quantity: newQuantity })
                .eq('user_id', user_id)
                .eq('product_id', product_id);

            if (updateError) {
                throw new Error(updateError.message);
            }

            res.json({ message: 'Cart item quantity updated successfully', data: { ...existingItem, quantity: newQuantity } });
        } else {
            // If item does not exist, insert a new row
            const { error: insertError } = await supabase
                .from('cart')
                .insert([{ user_id, product_id, quantity: 1 }]);

            if (insertError) {
                throw new Error(insertError.message);
            }

            res.json({ message: 'Item added to cart successfully', data: { user_id, product_id, quantity: 1 } });
        }
    } catch (err) {
        console.error('Error adding item to cart:', err.message);
        res.status(500).json({ message: 'Failed to add item to cart', error: err.message });
    }
});


// Get items in user's cart
app.get('/get-cart', async (req, res) => {
    const user_id = req.query.user_id;

    if (!user_id) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        // Fetch cart items for the user
        const { data: cartItems, error } = await supabase
            .from('cart')
            .select('product_id, quantity')
            .eq('user_id', user_id);

        if (error) {
            throw new Error(error.message);
        }

        if (!cartItems || cartItems.length === 0) {
            return res.status(404).json({ message: 'No items found in cart' });
        }

        // Fetch product details for the products in the cart
        const { data: products, error: productError } = await supabase
            .from('products')
            .select('id, name, firstPrice, lastPrice, image')
            .in('id', cartItems.map(item => item.product_id));
        
        if (productError) {
            throw new Error(productError.message);
        }

        // Combine cart items with product details
        const cartWithProductDetails = cartItems.map(cartItem => {
            const product = products.find(prod => prod.id === cartItem.product_id);
            return {
                ...cartItem,
                product
            };
        });

        res.json(cartWithProductDetails);
    } catch (err) {
        console.error('Error fetching cart items:', err.message);
        res.status(500).json({ message: 'Failed to fetch cart items', error: err.message });
    }
});


// Get user details
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
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// Get posts
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

// Serve static files from 'uploads' directory
app.use('/uploads', express.static('uploads'));

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
