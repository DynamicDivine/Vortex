// Function to handle the "Join Discord" button
function openDiscord() {
    window.open("https://discord.gg/RgGmTjSMby", "_blank"); // Replace with your Discord invite link
}

// Open and Close Modal Functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = "flex"; // Show the modal (use flex to center content)
    } else {
        console.error(`Modal with id ${modalId} not found.`);
    }
}

// Close Modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = "none"; // Hide the modal
    } else {
        console.error(`Modal with id ${modalId} not found.`);
    }
}

// Close Modal on Outside Click
window.addEventListener("click", (event) => {
    const loginModal = document.getElementById("loginModal");
    const signupModal = document.getElementById("signupModal");

    if (event.target === loginModal) {
        closeModal("loginModal");
    }

    if (event.target === signupModal) {
        closeModal("signupModal");
    }
});

// Close Modal on "X" Click
document.querySelectorAll(".close").forEach(button => {
    button.addEventListener("click", (event) => {
        const modal = button.closest(".modal");
        if (modal) {
            modal.style.display = "none";
        }
    });
});


// Signup Handler with Password Validation
async function handleSignup(event) {
    event.preventDefault();

    const username = document.getElementById("signupUsername").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value.trim();
    const confirmPassword = document.getElementById("signupConfirmPassword").value.trim();

    if (!username || !email || !password || !confirmPassword) {
        alert("Please fill out all fields.");
        return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        alert("Passwords do not match. Please try again.");
        return;
    }

    const account = { username, email, password };

    try {
        const response = await fetch("/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(account),
        });

        if (!response.ok) {
            const result = await response.json();
            alert(result.message || "Signup failed.");
            return;
        }

        alert("Signup successful!");
        closeModal("signupModal");
    } catch (error) {
        console.error("Error during signup:", error);
        alert("An error occurred while signing up. Please try again later.");
    }
}

// Login Handler
async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (!email || !password) {
        alert("Please fill out all fields.");
        return;
    }

    const credentials = { email, password };

    try {
        const response = await fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
        });

        const result = await response.json();

        if (response.ok) {
            // Store the username in localStorage
            localStorage.setItem("username", result.username);
            alert("Login successful!");
            window.location.href = "dashboard.html"; // Redirect to dashboard
        } else {
            alert(result.message || "Login failed.");
        }
    } catch (error) {
        console.error(error);
        alert("An error occurred while logging in.");
    }
}

// Attach Event Listeners for Login and Signup Forms
const signupForm = document.getElementById("signupForm");
const loginForm = document.getElementById("loginForm");

if (signupForm) {
    signupForm.addEventListener("submit", handleSignup);
} else {
    console.error("Signup form not found.");
}

if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
} else {
    console.error("Login form not found.");
}

// Attach Event Listener for "Join Discord" Button
const discordButton = document.querySelector(".discord-button");
if (discordButton) {
    discordButton.addEventListener("click", openDiscord);
} else {
    console.error("Discord button not found.");
}