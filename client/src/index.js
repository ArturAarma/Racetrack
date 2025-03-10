import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import RaceControlLogin from "./pages/RaceControlLogin"; // Make sure 'SecurityLogin' is the correct file name
import FrontdeskLogin from "./pages/FrontdeskLogin"; // Make sure 'frontdesklogin' is the correct file name
import FlagBearer from "./pages/FlagBearer";
import RaceFlags from "./pages/race-flags";
import LapLineTracker from "./pages/LapLineTracker";
import { SocketProvider } from "./context/SocketContext";
import Racer from "./pages/Racer";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Frontdesk from "./pages/FrontDesk2";

const root = ReactDOM.createRoot(document.getElementById("root"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/race-control",
    element: <RaceControlLogin />,
  },
  {
    path: "/frontdesk",
    element: <Frontdesk />,
  },
  {
    path: "/flagbearer",
    element: <FlagBearer />,
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
    path: "/racer",
    element: <Racer />,
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
