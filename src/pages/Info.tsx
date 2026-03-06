import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

export default function Info() {
  return (
    <div className="space-y-8 p-4">
      <h1 className="text-4xl font-bold text-white text-center uppercase tracking-tight">How it Works & Scoring</h1> 

      <Card>
        <CardHeader>
          <CardTitle>Welcome to F1 Voting App!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-text-light"> 
          <p>This application allows you to predict the podium (top 3 drivers) and the Pole Position for each Formula 1 Grand Prix. Compete with your friends and other users to see who has the best F1 knowledge!</p>
          <p>You can submit your predictions for upcoming races on the Home page. Once a race is finished and its official results are in, you can check your score and the global leaderboard on the Scoreboard page.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Scoring System</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-text-light"> 
          <p>Points are awarded based on the accuracy of your prediction for each race:</p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Exact Position:</strong>
              <ul className="list-circle list-inside ml-4">
                <li>1st place correct: <strong className="text-primary">10 points</strong></li> 
                <li>2nd place correct: <strong className="text-primary">8 points</strong></li>
                <li>3rd place correct: <strong className="text-primary">5 points</strong></li>
              </ul>
            </li>
            <li><strong>Pole Position:</strong>
                <ul className="list-circle list-inside ml-4">
                    <li>Correct Pole Position: <strong className="text-primary">5 points</strong></li>
                </ul>
            </li>
            <li><strong>Driver on Podium, but Incorrect Position:</strong>
              <ul className="list-circle list-inside ml-4">
                <li>For each driver you predicted to be on the podium (top 3) who *is* on the actual podium, but in a different position: <strong className="text-primary">3 points</strong></li>
              </ul>
            </li>
          </ul>
          <p>Example:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Your Prediction: [VER, PER, LEC, VER (Pole)]</li>
            <li>Actual Result: [VER, SAI, PER, LEC (Pole)]</li>
            <li>Scoring:
              <ul className="list-circle list-inside ml-4">
                <li>VER (1st) - Correct position: <strong className="text-primary">+10 points</strong></li>
                <li>PER (2nd) - On podium (3rd), but incorrect position: <strong className="text-primary">+3 points</strong></li>
                <li>LEC (3rd) - Not on podium: <strong className="text-text-muted">+0 points</strong></li> 
                <li>VER (Pole) - Incorrect (LEC had pole): <strong className="text-text-muted">+0 points</strong></li>
                <li>Total: <strong className="text-primary">13 points</strong></li>
              </ul>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Admin Functionality</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-text-light"> 
          <p>Users with an 'admin' role have access to an Admin Panel. From here, they can:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Manage user accounts (view, change roles, delete, update passwords).</li>
            <li>Manage user votes (view and update predictions for any user and race).</li>
            <li>Update race results (this functionality is not yet fully implemented in the UI, but the mock API supports it).</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}