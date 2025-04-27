import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import FrontDeskLogin from "./pages/FrontdeskLogin";
import RaceFlags from "./pages/race-flags";
import LapLineTracker from "./pages/LapLineTracker";
import LeaderBoard from "./pages/LeaderBoard";
import { SocketProvider } from "./context/SocketContext";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import FrontDesk from "./pages/front-desk.jsx";
import RaceControl from "./pages/RaceControl";
import RaceCountdown from "./pages/RaceCountdown";
import RaceControlLogin from "./pages/RaceControlLogin";
import LapLineTrackerLogin from "./pages/LapLineTrackerLogin";
import NextRace from "./pages/NextRace";

const root = ReactDOM.createRoot(document.getElementById("root"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/race-control",
    element: <RaceControl />,
  },
  {
    path: "/race-control-login",
    element: <RaceControlLogin />,
  },
  {
    path: "/front-desk",
    element: <FrontDesk />,
  },
  {
    path: "/front-desk-login",
    element: <FrontDeskLogin />,
  },
  {
    path: "/leader-board",
    element: <LeaderBoard />,
  },
  {
    path: "/race-flags",
    element: <RaceFlags />,
  },
  {
    path: "/lap-line-tracker",
    element: <LapLineTracker />,
  },
  {
    path: "/lap-line-tracker-login",
    element: <LapLineTrackerLogin />,
  },
  {
    path: "/race-countdown",
    element: <RaceCountdown />,
  },
  {
    path: "/next-race",
    element: <NextRace />,
  },
]);
root.render(
  <React.StrictMode>
    <SocketProvider>
      {" "}
      {/* Provides socket for the whole app */}
      <RouterProvider router={router} />
    </SocketProvider>
  </React.StrictMode>
);
