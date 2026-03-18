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
    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px]">
        <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-gold flex items-center justify-center text-[7px] text-black font-black italic">01</span>
            <span className="font-bold text-text-light truncate">{drivers.find(d => d.id === prediction[0])?.name || '---'}</span>
        </div>
        <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-silver flex items-center justify-center text-[7px] text-black font-black italic">02</span>
            <span className="font-bold text-text-light truncate">{drivers.find(d => d.id === prediction[1])?.name || '---'}</span>
        </div>
        <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-bronze flex items-center justify-center text-[7px] text-black font-black italic">03</span>
            <span className="font-bold text-text-light truncate">{drivers.find(d => d.id === prediction[2])?.name || '---'}</span>
        </div>
        <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-primary flex items-center justify-center text-[7px] text-white font-black italic">PL</span>
            <span className="font-bold text-primary truncate">{drivers.find(d => d.id === prediction[3])?.name || '---'}</span>
        </div>
    </div>
);

const TabButton = ({ isActive, onClick, children }: { isActive: boolean, onClick: () => void, children: React.ReactNode }) => (
    <button 
        onClick={onClick} 
        className={`py-2 px-4 text-[10px] font-black uppercase italic tracking-widest transition-all duration-300 relative group ${isActive ? 'text-primary' : 'text-text-muted hover:text-white'}`}> 
        {children}
        <span className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-1/2'}`}></span>
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
                <Th>Lopp</Th>
                <Th>Din röst</Th>
                <Th>Resultat</Th>
                <Th className="text-center">Poäng</Th>
            </TableHeader>
            <TableBody>
                {finishedRaces.length > 0 ? finishedRaces.map((race) => {
                    const vote = userVotes.find(v => v.raceId === race.id);
                    const points = calculatePoints(vote, race.result);
                    return (
                        <Tr key={race.id}>
                            <Td className="font-semibold">{race.name}</Td>
                            <Td>{vote ? <PredictionDisplay prediction={vote.prediction} drivers={drivers} /> : <span className="text-text-muted">Ingen röst</span>}</Td>
                            <Td>{race.result ? <PredictionDisplay prediction={race.result} drivers={drivers} /> : 'N/A'}</Td>
                            <Td className="font-bold text-2xl text-center text-primary">{points}</Td>
                        </Tr>
                    );
                }) : (
                    <Tr><Td colSpan={4} className="text-center text-text-muted py-8">Inga avslutade lopp för {currentSeason} att visa.</Td></Tr>
                )}
            </TableBody>
        </Table>
    );
  };

  const [globalSearchTerm, setGlobalSearchTerm] = useState('');

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
        return { uid, username: (user as any)?.username || user?.email || 'Okänd användare', totalPoints };
      })
      .filter(entry => entry.username.toLowerCase().includes(globalSearchTerm.toLowerCase()))
      .sort((a, b) => b.totalPoints - a.totalPoints);

    return (
        <div className="space-y-4">
            <div className="px-6 py-4 border-b border-background-light">
                <input
                    type="text"
                    placeholder="Sök användare..."
                    value={globalSearchTerm}
                    onChange={(e) => setGlobalSearchTerm(e.target.value)}
                    className="w-full bg-background-light border border-background-light rounded-lg px-4 py-2 text-text-light focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
            </div>
            <Table>
                <TableHeader>
                    <Th className="text-center">Rank</Th>
                    <Th>Användare</Th>
                    <Th>Totala poäng</Th>
                </TableHeader>
                <TableBody>
                    {leaderboard.length > 0 ? leaderboard.map((entry, index) => (
                        <Tr key={entry.uid}>
                            <Td className="font-bold text-lg text-center">{index + 1}</Td>
                            <Td className="font-semibold">{entry.username}</Td>
                            <Td className="font-bold text-2xl text-primary">{entry.totalPoints}</Td>
                        </Tr>
                    )) : (
                        <Tr><Td colSpan={3} className="text-center text-text-muted py-8">Inga användare matchar "{globalSearchTerm}" för {currentSeason}.</Td></Tr>
                    )}
                </TableBody>
            </Table>
        </div>
    );
  };

  const renderRaceDetails = () => {
    const filteredRaces = races.filter(r => r.year === currentSeason); // Filter by currentSeason
    const selectedRace = filteredRaces.find(r => r.id === selectedRaceId);

    if (!selectedRace) {
      return <p className="text-center text-text-muted py-8">Vänligen välj ett lopp för {currentSeason}.</p>;
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
          <label htmlFor="race-select" className="text-text-muted">Välj lopp:</label>
          <Select
            id="race-select"
            value={selectedRaceId ?? ''}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedRaceId(e.target.value)}
            className="w-full max-w-xs"
          >
            <option value="" disabled>Välj ett lopp...</option>
            {filteredRaces.map(race => (
              <option key={race.id} value={race.id}>{race.name} ({race.date})</option>
            ))}
          </Select>
        </div>

        {selectedRace.result && (
          <Card className="bg-background-medium">
            <CardHeader>
              <CardTitle>Officiellt resultat: {selectedRace.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <PredictionDisplay prediction={selectedRace.result} drivers={drivers} />
            </CardContent>
          </Card>
        )}

        <h3 className="text-xl font-bold text-text-light uppercase mt-6">Användarnas tips & poäng</h3>
        <Table>
          <TableHeader>
            <Th>Användare</Th>
            <Th>Tips</Th>
            <Th className="text-center">Poäng</Th>
          </TableHeader>
          <TableBody>
            {userScoresForRace.length > 0 ? userScoresForRace.map((entry) => {
              const user = allAppUsers.find(u => u.uid === entry.userId);
              return (
                <Tr key={entry.userId} className={entry.points === maxPoints && maxPoints > 0 ? 'bg-primary/20' : ''}> 
                  <Td className="font-semibold">{(user as any)?.username || user?.email || 'Okänd användare'} {entry.points === maxPoints && maxPoints > 0 && <span className="text-primary">(Vinnare)</span>}</Td>
                  <Td><PredictionDisplay prediction={entry.prediction} drivers={drivers} /></Td>
                  <Td className="font-bold text-lg text-center text-primary">{entry.points}</Td>
                </Tr>
              );
            }) : (
              <Tr><Td colSpan={3} className="text-center text-text-muted py-8">Inga tips för detta lopp än.</Td></Tr>
            )}
          </TableBody>
        </Table>
      </div>
    );
  };

  const renderMyStats = () => {
    if (!user) {
      return <p className="text-center text-text-muted py-8">Logga in för att se din statistik.</p>;
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
        <h3 className="text-xl font-bold text-text-light uppercase">Poäng per lopp</h3> 
        {chartData.length > 0 ? (
          <UserPointsChart data={chartData} userKeys={[{ key: 'points', name: user.email || '', color: '#E10600' }]} /> 
        ) : (
          <p className="text-center text-text-muted py-8">Inga avslutade lopp med röster att visa statistik för för {currentSeason}.</p>
        )}
      </div>
    );
  };

  const renderCompareStats = () => {
    const filteredRaces = races.filter(r => r.year === currentSeason && r.result); 
    const colors = generateColors(allAppUsers.length); // Use allAppUsers length for consistent colors

    const chartData = filteredRaces.map(race => {
      const raceData: { name: string; [key: string]: string | number } = { name: race.name.split(' ')[0] };
      selectedUsersForComparison.forEach(uid => {
        const userVote = predictions.find(v => v.userId === uid && v.raceId === race.id);
        raceData[`${uid}_points`] = calculatePoints(userVote, race.result);
      });
      return raceData;
    });

    const userKeys = selectedUsersForComparison.map((uid) => {
      const user = allAppUsers.find(u => u.uid === uid);
      const userIndex = allAppUsers.findIndex(u => u.uid === uid);
      return {
        key: `${uid}_points`,
        name: (user as any)?.username || user?.email || 'Okänd användare',
        color: colors[userIndex],
      };
    });

    return (
      <div className="p-4 space-y-6">
        <div className="bg-white/5 p-4 border border-white/5">
            <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-4 italic">Välj användare för jämförelse</h3> 
            <div className="flex flex-wrap gap-4"> 
              {allAppUsers.map((appUser, index) => {
                const isSelected = selectedUsersForComparison.includes(appUser.uid);
                return (
                    <label key={appUser.uid} className={`inline-flex items-center cursor-pointer transition-all p-2 border ${isSelected ? 'bg-primary/5 border-primary/30' : 'bg-white/5 border-transparent hover:border-white/10'}`}> 
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={isSelected}
                        onChange={(e) => handleUserSelectionForComparison(appUser.uid, e.target.checked)}
                      />
                      <div className={`w-3 h-3 rounded-full mr-2 ${isSelected ? '' : 'opacity-20'}`} style={{ backgroundColor: colors[index] }}></div>
                      <span className={`text-[10px] font-bold uppercase tracking-tight ${isSelected ? 'text-white' : 'text-text-muted'}`}>
                        {(appUser as any).username || appUser.email.split('@')[0]}
                      </span>
                    </label>
                );
              })}
            </div>
        </div>

        {selectedUsersForComparison.length > 0 && chartData.length > 0 ? (
          <div className="bg-background-dark/50 p-6 border border-white/5">
            <UserPointsChart data={chartData} userKeys={userKeys} />
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-white/10">
            <p className="text-[10px] text-text-muted uppercase font-bold italic tracking-widest">Välj minst en användare för att se statistik</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
        <h1 className="text-4xl font-bold text-white text-center uppercase tracking-tight italic">Poängtavla</h1> 
        <div className="flex justify-center mb-4"> 
          <label htmlFor="scoreboard-season-select" className="text-text-muted mr-2">Välj säsong:</label>
          <Select
            id="scoreboard-season-select"
            value={String(currentSeason)}
            onChange={handleSeasonChange}
            className="w-32"
          >
            <option value={2026}>2026 (Aktiv)</option>
          </Select>
        </div>
        <Card>
            <CardHeader className="p-0 overflow-x-auto no-scrollbar">
                <div className="flex flex-nowrap px-6 pt-2 gap-x-2 min-w-max">
                    {user && <TabButton isActive={activeTab === 'personal'} onClick={() => setActiveTab('personal')}>Mina poäng</TabButton>}
                    <TabButton isActive={activeTab === 'global'} onClick={() => setActiveTab('global')}>Global ledartavla</TabButton>
                    <TabButton isActive={activeTab === 'raceDetails'} onClick={() => setActiveTab('raceDetails')}>Loppdetaljer</TabButton>
                    {user && <TabButton isActive={activeTab === 'myStats'} onClick={() => setActiveTab('myStats')}>Min statistik</TabButton>}
                    <TabButton isActive={activeTab === 'compareStats'} onClick={() => setActiveTab('compareStats')}>Jämför statistik</TabButton> 
                </div>
            </CardHeader>
            <CardContent className="p-0">
                {activeTab === 'personal' && user ? renderPersonalScoreboard() :
                 activeTab === 'global' ? renderGlobalLeaderboard() :
                 activeTab === 'raceDetails' ? renderRaceDetails() :
                 activeTab === 'myStats' ? renderMyStats() :
                 renderCompareStats()}
                {!user && activeTab === 'personal' && <p className="text-center text-text-muted py-8">Logga in för att se din personliga poängtavla.</p>}
            </CardContent>
        </Card>
    </div>
  );
}