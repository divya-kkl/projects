// const express = require('express');
// const bodyParser = require('body-parser');
// const session = require('express-session');
// const path = require('path');

// const app = express();

// // Middleware
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(session({ secret: 'mysecret', resave: false, saveUninitialized: false }));
// app.use(express.static(path.join(__dirname, 'public')));

// // Login page
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'login.html'));
// });

// // Login POST - accept any username/password
// app.post('/login', (req, res) => {
//     const { username, password } = req.body;

//     if (!username || !password) {
//         return res.send('Please enter both username and password');
//     }

//     // Store username and password in session
//     req.session.username = username;
//     req.session.password = password;

//     // Pass values to dashboard via sessionStorage
//     res.send(`
//         <script>
//             sessionStorage.setItem('username', "${username}");
//             sessionStorage.setItem('password', "${password}");
//             window.location.href = "/dashboard";
//         </script>
//     `);
// });

// // Dashboard page
// app.get('/dashboard', (req, res) => {
//     if (!req.session.username || !req.session.password) return res.redirect('/login');
//     res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
// });

// // Logout
// app.get('/logout', (req, res) => {
//     req.session.destroy(err => {
//         if (err) return res.send('Error logging out');
//         res.redirect('/login');
//     });
// });

// app.listen(3000, () => console.log('Server running on http://localhost:3000'));





const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

const app = express();

// ---------------------- MongoDB ----------------------
mongoose.connect('mongodb://127.0.0.1:27017/mycrud')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});
const User = mongoose.model('User', userSchema);

// ---------------------- Middleware ----------------------
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({ secret: 'mysecret', resave: false, saveUninitialized: false }));
app.use(express.static(path.join(__dirname, 'public')));

// ---------------------- Authentication Middleware ----------------------
function authMiddleware(req, res, next) {
    if (!req.session.username) return res.redirect('/login');
    next();
}

// ---------------------- Routes ----------------------

// Login page
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'login.html')));

// Login POST
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.send('Enter both username and password');

    req.session.username = username;
    req.session.password = password;

    res.redirect('/dashboard');
});

// Logout
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.send('Error logging out');
        res.redirect('/login');
    });
});

// Dashboard page
app.get('/dashboard', authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// ---------------------- CRUD Routes ----------------------

// Show signup form
app.get('/signup', authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

// Admin page to view all users
app.get('/admin', authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// API to add user
app.post('/api/users', authMiddleware, async (req, res) => {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });
    await user.save();
    res.json({ success: true, user });
});

// API to get all users
app.get('/api/users', authMiddleware, async (req, res) => {
    const users = await User.find();
    res.json(users);
});

// ---------------------- Start Server ----------------------
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

