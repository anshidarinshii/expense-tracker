// Handle create account form submission
document.getElementById("create-account-form").addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent form from submitting the traditional way

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    // Check if passwords match
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    // Send registration request to the server
    fetch("/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.message) {
            alert(data.message); // Success message
            window.location.href = "/"; // Redirect to login page after successful registration
        } else {
            alert(data.error); // Error message
        }
    })
    .catch((error) => {
        console.error("Error:", error);
        alert("Registration failed. Please try again.");
    });
});

