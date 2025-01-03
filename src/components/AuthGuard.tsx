import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../lib/store';

export function AuthGuard({ children }: { children: JSX.Element }) {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}
