import { createBrowserRouter } from "react-router";
import Login from "../features/auth/pages/Login.jsx";
import Register from "../features/auth/pages/Register.jsx";
import Dashboard from "../features/auth/pages/Dashboard.jsx";
import { ProtectedRoute } from "../features/auth/components/ProtectedRoute.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute requireAuth={true}>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: (
      <ProtectedRoute requireAuth={false}>
        <Login />
      </ProtectedRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <ProtectedRoute requireAuth={false}>
        <Register />
      </ProtectedRoute>
    ),
  },
]);

export default router;