# 🏁 Racetrack App – Data Flow & Interface Communication

## 📋 Overview

The Racetrack app manages race sessions and real-time race tracking across multiple interfaces using **Socket.io** for live communication.

The system is structured around several key interfaces:

- **FrontDesk**: Adds and edits upcoming race sessions.
- **RaceControl**: Starts the race, sets race modes, and controls race flow.
- **LapLineTracker**: Tracks lap completions.
- **LeaderBoard**: Displays real-time positions and lap data.
- **RaceCountdown**: Displays time remaining.
- **RaceFlag**: Shows the current race status flag.
- **NextRace**: Displays upcoming sessions.

The **core object** passed between these interfaces is the `currentSession`, which represents the active race session in real-time.

---

## 🏗️ Sessions Array (from FrontDesk)

### Example `sessions` Array

```json
[
  {
    "name": "First Session",
    "drivers": [
      { "car": 1, "name": "Michael", "laps": [], "bestLap": null },
      { "car": 2, "name": "John", "laps": [], "bestLap": null },
      { "car": 3, "name": "Tim", "laps": [], "bestLap": null },
      { "car": 4, "name": "Tom", "laps": [], "bestLap": null },
      { "car": 5, "name": "Jack", "laps": [], "bestLap": null },
      { "car": 6, "name": "Dan", "laps": [], "bestLap": null },
      { "car": 7, "name": "Bob", "laps": [], "bestLap": null },
      { "car": 8, "name": "Rob", "laps": [], "bestLap": null }
    ],
    "isConfirmed": true,
    "isActive": false,
    "isFinished": false,
    "raceMode": "danger",
    "startTime": null,
    "leaderBoard": []
  },
  {
    "name": "Session Two",
    "drivers": [
      { "car": 1, "name": "Max", "laps": [], "bestLap": null },
      { "car": 2, "name": "Lando", "laps": [], "bestLap": null },
      { "car": 3, "name": "Oscar", "laps": [], "bestLap": null },
      { "car": 4, "name": "George", "laps": [], "bestLap": null },
      { "car": 5, "name": "Carlos", "laps": [], "bestLap": null },
      { "car": 6, "name": "Lewis", "laps": [], "bestLap": null },
      { "car": 7, "name": "Charles", "laps": [], "bestLap": null },
      { "car": 8, "name": "Yuki", "laps": [], "bestLap": null }
    ],
    "isConfirmed": true,
    "isActive": false,
    "isFinished": false,
    "raceMode": "danger",
    "startTime": null,
    "leaderBoard": []
  }
]
```

---

## 🔁 Data Flow Summary

### Step-by-step Flow:

1. **FrontDesk**

   - Creates or updates `sessions`.
   - Emits the `sessions` array to **RaceControl**.

2. **RaceControl**

   - Listens for the `sessions` array.
   - Picks the first session with `"isConfirmed": true`.
   - Sets it as `currentSession` and removes it from `sessions`.
   - Emits `currentSession` to all listening interfaces.

3. **LapLineTracker**, **LeaderBoard**, **RaceCountdown**, **RaceFlag**

   - All receive the same `currentSession` via **Socket.io**.
   - Only **LapLineTracker** updates `currentSession` and emits changes back.
   - **RaceControl** listens to updated `currentSession` and re-broadcasts.

4. **NextRace**
   - Listens to the updated `sessions` array to show upcoming races.

---

## 📦 Example `currentSession` (After Confirmation)

```json
{
  "name": "First Session",
  "drivers": [
    { "car": 1, "name": "Michael", "laps": [], "bestLap": null },
    { "car": 2, "name": "John", "laps": [], "bestLap": null },
    { "car": 3, "name": "Tim", "laps": [], "bestLap": null },
    { "car": 4, "name": "Tom", "laps": [], "bestLap": null },
    { "car": 5, "name": "Jack", "laps": [], "bestLap": null },
    { "car": 6, "name": "Dan", "laps": [], "bestLap": null },
    { "car": 7, "name": "Bob", "laps": [], "bestLap": null },
    { "car": 8, "name": "Rob", "laps": [], "bestLap": null }
  ],
  "isConfirmed": true,
  "isActive": false,
  "isFinished": false,
  "raceMode": "danger",
  "startTime": null,
  "leaderBoard": []
}
```

---

## 🚦 Race Start (`RaceControl`)

```json
{
  "name": "First Session",
  "drivers": [
    { "car": 1, "name": "Michael", "laps": [], "bestLap": null },
    { "car": 2, "name": "John", "laps": [], "bestLap": null },
    { "car": 3, "name": "Tim", "laps": [], "bestLap": null },
    { "car": 4, "name": "Tom", "laps": [], "bestLap": null },
    { "car": 5, "name": "Jack", "laps": [], "bestLap": null },
    { "car": 6, "name": "Dan", "laps": [], "bestLap": null },
    { "car": 7, "name": "Bob", "laps": [], "bestLap": null },
    { "car": 8, "name": "Rob", "laps": [], "bestLap": null }
  ],
  "isConfirmed": true,
  "isActive": true,
  "isFinished": false,
  "raceMode": "safe",
  "startTime": 1744696564740,
  "leaderBoard": [
    { "car": 1, "name": "Michael", "laps": [], "bestLap": null },
    { "car": 2, "name": "John", "laps": [], "bestLap": null },
    { "car": 3, "name": "Tim", "laps": [], "bestLap": null },
    { "car": 4, "name": "Tom", "laps": [], "bestLap": null },
    { "car": 5, "name": "Jack", "laps": [], "bestLap": null },
    { "car": 6, "name": "Dan", "laps": [], "bestLap": null },
    { "car": 7, "name": "Bob", "laps": [], "bestLap": null },
    { "car": 8, "name": "Rob", "laps": [], "bestLap": null }
  ]
}
```

---

## 🕹 Lap Updates (`LapLineTracker`)

```json
{
  "name": "First Session",
  "drivers": [
    { "car": 1, "name": "Michael", "laps": [100.31, 10.4], "bestLap": 10.4, "lapStartTime": 1744696675454 },
    { "car": 2, "name": "John", "laps": [94.97, 12.75, 9.03, 1.99], "bestLap": 1.99, "lapStartTime": 1744696683481 },
    { "car": 3, "name": "Tim", "laps": [97.56, 17.5], "bestLap": 17.5, "lapStartTime": 1744696679798 },
    { "car": 4, "name": "Tom", "laps": [101.5, 8.38, 4.39], "bestLap": 4.39, "lapStartTime": 1744696679014 },
    { "car": 5, "name": "Jack", "laps": [104.22, 7.21], "bestLap": 7.21, "lapStartTime": 1744696676177 },
    { "car": 6, "name": "Dan", "laps": [105.39, 7.87], "bestLap": 7.87, "lapStartTime": 1744696677999 },
    { "car": 7, "name": "Bob", "laps": [102.94, 5.98], "bestLap": 5.98, "lapStartTime": 1744696673660 },
    { "car": 8, "name": "Rob", "laps": [106.54, 5.69], "bestLap": 5.69, "lapStartTime": 1744696676970 }
  ],
  "isConfirmed": true,
  "isActive": true,
  "isFinished": false,
  "raceMode": "safe",
  "startTime": 1744696564740,
  "leaderBoard": [
    { "car": 2, "name": "John", "laps": [94.97, 12.75, 9.03, 1.99], "bestLap": 1.99, "lapStartTime": 1744696683481 },
    { "car": 4, "name": "Tom", "laps": [101.5, 8.38, 4.39], "bestLap": 4.39, "lapStartTime": 1744696679014 },
    { "car": 8, "name": "Rob", "laps": [106.54, 5.69], "bestLap": 5.69, "lapStartTime": 1744696676970 },
    { "car": 7, "name": "Bob", "laps": [102.94, 5.98], "bestLap": 5.98, "lapStartTime": 1744696673660 },
    { "car": 5, "name": "Jack", "laps": [104.22, 7.21], "bestLap": 7.21, "lapStartTime": 1744696676177 },
    { "car": 6, "name": "Dan", "laps": [105.39, 7.87], "bestLap": 7.87, "lapStartTime": 1744696677999 },
    { "car": 1, "name": "Michael", "laps": [100.31, 10.4], "bestLap": 10.4, "lapStartTime": 1744696675454 },
    { "car": 3, "name": "Tim", "laps": [97.56, 17.5], "bestLap": 17.5, "lapStartTime": 1744696679798 }
  ]
}
```

---

## 📊 Interface Roles at a Glance

| Interface      | Sends Data?         | Listens to Data?                | Description                           |
| -------------- | ------------------- | ------------------------------- | ------------------------------------- |
| FrontDesk      | ✅ `sessions`       | ❌                              | Manages upcoming sessions             |
| RaceControl    | ✅ `currentSession` | ✅ `sessions`, `currentSession` | Controls the race, sets race mode     |
| LapLineTracker | ✅ `currentSession` | ✅ `currentSession`             | Updates laps, best lap, and lap times |
| LeaderBoard    | ❌                  | ✅ `currentSession`             | Displays live driver positions        |
| RaceCountdown  | ❌                  | ✅ `currentSession`             | Displays countdown timer              |
| RaceFlag       | ❌                  | ✅ `currentSession`             | Displays current race status flag     |
| NextRace       | ❌                  | ✅ `sessions`                   | Shows upcoming race sessions          |

---

## 📉 Visual Flowchart (Text-Based)

```plaintext
FrontDesk
   │
   ├── Emits sessions[] ───────┐
   │                           ▼
RaceControl               NextRace
   │
   ├── Sets currentSession{}
   │
   └── Emits currentSession{} ─────────────┐
        │                                  ▼
        ▼                            LapLineTracker
  currentSession{}                    (updates laps)
        │                                │
        ├─────────────────┐              ▼
        ▼                 ▼          Emits updated
LeaderBoard       RaceCountdown     currentSession
                  RaceFlag                │
                                          ▼
                                   RaceControl (updates again)
```
