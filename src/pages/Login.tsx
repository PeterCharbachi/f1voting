import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      console.log("Login: Attempting to navigate to /home");
      navigate('/home');
    } catch (err: any) {
      setError(err.message || 'Failed to log in. Check email and password.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    try {
      await register(email, password);
      await login(email, password);
      console.log("Login: Attempting to navigate to /home");
      navigate('/home');
    } catch (err: any) {
      setError(err.message || 'Failed to register. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-background-dark"> {/* Ensure full background */}
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-text-light text-3xl font-bold uppercase"> {/* F1-like title */}
            {isRegistering ? 'Register for F1 Voting' : 'F1 Voting Login'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={isRegistering ? handleRegister : handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-muted" htmlFor="email">Email</label> {/* Use text-text-muted */}
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-muted" htmlFor="password">Password</label> {/* Use text-text-muted */}
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            {isRegistering && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-muted" htmlFor="confirmPassword">Confirm Password</label> {/* Use text-text-muted */}
                <Input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                />
              </div>
            )}
            {error && <p className="text-primary text-center !mt-4">{error}</p>} {/* Use text-primary for errors */}
            <Button type="submit" className="w-full">
              {isRegistering ? 'Register' : 'Login'}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <Button variant="link" onClick={() => setIsRegistering(!isRegistering)}>
              {isRegistering ? 'Already have an account? Login' : 'Don\'t have an account? Register'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

}
