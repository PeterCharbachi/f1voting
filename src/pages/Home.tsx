import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import RaceCard from '../components/RaceCard';
import Select from '../components/ui/Select';
import { Skeleton } from '../components/ui/Skeleton';
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
    <div className="space-y-16 pb-20">
      {/* Advanced F1 Hero Section */}
      <section className="relative overflow-hidden glass-card rounded-none -mx-4 sm:-mx-6 lg:-mx-8 border-x-0 border-t-0 border-b-4 border-b-primary min-h-[400px] flex items-center">
        {/* Speed Lines Decoration */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-white to-transparent animate-speed-line" style={{ animationDelay: '0s' }}></div>
          <div className="absolute top-2/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent animate-speed-line" style={{ animationDelay: '0.5s', animationDuration: '1.5s' }}></div>
          <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-white to-transparent animate-speed-line" style={{ animationDelay: '1s', animationDuration: '2.5s' }}></div>
        </div>

        {/* Decorative Corner Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 0)' }}></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5" style={{ clipPath: 'polygon(0 0, 0 100%, 100% 100%)' }}></div>

        <div className="relative z-10 container mx-auto px-6 py-16 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl">
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-20 w-3/4 mx-auto md:mx-0" />
                <Skeleton className="h-8 w-1/2 mx-auto md:mx-0" />
              </div>
            ) : (
              <>
                <div className="inline-block bg-primary text-white text-xs font-black uppercase italic tracking-[0.3em] px-3 py-1 mb-6">
                  Officiell F1-tävling
                </div>
                <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-white uppercase leading-[0.85] mb-6 italic tracking-tighter">
                  Välkommen,<br />
                  <span className="text-primary drop-shadow-[0_0_15px_rgba(225,6,0,0.5)]">
                    {user?.username || 'F1-fan'}
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-text-light/80 max-w-xl font-medium leading-relaxed italic border-l-4 border-primary pl-6">
                  Säsongen <span className="text-white font-bold">{currentSeason}</span> är i full gång. Tippa resultaten, samla poäng och klättra i den globala ledartavlan!
                </p>
              </>
            )}
          </div>

          <div className="hidden lg:block relative group">
             {/* Fake F1 Data Graphics */}
             <div className="w-64 h-64 border-2 border-white/10 rounded-full flex items-center justify-center relative">
                <div className="absolute inset-0 border-t-2 border-primary rounded-full animate-spin duration-[3s]"></div>
                <div className="absolute inset-4 border border-dashed border-white/10 rounded-full"></div>
                <div className="text-center z-10">
                    <div className="text-4xl font-black italic text-white">{currentSeason}</div>
                    <div className="text-[10px] text-primary uppercase font-bold tracking-[0.2em]">Aktiv Säsong</div>
                    <div className="mt-2 flex justify-center gap-1">
                        <span className="w-1 h-1 bg-primary rounded-full animate-pulse"></span>
                        <span className="w-1 h-1 bg-primary rounded-full animate-pulse delay-75"></span>
                        <span className="w-1 h-1 bg-primary rounded-full animate-pulse delay-150"></span>
                    </div>
                </div>
                {/* HUD Elements */}
                <div className="absolute -top-4 -left-4 text-[8px] font-mono text-text-muted/50 uppercase">Data_Stream: Stable</div>
                <div className="absolute -bottom-4 -right-4 text-[8px] font-mono text-primary/50 uppercase tracking-widest italic">Live_Sync_2.4ms</div>
                
                {/* Dots on circles */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_#E10600]"></div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-full"></div>
             </div>
          </div>
        </div>
      </section>

      {/* Race Schedule Section */}
      <section className="container mx-auto px-4 sm:px-0">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 border-b-2 border-white/5 pb-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter mb-2">Tävlingskalender</h2>
            <div className="flex items-center gap-3">
               <div className="w-12 h-1 bg-primary"></div>
               <p className="text-text-muted font-bold uppercase tracking-widest text-xs">Fullständig överblick över loppen</p>
            </div>
          </div>
          
          <div className="flex flex-col items-start md:items-end gap-2">
            <label htmlFor="season-select" className="text-[10px] font-black uppercase tracking-widest text-text-muted">Välj säsong</label>
            <Select
              id="season-select"
              value={String(currentSeason)}
              onChange={handleSeasonChange}
              className="w-40"
            >
              <option value={2026}>2026 (Aktiv)</option>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="glass-card rounded-f1 p-6 space-y-4 border border-white/5">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/4" />
                <div className="space-y-2 pt-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRaces.map(race => (
              <RaceCard key={race.id} race={race} drivers={drivers} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
