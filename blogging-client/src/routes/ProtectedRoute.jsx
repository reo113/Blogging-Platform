// src/routes/ProtectedRoute.jsx

import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { PropTypes } from 'prop-types';
import { AuthContext } from "../contexts/AuthContext";

export default function ProtectedRoute({ children }) {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return children;
}
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
