import { useEffect, useState } from 'react';
import { useStore } from '../lib/store';
import { markPlan, setLevel } from '../lib/progress';
import { LESSONS, type LessonCard } from '../data/lessons';
import { topicById } from '../data/topics';
import { Icon } from '../components/Icons';
import { Rich } from '../components/Common';
import { href } from '../lib/router';

export function Lesson({ topic }: { topic: string }) {
  const { update } = useStore();
  const lesson = LESSONS[topic];
  const info = topicById(topic);
  const name = info?.name ?? topic;
  const backTo = `/learn?section=${info?.section ?? 'numerical'}`;
  const [step, setStep] = useState(0);
  const total = (lesson?.cards.length ?? 0) + 1;
  const last = total - 1;

  useEffect(() => {
    if (step === last && lesson) update((s) => markPlan(setLevel(s, topic, 1), { lessonDone: true }, topic));
  }, [step, last, lesson, topic, update]);

  if (!lesson) {
    return (
      <main className="screen bare">
        <p>That lesson was not found.</p>
        <a href={href('/learn')}>Back to Learn</a>
      </main>
    );
  }

  const card = lesson.cards[step];

  return (
    <main className="lesson">
      <div className="row">
        <a href={href(backTo)} className="icon-btn" aria-label="Close lesson">
          <Icon name="x" size={22} stroke={2.2} />
        </a>
        <div className="progress-bars" style={{ gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))` }} role="progressbar" aria-label="Lesson progress" aria-valuemin={1} aria-valuemax={total} aria-valuenow={step + 1}>
          {Array.from({ length: total }, (_, i) => (
            <span key={i} className={i <= step ? 'on' : undefined} />
          ))}
        </div>
      </div>

      {step < last ? <Card card={card} topicName={name} first={step === 0} /> : <ReadyCard topic={topic} />}

      <div className="row" style={{ gap: 10 }}>
        {step > 0 && (
          <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setStep(step - 1)}>
            Back
          </button>
        )}
        {step < last && (
          <button type="button" className="btn btn-rose" style={{ flex: 2 }} onClick={() => setStep(step + 1)}>
            Next
          </button>
        )}
      </div>
    </main>
  );
}

function Card({ card, topicName, first }: { card: LessonCard; topicName: string; first: boolean }) {
  const kickerColor = card.kind === 'love' ? 'var(--sun)' : card.kind === 'rule' ? 'var(--rose-dark)' : card.kind === 'trap' ? 'var(--wrong-ink)' : 'var(--rose)';
  return (
    <section className={`lcard ${card.kind}`} aria-live="polite">
      {card.kind === 'love' && (
        <>
          <Icon name="heart" filled size={190} color="var(--rose)" style={{ position: 'absolute', right: -40, bottom: -30, opacity: 0.55 }} />
          <Icon name="heart" filled size={110} color="var(--sun)" style={{ position: 'absolute', right: 90, bottom: 40, opacity: 0.85 }} />
        </>
      )}
      <span className="kicker row" style={{ color: kickerColor, gap: 8, fontSize: 13 }}>
        {card.kind === 'trap' && <Icon name="broken" size={20} stroke={2.2} />}
        {first && card.kind === 'love' ? `${topicName} · ${card.kicker}` : card.kicker}
      </span>
      <h1>{card.title}</h1>
      {card.wrong && (
        <div className="wrong-work">
          <span>{card.wrong}</span>
          <Icon name="x" size={26} stroke={2.6} color="var(--wrong)" />
        </div>
      )}
      {card.body?.map((p) => (
        <p key={p}>
          <Rich text={p} />
        </p>
      ))}
      {card.bars && (
        <div className="bars">
          {card.bars.map((b) => (
            <div key={b.label} className="stack" style={{ gap: 6 }}>
              <div className="between" style={{ fontSize: 15, fontWeight: b.strong ? 800 : 500 }}>
                <span style={{ fontWeight: b.strong ? 800 : 700 }}>{b.label}</span>
                <span>{b.value}</span>
              </div>
              <div className="bar-cells" style={{ gridTemplateColumns: `repeat(${b.total}, minmax(0, 1fr))` }}>
                {Array.from({ length: b.total }, (_, i) => (
                  <i key={i} className={b.cells[i] ? `c${b.cells[i]}` : undefined} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      {card.barsNote && (
        <p>
          <Rich text={card.barsNote} />
        </p>
      )}
      {card.example && (
        <div className="example">
          <span className="kicker" style={{ color: 'var(--rose)' }}>Example</span>
          <strong style={{ fontSize: 16 }}>{card.example.q}</strong>
          {card.example.steps.map((s, i) => (
            <span key={s} style={{ fontSize: 15 }}>
              {i + 1}. {s}
            </span>
          ))}
          <span style={{ fontWeight: 800, color: 'var(--mint)' }}>Answer: {card.example.answer}</span>
        </div>
      )}
      {card.formula && (
        <div className="formula">
          <span className="f">{card.formula}</span>
          {card.formulaNote && <span className="small muted" style={{ fontSize: 14 }}>{card.formulaNote}</span>}
        </div>
      )}
      {card.shortcut && (
        <div className="shortcut">
          <span className="kicker">
            <Icon name="bolt" size={16} stroke={2.2} />
            {card.shortcut.title}
          </span>
          {card.shortcut.lines.map((l, i) => (
            <span key={l} style={{ fontSize: i === 0 ? 18 : 15, fontWeight: i === 0 ? 800 : 500, color: i === 0 ? '#fff' : 'var(--plum-ink)' }}>
              {l}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}

function ReadyCard({ topic }: { topic: string }) {
  return (
    <section className="lcard ready">
      <Icon name="heart" filled size={220} color="#fff" style={{ position: 'absolute', right: -30, top: -30, opacity: 0.45 }} />
      <span className="kicker">You've Got This</span>
      <h1>Ready to Try One?</h1>
      <p>10 guided questions. Hints are there if you need them. You're now at <strong>Crush</strong> with this topic.</p>
      <a href={href(`/practice?kind=topic&topic=${topic}`)} className="btn btn-ink block" style={{ fontSize: 18 }}>
        Start Practice
      </a>
    </section>
  );
}
