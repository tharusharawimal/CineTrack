# 🎬 CineTrack - Movie & TV Series Discovery App

---

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
5. Fill in the required details (you can write "Personal Project" for the app name and description)
6. For the Application URL enter this **http://localhost**
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

### ✅ Now the website is ready to use!

---

## 📌 Theme

CineTrack is a dark-themed movie and TV series discovery web application. The theme is inspired by popular streaming platforms like Netflix. Users can discover trending and top-rated movies and TV shows, search for specific titles, and manage a personal watchlist — all powered by the TMDB (The Movie Database) API.

---

## ✨ Features

- **Home Page** — Dynamic carousel with trending movies, trending section, and top-rated section fetched live from TMDB API
- **Browse Page** — Browse popular movies or TV series, search by title, and filter results
- **Watchlist** — Save movies and TV shows to a personal watchlist (requires login). Each user has their own separate watchlist
- **User Authentication** — Register and login system with session management using localStorage
- **Movie/TV Details** — Click any card to view full details including rating, genres, cast, runtime, and overview in a popup modal
- **Contact Page** — Contact form with validation, saves messages to localStorage
- **About Page** — Information about the app, features, and technologies used
- **Responsive Design** — Works on desktop, tablet, and mobile devices

---

## 🛠️ Technologies Used

- HTML5
- CSS3
- Bootstrap 5
- JavaScript (ES6+)
- TMDB API (The Movie Database)
- localStorage (for user accounts, sessions, and watchlist storage)

---

## 📁 File Structure

```
cinetrack/
├── index.html          → Home page
├── browse.html         → Browse & search page
├── watchlist.html      → Personal watchlist page
├── about.html          → About page
├── contact.html        → Contact page
├── login.html          → Login page
├── register.html       → Register page
├── css/
│   └── style.css       → All custom styles
└── js/
    ├── auth.js         → User authentication logic
    ├── main.js         → Core functions, API calls, movie cards
    ├── home.js         → Home page carousel and sections
    ├── browse.js       → Browse and search functionality
    ├── watchlist.js    → Watchlist display and management
    └── contact.js      → Contact form handling
```

---

## 🚀 How to Use

1. **Open** `index.html` in any modern web browser (Chrome, Firefox, Edge)
2. **Register** a new account using the Register page
3. **Login** with your username/email and password
4. **Browse** trending and top-rated content on the Home page
5. **Search** for any movie or TV show using the Browse page
6. **Click** any card to view full details in a popup
7. **Add** movies or TV shows to your watchlist using the `+` button on cards
8. **View and manage** your saved items on the Watchlist page
9. **Contact** us using the Contact form

> ⚠️ An active internet connection is required to load movie data from the TMDB API.

---

## 🔐 User Data Storage

Since this is Phase 2 (no backend yet), all data is stored in the browser's **localStorage**:

> Note: Clearing browser data will remove all saved information. PHP + MySQL backend will be added in Phase 3.

---




