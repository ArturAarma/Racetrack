# 🏍️ Racetrack Info Screens

**Racetrack** is a real-time web application designed for managing go-kart or motorsport race sessions. It provides multiple interfaces for front desk management, race control, lap tracking, and a live leaderboard. Built with **React**, **Node.js**, **Socket.IO**, and **MongoDB**, it enables fast and responsive race operations with real-time data synchronization across clients.

---

## 🚦 Features

### 🧾 Front Desk

- Create and manage upcoming race sessions
- Add, remove or edit sessions and drivers

### 🎮 Race Control Panel

- Start a race and race timer
- Change race modes: Safe, Hazard, Danger
- End the race session

### 🏎️ Lap Tracking

- Log lap completions when drivers cross the finish line
- Update leaderboard rankings and lap counts
- Record and highlight fastest lap per session

### 🏆 Leaderboard

- Real-time display of race standings
- Automatically updates with lap completions
- Shows lap count, position, and fastest lap

---

## 🛠️ Tech Stack

| Tech      | Role                    |
| --------- | ----------------------- |
| React     | Frontend                |
| Node.js   | Backend                 |
| Socket.IO | Real-time communication |
| MongoDB   | Persistent data storage |

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/2Smoothman/racetrack.git
cd racetrack
```

### 2. Install Dependencies

#### Backend

```bash
cd server
npm install
```

#### Frontend

```bash
cd ../client
npm install
```

---

## 🔐 Environment Variables

Create a `.env` file inside the `server/` directory:

```bash
cd ../server
touch .env
```

Add the following environment variable:

```env
MONGO_URI=your-mongodb-atlas-connection-string
```

---

## ☁️ MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign in or create an account.
2. Create a new **free cluster**.
3. Click **Database** → **Connect** → Choose "Connect your application".
4. Copy the connection string, e.g.:
   ```
   mongodb+srv://<username>:<password>@cluster0.mongodb.net/racetrack?retryWrites=true&w=majority
   ```
5. Paste it into your `.env` file as the `MONGO_URI`.

---

## ▶️ Running the App

### Start the Backend

```bash
cd server
npm start
```

### Start the Frontend

```bash
cd ../client
npm start
```

By default, the frontend runs on `http://localhost:3000` and the backend on `http://localhost:4000`.

---

## 📄 License

MIT License. See `LICENSE` file for details.