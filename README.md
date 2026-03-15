# 🎬 CineTrack - Movie & TV Series Discovery App

## ⚠️ IMPORTANT — TMDB API Key Setup (Required Before Use)

CineTrack uses the TMDB API to load all movie and TV show data. **Without a valid API key, the website will not work.** Follow these steps before opening the project:

### Step 1 — Create a TMDB Account
1. Go to https://www.themoviedb.org/
2. Click **Join TMDB** and create a free account
3. Verify your email address

### Step 2 — Generate an API Key
1. After logging in, click your profile icon → **Settings**
2. On the left sidebar, click **API**
3. Click **Create** under the API section
4. Select **Personal Use** as the type
5. Fill in the required details (write "Personal Project" for app name and description)
6. For **Application URL** type: `http://localhost`
7. Click **Subscribe** — your API key will be shown on the same page
8. Copy the **API Key** value

### Step 3 — Add the API Key to the Project
1. Open the file `js/main.js` in a text editor
2. Find this line near the top (line 4):
```javascript
const API_KEY = '360f0b0d0922f128b88cbeeda3c410b6';
```
3. Replace the key inside the quotes with your own API key:
```javascript
const API_KEY = 'your_api_key_here';
```
4. Save the file

---

## 🛠️ Phase 3 Setup — WAMP + MySQL

### Step 1 — Install WAMP
1. Download and install **WAMP Server** from https://sourceforge.net/projects/wampserver/postdownload
2. Start WAMP — the icon in the taskbar should turn **green**

### Step 2 — Place Project Files
1. Copy your entire `cinetrack` project folder into:
```
C:/wamp64/www/cinetrack
```

### Step 3 — Import the Database
1. Open your browser and go to: `http://localhost/phpmyadmin`
2. When logging into phpMyAdmin, use the following default WAMP credentials:
	- Username: root
	- Password: (leave empty, no password)
3. Click **New** on the left sidebar
4. Type `cinetrack` as the database name and click **Create**
5. Click on the `cinetrack` database
6. Click the **Import** tab at the top
7. Click **Choose File** and select `database.sql` from your project folder
8. Click **Go** — the tables will be created automatically

### Step 4 — Run the Project
1. Open your browser and go to:
```
http://localhost/cinetrack/index.php
```

---

## 📌 Theme

CineTrack is a dark-themed movie and TV series discovery web application inspired by popular streaming platforms like Netflix. Users can discover trending and top-rated movies and TV shows, search for specific titles, and manage a personal watchlist — all powered by the TMDB API.

---

## ✨ Features

- **Home Page** — Dynamic carousel with trending movies fetched live from TMDB API
- **Browse Page** — Browse popular movies or TV series and search by title
- **Watchlist** — Save movies and TV shows to a personal watchlist (requires login)
- **User Authentication** — Register, login, logout with PHP sessions and MySQL
- **Dashboard** — Personal dashboard showing watchlist stats and recently added items
- **Movie/TV Details** — Click any card to view full details in a popup modal
- **Contact Page** — Contact form that saves submissions to MySQL database
- **Responsive Design** — Works on desktop, tablet, and mobile devices

---

## 📁 File Structure

```
cinetrack/
├── index.php               → Home page
├── dashboard.php           → User dashboard
├── watchlist_api.php       → Watchlist database API
├── contact.php             → Contact form handler
├── database.sql            → MySQL database export
├── browse.html             → Browse & search page
├── watchlist.html          → Watchlist page
├── about.html              → About page
├── contact.html            → Contact page
├── login.html              → Login page
├── register.html           → Register page
├── includes/
│   ├── db.php              → Database connection
│   └── functions.php       → Helper functions
├── auth/
│   ├── register.php        → Registration logic
│   ├── login.php           → Login logic
│   └── logout.php          → Logout logic
├── css/
│   └── style.css           → All custom styles
└── js/
    ├── auth.js             → Frontend auth logic
    ├── main.js             → Core functions & API calls
    ├── home.js             → Home page carousel
    ├── browse.js           → Browse and search
    ├── watchlist.js        → Watchlist display
    └── contact.js          → Contact form
```

---

## 🗄️ Database Tables

| Table | Fields |
|-------|--------|
| `users` | id, username, email, password, created_at |
| `watchlist` | id, user_id, movie_id, media_type, title, poster, rating, added_at |
| `messages` | id, name, email, subject, message, created_at |

---

## 🛠️ Technologies Used

- HTML5, CSS3, Bootstrap 5, JavaScript ES6+
- PHP 8, MySQL
- TMDB API
- WAMP Server / phpMyAdmin

---

