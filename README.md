# Pantry Roulette — Recipe Finder

A full-stack recipe search web application built with Node.js, Express, SQLite (`better-sqlite3`), and vanilla HTML/CSS/JavaScript.

## Features
- Multi-ingredient chip search with match-count ranking
- SQLite database seeded with 500+ recipes
- Dynamic recipe detail view via URL query parameters (`target.html?id=<id>`)

## Setup & Run
1. Install dependencies: `npm install`
2. Start the server (from inside the `kitchen/` folder): `node server.js`
3. Open `http://localhost:3000/home.html` in your browser.