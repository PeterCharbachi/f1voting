import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export default function Login() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
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
      console.log("Login: Navigerar till /home");
      navigate('/home');
    } catch (err: any) {
      setError(err.message || 'Kunde inte logga in. Kontrollera e-post och lösenord.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (isRegistering && !username) {
        setError('Användarnamn krävs.');
        return;
    }
    if (password !== confirmPassword) {
      setError('Lösenorden matchar inte.');
      return;
    }
    try {
      await register(email, password, username);
      console.log("Login: Navigerar till /home");
      navigate('/home');
    } catch (err: any) {
      setError(err.message || 'Kunde inte registrera. Försök igen.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-background-dark">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-text-light text-3xl font-bold uppercase italic tracking-tighter">
            {isRegistering ? 'Skapa konto' : 'Logga in'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={isRegistering ? handleRegister : handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-muted" htmlFor="email">E-post</label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ange din e-post"
                required
              />
            </div>
            {isRegistering && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-muted" htmlFor="username">Användarnamn</label>
                <Input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Välj ett användarnamn"
                  required
                />
              </div>
            )}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-muted" htmlFor="password">Lösenord</label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ange ditt lösenord"
                required
              />
            </div>
            {isRegistering && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-muted" htmlFor="confirmPassword">Bekräfta lösenord</label>
                <Input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Bekräfta ditt lösenord"
                  required
                />
              </div>
            )}
            {error && <p className="text-primary text-center text-sm !mt-4 animate-shake">{error}</p>}
            <Button type="submit" className="w-full uppercase font-black tracking-widest">
              {isRegistering ? 'Registrera' : 'Logga in'}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <Button variant="link" onClick={() => setIsRegistering(!isRegistering)} className="text-text-muted hover:text-primary transition-colors text-xs uppercase tracking-widest">
              {isRegistering ? 'Har du redan ett konto? Logga in' : 'Saknar du konto? Registrera dig'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

}
