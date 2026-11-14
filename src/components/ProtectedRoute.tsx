import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LoadingState } from './LoadingState';

export const ProtectedRoute: React.FC = () => {
  const { userId, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-[#F6F8F7]">
        <LoadingState />
      </div>
    );
  }

  if (!userId) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
