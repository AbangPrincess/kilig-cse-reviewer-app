import { useEffect } from 'react';
import { useStore } from '../lib/store';
import { daysToExam, dueMistakes, ensurePlan, readiness, streak } from '../lib/progress';
import { todayKey } from '../lib/format';
import { NUM_TOPICS, SECTIONS } from '../data/topics';
import { DecoHeart, Icon } from '../components/Icons';
import { Ring } from '../components/Common';
import { TabBar } from '../components/TabBar';
import { href } from '../lib/router';

export function Home() {
  const { state, update } = useStore();
  useEffect(() => update(ensurePlan), [update]);

  const plan = (state.plan?.date === todayKey() ? state.plan : ensurePlan(state).plan)!;
  const topicName = NUM_TOPICS.find((t) => t.id === plan.topic)?.name ?? plan.topic;
  const answeredToday = state.days[todayKey()] ?? 0;
  const goal = state.profile.dailyGoal;
  const due = dueMistakes(state).length;
  const days = daysToExam(state);
  const st = streak(state);

  const stops = [
    { label: `Lesson: ${topicName}`, done: plan.lessonDone, to: `/lesson?topic=${plan.topic}` },
    { label: 'Practice 10 Questions', done: plan.practiceDone, to: `/practice?kind=topic&topic=${plan.topic}` },
    { label: due ? `Review ${due} Mistake${due === 1 ? '' : 's'}` : 'No Mistakes Due', done: plan.reviewDone || due === 0, to: '/practice?kind=review' },
  ];
  const next = stops.find((s) => !s.done);
  const cta = next
    ? { label: next === stops[0] ? 'Start the Lesson' : next === stops[1] ? 'Continue Practice' : 'Review Mistakes', to: next.to }
    : { label: 'Bonus: Quick Drill', to: '/practice?kind=quick' };

  const examText = days === null ? null : days > 1 ? `${days} Days to Exam` : days === 1 ? 'Exam Is Tomorrow!' : days === 0 ? 'Exam Day. Go Slay!' : 'Exam Date Has Passed';

  return (
    <>
      <main className="screen">
        <header className="between" style={{ alignItems: 'flex-start' }}>
          <div className="stack" style={{ gap: 4 }}>
            <span className="small muted" style={{ fontSize: 14, fontWeight: 500 }}>
              Hello There, Diva!{' '}
              {examText ? (
                <>· {examText}</>
              ) : (
                <a href={href('/me')} style={{ fontWeight: 700 }}>
                  · Set Your Exam Date
                </a>
              )}
            </span>
            <h1 className="h1" style={{ fontSize: 30 }}>
              {next ? "Ready for Today's Study Date?" : 'You Showed Up Today. Yieee!'}
            </h1>
          </div>
          <span className="pill pill-sun streak" aria-label={`${st}-day streak`}>
            <Icon name="heart" filled size={18} color="var(--rose)" />
            {st}
          </span>
        </header>

        <section className="hero stack" style={{ gap: 20 }} aria-label="Today's session">
          <DecoHeart size={210} color="var(--rose)" opacity={0.5} rotate={14} style={{ right: -56, top: -58 }} />
          <div className="row" style={{ gap: 18 }}>
            <Ring value={(answeredToday / goal) * 100} label={`${answeredToday} of ${goal} questions done today`}>
              <span className="display" style={{ fontSize: answeredToday >= 100 ? 20 : 24 }}>
                {answeredToday}/{goal}
              </span>
              <span style={{ fontSize: 11, color: '#f6c9d6' }}>Questions</span>
            </Ring>
            <div className="stack" style={{ gap: 9, minWidth: 0 }}>
              <span className="kicker" style={{ color: '#f6c9d6' }}>Today · About 25 Min</span>
              {stops.map((s) => (
                <a key={s.label} href={href(s.to)} className="stop" style={{ color: s.done ? 'var(--plum-dim)' : '#fff', fontWeight: s === next ? 700 : 500, textDecoration: 'none', fontSize: s === next ? 15 : 14 }}>
                  {s.done ? (
                    <span className="stop-dot" style={{ background: 'var(--sun)', color: 'var(--ink)' }}>
                      <Icon name="check" size={12} stroke={3} />
                    </span>
                  ) : (
                    <span className="stop-dot" style={{ border: s === next ? '5px solid var(--sun)' : '2px solid #9c7a93' }} />
                  )}
                  <span style={{ textDecoration: s.done ? 'line-through' : 'none' }}>{s.label}</span>
                </a>
              ))}
            </div>
          </div>
          <a href={href(cta.to)} className="btn btn-sun block" style={{ fontSize: 18 }}>
            {cta.label}
            <Icon name="arrow" size={20} stroke={2.5} />
          </a>
        </section>

        <section className="stack" aria-label="How ready you are">
          <div className="between">
            <h2 className="h2">How Ready You Are</h2>
            <span className="small muted" style={{ fontWeight: 600 }}>Goal: 80%</span>
          </div>
          <div className="tiles">
            {SECTIONS.map((sec) => {
              const r = readiness(state, sec.id);
              return (
                <a key={sec.id} href={href(`/learn?section=${sec.id}`)} className="tile" style={{ background: sec.color, color: sec.ink, boxShadow: `0 5px 0 ${sec.shade}`, justifyContent: sec.id === 'numerical' ? 'space-between' : 'flex-end' }}>
                  <DecoHeart size={104} color="#fff" opacity={sec.id === 'geninfo' ? 0.32 : 0.14} rotate={-14} style={{ right: -30, bottom: -34 }} />
                  {sec.id === 'numerical' && <span className="pill pill-white" style={{ alignSelf: 'flex-start' }}>TOP PRIORITY</span>}
                  <span className="stack" style={{ gap: 0 }}>
                    <span className="num">{r === null ? '—' : `${r}%`}</span>
                    <span className="name">{sec.short}</span>
                  </span>
                </a>
              );
            })}
          </div>
        </section>
      </main>
      <TabBar active="home" />
    </>
  );
}
