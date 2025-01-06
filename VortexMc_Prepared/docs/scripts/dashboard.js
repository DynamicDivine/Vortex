// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", () => {
    // Retrieve the username from localStorage and display it on the dashboard
    const username = localStorage.getItem("username");
    const usernameElement = document.getElementById("dashboardUsername");

    if (username) {
        usernameElement.textContent = username;
    } else {
        usernameElement.textContent = "Guest"; // Default to Guest if no username is found
    }
});

// Function to log out and reset the username
function logoutUser() {
    localStorage.removeItem("username"); // Clear the username from localStorage
    const usernameElement = document.getElementById("dashboardUsername");
    usernameElement.textContent = "Guest"; // Reset to Guest
}

// Open and Close Modal Functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = "flex"; // Display modal
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = "none"; // Hide modal
}

// Change Password Handler
async function handleChangePassword(event) {
    event.preventDefault();

    const currentPassword = document.getElementById("currentPassword").value.trim();
    const newPassword = document.getElementById("newPassword").value.trim();
    const confirmNewPassword = document.getElementById("confirmNewPassword").value.trim();

    if (!currentPassword || !newPassword || !confirmNewPassword) {
        alert("Please fill out all fields.");
        return;
    }

    if (newPassword !== confirmNewPassword) {
        alert("New passwords do not match.");
        return;
    }

    try {
        const response = await fetch("/change-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ currentPassword, newPassword }),
        });

        const result = await response.json();

        if (response.ok) {
            alert("Password changed successfully!");
            closeModal("changePasswordModal");
        } else {
            alert(result.message || "Failed to change password.");
        }
    } catch (error) {
        console.error("Error during password change:", error);
        alert("An error occurred while changing the password.");
    }
}

// Change Username Handler
async function handleChangeUsername(event) {
    event.preventDefault();

    const currentUsername = document.getElementById("currentUsername").value.trim();
    const newUsername = document.getElementById("newUsername").value.trim();

    if (!currentUsername || !newUsername) {
        alert("Please fill out all fields.");
        return;
    }

    try {
        const response = await fetch("/change-username", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ currentUsername, newUsername }),
        });

        const result = await response.json();

        if (response.ok) {
            alert("Username changed successfully!");
            localStorage.setItem("username", newUsername); // Update username in localStorage
            const usernameElement = document.getElementById("dashboardUsername");
            usernameElement.textContent = newUsername; // Update the displayed username
            closeModal("changeUsernameModal");
        } else {
            alert(result.message || "Failed to change username.");
        }
    } catch (error) {
        console.error("Error during username change:", error);
        alert("An error occurred while changing the username.");
    }
}

// Function to handle the "Join Discord" button
function openDiscord() {
    window.open("https://discord.gg/RgGmTjSMby", "_blank"); // Replace with your Discord invite link
}

// Add Event Listeners for Form Submissions
const passwordForm = document.getElementById("changePasswordForm");
const usernameForm = document.getElementById("changeUsernameForm");

if (passwordForm) {
    passwordForm.addEventListener("submit", handleChangePassword);
}

if (usernameForm) {
    usernameForm.addEventListener("submit", handleChangeUsername);
}

// Optional: Add a logout button handler
const logoutButton = document.getElementById("logoutButton"); // Ensure the button exists in your HTML
if (logoutButton) {
    logoutButton.addEventListener("click", logoutUser);
}

// Attach Event Listener for "Join Discord" Button
const discordButton = document.querySelector(".discord-button");
if (discordButton) {
    discordButton.addEventListener("click", openDiscord);
} else {
    console.error("Discord button not found.");
}