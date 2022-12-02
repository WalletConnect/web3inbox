import React, { Fragment } from "react";
import { Navigate } from "react-router-dom";
import { useAccount } from "wagmi";

interface AuthProtectedPageProps {
  children: React.ReactNode;
}

const AuthProtectedPage: React.FC<AuthProtectedPageProps> = ({ children }) => {
  const { address } = useAccount();
  if (!address) {
    return <Navigate to="/login" />;
  }
  return <Fragment>{children}</Fragment>;
};

export default AuthProtectedPage;
