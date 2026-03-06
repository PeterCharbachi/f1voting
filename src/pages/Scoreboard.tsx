import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { calculatePoints } from '../services/scoring';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Table, TableHeader, TableBody, Th, Tr, Td } from '../components/ui/Table';
import Select from '../components/ui/Select';
import UserPointsChart from '../components/UserPointsChart';
import { getAllUsers } from '../services/firebaseApi';

interface Driver {
  id: string;
  name: string;
}

interface User {
  uid: string;
  email: string;
  role: 'user' | 'admin';
}

const PredictionDisplay = ({ prediction, drivers }: { prediction: string[], drivers: Driver[] }) => (
    <div className="space-y-1 text-sm">
        <p><span className="font-bold text-gold w-8 inline-block">1st</span> {drivers.find(d => d.id === prediction[0])?.name || 'N/A'}</p>
        <p><span className="font-bold text-silver w-8 inline-block">2nd</span> {drivers.find(d => d.id === prediction[1])?.name || 'N/A'}</p>
        <p><span className="font-bold text-bronze w-8 inline-block">3rd</span> {drivers.find(d => d.id === prediction[2])?.name || 'N/A'}</p>
        <p><span className="font-bold text-primary w-8 inline-block">Pole</span> {drivers.find(d => d.id === prediction[3])?.name || 'N/A'}</p>
    </div>
);

const TabButton = ({ isActive, onClick, children }: { isActive: boolean, onClick: () => void, children: React.ReactNode }) => (
    <button 
        onClick={onClick} 
        className={`py-2 px-4 text-sm font-semibold rounded-t-lg transition-colors duration-300 ${isActive ? 'bg-background-medium text-primary' : 'bg-background-light text-text-muted hover:bg-background-medium'}`}> 
        {children}
    </button>
);

const generateColors = (numColors: number) => {
  const colors = [];
  const baseHues = [0, 60, 120, 180, 240, 300]; 
  for (let i = 0; i < numColors; i++) {
    const hue = baseHues[i % baseHues.length] + (Math.floor(i / baseHues.length) * 30); 
    colors.push(`hsl(${hue}, 70%, 50%)`);
  }
  return colors;
};

export default function Scoreboard() {
  const [activeTab, setActiveTab] = useState('personal');
  const [selectedRaceId, setSelectedRaceId] = useState<string | null>(null);
  const [allAppUsers, setAllAppUsers] = useState<User[]>([]); 
  const [selectedUsersForComparison, setSelectedUsersForComparison] = useState<string[]>([]); // Stores UIDs
  const { currentUser: user } = useAuth();
  const { races, drivers, userVotes, predictions, currentSeason, setCurrentSeason } = useData(); // Destructure currentSeason and setCurrentSeason

  

  useEffect(() => {
    if (activeTab === 'raceDetails' && races.length > 0 && selectedRaceId === null) {
      const firstFinishedRace = races.find(r => r.result);
      if (firstFinishedRace) {
        setSelectedRaceId(firstFinishedRace.id);
      } else if (races.length > 0) {
        setSelectedRaceId(races[0].id);
      }
    }
  }, [activeTab, races, selectedRaceId]);

  useEffect(() => {
    const fetchAllAppUsers = async () => {
      try {
        const response = await getAllUsers();
        if (response.success) {
          setAllAppUsers(response.data as User[]);
        }
      } catch (err) {
        console.error("Failed to fetch all app users:", err);
      }
    };
    fetchAllAppUsers();
  }, []);

  const handleUserSelectionForComparison = (uid: string, isChecked: boolean) => {
    setSelectedUsersForComparison(prev =>
      isChecked ? [...prev, uid] : prev.filter(u => u !== uid)
    );
  };

  const handleSeasonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentSeason(Number(event.target.value));
  };

  const renderPersonalScoreboard = () => {
    const filteredRaces = races.filter(r => r.year === currentSeason && r.result); // Filter by currentSeason
    const finishedRaces = filteredRaces.filter(r => r.result);

    return (
        <Table>
            <TableHeader>
                <Th>Race</Th>
                <Th>Your Vote</Th>
                <Th>Actual Result</Th>
                <Th className="text-center">Points</Th>
            </TableHeader>
            <TableBody>
                {finishedRaces.length > 0 ? finishedRaces.map((race) => {
                    const vote = userVotes.find(v => v.raceId === race.id);
                    const points = calculatePoints(vote, race.result);
                    return (
                        <Tr key={race.id}>
                            <Td className="font-semibold">{race.name}</Td>
                            <Td>{vote ? <PredictionDisplay prediction={vote.prediction} drivers={drivers} /> : <span className="text-text-muted">No vote</span>}</Td>
                            <Td>{race.result ? <PredictionDisplay prediction={race.result} drivers={drivers} /> : 'N/A'}</Td>
                            <Td className="font-bold text-2xl text-center text-primary">{points}</Td>
                        </Tr>
                    );
                }) : (
                    <Tr><Td colSpan={4} className="text-center text-text-muted py-8">No finished races for {currentSeason} to display.</Td></Tr>
                )}
            </TableBody>
        </Table>
    );
  };

  const renderGlobalLeaderboard = () => {
    const userScores: { [key: string]: number } = {};
    const filteredRaces = races.filter(r => r.year === currentSeason && r.result); // Filter by currentSeason

    predictions.forEach(vote => {
      const race = filteredRaces.find(r => r.id === vote.raceId); // Find race within filtered races
      if (race && race.result) {
        const points = calculatePoints(vote, race.result);
        userScores[vote.userId] = (userScores[vote.userId] || 0) + points;
      }
    });

    const leaderboard = Object.entries(userScores)
      .map(([uid, totalPoints]) => {
        const user = allAppUsers.find(u => u.uid === uid);
        return { uid, username: (user as any)?.username || user?.email || 'Unknown User', totalPoints };
      })
      .sort((a, b) => b.totalPoints - a.totalPoints);

    return (
        <Table>
            <TableHeader>
                <Th className="text-center">Rank</Th>
                <Th>User</Th>
                <Th>Total Points</Th>
            </TableHeader>
            <TableBody>
                {leaderboard.length > 0 ? leaderboard.map((entry, index) => (
                    <Tr key={entry.uid}>
                        <Td className="font-bold text-lg text-center">{index + 1}</Td>
                        <Td className="font-semibold">{entry.username}</Td>
                        <Td className="font-bold text-2xl text-primary">{entry.totalPoints}</Td>
                    </Tr>
                )) : (
                    <Tr><Td colSpan={3} className="text-center text-text-muted py-8">No scores to display yet for {currentSeason}.</Td></Tr>
                )}
            </TableBody>
        </Table>
    );
  };

  const renderRaceDetails = () => {
    const filteredRaces = races.filter(r => r.year === currentSeason); // Filter by currentSeason
    const selectedRace = filteredRaces.find(r => r.id === selectedRaceId);

    if (!selectedRace) {
      return <p className="text-center text-text-muted py-8">Please select a race for {currentSeason}.</p>;
    }

    const votesForSelectedRace = predictions.filter(vote => vote.raceId === selectedRace.id); 
    const userScoresForRace: { userId: string, points: number, prediction: string[] }[] = [];

    votesForSelectedRace.forEach(vote => {
      const points = calculatePoints(vote, selectedRace.result);
      userScoresForRace.push({ userId: vote.userId, points, prediction: vote.prediction });
    });

    userScoresForRace.sort((a, b) => b.points - a.points || a.userId.localeCompare(b.userId));

    const maxPoints = userScoresForRace.length > 0 ? Math.max(...userScoresForRace.map(s => s.points)) : 0;

    return (
      <div className="space-y-4 p-4">
        <div className="flex items-center space-x-2">
          <label htmlFor="race-select" className="text-text-muted">Select Race:</label>
          <Select
            id="race-select"
            value={selectedRaceId ?? ''}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedRaceId(e.target.value)}
            className="w-full max-w-xs"
          >
            <option value="" disabled>Choose a race...</option>
            {filteredRaces.map(race => (
              <option key={race.id} value={race.id}>{race.name} ({race.date})</option>
            ))}
          </Select>
        </div>

        {selectedRace.result && (
          <Card className="bg-background-medium">
            <CardHeader>
              <CardTitle>Actual Result: {selectedRace.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <PredictionDisplay prediction={selectedRace.result} drivers={drivers} />
            </CardContent>
          </Card>
        )}

        <h3 className="text-xl font-bold text-text-light uppercase mt-6">User Predictions & Scores</h3>
        <Table>
          <TableHeader>
            <Th>User</Th>
            <Th>Prediction</Th>
            <Th className="text-center">Points</Th>
          </TableHeader>
          <TableBody>
            {userScoresForRace.length > 0 ? userScoresForRace.map((entry) => {
              const user = allAppUsers.find(u => u.uid === entry.userId);
              return (
                <Tr key={entry.userId} className={entry.points === maxPoints && maxPoints > 0 ? 'bg-primary/20' : ''}> 
                  <Td className="font-semibold">{(user as any)?.username || user?.email || 'Unknown User'} {entry.points === maxPoints && maxPoints > 0 && <span className="text-primary">(Winner)</span>}</Td>
                  <Td><PredictionDisplay prediction={entry.prediction} drivers={drivers} /></Td>
                  <Td className="font-bold text-lg text-center text-primary">{entry.points}</Td>
                </Tr>
              );
            }) : (
              <Tr><Td colSpan={3} className="text-center text-text-muted py-8">No predictions for this race yet.</Td></Tr>
            )}
          </TableBody>
        </Table>
      </div>
    );
  };

  const renderMyStats = () => {
    if (!user) {
      return <p className="text-center text-text-muted py-8">Login to see your stats.</p>;
    }

    const filteredRaces = races.filter(r => r.year === currentSeason && r.result); 
    const chartData = filteredRaces.map(race => {
      const vote = userVotes.find(v => v.raceId === race.id);
      const points = calculatePoints(vote, race.result);
      return {
        name: race.name.split(' ')[0], 
        points: points,
      };
    });

    return (
      <div className="p-4 space-y-4">
        <h3 className="text-xl font-bold text-text-light uppercase">Points per Race</h3> 
        {chartData.length > 0 ? (
          <UserPointsChart data={chartData} userKeys={[{ key: 'points', name: user.email || '', color: '#E10600' }]} /> 
        ) : (
          <p className="text-center text-text-muted py-8">No finished races with votes to display stats for {currentSeason}.</p>
        )}
      </div>
    );
  };

  const renderCompareStats = () => {
    const filteredRaces = races.filter(r => r.year === currentSeason && r.result); 
    const colors = generateColors(selectedUsersForComparison.length);

    const chartData = filteredRaces.map(race => {
      const raceData: { name: string; [key: string]: string | number } = { name: race.name.split(' ')[0] };
      selectedUsersForComparison.forEach(uid => {
        const userVote = predictions.find(v => v.userId === uid && v.raceId === race.id);
        raceData[`${uid}_points`] = calculatePoints(userVote, race.result);
      });
      return raceData;
    });

    const userKeys = selectedUsersForComparison.map((uid, index) => {
      const user = allAppUsers.find(u => u.uid === uid);
      return {
        key: `${uid}_points`,
        name: (user as any)?.username || user?.email || 'Unknown User',
        color: colors[index],
      };
    });

    return (
      <div className="p-4 space-y-4">
        <h3 className="text-xl font-bold text-text-light uppercase mb-4">Compare User Performance</h3> 
        <div className="flex flex-wrap gap-2 mb-4"> 
          {allAppUsers.map(appUser => (
            <label key={appUser.uid} className="inline-flex items-center text-text-muted"> 
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-primary"
                checked={selectedUsersForComparison.includes(appUser.uid)}
                onChange={(e) => handleUserSelectionForComparison(appUser.uid, e.target.checked)}
              />
              <span className="ml-2">{(appUser as any).username || appUser.email}</span>
            </label>
          ))}
        </div>

        {selectedUsersForComparison.length > 0 && chartData.length > 0 ? (
          <UserPointsChart data={chartData} userKeys={userKeys} />
        ) : (
          <p className="text-center text-text-muted py-8">Select users to compare their stats for {currentSeason}.</p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
        <h1 className="text-4xl font-bold text-white text-center uppercase tracking-tight">Scoreboard</h1> 
        <div className="flex justify-center mb-4"> 
          <label htmlFor="scoreboard-season-select" className="text-text-muted mr-2">Select Season:</label>
          <Select
            id="scoreboard-season-select"
            value={String(currentSeason)}
            onChange={handleSeasonChange}
            className="w-32"
          >
            <option value={2026}>2026 (Active)</option>
          </Select>
        </div>
        <Card>
            <CardHeader className="p-0">
                <div className="flex flex-wrap space-x-2 px-6 pt-2">
                    {user && <TabButton isActive={activeTab === 'personal'} onClick={() => setActiveTab('personal')}>My Scores</TabButton>}
                    <TabButton isActive={activeTab === 'global'} onClick={() => setActiveTab('global')}>Global Leaderboard</TabButton>
                    <TabButton isActive={activeTab === 'raceDetails'} onClick={() => setActiveTab('raceDetails')}>Race Details</TabButton>
                    {user && <TabButton isActive={activeTab === 'myStats'} onClick={() => setActiveTab('myStats')}>My Stats</TabButton>}
                    <TabButton isActive={activeTab === 'compareStats'} onClick={() => setActiveTab('compareStats')}>Compare Stats</TabButton> 
                </div>
            </CardHeader>
            <CardContent className="p-0">
                {activeTab === 'personal' && user ? renderPersonalScoreboard() :
                 activeTab === 'global' ? renderGlobalLeaderboard() :
                 activeTab === 'raceDetails' ? renderRaceDetails() :
                 activeTab === 'myStats' ? renderMyStats() :
                 renderCompareStats()}
                {!user && activeTab === 'personal' && <p className="text-center text-text-muted py-8">Login to see your personal scoreboard.</p>}
            </CardContent>
        </Card>
    </div>
  );
}