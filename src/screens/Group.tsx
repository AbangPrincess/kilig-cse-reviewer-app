import { DecoHeart, Icon } from '../components/Icons';
import { BackLink } from '../components/Common';

export function Group() {
  return (
    <main className="screen bare">
      <BackLink to="/me" label="Me" />
      <section className="hero stack" style={{ background: 'var(--violet)', gap: 10, padding: 24 }}>
        <DecoHeart size={220} color="var(--sun)" opacity={0.35} rotate={12} style={{ right: -60, bottom: -70 }} />
        <span className="pill" style={{ background: '#fff', color: '#4c2a9e', fontSize: 12, fontWeight: 800, alignSelf: 'flex-start' }}>COMING AFTER SOLO MODE</span>
        <h1 className="h1" style={{ color: '#fff' }}>Group Study Date</h1>
        <p className="p" style={{ color: '#ede6ff' }}>
          Answer the same timed set with friends, then see who got what, and which questions broke everyone's heart.
        </p>
      </section>
      <div className="card stack">
        <div className="row"><Icon name="users" size={22} color="var(--violet)" /><span>Create a room and share a code</span></div>
        <div className="row"><Icon name="clock" size={22} color="var(--violet)" /><span>Everyone answers the same timed set</span></div>
        <div className="row"><Icon name="heart" size={22} color="var(--violet)" /><span>See the leaderboard and talk through the misses</span></div>
      </div>
      <p className="lead">Group study needs accounts so friends can join your room. It will be added once solo mode is finished.</p>
    </main>
  );
}
