const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const path = require("path");  // Required for serving static files
const bcrypt = require('bcrypt'); // Add bcrypt for hashing passwords
const cors = require('cors'); // Enable CORS if needed
const app = express();

// Middleware to parse JSON data from POST requests
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));  // Serve static files from 'public' folder
app.use(cors());  // Allow cross-origin requests (if needed)

// Database connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root", // Replace with your MySQL username
    password: "2411", // Replace with your MySQL password
    database: "expense_tracker", // Replace with your database name
    port: 3306 // Default MySQL port
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error("Error connecting to MySQL:", err.message);
        process.exit(1);
    }
    console.log("Connected to MySQL database!");
});

// Serve login page when user accesses the root URL
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
});

// Create a user (for registration)
app.post("/register", (req, res) => {
    const { username, password } = req.body;

    console.log("Registering user:", username);  // Debugging line

    // Hash the password before saving
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            console.error("Error hashing password:", err);
            return res.status(500).json({ error: "Registration failed" });
        }

        const query = `INSERT INTO users (username, password) VALUES (?, ?)`;
        db.query(query, [username, hashedPassword], (err, result) => {
            if (err) {
                console.error("Error registering user:", err);
                return res.status(500).json({ error: "Registration failed" });
            }
            res.status(201).json({ message: "User registered successfully!" });
        });
    });
});
// Authenticate user (for login)
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    console.log("Logging in user:", username); // Debugging line

    const query = `SELECT * FROM users WHERE username = ?`;
    db.query(query, [username], (err, results) => {
        if (err) {
            console.error("Error logging in:", err);
            return res.status(500).json({ error: "Login failed" });
        }
        if (results.length === 0) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        // Compare the hashed password stored in DB with the one provided
        bcrypt.compare(password, results[0].password, (err, isMatch) => {
            if (err) {
                console.error("Error comparing passwords:", err);
                return res.status(500).json({ error: "Login failed" });
            }
            if (!isMatch) {
                return res.status(401).json({ error: "Invalid username or password" });
            }

            // Password matched, send success response with user data
            const user = {
                id: results[0].id,
                username: results[0].username
            };

            res.json({
                message: "Login successful!",
                user: user // Send user data back in the response
            });
        });
    });
});

// Add a transaction
app.post("/transactions", (req, res) => {
    const { user_id, amount, description, date } = req.body;

    const query = `INSERT INTO transactions (user_id, amount, description, date) VALUES (?, ?, ?, ?)`;
    db.query(query, [user_id, amount, description, date], (err, result) => {
        if (err) {
            console.error("Error adding transaction:", err);
            return res.status(500).json({ error: "Transaction creation failed" });
        }
        res.status(201).json({ message: "Transaction added successfully!" });
    });
});

// Fetch transaction history
app.get("/transactions/:user_id", (req, res) => {
    const { user_id } = req.params;

    const query = `SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC`;
    db.query(query, [user_id], (err, results) => {
        if (err) {
            console.error("Error fetching transactions:", err);
            return res.status(500).json({ error: "Failed to fetch transactions" });
        }
        res.json(results);
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
