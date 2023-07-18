import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import ErrorPage from "./ErrorPage";
import AuthProvider from "./contexts/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import Root, { loader as rootLoader, action as logoutAction } from "./routes/root";
import Login, { action as loginAction } from "./routes/auth/Login";
import Signup, { action as signupAction } from "./routes/auth/Signup";


///////////////////////////
import JobList, { loader as jobLoader } from "./routes/jobs/jobList";
import Job, {
  loader as jobDetailLoader,
  action as notesAction,
} from "./routes/jobs/job";
import AddJob, { action as addJobAction } from "./routes/jobs/AddJob";
import EditJob, {
  loader as editJobLoader,
  action as editJobAction,
} from "./routes/jobs/editJob";
import { action as destroyNoteAction } from "./routes/notes/destroyNote";
import { action as updateNoteAction } from "./routes/notes/updateNote";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    action: logoutAction,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <JobList />
          </ProtectedRoute>
        ),
        loader: jobLoader,
      },
      {
        path: "/login",
        element: <Login />,
        action: loginAction,
      },
      {
        path: "/signup",
        element: <Signup />,
        action: signupAction,
      },
      {
        path: "jobs/new",
        element: <AddJob />,
        action: addJobAction,
      },
      {
        path: "jobs/byStatus/:status",
        element: <JobList />,
        loader: jobLoader,
      },
      {
        path: "jobs/:jobId",
        element: <Job />,
        errorElement: <ErrorPage />,
        loader: jobDetailLoader,
        action: notesAction,
      },
      {
        path: "jobs/:jobId/edit",
        element: <EditJob />,
        errorElement: <ErrorPage />,
        loader: editJobLoader,
        action: editJobAction,
      },
      {
        path: "notes/:noteId/destroy",
        action: destroyNoteAction,
      },
      {
        path: "notes/:noteId/edit",
        action: updateNoteAction,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
