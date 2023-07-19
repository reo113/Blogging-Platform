import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Root from "./routes/root";
import ErrorPage from "./ErrorPage";
import Login from "./routes/auth/Login";
import Signup from "./routes/auth/Signup";
// import ProtectedRoute from "./routes/ProtectedRoute";
import AuthProvider from "./contexts/AuthContext";
// import PostList, {loader as postLoader} from "./routes/posts/BlogPost";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      // {
      //   index: true,
      //   element: (
      //     <ProtectedRoute>
      //       <PostList />
      //     </ProtectedRoute>
      //   ),
      //   loader: postLoader,
      // },
      {
        path: "/login",
        element: <Login />,
       
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      // {
      //   path: "jobs/new",
      //   element: (
      //     <ProtectedRoute>
      //       <AddJob />
      //     </ProtectedRoute>
      //   ),
      //   action: addJobAction,
      // },
      // {
      //   path: "jobs/byStatus/:status",
      //   element: (
      //     <ProtectedRoute>
      //       <JobList />
      //     </ProtectedRoute>
      //   ),
      //   loader: jobLoader,
      // },
      // {
      //   path: "jobs/:jobId",
      //   element: (
      //     <ProtectedRoute>
      //       <Job />
      //     </ProtectedRoute>
      //   ),
      //   errorElement: <ErrorPage />,
      //   loader: jobDetailLoader,
      //   action: notesAction,
      // },
      // {
      //   path: "jobs/:jobId/edit",
      //   element: (
      //     <ProtectedRoute>
      //       <EditJob />
      //     </ProtectedRoute>
      //   ),
      //   errorElement: <ErrorPage />,
      //   loader: editJobLoader,
      //   action: editJobAction,
      // },
      // {
      //   path: "notes/:noteId/destroy",
      //   action: destroyNoteAction,
      // },
      // {
      //   path: "notes/:noteId/edit",
      //   action: updateNoteAction,
      // },
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
