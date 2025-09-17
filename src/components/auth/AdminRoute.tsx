import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminRoute = () => {
  const { currentUser: user } = useAuth();

  return user?.role === 'admin' ? <Outlet /> : <Navigate to="/home" replace />;
};

export default AdminRoute;
