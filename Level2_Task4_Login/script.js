// ================================
// Login Authentication System
// ================================

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const showRegisterBtn = document.getElementById("showRegisterBtn");

const loginMessage = document.getElementById("loginMessage");
const registerMessage = document.getElementById("registerMessage");


// ================================
// Storage Helpers
// ================================

function getUsers() {
    return JSON.parse(localStorage.getItem("authUsers")) || [];
}

function saveUsers(users) {
    localStorage.setItem("authUsers", JSON.stringify(users));
}


// ================================
// Password Hashing
// ================================

async function hashPassword(password) {

    const encoder = new TextEncoder();

    const data = encoder.encode(password);

    const hashBuffer = await crypto.subtle.digest(
        "SHA-256",
        data
    );

    const hashArray = Array.from(
        new Uint8Array(hashBuffer)
    );

    return hashArray
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");
}


// ================================
// Password Validation
// ================================

function isValidPassword(password) {

    const passwordPattern =
        /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

    return passwordPattern.test(password);
}


// ================================
// Show Message
// ================================

function showMessage(element, message) {
    element.textContent = message;
}


// ================================
// Registration
// ================================

registerForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const name =
        document.getElementById("registerName").value.trim();

    const email =
        document.getElementById("registerEmail").value
            .trim()
            .toLowerCase();

    const password =
        document.getElementById("registerPassword").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;


    // Validate password
    if (!isValidPassword(password)) {

        showMessage(
            registerMessage,
            "Password must contain at least 8 characters, including a letter and a number."
        );

        return;
    }


    // Check matching passwords
    if (password !== confirmPassword) {

        showMessage(
            registerMessage,
            "Passwords do not match."
        );

        return;
    }


    // Get existing users
    const users = getUsers();


    // Check duplicate email
    const existingUser = users.find(function (user) {
        return user.email === email;
    });

    if (existingUser) {

        showMessage(
            registerMessage,
            "An account with this email already exists."
        );

        return;
    }


    // Hash password before storing
    const passwordHash = await hashPassword(password);


    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        passwordHash: passwordHash
    };


    users.push(newUser);

    saveUsers(users);


    showMessage(
        registerMessage,
        "Account created successfully. You can now sign in."
    );


    registerForm.reset();
});


// ================================
// Login
// ================================

loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const email =
        document.getElementById("loginEmail").value
            .trim()
            .toLowerCase();

    const password =
        document.getElementById("loginPassword").value;


    const users = getUsers();


    // Find user
    const user = users.find(function (user) {
        return user.email === email;
    });


    if (!user) {

        showMessage(
            loginMessage,
            "Invalid email or password."
        );

        return;
    }


    // Hash entered password
    const passwordHash = await hashPassword(password);


    // Compare hashes
    if (passwordHash !== user.passwordHash) {

        showMessage(
            loginMessage,
            "Invalid email or password."
        );

        return;
    }


    // Store logged-in session
    sessionStorage.setItem(
        "loggedInUser",
        JSON.stringify({
            id: user.id,
            name: user.name,
            email: user.email
        })
    );


    // Open dashboard
    showDashboard(user);
});


// ================================
// Dashboard
// ================================

function showDashboard(user) {

    document.querySelector(".auth-card").innerHTML = `
        <div class="auth-header">
            <p class="eyebrow">AUTHENTICATED</p>

            <h1>Welcome, ${escapeHTML(user.name)}</h1>

            <p>
                You have successfully signed in.
            </p>
        </div>

        <div class="dashboard-content">

            <div class="summary-card">
                <strong>Account Email</strong>
                <p>${escapeHTML(user.email)}</p>
            </div>

            <button
                type="button"
                id="logoutBtn"
                class="primary-btn"
            >
                Logout
            </button>

        </div>
    `;


    document
        .getElementById("logoutBtn")
        .addEventListener("click", logout);
}


// ================================
// Logout
// ================================

function logout() {

    sessionStorage.removeItem("loggedInUser");

    location.reload();
}


// ================================
// Show Registration Form
// ================================

showRegisterBtn.addEventListener("click", function () {

    registerForm.classList.toggle("hidden");

    if (!registerForm.classList.contains("hidden")) {
        registerForm.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }
});


// ================================
// Escape HTML
// ================================

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


// ================================
// Restore Existing Session
// ================================

function checkExistingSession() {

    const storedUser =
        sessionStorage.getItem("loggedInUser");

    if (!storedUser) {
        return;
    }


    try {

        const user = JSON.parse(storedUser);

        if (user && user.name && user.email) {
            showDashboard(user);
        }

    } catch (error) {

        sessionStorage.removeItem("loggedInUser");
    }
}


// ================================
// Initial Check
// ================================

checkExistingSession();