const express = require("express");
const fs = require("fs");
const path = require("path");
const session = require("express-session");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

// Add session middleware
app.use(
    session({
        secret: "your-secret-key", // Replace with a secure secret key
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }, // Use `true` if using HTTPS
    })
);

// Paths to data files
const accountsFile = path.join(__dirname, "data", "accounts.json");

// Routes

// Signup Route
app.post("/signup", (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required." });
    }

    fs.readFile(accountsFile, (err, data) => {
        if (err) return res.status(500).json({ message: "Error reading accounts file." });

        const accounts = JSON.parse(data);

        if (accounts.some(account => account.email === email)) {
            return res.status(400).json({ message: "Email already exists." });
        }

        accounts.push({ username, email, password });

        fs.writeFile(accountsFile, JSON.stringify(accounts, null, 2), (err) => {
            if (err) return res.status(500).json({ message: "Error saving account." });

            res.status(201).json({ message: "Signup successful!" });
        });
    });
});

// Login Route
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required." });
    }

    fs.readFile(accountsFile, (err, data) => {
        if (err) return res.status(500).json({ message: "Error reading accounts file." });

        const accounts = JSON.parse(data);
        const user = accounts.find(account => account.email === email && account.password === password);

        if (user) {
            // Store user details in the session
            req.session.email = user.email;
            req.session.username = user.username;

            console.log("User logged in:", user.username);
            return res.status(200).json({ message: "Login successful!", username: user.username });
        } else {
            return res.status(400).json({ message: "Invalid email or password." });
        }
    });
});

// Change Password Route
app.post("/change-password", (req, res) => {
    console.log("Received change-password request with body:", req.body);

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        console.error("Missing fields in request.");
        return res.status(400).json({ message: "All fields are required." });
    }

    fs.readFile(accountsFile, (err, data) => {
        if (err) {
            console.error("Error reading accounts file:", err);
            return res.status(500).json({ message: "Error reading accounts file." });
        }

        let accounts;
        try {
            accounts = JSON.parse(data);
        } catch (parseErr) {
            console.error("Error parsing accounts file:", parseErr);
            return res.status(500).json({ message: "Error parsing accounts file." });
        }

        const user = accounts.find(account => account.password === currentPassword);
        if (!user) {
            console.error("Current password is incorrect.");
            return res.status(400).json({ message: "Current password is incorrect." });
        }

        user.password = newPassword;

        fs.writeFile(accountsFile, JSON.stringify(accounts, null, 2), (writeErr) => {
            if (writeErr) {
                console.error("Error saving updated accounts file:", writeErr);
                return res.status(500).json({ message: "Error saving password." });
            }

            console.log("Password changed successfully for user:", user.username);
            res.status(200).json({ message: "Password changed successfully!" });
        });
    });
});

// Change Username Route
app.post("/change-username", (req, res) => {
    const { currentUsername, newUsername } = req.body;

    if (!currentUsername || !newUsername) {
        return res.status(400).json({ message: "All fields are required." });
    }

    fs.readFile(accountsFile, (err, data) => {
        if (err) return res.status(500).json({ message: "Error reading accounts file." });

        const accounts = JSON.parse(data);
        const user = accounts.find(account => account.username === currentUsername);

        if (!user) {
            return res.status(400).json({ message: "Current username is incorrect." });
        }

        user.username = newUsername;

        fs.writeFile(accountsFile, JSON.stringify(accounts, null, 2), (err) => {
            if (err) return res.status(500).json({ message: "Error saving username." });

            res.status(200).json({ message: "Username changed successfully!", username: newUsername });
        });
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
