🎬 CineTrack - Movie & TV Series Discovery App
⚠️ IMPORTANT — TMDB API Key Setup (Required Before Use)
CineTrack uses the TMDB API to load all movie and TV show data. Without a valid API key, the website will not work. Follow these steps before opening the project:

Step 1 — Create a TMDB Account
Go to https://www.themoviedb.org/
Click Join TMDB and create a free account
Verify your email address
Step 2 — Generate an API Key
After logging in, click your profile icon → Settings
On the left sidebar, click API
Click Create under the API section
Select Personal Use as the type
Fill in the required details (write "Personal Project" for app name and description)
For Application URL type: http://localhost
Click Subscribe — your API key will be shown on the same page
Copy the API Key value
Step 3 — Add the API Key to the Project
Open the file js/main.js in a text editor
Find this line near the top (line 4):
const API_KEY = '360f0b0d0922f128b88cbeeda3c410b6';
Replace the key inside the quotes with your own API key:
const API_KEY = 'your_api_key_here';
Save the file
🛠️ Phase 3 Setup — WAMP + MySQL
Step 1 — Install WAMP
Download and install WAMP Server from https://sourceforge.net/projects/wampserver/postdownload
Start WAMP — the icon in the taskbar should turn green
Step 2 — Place Project Files
Copy your entire cinetrack project folder into:
C:/wamp64/www
Step 3 — Import the Database
Open your browser and go to: http://localhost/phpmyadmin
When logging into phpMyAdmin, use the following default WAMP credentials:
Username: root
Password: (leave empty, no password)
Click New on the left sidebar
Type cinetrack as the database name and click Create
Click on the cinetrack database
Click the Import tab at the top
Click Choose File and select database.sql from your project folder
Click Go — the tables will be created automatically
Step 4 — Run the Project
Open your browser and go to:
http://localhost/cinetrack/index.php
📌 Theme
CineTrack is a dark-themed movie and TV series discovery web application inspired by popular streaming platforms like Netflix. Users can discover trending and top-rated movies and TV shows, search for specific titles, and manage a personal watchlist — all powered by the TMDB API.

✨ Features
Home Page — Dynamic carousel with trending movies fetched live from TMDB API
Browse Page — Browse popular movies or TV series and search by title
Watchlist — Save movies and TV shows to a personal watchlist (requires login)
User Authentication — Register, login, logout with PHP sessions and MySQL
Dashboard — Personal dashboard showing watchlist stats and recently added items
Movie/TV Details — Click any card to view full details in a popup modal
Contact Page — Contact form that saves submissions to MySQL database
Responsive Design — Works on desktop, tablet, and mobile devices
📁 File Structure
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
🗄️ Database Tables
Table	Fields
users	id, username, email, password, created_at
watchlist	id, user_id, movie_id, media_type, title, poster, rating, added_at
messages	id, name, email, subject, message, created_at
🛠️ Technologies Used
HTML5, CSS3, Bootstrap 5, JavaScript ES6+
PHP 8, MySQL
TMDB API
WAMP Server / phpMyAdmin
