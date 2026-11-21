import { useState } from 'react';
import { useStore } from '../lib/store';
import { Icon } from '../components/Icons';
import { go } from '../lib/router';

export function Welcome() {
  const { update } = useStore();
  const [date, setDate] = useState('');

  const finish = (diagnostic: boolean) => {
    update((s) => ({ ...s, profile: { ...s.profile, examDate: date || s.profile.examDate, onboarded: true } }));
    go(diagnostic ? '/practice?kind=diagnostic' : '/');
  };

  return (
    <main className="screen bare" style={{ gap: 20 }}>
      <section className="hero stack" style={{ gap: 14, padding: 26, borderRadius: 32, minHeight: 330, justifyContent: 'flex-end' }}>
        <Icon name="heart" filled size={180} color="var(--rose)" style={{ position: 'absolute', right: -40, top: -40, opacity: 0.5 }} />
        <Icon name="heart" filled size={70} color="var(--sun)" style={{ position: 'absolute', right: 120, top: 22, opacity: 0.9 }} />
        <span className="kicker" style={{ color: 'var(--sun)' }}>Kilig CSE Reviewer</span>
        <h1 className="h1" style={{ color: '#fff', fontSize: 36 }}>Fall in Love with the Civil Service Exam.</h1>
        <p className="p" style={{ color: 'var(--plum-ink)' }}>Professional level. Lessons with love analogies, endless Numerical practice, and full mock exams.</p>
      </section>

      <div className="field">
        <label htmlFor="exam-date">When Is Your Exam? (Optional)</label>
        <input id="exam-date" className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <span className="small muted">You can change this later in Me.</span>
      </div>

      <div className="card stack" style={{ gap: 6 }}>
        <span style={{ fontWeight: 800, fontSize: 17 }}>Start with a 40-Item Diagnostic</span>
        <span className="small muted" style={{ fontSize: 14 }}>
          About 40 minutes, all four sections. No answers are shown until the end. It finds your weak spots so your daily plan starts with them.
        </span>
      </div>

      <div className="stack" style={{ marginTop: 'auto' }}>
        <button type="button" className="btn btn-rose block" onClick={() => finish(true)}>Take the Diagnostic</button>
        <button type="button" className="btn btn-ghost block" onClick={() => finish(false)}>Skip for Now</button>
      </div>
    </main>
  );
}
