# Chess Tournament Management System

A web application to manage chess players, tournaments, and matches — built as a technical assignment for Bytelogik.

## Features

- **Player Management** — Create, view, edit, and delete players
- **Tournament Management** — Create, view, and delete tournaments; add or remove players from a tournament
- **Random Match System** — Generate a round of matches for a tournament: players are randomly shuffled and paired, and a winner is randomly selected for each match
- **Rankings** — View the top 3 players in a tournament (1st, 2nd, 3rd) based on total match wins

## Tech Stack

- **Frontend & Backend:** SvelteKit (TypeScript)
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL (hosted on Neon)
- **ORM:** Prisma

## Project Structure
src/
lib/
server/
prisma.ts        - Shared Prisma client instance
matches.ts        - Random pairing + winner selection logic
routes/
+layout.svelte       - Shared layout with navigation
+page.svelte           - Home page
players/
+page.svelte          - Player list + create/edit/delete UI
+page.server.ts         - Player CRUD server actions
tournaments/
+page.svelte          - Tournament list, players, matches, rankings UI
+page.server.ts         - Tournament CRUD + match generation server actions
prisma/
schema.prisma         - Database schema (Player, Tournament, TournamentPlayer, Match)

## Database Schema

- **Player** - id, name, email
- **Tournament** - id, name
- **TournamentPlayer** - join table linking players to tournaments
- **Match** - records each match's two players, the tournament it belongs to, and the winner

## Running Locally

1. Clone the repository
git clone https://github.com/Poojakk112/chess-tournament-app.git
cd chess-tournament-app

2. Install dependencies
npm install

3. Set up your database connection
   Create a `.env` file in the root with:
DATABASE_URL="your-postgresql-connection-string"

4. Run database migrations
npx prisma migrate dev

5. Start the development server
npm run dev -- --open

6. Open `http://localhost:5173` in your browser

## How the Random Match System Works

1. All players currently in a tournament are fetched
2. They're shuffled randomly using the Fisher-Yates shuffle algorithm
3. Shuffled players are paired two at a time (if there's an odd number, the last player sits out that round)
4. For each pair, a winner is randomly selected
5. Match results are saved to the database and displayed immediately

## Rankings Logic

For each tournament, the number of wins per player is calculated from the match history, sorted in descending order, and the top 3 players are displayed with gold/silver/bronze indicators.