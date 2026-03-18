import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

export default function Info() {
  return (
    <div className="space-y-12 pb-20">
      {/* Header Section */}
      <section className="text-center space-y-4 pt-8">
        <h1 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter leading-none">
          Race <span className="text-primary drop-shadow-[0_0_10px_rgba(225,6,0,0.4)]">Intelligence</span>
        </h1>
        <div className="flex items-center justify-center gap-4">
          <div className="h-px w-12 bg-primary"></div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Systemdokumentation & Regler</p>
          <div className="h-px w-12 bg-primary"></div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 sm:px-0">
        <Card className="relative overflow-hidden group">
            <div className="hud-corner top-0 left-0 border-t-2 border-l-2"></div>
            <div className="hud-corner top-0 right-0 border-t-2 border-r-2"></div>
            <CardHeader>
                <CardTitle className="text-2xl italic uppercase font-black tracking-tighter">Välkommen till F1VOTE</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-text-light font-medium leading-relaxed italic"> 
                <p className="border-l-2 border-primary/30 pl-4">Denna applikation låter dig förutsäga pallen (topp 3 förare) och Pole Position för varje Formel 1 Grand Prix. Tävla med dina vänner och andra användare för att se vem som har bäst F1-kunskap!</p>
                <p className="border-l-2 border-white/10 pl-4">Du kan skicka in dina tips för kommande lopp på Hemsidan. När ett lopp är avslutat och de officiella resultaten är klara kan du se din poäng och den globala ledartavlan på sidan för Poängtavla.</p>
            </CardContent>
        </Card>

        <Card className="relative overflow-hidden group border-primary/20">
            <div className="hud-corner top-0 left-0 border-t-2 border-l-2 border-primary"></div>
            <div className="hud-corner bottom-0 right-0 border-b-2 border-r-2 border-primary"></div>
            <CardHeader>
                <CardTitle className="text-2xl italic uppercase font-black tracking-tighter text-primary">Poängsystem</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6"> 
                <div className="grid grid-cols-2 gap-4">
                    {[
                        { label: 'P1 - VINNARE', pts: 10, color: 'bg-gold' },
                        { label: 'P2 - TVÅA', pts: 8, color: 'bg-silver' },
                        { label: 'P3 - TREA', pts: 5, color: 'bg-bronze' },
                        { label: 'POLE POSITION', pts: 5, color: 'bg-primary' }
                    ].map(item => (
                        <div key={item.label} className="bg-white/5 p-3 border border-white/5 relative group/item">
                            <div className="text-[8px] font-black text-text-muted mb-1 uppercase tracking-widest">{item.label}</div>
                            <div className="text-2xl font-black italic text-white flex items-baseline gap-1">
                                +{item.pts} <span className="text-[10px] text-primary">PTS</span>
                            </div>
                            <div className={`absolute left-0 top-0 w-1 h-full ${item.color}`}></div>
                        </div>
                    ))}
                </div>

                <div className="bg-primary/5 p-4 border border-primary/20 relative">
                    <div className="text-[8px] font-black text-primary mb-2 uppercase tracking-[0.2em]">PALL-BONUS</div>
                    <p className="text-xs font-bold text-text-light italic">För varje förare du tippat på pallen som slutar på pallen (men på fel plats) får du <span className="text-primary">+3 PTS</span>.</p>
                </div>
            </CardContent>
        </Card>

        <Card className="lg:col-span-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-full bg-primary/5 -skew-x-12 translate-x-16"></div>
            <CardHeader>
                <CardTitle className="text-2xl italic uppercase font-black tracking-tighter">Exempelberäkning</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-4">
                        <div className="flex gap-4 items-center">
                            <div className="flex-1 bg-white/5 p-3 border-l-2 border-white/20">
                                <div className="text-[8px] font-bold text-text-muted uppercase mb-1">DITT TIPS</div>
                                <div className="text-[10px] font-black text-white italic">VER, PER, LEC | POLE: VER</div>
                            </div>
                            <div className="text-primary font-black italic">VS</div>
                            <div className="flex-1 bg-primary/5 p-3 border-l-2 border-primary">
                                <div className="text-[8px] font-bold text-primary uppercase mb-1">RESULTAT</div>
                                <div className="text-[10px] font-black text-white italic">VER, SAI, PER | POLE: LEC</div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        {[
                            { label: 'VER (1:a) - Rätt position', pts: 10, success: true },
                            { label: 'PER (2:a) - På pallen (3:e), men fel plats', pts: 3, success: true },
                            { label: 'LEC (3:e) - Inte på pallen', pts: 0, success: false },
                            { label: 'VER (Pole) - Fel förare', pts: 0, success: false }
                        ].map((row, i) => (
                            <div key={i} className="flex justify-between items-center text-[10px] border-b border-white/5 pb-1">
                                <span className={`font-bold ${row.success ? 'text-text-light' : 'text-text-muted italic'}`}>{row.label}</span>
                                <span className={`font-black ${row.pts > 0 ? 'text-primary' : 'text-text-muted'}`}>+{row.pts} PTS</span>
                            </div>
                        ))}
                        <div className="flex justify-between items-center pt-2 border-t border-white/10 mt-2">
                            <span className="text-xs font-black uppercase italic text-white">Total Poäng</span>
                            <span className="text-2xl font-black italic text-primary drop-shadow-[0_0_8px_rgba(225,6,0,0.4)]">13 PTS</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-dashed border-white/10 bg-transparent">
            <CardHeader>
                <CardTitle className="text-xl italic uppercase font-black tracking-tighter opacity-60">Admin-behörighet</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-xs text-text-muted font-bold italic">Användare med admin-roll kan hantera konton, uppdatera röster manuellt och fastställa officiella tävlingsresultat via kontrollpanelen.</p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
