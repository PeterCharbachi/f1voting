import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import RaceCard from '../components/RaceCard';
import Select from '../components/ui/Select';
import React from 'react';

export default function Home() {
  const { currentUser: user } = useAuth();
  const { 
    races, 
    drivers, 
    loading, 
    currentSeason, 
    setCurrentSeason 
  } = useData();

  const handleSeasonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentSeason(Number(event.target.value));
  };

  const filteredRaces = races.filter(race => race.year === currentSeason);

  return (
    <div className="space-y-12">
      {/* Hero Section - F1 Inspired with Frosty Design */}
      <section className="relative bg-background-medium/70 backdrop-blur-md py-20 md:py-32 text-center overflow-hidden rounded-lg border border-background-light mx-4">
        <div className="relative z-10 container mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white uppercase leading-tight mb-4">
            Welcome, <span className="text-primary">{user?.username || 'Fan'}</span>!
          </h1>
          <p className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto">
            The <span className="text-primary">{currentSeason} Formula 1 season</span> is here. Place your predictions and compete for glory!
          </p>
        </div>
      </section>

      {/* Race Schedule Section */}
      <section className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h2 className="text-4xl font-bold text-white uppercase text-center md:text-left mb-4 md:mb-0">Race Schedule</h2>
          <div className="flex items-center space-x-2">
            <label htmlFor="season-select" className="text-text-muted">Select Season:</label>
            <Select
              id="season-select"
              value={String(currentSeason)}
              onChange={handleSeasonChange}
              className="w-32"
            >
              <option value={2026}>2026 (Active)</option>
            </Select>
          </div>
        </div>
        {loading ? (
          <div className="text-center">
            <p className="text-lg text-text-muted">Loading race data...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRaces.map(race => (
              <RaceCard key={race.id} race={race} drivers={drivers} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}