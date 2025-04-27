# 🏍️ Racetrack Info Screens

[![Built with React](https://img.shields.io/badge/Built%20with-React-61DAFB?logo=react&logoColor=white&style=flat-square)](https://react.dev/)
[![Powered by Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js&logoColor=white&style=flat-square)](https://nodejs.org/)
[![Real-time with Socket.IO](https://img.shields.io/badge/Real%20Time-Socket.IO-010101?logo=socket.io&logoColor=white&style=flat-square)](https://socket.io/)
[![Database-MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white&style=flat-square)](https://www.mongodb.com/)

---

**Racetrack** is a real-time web application designed for managing go-kart or motorsport race sessions.  
It provides multiple specialized interfaces for front desk management, race control, lap tracking, and a live leaderboard.  
Built with **React**, **Node.js**, **Socket.IO**, and **MongoDB**, it enables fast and responsive race operations with real-time data synchronization across clients.

---

## 🚀 Quick Start

```bash
git clone https://github.com/2Smoothman/racetrack.git
cd racetrack
```

**Frontend:**

```bash
cd client
npm install
npm run build
```

**Backend:**

```bash
cd ../server
npm install
```

**Environment Variables:**  
Create a `.env` file inside `server/`.

**Start the server:**

```bash
npm start        # Production Mode (10-minute timer)
npm run dev      # Development Mode (1-minute timer)
```

Tunnelmole will generate a **public URL** you can use to access the app from other devices.

---

## 📋 Interfaces

### 🧾 Front Desk

- Create and manage upcoming race sessions.
- Add, remove, or edit sessions and drivers.

### 🎮 Race Control Panel

- Start a race and race timer.
- Change race modes: Safe, Hazard, Danger, Finish.
- End the race session.

### 🏎️ Lap Line Tracker

- Log lap completions as drivers cross the finish line.
- Update leaderboard rankings and lap counts.
- Record and highlight fastest lap per session.

### 🏆 Leaderboard

- Real-time display of race standings.
- Automatically updates with each lap completion.
- Shows lap count, position, and fastest lap.

### 🏍️ Next Race

- Display upcoming race sessions and registered drivers.
- Updates automatically when sessions are added or modified.

### ⏳ Race Countdown

- Show a live countdown timer for the ongoing race.

### 🏁 Race Flags

- Display the current race mode flag (Safe/Hazard/Danger/Finish) in real-time.

---

## 🛠️ Tech Stack

| Tech      | Role                    |
| --------- | ----------------------- |
| React     | Frontend                |
| Node.js   | Backend                 |
| Socket.IO | Real-time communication |
| MongoDB   | Persistent data storage |

---

## 🔐 Environment Setup

Inside the `server/` folder, create a `.env` file:

```bash
cd server
touch .env
```

Example content:

```env
MONGO_URI=your-mongodb-atlas-connection-string
FRONTDESK_PW=your-frontdesk-password
RACECONTROL_PW=your-racecontrol-password
LAPLINE_PW=your-lapline-password
```

> ⚠️ **Important:**  
> All three passwords must be defined (`FRONTDESK_PW`, `RACECONTROL_PW`, `LAPLINE_PW`) — otherwise the server will not start.

---

## ☁️ Setting Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign in or create an account.
2. Create a **Free Shared** cluster.
3. Create a database user:
   - Click **Database Access** → **Add New Database User**.
   - Set username (e.g., `racetrack`) and a secure password.
   - Save these credentials.
4. Allow external access:
   - Go to **Network Access** → **Add IP Address** → **Allow Access from Anywhere** (`0.0.0.0/0`).
5. Get your connection string:

   - Go to your cluster → **Connect** → **Connect your application**.
   - Copy the connection string, e.g.:

     ```bash
     mongodb+srv://racetrack:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
     ```

6. Replace `<password>` with your password and use this URL in your `.env` file as `MONGO_URI`.

✅ Done! Your backend can now connect to MongoDB Atlas.

---

## 🌐 Accessing the App from Other Devices

After starting the server, a **Tunnelmole public URL** will be displayed in your terminal.  
Example:

```
Server started on http://localhost:4000
Tunnelmole public URL: https://your-sample-url.tunnelmole.net
```

- Use this URL to access the Racetrack app from any device connected to the internet!

---

## 📄 License

MIT License. See the `LICENSE` file for details.

---
